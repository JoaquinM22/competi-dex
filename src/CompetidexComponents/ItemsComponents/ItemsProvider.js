//** src\CompetidexComponents\ItemsComponents\ItemsProvider.js

import React, {
  createContext, useContext, useMemo, useRef, useEffect, useCallback, useState
} from "react";
import { POKEAPI, COMPETIDEX_DATA } from "../../config/endpoints";
import {
  loadItemsPersistentCaches,
  saveItemsPersistentCaches,
  clearItemsPersistentCaches,
  loadItemsIndex,
  saveItemsIndex,
  loadItemsIndexAt,
  saveItemsIndexAt,
  clearItemsIndex,
  loadItemsWarmCache,
  saveItemsWarmCache,
  clearItemsWarmCache,
  loadItemsRawCache,
  saveItemsRawCache,
  clearItemsRawCache
} from "./itemCache";
import { getCategoryItemIsAllowed } from "../../utils/competidexMeta";

const ItemsContext = createContext(null);

//** Json con todos los Items para el buscador, posee esta forma:
/*
  {
    "master-ball": {
      "id": 1,
      "display": "Master Ball",
      "category": "standard-balls"
    },
    "ultra-ball": {
      "id": 2,
      "display": "Ultra Ball",
      "category": "standard-balls"
    },
    "great-ball": {
      "id": 3,
      "display": "Super Ball",
      "category": "standard-balls"
    },
    ....
  }
*/

const INDEX_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const MANIFEST_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

function itemKey(nameOrId)
{
  if (typeof nameOrId === "string") return nameOrId.trim().toLowerCase();
  return String(nameOrId);
}

function clean(s)
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

function setIfAbsent(map, key, value)
{
  if (!key || map.has(key)) return;
  map.set(key, value);
}

function getItemCategoryFromMapEntry(entry)
{
  if (!entry || typeof entry !== "object") return "";
  return String(entry.category || "").trim().toLowerCase();
}

function isAllowedItemEntry(entry)
{
  const category = getItemCategoryFromMapEntry(entry);
  return getCategoryItemIsAllowed(category);
}

function buildIndexFromItemMap(itemMapObj)
{
  const keys = Object.keys(itemMapObj || {}).filter(function(name)
  {
    return isAllowedItemEntry(itemMapObj[name]);
  });

  keys.sort(function(a, b)
  {
    return a.localeCompare(b);
  });

  return keys.map(function(name)
  {
    return { name: name, url: POKEAPI.item(name) };
  });
}

function summarizeItem(json, itemMapObj)
{
  const mapEntry = (itemMapObj && json && json.name) ? itemMapObj[json.name] : null;

  const name_es =
    (json && Array.isArray(json.names) && json.names.find(function(n) { return n.language && n.language.name === "es"; })?.name) ||
    (mapEntry && mapEntry.display) ||
    (json && Array.isArray(json.names) && json.names.find(function(n) { return n.language && n.language.name === "en"; })?.name) ||
    (json && json.name) ||
    "";

  const effect_es_or_en =
    (json && Array.isArray(json.effect_entries) && json.effect_entries.find(function(e) { return e.language && e.language.name === "es"; })?.effect) ||
    (json && Array.isArray(json.effect_entries) && json.effect_entries.find(function(e) { return e.language && e.language.name === "en"; })?.effect) ||
    "";

  const flavors = (json && json.flavor_text_entries) ? json.flavor_text_entries : [];

  const flavor_es_first =
    (flavors.find(function(f) { return f.language && f.language.name === "es"; })?.text) ||
    (flavors.find(function(f) { return f.language && f.language.name === "es"; })?.flavor_text) ||
    "";

  const flavor_en_first =
    (flavors.find(function(f) { return f.language && f.language.name === "en"; })?.text) ||
    (flavors.find(function(f) { return f.language && f.language.name === "en"; })?.flavor_text) ||
    "";

  const desc_pref = flavor_es_first || effect_es_or_en || flavor_en_first || "";

  return {
    key: json && json.name ? json.name : "",
    api_name: json && json.name ? json.name : "",
    id: json && typeof json.id === "number" ? json.id : (mapEntry && mapEntry.id ? mapEntry.id : null),
    display_es: name_es || "",
    desc_es: clean(desc_pref),
  };
}

function manifestUrlNoCache()
{
  return COMPETIDEX_DATA.itemsManifest + "?v=" + Date.now();
}

export function ItemsProvider({ children, preloadCount = 0, warmConcurrency = 5 })
{
  const cache = useRef(new Map());
  const rawCache = useRef(new Map());
  const refreshResolverRef = useRef(null);

  const [refreshTick, setRefreshTick] = useState(0);
  const initialPersisted = useMemo(() => loadItemsPersistentCaches(), []);

  const itemMapRef = useRef((initialPersisted.itemMap && typeof initialPersisted.itemMap === "object") ? initialPersisted.itemMap : null);
  const [itemMapReady, setItemMapReady] = useState(false);

  const esToKeyRef = useRef(new Map());
  const slugToKeyRef = useRef(new Map());
  const keyToSlugRef = useRef(new Map());

  const [index, setIndex] = useState(function()
  {
    return loadItemsIndex() || [];
  });

  const [loadingIndex, setLoadingIndex] = useState(function()
  {
    return !(loadItemsIndex() && loadItemsIndex().length);
  });

  const getUrl = useCallback(async function(url)
  {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status + " en " + url);

    return res.json();
  }, []);

  useEffect(function()
  {
    const warmed = loadItemsWarmCache();
    if (warmed) warmed.forEach(function(v, k) { cache.current.set(k, v); });

    const rawed = loadItemsRawCache();
    if (rawed) rawed.forEach(function(v, k) { rawCache.current.set(k, v); });

  }, []);

  useEffect(function()
  {
    let alive = true;
    let anyRefreshed = false;

    (async function()
    {
      const persisted = loadItemsPersistentCaches();
      try
      {
        let manifest = persisted.manifest;
        const manifestAt = persisted.manifestAt;
        const manifestExpired = !manifestAt || (Date.now() - manifestAt) > MANIFEST_TTL_MS;

        if(!manifest || manifestExpired)
        {
          manifest = await getUrl(manifestUrlNoCache());
          saveItemsPersistentCaches(manifest, persisted.itemMap || null, Date.now(), persisted.itemMapAt || 0, persisted.lastItemMapUrl || "");
          anyRefreshed = true;
        }

        if (!alive) return;

        let itemMap = persisted.itemMap;
        const itemMapAt = persisted.itemMapAt;

        const itemsPath = (manifest && manifest.items_url) ? String(manifest.items_url) : null;
        const itemsUrl = itemsPath ? COMPETIDEX_DATA.itemsMap(itemsPath) : null;

        const lastUrl = String(persisted.lastItemMapUrl || "").trim();
        const urlChanged = !!(lastUrl && itemsUrl && lastUrl !== itemsUrl);

        if((!itemMap || urlChanged) && itemsUrl)
        {
          itemMap = await getUrl(itemsUrl);
          saveItemsPersistentCaches(manifest, itemMap, Date.now(), Date.now(), itemsUrl);
          anyRefreshed = true;

        }else if(!lastUrl && itemsUrl)
        {
          saveItemsPersistentCaches(manifest, itemMap, manifestAt || Date.now(), itemMapAt || Date.now(), itemsUrl);
        }

        itemMapRef.current = (itemMap && typeof itemMap === "object") ? itemMap : {};

        const itemMapObj = itemMapRef.current || {};
        const keys = Object.keys(itemMapObj);
        const esToKey = new Map();
        const slugToKey = new Map();
        const keyToSlug = new Map();

        for(let i = 0; i < keys.length; i++)
        {
          const apiKey = keys[i];
          const entry = itemMapObj[apiKey] || {};

          if(!isAllowedItemEntry(entry))
          {
            continue;
          }

          const display = entry.display || "";

          if(display)
          {
            const k1 = normalizeInputForLookup(display);
            setIfAbsent(esToKey, k1, apiKey);

            const slugES = slugifyForUrl(display);
            setIfAbsent(slugToKey, slugES, apiKey);
            if (slugES) keyToSlug.set(apiKey, slugES);
          }

          const k2 = normalizeInputForLookup(apiKey.replace(/-/g, " "));
          setIfAbsent(esToKey, k2, apiKey);

          const slugEN = slugifyForUrl(apiKey);
          setIfAbsent(slugToKey, slugEN, apiKey);

          if (!keyToSlug.has(apiKey) && slugEN) keyToSlug.set(apiKey, slugEN);
        }

        esToKeyRef.current = esToKey;
        slugToKeyRef.current = slugToKey;
        keyToSlugRef.current = keyToSlug;

        const lastIndexAt = loadItemsIndexAt();
        const expired = !lastIndexAt || (Date.now() - lastIndexAt) > INDEX_TTL_MS;
        const currentIndex = loadItemsIndex() || [];
        const shouldRebuildIndex = !currentIndex.length || expired || urlChanged;

        if(alive && shouldRebuildIndex)
        {
          setLoadingIndex(true);

          const items = buildIndexFromItemMap(itemMapRef.current);
          setIndex(items);
          saveItemsIndex(items);
          saveItemsIndexAt(Date.now());
          anyRefreshed = true;

          setLoadingIndex(false);
        }

      }catch(e)
      {
        console.warn("No pude cargar items ES map remoto:", e);
        itemMapRef.current = itemMapRef.current || {};

        if (alive) setLoadingIndex(false);

      }finally
      {
        if (alive) setItemMapReady(true);

        if(refreshResolverRef.current)
        {
          const resolve = refreshResolverRef.current;
          refreshResolverRef.current = null;
          try { resolve({ anyRefreshed }); } catch (e) {}
        }
      }

    })();

    return function() { alive = false; };

  }, [getUrl, refreshTick]);

  const getItemRaw = useCallback(async function(nameOrId)
  {
    const key = itemKey(nameOrId);
    if (!key) throw new Error("Item inválido");

    const entry = (itemMapRef.current && itemMapRef.current[key]) ? itemMapRef.current[key] : null;
    if(!isAllowedItemEntry(entry))
    {
      throw new Error("No se encontró item: " + key);
    }

    if(rawCache.current.has(key))
    {
      return rawCache.current.get(key);
    }

    const res = await fetch(POKEAPI.item(key), { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error("No se encontró item: " + key);

    const json = await res.json();
    rawCache.current.set(key, json);
    saveItemsRawCache(rawCache.current);

    return json;

  }, []);

  const getItem = useCallback(async function(nameOrId)
  {
    const key = itemKey(nameOrId);

    if (!key) throw new Error("Item inválido");

    const entry0 = (itemMapRef.current && itemMapRef.current[key]) ? itemMapRef.current[key] : null;
    if(!isAllowedItemEntry(entry0))
    {
      throw new Error("No se encontró item: " + key);
    }

    if(cache.current.has(key))
    {
      const cached = cache.current.get(key);

      const entry = (itemMapRef.current && itemMapRef.current[key]) ? itemMapRef.current[key] : null;
      if(entry)
      {
        if (!cached.display_es && entry.display) cached.display_es = entry.display;
        if (cached.id == null && typeof entry.id === "number") cached.id = entry.id;
      }

      cache.current.set(key, cached);
      saveItemsWarmCache(cache.current);

      return cached;
    }

    const json = await getItemRaw(key);
    const summary = summarizeItem(json, itemMapRef.current);

    cache.current.set(summary.key, summary);
    saveItemsWarmCache(cache.current);

    return summary;

  }, [getItemRaw]);

  const getMany = useCallback(async function(keys, poolSize)
  {
    const realPool = (poolSize !== undefined && poolSize !== null) ? poolSize : warmConcurrency;
    const uniq = Array.from(new Set((keys || []).map(itemKey)));
    let p = 0;
    const out = new Array(uniq.length);

    async function worker()
    {
      while(p < uniq.length)
      {
        const i = p++;
        const k = uniq[i];

        try
        {
          out[i] = await getItem(k);

        }catch
        {
          out[i] = null;
        }

      }
    }

    await Promise.all(Array.from({ length: Math.min(realPool, uniq.length) }, worker));

    return out.filter(Boolean);

  }, [getItem, warmConcurrency]);

  useEffect(function()
  {
    if (!preloadCount || !index.length) return;

    let alive = true;

    (async function()
    {
      try
      {
        const list = index.slice(0, preloadCount);
        let i = 0;

        async function worker()
        {
          while(alive && i < list.length)
          {
            const idx = i++;
            const it = list[idx];

            try
            {
              if(!cache.current.has(it.name))
              {
                const json = await getItemRaw(it.name);
                const sum = summarizeItem(json, itemMapRef.current);
                cache.current.set(sum.key, sum);
              }

            }catch{}

          }
        }

        await Promise.all(Array.from({ length: Math.min(warmConcurrency, list.length) }, worker));

      }finally
      {
        saveItemsWarmCache(cache.current);
        saveItemsRawCache(rawCache.current);
      }

    })();

    return function() { alive = false; };

  }, [index, preloadCount, warmConcurrency, getItemRaw]);

  const getManyEsNamesItems = useCallback(async function(keys)
  {
    const details = await getMany(keys);

    return new Map(details.map(function(d)
    {
      return [d.api_name, d.display_es];
    }));

  }, [getMany]);

  const translatePokemonItems = useCallback(async function(keys)
  {
    const arr = Array.isArray(keys) ? keys.filter(Boolean) : [];
    if(!arr.length) return new Map();

    return await getManyEsNamesItems(arr);

  }, [getManyEsNamesItems]);

  const getManyEsDetailsItems = useCallback(async function(keys)
  {
    const details = await getMany(keys);
    return new Map(details.map(function(d)
    {
      return [d.api_name, {
        id: d.id != null ? d.id : null,
        name_es: d.display_es,
        desc_es: d.desc_es
      }];
    }));

  }, [getMany]);

  const resolveItemInput = useCallback(function(input)
  {
    const raw = String(input || "").trim();
    if (!raw) return null;

    const apiKey = itemKey(raw);
    const entryExact = (itemMapRef.current && itemMapRef.current[apiKey]) ? itemMapRef.current[apiKey] : null;

    if(entryExact && isAllowedItemEntry(entryExact))
    {
      const displayExact = (entryExact && entryExact.display) ? entryExact.display : apiKey;

      return {
        key: apiKey,
        slug: keyToSlugRef.current.get(apiKey) || slugifyForUrl(displayExact),
        display: displayExact,
        id: entryExact && typeof entryExact.id === "number" ? entryExact.id : null,
        category: entryExact && entryExact.category ? entryExact.category : ""
      };
    }

    const slug = slugifyForUrl(raw);
    if(slugToKeyRef.current && slugToKeyRef.current.has(slug))
    {
      const k = slugToKeyRef.current.get(slug);
      const entry = (itemMapRef.current && itemMapRef.current[k]) ? itemMapRef.current[k] : null;

      if (!isAllowedItemEntry(entry)) return null;

      const display = (entry && entry.display) ? entry.display : k;

      return {
        key: k,
        slug: keyToSlugRef.current.get(k) || slugifyForUrl(display),
        display: display,
        id: entry && typeof entry.id === "number" ? entry.id : null,
        category: entry && entry.category ? entry.category : ""
      };
    }

    const norm = normalizeInputForLookup(raw);
    if(esToKeyRef.current && esToKeyRef.current.has(norm))
    {
      const k2 = esToKeyRef.current.get(norm);
      const entry2 = (itemMapRef.current && itemMapRef.current[k2]) ? itemMapRef.current[k2] : null;

      if (!isAllowedItemEntry(entry2)) return null;

      const display2 = (entry2 && entry2.display) ? entry2.display : k2;

      return {
        key: k2,
        slug: keyToSlugRef.current.get(k2) || slugifyForUrl(display2),
        display: display2,
        id: entry2 && typeof entry2.id === "number" ? entry2.id : null,
        category: entry2 && entry2.category ? entry2.category : ""
      };
    }

    const entry3 = (itemMapRef.current && itemMapRef.current[apiKey]) ? itemMapRef.current[apiKey] : null;

    if (!isAllowedItemEntry(entry3)) return null;

    const display3 = (entry3 && entry3.display) ? entry3.display : apiKey;

    return {
      key: apiKey,
      slug: keyToSlugRef.current.get(apiKey) || slugifyForUrl(display3),
      display: display3,
      id: entry3 && typeof entry3.id === "number" ? entry3.id : null,
      category: entry3 && entry3.category ? entry3.category : ""
    };

  }, []);

  const getItemSlug = useCallback(function(apiKey)
  {
    const k = itemKey(apiKey);
    if (!k) return "";
    const slug = (keyToSlugRef.current && keyToSlugRef.current.get(k)) || slugifyForUrl(k);

    return slug || "";

  }, []);

  const suggestItems = useCallback(function(query, limit)
  {
    const realLimit = (limit !== undefined && limit !== null) ? limit : 8;
    const q = normText(query);
    if (!q) return [];

    const starts = [];
    const contains = [];

    for(let i = 0; i < index.length; i++)
    {
      const key = index[i].name;
      const nKey = normText(key);

      const entry = (itemMapRef.current && itemMapRef.current[key]) ? itemMapRef.current[key] : null;

      if(!isAllowedItemEntry(entry))
      {
        continue;
      }

      const nEs = entry && entry.display ? normText(entry.display) : null;

      const matched =
        (nKey.startsWith(q) || (nEs && nEs.startsWith(q))) ? "starts"
        : (nKey.includes(q) || (nEs && nEs.includes(q))) ? "contains"
        : null;

      if (matched === "starts") starts.push(key);
      else if (matched === "contains") contains.push(key);

      if (starts.length + contains.length >= realLimit * 10) break;
    }

    const merged = starts.concat(contains).slice(0, realLimit);
    const out = [];

    for(let j = 0; j < merged.length; j++)
    {
      const key = merged[j];
      const cached = cache.current.get(key);
      const entry = (itemMapRef.current && itemMapRef.current[key]) ? itemMapRef.current[key] : null;

      const rawId = (cached && typeof cached.id === "number")
        ? cached.id
        : (entry && typeof entry.id === "number" ? entry.id : null);

      const display =
        (cached && cached.display_es) ||
        (entry && entry.display) ||
        key;

      out.push({
        key: key,
        id: rawId,
        display: display,
      });
    }

    return out;

  }, [index]);

  const clearSuggestCache = useCallback(function()
  {
    clearItemsPersistentCaches();
    clearItemsIndex();

    try { itemMapRef.current = {}; } catch {}
    try { setItemMapReady(false); } catch {}
    try { setIndex([]); } catch {}
    try { setLoadingIndex(true); } catch {}

  }, []);

  const refreshSuggestCache = useCallback(function()
  {
    return new Promise(function(resolve)
    {
      refreshResolverRef.current = resolve;
      setRefreshTick(function(v) { return v + 1; });
    });

  }, []);

  const clearWarmCache = useCallback(function()
  {
    cache.current.clear();
    rawCache.current.clear();

    clearItemsWarmCache();
    clearItemsRawCache();

  }, []);

  const clearAllCaches = useCallback(function()
  {
    cache.current.clear();
    rawCache.current.clear();

    clearItemsWarmCache();
    clearItemsRawCache();
    clearItemsIndex();
    clearItemsPersistentCaches();

    try { itemMapRef.current = {}; } catch {}
    try { setItemMapReady(false); } catch {}
    try { setIndex([]); } catch {}
    try { setLoadingIndex(true); } catch {}

  }, []);

  const value = useMemo(function()
  {
    return {
      index,
      loadingIndex,
      itemMapReady,

      getItem,
      getItemRaw,
      getMany,
      getManyEsNamesItems,
      getManyEsDetailsItems,
      translatePokemonItems,

      resolveItemInput,
      getItemSlug,
      suggestItems,

      clearSuggestCache,
      refreshSuggestCache,
      clearWarmCache,
      clearAllCaches
    };

  }, [
    index,
    loadingIndex,
    itemMapReady,
    getItem,
    getItemRaw,
    getMany,
    getManyEsNamesItems,
    getManyEsDetailsItems,
    translatePokemonItems,
    resolveItemInput,
    getItemSlug,
    suggestItems,
    clearSuggestCache,
    refreshSuggestCache,
    clearWarmCache,
    clearAllCaches
  ]);

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems()
{
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems debe usarse dentro de <ItemsProvider>");

  return ctx;
}
