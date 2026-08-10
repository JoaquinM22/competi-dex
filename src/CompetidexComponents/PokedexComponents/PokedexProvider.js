//** src\CompetidexComponents\PokedexComponents\PokedexProvider.js

import React, {
  createContext, useContext, useMemo, useEffect, useState
} from "react";
import {
  ensurePokedex,
  getPrevNext,
  getPokedex,
  getPokedexEntry,
  hasPokemonInPokedexRegion,
  precargarPokedex,
  precargarTodasLasPokedex,
  clearPokedexRegion,
  clearAllPokedexCache,
  refreshPokedexRegion,
  refreshAllPokedexCache
} from "./pokedexCache";
import { spriteUrl } from "../../config/endpoints";
import {
  toPokemonDisplayName,
  getPokedexDataMetaEntries,
  getEnabledPokedexDataMetaEntries,
  getPokedexDataMetaByKey,
  getPokedexDataMetaOrder,
  getPokedexApiKeys,
  getEnabledPokedexApiKeys,
  getRegionLabelEs,
  getRegionOrder
} from "../../utils/competidexMeta";

// Numero en Pokedex del Pokemon
function returnEmptyDexPkm()
{
  return {
    entry: null,
    nombreApi: "",
    nombre: "",
    sprite: ""
  };
}

// Entrada de Pokedex
function returnEmptyDex()
{
  return {
    title: "",
    prev: returnEmptyDexPkm(),
    next: returnEmptyDexPkm(),
    baseId: null
  };
}

function normalizeDexKey(value)
{
  return String(value || "").trim().toLowerCase();
}

function normalizeRegionGroup(value)
{
  return normalizeDexKey(value) || "";
}

function getRegionGroupSortIndex(regionGroup)
{
  const order = getRegionOrder(regionGroup);
  if(Number.isFinite(order))
  {
    return order;
  }

  return 1000;
}

function getPokedexEntrySortIndex(entry)
{
  const order = getPokedexDataMetaOrder(entry);
  if(Number.isFinite(order))
  {
    return order;
  }

  return 1000;
}

function getPokedexTitleSortIndex(title)
{
  const wanted = normalizeDexKey(title);
  if(!wanted)
  {
    return 1000;
  }

  const metaEntries = getPokedexDataMetaEntries(true);
  const matched = metaEntries.find(function(entry)
  {
    return normalizeDexKey(entry?.labelEs) === wanted;
  });

  if(!matched)
  {
    return 1000;
  }

  return getPokedexDataMetaOrder(matched) ?? 1000;
}

function sortDexListByMetaOrder(a, b)
{
  const ao = getPokedexTitleSortIndex(a?.title);
  const bo = getPokedexTitleSortIndex(b?.title);

  if(ao !== bo)
  {
    return ao - bo;
  }

  const at = String(a?.title || "");
  const bt = String(b?.title || "");
  const titleCmp = at.localeCompare(bt);
  if(titleCmp !== 0)
  {
    return titleCmp;
  }

  return Number(a?.baseId || 0) - Number(b?.baseId || 0);
}

function sortPokedexSelectorEntries(a, b)
{
  const ao = getPokedexEntrySortIndex(a);
  const bo = getPokedexEntrySortIndex(b);

  if(ao !== bo)
  {
    return bo - ao;
  }

  const al = String(a?.labelEs || a?.path || a?.apiKey || "");
  const bl = String(b?.labelEs || b?.path || b?.apiKey || "");
  const cmp = al.localeCompare(bl);
  if(cmp !== 0)
  {
    return cmp;
  }

  return String(a?.path || "").localeCompare(String(b?.path || ""));
}

function buildPokedexSelectorGroups(entries)
{
  const outMap = new Map();
  const list = Array.isArray(entries) ? entries : [];

  for(const entry of list)
  {
    const regionGroup = normalizeRegionGroup(entry?.regionGroup);
    const groupKey = regionGroup || "__empty__";

    if(!outMap.has(groupKey))
    {
      outMap.set(groupKey, {
        regionGroup: regionGroup,
        regionLabel: regionGroup ? getRegionLabelEs(regionGroup) : "Sin región",
        entries: []
      });
    }

    outMap.get(groupKey).entries.push({
      apiKey: normalizeDexKey(entry?.apiKey),
      labelEs: String(entry?.labelEs || "").trim(),
      path: String(entry?.path || "").trim(),
      icon: entry?.icon ?? null,
      gameVersions: Array.isArray(entry?.gameVersions) ? entry.gameVersions.slice() : [],
      generation: String(entry?.generation || "").trim(),
      regionGroup: regionGroup,
      enabled: entry?.enabled !== false,
      order: getPokedexEntrySortIndex(entry)
    });

    outMap.get(groupKey).entries.sort(sortPokedexSelectorEntries);
  }

  return Array.from(outMap.values()).sort(function(a, b)
  {
    const ao = getRegionGroupSortIndex(a.regionGroup);
    const bo = getRegionGroupSortIndex(b.regionGroup);

    if(ao !== bo)
    {
      return bo - ao;
    }

    return String(a.regionLabel || a.regionGroup || "")
      .localeCompare(String(b.regionLabel || b.regionGroup || ""));
  });
}

// Verifica si la apiKey de la Pokedex es valida o no
function getEnabledPokedexMetaEntriesByApiKey(apiKey)
{
  const key = normalizeDexKey(apiKey);
  if(!key) return [];

  return getEnabledPokedexDataMetaEntries().filter(function(entry)
  {
    return normalizeDexKey(entry?.apiKey) === key;
  });
}

// Funcion que retorna un arreglo de entradas de Pokedex de un Pokémon
export async function buildDexEntriesFromPokedexNumbers(pokedexNumbers, getPokemonKeyById)
{
  const dexList = [];
  const list = Array.isArray(pokedexNumbers) ? pokedexNumbers : [];
  const ensureSeen = new Set();

  for(const regionData of list)
  {
    const regionName = normalizeDexKey(regionData?.pokedex?.name); // Verifica que la apiKey de la Pokedex este definida y habilitada
    if(!regionName) continue; // Si no esta definida/habilitada en el Meta paso a la siguiente

    const baseId = Number(regionData?.entry_number); // Nº de Pokedex del Pokemon en esta Pokedex
    if(!Number.isFinite(baseId)) continue;

    const enabledMetaEntries = getEnabledPokedexMetaEntriesByApiKey(regionName);
    if(!enabledMetaEntries.length) continue;

    if(!ensureSeen.has(regionName))
    {
      ensureSeen.add(regionName);
      await ensurePokedex(regionName);
    }

    const { prev, next } = getPrevNext(regionName, baseId);

    const resolveKeyById = (typeof getPokemonKeyById === "function")
      ? getPokemonKeyById
      : null;

    for(const metaEntry of enabledMetaEntries)
    {
      const dex = returnEmptyDex();
      dex.title = metaEntry?.labelEs || toPokemonDisplayName(regionName) || regionName;
      dex.baseId = baseId;

      // Pokemon Anterior
      if(prev)
      {
        const prevKey = resolveKeyById ? String(resolveKeyById(prev.speciesId) || "").trim().toLowerCase() : "";
        dex.prev = {
          entry: baseId - 1,
          nombreApi: prevKey || prev.name || "",
          nombre: prev.display || toPokemonDisplayName(prevKey) || toPokemonDisplayName(prev.name) || "",
          sprite: spriteUrl(prev.speciesId)
        };
      }

      // Pokemon Siguiente
      if(next)
      {
        const nextKey = resolveKeyById ? String(resolveKeyById(next.speciesId) || "").trim().toLowerCase() : "";
        dex.next = {
          entry: baseId + 1,
          nombreApi: nextKey || next.name || "",
          nombre: next.display || toPokemonDisplayName(nextKey) || toPokemonDisplayName(next.name) || "",
          sprite: spriteUrl(next.speciesId)
        };
      }

      dexList.push(dex);
    }
  }

  dexList.sort(function(a, b)
  {
    return sortDexListByMetaOrder(b, a);
  });

  return dexList; // Retorno el arreglo completo
}

const PokedexContext = createContext(null);

export function PokedexProvider({ children, preloadAll = true, preloadConcurrency = 6 })
{
  const allMetaEntries = useMemo(() => getPokedexDataMetaEntries(true), []);
  const enabledMetaEntries = useMemo(() => getEnabledPokedexDataMetaEntries(), []);
  const pokedexSelectorGroups = useMemo(() => buildPokedexSelectorGroups(enabledMetaEntries), [enabledMetaEntries]);
  const pokedexSelectorAllEntries = useMemo(() =>
  {
    return (Array.isArray(enabledMetaEntries) ? enabledMetaEntries : [])
      .map(function(entry)
      {
        return {
          apiKey: normalizeDexKey(entry?.apiKey),
          labelEs: String(entry?.labelEs || "").trim(),
          path: String(entry?.path || "").trim(),
          icon: entry?.icon ?? null,
          gameVersions: Array.isArray(entry?.gameVersions) ? entry.gameVersions.slice() : [],
          generation: String(entry?.generation || "").trim(),
          regionGroup: normalizeRegionGroup(entry?.regionGroup),
          enabled: entry?.enabled !== false,
          order: getPokedexEntrySortIndex(entry)
        };
      })
      .sort(sortPokedexSelectorEntries);

  }, [enabledMetaEntries]);

  const [loadingIndex, setLoadingIndex] = useState(!!preloadAll);
  const [pokedexReady, setPokedexReady] = useState(!preloadAll);

  useEffect(() =>
  {
    let alive = true;

    (async() =>
    {
      try
      {
        if(preloadAll)
        {
          setLoadingIndex(true);
          await precargarTodasLasPokedex(preloadConcurrency);
        }

      }catch(error)
      {
        console.warn("No pude precargar las pokedex:", error);

      }finally
      {
        if(alive)
        {
          setLoadingIndex(false);
          setPokedexReady(true);
        }
      }
    })();

    return function()
    {
      alive = false;
    };

  }, [preloadAll, preloadConcurrency]);

  const value = useMemo(() =>
  {
    return {
      loadingIndex,
      pokedexReady,

      pokedexMetaEntries: allMetaEntries,
      enabledPokedexMetaEntries: enabledMetaEntries,
      pokedexSelectorGroups: pokedexSelectorGroups,
      pokedexSelectorAllEntries: pokedexSelectorAllEntries,

      getPokedexDataMetaEntries,
      getEnabledPokedexDataMetaEntries,
      getPokedexDataMetaByKey,
      getPokedexApiKeys,
      getEnabledPokedexApiKeys,
      buildPokedexSelectorGroups,

      ensurePokedex,
      precargarPokedex,
      precargarTodasLasPokedex,
      buildDexEntriesFromPokedexNumbers,

      getPokedex,
      getPokedexEntry,
      hasPokemonInPokedexRegion,
      getPrevNext,

      clearPokedexRegion,
      clearAllPokedexCache,
      refreshPokedexRegion,
      refreshAllPokedexCache
    };

  }, [
    loadingIndex,
    pokedexReady,
    allMetaEntries,
    enabledMetaEntries,
    pokedexSelectorGroups,
    pokedexSelectorAllEntries
  ]);

  return (
    <PokedexContext.Provider value={value}>
      {children}
    </PokedexContext.Provider>
  );
}

export function usePokedex()
{
  const ctx = useContext(PokedexContext);
  if(!ctx) throw new Error("usePokedex debe usarse dentro de <PokedexProvider>");

  return ctx;
}