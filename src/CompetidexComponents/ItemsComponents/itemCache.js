//** src\CompetidexComponents\ItemsComponents\itemCache.js

// Cache version (frontend)
const CACHE_VERSION = "v1";

const PREFIX = `competidex:items:${CACHE_VERSION}`;

const KEY_PERSIST_ENABLED = `${PREFIX}:persistEnabled`;
const KEY_WARM_LS = `${PREFIX}:warm`;
const KEY_RAW_LS = `${PREFIX}:raw`;
const KEY_MANIFEST_LS = `${PREFIX}:manifest`;
const KEY_MANIFEST_AT_LS = `${PREFIX}:manifestAt`;
const KEY_ITEMMAP_LS = `${PREFIX}:itemMap`;
const KEY_ITEMMAP_AT_LS = `${PREFIX}:itemMapAt`;
const KEY_LAST_ITEMMAP_URL = `${PREFIX}:lastItemMapUrl`;
const KEY_INDEX_SS = `${PREFIX}:index`;
const KEY_INDEX_AT_SS = `${PREFIX}:indexAt`;

function safeParse(json, fallback)
{
  try { return JSON.parse(json); } catch (e) { return fallback; }
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

export function isItemsPersistenceEnabled()
{
  return lsGet(KEY_PERSIST_ENABLED) === "1";
}

export function setItemsPersistenceEnabled(enabled)
{
  lsSet(KEY_PERSIST_ENABLED, enabled ? "1" : "0");
}

export function loadItemsPersistentCaches()
{
  return {
    manifest: safeParse(lsGet(KEY_MANIFEST_LS) || "null", null),
    itemMap: safeParse(lsGet(KEY_ITEMMAP_LS) || "null", null),
    manifestAt: Number(lsGet(KEY_MANIFEST_AT_LS) || 0) || 0,
    itemMapAt: Number(lsGet(KEY_ITEMMAP_AT_LS) || 0) || 0,
    lastItemMapUrl: String(lsGet(KEY_LAST_ITEMMAP_URL) || "")
  };
}

export function saveItemsPersistentCaches(manifest, itemMap, manifestAt, itemMapAt, lastItemMapUrl)
{
  lsSet(KEY_MANIFEST_LS, JSON.stringify(manifest ?? null));
  lsSet(KEY_ITEMMAP_LS, JSON.stringify(itemMap ?? null));
  lsSet(KEY_MANIFEST_AT_LS, String(manifestAt || Date.now()));
  lsSet(KEY_ITEMMAP_AT_LS, String(itemMapAt || Date.now()));
  lsSet(KEY_LAST_ITEMMAP_URL, String(lastItemMapUrl || ""));
}

export function clearItemsPersistentCaches()
{
  lsRemove(KEY_MANIFEST_LS);
  lsRemove(KEY_ITEMMAP_LS);
  lsRemove(KEY_MANIFEST_AT_LS);
  lsRemove(KEY_ITEMMAP_AT_LS);
  lsRemove(KEY_LAST_ITEMMAP_URL);
}

export function loadItemsIndex()
{
  try
  {
    const raw = ssGet(KEY_INDEX_SS);
    if (!raw) return null;

    return JSON.parse(raw);

  }catch(e)
  {
    return null;
  }
}

export function saveItemsIndex(list)
{
  ssSet(KEY_INDEX_SS, JSON.stringify(list || []));
}

export function loadItemsIndexAt()
{
  try
  {
    const v = ssGet(KEY_INDEX_AT_SS);
    return v ? Number(v) : null;

  }catch(e)
  {
    return null;
  }
}

export function saveItemsIndexAt(ts)
{
  ssSet(KEY_INDEX_AT_SS, String(ts || Date.now()));
}

export function clearItemsIndex()
{
  ssRemove(KEY_INDEX_SS);
  ssRemove(KEY_INDEX_AT_SS);
}

export function loadItemsWarmCache()
{
  try
  {
    const raw = ssGet(KEY_WARM_LS);
    if (!raw) return null;

    return new Map(JSON.parse(raw));

  }catch(e)
  {
    return null;
  }
}

export function saveItemsWarmCache(map)
{
  ssSet(KEY_WARM_LS, JSON.stringify(mapToArray(map)));
}

export function clearItemsWarmCache()
{
  ssRemove(KEY_WARM_LS);
}

export function loadItemsRawCache()
{
  try
  {
    const raw = ssGet(KEY_RAW_LS);
    if (!raw) return null;

    return new Map(JSON.parse(raw));

  }catch(e)
  {
    return null;
  }
}

export function saveItemsRawCache(map)
{
  ssSet(KEY_RAW_LS, JSON.stringify(mapToArray(map)));
}

export function clearItemsRawCache()
{
  ssRemove(KEY_RAW_LS);
}

export { CACHE_VERSION };
