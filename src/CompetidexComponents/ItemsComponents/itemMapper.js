//** src\CompetidexComponents\ItemsComponents\itemMapper.js

import { getAttributeItemLabelEs } from "../../utils/competidexMeta";

export function createItemMapper(opts)
{
  opts = opts || {};

  const getItemRaw = opts.getItemRaw;
  const DEBUG_ITEM = !!opts.DEBUG_ITEM;

  if(!getItemRaw)
  {
    throw new Error("createItemMapper: falta opts.getItemRaw");
  }

  function ponerMayuscula(p)
  {
    return p ? p.charAt(0).toUpperCase() + p.slice(1) : p;
  }

  function cleanText(s)
  {
    return String(s || "")
      .replace(/[\f\n\r]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function nombreLindoFallback(rawName)
  {
    return ponerMayuscula(String(rawName || "item").replace(/-/g, " "));
  }

  function nombreEs(raw)
  {
    const names = (raw && raw.names) ? raw.names : [];
    let ultimoEs = null;
    let ultimoEn = null;

    for(let i = 0; i < names.length; i++)
    {
      const n = names[i];
      if (!n || !n.language || !n.language.name || !n.name) continue;

      if(n.language.name === "es")
      {
        ultimoEs = n.name;

      }else if(n.language.name === "en")
      {
        ultimoEn = n.name;
      }
    }

    return ultimoEs || ultimoEn || nombreLindoFallback(raw && raw.name);
  }

  function esTextoValido(txt)
  {
    const s = cleanText(txt);

    if (!s) return false;
    if(!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(s)) return false;
    if(/^[-—–ー.·•\s]+$/.test(s)) return false;

    return true;
  }

  function descEs(raw)
  {
    const flavors = (raw && raw.flavor_text_entries) ? raw.flavor_text_entries : [];
    let ultimaEs = null;

    for(let i = 0; i < flavors.length; i++)
    {
      const f = flavors[i];
      if (!f || !f.language || !f.language.name) continue;

      const txt = cleanText(f.text || f.flavor_text || "");
      if (!esTextoValido(txt)) continue;

      if(f.language.name === "es")
      {
        ultimaEs = txt;
      }
    }

    return ultimaEs || "-";
  }

  function descEN(raw)
  {
    const effects = (raw && raw.effect_entries) ? raw.effect_entries : [];
    const flavors = (raw && raw.flavor_text_entries) ? raw.flavor_text_entries : [];
    let ultimaEffectEn = null;
    let ultimaFlavorEn = null;

    for(let i = 0; i < effects.length; i++)
    {
      const e = effects[i];
      if (!e || !e.language || !e.language.name) continue;

      const txt = cleanText(e.effect || e.short_effect || "");
      if (!esTextoValido(txt)) continue;

      if(e.language.name === "en")
      {
        ultimaEffectEn = txt;
      }
    }

    if(ultimaEffectEn)
    {
      return ultimaEffectEn;
    }

    for(let i = 0; i < flavors.length; i++)
    {
      const f = flavors[i];
      if (!f || !f.language || !f.language.name) continue;

      const txt = cleanText(f.text || f.flavor_text || "");
      if (!esTextoValido(txt)) continue;

      if(f.language.name === "en")
      {
        ultimaFlavorEn = txt;
      }
    }

    return ultimaFlavorEn || "-";
  }

  function categoriaItem(raw)
  {
    if(raw && raw.category && raw.category.name)
    {
      return raw.category.name;
    }

    return null;
  }

  function atributosItem(raw)
  {
    const attrs = (raw && raw.attributes) ? raw.attributes : [];
    const out = [];
    const seen = {};

    for(let i = 0; i < attrs.length; i++)
    {
      const a = attrs[i];
      const key = (a && a.name) ? String(a.name).trim().toLowerCase() : "";
      if(!key) continue;

      if(!seen[key])
      {
        seen[key] = true;
        out.push(key);
      }
    }

    return out;
  }

  function preciosItem(raw)
  {
    const prices = (raw && Array.isArray(raw.prices)) ? raw.prices : [];
    const out = [];

    for(let i = 0; i < prices.length; i++)
    {
      const price = prices[i] || {};
      const precioCompra = price.purchase_price;
      const precioVenta = price.sell_price;
      const versionJuego = String(price?.version_group?.name || "").trim();

      const normalizedCompra = (typeof precioCompra === "number" && isFinite(precioCompra) && precioCompra > 0)
        ? precioCompra
        : null;

      const normalizedVenta = (typeof precioVenta === "number" && isFinite(precioVenta) && precioVenta > 0)
        ? precioVenta
        : null;

      if(!versionJuego && normalizedCompra === null && normalizedVenta === null)
      {
        continue;
      }

      out.push({
        precioItem: normalizedCompra,
        precioVentaItem: normalizedVenta,
        versionJuego: versionJuego || null
      });
    }

    return out;
  }

  function nombresPorIdiomaItems(raw)
  {
    const names = (raw && Array.isArray(raw.names))
      ? raw.names
      : [];

    const out = [];

    for(let i = 0; i < names.length; i++)
    {
      const n = names[i];

      const label = n && n.name ? String(n.name).trim() : "";
      const languageKey = n && n.language && n.language.name
        ? String(n.language.name).trim()
        : "";

      if(!label || !languageKey) continue;

      out.push({
        label,
        languageKey
      });
    }

    return out;
  }

  async function obtenerItem(nameOrId)
  {
    const key = (typeof nameOrId === "string")
      ? nameOrId.trim().toLowerCase()
      : String(nameOrId);

    const raw = await getItemRaw(key);

    if(DEBUG_ITEM && typeof console !== "undefined" && console.log)
    {
      console.log("[itemMapper] RAW item:", key, raw);
    }

    const item = {
      id: (raw && raw.id !== undefined) ? raw.id : null,
      nombreApi: (raw && raw.name) ? raw.name : key,
      nombreItem: nombreEs(raw),
      preciosItem: preciosItem(raw),
      categoriaItem: categoriaItem(raw),
      descItem: descEs(raw),
      descItemEN: descEN(raw),
      atributosItem: atributosItem(raw),
      namesItem: nombresPorIdiomaItems(raw)
    };

    if(DEBUG_ITEM && typeof console !== "undefined" && console.log)
    {
      console.log("[itemMapper] MAPPED item:", key, item);
    }

    return item;
  }

  return {
    obtenerItem
  };
  
}
