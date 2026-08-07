//** src\CompetidexComponents\PokemonComponents\PokemonProvider.js

import React, {
  createContext, useContext, useMemo, useRef, useEffect, useCallback, useState
} from "react";
import { POKEAPI, COMPETIDEX_DATA } from "../../config/endpoints";
import {
  loadPokemonPersistentCaches,
  savePokemonPersistentCaches,
  clearPokemonPersistentCaches,
  loadPokemonIndex,
  savePokemonIndex,
  loadPokemonIndexAt,
  savePokemonIndexAt,
  clearPokemonIndex,
  loadPokemonTypesSnapshot,
  savePokemonTypesSnapshot,
  clearPokemonTypesSnapshot,
  clearPokemonAllCaches
} from "./pokemonCache";
import {
  toPokemonDisplayName,
  toPokemonApiKeyFromUserInput,
  normalizePokemonText,
  slugifyPokemonForUrl,
  isPokemonBlocked,
  toPokemonEndpointName
} from "../../utils/competidexMeta";

const PokemonContext = createContext(null);

const MANIFEST_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

//** Json con todos los Pokémon para el buscador, posee esta forma:
/*
  {
    "bulbasaur": {
      "id": 1,
      "types": [
        "grass",
        "poison"
      ]
    },
    "charizard": {
      "id": 6,
      "types": [
        "fire",
        "flying"
      ]
    },
    "ivysaur": {
      "id": 2,
      "types": [
        "grass",
        "poison"
      ]
    },
    ...
  }
*/

function buildIndexFromPokemonMap(pokemonMapObj)
{
  const keys = Object.keys(pokemonMapObj || {});
  keys.sort(function(a, b)
  {
    return a.localeCompare(b);
  });

  return keys.map(function(name)
  {
    const entry = pokemonMapObj[name] || {};
    const id = typeof entry.id === "number" ? entry.id : null;
    const types = Array.isArray(entry.types) ? entry.types.slice() : [];

    return {
      id: id,
      apiName: name,
      displayES: toPokemonDisplayName(name),
      types: types
    };

  }).filter(Boolean);
}

function manifestUrlNoCache()
{
  return COMPETIDEX_DATA.pokemonManifest + "?v=" + Date.now();
}

function getPokemonDisplay(apiKey)
{
  return toPokemonDisplayName(String(apiKey || "").toLowerCase().trim());
}

export function PokemonProvider({ children })
{
  const cache = useRef(new Map());
  const refreshResolverRef = useRef(null);
  const forceManifestRefreshRef = useRef(false);

  const [index, setIndex] = useState(function()
  {
    return loadPokemonIndex() || [];
  });

  const [loadingIndex, setLoadingIndex] = useState(function()
  {
    return !(loadPokemonIndex() && loadPokemonIndex().length);
  });

  const [refreshTick, setRefreshTick] = useState(0);
  const [pokemonMapReady, setPokemonMapReady] = useState(false);
  const initialPersisted = useMemo(function()
  {
    return loadPokemonPersistentCaches();

  }, []);

  const pokemonMapRef = useRef((initialPersisted.map && typeof initialPersisted.map === "object") ? initialPersisted.map : null);

  const typesByNameRef = useRef(new Map());
  const typesByIdRef = useRef(new Map());
  const typesSnapshotRef = useRef(loadPokemonTypesSnapshot() || {});

  const slugToKeyRef = useRef(new Map());
  const keyToSlugRef = useRef(new Map());
  const pokemonIdByKeyRef = useRef(new Map());
  const pokemonKeyByIdRef = useRef(new Map());

  useEffect(function()
  {
    const snap = typesSnapshotRef.current || {};
    Object.keys(snap).forEach(function(idStr)
    {
      const id = Number(idStr);
      const arr = snap[idStr];

      if(id && Array.isArray(arr) && arr.length)
      {
        typesByIdRef.current.set(id, arr);
      }

    });

  }, []);

  const getJson = useCallback(async function(url)
  {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status + " en " + url);

    return res.json();

  }, []);

  const getUrl = useCallback(async function(url)
  {
    if (cache.current.has(url)) return cache.current.get(url);

    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status + " en " + url);

    const json = await res.json();
    cache.current.set(url, json);

    return json;

  }, []);

  useEffect(function()
  {
    let alive = true;

    (async function()
    {
      const persisted = loadPokemonPersistentCaches();
      let anyRefreshed = false;
      let manifestChanged = false;
      let nextManifestVersion = "";
      try
      {
        let manifest = persisted.manifest;
        const cachedManifestVersion = String(persisted.manifest?.version || "").trim();
        const manifestAt = persisted.manifestAt;
        const manifestExpired = !manifestAt || (Date.now() - manifestAt) > MANIFEST_TTL_MS;
        const mustRefreshManifest = forceManifestRefreshRef.current === true;
        forceManifestRefreshRef.current = false;

        if(!manifest || manifestExpired || mustRefreshManifest)
        {
          const fetchedManifest = await getJson(manifestUrlNoCache());
          nextManifestVersion = String(fetchedManifest?.version || "").trim();
          manifestChanged = !persisted.manifest || (!!nextManifestVersion && nextManifestVersion !== cachedManifestVersion);
          manifest = fetchedManifest;

          savePokemonPersistentCaches(manifest, persisted.map || null, Date.now(), persisted.mapAt || 0, persisted.lastMapUrl || "");
          anyRefreshed = manifestChanged || anyRefreshed;

          if (mustRefreshManifest && !manifestChanged)
          {
            pokemonMapRef.current = (persisted.map && typeof persisted.map === "object") ? persisted.map : {};
            if (alive) setLoadingIndex(false);
            if (alive) setPokemonMapReady(true);
            return;
          }
        }

        if (!alive) return;

        let pokemonMap = persisted.map;

        const mapPath = (manifest && manifest.pokemon_url) ? String(manifest.pokemon_url) : null;
        const mapUrl = mapPath ? COMPETIDEX_DATA.pokemonMap(mapPath) : null;
        const lastMapUrl = String(persisted.lastMapUrl || "").trim();
        const mapChanged = !!(lastMapUrl && mapUrl && lastMapUrl !== mapUrl);

        if((!pokemonMap || mapChanged || manifestChanged) && mapUrl)
        {
          pokemonMap = await getJson(mapUrl);
          savePokemonPersistentCaches(manifest, pokemonMap, Date.now(), Date.now(), mapUrl);
          anyRefreshed = true;

        }else if(!lastMapUrl && mapUrl)
        {
          savePokemonPersistentCaches(manifest, pokemonMap, persisted.manifestAt || Date.now(), persisted.mapAt || Date.now(), mapUrl);
        }

        pokemonMapRef.current = (pokemonMap && typeof pokemonMap === "object") ? pokemonMap : {};

        const pokemonMapObj = pokemonMapRef.current || {};
        const keys = Object.keys(pokemonMapObj);
        const nextTypesSnapshot = Object.assign({}, typesSnapshotRef.current || {});
        const slugToKey = new Map();
        const keyToSlug = new Map();
        const pokemonIdByKey = new Map();
        const pokemonKeyById = new Map();

        for(let i = 0; i < keys.length; i++)
        {
          const apiKey = keys[i];
          const entry = pokemonMapObj[apiKey] || {};
          const display = getPokemonDisplay(apiKey);

          if(entry && Array.isArray(entry.types) && entry.types.length)
          {
            const types = entry.types.slice().filter(Boolean);
            typesByNameRef.current.set(apiKey, types);

            if(typeof entry.id === "number" && entry.id)
            {
              typesByIdRef.current.set(entry.id, types);
              nextTypesSnapshot[String(entry.id)] = types;
            }
          }

          if(typeof entry.id === "number" && entry.id)
          {
            pokemonIdByKey.set(apiKey, entry.id);
            pokemonKeyById.set(entry.id, apiKey);
          }

          const slugES = slugifyPokemonForUrl(display);
          if(slugES)
          {
            slugToKey.set(slugES, apiKey);
            keyToSlug.set(apiKey, slugES);
          }

          const slugEN = slugifyPokemonForUrl(apiKey);
          if (slugEN) slugToKey.set(slugEN, apiKey);
          if (!keyToSlug.has(apiKey) && slugEN) keyToSlug.set(apiKey, slugEN);

          slugToKey.set(apiKey, apiKey);
        }

        slugToKeyRef.current = slugToKey;
        keyToSlugRef.current = keyToSlug;
        pokemonIdByKeyRef.current = pokemonIdByKey;
        pokemonKeyByIdRef.current = pokemonKeyById;
        typesSnapshotRef.current = nextTypesSnapshot;
        savePokemonTypesSnapshot(nextTypesSnapshot);

        const lastIndexAt = loadPokemonIndexAt();
        const expired = !lastIndexAt || (Date.now() - lastIndexAt) > (1000 * 60 * 60 * 24);
        const currentIndex = loadPokemonIndex() || [];
        const shouldRebuildIndex = !currentIndex.length || expired || mapChanged;

        if(alive && shouldRebuildIndex)
        {
          setLoadingIndex(true);

          const items = buildIndexFromPokemonMap(pokemonMapRef.current);
          setIndex(items);
          savePokemonIndex(items);
          savePokemonIndexAt(Date.now());
          savePokemonTypesSnapshot(typesSnapshotRef.current);
          anyRefreshed = true;

          setLoadingIndex(false);
        }

      }catch(e)
      {
        console.warn("No pude cargar pokemon map remoto:", e);
        pokemonMapRef.current = pokemonMapRef.current || {};

        if (alive) setLoadingIndex(false);

      }finally
      {
        if (alive) setPokemonMapReady(true);

        if(refreshResolverRef.current)
        {
          const resolve = refreshResolverRef.current;
          refreshResolverRef.current = null;
          try { resolve({ anyRefreshed, manifestChanged, nextManifestVersion }); } catch (e) {}
        }
      }

    })();

    return function()
    {
      alive = false;
    };

  }, [getJson, refreshTick]);

  const getPokemon = useCallback(async function(nameOrId)
  {
    const raw = String(nameOrId == null ? "" : nameOrId);

    if(/^\d+$/.test(raw))
    {
      return getUrl(POKEAPI.pokemon(raw));
    }

    let key = raw.toLowerCase().trim();
    key = key
      .replace(/\s+/g, " ")
      .replace(/nidoran\s*♀/g, "nidoran-f")
      .replace(/nidoran\s*♂/g, "nidoran-m");

    if(key.indexOf("♀") !== -1 || key.indexOf("♂") !== -1)
    {
      const converted = toPokemonApiKeyFromUserInput(key);
      if (converted) key = converted;

    }else
    {
      const converted2 = toPokemonApiKeyFromUserInput(key);
      if (converted2) key = converted2;
    }

    return getUrl(POKEAPI.pokemon(toPokemonEndpointName(key)));

  }, [getUrl]);

  const getPokemonSpecies = useCallback(async function(url)
  {
    const raw = String(url == null ? "" : url).trim();
    if(!raw) return null;

    return getUrl(raw);

  }, [getUrl]);

  const getPokemonEvolutionChain = useCallback(async function(id)
  {
    const raw = (id == null) ? null : id;
    if(!raw) return null;

    return getUrl(POKEAPI.pokemonEvolutionChain(raw));

  }, [getUrl]);

  const getTypesIfCached = useCallback(function(nameOrId)
  {
    const key = String(nameOrId || "").toLowerCase();
    return typesByNameRef.current.get(key) || null;

  }, []);

  const getTypesByIdIfCached = useCallback(function(id)
  {
    const n = Number(id);
    if (!n) return null;

    return typesByIdRef.current.get(n) || null;

  }, []);

  const resolvePokemonMapKey = useCallback(function(apiNameOrDisplay)
  {
    const raw = String(apiNameOrDisplay || "").toLowerCase().trim();
    if (!raw) return "";

    const map = pokemonMapRef.current || {};
    if (map[raw]) return raw;

    const converted = toPokemonApiKeyFromUserInput(raw);
    if (converted && map[converted]) return converted;

    const baseKey = String(converted || raw).replace(/-(male|female)$/, "");
    if (baseKey && map[baseKey]) return baseKey;

    return raw;

  }, []);

  const getPokemonMapEntry = useCallback(function(apiName)
  {
    const key = resolvePokemonMapKey(apiName);
    const m = pokemonMapRef.current || {};
    const entry = m[key] || null;

    if (!entry) return null;

    const types = Array.isArray(entry.types) ? entry.types.slice() : [];

    return {
      id: typeof entry.id === "number" ? entry.id : null,
      types: types,
      displayES: getPokemonDisplay(key),
      apiName: key
    };

  }, [resolvePokemonMapKey]);

  const getPokemonIdByKey = useCallback(function(apiName)
  {
    const key = resolvePokemonMapKey(apiName);
    if (!key) return null;

    if(pokemonIdByKeyRef.current && pokemonIdByKeyRef.current.has(key))
    {
      return pokemonIdByKeyRef.current.get(key) || null;
    }

    const entry = getPokemonMapEntry(key);
    return (entry && typeof entry.id === "number") ? entry.id : null;

  }, [getPokemonMapEntry, resolvePokemonMapKey]);

  const getPokemonKeyById = useCallback(function(id)
  {
    const n = Number(id);
    if (!Number.isFinite(n) || n <= 0) return "";

    if(pokemonKeyByIdRef.current && pokemonKeyByIdRef.current.has(n))
    {
      return pokemonKeyByIdRef.current.get(n) || "";
    }

    const map = pokemonMapRef.current || {};
    const keys = Object.keys(map);
    for(let i = 0; i < keys.length; i++)
    {
      const key = keys[i];
      const entry = map[key] || {};
      if(Number(entry.id) === n)
      {
        return key;
      }
    }

    return "";

  }, []);

  const resolvePokemonInput = useCallback(function(input)
  {
    const raw = String(input || "").trim();
    if (!raw) return null;

    const slug = slugifyPokemonForUrl(raw);
    if(slugToKeyRef.current && slugToKeyRef.current.has(slug))
    {
      const k = slugToKeyRef.current.get(slug);

      return {
        key: k,
        slug: (keyToSlugRef.current && keyToSlugRef.current.get(k)) || slugifyPokemonForUrl(getPokemonDisplay(k)),
        display: getPokemonDisplay(k)
      };
    }

    const k2 = toPokemonApiKeyFromUserInput(raw);
    if(k2)
    {
      return {
        key: k2,
        slug: (keyToSlugRef.current && keyToSlugRef.current.get(k2)) || slugifyPokemonForUrl(getPokemonDisplay(k2)),
        display: getPokemonDisplay(k2)
      };
    }

    const k3 = raw.toLowerCase().trim();
    return {
      key: k3,
      slug: (keyToSlugRef.current && keyToSlugRef.current.get(k3)) || slugifyPokemonForUrl(getPokemonDisplay(k3)),
      display: getPokemonDisplay(k3)
    };

  }, []);

  const getPokemonSlug = useCallback(function(apiKey)
  {
    const k = String(apiKey || "").toLowerCase().trim();
    if (!k) return "";

    const slug = (keyToSlugRef.current && keyToSlugRef.current.get(k)) || "";
    if (slug) return slug;

    return slugifyPokemonForUrl(getPokemonDisplay(k)) || slugifyPokemonForUrl(k) || "";

  }, []);

  const searchIndex = useMemo(function()
  {
    const items = (index && index.length ? index : (loadPokemonIndex() || []));

    return items.map(function(p)
    {
      const apiName = p.apiName || p.name;
      const display = String(p.displayES || getPokemonDisplay(apiName));
      const tokens = [normalizePokemonText(apiName), normalizePokemonText(display)];

      return {
        id: p.id,
        key: apiName,
        apiName: apiName,
        displayES: display,
        types: Array.isArray(p.types) ? p.types.slice() : [],
        tokens: tokens
      };

    });

  }, [index]);

  function suggestPokemon(q, limit)
  {
    if (limit == null) limit = 8;
    const n = normalizePokemonText(q);
    if (!n) return [];

    const scored = [];
    for(let i = 0; i < searchIndex.length; i++)
    {
      const it = searchIndex[i];
      if (isPokemonBlocked(it.key)) continue;

      let score = -1;
      for(let j = 0; j < it.tokens.length; j++)
      {
        const t = it.tokens[j];
        if(t === n)
        {
          score = Math.max(score, 100);
          break;
        }

        if (t.indexOf(n) === 0) score = Math.max(score, 80);
        else if (t.indexOf(n) !== -1) score = Math.max(score, 50);
      }

      if (score >= 0) scored.push(Object.assign({}, it, { score: score }));
    }

    scored.sort(function(a, b)
    {
      return (b.score - a.score) || (a.displayES.length - b.displayES.length) || (a.id - b.id);
    });

    return scored.slice(0, limit).map(function(it)
    {
      return {
        id: it.id,
        key: it.key,
        apiName: it.apiName || it.key,
        displayES: it.displayES,
        types: Array.isArray(it.types) ? it.types.slice() : []
      };
    });
  }

  function getPokemonMini(apiName)
  {
    const key = resolvePokemonMapKey(apiName);
    if (!key) return null;

    const entry = getPokemonMapEntry(key);
    const id = entry ? entry.id : null;
    const types = entry ? entry.types : (getTypesIfCached(key) || []);

    return {
      key: key,
      apiName: key,
      id: id,
      displayES: getPokemonDisplay(key),
      types: types
    };
  }

  const clearSuggestCachePokemon = useCallback(function()
  {
    clearPokemonPersistentCaches();
    clearPokemonIndex();
    clearPokemonTypesSnapshot();

    try { pokemonMapRef.current = null; } catch (e) {}
    try { typesSnapshotRef.current = {}; } catch (e) {}
    try { typesByNameRef.current = new Map(); } catch (e) {}
    try { typesByIdRef.current = new Map(); } catch (e) {}
    try { slugToKeyRef.current = new Map(); } catch (e) {}
    try { keyToSlugRef.current = new Map(); } catch (e) {}

    try { setIndex([]); } catch (e) {}
    try { setPokemonMapReady(false); } catch (e) {}
    try { setLoadingIndex(true); } catch (e) {}

  }, []);

  const refreshSuggestCachePokemon = useCallback(function()
  {
    return new Promise(function(resolve)
    {
      forceManifestRefreshRef.current = true;
      refreshResolverRef.current = resolve;
      setRefreshTick(function(v) { return v + 1; });
    });

  }, []);

  const clearAllCachesPokemon = useCallback(function()
  {
    clearPokemonAllCaches();

    cache.current.clear();
    try { pokemonMapRef.current = null; } catch (e) {}
    try { typesSnapshotRef.current = {}; } catch (e) {}
    try { typesByNameRef.current = new Map(); } catch (e) {}
    try { typesByIdRef.current = new Map(); } catch (e) {}
    try { slugToKeyRef.current = new Map(); } catch (e) {}
    try { keyToSlugRef.current = new Map(); } catch (e) {}
    try { setIndex([]); } catch (e) {}
    try { setPokemonMapReady(false); } catch (e) {}
    try { setLoadingIndex(true); } catch (e) {}

  }, []);

  const value = useMemo(function()
  {
    return {
      index: index,
      loadingIndex: loadingIndex,
      pokemonMapReady: pokemonMapReady,

      pokemonMap: pokemonMapRef.current || {},
      getPokemonMapEntry: getPokemonMapEntry,
      getPokemonIdByKey: getPokemonIdByKey,
      getPokemonKeyById: getPokemonKeyById,

      getUrl: getUrl,
      getPokemon: getPokemon,
      getPokemonSpecies: getPokemonSpecies,
      getPokemonEvolutionChain: getPokemonEvolutionChain,
      getPokemonMini: getPokemonMini,

      has: function(url) { return cache.current.has(url); },

      suggestPokemon: suggestPokemon,
      toApiKeyFromUserInput: toPokemonApiKeyFromUserInput,
      isBlockedKey: isPokemonBlocked,

      getTypesIfCached: getTypesIfCached,
      getTypesByIdIfCached: getTypesByIdIfCached,

      clearSuggestCachePokemon: clearSuggestCachePokemon,
      refreshSuggestCachePokemon: refreshSuggestCachePokemon,
      clearAllCachesPokemon: clearAllCachesPokemon,

      resolvePokemonInput: resolvePokemonInput,
      getPokemonSlug: getPokemonSlug
    };

  }, [
    index,
    loadingIndex,
    pokemonMapReady,
    getPokemonMapEntry,
    getPokemonIdByKey,
    getPokemonKeyById,
    getUrl,
    getPokemon,
    getPokemonSpecies,
    getPokemonEvolutionChain,
    getPokemonMini,
    getTypesIfCached,
    getTypesByIdIfCached,
    clearSuggestCachePokemon,
    refreshSuggestCachePokemon,
    clearAllCachesPokemon,
    resolvePokemonInput,
    getPokemonSlug
  ]);

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}

export function usePokemon()
{
  const ctx = useContext(PokemonContext);
  if (!ctx) throw new Error("usePokemon debe usarse dentro de <PokemonProvider>");

  return ctx;
}
