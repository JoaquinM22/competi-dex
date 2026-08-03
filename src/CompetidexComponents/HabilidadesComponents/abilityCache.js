//** src\CompetidexComponents\HabilidadesComponents\abilityCache.js

// Cache version (frontend)
const CACHE_VERSION = "v1";

const PREFIX = `competidex:abilities:${CACHE_VERSION}`;

const KEY_MANIFEST = `${PREFIX}:manifest`;
const KEY_MANIFEST_AT = `${PREFIX}:manifestAt`;
const KEY_MAP = `${PREFIX}:map`;
const KEY_MAP_AT = `${PREFIX}:mapAt`;
const KEY_MAP_VER = `${PREFIX}:mapVersion`;
const KEY_LAST_MAP_URL = `${PREFIX}:lastMapUrl`;
const KEY_WARM = `${PREFIX}:warm`;
const KEY_RAW = `${PREFIX}:raw`;

function safeJsonParse(x, fallback)
{
  try
  {
    return JSON.parse(x);

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

function mapToArray(map)
{
  return Array.from((map || new Map()).entries());
}

function arrayToMap(arr)
{
  try { return new Map(arr || []); } catch (e) { return new Map(); }
}

export function loadAbilitiesPersistentCaches()
{
  return {
    manifest: safeJsonParse(lsGet(KEY_MANIFEST) || "null", null),
    manifestAt: Number(lsGet(KEY_MANIFEST_AT) || 0) || 0,
    map: safeJsonParse(lsGet(KEY_MAP) || "null", null),
    mapAt: Number(lsGet(KEY_MAP_AT) || 0) || 0,
    mapVersion: String(lsGet(KEY_MAP_VER) || ""),
    lastMapUrl: String(lsGet(KEY_LAST_MAP_URL) || "")
  };
}

export function saveAbilitiesPersistentCaches(manifest, map, manifestAt, mapAt, mapVersion, lastMapUrl)
{
  lsSet(KEY_MANIFEST, JSON.stringify(manifest ?? null));
  lsSet(KEY_MANIFEST_AT, String(manifestAt || Date.now()));
  lsSet(KEY_MAP, JSON.stringify(map ?? null));
  lsSet(KEY_MAP_AT, String(mapAt || Date.now()));
  lsSet(KEY_MAP_VER, String(mapVersion || ""));
  lsSet(KEY_LAST_MAP_URL, String(lastMapUrl || ""));
}

export function clearAbilitiesPersistentCaches()
{
  lsRemove(KEY_MANIFEST);
  lsRemove(KEY_MANIFEST_AT);
  lsRemove(KEY_MAP);
  lsRemove(KEY_MAP_AT);
  lsRemove(KEY_MAP_VER);
  lsRemove(KEY_LAST_MAP_URL);
}

export function loadAbilitiesWarmCache()
{
  try
  {
    const raw = ssGet(KEY_WARM);
    if (!raw) return null;

    return new Map(JSON.parse(raw));

  }catch(e)
  {
    return null;
  }
}

export function saveAbilitiesWarmCache(map)
{
  ssSet(KEY_WARM, JSON.stringify(mapToArray(map)));
}

export function clearAbilitiesWarmCache()
{
  ssRemove(KEY_WARM);
}

export function loadAbilitiesRawCache()
{
  try
  {
    const raw = ssGet(KEY_RAW);
    if (!raw) return null;

    return new Map(JSON.parse(raw));

  }catch(e)
  {
    return null;
  }
}

export function saveAbilitiesRawCache(map)
{
  ssSet(KEY_RAW, JSON.stringify(mapToArray(map)));
}

export function clearAbilitiesRawCache()
{
  ssRemove(KEY_RAW);
}

export { CACHE_VERSION };
