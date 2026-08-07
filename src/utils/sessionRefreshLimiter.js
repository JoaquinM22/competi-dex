//** src\utils\sessionRefreshLimiter.js

const PREFIX = "competidex:session-refresh-limit:v1";
const DEFAULT_WINDOW_MS = 1000 * 60 * 60 * 24; // 24 horas

function getStorage(kind = "session")
{
  if(typeof window === "undefined")
  {
    return null;
  }

  return String(kind || "").toLowerCase() === "local"
    ? window.localStorage
    : window.sessionStorage;
}

function safeGet(kind, key)
{
  try
  {
    const storage = getStorage(kind);
    return storage ? storage.getItem(key) : null;
  }catch(e)
  {
    return null;
  }
}

function safeSet(kind, key, value)
{
  try
  {
    const storage = getStorage(kind);
    if(storage) storage.setItem(key, value);
  }catch(e) {}
}

function safeRemove(kind, key)
{
  try
  {
    const storage = getStorage(kind);
    if(storage) storage.removeItem(key);
  }catch(e) {}
}

function safeParseInt(value, fallback = 0)
{
  const n = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function safeParseJson(value, fallback)
{
  try
  {
    return JSON.parse(value);
  }catch(e)
  {
    return fallback;
  }
}

function buildKey(scope)
{
  return `${PREFIX}:${String(scope || "").trim().toLowerCase()}`;
}

function readState(scope, storageKind)
{
  return safeParseJson(safeGet(storageKind, buildKey(scope)), null) || {};
}

function writeState(scope, state, storageKind)
{
  safeSet(storageKind, buildKey(scope), JSON.stringify(state || {}));
}

export function getSessionRefreshCount(scope, options = {})
{
  const storageKind = String(options.storage || "session").toLowerCase();
  const state = readState(scope, storageKind);
  return safeParseInt(state.count, 0);
}

export function canConsumeSessionRefresh(scope, limit = 3, windowMs = DEFAULT_WINDOW_MS, options = {})
{
  const storageKind = String(options.storage || "session").toLowerCase();
  const state = readState(scope, storageKind);
  const max = Math.max(1, safeParseInt(limit, 3));
  const ttl = Math.max(1000, safeParseInt(windowMs, DEFAULT_WINDOW_MS));
  const now = Date.now();
  const startedAt = safeParseInt(state.startedAt, 0);
  const expired = !startedAt || (now - startedAt) >= ttl;
  const current = expired ? 0 : safeParseInt(state.count, 0);

  return {
    allowed: current < max,
    current,
    limit: max,
    remaining: Math.max(0, max - current),
    startedAt: expired ? now : startedAt,
    windowMs: ttl,
    expired,
    storage: storageKind
  };
}

export function consumeSessionRefresh(scope, limit = 3, windowMs = DEFAULT_WINDOW_MS, options = {})
{
  const storageKind = String(options.storage || "session").toLowerCase();
  const state = canConsumeSessionRefresh(scope, limit, windowMs, { storage: storageKind });
  if (!state.allowed)
  {
    return state;
  }

  const nextCount = state.current + 1;
  writeState(scope, {
    count: nextCount,
    startedAt: state.startedAt
  }, storageKind);

  return {
    ...state,
    current: nextCount,
    remaining: Math.max(0, state.limit - nextCount),
    allowed: true
  };
}

export function resetSessionRefreshScope(scope, options = {})
{
  const storageKind = String(options.storage || "session").toLowerCase();
  safeRemove(storageKind, buildKey(scope));
}
