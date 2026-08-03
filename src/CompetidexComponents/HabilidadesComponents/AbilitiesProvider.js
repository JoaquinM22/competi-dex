//** src\CompetidexComponents\HabilidadesComponents\AbilitiesProvider.js

import React, {
  createContext, useContext, useMemo, useRef, useEffect, useCallback, useState
} from "react";
import { POKEAPI, COMPETIDEX_DATA } from "../../config/endpoints";
import {
  loadAbilitiesPersistentCaches,
  saveAbilitiesPersistentCaches,
  clearAbilitiesPersistentCaches,
  loadAbilitiesWarmCache,
  saveAbilitiesWarmCache,
  clearAbilitiesWarmCache,
  loadAbilitiesRawCache,
  saveAbilitiesRawCache,
  clearAbilitiesRawCache
} from "./abilityCache";

const AbilitiesContext = createContext(null);

//** Json con todas las habilidades para el buscador, posee esta forma:
/*
  {
    "stench": {
      "id": 1,
      "gen": "generation-iii",
      "display": "Hedor"
    },
    "damp": {
      "id": 6,
      "gen": "generation-iii",
      "display": "Humedad"
    },
    "speed-boost": {
      "id": 3,
      "gen": "generation-iii",
      "display": "Impulso"
    },
    ....
  }
*/

const MANIFEST_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

function abilityKey(nameOrId)
{
  if(typeof nameOrId === "string")
  {
    return nameOrId.trim().toLowerCase();
  }

  return String(nameOrId);
}

function normalizeText(s)
{
  return String(s || "")
    .replace(/[\f\n\r]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
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
  t = t.replace(/\./g, "_");
  t = t.replace(/[^a-z0-9_]/g, "");
  t = t.replace(/_+/g, "_");
  t = t.replace(/^_+|_+$/g, "");

  return t;
}

function normalizeInputForLookup(s)
{
  let t = normText(s);
  t = t.replace(/[.\s_\-]+/g, " ");
  t = t.replace(/\s+/g, " ").trim();

  return t;
}

function summarizeAbility(json)
{
  function esTextoValido(txt)
  {
    const s = normalizeText(txt);

    return !!s && /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(s);
  }

  function findLastFlavor(lang)
  {
    const entries = json?.flavor_text_entries || [];
    let ultimo = "";

    for(let i = 0; i < entries.length; i++)
    {
      const f = entries[i];
      if (!f || !f.language || f.language.name !== lang) continue;

      const txt = normalizeText(f.flavor_text || "");
      if (!esTextoValido(txt)) continue;

      ultimo = txt;
    }

    return ultimo;
  }

  function findLastEffect(lang)
  {
    const effectEntries = json?.effect_entries || [];
    let ultimo = "";

    for(let i = 0; i < effectEntries.length; i++)
    {
      const e = effectEntries[i];
      if (!e || !e.language || e.language.name !== lang) continue;

      const txt = normalizeText(e.effect || "");
      if (!esTextoValido(txt)) continue;

      ultimo = txt;
    }

    return ultimo;
  }

  const name_es =
    json?.names?.find(n => n.language?.name === "es")?.name ??
    json?.names?.find(n => n.language?.name === "en")?.name ??
    json?.name ??
    "";

  const flavor_es = findLastFlavor("es");
  const effect_es = findLastEffect("es");
  const effect_en = findLastEffect("en");
  const flavor_en = findLastFlavor("en");

  const desc_pref = flavor_es || effect_es || effect_en || flavor_en || "";

  return {
    key: json?.name ?? (name_es?.toLowerCase?.() ?? ""),
    api_name: json?.name ?? "",
    display_es: name_es || "",
    desc_es: desc_pref,
    flavor_es: flavor_es
  };
}

function buildReverseMaps(abilityMap)
{
  const keys = Object.keys(abilityMap || {});

  const esToKey = new Map();
  const slugToKey = new Map();
  const keyToSlug = new Map();

  for(let i = 0; i < keys.length; i++)
  {
    const apiKey = keys[i];
    const entry = abilityMap[apiKey] || {};
    const display = String(entry.display || entry.display_es || "").trim();

    if(display)
    {
      const k1 = normalizeInputForLookup(display);
      if (k1) esToKey.set(k1, apiKey);

      const slugES = slugifyForUrl(display);
      if(slugES)
      {
        slugToKey.set(slugES, apiKey);
        keyToSlug.set(apiKey, slugES);
      }
    }

    const k2 = normalizeInputForLookup(apiKey.replace(/-/g, " "));
    if (k2) esToKey.set(k2, apiKey);

    const slugEN = slugifyForUrl(apiKey);
    if (slugEN) slugToKey.set(slugEN, apiKey);

    if (!keyToSlug.has(apiKey) && slugEN) keyToSlug.set(apiKey, slugEN);
  }

  return { esToKey, slugToKey, keyToSlug };
}

function manifestUrlNoCache()
{
  return COMPETIDEX_DATA.abilitiesManifest + "?v=" + Date.now();
}

export function AbilitiesProvider({ children })
{
  const warmCache = useRef(new Map());
  const rawCache = useRef(new Map());
  const refreshResolverRef = useRef(null);
  const esToKeyRef = useRef(new Map());
  const slugToKeyRef = useRef(new Map());
  const keyToSlugRef = useRef(new Map());
  const [refreshTick, setRefreshTick] = useState(0);

  const initialPersisted = useMemo(() => loadAbilitiesPersistentCaches(), []);

  const [abilityMap, setAbilityMap] = useState(() => initialPersisted.map || null);
  const [mapVersion, setMapVersion] = useState(() => initialPersisted.mapVersion || "");
  const [loadingIndex, setLoadingIndex] = useState(!abilityMap);

  const esMapReadyAbilities = !!abilityMap && typeof abilityMap === "object";
  const hasAbilityMapEntries = !!abilityMap && typeof abilityMap === "object" && Object.keys(abilityMap).length > 0;

  useEffect(() =>
  {
    const warmed = loadAbilitiesWarmCache();
    if (warmed) warmed.forEach((v, k) => warmCache.current.set(k, v));

    const raw = loadAbilitiesRawCache();
    if (raw) raw.forEach((v, k) => rawCache.current.set(k, v));

  }, []);

  useEffect(() =>
  {
    let alive = true;

    (async() =>
    {
      const persisted = loadAbilitiesPersistentCaches();
      let anyRefreshed = false;

      try
      {
        setLoadingIndex(true);

        let manifest = persisted.manifest;
        const manifestAt = persisted.manifestAt;
        const manifestExpired = !manifestAt || (Date.now() - manifestAt) > MANIFEST_TTL_MS;

        if(!manifest || manifestExpired)
        {
          const manifestUrl = manifestUrlNoCache();
          manifest = await fetch(manifestUrl, { headers: { accept: "application/json" } }).then(res =>
          {
            if (!res.ok) throw new Error("HTTP " + res.status + " GET " + manifestUrl);
            return res.json();
          });

          saveAbilitiesPersistentCaches(
            manifest,
            persisted.map || null,
            Date.now(),
            persisted.mapAt || 0,
            persisted.mapVersion || "",
            persisted.lastMapUrl || ""
          );
          anyRefreshed = true;

          if (!alive) return;
        }

        let mapJson = persisted.map;

        const version = String(manifest?.version || "").trim();
        const urlPath = String(manifest?.ability_url || "").trim();
        if (!urlPath) throw new Error("manifest abilities invalido: falta ability_url");

        const mapUrl = COMPETIDEX_DATA.abilitiesMap(urlPath);
        const lastMapUrl = String(persisted.lastMapUrl || "").trim();
        const mapChanged = !!(lastMapUrl && lastMapUrl !== mapUrl);

        if((!mapJson || mapChanged) && mapUrl)
        {
          mapJson = await fetch(mapUrl, { headers: { accept: "application/json" } }).then(res =>
          {
            if (!res.ok) throw new Error("HTTP " + res.status + " GET " + mapUrl);
            return res.json();
          });

          saveAbilitiesPersistentCaches(manifest, mapJson, Date.now(), Date.now(), version || "", mapUrl);
          anyRefreshed = true;

          if (!alive) return;
        }else if(!lastMapUrl && mapUrl)
        {
          saveAbilitiesPersistentCaches(
            manifest,
            mapJson,
            persisted.manifestAt || Date.now(),
            persisted.mapAt || Date.now(),
            version || "",
            mapUrl
          );
        }

        setAbilityMap(mapJson);
        setMapVersion(version || "");

      }catch(e)
      {
        console.warn("No pude cargar abilities map remoto:", e);

      }finally
      {
        if (alive) setLoadingIndex(false);

        if(refreshResolverRef.current)
        {
          const resolve = refreshResolverRef.current;
          refreshResolverRef.current = null;
          try { resolve({ anyRefreshed }); } catch (e) {}
        }
      }

    })();

    return function () { alive = false; };

  }, [refreshTick]);

  useEffect(() =>
  {
    if (!abilityMap || typeof abilityMap !== "object") return;

    const maps = buildReverseMaps(abilityMap);
    esToKeyRef.current = maps.esToKey;
    slugToKeyRef.current = maps.slugToKey;
    keyToSlugRef.current = maps.keyToSlug;

  }, [abilityMap]);

  const suggestAbilities = useCallback((query, limit = 8) =>
  {
    const q = normText(query);
    if (!q || !hasAbilityMapEntries) return [];

    const out = [];
    const keys = Object.keys(abilityMap);

    for(let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const it = abilityMap[key] || {};
      const display = String(it.display || it.display_es || key).trim();
      const gen = String(it.gen || it.generation || "").trim();

      const nKey = normText(key);
      const nDisp = normText(display);

      if(nKey.includes(q) || nDisp.includes(q))
      {
        out.push({
          key: key,
          display: display,
          slug: keyToSlugRef.current.get(key) || slugifyForUrl(display || key),
          id: it.id ?? null,
          gen: gen
        });

        if (out.length >= limit) break;
      }
    }

    return out;

  }, [abilityMap, hasAbilityMapEntries]);

  const resolveAbilityInput = useCallback((input) =>
  {
    const raw = String(input || "").trim();
    if (!raw) return null;

    const low = raw.toLowerCase();

    if(abilityMap && abilityMap[low])
    {
      return { key: low, slug: keyToSlugRef.current.get(low) || slugifyForUrl(low) };
    }

    const slug = slugifyForUrl(low);
    if(slug && slugToKeyRef.current && slugToKeyRef.current.has(slug))
    {
      const k = slugToKeyRef.current.get(slug);
      return { key: k, slug: keyToSlugRef.current.get(k) || slug };
    }

    const norm = normalizeInputForLookup(raw);
    if(norm && esToKeyRef.current && esToKeyRef.current.has(norm))
    {
      const k2 = esToKeyRef.current.get(norm);
      return { key: k2, slug: keyToSlugRef.current.get(k2) || slugifyForUrl(k2) };
    }

    const asKeyDash = low.replace(/[._\s]+/g, "-");
    return { key: asKeyDash, slug: keyToSlugRef.current.get(asKeyDash) || slugifyForUrl(asKeyDash) };

  }, [abilityMap]);

  const getAbilitySlug = useCallback((apiKey) =>
  {
    const k = abilityKey(apiKey);
    if (!k) return "";

    return (keyToSlugRef.current && keyToSlugRef.current.get(k)) || slugifyForUrl(k);

  }, []);

  const resolveAbilityKey = useCallback((input) =>
  {
    const raw = String(input || "").trim();
    if (!raw) return "";

    const low = raw.toLowerCase();

    if(abilityMap && abilityMap[low])
    {
      return low;
    }

    const slug = slugifyForUrl(low);
    if(slug && slugToKeyRef.current && slugToKeyRef.current.has(slug))
    {
      return slugToKeyRef.current.get(slug);
    }

    const norm = normalizeInputForLookup(raw);
    if(norm && esToKeyRef.current && esToKeyRef.current.has(norm))
    {
      return esToKeyRef.current.get(norm);
    }

    const asKeyDash = low.replace(/[._\s]+/g, "-");
    if(abilityMap && abilityMap[asKeyDash])
    {
      return asKeyDash;
    }

    return asKeyDash;

  }, [abilityMap]);

  const getAbilityRaw = useCallback(async (nameOrId) =>
  {
    const key = resolveAbilityKey(nameOrId) || abilityKey(nameOrId);
    if (rawCache.current.has(key))
    {
      return rawCache.current.get(key);
    }

    const res = await fetch(POKEAPI.ability(key), { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error("No se encontro habilidad: " + key);

    const json = await res.json();
    rawCache.current.set(key, json);
    saveAbilitiesRawCache(rawCache.current);

    return json;

  }, [resolveAbilityKey]);

  const getAbility = useCallback(async (nameOrId) =>
  {
    const key = resolveAbilityKey(nameOrId) || abilityKey(nameOrId);
    if (warmCache.current.has(key)) return warmCache.current.get(key);

    const raw = await getAbilityRaw(key);
    const summary = summarizeAbility(raw);
    warmCache.current.set(key, summary);
    saveAbilitiesWarmCache(warmCache.current);

    return summary;

  }, [getAbilityRaw, resolveAbilityKey]);

  const getMany = useCallback(async (keys, poolSize = 8) =>
  {
    const uniq = [...new Set((keys || []).map(abilityKey))];
    let p = 0;
    const out = new Array(uniq.length);

    async function worker()
    {
      while(p < uniq.length)
      {
        const idx = p++;
        const k = uniq[idx];
        try
        {
          out[idx] = await getAbility(k);

        }catch(e)
        {
          out[idx] = { key: k, api_name: k, display_es: k, desc_es: "", flavor_es: "" };
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(poolSize, uniq.length) }, worker));

    return out;

  }, [getAbility]);

  const translateFromPokeApi = useCallback(async (abilitiesArr) =>
  {
    if(!Array.isArray(abilitiesArr) || !abilitiesArr.length)
    {
      return { visibles: [], oculta: null };
    }

    const keys = abilitiesArr.map(a => a?.ability?.name).filter(Boolean);
    const details = await getMany(keys);
    const byKey = new Map(details.map(d => [d.api_name, d]));

    const visibles = [];
    let oculta = null;

    for(const it of abilitiesArr)
    {
      const apiName = it?.ability?.name;
      const d = byKey.get(apiName);
      const name = d?.display_es || apiName;
      const desc = d?.desc_es || d?.flavor_es || "";

      if (it?.is_hidden) oculta = { name, desc };
      else visibles.push({ name, desc });
    }

    return { visibles, oculta };

  }, [getMany]);

  const translatePokemonAbilities = useCallback(async (abilitiesArr) =>
  {
    if(!Array.isArray(abilitiesArr) || !abilitiesArr.length)
    {
      return {
        visibles: [],
        ocultas: []
      };
    }

    const keys = abilitiesArr
      .map(a => a?.ability?.name)
      .filter(Boolean);

    const details = await getMany(keys);
    const byKey = new Map(details.map(d => [d.api_name, d]));

    const visibles = [];
    const ocultas = [];

    for(const it of abilitiesArr)
    {
      const apiName = it?.ability?.name;
      if(!apiName) continue;

      const d = byKey.get(apiName);
      const mapped = {
        apiName: apiName,
        display: d?.display_es || apiName,
        descHab: d?.desc_es || d?.flavor_es || ""
      };

      if (it?.is_hidden) ocultas.push(mapped);
      else visibles.push(mapped);
    }

    return {
      visibles,
      ocultas
    };

  }, [getMany]);

  const translateAbilitiesByKeys = useCallback(async (keys) =>
  {
    if(!Array.isArray(keys) || !keys.length)
    {
      return [];
    }

    const uniq = [...new Set(keys.map(abilityKey).filter(Boolean))];

    return await Promise.all(
      uniq.map(async function(key)
      {
        try
        {
          const d = await getAbility(key);

          return {
            apiName: d?.api_name || key,
            display: d?.display_es || key,
            descHab: d?.desc_es || d?.flavor_es || ""
          };

        }catch(e)
        {
          return {
            apiName: key,
            display: key,
            descHab: ""
          };
        }
      })
    );

  }, [getAbility]);

  const clearSuggestCacheAbilities = useCallback(() =>
  {
    clearAbilitiesPersistentCaches();
    clearAbilitiesWarmCache();
    clearAbilitiesRawCache();

    try { setAbilityMap(null); } catch (e) {}
    try { setMapVersion(""); } catch (e) {}
    try { setLoadingIndex(true); } catch (e) {}

    try { esToKeyRef.current = new Map(); } catch (e) {}
    try { slugToKeyRef.current = new Map(); } catch (e) {}
    try { keyToSlugRef.current = new Map(); } catch (e) {}
    try { rawCache.current = new Map(); } catch (e) {}

  }, []);

  const refreshSuggestCacheAbilities = useCallback(() =>
  {
    return new Promise(function(resolve)
    {
      refreshResolverRef.current = resolve;
      setRefreshTick(function(v) { return v + 1; });
    });

  }, []);

  const value = useMemo(() => ({
    loadingIndex,
    esMapReadyAbilities,
    mapVersion,

    suggestAbilities,
    resolveAbilityInput,
    resolveAbilityKey,
    getAbilitySlug,

    getAbilityRaw,
    getAbility,
    getMany,
    translateFromPokeApi,
    translatePokemonAbilities,
    translateAbilitiesByKeys,
    clearSuggestCacheAbilities,
    refreshSuggestCacheAbilities
  }), [
    loadingIndex,
    esMapReadyAbilities,
    mapVersion,
    suggestAbilities,
    resolveAbilityInput,
    resolveAbilityKey,
    getAbilitySlug,
    getAbilityRaw,
    getAbility,
    getMany,
    translateFromPokeApi,
    translatePokemonAbilities,
    translateAbilitiesByKeys,
    clearSuggestCacheAbilities,
    refreshSuggestCacheAbilities
  ]);

  return (
    <AbilitiesContext.Provider value={value}>
      {children}
    </AbilitiesContext.Provider>
  );
}

export function useAbilities()
{
  const ctx = useContext(AbilitiesContext);
  if (!ctx) throw new Error("useAbilities debe usarse dentro de <AbilitiesProvider>");

  return ctx;
}
