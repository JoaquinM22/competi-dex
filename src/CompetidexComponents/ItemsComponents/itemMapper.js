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

  function descEs(raw)
  {
    const flavors = (raw && raw.flavor_text_entries) ? raw.flavor_text_entries : [];
    let ultimaEs = null;
    let ultimaEn = null;

    function esTextoValido(txt)
    {
      const s = cleanText(txt);

      if (!s) return false;
      if(!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(s)) return false;
      if(/^[-—–ー.·•\s]+$/.test(s)) return false;

      return true;
    }

    for(let i = 0; i < flavors.length; i++)
    {
      const f = flavors[i];
      if (!f || !f.language || !f.language.name) continue;

      const txt = cleanText(f.text || f.flavor_text || "");
      if (!esTextoValido(txt)) continue;

      if(f.language.name === "es")
      {
        ultimaEs = txt;

      }else if(f.language.name === "en")
      {
        ultimaEn = txt;
      }
    }

    return ultimaEs || ultimaEn || "";
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
      if (!key) continue;

      const mapped = getAttributeItemLabelEs(key);
      if (!mapped) continue;

      if(!seen[mapped])
      {
        seen[mapped] = true;
        out.push(mapped);
      }
    }

    return out;
  }

  function precioItem(raw)
  {
    const cost = raw && raw.cost;

    if (cost === null || cost === undefined) return null;
    if (typeof cost !== "number") return null;
    if (!isFinite(cost)) return null;
    if (cost <= 0) return null;

    return cost;
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
      precioItem: precioItem(raw),
      categoriaItem: categoriaItem(raw),
      descItem: descEs(raw),
      atributosItem: atributosItem(raw)
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
