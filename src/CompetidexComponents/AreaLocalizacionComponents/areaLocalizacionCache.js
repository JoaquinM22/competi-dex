//** src\CompetidexComponents\AreaLocalizacionComponents\areaLocalizacionCache.js

import { POKEAPI } from "../../config/endpoints";

const CACHE_VERSION = "v1";
const PREFIX = `competidex:area-localizacion:${CACHE_VERSION}`;

const KEY_RAW = (pokemonKey) => `${PREFIX}:raw:${pokemonKey}`;
const KEY_RAW_AT = (pokemonKey) => `${PREFIX}:rawAt:${pokemonKey}`;

const areaLocalizacionCache = {};
const areaLocalizacionLoading = {};

function normalizePokemonKey(input)
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

function loadPersistentRaw(pokemonKey)
{
  const key = normalizePokemonKey(pokemonKey);
  if(!key) return null;

  const raw = safeJsonParse(lsGet(KEY_RAW(key)) || "null", null);
  const rawAt = Number(lsGet(KEY_RAW_AT(key)) || 0) || 0;

  return {
    raw: Array.isArray(raw) ? raw : null,
    rawAt: rawAt
  };
}

function savePersistentRaw(pokemonKey, raw, rawAt = Date.now())
{
  const key = normalizePokemonKey(pokemonKey);
  if(!key) return;

  lsSet(KEY_RAW(key), JSON.stringify(Array.isArray(raw) ? raw : []));
  lsSet(KEY_RAW_AT(key), String(rawAt || Date.now()));
}

function clearPersistentRaw(pokemonKey)
{
  const key = normalizePokemonKey(pokemonKey);
  if(!key) return;

  lsRemove(KEY_RAW(key));
  lsRemove(KEY_RAW_AT(key));

  try { delete areaLocalizacionCache[key]; } catch {}
  try { delete areaLocalizacionLoading[key]; } catch {}
}

export function getAreaLocalizacionRaw(pokemonKey)
{
  const key = normalizePokemonKey(pokemonKey);
  if(!key) return [];

  if(Array.isArray(areaLocalizacionCache[key]))
  {
    return areaLocalizacionCache[key];
  }

  const persisted = loadPersistentRaw(key);
  if(Array.isArray(persisted?.raw))
  {
    areaLocalizacionCache[key] = persisted.raw;
    return persisted.raw;
  }

  return [];
}

export async function ensureAreaLocalizacionRaw(pokemonKey, opts)
{
  const key = normalizePokemonKey(pokemonKey);
  if(!key) return [];

  opts = opts || {};
  const force = !!opts.force;

  if(Array.isArray(areaLocalizacionCache[key]) && !force)
  {
    return areaLocalizacionCache[key];
  }

  if(!force)
  {
    const persisted = loadPersistentRaw(key);
    if(Array.isArray(persisted?.raw))
    {
      areaLocalizacionCache[key] = persisted.raw;
      return persisted.raw;
    }

    if(areaLocalizacionLoading[key])
    {
      return areaLocalizacionLoading[key];
    }
  }

  areaLocalizacionLoading[key] = (async() =>
  {
    try
    {
      const res = await fetch(POKEAPI.pokemonEncounters(key), {
        headers: { accept: "application/json" }
      });

      if(!res.ok)
      {
        throw new Error(`HTTP ${res.status} GET ${POKEAPI.pokemonEncounters(key)}`);
      }

      const json = await res.json();
      const raw = Array.isArray(json) ? json : [];

      areaLocalizacionCache[key] = raw;
      savePersistentRaw(key, raw, Date.now());

      return raw;

    }catch(error)
    {
      const persisted = loadPersistentRaw(key);
      if(Array.isArray(persisted?.raw))
      {
        areaLocalizacionCache[key] = persisted.raw;
        return persisted.raw;
      }

      console.warn("No pude cargar las areas de localizacion:", key, error);
      return [];

    }finally
    {
      delete areaLocalizacionLoading[key];
    }
  })();

  return areaLocalizacionLoading[key];
}

function normalizeKeyList(list)
{
  if(!Array.isArray(list)) return [];

  const out = [];
  const seen = new Set();

  for(const item of list)
  {
    const key = normalizePokemonKey(typeof item === "string" ? item : item?.pokemonId ?? item?.id ?? item?.key);
    if(!key || seen.has(key)) continue;

    seen.add(key);
    out.push(key);
  }

  return out;
}

export async function preloadAreaLocalizacion(list, poolSize = 6)
{
  const keys = normalizeKeyList(list);
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
        out[idx] = await ensureAreaLocalizacionRaw(key);

      }catch
      {
        out[idx] = [];
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(poolSize, keys.length) }, worker));

  return out;
}

export function clearAreaLocalizacionRaw(pokemonKey)
{
  clearPersistentRaw(pokemonKey);
}

export function clearAllAreaLocalizacionCache()
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
    Object.keys(areaLocalizacionCache).forEach((k) => { delete areaLocalizacionCache[k]; });
    Object.keys(areaLocalizacionLoading).forEach((k) => { delete areaLocalizacionLoading[k]; });

  }catch {}
}

export function getAreaLocalizacionPersistentRaw(pokemonKey)
{
  return loadPersistentRaw(pokemonKey);
}

export function saveAreaLocalizacionRaw(pokemonKey, raw)
{
  const key = normalizePokemonKey(pokemonKey);
  if(!key) return;

  areaLocalizacionCache[key] = Array.isArray(raw) ? raw : [];
  savePersistentRaw(key, areaLocalizacionCache[key], Date.now());
}

export { CACHE_VERSION };