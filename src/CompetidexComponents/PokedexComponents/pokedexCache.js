//** src\CompetidexComponents\PokedexComponents\pokedexCache.js

import { POKEAPI } from "../../config/endpoints";
import {
  getPokedexDataMetaByKey,
  getPokedexApiKeys,
  toPokemonDisplayName
} from "../../utils/competidexMeta";

// Cache version (frontend)
const CACHE_VERSION = "v1";
const PREFIX = `competidex:pokedex:${CACHE_VERSION}`;
const POKEDEX_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 Días

const KEY_MAP = (apiKey) => `${PREFIX}:map:${apiKey}`;
const KEY_MAP_AT = (apiKey) => `${PREFIX}:mapAt:${apiKey}`;

const pokedexCache = {};
const pokedexLoading = {};
const pokedexMeta = {};

function normalizePokedexKey(input)
{
  return String(input || "").trim().toLowerCase();
}

function safeJsonParse(value, fallback = null)
{
  try
  {
    return JSON.parse(value);

  }catch
  {
    return fallback;
  }
}

function lsGet(key)
{
  try { return localStorage.getItem(key); } catch { return null; }
}

function lsSet(key, value)
{
  try { localStorage.setItem(key, value); } catch {}
}

function lsRemove(key)
{
  try { localStorage.removeItem(key); } catch {}
}

function buildPokedexEntriesFromRaw(raw)
{
  const out = {};
  const entries = Array.isArray(raw?.pokemon_entries) ? raw.pokemon_entries : [];

  for(const entry of entries)
  {
    const entryNumber = Number(entry?.entry_number);
    const species = entry?.pokemon_species || {};
    const rawName = normalizePokedexKey(species?.name);
    const speciesUrl = String(species?.url || "").trim();

    if(!entryNumber || !rawName || !speciesUrl)
    {
      continue;
    }

    const speciesId = parseInt(String(speciesUrl).split("/").filter(Boolean).pop(), 10);
    if(!Number.isFinite(speciesId))
    {
      continue;
    }

    out[String(entryNumber)] = {
      entry: entryNumber,
      speciesId: speciesId,
      name: rawName,
      display: toPokemonDisplayName(rawName)
    };
  }

  return out;
}

function loadPokedexPersistentRegion(apiKey)
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return null;

  const map = safeJsonParse(lsGet(KEY_MAP(key)) || "null", null);
  const mapAt = Number(lsGet(KEY_MAP_AT(key)) || 0) || 0;

  if(mapAt > 0)
  {
    pokedexMeta[key] = { mapAt };
  }

  return {
    map: (map && typeof map === "object") ? map : null,
    mapAt: mapAt
  };
}

function savePokedexPersistentRegion(apiKey, map, mapAt = Date.now())
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return;

  const savedAt = Number(mapAt) || Date.now();
  pokedexMeta[key] = { mapAt: savedAt };

  lsSet(KEY_MAP(key), JSON.stringify(map ?? null));
  lsSet(KEY_MAP_AT(key), String(savedAt));
}

function clearPokedexPersistentRegion(apiKey)
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return;

  lsRemove(KEY_MAP(key));
  lsRemove(KEY_MAP_AT(key));

  try { delete pokedexCache[key]; } catch {}
  try { delete pokedexLoading[key]; } catch {}
  try { delete pokedexMeta[key]; } catch {}
}

export function clearAllPokedexCache()
{
  try
  {
    const keys = Object.keys(localStorage);
    for(const key of keys)
    {
      if(String(key || "").indexOf(PREFIX) === 0)
      {
        localStorage.removeItem(key);
      }
    }

  }catch {}

  try
  {
    Object.keys(pokedexCache).forEach((k) => { delete pokedexCache[k]; });
    Object.keys(pokedexLoading).forEach((k) => { delete pokedexLoading[k]; });
    Object.keys(pokedexMeta).forEach((k) => { delete pokedexMeta[k]; });

  }catch {}
}

export async function refreshAllPokedexCache(poolSize = 6)
{
  const keys = getPokedexApiKeys(true);
  if(!keys.length)
  {
    return {
      refreshedCount: 0,
      totalCount: 0,
      anyRefreshed: false,
      results: []
    };
  }

  const results = new Array(keys.length);
  let p = 0;

  async function worker()
  {
    while(p < keys.length)
    {
      const idx = p++;
      const key = keys[idx];

      try
      {
        results[idx] = await refreshPokedexRegion(key, { force: true });

      }catch(error)
      {
        results[idx] = {
          apiKey: key,
          refreshed: false,
          map: getPokedex(key),
          error
        };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(poolSize, keys.length) }, worker));

  const refreshedCount = results.filter((item) => !!item?.refreshed).length;

  return {
    refreshedCount,
    totalCount: keys.length,
    anyRefreshed: refreshedCount > 0,
    results
  };
}

function getPokedexRegionTimestamp(apiKey)
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return 0;

  const cachedAt = Number(pokedexMeta[key]?.mapAt || 0) || 0;
  if(cachedAt > 0)
  {
    return cachedAt;
  }

  const persisted = loadPokedexPersistentRegion(key);
  const persistedAt = Number(persisted?.mapAt || 0) || 0;
  if(persistedAt > 0)
  {
    pokedexMeta[key] = { mapAt: persistedAt };
  }

  return persistedAt;
}

export function isPokedexRegionExpired(apiKey, ttlMs = POKEDEX_CACHE_TTL_MS)
{
  const ttl = Number(ttlMs);
  if(!Number.isFinite(ttl) || ttl <= 0)
  {
    return false;
  }

  const savedAt = getPokedexRegionTimestamp(apiKey);
  if(!savedAt)
  {
    return true;
  }

  return (Date.now() - savedAt) >= ttl;
}

export async function refreshPokedexRegion(apiKey, opts = {})
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return { apiKey: key, refreshed: false, map: {} };

  const force = !!opts.force;
  const expired = isPokedexRegionExpired(key);

  if(!force && !expired)
  {
    const cached = getPokedex(key);
    return {
      apiKey: key,
      refreshed: false,
      map: cached,
      expired: false
    };
  }

  const map = await ensurePokedex(key, { force: true });

  return {
    apiKey: key,
    refreshed: true,
    map: (map && typeof map === "object") ? map : {},
    expired: true
  };
}

export function getPokedex(apiKey)
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return {};

  if(pokedexCache[key])
  {
    return pokedexCache[key];
  }

  const persisted = loadPokedexPersistentRegion(key);
  if(persisted?.map)
  {
    pokedexCache[key] = persisted.map;
    if(Number.isFinite(persisted?.mapAt) && persisted.mapAt > 0)
    {
      pokedexMeta[key] = { mapAt: persisted.mapAt };
    }
    return persisted.map;
  }

  return {};
}

export function getPokedexEntry(apiKey, entryNumber)
{
  const dex = getPokedex(apiKey);
  return dex?.[String(entryNumber)] || null;
}

export function getPrevNext(apiKey, entryNumber)
{
  const dex = getPokedex(apiKey);
  if(!dex || typeof dex !== "object")
  {
    return { prev: null, next: null };
  }

  const n = Number(entryNumber);
  if(!Number.isFinite(n))
  {
    return { prev: null, next: null };
  }

  function findPrev(current)
  {
    for(let i = current - 1; i >= 1; i--)
    {
      if(dex[i]) return dex[i];
    }

    return null;
  }

  function findNext(current)
  {
    const keys = Object.keys(dex).map(Number).filter(Number.isFinite);
    const max = keys.length ? Math.max.apply(null, keys) : 0;

    for(let i = current + 1; i <= max; i++)
    {
      if(dex[i]) return dex[i];
    }

    return null;
  }

  return {
    prev: findPrev(n),
    next: findNext(n)
  };
}

export async function ensurePokedex(apiKey, opts)
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return null;

  const meta = getPokedexDataMetaByKey(key);
  if(!meta)
  {
    return null;
  }

  opts = opts || {};
  const force = !!opts.force;
  const expired = isPokedexRegionExpired(key);

  if(pokedexCache[key] && !force && !expired)
  {
    return pokedexCache[key];
  }

  if(!force && !expired)
  {
    const persisted = loadPokedexPersistentRegion(key);
    if(persisted?.map)
    {
      pokedexCache[key] = persisted.map;
      return persisted.map;
    }
  }

  if(pokedexLoading[key] && !force)
  {
    return pokedexLoading[key];
  }

  pokedexLoading[key] = (async() =>
  {
    try
    {
      const res = await fetch(POKEAPI.pokedex(key), { headers: { accept: "application/json" } });
      if(!res.ok)
      {
        throw new Error(`HTTP ${res.status} GET ${POKEAPI.pokedex(key)}`);
      }

      const json = await res.json();
      const map = buildPokedexEntriesFromRaw(json);

      pokedexCache[key] = map;
      savePokedexPersistentRegion(key, map, Date.now());

      return map;

    }catch(error)
    {
      const persisted = loadPokedexPersistentRegion(key);
      if(persisted?.map)
      {
        pokedexCache[key] = persisted.map;
        return persisted.map;
      }

      console.warn("No pude cargar la pokedex:", key, error);
      return {};

    }finally
    {
      delete pokedexLoading[key];
    }
  })();

  return pokedexLoading[key];
}

function normalizeKeyList(regions)
{
  if(!Array.isArray(regions))
  {
    return [];
  }

  const out = [];
  const seen = new Set();

  for(const region of regions)
  {
    const key = normalizePokedexKey(typeof region === "string" ? region : region?.apiKey);
    if(!key || seen.has(key)) continue;

    seen.add(key);
    out.push(key);
  }

  return out;
}

export async function precargarPokedex(regions, poolSize = 6)
{
  const keys = normalizeKeyList(regions);
  if(!keys.length) return [];

  const out = new Array(keys.length);
  let p = 0;

  async function worker()
  {
    while(p < keys.length)
    {
      const idx = p++;
      const key = keys[idx];

      try
      {
        out[idx] = await ensurePokedex(key);

      }catch
      {
        out[idx] = {};
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(poolSize, keys.length) }, worker));

  return out;
}

export async function precargarTodasLasPokedex(poolSize = 6)
{
  return await precargarPokedex(getPokedexApiKeys(true), poolSize);
}

export function clearPokedexRegion(apiKey)
{
  clearPokedexPersistentRegion(apiKey);
}

export function getPokedexPersistentRegion(apiKey)
{
  return loadPokedexPersistentRegion(apiKey);
}

export function savePokedexRegion(apiKey, map)
{
  const key = normalizePokedexKey(apiKey);
  if(!key) return;

  pokedexCache[key] = (map && typeof map === "object") ? map : {};
  savePokedexPersistentRegion(key, pokedexCache[key], Date.now());
}

export { CACHE_VERSION };
