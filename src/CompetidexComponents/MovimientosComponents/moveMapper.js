//** src\CompetidexComponents\MovimientosComponents\moveMapper.js

export function createMoveMapper()
{
  const DEBUG_MOV = false;
  // ----------- Funciones Auxiliares -----------
  function ponerMayuscula(p)
  {
    return p ? p.charAt(0).toUpperCase() + p.slice(1) : p;
  }

  function nombreEs(raw)
  {
    const names = (raw && raw.names) ? raw.names : [];
    for(let i = 0; i < names.length; i++)
    {
      const n = names[i];
      if (n && n.language && n.language.name === "es") return n.name;
    }

    return ponerMayuscula((raw && raw.name) ? raw.name : "");
  }

  function descEs(raw)
  {
    const arr = (raw && raw.flavor_text_entries) ? raw.flavor_text_entries : [];
    const arrRev = arr.slice().reverse();

    function limpiarTexto(txt)
    {
      return String(txt || "").replace(/\s+/g, " ").trim();
    }

    function esTextoValido(txt)
    {
      const s = limpiarTexto(txt);
      return !!s && /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(s);
    }

    function esTextoDescartable(txt, lang)
    {
      const s = limpiarTexto(txt).toLowerCase();
      const l = String(lang || "").trim().toLowerCase();

      if(!s) return true;

      if(l.indexOf("es") === 0)
      {
        return s.indexOf("este movimiento no se puede usar") === 0;
      }

      if(l.indexOf("en") === 0)
      {
        return s.indexOf("this move can") === 0 && s.indexOf("forgotten") !== -1;
      }

      return false;
    }

    function buscarPorIdioma(prefijoIdioma)
    {
      for(let i = 0; i < arrRev.length; i++)
      {
        const f = arrRev[i];
        if (!f || !f.language || !f.language.name) continue;

        const lang = String(f.language.name).trim().toLowerCase();
        if(lang.indexOf(prefijoIdioma) !== 0) continue;

        const txt = limpiarTexto(f.flavor_text || "");
        if(!esTextoValido(txt)) continue;
        if(esTextoDescartable(txt, lang)) continue;

        return txt;
      }

      return "";
    }

    const ultimaEs = buscarPorIdioma("es");
    if(ultimaEs) return ultimaEs;

    const ultimaEn = buscarPorIdioma("en");
    if(ultimaEn) return ultimaEn;

    return "";
  }

  function isNum(n)
  {
    return typeof n === "number" && isFinite(n);
  }

  // Regla: null/undefined => 100% (si el efecto existe)
  function normalizeChancePct(v)
  {
    if (v === null || v === undefined) return 100;
    if (!isNum(v)) return null;

    return v;
  }

  function pctOrNull(v)
  {
    const p = normalizeChancePct(v);
    return isNum(p) ? p : null;
  }

  function fmtPct(pct)
  {
    if (!isNum(pct)) return null;
    return pct + "%";
  }

  function sentenceWithPct(base, pct)
  {
    if (!base) return null;
    if (!isNum(pct)) return base;
    return base + " (" + fmtPct(pct) + ")";
  }

  function lowerFirst(s)
  {
    if (!s) return s;
    s = String(s);
    return s.charAt(0).toLowerCase() + s.slice(1);
  }

  const AILMENT_ES = {
    "unknown": "Desconocido",
    "burn": "Quemar",
    "poison": "Envenenar",
    "paralysis": "Paralizar",
    "sleep": "Dormir",
    "freeze": "Congelar",
    "confusion": "Confundir",
    "infatuation": "Enamorar",
    "trap": "Atrapar",
    "nightmare": "Pesadilla",
    "tormented": "Tormentar",
    "disable": "Anular",
    "yawn": "Bostezo",
    "encore": "Otra Vez",
    "heal-block": "Anticura",
    "leech-seed": "Drenadoras",
    "embargo": "Embargo",
    "perish-song": "Canto Mortal",
    "ingrain": "Arraigo",
    "none": "Ninguno",
    "silence": "Silencio",
    "tar-shot": "Multiplica por 2 la debilidad al tipo Fuego",
    "no-type-immunity": "Sin inmunidad de tipo"
  };

  const metaCategory_Target_ES = {
    "damage": "objetivo",
    "ailment": "objetivo",
    "net-good-stats": "target",
    "heal": "target",
    "damage-ailment": "objetivo",
    "swagger": "objetivo",
    "damage-lower": "objetivo",
    "damage-raise": "usuario",
    "damage-heal": "target",
    "ohko": "objetivo",
    "whole-field-effect": "Produce un efecto en todo el campo.",
    "field-effect": "Produce un efecto sobre el terreno de combate.",
    "force-switch": "objetivo",
    "unique": "objetivo"
  };

  const STAT_INFO = {
    "attack": { art: "el", label: "Ataque Físico" },
    "defense": { art: "la", label: "Defensa Física" },
    "special-attack": { art: "el", label: "Ataque Especial" },
    "special-defense": { art: "la", label: "Defensa Especial" },
    "speed": { art: "la", label: "Velocidad" },
    "accuracy": { art: "la", label: "Precisión" },
    "evasion": { art: "la", label: "Evasión" }
  };

  function statTextWithArticle(statName)
  {
    const info = STAT_INFO[statName];
    if (info && info.label) return (info.art || "") + " " + info.label;
    return lowerFirst(statName || "");
  }

  function nivelesTxt(nAbs)
  {
    return (nAbs === 1) ? "nivel" : "niveles";
  }

  function joinListES(arr)
  {
    if (!arr || !arr.length) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + " y " + arr[1];
    return arr.slice(0, -1).join(", ") + " y " + arr[arr.length - 1];
  }

  function subjectTxtA(aplicaA)
  {
    if (aplicaA === "usuario") return "al usuario";
    if (aplicaA === "objetivo") return "al objetivo";
    if (aplicaA === "ambos") return "a ambos";
    return "";
  }

  function subjectTxtDe(aplicaA)
  {
    if (aplicaA === "usuario") return "del usuario";
    if (aplicaA === "objetivo") return "del objetivo";
    if (aplicaA === "ambos") return "de ambos";
    return "";
  }

  function inferAplicaAFromMetaCategory(metaCategoryName)
  {
    const c = (metaCategoryName || "").toLowerCase();
    if (!c) return "desconocido";
    if (c.indexOf("raise") !== -1) return "usuario";
    if (c.indexOf("lower") !== -1) return "objetivo";
    return "desconocido";
  }

  function inferAplicaAFromMetaCategoryHeuristic(metaCategoryName)
  {
    const c = (metaCategoryName || "").toLowerCase();
    if (!c) return null;
    if (c.indexOf("raise") !== -1) return "usuario";
    if (c.indexOf("lower") !== -1) return "objetivo";
    return null;
  }

  // ----------- Stats cambios (NO depende de effect_chance) ----------- 
  function mapStatKey(statName)
  {
    return statName || "";
  }

  function buildStatsCambios(raw, blancoRaw)
  {
    raw = raw || {};
    const out = { usuario: {}, objetivo: {} };
    const list = [];

    if(!Array.isArray(raw.stat_changes) || raw.stat_changes.length === 0)
    {
      return { map: out, list: list, has: false };
    }

    const meta = raw.meta || null;
    const metaCategory = meta && meta.category ? meta.category.name : null;
    const targetRaw = raw && raw.target ? raw.target.name : null;

    function normAplicaA(v)
    {
      const t = (v || "").toLowerCase();
      if (t === "target") return null;
      if (t === "user") return "usuario";
      if (t === "selected-pokemon") return "objetivo";
      if (t === "objetivo" || t === "usuario" || t === "ambos") return t;
      
      return null;
    }

    function aplicaAFromTargetRawName(targetName)
    {
      const t = (targetName || "").toLowerCase();
      if (t === "user") return "usuario";
      if (t === "selected-pokemon") return "objetivo";
      if (t === "all-opponents") return "objetivo";
      if (t === "user-and-allies") return "ambos";
      if (t === "all-allies") return "ambos";
      if (t === "all-pokemon") return "ambos";
      
      return null;
    }

    function aplicaAFromBlancoEs(blancoEsLocal)
    {
      const b = (blancoEsLocal || "").toLowerCase();
      if (b.indexOf("usuario") !== -1 || b.indexOf("a sí mismo") !== -1 || b.indexOf("a si mismo") !== -1) return "usuario";
      if (b.indexOf("objetivo") !== -1 || b.indexOf("oponente") !== -1) return "objetivo";
      if (b.indexOf("todos") !== -1 || b.indexOf("campo") !== -1 || b.indexOf("aliad") !== -1) return "ambos";
      
      return null;
    }

    function aplicaAFromMetaCategoryMap(metaCategoryName)
    {
      if (!metaCategoryName) return null;
      const v = metaCategory_Target_ES[metaCategoryName];
      return normAplicaA(v);
    }

    const aplicaABase =
      aplicaAFromTargetRawName(targetRaw) ||
      aplicaAFromBlancoEs(blancoRaw) ||
      inferAplicaAFromMetaCategoryHeuristic(metaCategory) ||
      null;

    const aplicaAStats =
      aplicaAFromMetaCategoryMap(metaCategory) ||
      aplicaABase ||
      "objetivo";

    function put(aplicaA, statName, efecto, nivel)
    {
      if (!statName) return;

      if(aplicaA === "ambos")
      {
        put("usuario", statName, efecto, nivel);
        put("objetivo", statName, efecto, nivel);

        return;
      }

      const bucket = (aplicaA === "usuario") ? out.usuario : out.objetivo;
      const k = mapStatKey(statName);

      if(!bucket[k])
      {
        bucket[k] = { efecto: efecto, nivel: nivel };
      
      }else
      {
        const prev = bucket[k];
        if(Math.abs(nivel) > Math.abs(prev.nivel))
        {
          bucket[k] = { efecto: efecto, nivel: nivel };
        }
      }

      list.push({ aplicaA: aplicaA, stat: k, efecto: efecto, nivel: nivel });
    }

    for(let i = 0; i < raw.stat_changes.length; i++)
    {
      const sc = raw.stat_changes[i] || {};
      const change = sc.change;
      const sname = (sc.stat && sc.stat.name) ? sc.stat.name : null;

      if (!isNum(change) || !sname || change === 0) continue;

      const efecto = (change > 0) ? "sube" : "baja";
      const nivel = Math.abs(change);

      put(aplicaAStats, sname, efecto, nivel);
    }

    const has =
      (Object.keys(out.usuario).length > 0) ||
      (Object.keys(out.objetivo).length > 0);

    return { map: out, list: list, has: has, metaCategory: metaCategory, targetRaw: targetRaw };
  }

  // ----------- Efectos secundarios (depende de effect_chance) ----------- 
  function buildSecondarySummary(effects)
  {
    if (!Array.isArray(effects) || effects.length === 0) return null;

    const parts = [];
    for(let i = 0; i < effects.length; i++)
    {
      const e = effects[i] || {};
      if (e.texto) parts.push(e.texto);
    }

    return parts.length ? (parts.join(". ") + ".") : null;
  }

  function buildSecondaryEffects(raw, blancoRaw)
  {
    raw = raw || {};
    const secPct = pctOrNull(raw.effect_chance);

    const meta = raw.meta || null;
    const effects = [];

    const metaCategory = meta && meta.category ? meta.category.name : null;
    const targetRaw = raw && raw.target ? raw.target.name : null;

    function normAplicaA(v)
    {
      const t = (v || "").toLowerCase();
      if (t === "target") return null;
      if (t === "user") return "usuario";
      if (t === "selected-pokemon") return "objetivo";
      if (t === "objetivo" || t === "usuario" || t === "ambos") return t;
      
      return null;
    }

    function aplicaAFromTargetRawName(targetName)
    {
      const t = (targetName || "").toLowerCase();
      if (t === "user") return "usuario";
      if (t === "selected-pokemon") return "objetivo";
      if (t === "all-opponents") return "objetivo";
      if (t === "user-and-allies") return "ambos";
      if (t === "all-allies") return "ambos";
      if (t === "all-pokemon") return "ambos";

      return null;
    }

    function aplicaAFromBlancoEs(blancoEsLocal)
    {
      const b = (blancoEsLocal || "").toLowerCase();
      if (b.indexOf("usuario") !== -1 || b.indexOf("a sí mismo") !== -1 || b.indexOf("a si mismo") !== -1) return "usuario";
      if (b.indexOf("objetivo") !== -1 || b.indexOf("oponente") !== -1) return "objetivo";
      if (b.indexOf("todos") !== -1 || b.indexOf("campo") !== -1 || b.indexOf("aliad") !== -1) return "ambos";
      
      return null;
    }

    const aplicaABase =
      aplicaAFromTargetRawName(targetRaw) ||
      aplicaAFromBlancoEs(blancoRaw) ||
      inferAplicaAFromMetaCategoryHeuristic(metaCategory) ||
      null;

    function aplicaAFromMetaCategoryMap(metaCategoryName)
    {
      if (!metaCategoryName) return null;
      const v = metaCategory_Target_ES[metaCategoryName];
      
      return normAplicaA(v);
    }

    function verbBaseTxt(dir)
    {
      return (dir === "up") ? "Aumenta" : "Reduce";
    }

    function resolveAplicaA(effectTipo, defaultValue)
    {
      const byCat = aplicaAFromMetaCategoryMap(metaCategory) || inferAplicaAFromMetaCategoryHeuristic(metaCategory);

      if(effectTipo === "stat_changes")
      {
        return byCat || aplicaABase || (defaultValue || "objetivo");
      }

      if(effectTipo === "ailment" || effectTipo === "flinch")
      {
        return aplicaABase || byCat || (defaultValue || "objetivo");
      }

      return byCat || aplicaABase || (defaultValue || "objetivo");
    }

    // 1) AILMENT
    if(meta && meta.ailment && meta.ailment.name && meta.ailment.name !== "none")
    {
      const aplicaA1 = resolveAplicaA("ailment", "objetivo");

      const ail = meta.ailment.name;
      const ailLabel = AILMENT_ES[ail] || ail;

      let pct = secPct;
      if (!isNum(pct)) pct = 100;

      effects.push({
        tipo: "ailment",
        aplicaA: aplicaA1,
        chancePct: pct,
        texto: sentenceWithPct(ailLabel + " " + subjectTxtA(aplicaA1), pct),
        detalle: { ailment: ail, target: targetRaw, blancoRaw: blancoRaw, metaCategory: metaCategory }
      });
    }

    // 2) FLINCH
    if(meta && isNum(meta.flinch_chance) && meta.flinch_chance > 0)
    {
      const aplicaA2 = resolveAplicaA("flinch", "objetivo");

      let fPct = secPct;
      if (!isNum(fPct)) fPct = 100;

      effects.push({
        tipo: "flinch",
        aplicaA: aplicaA2,
        chancePct: fPct,
        texto: sentenceWithPct("Hace retroceder " + subjectTxtA(aplicaA2), fPct),
        detalle: { flinch_chance: meta.flinch_chance, target: targetRaw, blancoRaw: blancoRaw, metaCategory: metaCategory }
      });
    }

    // 3) STAT CHANGES (secundario)
    if(Array.isArray(raw.stat_changes) && raw.stat_changes.length > 0)
    {
      const aplicaAStats = resolveAplicaA("stat_changes", "objetivo");
      let sPct = secPct;
      if (!isNum(sPct)) sPct = 100;

      const items = [];
      for(let i = 0; i < raw.stat_changes.length; i++)
      {
        const sc = raw.stat_changes[i] || {};
        const change = sc.change;
        const sname = (sc.stat && sc.stat.name) ? sc.stat.name : null;
        if (!isNum(change) || !sname) continue;

        items.push({
          dir: (change >= 0) ? "up" : "down",
          abs: Math.abs(change),
          statText: statTextWithArticle(sname)
        });
      }

      if(items.length)
      {
        const groups = {};
        for(let j = 0; j < items.length; j++)
        {
          const it = items[j];
          const k = it.dir + "|" + it.abs;
          if (!groups[k]) groups[k] = { dir: it.dir, abs: it.abs, stats: [] };
          groups[k].stats.push(it.statText);
        }

        const groupKeys = Object.keys(groups);
        const fragments = [];

        for(let g = 0; g < groupKeys.length; g++)
        {
          const gg = groups[groupKeys[g]];

          const seen = {};
          const statsUniq = [];
          for(let x = 0; x < gg.stats.length; x++)
          {
            const st = gg.stats[x];
            if (!st) continue;
            const nk = st.toLowerCase();
            if (seen[nk]) continue;
            seen[nk] = true;
            statsUniq.push(st);
          }

          if (!statsUniq.length) continue;

          const v = verbBaseTxt(gg.dir);
          const nTxt = nivelesTxt(gg.abs);
          const statsTxt = joinListES(statsUniq);

          fragments.push(v + " en " + gg.abs + " " + nTxt + " " + statsTxt);
        }

        if(fragments.length)
        {
          const base = fragments.join(" y ") + " " + subjectTxtDe(aplicaAStats);

          effects.push({
            tipo: "stat_changes",
            aplicaA: aplicaAStats,
            chancePct: sPct,
            texto: sentenceWithPct(base, sPct),
            detalle: { stat_changes: raw.stat_changes, metaCategory: metaCategory, target: targetRaw, blancoRaw: blancoRaw }
          });
        }

      }

    }

    // 4) MULTI-HIT
    if(meta && (meta.min_hits !== null || meta.max_hits !== null))
    {
      const minH = meta.min_hits;
      const maxH = meta.max_hits;

      if(isNum(minH) && isNum(maxH) && minH === maxH)
      {
        effects.push({ tipo: "multi_hit", aplicaA: "objetivo", chancePct: 100, texto: "Pega " + minH + " veces", detalle: { min_hits: minH, max_hits: maxH } });
      
      }else if(isNum(minH) || isNum(maxH))
      {
        const mhTxt = (isNum(minH) && isNum(maxH))
          ? ("Pega de " + minH + " a " + maxH + " veces")
          : (isNum(minH) ? ("Pega al menos " + minH + " veces") : ("Pega hasta " + maxH + " veces"));

        effects.push({ tipo: "multi_hit", aplicaA: "objetivo", chancePct: 100, texto: mhTxt, detalle: { min_hits: minH, max_hits: maxH } });
      }
    }

    // 5) MULTI-TURN
    if(meta && (meta.min_turns !== null || meta.max_turns !== null))
    {
      const minT = meta.min_turns;
      const maxT = meta.max_turns;

      if(isNum(minT) && isNum(maxT) && minT === maxT)
      {
        effects.push({ tipo: "multi_turn", aplicaA: "ambos", chancePct: 100, texto: "Dura " + minT + " turnos", detalle: { min_turns: minT, max_turns: maxT } });
      
      }else if(isNum(minT) || isNum(maxT))
      {
        const mtTxt = (isNum(minT) && isNum(maxT))
          ? ("Dura de " + minT + " a " + maxT + " turnos")
          : (isNum(minT) ? ("Dura al menos " + minT + " turnos") : ("Dura hasta " + maxT + " turnos"));

        effects.push({ tipo: "multi_turn", aplicaA: "ambos", chancePct: 100, texto: mtTxt, detalle: { min_turns: minT, max_turns: maxT } });
      }
    }

    // 6) DRAIN / RECOIL
    if(meta && isNum(meta.drain) && meta.drain !== 0)
    {
      if(meta.drain > 0)
      {
        effects.push({ tipo: "drain", aplicaA: resolveAplicaA("drain", "usuario"), chancePct: 100, texto: "Absorbe " + meta.drain + "% del daño como PS", detalle: { drain: meta.drain, metaCategory: metaCategory } });
      
      }else
      {
        effects.push({ tipo: "recoil", aplicaA: resolveAplicaA("recoil", "usuario"), chancePct: 100, texto: "Recibe retroceso (" + Math.abs(meta.drain) + "% del daño)", detalle: { drain: meta.drain, metaCategory: metaCategory } });
      }
    }

    // 7) HEALING
    if(meta && isNum(meta.healing) && meta.healing > 0)
    {
      const aplicaAHeal = resolveAplicaA("healing", "usuario");
      effects.push({ tipo: "healing", aplicaA: aplicaAHeal, chancePct: 100, texto: "Cura " + meta.healing + "% de PS Máx. " + subjectTxtA(aplicaAHeal), detalle: { healing: meta.healing, metaCategory: metaCategory } });
    }

    // 8) CRIT RATE (texto)
    if(meta && isNum(meta.crit_rate) && meta.crit_rate > 0)
    {
      effects.push({ tipo: "crit_rate", aplicaA: "usuario", chancePct: 100, texto: "Aumenta el índice de crítico (+" + meta.crit_rate + ")", detalle: { crit_rate: meta.crit_rate } });
    }

    return effects;
  }

  // ----------- Función Obtener Objeto Movimiento Final -----------
  function obtenerMov(raw, nameOrId = "", getMoveContactByKey = null)
  {
    const key = (typeof nameOrId === "string")
      ? nameOrId.trim().toLowerCase()
      : String(nameOrId);
    raw = raw || {};

    if(DEBUG_MOV && typeof console !== "undefined" && console.log)
    {
      console.log("[moveMapper] RAW move:", key, raw);
    }

    const blancoRaw = raw && raw.target ? raw.target.name : null;

    const tieneSec = raw && raw.effect_chance !== null && raw.effect_chance !== undefined;

    const efectosSec = tieneSec ? buildSecondaryEffects(raw, blancoRaw) : [];
    const resumenEfectos = tieneSec ? buildSecondarySummary(efectosSec) : null;
    const statsCambiosPack = buildStatsCambios(raw, blancoRaw);

    let indiceCritico = null;
    if(raw && raw.meta && raw.meta.crit_rate !== null && raw.meta.crit_rate !== undefined)
    {
      const nCrit = Number(raw.meta.crit_rate);
      indiceCritico = isFinite(nCrit) ? nCrit : null;
    }

    let isContact = null;
    if(typeof getMoveContactByKey === "function")
    {
      const contactKey = (raw && raw.name) ? raw.name : key;
      const contactVal = getMoveContactByKey(contactKey);

      if(contactVal === true) isContact = true;
      else if(contactVal === false) isContact = false;
      else isContact = null;
    }

    const mov = {
      key: (raw && raw.name) ? raw.name : key,
      id: raw && raw.id !== undefined ? raw.id : null,

      genMov: raw && raw.generation ? raw.generation.name : null,
      nombreMov: nombreEs(raw),
      nombreApi: (raw && raw.name) ? raw.name : key,

      tipoMov: raw && raw.type ? raw.type.name : null,
      claseMov: raw && raw.damage_class ? raw.damage_class.name : null,

      statsCambios: statsCambiosPack.map,
      statsCambiosList: statsCambiosPack.list,
      tieneStatsCambios: !!statsCambiosPack.has,

      indiceCritico: indiceCritico,
      isContact: isContact,

      potenciaMov: (raw && raw.power !== undefined && raw.power !== null) ? raw.power : -1,
      precisionMov: (raw && raw.accuracy !== undefined && raw.accuracy !== null) ? raw.accuracy : -1,
      ppMov: (raw && raw.pp !== undefined && raw.pp !== null) ? raw.pp : -1,
      prioridadMov: (raw && raw.priority !== undefined && raw.priority !== null) ? raw.priority : -1,

      blancoMov: blancoRaw,
      descMov: descEs(raw),

      efectoSecundario: (tieneSec && resumenEfectos)
        ? { resumen: resumenEfectos, lista: efectosSec }
        : null,

      tieneEfectoSecundario: !!(tieneSec && Array.isArray(efectosSec) && efectosSec.length > 0),

      pokesAprenden: (raw && Array.isArray(raw.learned_by_pokemon))
        ? raw.learned_by_pokemon.map(function (p) { return ponerMayuscula(p && p.name ? p.name : ""); }).filter(Boolean)
        : [],

      isDamage: raw && raw.damage_class && (raw.damage_class.name === "physical" || raw.damage_class.name === "special"),
      isStatus: raw && raw.damage_class && raw.damage_class.name === "status"
    };

    if(DEBUG_MOV && typeof console !== "undefined" && console.log)
    {
      console.log("[moveMapper] MAPPED move:", key, mov);
    }

    return mov;
  }

  return {
    obtenerMov: obtenerMov
  };

}