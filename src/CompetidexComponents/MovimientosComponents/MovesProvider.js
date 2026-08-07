//** src\CompetidexComponents\MovimientosComponents\MovesProvider.js

import React, {
  createContext, useContext, useMemo, useRef, useEffect, useCallback, useState
} from "react";
import { POKEAPI, COMPETIDEX_DATA } from "../../config/endpoints";
import {
  getGroupVersionMeta,
  getGroupVersionOrder
} from "../../utils/competidexMeta";
import {
  isMovesPersistenceEnabled,
  setMovesPersistenceEnabled,
  loadMovesPersistentCaches,
  saveMovesPersistentCaches,
  clearMovesPersistentCaches
} from "./moveCache";

const MovesContext = createContext(null);

// Cache version (frontend)
const CACHE_VERSION = "v1";

// Index + warm cache (sessionStorage)
const KEY_INDEX = `moves:index:${CACHE_VERSION}`;
const KEY_INDEX_AT = `moves:indexAt:${CACHE_VERSION}`;
const KEY_WARM = `moves:warm:${CACHE_VERSION}`;
const KEY_MACH = `moves:machineCache:${CACHE_VERSION}`;

// Cache RAW (JSON completo de PokeAPI) en sessionStorage (NO se persiste a localStorage)
const KEY_RAW = `moves:raw:${CACHE_VERSION}`;

//** Json con todos los Movimientos Pokémon para el buscador, posee esta forma:
/*
  {
    "mega-punch": {
      "id": 5,
      "display": "Megapuño",
      "type": "normal",
      "damage_class": "physical",
      "isContact": true
    },
    "pay-day": {
      "id": 6,
      "display": "Día de Pago",
      "type": "normal",
      "damage_class": "physical",
      "isContact": true
    },
    "fire-punch": {
      "id": 7,
      "display": "Puño Fuego",
      "type": "fire",
      "damage_class": "physical",
      "isContact": true     
    },
    ...
  }
*/

// Cache manifest + moves map (localStorage)
const KEY_MANIFEST = `moves:manifest:${CACHE_VERSION}`;
const KEY_MANIFEST_AT = `moves:manifestAt:${CACHE_VERSION}`;

const KEY_ESMAP = `moves:esMap:${CACHE_VERSION}`;
const KEY_ESMAP_AT  = `moves:esMapAt:${CACHE_VERSION}`;
const KEY_MANIFEST_VERSION = `moves:manifestVersion:${CACHE_VERSION}`;

// Para detectar cambio de URL aunque la "version" sea igual
const KEY_LAST_ESMAP_URL = `moves:lastEsMapUrl:${CACHE_VERSION}`;

// TTLs
const INDEX_TTL_MS = 1000 * 60 * 60 * 24; // 24h (solo para session)
const MANIFEST_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

// Persistencia (index/warm/machine/raw en session)
const saveIndex = (list) => { try { sessionStorage.setItem(KEY_INDEX, JSON.stringify(list)); } catch {} };
const loadIndex = () => { try { return JSON.parse(sessionStorage.getItem(KEY_INDEX) || "null"); } catch { return null; } };

const saveIndexAt = (ts) => { try { sessionStorage.setItem(KEY_INDEX_AT, String(ts)); } catch {} };
const loadIndexAt = () => { try { const v = sessionStorage.getItem(KEY_INDEX_AT); return v ? Number(v) : null; } catch { return null; } };

const saveWarm = (map) => { try { sessionStorage.setItem(KEY_WARM, JSON.stringify(Array.from(map.entries()))); } catch {} };
const loadWarm = () =>
{
  try
  {
    const raw = sessionStorage.getItem(KEY_WARM);
    if (!raw) return null;
    return new Map(JSON.parse(raw));

  } catch { return null; }

};

const saveMachineCache = (map) => { try { sessionStorage.setItem(KEY_MACH, JSON.stringify(Array.from(map.entries()))); } catch {} };
const loadMachineCache = () =>
{
  try
  {
    const raw = sessionStorage.getItem(KEY_MACH);
    if (!raw) return null;
    return new Map(JSON.parse(raw));

  } catch { return null; }
};

// persistencia RAW (session)
const saveRaw = (map) => { try { sessionStorage.setItem(KEY_RAW, JSON.stringify(Array.from(map.entries()))); } catch {} };
const loadRaw = () =>
{
  try
  {
    const raw = sessionStorage.getItem(KEY_RAW);
    if (!raw) return null;
    return new Map(JSON.parse(raw));

  } catch { return null; }
};

// Persistencia (manifest + esMap en localStorage) => dura entre sesiones
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const loadLS = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } };
const saveTS = (k, ts) => { try { localStorage.setItem(k, String(ts)); } catch {} };
const loadTS = (k) => { try { const v = localStorage.getItem(k); return v ? Number(v) : null; } catch { return null; } };

// -------- Funciones Auxiliares -------- 
function moveKey(nameOrId)
{
  if (typeof nameOrId === "string") return nameOrId.trim().toLowerCase();
  return String(nameOrId);
}

function getMoveDisplayEsFromRaw(raw, fallbackKey = "")
{
  const esName = (raw && Array.isArray(raw.names))
    ? (raw.names.find(n => n && n.language && n.language.name === "es")?.name || "")
    : "";

  const display = String(esName || "").trim();
  if (display) return display;

  return String(fallbackKey || "").trim();
}

function normalizeMoveMachineInfo(machineInfo)
{
  if(!machineInfo || typeof machineInfo !== "object") return null;

  const machine = String(machineInfo.machine || "").trim();
  const machine_es = String(machineInfo.machine_es || "").trim();

  return {
    machine: machine || null,
    machine_es: machine_es || null
  };
}

function getMoveSummaryFromMapEntry(apiKey, entry)
{
  if(!apiKey || !entry) return null;

  const machinesByGroup = {};
  if(entry.machinesByGroup && typeof entry.machinesByGroup === "object")
  {
    for(const [groupKey, machineInfo] of Object.entries(entry.machinesByGroup))
    {
      const normalized = normalizeMoveMachineInfo(machineInfo);
      if(normalized) machinesByGroup[groupKey] = normalized;
    }
  }

  const isContact =
    entry.isContact === true
      ? true
      : entry.isContact === false
        ? false
        : null;

  return {
    key: apiKey,
    id: typeof entry.id === "number" ? entry.id : null,
    api_name: apiKey,
    name: apiKey,
    display_es: String(entry.display || apiKey).trim() || apiKey,
    display: String(entry.display || apiKey).trim() || apiKey,
    type: entry.type ?? null,
    damage_class: entry.damage_class ?? null,
    power: entry.power ?? null,
    accuracy: entry.accuracy ?? null,
    pp: entry.pp ?? null,
    isContact,
    machinesByGroup,
    machines_by_group: machinesByGroup,
    machine_codes_by_group: Object.fromEntries(
      Object.entries(machinesByGroup).map(([groupKey, machineInfo]) => [groupKey, machineInfo?.machine || null])
    ),
    machine_codes_es_by_group: Object.fromEntries(
      Object.entries(machinesByGroup).map(([groupKey, machineInfo]) => [groupKey, machineInfo?.machine_es || null])
    ),
  };
}

function getMoveSummaryByKeyFromMap(esMapObj, nameOrId)
{
  const key = moveKey(nameOrId);
  if(!key) return null;

  const entry = (esMapObj && typeof esMapObj === "object") ? esMapObj[key] : null;
  if(!entry) return null;

  return getMoveSummaryFromMapEntry(key, entry);
}

export async function getMoveRawFromProvider(nameOrId)
{
  const key = moveKey(nameOrId);
  if (!key) throw new Error("Movimiento inválido");

  const res = await fetch(POKEAPI.move(key));
  if (!res.ok) throw new Error(`No se encontró movimiento: ${key}`);

  return res.json();
}

function formatMachineCodeES(code = "")
{
  const m = String(code).toLowerCase().match(/^(tm|hm|tr)(\d+)$/);
  if (!m) return (code && code.toUpperCase) ? code.toUpperCase() : code;
  const prefix = m[1] === "tm" ? "MT" : (m[1] === "hm" ? "MO" : "DT");
  return prefix + m[2];
}

function machineIdFromUrl(url = "")
{
  const parts = String(url).split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

function needsRefresh(summary)
{
  return (
    !summary ||
    summary.machine_urls_by_group === undefined ||
    summary.machines_by_group === undefined
  );
}

function normText(s)
{
  return String(s || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function slugifyForUrl(s)
{
  let t = normText(s);
  t = t.replace(/[\s\-]+/g, "_");
  t = t.replace(/[^a-z0-9_]/g, "");
  t = t.replace(/_+/g, "_");
  t = t.replace(/^_+|_+$/g, "");
  return t;
}

function normalizeInputForLookup(s)
{
  let t = normText(s);
  t = t.replace(/[\s_\-]+/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

// Arma index desde esMap
function buildIndexFromEsMap(esMapObj)
{
  const keys = Object.keys(esMapObj || {});
  keys.sort((a, b) => a.localeCompare(b));

  return keys.map((name) => ({ name, url: POKEAPI.move(name) }));
}

// Resumen del movimiento (incluye URLs de machines por versión)
function summarizeMove(mv, esMapObj)
{
  let esName = (mv.names || []).find(n => n.language?.name === "es")?.name || null;

  const esEntry = (esMapObj && mv && mv.name) ? esMapObj[mv.name] : null;
  if (!esName && esEntry && esEntry.display) esName = esEntry.display;

  const machine_urls_by_group = {};
  for(const det of (mv.machines || []))
  {
    const vg  = det.version_group?.name;
    const url = det.machine?.url;
    if (vg && url) machine_urls_by_group[vg] = url;
  }

  const type = (mv.type && mv.type.name) ? mv.type.name : (esEntry ? esEntry.type : null);
  const damage_class = (mv.damage_class && mv.damage_class.name) ? mv.damage_class.name : (esEntry ? esEntry.damage_class : null);

  return {
    key: mv.name,
    api_name: mv.name,
    display_es: esName,
    name: mv.name,
    type: type ?? null,
    damage_class: damage_class ?? null,
    power: mv.power ?? null,
    accuracy: mv.accuracy ?? null,
    pp: mv.pp ?? null,
    priority: mv.priority ?? 0,
    target: mv.target?.name ?? null,

    machine_urls_by_group,
    machines_by_group: {}
  };

}

function reduceSummaryForPersist(summary)
{
  if (!summary) return null;
  
  return {
    key: summary.key,
    name: summary.name,
    api_name: summary.api_name,
    display_es: summary.display_es,

    type: summary.type ?? null,
    damage_class: summary.damage_class ?? null,
    power: summary.power ?? null,
    accuracy: summary.accuracy ?? null,
    pp: summary.pp ?? null,

    machine_urls_by_group: summary.machine_urls_by_group || {},
    machines_by_group: summary.machines_by_group || {}
  };

}

// cache-bust SOLO para manifest
function manifestUrlNoCache()
{
  return COMPETIDEX_DATA.movesManifest + "?v=" + Date.now();
}

//** Provider js de todos los Movimientos Pokémon
export function MovesProvider({ children, preloadCount = 0, warmConcurrency = 6, learnsetConcurrency = 6, machineConcurrency = 6 })
{
  const cache = useRef(new Map());
  const machineCache = useRef(new Map());
  const rawCache = useRef(new Map()); // RAW JSON por movimiento (session/mem)
  const refreshResolverRef = useRef(null);

  const esMapRef = useRef(null);
  const [esMapReady, setEsMapReady] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const esToKeyRef = useRef(new Map());
  const slugToKeyRef = useRef(new Map());
  const keyToSlugRef = useRef(new Map());
  const keyToDisplayRef = useRef(new Map());
  const keyToContactRef = useRef(new Map());

  const syncMoveDisplayFromRaw = useCallback((key, raw) =>
  {
    const moveKeyNorm = moveKey(key);
    if (!moveKeyNorm) return null;

    const display = getMoveDisplayEsFromRaw(raw, moveKeyNorm);
    if (!display) return null;

    keyToDisplayRef.current.set(moveKeyNorm, display);

    if (cache.current.has(moveKeyNorm))
    {
      const cached = cache.current.get(moveKeyNorm) || {};
      if (!cached.display_es || cached.display_es === moveKeyNorm)
      {
        cached.display_es = display;
        cache.current.set(moveKeyNorm, cached);
        saveWarm(cache.current);
      }
    }

    return display;

  }, []);

  const getMoveContactByKey = useCallback((nameOrId) =>
  {
    const key = moveKey(nameOrId);
    if(!key) return null;

    if(keyToContactRef.current.has(key))
    {
      return keyToContactRef.current.get(key);
    }

    const esEntry = (esMapRef.current && esMapRef.current[key]) ? esMapRef.current[key] : null;
    if(!esEntry || esEntry.isContact === undefined || esEntry.isContact === null)
    {
      return null;
    }

    const val = esEntry.isContact === true ? true : (esEntry.isContact === false ? false : null);
    keyToContactRef.current.set(key, val);

    return val;

  }, []);

  // Persistencia reducida en localStorage (toggle)
  const [persistEnabled, setPersistEnabled] = useState(() =>
  {
    try { return isMovesPersistenceEnabled(); } catch { return false; }
  });

  const persistEnabledRef = useRef(persistEnabled);
  useEffect(() =>
  {
    persistEnabledRef.current = persistEnabled;

  }, [persistEnabled]);

  const persistTimerRef = useRef(null);
  const forceManifestRefreshRef = useRef(false);

  // Guardado con MERGE + chequeo ref
  const schedulePersist = useCallback(() =>
  {
    if (!persistEnabledRef.current) return;

    try
    {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);

      persistTimerRef.current = setTimeout(() =>
      {
        if (!persistEnabledRef.current) return; // Si se desactivó mientras esperaba, no guardo

        // 1) Armo lo nuevo desde memoria (reducido)
        const reducedWarm = new Map();
        cache.current.forEach((v, k) => {
          const r = reduceSummaryForPersist(v);
          if (r) reducedWarm.set(k, r);
        });

        // 2) Merge con lo que YA existe en localStorage
        let mergedWarm = reducedWarm;
        let mergedMachines = machineCache.current;

        try
        {
          const persisted = loadMovesPersistentCaches();

          if(persisted && persisted.warmReduced)
          {
            mergedWarm = new Map(persisted.warmReduced);
            reducedWarm.forEach((v, k) => mergedWarm.set(k, v));
          }

          if(persisted && persisted.machines)
          {
            mergedMachines = new Map(persisted.machines);
            machineCache.current.forEach((v, k) => mergedMachines.set(k, v));
          }

        }catch{}

        // 3) guardo merged
        saveMovesPersistentCaches(mergedWarm, mergedMachines);

      }, 800);

    } catch {}

  }, []);

  // Index desde session (si existe) o se arma al llegar esMap
  const [index, setIndex] = useState(() => loadIndex() || []);
  const [loadingIndex, setLoadingIndex] = useState(() => !loadIndex());

  const getUrl = useCallback(async (url) =>
  {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    
    return res.json();

  }, []);

  // 1) Cargar manifest + esMap remoto (con TTL) y armar index desde esMap
  useEffect(() =>
  {
    let alive = true;
    let didUpdate = false;
    let manifestChanged = false;
    let nextManifestVersion = "";

    (async () =>
    {

      try
      {
        // a) manifest cache (localStorage)
        const cachedManifest = loadLS(KEY_MANIFEST);
        const manifestAt = loadTS(KEY_MANIFEST_AT);
        const manifestExpired = !manifestAt || (Date.now() - manifestAt) > MANIFEST_TTL_MS;
        const mustRefreshManifest = forceManifestRefreshRef.current === true;
        forceManifestRefreshRef.current = false;

        let manifest = cachedManifest;

        if(mustRefreshManifest || !manifest || manifestExpired)
        {
          try
          {
            manifest = await getUrl(manifestUrlNoCache());

          }catch(fetchManifestError)
          {
            manifest = cachedManifest;
          }

          saveLS(KEY_MANIFEST, manifest);
          saveTS(KEY_MANIFEST_AT, Date.now());
        }

        // b) moves map cache (localStorage)
        let esMap = loadLS(KEY_ESMAP);

        const movesPath = (manifest && manifest.moves_url) ? String(manifest.moves_url) : null;
        const movesUrl = movesPath ? COMPETIDEX_DATA.movesMap(movesPath) : null;

        const cachedManifestVersion = String(cachedManifest?.version || "").trim();
        nextManifestVersion = String(manifest?.version || "").trim();
        const hasCachedManifest = !!cachedManifest;
        manifestChanged = !hasCachedManifest || (!!nextManifestVersion && nextManifestVersion !== cachedManifestVersion);
        const shouldRefreshMoveMap = manifestChanged || (!esMap && !!movesUrl);

        if(shouldRefreshMoveMap && movesUrl)
        {
          esMap = await getUrl(movesUrl);
          saveLS(KEY_ESMAP, esMap);
          saveTS(KEY_ESMAP_AT, Date.now());
          try { localStorage.setItem(KEY_LAST_ESMAP_URL, movesUrl); } catch {}
          didUpdate = true;
        }

        if(manifestChanged)
        {
          didUpdate = true;
        }

        esMapRef.current = (esMap && typeof esMap === "object") ? esMap : {};

        // c) construir mapas inversos y slugs
        (function buildReverseMaps()
        {
          const esMapObj = esMapRef.current || {};
          const keys = Object.keys(esMapObj);

          const esToKey = new Map();
          const slugToKey = new Map();
          const keyToSlug = new Map();
          const keyToDisplay = new Map();
          const keyToContact = new Map();

          for(let i = 0; i < keys.length; i++)
          {
            const apiKey = keys[i];
            const entry = esMapObj[apiKey] || {};
            const display = entry.display || "";
            const isContact = entry?.isContact;

            keyToDisplay.set(apiKey, display || apiKey);
            keyToContact.set(apiKey, isContact === true ? true : (isContact === false ? false : null));

            if(display)
            {
              const k1 = normalizeInputForLookup(display);
              if (k1) esToKey.set(k1, apiKey);

              const slugES = slugifyForUrl(display);
              if (slugES) slugToKey.set(slugES, apiKey);
              if (slugES) keyToSlug.set(apiKey, slugES);
            }

            const k2 = normalizeInputForLookup(apiKey.replace(/-/g, " "));
            if (k2) esToKey.set(k2, apiKey);

            const slugEN = slugifyForUrl(apiKey);
            if (slugEN) slugToKey.set(slugEN, apiKey);

            if (!keyToSlug.has(apiKey) && slugEN) keyToSlug.set(apiKey, slugEN);
          }

          esToKeyRef.current = esToKey;
          slugToKeyRef.current = slugToKey;
          keyToSlugRef.current = keyToSlug;
          keyToDisplayRef.current = keyToDisplay;
          keyToContactRef.current = keyToContact;

        })();

        // d) Armar index desde esMap
        const last = loadIndexAt();
        const expired = !last || (Date.now() - last) > INDEX_TTL_MS;
        const shouldRebuildIndex = !index.length || expired || manifestChanged;

        if(alive && shouldRebuildIndex)
        {
          setLoadingIndex(true);

          const items = buildIndexFromEsMap(esMapRef.current);
          setIndex(items);
          saveIndex(items);
          saveIndexAt(Date.now());
          didUpdate = true;

          setLoadingIndex(false);
        }

      }catch(e)
      {
        console.warn("No pude cargar moves ES map remoto:", e);
        esMapRef.current = esMapRef.current || {};

        if (alive) setLoadingIndex(false);

      }finally
      {
        if (alive) setEsMapReady(true);

        if(refreshResolverRef.current)
        {
          const resolve = refreshResolverRef.current;
          refreshResolverRef.current = null;
          try { resolve({ anyRefreshed: didUpdate, manifestChanged, nextManifestVersion }); } catch (e) {}
        }
      }

    })();

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [getUrl, refreshTick]);

  // 2) Restaurar warm + machine cache + raw cache (session) y luego (si está activo) hidratar desde localStorage
  useEffect(() =>
  {
    // session
    const warmed = loadWarm();
    if (warmed) warmed.forEach((v, k) => cache.current.set(k, v));

    const mcache = loadMachineCache();
    if (mcache) mcache.forEach((v, k) => machineCache.current.set(k, v));

    const rcache = loadRaw();
    if (rcache) rcache.forEach((v, k) => rawCache.current.set(k, v));

    // localStorage reducido (si está activado)
    if(persistEnabled)
    {
      try
      {
        const persisted = loadMovesPersistentCaches();
        if(persisted && persisted.warmReduced)
        {
          persisted.warmReduced.forEach((v, k) => {
            cache.current.set(k, v);
          });
        }

        if(persisted && persisted.machines)
        {
          persisted.machines.forEach((v, k) => machineCache.current.set(k, v));
        }

        // sincronizo session para que quede "caliente" en esta sesión
        saveWarm(cache.current);
        saveMachineCache(machineCache.current);

      }catch{}

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []); // una vez

  // /machine/{id} -> code
  const getMachineCodeByUrl = useCallback(async (url) =>
  {
    const mid = machineIdFromUrl(url);
    if (!mid) return null;
    if (machineCache.current.has(mid)) return machineCache.current.get(mid);

    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const code = json?.item?.name || null;

    if(code)
    {
      machineCache.current.set(mid, code);
      saveMachineCache(machineCache.current);
      schedulePersist();
    }

    return code;

  }, [schedulePersist]);

  // Completar machines_by_group usando machine URLs (concurrencia)
  const resolveMachinesForSummary = useCallback(async (summary, poolSize = machineConcurrency) =>
  {
    const entries = Object.entries(summary.machine_urls_by_group || {});
    if (!entries.length) return summary;

    const pending = entries.filter(([vg]) => !summary.machines_by_group?.[vg]);
    if (!pending.length) return summary;

    let p = 0;
    async function worker()
    {
      while(p < pending.length)
      {
        const idx = p++;
        const item = pending[idx];
        const vg = item[0];
        const url = item[1];

        try
        {
          const code = await getMachineCodeByUrl(url);
          if(code)
          {
            summary.machines_by_group = summary.machines_by_group || {};
            summary.machines_by_group[vg] = code;
          }

        }catch{}
      }
    }

    await Promise.all(Array.from({ length: Math.min(poolSize, pending.length) }, worker));
    
    return summary;

  }, [getMachineCodeByUrl, machineConcurrency]);

  // Warm
  useEffect(() =>
  {
    if (!preloadCount) return;
    let alive = true;

    (async() =>
    {

      try
      {
        const list = index.slice(0, preloadCount);
        if (!list.length) return;

        let i = 0;
        const worker = async () =>
        {
          while(alive && i < list.length)
          {
            const idx = i++;
            const it = list[idx];
            try
            {

              if(!cache.current.has(it.name))
              {
                const res = await fetch(it.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();

                let summary = summarizeMove(json, esMapRef.current);
                syncMoveDisplayFromRaw(summary.key, json);
                await resolveMachinesForSummary(summary);
                cache.current.set(summary.key, summary);

                rawCache.current.set(moveKey(summary.key), json);

              }else
              {

                let s = cache.current.get(it.name);
                if(needsRefresh(s))
                {
                  const res2 = await fetch(it.url);
                  if(res2.ok)
                  {
                    const json2 = await res2.json();
                    let s2 = summarizeMove(json2, esMapRef.current);
                    syncMoveDisplayFromRaw(s2.key, json2);
                    await resolveMachinesForSummary(s2);
                    cache.current.set(s2.key, s2);

                    rawCache.current.set(moveKey(s2.key), json2);
                  }

                }else
                {
                  await resolveMachinesForSummary(s);
                }

              }

            }catch{}
          }
        };

        const pool = Array.from({ length: Math.min(warmConcurrency, list.length) }, worker);
        await Promise.all(pool);
      }finally
      {
        saveWarm(cache.current);
        saveMachineCache(machineCache.current);
        saveRaw(rawCache.current);
        schedulePersist();
      }

    })();

    return () => { alive = false; };

  }, [index, preloadCount, warmConcurrency, resolveMachinesForSummary, schedulePersist]);

  // Obtener RAW (JSON completo) de un movimiento (session/mem)
  const getMoveRaw = useCallback(async (nameOrId) =>
  {
    const key = moveKey(nameOrId);
    if (!key) throw new Error("Movimiento inválido");

    if (rawCache.current.has(key))
    {
      const cachedRaw = rawCache.current.get(key);
      syncMoveDisplayFromRaw(key, cachedRaw);

      return cachedRaw;
    }

    const json = await getMoveRawFromProvider(key);
    rawCache.current.set(key, json);
    saveRaw(rawCache.current);
    syncMoveDisplayFromRaw(key, json);

    return json;

  }, [syncMoveDisplayFromRaw]);

  // Obtener un movimiento puntual (SUMMARY)
  const getMove = useCallback(async (nameOrId) =>
  {
    const key = moveKey(nameOrId);

    if(cache.current.has(key))
    {
      let cached = cache.current.get(key);

      if(needsRefresh(cached))
      {
        const res2 = await fetch(POKEAPI.move(key));
        if (!res2.ok) throw new Error(`No se encontró movimiento: ${key}`);
        const json2 = await res2.json();

        cached = summarizeMove(json2, esMapRef.current);
        syncMoveDisplayFromRaw(key, json2);

        rawCache.current.set(key, json2);
        saveRaw(rawCache.current);
      }

      await resolveMachinesForSummary(cached);

      const e = (esMapRef.current && esMapRef.current[key]) ? esMapRef.current[key] : null;
      if(e)
      {
        if (!cached.display_es && e.display) cached.display_es = e.display;
        if (cached.type == null && e.type) cached.type = e.type;
        if (cached.damage_class == null && e.damage_class) cached.damage_class = e.damage_class;
      }

      cache.current.set(key, cached);
      saveWarm(cache.current);
      schedulePersist();

      return cached;

    }

    const res = await fetch(POKEAPI.move(key));
    if (!res.ok) throw new Error(`No se encontró movimiento: ${key}`);

    const json = await res.json();

    let summary = summarizeMove(json, esMapRef.current);
    syncMoveDisplayFromRaw(key, json);
    await resolveMachinesForSummary(summary);

    const e = (esMapRef.current && esMapRef.current[key]) ? esMapRef.current[key] : null;
    if(e)
    {
      if (!summary.display_es && e.display) summary.display_es = e.display;
      if (summary.type == null && e.type) summary.type = e.type;
      if (summary.damage_class == null && e.damage_class) summary.damage_class = e.damage_class;
    }

    cache.current.set(summary.key, summary);
    saveWarm(cache.current);

    rawCache.current.set(key, json);
    saveRaw(rawCache.current);

    schedulePersist();

    return summary;

  }, [resolveMachinesForSummary, schedulePersist]);

  // Cargar varios con pool
  const getMany = useCallback(async (keys) =>
  {
    const uniq = [...new Set((Array.isArray(keys) ? keys : []).map(moveKey).filter(Boolean))];

    return uniq.map((k) => getMoveSummaryByKeyFromMap(esMapRef.current, k) || { key: k, name: k, api_name: k, display_es: k, display: k });

  }, []);

  const getManyEsNamesMoves = useCallback(async (keys) =>
  {
    const details = await getMany(keys);

    return new Map(details.map(function(d)
    {
      return [d.api_name, d.display_es || d.display || d.name || d.key || ""];
    }));

  }, [getMany]);

  const translatePokemonMoves = useCallback(async (keys) =>
  {
    const arr = Array.isArray(keys) ? keys.filter(Boolean) : [];
    if(!arr.length) return new Map();

    return await getManyEsNamesMoves(arr);

  }, [getManyEsNamesMoves]);

  // Build learnset
  const buildLearnset = useCallback(async (dataMoves) =>
  {
    const result = new Map();

    for(const m of (dataMoves || []))
    {
      const k = moveKey(m.move?.name || "");
      const base = getMoveSummaryByKeyFromMap(esMapRef.current, k) || { key: k, name: k, api_name: k };

      for(const det of (m.version_group_details || []))
      {
        const group  = det.version_group?.name || "unknown";
        const method = det.move_learn_method?.name || "other";
        const level  = det.level_learned_at ?? 0;

        if(!result.has(group))
        {
          result.set(group, { group, level_up: [], machine: [], tutor: [], egg: [], other: [] });
        }

        const bucket = result.get(group);

        const entry = { ...base, level, method };

        if(method === "machine")
        {
          const machineInfo = base.machinesByGroup?.[group] || null;
          const machine = normalizeMoveMachineInfo(machineInfo);

          entry.machine_code = machine?.machine || null;
          entry.machine_code_es = machine?.machine_es || null;
        }

        switch(method)
        {
          case "level-up": bucket.level_up.push(entry); break;
          case "machine": bucket.machine.push(entry); break;
          case "tutor": bucket.tutor.push(entry); break;
          case "egg": bucket.egg.push(entry); break;
          default: bucket.other.push(entry); break;
        }

      }
    }

    const byLevel = (a,b)=> (a.level - b.level) || a.name.localeCompare(b.name);
    for(const g of result.values())
    {
      g.level_up.sort(byLevel);
      g.machine.sort((a,b)=>a.name.localeCompare(b.name));
      g.tutor.sort((a,b)=>a.name.localeCompare(b.name));
      g.egg.sort((a,b)=>a.name.localeCompare(b.name));
      g.other.sort((a,b)=>a.name.localeCompare(b.name));
    }

    return Array.from(result.values());

  }, []);

  const getPokemonMovesGroupVersion = useCallback(async (dataMoves) =>
  {
    const grupos = await buildLearnset(dataMoves);

    const mapConNivel = (m) => ({
      nombre: m.display_es || m.name || m.key || "",
      nombreMovApi: m.name || "",
      tipo: m.type,
      categoria: m.damage_class,
      potencia: m.power ?? "-",
      precision: m.accuracy ?? "-",
      pp: m.pp ?? "-",
      nivel: m.level ?? 0,
      metodo: "Nivel"
    });

    const mapSinNivel = (metodo) => (m) => ({
      nombre: m.display_es || m.name || m.key || "",
      nombreMovApi: m.name || "",
      tipo: m.type,
      categoria: m.damage_class,
      potencia: m.power ?? "-",
      precision: m.accuracy ?? "-",
      pp: m.pp ?? "-",
      nivel: null,
      metodo,
      mtmo: m.machine_code_es || m.machine_code || null
    });

    const byOrder = (a, b) =>
    {
      const oa = Number.isFinite(a?.order) ? a.order : -1;
      const ob = Number.isFinite(b?.order) ? b.order : -1;
      if(oa !== ob) return ob - oa;

      return String(a?.grupoVersion || "").localeCompare(String(b?.grupoVersion || ""));
    };

    const mapped = (Array.isArray(grupos) ? grupos : [])
      .map((g) =>
      {
        const meta = getGroupVersionMeta(g?.group);
        const groupKey = String(meta?.apiKey || "").trim().toLowerCase();

        if(!groupKey || groupKey === "unknown" || meta?.enabled === false)
        {
          return null;
        }

        return {
          grupoVersion: meta?.labelEs || g.group || groupKey,
          order: getGroupVersionOrder(groupKey) ?? -1,
          nivel: Array.isArray(g?.level_up) ? g.level_up.map(mapConNivel) : [],
          mt: Array.isArray(g?.machine) ? g.machine.map(mapSinNivel("MT/TR")) : [],
          tutor: Array.isArray(g?.tutor) ? g.tutor.map(mapSinNivel("Tutor")) : [],
          huevo: Array.isArray(g?.egg) ? g.egg.map(mapSinNivel("Huevo")) : [],
          otros: Array.isArray(g?.other) ? g.other.map(mapSinNivel("Otro")) : []
        };
      })
      .filter(Boolean)
      .sort(byOrder)
      .map(({ order, ...rest }) => rest);

    return mapped;

  }, [buildLearnset]);

  // Resuelve cualquier input (ES/EN/slug) a { key, slug, display }
  const resolveMoveInput = useCallback((input) =>
  {
    const raw = String(input || "").trim();
    if (!raw) return null;

    const slug = slugifyForUrl(raw);
    if(slugToKeyRef.current && slugToKeyRef.current.has(slug))
    {
      const k = slugToKeyRef.current.get(slug);
      const entry = (esMapRef.current && esMapRef.current[k]) ? esMapRef.current[k] : null;
      const display = (entry && entry.display) ? entry.display : k;
      return { key: k, slug: keyToSlugRef.current.get(k) || slugifyForUrl(display), display: display };
    }

    const norm = normalizeInputForLookup(raw);
    if(esToKeyRef.current && esToKeyRef.current.has(norm))
    {
      const k2 = esToKeyRef.current.get(norm);
      const entry2 = (esMapRef.current && esMapRef.current[k2]) ? esMapRef.current[k2] : null;
      const display2 = (entry2 && entry2.display) ? entry2.display : k2;
      return { key: k2, slug: keyToSlugRef.current.get(k2) || slugifyForUrl(display2), display: display2 };
    }

    const apiKey = moveKey(raw);
    const entry3 = (esMapRef.current && esMapRef.current[apiKey]) ? esMapRef.current[apiKey] : null;
    const display3 = (entry3 && entry3.display) ? entry3.display : apiKey;
    
    return { key: apiKey, slug: keyToSlugRef.current.get(apiKey) || slugifyForUrl(display3), display: display3 };
  
  }, []);

  // Devuelve el slug canónico de un apiKey
  const getMoveSlug = useCallback((apiKey) =>
  {
    const k = moveKey(apiKey);
    if (!k) return "";
    const slug = (keyToSlugRef.current && keyToSlugRef.current.get(k)) || slugifyForUrl(k);
    
    return slug || "";

  }, []);

  const getMoveSummaryByKey = useCallback((nameOrId) =>
  {
    return getMoveSummaryByKeyFromMap(esMapRef.current, nameOrId);

  }, []);

  // Suggest para Buscador: 100% desde index + esMap
  const suggestMoves = useCallback((query, limit = 8) =>
  {
    const q = normText(query);
    if (!q) return [];

    const starts = [];
    const contains = [];

    for(let i = 0; i < index.length; i++)
    {
      const key = index[i].name;
      const nKey = normText(key);

      const nEs = normText((keyToDisplayRef.current && keyToDisplayRef.current.get(key)) || key);

      const matched =
        (nKey.startsWith(q) || (nEs && nEs.startsWith(q))) ? "starts"
        : (nKey.includes(q) || (nEs && nEs.includes(q))) ? "contains"
        : null;

      if (matched === "starts") starts.push(key);
      else if (matched === "contains") contains.push(key);

      if (starts.length + contains.length >= limit * 10) break;
    }

    const merged = starts.concat(contains).slice(0, limit);
    const out = [];

    for(const key of merged)
    {
      const cached = cache.current.get(key);
      const summary = getMoveSummaryByKeyFromMap(esMapRef.current, key);
      const display = summary?.display_es || (keyToDisplayRef.current && keyToDisplayRef.current.get(key)) || key;

      const rawId = summary?.id ?? (cached && typeof cached.id === "number" ? cached.id : null);
      const rawType = summary?.type ?? (cached && cached.type) ?? null;
      const rawClass = summary?.damage_class ?? (cached && cached.damage_class) ?? null;

      out.push({
        key,
        id: rawId,
        display,
        type: rawType || null,
        class: rawClass || null,
      });

    }

    return out;

  }, [index, esMapReady]);

  // API para persistencia reduced (localStorage)
  const enablePersistence = useCallback(() =>
  {
    setMovesPersistenceEnabled(true);
    setPersistEnabled(true);

    const reducedWarm = new Map();
    cache.current.forEach((v, k) =>
    {
      const r = reduceSummaryForPersist(v);
      if (r) reducedWarm.set(k, r);
    });

    // merge con lo que ya exista (por si el usuario desactivó/activó)
    let mergedWarm = reducedWarm;
    let mergedMachines = machineCache.current;

    try
    {
      const persisted = loadMovesPersistentCaches();
      if(persisted && persisted.warmReduced)
      {
        mergedWarm = new Map(persisted.warmReduced);
        reducedWarm.forEach((v, k) => mergedWarm.set(k, v));
      }

      if(persisted && persisted.machines)
      {
        mergedMachines = new Map(persisted.machines);
        machineCache.current.forEach((v, k) => mergedMachines.set(k, v));
      }

    }catch{}

    saveMovesPersistentCaches(mergedWarm, mergedMachines);

  }, []);

  const disablePersistence = useCallback(() =>
  {
    setMovesPersistenceEnabled(false);
    setPersistEnabled(false);

    // Cancelo cualquier guardado pendiente
    try
    {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
      persistTimerRef.current = null;

    }catch{}

    // borro solo lo persistido (localStorage), sin tocar session/memoria
    clearMovesPersistentCaches();

  }, []);

  // persistNow con MERGE (para no pisar lo que ya existía en localStorage)
  const persistNow = useCallback(() =>
  {
    if (!persistEnabled) return;

    const reducedWarm = new Map();
    cache.current.forEach((v, k) =>
    {
      const r = reduceSummaryForPersist(v);
      if (r) reducedWarm.set(k, r);
    });

    let mergedWarm = reducedWarm;
    let mergedMachines = machineCache.current;

    try
    {
      const persisted = loadMovesPersistentCaches();

      if(persisted && persisted.warmReduced)
      {
        mergedWarm = new Map(persisted.warmReduced);
        reducedWarm.forEach((v, k) => mergedWarm.set(k, v));
      }

      if(persisted && persisted.machines)
      {
        mergedMachines = new Map(persisted.machines);
        machineCache.current.forEach((v, k) => mergedMachines.set(k, v));
      }

    }catch{}

    saveMovesPersistentCaches(mergedWarm, mergedMachines);

  }, [persistEnabled]);

  const clearPersistent = useCallback(() =>
  {
    clearMovesPersistentCaches();

  }, []);

  const clearAllCaches = useCallback(() =>
  {
    // memoria
    cache.current.clear();
    rawCache.current.clear();
    machineCache.current.clear();

    // session
    try { sessionStorage.removeItem(KEY_WARM); } catch {}
    try { sessionStorage.removeItem(KEY_RAW); } catch {}
    try { sessionStorage.removeItem(KEY_MACH); } catch {}

    // local (reducido)
    clearMovesPersistentCaches();

  }, []);

  // Borra SOLO lo que alimenta el buscador (suggest):
  // - manifest + esMap (localStorage)
  // - index (sessionStorage)
  // No toca warm/machine/raw ni la persistencia reduced.
  const clearSuggestCache = useCallback(() =>
  {
    // localStorage: manifest + esMap
    try { localStorage.removeItem(KEY_MANIFEST); } catch {}
    try { localStorage.removeItem(KEY_MANIFEST_AT); } catch {}
    try { localStorage.removeItem(KEY_ESMAP); } catch {}
    try { localStorage.removeItem(KEY_ESMAP_AT); } catch {}
    try { localStorage.removeItem(KEY_LAST_ESMAP_URL); } catch {}

    // sessionStorage: index
    try { sessionStorage.removeItem(KEY_INDEX); } catch {}
    try { sessionStorage.removeItem(KEY_INDEX_AT); } catch {}

    // reset mínimo de estado
    try { esMapRef.current = {}; } catch {}
    try { setEsMapReady(false); } catch {}
    try { setIndex([]); } catch {}
    try { setLoadingIndex(true); } catch {}

  }, []);

  const refreshSuggestCache = useCallback(() =>
  {
    return new Promise((resolve) =>
    {
      forceManifestRefreshRef.current = true;
      refreshResolverRef.current = resolve;
      setRefreshTick((v) => v + 1);
    });

  }, []);

  const value = useMemo(() => ({
    index,
    loadingIndex,
    esMapReady,

    getMove,
    getMoveRaw,
    getMoveSummaryByKey,
    getMoveContactByKey,
    getMany,
    getManyEsNamesMoves,
    translatePokemonMoves,
    buildLearnset,
    getPokemonMovesGroupVersion,
    suggestMoves,

    resolveMoveInput,
    getMoveSlug,

    clearSuggestCache,
    refreshSuggestCache,

    // persistencia
    persistEnabled,
    enablePersistence,
    disablePersistence,
    persistNow,
    clearPersistent,
    clearAllCaches
  }), [
    index,
    loadingIndex,
    esMapReady,

    getMove,
    getMoveRaw,
    getMoveSummaryByKey,
    getMoveContactByKey,
    getMany,
    getManyEsNamesMoves,
    translatePokemonMoves,
    buildLearnset,
    getPokemonMovesGroupVersion,
    suggestMoves,

    resolveMoveInput,
    getMoveSlug,

    clearSuggestCache,
    refreshSuggestCache,

    persistEnabled,
    enablePersistence,
    disablePersistence,
    persistNow,
    clearPersistent,
    clearAllCaches
  ]);

  return (
    <MovesContext.Provider value={value}>
      {children}
    </MovesContext.Provider>
  );

}

export function useMoves()
{
  const ctx = useContext(MovesContext);
  if (!ctx) throw new Error("useMoves debe usarse dentro de <MovesProvider>");
  
  return ctx;
}
