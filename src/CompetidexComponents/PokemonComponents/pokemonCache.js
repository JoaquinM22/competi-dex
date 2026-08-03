//** src\CompetidexComponents\PokemonComponents\pokemonCache.js

const CACHE_VERSION = "v1";

const PREFIX = `competidex:pokemon:${CACHE_VERSION}`;

const KEY_MANIFEST = `${PREFIX}:manifest`;
const KEY_MANIFEST_AT = `${PREFIX}:manifestAt`;
const KEY_MAP = `${PREFIX}:map`;
const KEY_MAP_AT = `${PREFIX}:mapAt`;
const KEY_LAST_MAP_URL = `${PREFIX}:lastMapUrl`;

const KEY_INDEX = `${PREFIX}:index`;
const KEY_INDEX_AT = `${PREFIX}:indexAt`;
const KEY_TYPES = `${PREFIX}:types`;

function safeJsonParse(value, fallback)
{
  try
  {
    return JSON.parse(value);

  }catch(e)
  {
    return fallback;
  }
}

function lsGet(key)
{
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function lsSet(key, val)
{
  try { localStorage.setItem(key, val); } catch (e) {}
}

function lsRemove(key)
{
  try { localStorage.removeItem(key); } catch (e) {}
}

function ssGet(key)
{
  try { return sessionStorage.getItem(key); } catch (e) { return null; }
}

function ssSet(key, val)
{
  try { sessionStorage.setItem(key, val); } catch (e) {}
}

function ssRemove(key)
{
  try { sessionStorage.removeItem(key); } catch (e) {}
}

export function loadPokemonPersistentCaches()
{
  return {
    manifest: safeJsonParse(lsGet(KEY_MANIFEST) || "null", null),
    manifestAt: Number(lsGet(KEY_MANIFEST_AT) || 0) || 0,
    map: safeJsonParse(lsGet(KEY_MAP) || "null", null),
    mapAt: Number(lsGet(KEY_MAP_AT) || 0) || 0,
    lastMapUrl: String(lsGet(KEY_LAST_MAP_URL) || "")
  };
}

export function savePokemonPersistentCaches(manifest, map, manifestAt, mapAt, lastMapUrl)
{
  lsSet(KEY_MANIFEST, JSON.stringify(manifest ?? null));
  lsSet(KEY_MANIFEST_AT, String(manifestAt || Date.now()));
  lsSet(KEY_MAP, JSON.stringify(map ?? null));
  lsSet(KEY_MAP_AT, String(mapAt || Date.now()));
  lsSet(KEY_LAST_MAP_URL, String(lastMapUrl || ""));
}

export function clearPokemonPersistentCaches()
{
  lsRemove(KEY_MANIFEST);
  lsRemove(KEY_MANIFEST_AT);
  lsRemove(KEY_MAP);
  lsRemove(KEY_MAP_AT);
  lsRemove(KEY_LAST_MAP_URL);
}

export function loadPokemonIndex()
{
  try
  {
    const raw = ssGet(KEY_INDEX);
    if (!raw) return null;

    return JSON.parse(raw);

  }catch(e)
  {
    return null;
  }
}

export function savePokemonIndex(list)
{
  ssSet(KEY_INDEX, JSON.stringify(list || []));
}

export function loadPokemonIndexAt()
{
  try
  {
    const v = ssGet(KEY_INDEX_AT);
    return v ? Number(v) : null;

  }catch(e)
  {
    return null;
  }
}

export function savePokemonIndexAt(ts)
{
  ssSet(KEY_INDEX_AT, String(ts || Date.now()));
}

export function clearPokemonIndex()
{
  ssRemove(KEY_INDEX);
  ssRemove(KEY_INDEX_AT);
}

export function loadPokemonTypesSnapshot()
{
  try
  {
    const raw = ssGet(KEY_TYPES);
    if (!raw) return null;

    return JSON.parse(raw);

  }catch(e)
  {
    return null;
  }
}

export function savePokemonTypesSnapshot(obj)
{
  ssSet(KEY_TYPES, JSON.stringify(obj || {}));
}

export function clearPokemonTypesSnapshot()
{
  ssRemove(KEY_TYPES);
}

export function clearPokemonAllCaches()
{
  clearPokemonPersistentCaches();
  clearPokemonIndex();
  clearPokemonTypesSnapshot();
}

export { CACHE_VERSION };
