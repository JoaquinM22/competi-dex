//** src\CompetidexComponents\ItemsComponents\VistaItem\VistaItem.js

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useItems } from "../ItemsProvider";
import { createItemMapper } from "../itemMapper";
import { CACHE_VERSION } from "../itemCache";
import { itemRoute } from "../../../utils/competidexRoutes";
import BuscadorItems from "./BuscadorItems/BuscadorItems";
import DataItem from "./DataItem/DataItem";
import "./VistaItem.css";

function toSlugApiKey(key = "")
{
  return encodeURIComponent(String(key || "").trim().toLowerCase());
}

export default function VistaItem()
{
  const { nombreItem: paramNombreItem } = useParams();
  const navigate = useNavigate();

  const { getItemRaw, resolveItemInput, itemMapReady } = useItems();

  const [itemABuscar, setItemABuscar] = useState("");
  const [unItem, setUnItem] = useState(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [errorItem, setErrorItem] = useState(null);

  const mapper = useMemo(() =>
  {
    return createItemMapper({
      getItemRaw: getItemRaw,
      DEBUG_ITEM: false
    });

  }, [getItemRaw]);

  const obtenerItem = useCallback(async (nameOrId) =>
  {
    return mapper.obtenerItem(nameOrId);

  }, [mapper]);

  const isItemPending = !!itemABuscar && !unItem && !errorItem;
  const loadingItemView = loadingItem || isItemPending;

  const KEY_LAST_ITEM_KEY = `items:lastKey:${CACHE_VERSION}`;
  const KEY_LAST_ITEM_SLUG = `items:lastSlug:${CACHE_VERSION}`;

  // 1) Si no hay param, restaurar el último item visto
  useEffect(() =>
  {
    if (paramNombreItem) return;

    let lastSlug = "";
    let lastKey = "";

    try { lastSlug = (sessionStorage.getItem(KEY_LAST_ITEM_SLUG) || "").trim(); } catch {}
    try { lastKey = (sessionStorage.getItem(KEY_LAST_ITEM_KEY) || "").trim(); } catch {}

    const go = (lastKey || lastSlug || "").toLowerCase();
    if (!go) return;

    navigate(itemRoute(toSlugApiKey(go)), { replace: true });

  }, [paramNombreItem, navigate, KEY_LAST_ITEM_KEY, KEY_LAST_ITEM_SLUG]);

  // 2) URL param -> resolver a key API y canonizar URL
  useEffect(() =>
  {
    if (!paramNombreItem) return;
    if (!itemMapReady) return;

    const rawParam = decodeURIComponent(paramNombreItem).trim();
    const resolved = resolveItemInput(rawParam);

    if(resolved && resolved.key)
    {
      const targetKey = resolved.key;
      const currentKey = String(itemABuscar || "").trim();
      const keyChanged = currentKey !== targetKey;

      if(keyChanged)
      {
        setErrorItem(null);
        setUnItem(null);
        setItemABuscar(targetKey);
      }

      try { sessionStorage.setItem(KEY_LAST_ITEM_KEY, String(resolved.key)); } catch {}
      try { sessionStorage.setItem(KEY_LAST_ITEM_SLUG, String(resolved.slug || "")); } catch {}

      const want = toSlugApiKey(resolved.key);
      const cur = toSlugApiKey(rawParam);

      if(want && cur !== want)
      {
        navigate(itemRoute(want), { replace: true });
      }

    }else
    {
      const targetKey = rawParam.toLowerCase().trim();
      const currentKey = String(itemABuscar || "").trim();
      const keyChanged = currentKey !== targetKey;

      if(keyChanged)
      {
        setErrorItem(null);
        setUnItem(null);
        setItemABuscar(targetKey);
      }
    }

  }, [paramNombreItem, itemMapReady, resolveItemInput, navigate, KEY_LAST_ITEM_KEY, KEY_LAST_ITEM_SLUG]);

  // 3) Buscar cuando cambia itemABuscar
  useEffect(() =>
  {
    let alive = true;
    if (!itemABuscar)
    {
      setLoadingItem(false);
      return;
    }

    (async () =>
    {

      try
      {
        setLoadingItem(true);
        setErrorItem(null);

        const item = await obtenerItem(itemABuscar);
        if (!alive) return;

        setUnItem(item);

        try
        {
          sessionStorage.setItem(KEY_LAST_ITEM_KEY, String(item?.nombreApi || item?.key || itemABuscar));
          sessionStorage.setItem(KEY_LAST_ITEM_SLUG, String(toSlugApiKey(item?.nombreItem || item?.nombreApi || itemABuscar)));

        }catch{}

      }catch(e)
      {
        if (!alive) return;
        setUnItem(null);
        setErrorItem(e || new Error("Error al obtener item"));

      }finally
      {
        if (alive) setLoadingItem(false);
      }

    })();

    return () => { alive = false; };

  }, [itemABuscar, obtenerItem, KEY_LAST_ITEM_KEY, KEY_LAST_ITEM_SLUG]);

  function handleSearch(resolved)
  {
    if(!resolved || !resolved.key)
    {
      setItemABuscar("");
      setUnItem(null);
      setErrorItem(null);
      setLoadingItem(false);
      navigate(itemRoute(), { replace: false });

      return;
    }

    const targetKey = String(resolved.key || "").trim();
    const currentKey = String(itemABuscar || "").trim();
    const keyChanged = currentKey !== targetKey;

    if(keyChanged)
    {
      setErrorItem(null);
      setUnItem(null);
      setItemABuscar(targetKey);
    }

    try { sessionStorage.setItem(KEY_LAST_ITEM_KEY, String(resolved.key)); } catch {}
    try { sessionStorage.setItem(KEY_LAST_ITEM_SLUG, String(resolved.slug || "")); } catch {}

    navigate(itemRoute(toSlugApiKey(resolved.key)), { replace: false });
  }

  return (
    <div className="vista-wrapper-item">
      <div className="componenteVistaItem">

        {/* Buscador de Objetos, alimentado por el Provider */}
        <BuscadorItems
          onSearch={handleSearch}
          titulo="Objeto"
        />

        {/* Componente con toda la Info de los Objetos */}
        <DataItem
          item={unItem}
          loading={loadingItemView}
          error={errorItem}
        />

      </div>
    </div>
  );

}