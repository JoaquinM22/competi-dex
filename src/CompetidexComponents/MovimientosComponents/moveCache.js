//** src\CompetidexComponents\MovimientosComponents\moveCache.js

// Persistencia en localStorage SOLO del "summary reducido" + machineCache.

// Cache version (frontend)
const CACHE_VERSION = "v1";

const PREFIX = `competidex:moves:${CACHE_VERSION}`;

const KEY_PERSIST_ENABLED = `${PREFIX}:persistEnabled`;
const KEY_WARM_LS = `${PREFIX}:warmReduced`; // Map(apiKey -> reducedSummary) serializado
const KEY_MACH_LS = `${PREFIX}:machines`; // Map(machineId -> code) serializado
const KEY_SAVED_AT = `${PREFIX}:savedAt`;

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

function mapToArray(map)
{
  return Array.from((map || new Map()).entries());
}

function arrayToMap(arr)
{
  try { return new Map(arr || []); } catch (e) { return new Map(); }
}

export function isMovesPersistenceEnabled()
{
  const current = lsGet(KEY_PERSIST_ENABLED);

  if(current === null || current === undefined)
  {
    lsSet(KEY_PERSIST_ENABLED, "1");

    return true;
  }

  return current === "1";
}

export function setMovesPersistenceEnabled(enabled)
{
  lsSet(KEY_PERSIST_ENABLED, enabled ? "1" : "0");
}

export function loadMovesPersistentCaches()
{
  const warmArr = safeParse(lsGet(KEY_WARM_LS) || "null", null);
  const machArr = safeParse(lsGet(KEY_MACH_LS) || "null", null);

  return {
    warmReduced: arrayToMap(warmArr),
    machines: arrayToMap(machArr),
    savedAt: Number(lsGet(KEY_SAVED_AT) || 0) || 0
  };

}

export function saveMovesPersistentCaches(warmReducedMap, machineMap)
{
  lsSet(KEY_WARM_LS, JSON.stringify(mapToArray(warmReducedMap)));
  lsSet(KEY_MACH_LS, JSON.stringify(mapToArray(machineMap)));
  lsSet(KEY_SAVED_AT, String(Date.now()));
}

export function clearMovesPersistentCaches()
{
  lsRemove(KEY_WARM_LS);
  lsRemove(KEY_MACH_LS);
  lsRemove(KEY_SAVED_AT);
}

export { CACHE_VERSION };
