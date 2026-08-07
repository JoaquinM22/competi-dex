//** src\CompetidexComponents\PokedexComponents\VistaPokedex\VistaPokedex.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { spriteUrl, spriteShinyUrl } from "../../../config/endpoints";
import { getPokedexDataMetaByPath, getTypeMeta, TYPES_META } from "../../../utils/competidexMeta";
import { pokemonRoute } from "../../../utils/competidexRoutes";
import { POKEDEX_FORMS_PATCH } from "../utilsPokedex/pokemonFormOverrides";
import { usePokedex } from "../PokedexProvider";
import { usePokemon } from "../../PokemonComponents/PokemonProvider";
import { showToastr } from "../../../services/ToastrService";
import { consumeSessionRefresh } from "../../../utils/sessionRefreshLimiter";
import LoadingPkm from "../../SharedComponents/LoadingPkm/LoadingPkm";
import ErrorNotFoundPkm from "../../SharedComponents/ErrorNotFoundPkm/ErrorNotFoundPkm";
import SpriteModal from "../../SharedComponents/SpriteModal/SpriteModal";
import Tipo from "../../SharedComponents/Tipo/Tipo";
import NombrePokedex from "../NombrePokedex/NombrePokedex";
import "./VistaPokedex.css";

function normalizePath(p)
{
  if (!p) return "/";
  const s = String(p || "").trim();
  return s.charAt(0) === "/" ? s : "/" + s;
}

function normalizeKey(k)
{
  return String(k || "").trim().toLowerCase();
}

function resolvePokedexRouteEntry(allEntries, gameSlug)
{
  const wantedPath = gameSlug ? normalizePath(gameSlug) : "";
  if(!wantedPath || wantedPath === "/")
  {
    return null;
  }

  const metaEntry = getPokedexDataMetaByPath(wantedPath);
  if(!metaEntry)
  {
    return null;
  }

  const list = Array.isArray(allEntries) ? allEntries : [];
  const exact = list.find(function(entry)
  {
    return normalizePath(entry?.path) === wantedPath;
  });

  if(exact)
  {
    return exact;
  }

  return {
    apiKey: metaEntry.apiKey,
    labelEs: metaEntry.labelEs,
    path: metaEntry.path,
    icon: metaEntry.icon ?? null,
    gameVersions: Array.isArray(metaEntry.gameVersions) ? metaEntry.gameVersions.slice() : [],
    generation: metaEntry.generation || "",
    regionGroup: metaEntry.regionGroup || "",
    enabled: metaEntry.enabled !== false,
    order: metaEntry.order,
    metaOnly: true
  };
}

// Funcion Auxiliar que normaliza texto para comparar
function normText(s)
{
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function renderNombreConGenero(nombre)
{
  const n = String(nombre || "");

  const hasMale = n.indexOf("♂") !== -1;
  const hasFemale = n.indexOf("♀") !== -1;

  const isMaleText = /\b(macho|male)\b/i.test(n) || /\s+m$/i.test(n);
  const isFemaleText = /\b(hembra|female)\b/i.test(n) || /\s+f$/i.test(n);

  if(hasMale || isMaleText)
  {
    const baseM = n
      .replace(/[♂]/g, "")
      .replace(/\b(macho|male)\b/gi, "")
      .replace(/\s+m$/i, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return (
      <span className="pokedexNameWrap">
        <span className="pokedexNameText">{baseM}</span>
        <IoMdMale className="pokedexGenderIcon male" aria-label="Macho" />
      </span>
    );

  }

  if(hasFemale || isFemaleText)
  {
    const baseF = n
      .replace(/[♀]/g, "")
      .replace(/\b(hembra|female)\b/gi, "")
      .replace(/\s+f$/i, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return (
      <span className="pokedexNameWrap">
        <span className="pokedexNameText">{baseF}</span>
        <IoMdFemale className="pokedexGenderIcon female" aria-label="Hembra" />
      </span>
    );

  }

  return (
    <span className="pokedexNameWrap">
      <span className="pokedexNameText">{n}</span>
    </span>
  );

}

// Funcion que arma el objeto "forma base"
function buildBaseFormFromRow(r)
{

  return {
    apiName: r.name,
    display: r.display || r.name,
    spriteId: r.speciesId
  };

}

// Clave única por forma
function formKeyOf(apiName, spriteId, fallbackId)
{
  const id = spriteId != null ? spriteId : fallbackId;
  return String(apiName || "") + "::" + String(id != null ? id : "");
}

function getRawTypes(typesArr)
{
  const arr = Array.isArray(typesArr) ? typesArr.slice() : [];
  if (!arr.length) return [];

  return arr.filter(Boolean);
}

function getMeasureContext()
{
  if(typeof document === "undefined") return null;

  if(!getMeasureContext.canvas)
  {
    getMeasureContext.canvas = document.createElement("canvas");
    getMeasureContext.ctx = getMeasureContext.canvas.getContext("2d");
  }

  return getMeasureContext.ctx || null;
}

function measureTextWidth(text, fontSize, fontWeight)
{
  const ctx = getMeasureContext();
  if(!ctx) return String(text || "").length * Math.max(6, Math.round(fontSize * 0.55));

  const weight = fontWeight || 800;
  ctx.font = weight + " " + fontSize + "px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
  return ctx.measureText(String(text || "")).width;
}

function cleanPokedexName(name)
{
  return String(name || "")
    .replace(/[♂♀]/g, "")
    .replace(/\b(macho|male|hembra|female)\b/gi, "")
    .replace(/\s+[mf]$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const POKEDEX_REFRESH_LIMIT_PER_APIKEY = 3;
const POKEDEX_REFRESH_WINDOW_MS = 1000 * 60 * 60 * 24;

export default function VistaPokedex()
{
  const { gameSlug } = useParams();
  const navigate = useNavigate();

  const { getPokemonMapEntry, getPokemonSlug } = usePokemon();
  const {
    ensurePokedex,
    getPokedex,
    refreshPokedexRegion,
    pokedexSelectorAllEntries
  } = usePokedex();

  const [rows, setRows] = useState([]);
  const [typesByFormKey, setTypesByFormKey] = useState({});
  const [loadingDex, setLoadingDex] = useState(true);
  const [pokedexTableWrapWidth, setPokedexTableWrapWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() =>
  {
    if(typeof window === "undefined") return 0;
    return window.innerWidth || 0;
  });

  const [sortConfig, setSortConfig] = useState([]);
  const [reloadTick, setReloadTick] = useState(0);

  // Buscador
  const [findText, setFindText] = useState("");
  const [findPos, setFindPos] = useState(0);

  const rowRefs = useRef({});
  const findInputRef = useRef(null);
  const pokedexTableWrapRef = useRef(null);

  // Modal confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmKind, setConfirmKind] = useState(null); // "refresh"
  const confirmOkBtnRef = useRef(null);

  useEffect(() =>
  {
    function onResize()
    {
      setViewportWidth(window.innerWidth || 0);
    }

    onResize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => window.removeEventListener("resize", onResize);

  }, []);

  useEffect(() =>
  {
    const el = pokedexTableWrapRef.current;
    if(!el) return;

    function syncWidth()
    {
      const rectWidth = Math.max(0, Math.floor(el.clientWidth || 0));
      const styles = typeof window !== "undefined" && window.getComputedStyle ? window.getComputedStyle(el) : null;
      const padL = styles ? parseFloat(styles.paddingLeft) || 0 : 0;
      const padR = styles ? parseFloat(styles.paddingRight) || 0 : 0;
      const nextWidth = Math.max(0, rectWidth - padL - padR);

      setPokedexTableWrapWidth(function(prev)
      {
        return prev === nextWidth ? prev : nextWidth;
      });
    }

    syncWidth();

    if(typeof ResizeObserver !== "undefined")
    {
      const ro = new ResizeObserver(syncWidth);
      ro.observe(el);

      return function()
      {
        ro.disconnect();
      };
    }

    window.addEventListener("resize", syncWidth, { passive: true });

    return function()
    {
      window.removeEventListener("resize", syncWidth);
    };

  }, []);

  const isCompactPokedex = viewportWidth > 0 && viewportWidth <= 1200;
  const isUltraCompactPokedex = viewportWidth > 0 && viewportWidth <= 420;
  const pokedexTipoSize = isUltraCompactPokedex ? "mini" : (isCompactPokedex ? "small" : "medium");
  const pokedexSpriteThumbSize = isUltraCompactPokedex ? 72 : (viewportWidth > 0 && viewportWidth <= 720 ? 96 : (isCompactPokedex ? 112 : 150));

  function openConfirm(kind)
  {
    setConfirmKind(kind);
    setConfirmOpen(true);
    // focus luego del render
    setTimeout(function()
    {
      try
      {
        if (confirmOkBtnRef.current) confirmOkBtnRef.current.focus();
      
      }catch(e){}

    }, 0);

  }

  function closeConfirm()
  {
    setConfirmOpen(false);
    setConfirmKind(null);
  }

  async function onConfirmAccept()
  {
    if(confirmKind === "refresh")
    {
      const activeDexKey = String(resolved?.apiKey || "").trim().toLowerCase();

      if(activeDexKey)
      {
        const limitState = consumeSessionRefresh(
          `pokedex:${activeDexKey}`,
          POKEDEX_REFRESH_LIMIT_PER_APIKEY,
          POKEDEX_REFRESH_WINDOW_MS,
          { storage: "local" }
        );

        if(!limitState.allowed)
        {
          showToastr({
            title: "Pokédex",
            text: "Ya alcanzaste el límite de actualizaciones para esta Pokédex hoy.",
            variant: "warning"
          });
          closeConfirm();
          return;
        }

        const result = await refreshPokedexRegion(activeDexKey, { force: true });

        if(result?.refreshed)
        {
          setReloadTick(function(t)
          {
            return t + 1;
          });

          showToastr({
            title: "Pokédex",
            text: "La Pokédex se actualizó correctamente.",
            variant: "ok"
          });

        }else
        {
          showToastr({
            title: "Aviso en Pokédex",
            text: "La Pokédex ya está actualizada.",
            variant: "warning"
          });
        }
      }

    }

    closeConfirm();
  }

  // Bloquea scroll del fondo cuando el modal está abierto
  useEffect(() =>
  {
    if (!confirmOpen) return;

    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow || "";
    };

  }, [confirmOpen]);

  // Cerrar modal con ESC
  useEffect(() =>
  {
    function onKeyDown(e)
    {
      if (!confirmOpen) return;

      if(e.key === "Escape")
      {
        e.preventDefault();
        closeConfirm();
      }

    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);

  }, [confirmOpen]);

  const handleSort = (key, shiftPressed) =>
  {
    setSortConfig(function(prev)
    {
      let existing = null;
      for(let i = 0; i < prev.length; i++)
      {
        if(prev[i].key === key)
        {
          existing = prev[i];
          break;
        }
      }

      if(existing)
      {
        const newDir = existing.direction === "asc" ? "desc" : "asc";
        if(shiftPressed)
        {

          return prev.map(function(s){
            return s.key === key ? { key: key, direction: newDir } : s;
          });

        }

        return [{ key: key, direction: newDir }];

      }

      if (shiftPressed) return prev.concat([{ key: key, direction: "asc" }]);

      return [{ key: key, direction: "asc" }];

    });
  };

  const clearSort = () => setSortConfig([]);

  useEffect(() =>
  {
    function onKey(e)
    {
      if (e.key === "Escape" && sortConfig.length) clearSort();
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [sortConfig.length]);

  function headerClass(key)
  {
    let s = null;
    for(let i = 0; i < sortConfig.length; i++)
    {
      if(sortConfig[i].key === key)
      {
        s = sortConfig[i];
        break;
      }
    }

    return "pokedexThSortable" + (s ? " sorted " + s.direction : "");

  }

  function renderSortIcon(key)
  {
    let s = null;
    for(let i = 0; i < sortConfig.length; i++)
    {
      if(sortConfig[i].key === key)
      {
        s = sortConfig[i];
        break;
      }
    }

    if (!s) return <span className="sort-icon"><FaLocationArrow className="competidexArrowIcon" aria-hidden="true" /></span>;

    return (
      <span className={"sort-icon " + (s.direction === "asc" ? "up" : "down")}>
        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
      </span>
    );

  }

  const sortLabel = function (key)
  {
    if (key === "nacional") return "nacional";
    if (key === "pokedex") return "pokedex";
    if (key === "nombre") return "nombre";
    if (key === "tipos") return "tipos";

    return key;
  };

  const resolved = useMemo(() =>
  {
    return resolvePokedexRouteEntry(pokedexSelectorAllEntries, gameSlug);

  }, [pokedexSelectorAllEntries, gameSlug]);

  const activeDexKey = String(resolved?.apiKey || "").trim().toLowerCase();
  const hideNationalColumn = activeDexKey === "national";

  const invalidRoute = !resolved;

  function scrollTableToTop()
  {
    if(typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0 });
  }

  // Carga pokedex + aplica patch según la Pokédex real resuelta desde el path
  useEffect(() =>
  {
    let alive = true;

    async function loadDex()
    {
      if (!activeDexKey) return;
      if (!resolved) return;

      setLoadingDex(true);
      setRows([]);
      setTypesByFormKey({});

      // Reset UI
      setFindText("");
      setFindPos(0);
      setSortConfig([]);
      rowRefs.current = {};
      scrollTableToTop();

      if (invalidRoute) return;

      await ensurePokedex(activeDexKey);
      if (!alive) return;

      const dex = getPokedex(activeDexKey);

      const baseList = Object.keys(dex)
        .map(function(n)
        {
          return Number(n);
        })
        .sort(function(a, b)
        {
          return a - b;
        })
        .map(function(entryNumber)
        {

          const r = dex[entryNumber];

          return {
            dexLocal: entryNumber,
            dexNational: r.speciesId,
            speciesId: r.speciesId,
            name: r.name,
            display: r.display
          };

        });

      const patchForThisDex = (POKEDEX_FORMS_PATCH && POKEDEX_FORMS_PATCH[activeDexKey]) || null;

      const withForms = baseList.map(function(r)
      {
        let formsArr = null;

        if
        (
          patchForThisDex &&
          patchForThisDex[r.name] &&
          patchForThisDex[r.name].length
        )
        {
          formsArr = patchForThisDex[r.name];

        }else
        {
          formsArr = [buildBaseFormFromRow(r)];
        }

        return Object.assign({}, r, { forms: formsArr });

      });

      if (!alive) return;

      setRows(withForms);
      setLoadingDex(false);

      setTimeout(function()
      {
        scrollTableToTop();

      }, 0);

      // Tipos: patch.types > pokemon_map.types > []
      const initial = {};

      for(let i = 0; i < withForms.length; i++)
      {

        const row = withForms[i];
        const forms = row.forms || [];

        for(let f = 0; f < forms.length; f++)
        {
          const form = forms[f] || {};
          const apiName = form.apiName ? String(form.apiName) : null;
          if (!apiName) continue;

          const key = formKeyOf(apiName, form.spriteId, row.speciesId);

          if(form.types && form.types.length)
          {
            initial[key] = getRawTypes(form.types);
            continue;
          }

          const ent = getPokemonMapEntry ? getPokemonMapEntry(apiName) : null;
          if(ent && ent.types && ent.types.length)
          {
            initial[key] = getRawTypes(ent.types);
            continue;
          }

          initial[key] = [];

        }

      }

      if (!alive) return;
      setTypesByFormKey(initial);

    }

    loadDex();

    return function(){
      alive = false;
    };

  }, [activeDexKey, resolved, getPokemonMapEntry, reloadTick, invalidRoute]);

  const sortedRows = useMemo(() =>
  {
    const arr = rows.slice();
    if (!sortConfig.length) return arr;

    arr.sort(function(a, b)
    {

      for(let i = 0; i < sortConfig.length; i++)
      {

        const rule = sortConfig[i];
        const key = rule.key;
        const dir = rule.direction === "asc" ? 1 : -1;

        let va;
        let vb;

        if(key === "nacional")
        {
          va = Number(a.dexNational) || 0;
          vb = Number(b.dexNational) || 0;
          if (va !== vb) return (va - vb) * dir;

          continue;
        }

        if(key === "pokedex")
        {
          va = Number(a.dexLocal) || 0;
          vb = Number(b.dexLocal) || 0;
          if (va !== vb) return (va - vb) * dir;

          continue;
        }

        if(key === "nombre")
        {
          va = normText(a.display || a.name);
          vb = normText(b.display || b.name);
          if (va !== vb) return va.localeCompare(vb) * dir;

          continue;
        }

        if(key === "tipos")
        {
          const baseKeyA = formKeyOf(a.name, a.speciesId, a.speciesId);
          const baseKeyB = formKeyOf(b.name, b.speciesId, b.speciesId);

          const ta = (typesByFormKey[baseKeyA] || []).join("|");
          const tb = (typesByFormKey[baseKeyB] || []).join("|");

          va = normText(ta);
          vb = normText(tb);

          if (!va && vb) return 1;
          if (va && !vb) return -1;
          if (va !== vb) return va.localeCompare(vb) * dir;

          continue;
        }

      }

      return (Number(a.dexLocal) || 0) - (Number(b.dexLocal) || 0);

    });

    return arr;

  }, [rows, sortConfig, typesByFormKey]);

  const renderRows = useMemo(() =>
  {
    const out = [];
    for(let i = 0; i < sortedRows.length; i++)
    {
      const r = sortedRows[i];
      const forms = r.forms && r.forms.length ? r.forms : [buildBaseFormFromRow(r)];

      for(let j = 0; j < forms.length; j++)
      {

        const form = forms[j] || {};
        out.push({
          base: r,
          form: form,
          isFirst: j === 0,
          isSub: j > 0,
          rowSpan: forms.length,
          key: r.dexLocal + "::" + j + "::" + (form.spriteId || "x")
        });

      }

    }

    return out;

  }, [sortedRows]);

  const pokedexTotalCount = useMemo(() =>
  {
    return Array.isArray(rows) ? rows.length : 0;

  }, [rows]);

  const pokedexColumnWidths = useMemo(() =>
  {
    const vw = viewportWidth || 0;
    const isMobileTypes = vw > 0 && vw <= 520;

    const headerFont = vw <= 420 ? 12 : vw <= 720 ? 13 : vw <= 1200 ? 14 : 16;
    const bodyFont = vw <= 420 ? 12 : vw <= 720 ? 13 : vw <= 1200 ? 14 : 16;
    const nameFont = vw <= 420 ? 13 : vw <= 720 ? 14 : vw <= 1200 ? 15 : 18;
    const typeFont = vw <= 420 ? 9 : vw <= 720 ? 10 : vw <= 1200 ? 12 : 16;

    const padX = vw <= 420 ? 8 : vw <= 720 ? 9 : vw <= 1200 ? 10 : 12;
    const spritePad = vw <= 420 ? 8 : vw <= 720 ? 10 : 12;
    const typeGap = vw <= 420 ? 4 : 5;
    const typeIcon = vw <= 420 ? 10 : vw <= 720 ? 11 : vw <= 1200 ? 13 : 16;
    const typePadX = vw <= 420 ? 6 : vw <= 720 ? 7 : vw <= 1200 ? 8 : 10;
    const mobileTypeKeys = Object.entries(TYPES_META)
      .filter(function([key, meta])
      {
        if(key === "unknown" || key === "ninguno") return false;
        return Boolean(meta && meta.apiKey);
      })
      .map(function([, meta])
      {
        return meta.apiKey;
      });

    const headerHeightPad = 28;

    const out = {
      national: hideNationalColumn ? 0 : Math.ceil(measureTextWidth("N° Nacional", headerFont, 800) + headerHeightPad),
      dex: Math.ceil(measureTextWidth("N° Pokédex", headerFont, 800) + headerHeightPad),
      sprite: Math.ceil(Math.max(
        measureTextWidth("Sprite", headerFont, 800) + spritePad * 2,
        pokedexSpriteThumbSize + spritePad * 2 + 12
      )),
      name: Math.ceil(measureTextWidth("Pokémon", headerFont, 800) + headerHeightPad),
      types: Math.ceil(measureTextWidth("Tipo/s", headerFont, 800) + headerHeightPad)
    };
    const visibleColumns = hideNationalColumn
      ? ["dex", "sprite", "name", "types"]
      : ["national", "dex", "sprite", "name", "types"];

    for(let i = 0; i < renderRows.length; i++)
    {
      const rr = renderRows[i];
      const base = rr.base;
      const form = rr.form || {};

      if(rr.isFirst)
      {
        const nationalText = String(base.dexNational != null ? base.dexNational : "");
        const dexText = String(base.dexLocal != null ? base.dexLocal : "");

        out.national = Math.max(out.national, Math.ceil(measureTextWidth(nationalText, bodyFont, 700) + padX * 2 + 10));
        out.dex = Math.max(out.dex, Math.ceil(measureTextWidth(dexText, bodyFont, 700) + padX * 2 + 10));
      }

      const apiName = form.apiName ? String(form.apiName) : base.name;
      const displayText = cleanPokedexName(form.display || base.display || apiName);
      const genderBonus = (
        /[♂♀]/.test(String(form.display || base.display || apiName)) ||
        /\b(macho|male|hembra|female)\b/i.test(String(form.display || base.display || apiName))
      ) ? 16 : 0;

      out.name = Math.max(
        out.name,
        Math.ceil(measureTextWidth(displayText, nameFont, 800) + padX * 2 + genderBonus + 12)
      );

      const rowTypes = (form.types && form.types.length
        ? getRawTypes(form.types)
        : null) || (typesByFormKey[formKeyOf(apiName, form.spriteId, base.speciesId)] || []);

      if(rowTypes.length)
      {
        if(isMobileTypes)
        {
          let mobileTypeWidth = 0;

          for(let t = 0; t < mobileTypeKeys.length; t++)
          {
            const tipoMeta = getTypeMeta(mobileTypeKeys[t]);
            const label = tipoMeta?.labelEs || String(mobileTypeKeys[t] || "");
            mobileTypeWidth = Math.max(
              mobileTypeWidth,
              Math.ceil(measureTextWidth(label, typeFont, 800) + typeIcon + typePadX * 2 + 18)
            );
          }

          out.types = Math.max(out.types, Math.ceil(mobileTypeWidth + 10));

        }else
        {
          let typesWidth = 0;

          for(let t = 0; t < rowTypes.length; t++)
          {
            const tipoMeta = getTypeMeta(rowTypes[t]);
            const label = tipoMeta?.labelEs || String(rowTypes[t] || "");
            typesWidth += Math.ceil(measureTextWidth(label, typeFont, 800) + typeIcon + typePadX * 2 + 18);
            if(t < rowTypes.length - 1)
            {
              typesWidth += typeGap;
            }
          }

          out.types = Math.max(out.types, Math.ceil(typesWidth + 10));
        }
      }

    }

    const availableWidth = Math.max(0, Math.floor(pokedexTableWrapWidth || 0));
    const requiredWidth = visibleColumns.reduce(function(sum, key)
    {
      return sum + Math.max(0, out[key] || 0);
    }, 0);

    if(vw >= 960 && availableWidth > 0 && requiredWidth > 0 && availableWidth >= requiredWidth)
    {
      const targetWidth = Math.floor(availableWidth / visibleColumns.length);
      let remaining = availableWidth - requiredWidth;
      const balanced = {};

      for(let i = 0; i < visibleColumns.length; i++)
      {
        const key = visibleColumns[i];
        balanced[key] = Math.max(0, out[key] || 0);
      }

      if(remaining > 0)
      {
        const narrowColumns = visibleColumns.slice().sort(function(a, b)
        {
          return (balanced[a] || 0) - (balanced[b] || 0);
        });

        for(let i = 0; i < narrowColumns.length && remaining > 0; i++)
        {
          const key = narrowColumns[i];
          const current = balanced[key] || 0;
          if(current < targetWidth)
          {
            const add = Math.min(targetWidth - current, remaining);
            balanced[key] = current + add;
            remaining -= add;
          }
        }

        if(remaining > 0)
        {
          let idx = 0;
          while(remaining > 0)
          {
            const key = visibleColumns[idx % visibleColumns.length];
            balanced[key] = (balanced[key] || 0) + 1;
            remaining--;
            idx++;
          }
        }

        for(let i = 0; i < visibleColumns.length; i++)
        {
          const key = visibleColumns[i];
          out[key] = balanced[key];
        }
      }

      for(let i = 0; i < visibleColumns.length; i++)
      {
        const key = visibleColumns[i];
        out[key] = Math.max(0, out[key] || 0);
      }
    }

    return out;

  }, [viewportWidth, renderRows, hideNationalColumn, pokedexSpriteThumbSize, typesByFormKey, pokedexTableWrapWidth]);

  const pokedexTableStyle = useMemo(() =>
  {
    return {
      "--pokedex-col-national": pokedexColumnWidths.national + "px",
      "--pokedex-col-dex": pokedexColumnWidths.dex + "px",
      "--pokedex-col-sprite": pokedexColumnWidths.sprite + "px",
      "--pokedex-col-name": pokedexColumnWidths.name + "px",
      "--pokedex-col-types": pokedexColumnWidths.types + "px"
    };

  }, [pokedexColumnWidths]);

  const findMatches = useMemo(() =>
  {
    const q = normText(findText);
    if (!q) return [];

    const hits = [];
    for(let i = 0; i < renderRows.length; i++)
    {

      const rr = renderRows[i];
      const base = rr.base;
      const form = rr.form || {};

      const apiName = form.apiName ? String(form.apiName) : base.name;
      const nameShown = form.display || base.display || apiName;

      if(normText(nameShown).indexOf(q) !== -1)
      {
        hits.push(rr.key);
      }

    }

    return hits;

  }, [findText, renderRows]);

  const findMatchSet = useMemo(() =>
  {
    const s = {};
    for(let i = 0; i < findMatches.length; i++)
    {
      s[findMatches[i]] = true;
    }
    
    return s;

  }, [findMatches]);

  useEffect(() =>
  {
    setFindPos(0);

  }, [findText, findMatches.length]);

  function goFind(delta)
  {
    if (!findMatches.length) return;

    setFindPos(function(prev)
    {
      let next = prev + delta;
      if (next < 0) next = findMatches.length - 1;
      if (next >= findMatches.length) next = 0;

      return next;
    });

  }

  function clearFind()
  {
    setFindText("");
    setFindPos(0);
    if (findInputRef.current) findInputRef.current.focus();
  }

  useEffect(() =>
  {
    if (!findMatches.length) return;

    const activeKey = findMatches[Math.min(findPos, findMatches.length - 1)];
    const el = rowRefs.current[activeKey];
    if (!el) return;

    el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });

  }, [findPos, findMatches]);

  if(invalidRoute)
  {
    return (
      <div className="vista-wrapperPokedex">
        <div className="componenteVistaPokedex">
          <div className="error-containerPokemon">
            <ErrorNotFoundPkm error="Pokedex no encontrada" />
          </div>
        </div>
      </div>
    );
  }

  const opt = resolved || {};

  const activeFindKey = findMatches.length && findMatches[Math.min(findPos, findMatches.length - 1)]
    ? findMatches[Math.min(findPos, findMatches.length - 1)]
    : null;

  // Texto del modal
  const modalTitle = confirmKind === "refresh" ? "Refrescar Pokédex" : "";

  const modalBody = confirmKind === "refresh"
    ? "Se volverá a descargar la Pokédex en el navegador."
    : "";

  const modalConfirmLabel = "Sí, refrescar";

  return (
    <div className="vista-wrapperPokedex">
      <div className="componenteVistaPokedex">

        {/* Componente que muestra nombre de la Pokedex y una foto de la Generacion */}
        <NombrePokedex
          nombre={opt.labelEs || ("Pokédex " + (activeDexKey || gameSlug || ""))}
          gen={opt.generation || ""} // Sin gen => null => ""
        />

        {/* Muestra Cargando o Tabla con la Pokedex */}
        {loadingDex ? (
          <div className="pokedexTableOuter pokedexLoadingOuter">
            <LoadingPkm inline />
          </div>
        ) : (
          <>
            {/* Buscador + Tabla de Pokedex */}
            <div className="pokedexTableOuter">

              {/* Boton arriba a la derecha para cache */}
              <div className="pokedexBottomActions pokedexTopActions">
                <div className="pokedexTopTotal">
                  Total: <span>{pokedexTotalCount}</span> Pokémon
                </div>

                {/* Boton Refrescar Pokédex */}
                <button
                  type="button"
                  className="pokedexActionBtn-VistaPokedex"
                  onClick={() => openConfirm("refresh")}
                  title="Borra el cache de esta Pokédex y la vuelve a descargar"
                  >
                    Refrescar Pokédex
                  </button>

              </div>

              {/* Orden Actual de Buscador */}
              {sortConfig.length > 0 && (
                <div className="orden-info-vistaPokedex">
                  <div>
                    Orden actual:{" "}
                    {sortConfig.map(function (s, i) {
                      return (
                        <span key={s.key} className="orden-item-vistaPokedex">
                          {sortLabel(s.key)} {s.direction === "asc" ? "↑" : "↓"}
                          {i < sortConfig.length - 1 ? ", " : ""}
                        </span>
                      );
                    })}
                  </div>

                  <span className="orden-hint-vistaPokedex">
                    Mantenga <b>Shift</b> + <b>Click</b> para combinar ordenamientos.
                  </span>

                  <div className="orden-actions">
                    <button
                      type="button"
                      className="btn-clear-sort-vistaPokedex"
                      onClick={clearSort}
                      title="Limpiar todos los ordenamientos (Esc)"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              )}

              {/* Buscador */}
              <div className="pokedexFindBarShell">
                <div className="pokedexFindBar">
                  <div className="pokedexFindLeft">
                    <span className="pokedexFindLabel">Buscar Pokémon</span>

                    <input
                      inputMode="search"
                      enterKeyHint="search"
                      type="search"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      name="pokedex-search"
                      ref={findInputRef}
                      className="pokedexFindInput"
                      value={findText}
                      onChange={(e) => setFindText(e.target.value)}
                      placeholder="Escribí un nombre… (Enter = siguiente)"
                      onKeyDown={(e) =>
                      {

                        if(e.key === "Enter")
                        {
                          e.preventDefault();
                          goFind(e.shiftKey ? -1 : 1);
                        }

                        if(e.key === "Escape")
                        {
                          e.preventDefault();
                          clearFind();
                        }

                      }}
                    />
                  </div>

                  <div className="pokedexFindRight">
                    <span className={"pokedexFindCount" + (findMatches.length ? " has" : "")}>
                      {findMatches.length ? findPos + 1 + "/" + findMatches.length : "0/0"}
                    </span>

                    <button
                      type="button"
                      className="pokedexFindBtn"
                      onClick={() => goFind(-1)}
                      disabled={!findMatches.length}
                      title="Anterior (Shift+Enter)"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      className="pokedexFindBtn"
                      onClick={() => goFind(1)}
                      disabled={!findMatches.length}
                      title="Siguiente (Enter)"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      className="pokedexFindBtn clear"
                      onClick={clearFind}
                      disabled={!findText}
                      title="Limpiar (Esc)"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla con la Pokedex */}
              <div className="pokedexTableWrap-Contenedor">
                <div className="pokedexTableWrap" ref={pokedexTableWrapRef}>
                  <table className="pokedexTable" style={pokedexTableStyle}>

                    {/* Headers de la Tabla */}
                    <thead>
                      <tr>

                        {/* Nro segun Dex Nacional */}
                        {!hideNationalColumn ? (
                          <th
                            className={"pokedexColNational " + headerClass("nacional")}
                            onClick={(e) => handleSort("nacional", e.shiftKey)}
                            title="Ordenar por N° Nacional"
                          >
                            N° Nacional {renderSortIcon("nacional")}
                          </th>
                        ) : null}

                        {/* Nro segun Dex Actual */}
                        <th
                          className={"pokedexColDex " + headerClass("pokedex")}
                          onClick={(e) => handleSort("pokedex", e.shiftKey)}
                          title="Ordenar por N° Pokédex"
                        >
                          N° Pokédex {renderSortIcon("pokedex")}
                        </th>

                        {/* Sprite Pokémon */}
                        <th className="pokedexThStatic pokedexColSprite">Sprite</th>

                        {/* Nombre Pokémon */}
                        <th
                          className={"pokedexColName " + headerClass("nombre")}
                          onClick={(e) => handleSort("nombre", e.shiftKey)}
                          title="Ordenar por Nombre"
                        >
                          Pokémon {renderSortIcon("nombre")}
                        </th>

                        {/* Tipo/s Pokémon */}
                        <th
                          className={"pokedexColTypes " + headerClass("tipos")}
                          onClick={(e) => handleSort("tipos", e.shiftKey)}
                          title="Ordenar por Tipo/s"
                        >
                          Tipo/s {renderSortIcon("tipos")}
                        </th>

                      </tr>
                    </thead>

                    {/* Filas de la Tabla */}
                    <tbody>
                      {renderRows.map(function(rr)
                      {
                        const base = rr.base;
                        const form = rr.form || {};

                        const apiName = form.apiName ? String(form.apiName) : base.name;
                        const key = formKeyOf(apiName, form.spriteId, base.speciesId);

                        const t = (form.types && form.types.length
                          ? getRawTypes(form.types)
                          : null) || (typesByFormKey[key] || []);

                        const rowClass = rr.isFirst ? "pokedexRowGroup" : "pokedexRowSub";

                        const isHit = !!findMatchSet[rr.key];
                        const isActive = activeFindKey ? rr.key === activeFindKey : false;

                        const findClass =
                          (isHit ? " pokedexFindHit" : "") +
                          (isActive ? " pokedexFindActive" : "");

                        const slug = (getPokemonSlug && getPokemonSlug(apiName)) || apiName;

                        return (
                          <tr
                            key={rr.key}
                            className={rowClass + findClass}
                            ref={function(el)
                            {
                              if (el) rowRefs.current[rr.key] = el;
                              else delete rowRefs.current[rr.key];
                            }}
                          >

                            {/* Nro Dex Pokémon */}
                            {rr.isFirst ? (
                              <>
                                {!hideNationalColumn ? (
                                  <td className="pokedexNum pokedexColNational" rowSpan={rr.rowSpan}>
                                    {base.dexNational}
                                  </td>
                                ) : null}
                                <td className="pokedexNum pokedexColDex" rowSpan={rr.rowSpan}>
                                  {base.dexLocal}
                                </td>
                              </>
                            ) : null}

                            {/* Sprite Pokémon */}
                            <td className="pokedexSpriteCell pokedexColSprite">
                              <SpriteModal
                                normalUrl={spriteUrl(form.spriteId || base.speciesId)}
                                shinyUrl={spriteShinyUrl(form.spriteId || base.speciesId)}
                                altText={form.display || base.display || apiName}
                                thumbSize={pokedexSpriteThumbSize}
                              />
                            </td>

                            {/* Nombre Pokémon */}
                            <td className="pokedexColName">
                              <button
                                type="button"
                                className="nombre-pokedex-clickable"
                                title="Ver Pokémon"
                                onClick={() => navigate(pokemonRoute(encodeURIComponent(slug)))}
                              >
                                {renderNombreConGenero(form.display || base.display || apiName)}
                              </button>
                            </td>

                            {/* Tipo/s Pokémon */}
                            <td className="pokedexColTypes">
                              <div className="pokedexTypes">
                                {t.length ? (
                                  t.map(function (tipo) {
                                    return <Tipo key={tipo} tipo={tipo} size={pokedexTipoSize} />;
                                  })
                                ) : (
                                  <span className="pokedexTypesEmpty">—</span>
                                )}
                              </div>
                            </td>

                          </tr>
                        );

                      })}
                    </tbody>

                  </table>
                </div>
              </div>

            </div>

            {/* Modal confirmación, para botones de borrar cache */}
            {confirmOpen && (
              <div
                className="pokedexModalOverlay"
                role="dialog"
                aria-modal="true"
                aria-label="Confirmación"
                onMouseDown={(e) =>
                {

                  // click afuera (overlay) cierra
                  if(e.target && e.target.classList && e.target.classList.contains("pokedexModalOverlay"))
                  {
                    closeConfirm();
                  }

                }}
              >
                <div className="pokedexModal">
                  
                  {/* Boton Cerrar Modal */}
                  <div className="pokedexModalHeader">
                    <div className="pokedexModalTitle">{modalTitle}</div>
                    <button
                      type="button"
                      className="pokedexModalClose"
                      onClick={closeConfirm}
                      aria-label="Cerrar"
                      title="Cerrar (Esc)"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Sub Modal para confirmar accion */}
                  <div className="pokedexModalBody">
                    <p className="pokedexModalText">{modalBody}</p>
                    <p className="pokedexModalWarn-VistaPokedex">
                      ¿Confirmás la acción?
                    </p>
                  </div>

                  <div className="pokedexModalActions">
                    
                    {/* Boton Cancelar */}
                    <button
                      type="button"
                      title="Cancelar"
                      className="pokedexModalBtn"
                      onClick={closeConfirm}
                    >
                      Cancelar
                    </button>

                    {/* Boton Confirmar */}
                    <button
                      ref={confirmOkBtnRef}
                      type="button"
                      title="Confirmar"
                      className={"pokedexModalBtn primary" + (confirmKind === "clearAll" ? " danger" : "")}
                      onClick={onConfirmAccept}
                    >
                      {modalConfirmLabel}
                    </button>

                  </div>

                </div>
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );

}