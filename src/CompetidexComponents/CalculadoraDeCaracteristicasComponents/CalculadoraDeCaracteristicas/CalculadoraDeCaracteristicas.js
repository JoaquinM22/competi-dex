//** src\CompetidexComponents\CalculadoraDeCaracteristicasComponents\CalculadoraDeCaracteristicas\CalculadoraDeCaracteristicas.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { FaLocationArrow } from "react-icons/fa6";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiImageDownloadFill } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { LOGO_COMPETIDEX, NATURE_PKM_META, getNaturePkmLabelEs, getStatLabelEsShort, getTypeMeta } from "../../../utils/competidexMeta";
import { CACHE_VERSION } from "../../PokemonComponents/pokemonCache";
import { hasPokemonInPokedexRegion } from "../../PokedexComponents/pokedexCache";
import NombreIDPkm from "../../PokemonComponents/VistaPokemon/DataPokemon/NombreIDPkm/NombreIDPkm";
import ImgPokemon from "../../PokemonComponents/VistaPokemon/DataPokemon/ImgPokemon/ImgPokemon";
import Tipo from "../../SharedComponents/Tipo/Tipo";
import "./CalculadoraDeCaracteristicas.css";

const CALC_MODE_BASE = "base";
const CALC_MODE_CHAMPIONS = "champions";

const STAT_LAYOUT = [
  { key: "hp", baseKey: "hp", effortKey: "effort_hp", label: getStatLabelEsShort("hp") },
  { key: "attack", baseKey: "atk", effortKey: "effort_atk", label: getStatLabelEsShort("attack") },
  { key: "defense", baseKey: "def", effortKey: "effort_def", label: getStatLabelEsShort("defense") },
  { key: "special-attack", baseKey: "spe_atk", effortKey: "effort_spe_atk", label: getStatLabelEsShort("special-attack") },
  { key: "special-defense", baseKey: "spe_def", effortKey: "effort_spe_def", label: getStatLabelEsShort("special-defense") },
  { key: "speed", baseKey: "speed", effortKey: "effort_speed", label: getStatLabelEsShort("speed") },
];

const EV_MAX_PER_STAT = 252;
const EV_TOTAL_MAX = 510;
const CHAMPIONS_EV_MAX_PER_STAT = 32;
const CHAMPIONS_EV_TOTAL_MAX = 66;
const IV_MIN = 0;
const IV_MAX = 31;
const LEVEL_MIN = 1;
const LEVEL_MAX = 100;
const KEY_CALC_SETTINGS_PREFIX = `calc:settings:${CACHE_VERSION}`;
const NATURE_OPTIONS = Object.entries(NATURE_PKM_META)
  .filter(([key]) => key !== "unknown")
  .map(([key, meta]) => ({
    key,
    labelEs: meta?.labelEs || getNaturePkmLabelEs(key),
    up: meta?.up || null,
    down: meta?.down || null,
  }));

function clamp(value, min, max)
{
  const num = Number(value);
  if(!Number.isFinite(num)) return min;
  return Math.min(Math.max(Math.trunc(num), min), max);
}

function buildState(fillValue)
{
  return STAT_LAYOUT.reduce((acc, row) =>
  {
    acc[row.key] = fillValue;
    return acc;
  }, {});
}

function getBaseValue(statsPoke, baseKey)
{
  return Number(statsPoke?.[baseKey] || 0);
}

function getNatureMultiplier(natureKey, statKey)
{
  const nature = NATURE_PKM_META[natureKey] || NATURE_PKM_META.unknown;
  if(!nature || statKey === "hp") return 1;
  if(nature.up === statKey) return 1.1;
  if(nature.down === statKey) return 0.9;
  return 1;
}

function getNatureLabelClass(natureKey, statKey)
{
  const nature = NATURE_PKM_META[natureKey] || NATURE_PKM_META.unknown;
  if(!nature) return "";
  if(nature.up === statKey) return "calcStatsPkm-natFavorable-text";
  if(nature.down === statKey) return "calcStatsPkm-natDesfavorable-text";
  return "calcStatsPkm-natureSelector-neutral";
}

function getNatureLabelDirection(natureKey, statKey)
{
  const nature = NATURE_PKM_META[natureKey] || NATURE_PKM_META.unknown;
  if(!nature) return "";
  if(nature.up === statKey) return "up";
  if(nature.down === statKey) return "down";
  return "neutral";
}

function normalizeNatureFilterText(input)
{
  return String(input || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function measureTextWidth(text, fontSize = 12)
{
  const value = String(text || "");
  if(!value) return 0;

  if(typeof document === "undefined")
  {
    return value.length * fontSize * 0.62;
  }

  try
  {
    const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement("canvas"));
    const ctx = canvas.getContext("2d");
    if(!ctx) return value.length * fontSize * 0.62;

    const fontFamily = getComputedStyle(document.body || document.documentElement).fontFamily || "Arial, sans-serif";
    ctx.font = `700 ${fontSize}px ${fontFamily}`;

    return ctx.measureText(value).width;

  }catch(e)
  {
    return value.length * fontSize * 0.62;
  }
}

function calcularStat(base, iv, ev, nivel, isHp, pokemonApiName)
{
  if(isHp)
  {
    if(String(pokemonApiName || "").trim().toLowerCase() === "shedinja") return 1;
    return Math.floor((((2 * base + iv + (ev / 4)) * nivel) / 100) + nivel + 10);
  }

  return Math.floor((((2 * base + iv + (ev / 4)) * nivel) / 100) + 5);
}

function calcularStatChampions(baseStat, statPoints, naturaleza = 1)
{
  const base = Number(baseStat || 0);
  const points = Number(statPoints || 0);
  const nat = Number(naturaleza || 1);

  return Math.floor((base + points + 20) * nat);
}

function calcularStatPSChampions(psBase, statPoints, pokemonApiName)
{
  if(String(pokemonApiName || "").trim().toLowerCase() === "shedinja")
  {
    return 1;
  }

  return Math.floor(Number(psBase || 0) + Number(statPoints || 0) + 75);
}

function getBarWidth(value, totalValue, ev, iv, natureKey, statKey)
{
  const safeTotal = Math.max(1, totalValue);
  const valueRatio = Math.max(0, Math.min(value / safeTotal, 1));
  const minWidth = 45;
  const maxWidth = 99;
  const width = Math.max(minWidth, Math.min(Math.round(minWidth + (valueRatio * (maxWidth - minWidth))), maxWidth));

  return `${width}%`;
}

function getBarColor(base)
{
  const minStat = 30;
  const maxStat = 160;
  const percentage = (base - minStat) / (maxStat - minStat);
  const hue = 0 + percentage * 120;
  return `hwb(${hue} 0% 0%)`;
}

function getCalcSettingsKey(apiName)
{
  return `${KEY_CALC_SETTINGS_PREFIX}:${String(apiName || "").trim().toLowerCase()}`;
}

function readCalcSettings(apiName)
{
  try
  {
    const raw = sessionStorage.getItem(getCalcSettingsKey(apiName));
    if(!raw) return null;
    return JSON.parse(raw);

  }catch(e)
  {
    return null;
  }
}

function writeCalcSettings(apiName, payload)
{
  try
  {
    sessionStorage.setItem(getCalcSettingsKey(apiName), JSON.stringify(payload));
  }catch(e)
  {
    //
  }
}

function restoreStatState(savedState, fillValue, min, max)
{
  const next = buildState(fillValue);
  if(savedState && typeof savedState === "object")
  {
    Object.keys(next).forEach((key) =>
    {
      next[key] = clamp(savedState[key], min, max);
    });
  }

  return next;
}

function downloadDataUrl(dataUrl, filename)
{
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const slugifyNameExport = (name) =>
{
  let s = String(name || "pokemon").toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s
    .replace(/♂/g, " macho ")
    .replace(/♀/g, " hembra ")
    .replace(/&/g, " y ")
    .replace(/’|‘|‚|‛|'/g, "");
  s = s.replace(/[^a-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");

  return s || "pokemon";
};

export default function CalculadoraDeCaracteristicas({ pokemon = null, className = "" })
{
  const [nivel, setNivel] = useState(50);
  const [nature, setNature] = useState("hardy");
  const [natureSearch, setNatureSearch] = useState("");
  const [evs, setEvs] = useState(() => buildState(0));
  const [ivs, setIvs] = useState(() => buildState(31));
  const [championsNature, setChampionsNature] = useState("hardy");
  const [championsNatureSearch, setChampionsNatureSearch] = useState("");
  const [championsEvs, setChampionsEvs] = useState(() => buildState(0));
  const [activeTab, setActiveTab] = useState(CALC_MODE_BASE);
  const [openNature, setOpenNature] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isCompactTypesViewport, setIsCompactTypesViewport] = useState(() =>
  {
    if(typeof window === "undefined") return false;
    return window.innerWidth <= 1320;
  });
  const exportRef = useRef(null);
  const natureWrapRef = useRef(null);
  const pendingRestoreRef = useRef(false);

  const isChampionsPokemon = useMemo(() =>
  {
    const apiName = String(pokemon?.apiName || "").trim().toLowerCase();
    if(!apiName) return false;

    return hasPokemonInPokedexRegion("champions", apiName);

  }, [pokemon?.apiName]);

  const calcMode = isChampionsPokemon && activeTab === CALC_MODE_CHAMPIONS
    ? CALC_MODE_CHAMPIONS
    : CALC_MODE_BASE;

  const isChampionsMode = calcMode === CALC_MODE_CHAMPIONS;

  const currentNivel = isChampionsMode ? 50 : nivel;
  const currentNature = isChampionsMode ? championsNature : nature;
  const currentNatureSearch = isChampionsMode ? championsNatureSearch : natureSearch;
  const currentEvs = isChampionsMode ? championsEvs : evs;
  const championsIvs = useMemo(() => buildState(31), []);
  const currentIvs = isChampionsMode ? championsIvs : ivs;
  const currentEvMaxPerStat = isChampionsMode ? CHAMPIONS_EV_MAX_PER_STAT : EV_MAX_PER_STAT;
  const currentEvTotalMax = isChampionsMode ? CHAMPIONS_EV_TOTAL_MAX : EV_TOTAL_MAX;
  const currentIvMin = isChampionsMode ? 31 : IV_MIN;
  const currentIvMax = 31;
  const currentLevelMin = isChampionsMode ? 50 : LEVEL_MIN;
  const currentLevelMax = isChampionsMode ? 50 : LEVEL_MAX;
  const setCurrentNatureValue = isChampionsMode ? setChampionsNature : setNature;
  const setCurrentNatureSearchValue = isChampionsMode ? setChampionsNatureSearch : setNatureSearch;
  const setCurrentEvsValue = isChampionsMode ? setChampionsEvs : setEvs;

  useEffect(() =>
  {
    const apiName = String(pokemon?.apiName || "").trim().toLowerCase();
    if(!apiName) return;

    pendingRestoreRef.current = true;

    const saved = readCalcSettings(apiName);
    const savedBase = saved?.base || saved || {};
    const savedChampions = saved?.champions || {};
    const savedNature = String(savedBase?.nature || "hardy").trim().toLowerCase();
    const savedChampionsNature = String(savedChampions?.nature || "hardy").trim().toLowerCase();
    const safeNature = NATURE_OPTIONS.some((opt) => opt.key === savedNature) ? savedNature : "hardy";
    const safeChampionsNature = NATURE_OPTIONS.some((opt) => opt.key === savedChampionsNature) ? savedChampionsNature : "hardy";
    const savedTab = String(saved?.activeTab || CALC_MODE_BASE);
    const safeTab = (savedTab === CALC_MODE_CHAMPIONS && isChampionsPokemon) ? CALC_MODE_CHAMPIONS : CALC_MODE_BASE;

    if(saved)
    {
      setActiveTab(safeTab);
      setNivel(clamp(savedBase.nivel ?? 50, LEVEL_MIN, LEVEL_MAX));
      setNature(safeNature);
      setNatureSearch(String(savedBase.natureSearch || ""));
      setEvs(restoreStatState(savedBase.evs, 0, 0, EV_MAX_PER_STAT));
      setIvs(restoreStatState(savedBase.ivs, 31, IV_MIN, IV_MAX));
      setChampionsNature(safeChampionsNature);
      setChampionsNatureSearch(String(savedChampions.natureSearch || ""));
      setChampionsEvs(restoreStatState(savedChampions.evs, 0, 0, CHAMPIONS_EV_MAX_PER_STAT));
      setOpenNature(false);

    }else
    {
      setActiveTab(CALC_MODE_BASE);
      setNivel(50);
      setNature("hardy");
      setNatureSearch("");
      setEvs(buildState(0));
      setIvs(buildState(31));
      setChampionsNature("hardy");
      setChampionsNatureSearch("");
      setChampionsEvs(buildState(0));
      setOpenNature(false);
    }

  }, [pokemon?.apiName, isChampionsPokemon]);

  useEffect(() =>
  {
    function onDocMouseDown(e)
    {
      if(natureWrapRef.current && !natureWrapRef.current.contains(e.target))
      {
        setOpenNature(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() =>
  {
    const apiName = String(pokemon?.apiName || "").trim().toLowerCase();
    if(!apiName) return;

    if(pendingRestoreRef.current)
    {
      pendingRestoreRef.current = false;
      return;
    }

    writeCalcSettings(apiName, {
      activeTab: calcMode,
      base: {
        nivel,
        nature,
        natureSearch,
        evs,
        ivs,
      },
      champions: {
        nature: championsNature,
        natureSearch: championsNatureSearch,
        evs: championsEvs,
      }
    });

  }, [pokemon?.apiName, calcMode, nivel, nature, natureSearch, evs, ivs, championsNature, championsNatureSearch, championsEvs]);

  useEffect(() =>
  {
    if(typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 1320px)");
    const sync = () => setIsCompactTypesViewport(mq.matches);

    sync();

    if(mq.addEventListener)
    {
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }

    mq.addListener(sync);
    return () => mq.removeListener(sync);
  }, []);

  useEffect(() =>
  {
    if(typeof document === "undefined") return;

    if(!isExporting) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousTouchAction = body.style.touchAction;

    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    return () => {
      body.style.overflow = previousOverflow;
      body.style.touchAction = previousTouchAction;
    };

  }, [isExporting]);

  const totalEVs = useMemo(() =>
  {
    return Object.values(currentEvs).reduce((acc, value) => acc + clamp(value, 0, currentEvMaxPerStat), 0);
  }, [currentEvs, currentEvMaxPerStat]);

  const remainingEVs = Math.max(0, currentEvTotalMax - totalEVs);

  const filteredNatureOptions = useMemo(() =>
  {
    const s = normalizeNatureFilterText(currentNatureSearch);
    if(!s) return NATURE_OPTIONS;

    return NATURE_OPTIONS.filter((opt) =>
    {
      return normalizeNatureFilterText(opt.labelEs).indexOf(s) !== -1;
    });

  }, [currentNatureSearch]);

  const rows = useMemo(() =>
  {
    const statsPoke = pokemon?.stats || {};
    const calcRows = STAT_LAYOUT.map((row) =>
    {
      const base = getBaseValue(statsPoke, row.baseKey);
      const ev = clamp(currentEvs[row.key], 0, currentEvMaxPerStat);
      const iv = isChampionsMode ? 31 : clamp(currentIvs[row.key], IV_MIN, IV_MAX);
      const level = isChampionsMode ? 50 : currentNivel;
      const isHp = row.key === "hp";
      const result = isChampionsMode
        ? (isHp
          ? calcularStatPSChampions(base, ev, pokemon?.apiName)
          : calcularStatChampions(base, ev, getNatureMultiplier(currentNature, row.key)))
        : (() =>
        {
            const baseResult = calcularStat(base, iv, ev, level, isHp, pokemon?.apiName);
            return isHp ? baseResult : Math.floor(baseResult * getNatureMultiplier(currentNature, row.key));
        })();

      return {
        ...row,
        base,
        ev,
        iv,
        pe: Number(statsPoke?.[row.effortKey] || 0),
        result,
        barColor: getBarColor(base),
      };
    });

    const totalValue = calcRows.reduce((acc, row) => acc + row.result, 0);

    return calcRows.map((row) => ({
      ...row,
      barWidth: getBarWidth(row.result, totalValue, row.ev, row.iv, currentNature, row.key),
    }));
  }, [pokemon, currentEvs, currentIvs, currentNivel, currentNature, currentEvMaxPerStat, isChampionsMode]);

  const changeEv = (statKey, nextValue) =>
  {
    const raw = clamp(nextValue, 0, currentEvMaxPerStat);

    setCurrentEvsValue((prev) =>
    {
      const totalWithoutCurrent = Object.entries(prev).reduce((acc, [key, value]) =>
      {
        if(key === statKey) return acc;
        return acc + clamp(value, 0, currentEvMaxPerStat);
      }, 0);

      const maxAllowed = Math.min(currentEvMaxPerStat, currentEvTotalMax - totalWithoutCurrent);
      const value = Math.min(raw, Math.max(0, maxAllowed));

      if(prev[statKey] === value) return prev;

      return {
        ...prev,
        [statKey]: value,
      };
    });
  };

  const changeIv = (statKey, nextValue) =>
  {
    const value = clamp(nextValue, currentIvMin, currentIvMax);

    setIvs((prev) =>
    {
      if(prev[statKey] === value) return prev;
      return {
        ...prev,
        [statKey]: value,
      };
    });
  };

  const changeIvBy = (statKey, delta) =>
  {
    setIvs((prev) =>
    {
      const nextValue = clamp((prev[statKey] ?? 31) + delta, currentIvMin, currentIvMax);
      if(nextValue === prev[statKey]) return prev;
      return {
        ...prev,
        [statKey]: nextValue,
      };
    });
  };

  const changeLevelBy = (delta) =>
  {
    if(isChampionsMode) return;
    setNivel((prev) => clamp(prev + delta, LEVEL_MIN, LEVEL_MAX));
  };

  const pokemonName = pokemon?.display || pokemon?.apiName || "Pokemon";
  const id = pokemon?.id || null;
  const typesPkm = pokemon?.types || [];
  const getTipoBgPkm = (tipo) => getTypeMeta(tipo)?.color || "#68A090";

  const getTipoLabelPkm = (tipo) =>
  {
    const meta = getTypeMeta(tipo);
    return String(meta?.labelEs || tipo || "").trim();
  };

  const tipoPkmWidth = useMemo(() =>
  {
    const labels = typesPkm
      .map((tipo) => getTipoLabelPkm(tipo))
      .filter(Boolean);

    if(!labels.length) return 0;

    const fontSize = 22;
    const paddingX = 25;
    const gap = 5;
    const iconSize = 18;
    const borderWidth = 2;
    const extra = 14;

    let maxLabelWidth = 0;

    for(let i = 0; i < labels.length; i++)
    {
      const label = labels[i];
      maxLabelWidth = Math.max(maxLabelWidth, measureTextWidth(label, fontSize));
    }

    return Math.ceil(maxLabelWidth + (paddingX * 2) + iconSize + gap + (borderWidth * 2) + extra);

  }, [typesPkm]);


  // ------------- BLOQUE NATURALEZA - INICIO ------------- 

  // Funcion que retorna el icono de "Sube Stat", "Baja Stat" o "Neutro"
  const renderNatureStatIcon = (direction) =>
  {
    if(direction === "up")
    {
      return <MdOutlineKeyboardDoubleArrowUp className="calcStatsPkm-natureIcon calcStatsPkm-natureIcon-up" />;
    }

    if(direction === "down")
    {
      return <MdOutlineKeyboardDoubleArrowUp className="calcStatsPkm-natureIcon calcStatsPkm-natureIcon-down" />;
    }

    return <TfiLayoutLineSolid className="calcStatsPkm-natureIcon calcStatsPkm-natureIcon-neutral" />;
  };

  // Funcion que retorna el detalle de la naturaleza que le llega por prop (Ej: Ataque Sube / Velocidad Baja)
  const renderNatureDetails = (natureKey) =>
  {
    const opt = NATURE_OPTIONS.find((item) => item.key === natureKey);
    if(!opt) return null;

    const isNeutral = !opt.up && !opt.down;

    if(isNeutral)
    {
      return (
        <span className="calcStatsPkm-natureOptInfo">
          <span className="calcStatsPkm-natureParen calcStatsPkm-natureParen-open">(</span>
          <span className="calcStatsPkm-natureSelector-neutral">Neutro</span>
          <span className="calcStatsPkm-natureParen calcStatsPkm-natureParen-close">)</span>
        </span>
      );
    }

    return (
      <span className="calcStatsPkm-natureOptInfo">
        <span className="calcStatsPkm-natureParen calcStatsPkm-natureParen-open">(</span>
        <span className="calcStatsPkm-natureSelector-up">
          {getStatLabelEsShort(opt.up)}
          <MdOutlineKeyboardDoubleArrowUp className="calcStatsPkm-natureIcon calcStatsPkm-natureIcon-up" />
        </span>
        <span className="calcStatsPkm-natureSeparator">/</span>
        <span className="calcStatsPkm-natureSelector-down">
          {getStatLabelEsShort(opt.down)}
          <MdOutlineKeyboardDoubleArrowUp className="calcStatsPkm-natureIcon calcStatsPkm-natureIcon-down" />
        </span>
        <span className="calcStatsPkm-natureParen calcStatsPkm-natureParen-close">)</span>
      </span>
    );
  };

  // Funcion que retorna el bloque input de Naturaleza
  const renderNatureSelectBlock = () => (
    <div ref={natureWrapRef} className="calcStatsPkm-natureBlock">
      <button
        type="button"
        className={"calcStatsPkm-naturePick" + (openNature ? " isOpen" : "")}
        onClick={() => setOpenNature((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={openNature}
      >
        <span className="calcStatsPkm-naturePickText">
          <span className="calcStatsPkm-naturePickLabel">{getNaturePkmLabelEs(currentNature)}</span>
          {renderNatureDetails(currentNature)}
        </span>
        <span className={"calcStatsPkm-naturePickCaret" + (openNature ? " isOpen" : "")} aria-hidden="true">
          <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
        </span>
      </button>

      {openNature && (
        <div className="calcStatsPkm-natureList" role="listbox" aria-label="Naturaleza">
          <div className="calcStatsPkm-natureListInner">
            {filteredNatureOptions.map((opt) =>
            {
              const selected = opt.key === currentNature;
              const isNeutral = !opt.up && !opt.down;

              return (
                <button
                  key={opt.key}
                  type="button"
                  className={"calcStatsPkm-natureOpt" + (selected ? " selected" : "")}
                  onClick={() =>
                  {
                    setCurrentNatureValue(opt.key);
                    setOpenNature(false);
                  }}
                  role="option"
                  aria-selected={selected}
                  data-selected={selected ? "1" : "0"}
                >
                  <span className="calcStatsPkm-natureOptMain">
                    <span className="calcStatsPkm-natureOptName">{opt.labelEs}</span>

                    {isNeutral ? (
                      <span className="calcStatsPkm-natureSelector-neutral">(Neutro)</span>
                    ) : (
                      renderNatureDetails(opt.key)
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );

  // Funcion que retorna el bloque de Naturaleza completo
  const renderNatureFilterBlock = () => (
    <div className="calcStatsPkm-controlGroup calcStatsPkm-naturePanel">
      <div className="calcStatsPkm-controlHeader">
        <span className="calcStatsPkm-controlLabel calcStatsPkm-naturePanelTitle">Naturaleza</span>
        <button
          title="Limpiar naturaleza"
          type="button"
          className="calcStatsPkm-clearBtn"
          onClick={() =>
          {
            setCurrentNatureValue("hardy");
            setCurrentNatureSearchValue("");
            setOpenNature(false);
          }}
        >
          Limpiar
        </button>
      </div>

      <div className="calcStatsPkm-controlBody">
        <label className="calcStatsPkm-filterLabel">Buscar</label>
        <input
          inputMode="search"
          enterKeyHint="search"
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          name="calc-nature-search"
          className="calcStatsPkm-input calcStatsPkm-searchInput"
          value={currentNatureSearch}
          onChange={(e) => setCurrentNatureSearchValue(e.target.value)}
          placeholder="Escribí para filtrar…"
          onFocus={() => setOpenNature(true)}
        />

        <div style={{ marginTop: 10 }}>
          {renderNatureSelectBlock()}
        </div>
      </div>
    </div>
  );

  // ------------- BLOQUE NATURALEZA - FIN ------------- 


  // Funcion que retorna la tabla de Características Dinamica
  const renderDinamicTable = () => (
    <table className="calcStatsPkm-tabla-estadisticas calcStatsPkm-bordeColor">
      
      <colgroup>
        <col className="calcStatsPkm-col-stat" />
        <col className="calcStatsPkm-col-base" />
        <col className="calcStatsPkm-col-bar" />
        <col className="calcStatsPkm-col-result" />
        {isChampionsMode ? (
          <col className="calcStatsPkm-col-extraStat" />
        ) : (
          <>
            <col className="calcStatsPkm-col-extraStat" />
            <col className="calcStatsPkm-col-extraStat" />
          </>
        )}
        <col className="calcStatsPkm-col-pe" />
      </colgroup>
      
      {/* Headers */}
      <thead className="calcStatsPkm-fondoOscuro">
        <tr>
          <th></th>
          <th></th>
          <th>Características</th>
          <th className="calcStatsPkm-bordeColor calcStatsPkm-valorFinalCell">Valor Final</th>
          {isChampionsMode ? (
            <th className="calcStatsPkm-bordeColor">Puntos de Característica</th>
          ) : (
            <>
              <th className="calcStatsPkm-bordeColor">EVs</th>
              <th className="calcStatsPkm-bordeColor">IVs</th>
            </>
          )}
          <th className="calcStatsPkm-bordeColor">PE</th>
        </tr>
      </thead>

      {/* Cuerpo de la tabla */}
      <tbody>
        {rows.map((stat, index) => (
          <tr key={`calc-${index}`} className="calcStatsPkm-bordeColor">
            
            {/* Label ES */}
            <td className="calcStatsPkm-bordeColor calcStatsPkm-fondoOscuro calcStatsPkm-textoNegrita calcStatsPkm-labelStat">
              <span className={`calcStatsPkm-labelEsStat ${getNatureLabelClass(currentNature, stat.key)}`}>
                {stat.label}
                {renderNatureStatIcon(getNatureLabelDirection(currentNature, stat.key))}
              </span>
            </td>

            {/* Stat Base */}
            <td className="calcStatsPkm-textoNegrita">{stat.base}</td>
            
            {/* Barra Dinamica */}
            <td className="calcStatsPkm-bordeColor calcStatsPkm-barraGrafico">
              <div className="calcStatsPkm-barra-container">
                <div
                  className="calcStatsPkm-barra"
                  style={{
                    width: stat.barWidth,
                    backgroundColor: stat.barColor,
                  }}
                />
              </div>
            </td>

            {/* Valor final Dinamico */}
            <td className="calcStatsPkm-bordeColor calcStatsPkm-textoNegrita calcStatsPkm-valorFinalCell">{stat.result}</td>
            
            {isChampionsMode ? (
              <td className="calcStatsPkm-bordeColor calcStatsPkm-textoNegrita">{stat.ev}</td>
            ) : (
              <>
                <td className="calcStatsPkm-bordeColor calcStatsPkm-textoNegrita">{stat.ev}</td>
                <td className="calcStatsPkm-bordeColor calcStatsPkm-textoNegrita">{stat.iv}</td>
              </>
            )}

            {/* PE (Puntos de Esfuerzo) */}
            <td className="calcStatsPkm-bordeColor">{stat.pe}</td>
          </tr>
        ))}

        {/* Total Base */}
        <tr className="calcStatsPkm-fila-adicional calcStatsPkm-fondoOscuro">
          <td className="calcStatsPkm-bordeColor">Total</td>
          <td className="calcStatsPkm-bordeColor">
            {rows.reduce((acc, stat) => acc + stat.base, 0)}
          </td>
          <td colSpan={2 + (isChampionsMode ? 1 : 2)}></td>
          <td className="calcStatsPkm-bordeColor calcStatsPkm-fondoOscuro calcStatsPkm-totalPeCell"></td>
        </tr>

        {/* Mini detalle de Nivel + naturaleza (9na Gen) / Naturaleza (Champions) */}
        <tr className="calcStatsPkm-fila-nota calcStatsPkm-fondoOscuro">
          <td className="calcStatsPkm-bordeColor calcStatsPkm-notaCell" colSpan={5 + (isChampionsMode ? 1 : 2)}>
            <div className="calcStatsPkm-notaTexto">
              {isChampionsMode ? (
                <>
                  Valores finales calculados con naturaleza <strong>{getNaturePkmLabelEs(currentNature)}</strong>
                </>
              ) : (
                <>
                  Valores finales calculados con Nivel <strong>{currentNivel}</strong> y naturaleza <strong>{getNaturePkmLabelEs(currentNature)}</strong>
                </>
              )}
            </div>
          </td>
        </tr>

      </tbody>

    </table>
  );


  // ------------- BLOQUE TABLA CONFIGURACION EVs/PUNTOS DE CARACTERISTICA - INICIO ------------- 

  // Funcion que retorna el bloque de la columna "Caracteristica"
  const renderStatLabelBlock = (row) => (
    <div className="calcStatsPkm-controlStatCell">
            
      {/* Label ES de la Caracteristica */}
      <strong className={`calcStatsPkm-labelEsStat ${getNatureLabelClass(currentNature, row.key)}`}>
        {row.label}
        {renderNatureStatIcon(getNatureLabelDirection(currentNature, row.key))}
      </strong>
    
    </div>
  );

  // Funcion que retorna el bloque input de EVs
  const renderEVsInputBlock = (row) => (
    <div className="calcStatsPkm-evsBlock">
      
      {/* Input barra para setear EVs */}
      <input
        type="range"
        min="0"
        max={currentEvMaxPerStat}
        step="1"
        value={row.ev}
        onChange={(e) => changeEv(row.key, e.target.value)}
        className="calcStatsPkm-evSlider calcStatsPkm-evSliderFull"
      />

      {/* Input numerico que dinamico con el valor */}
      <input
        type="search"
        inputMode="numeric"
        pattern="[0-9]*"
        enterKeyHint="done"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        min="0"
        max={currentEvMaxPerStat}
        step={1}
        value={row.ev}
        onChange={(e) => changeEv(row.key, e.target.value)}
        className="calcStatsPkm-numberInput calcStatsPkm-evInput"
      />

    </div>
  );

  // Funcion que retorna el bloque input de IVs
  const renderIVsInputBlock = (row) => (
    <div className="calcStatsPkm-ivsBlock">
      
      {/* Input del valor de IV */}
      <input
        type="search"
        inputMode="numeric"
        pattern="[0-9]*"
        enterKeyHint="done"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        min={currentIvMin}
        max={currentIvMax}
        step={1}
        value={row.iv}
        onChange={(e) => changeIv(row.key, e.target.value)}
        onBlur={(e) => changeIv(row.key, e.target.value)}
        className="calcStatsPkm-numberInput calcStatsPkm-ivInput"
      />

      {/* Contenedor de botones para subir y bajar IVs */}
      <div className="calcStatsPkm-ivsStepper">
        
        {/* Boton Subir IV */}
        <button
          title="Subir IV"
          type="button"
          className="calcStatsPkm-stepBtn calcStatsPkm-stepBtn-up calcStatsPkm-ivsStepBtn"
          onClick={() => changeIvBy(row.key, 1)}
        >
          +
        </button>
        
        {/* Boton Bajar IV */}
        <button
          title="Bajar IV"
          type="button"
          className="calcStatsPkm-stepBtn calcStatsPkm-stepBtn-down calcStatsPkm-ivsStepBtn"
          onClick={() => changeIvBy(row.key, -1)}
        >
          -
        </button>

      </div>

    </div>
  );

  // Funcion que retorna la tabla de Control de EVs e IVs
  const renderControlsGrid = () => (
    isChampionsMode ? (
      <table className="calcStatsPkm-controlsTable calcStatsPkm-bordeColor calcStatsPkm-controlsTable--champions">
        
        {/* Headers */}
        <thead className="calcStatsPkm-fondoOscuro">
          <tr>
            <th className="calcStatsPkm-mainDividerRight">Característica</th>
            <th>{isChampionsMode ? "Puntos de Característica" : "EVs"}</th>
          </tr>
        </thead>

        {/* Cuerpo de la Tabla, una fila por cada stat */}
        <tbody>
          {rows.map((row) => (
            <tr key={`ctrl-${row.key}`} className="calcStatsPkm-controlsRow">
              
              {/* Stat Label ES */}
              <td>{renderStatLabelBlock(row)}</td>

              {/* Barra de EVs */}
              <td>{renderEVsInputBlock(row)}</td>

            </tr>
          ))}
        </tbody>

      </table>
    ) : (
      <table className="calcStatsPkm-controlsTable calcStatsPkm-bordeColor">
        
        {/* Headers */}
        <thead className="calcStatsPkm-fondoOscuro">
          <tr>
            <th className="calcStatsPkm-mainDividerRight">Característica</th>
            <th className="calcStatsPkm-mainDividerRight">EVs</th>
            <th>IVs</th>
          </tr>
        </thead>

        {/* Cuerpo de la Tabla, una fila por cada stat */}
        <tbody>
          {rows.map((row) => (
            <tr key={`ctrl-${row.key}`} className="calcStatsPkm-controlsRow">
              
              {/* Stat Label ES */}
              <td>{renderStatLabelBlock(row)}</td>
              
              {/* Barra de EVs */}
              <td>{renderEVsInputBlock(row)}</td>
              
              {/* Input de IVs */}
              <td>{renderIVsInputBlock(row)}</td>
            
            </tr>
          ))}
        </tbody>

      </table>
    )
  );

  // ------------- BLOQUE TABLA CONFIGURACION EVs/PUNTOS DE CARACTERISTICA - FIN ------------- 

  // Funcion que retorna el bloque input de Nivel
  const renderLevelBlock = () => (
    isChampionsMode ? null : (
    <div className="calcStatsPkm-levelPanel">

      <div className="calcStatsPkm-levelPanel-controlHeader">
        <span className="calcStatsPkm-levelPanel-controlLabel calcStatsPkm-levelPanelTitle">Nivel</span>
      </div>

      <div className="calcStatsPkm-levelBlock">
        
        {/* Input del nivel */}
        <input
          type="search"
          inputMode="numeric"
          pattern="[0-9]*"
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          min={currentLevelMin}
          max={currentLevelMax}
          step={1}
          value={currentNivel}
          onChange={(e) => setNivel(clamp(e.target.value, currentLevelMin, currentLevelMax))}
          className="calcStatsPkm-numberInput calcStatsPkm-levelInput calcStatsPkm-levelNumberInput"
        />

        {/* Contenedor de botones para subir y bajar nivel */}
        <div className="calcStatsPkm-levelStepper">
          
          {/* Boton Subir Nivel */}
          <button
            title="Subir nivel"
            type="button"
            className="calcStatsPkm-stepBtn calcStatsPkm-stepBtn-up calcStatsPkm-levelStepBtn"
            onClick={() => changeLevelBy(1)}
          >
            +
          </button>
          
          {/* Boton Bajar Nivel */}
          <button
            title="Bajar nivel"
            type="button"
            className="calcStatsPkm-stepBtn calcStatsPkm-stepBtn-down calcStatsPkm-levelStepBtn"
            onClick={() => changeLevelBy(-1)}
          >
            -
          </button>

        </div>

      </div>
    </div>
    )
  );

  // Funcion que retorna el bloque de EVs/Puntos de Caracteristica usados
  const renderEvsUsedBlock = () => (
    <div className="calcStatsPkm-pill">
      {isChampionsMode ? "Puntos de Característica usados: " : "EVs usados: "}
      <strong>{totalEVs}</strong> / {currentEvTotalMax}
    </div>
  );

  // Funcion que retorna el bloque de EVs/Puntos de Caracteristica libres
  const renderEvsFreeBlock = () => (
    <div className="calcStatsPkm-pill">
      {isChampionsMode ? "Puntos de Característica libres: " : "EVs libres: "}
      <strong>{remainingEVs}</strong>
    </div>
  );


  // ------------- BLOQUE FUNCIONES EXPORTACION - INICIO ------------- 
  
  // Funcion que retorna la tabla dinamica exclusiva para exportacion
  const renderDinamicTableExport = () => (
    <table className="calcStatsPkm-exportMode-tabla-estadisticas calcStatsPkm-exportMode-bordeColor">
      
      <colgroup>
        <col className="calcStatsPkm-exportMode-col-stat" />
        <col className="calcStatsPkm-exportMode-col-base" />
        <col className="calcStatsPkm-exportMode-col-bar" />
        <col className="calcStatsPkm-exportMode-col-result" />
        {isChampionsMode ? (
          <col className="calcStatsPkm-exportMode-col-extraStat" />
        ) : (
          <>
            <col className="calcStatsPkm-exportMode-col-extraStat" />
            <col className="calcStatsPkm-exportMode-col-extraStat" />
          </>
        )}
        <col className="calcStatsPkm-exportMode-col-pe" />
      </colgroup>

      <thead className="calcStatsPkm-exportMode-fondoOscuro">
        <tr>
          <th></th>
          <th></th>
          <th>Características</th>
          <th className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-valorFinalCell">Valor Final</th>
          {isChampionsMode ? (
            <th className="calcStatsPkm-exportMode-bordeColor">Puntos de Característica</th>
          ) : (
            <>
              <th className="calcStatsPkm-exportMode-bordeColor">EVs</th>
              <th className="calcStatsPkm-exportMode-bordeColor">IVs</th>
            </>
          )}
          <th className="calcStatsPkm-exportMode-bordeColor">PE</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((stat, index) => (
          <tr key={`export-${index}`} className="calcStatsPkm-exportMode-bordeColor">
            <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-fondoOscuro calcStatsPkm-exportMode-textoNegrita calcStatsPkm-exportMode-labelStat">
              <span className={`calcStatsPkm-exportMode-labelEsStat ${getNatureLabelClass(currentNature, stat.key)}`}>
                {stat.label}
                {renderNatureStatIcon(getNatureLabelDirection(currentNature, stat.key))}
              </span>
            </td>

            <td className="calcStatsPkm-exportMode-textoNegrita">{stat.base}</td>

            <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-barraGrafico">
              <div className="calcStatsPkm-exportMode-barra-container">
                <div
                  className="calcStatsPkm-exportMode-barra"
                  style={{
                    width: stat.barWidth,
                    backgroundColor: stat.barColor,
                  }}
                />
              </div>
            </td>

            <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-textoNegrita calcStatsPkm-exportMode-valorFinalCell">{stat.result}</td>

            {isChampionsMode ? (
              <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-textoNegrita">{stat.ev}</td>
            ) : (
              <>
                <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-textoNegrita">{stat.ev}</td>
                <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-textoNegrita">{stat.iv}</td>
              </>
            )}

            <td className="calcStatsPkm-exportMode-bordeColor">{stat.pe}</td>
          </tr>
        ))}

        <tr className="calcStatsPkm-exportMode-fila-adicional calcStatsPkm-exportMode-fondoOscuro">
          <td className="calcStatsPkm-exportMode-bordeColor">Total</td>
          <td className="calcStatsPkm-exportMode-bordeColor">
            {rows.reduce((acc, stat) => acc + stat.base, 0)}
          </td>
          <td colSpan={2 + (isChampionsMode ? 1 : 2)}></td>
          <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-fondoOscuro calcStatsPkm-exportMode-totalPeCell"></td>
        </tr>

        <tr className="calcStatsPkm-exportMode-fila-nota calcStatsPkm-exportMode-fondoOscuro">
          <td className="calcStatsPkm-exportMode-bordeColor calcStatsPkm-exportMode-notaCell" colSpan={5 + (isChampionsMode ? 1 : 2)}>
            <div className="calcStatsPkm-exportMode-notaTexto">
              {isChampionsMode ? (
                <>
                  Valores finales calculados con naturaleza <strong>{getNaturePkmLabelEs(currentNature)}</strong>
                </>
              ) : (
                <>
                  Valores finales calculados con Nivel <strong>{currentNivel}</strong> y naturaleza <strong>{getNaturePkmLabelEs(currentNature)}</strong>
                </>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
  
  // Funcion que retorna el bloque superior exclusivo para exportacion
  const renderExportTopBlock = () => (
    <div className="calcStatsPkm-exportMode-topRow">

      {/* Foto + Tipos */}
      <div className="calcStatsPkm-exportMode-imagePkmandTypeCont">
        
        {/* Foto */}
        <div>
          <ImgPokemon
            imgNormal={pokemon?.img || ""}
            imgShiny={pokemon?.imgShiny || ""}
            altText={pokemonName}
          />
        </div>

        {/* Tipos */}
        {typesPkm.length === 1 ? (
          <div className="calcStatsPkm-exportMode-contenedorTipos">
            <div className="calcStatsPkm-exportMode-tiposFila">
              <div
                className="calcStatsPkm-exportMode-tipo-wrap-pkm-vertical-UnoSolo"
                style={{ backgroundColor: getTipoBgPkm(typesPkm[0]) }}
              >
                <Tipo
                  tipo={typesPkm[0]}
                  size="normal"
                />
              </div>
            </div>
          </div>
        ) : typesPkm.length === 2 ? (
          <div className="calcStatsPkm-exportMode-tipos-stack-center">
            <div className="calcStatsPkm-exportMode-contenedor-tipos-horizontal-dos">
              {typesPkm.map((tipo, index) => (
                <div
                  key={index}
                  className="calcStatsPkm-exportMode-tipo-wrap-pkm-horizontal-dos"
                  style={tipoPkmWidth ? {
                    backgroundColor: getTipoBgPkm(tipo),
                    "--tipo-pkm-width": `${tipoPkmWidth}px`
                  } : {
                    backgroundColor: getTipoBgPkm(tipo)
                  }}
                >
                  <Tipo
                    tipo={tipo}
                    size="normal"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="calcStatsPkm-exportMode-tipos-stack-center">
            <div className="calcStatsPkm-exportMode-contenedor-tipos-vertical">
              {typesPkm.map((tipo, index) => (
                <div
                  key={index}
                  className="calcStatsPkm-exportMode-tipo-wrap-pkm-vertical"
                  style={tipoPkmWidth ? {
                    backgroundColor: getTipoBgPkm(tipo),
                    "--tipo-pkm-width": `${tipoPkmWidth}px`
                  } : {
                    backgroundColor: getTipoBgPkm(tipo)
                  }}
                >
                  <Tipo
                    tipo={tipo}
                    size="normal"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Tabla */}
      <div className="calcStatsPkm-exportMode-tablaWrap">
        {renderDinamicTableExport()}
      </div>

    </div>
  );

  // ------------- BLOQUE FUNCIONES EXPORTACION - FIN -------------

  // Funcion que inicia la descarga, bloquea la vista
  const handleExportPng = async () =>
  {
    if(isExporting) return;

    setIsExporting(true);

    try
    {
      const node = exportRef.current;
      if(!node) return;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#383b3f",
        width: 1500,
        style: {
          position: "relative",
          left: "0",
          top: "0",
          transform: "none",
          zIndex: "0",
          opacity: "1",
          visibility: "visible",
          overflow: "visible",
        },
      });

      if(!dataUrl) return;

      const safeName =  slugifyNameExport(String(pokemonName || "pokemon"));

      downloadDataUrl(dataUrl, `${safeName}_caracteristicas_calculadas_competidex.png`);

    }catch(e)
    {
      console.error("Error exportando PNG:", e);

    }finally
    {
      setIsExporting(false);
    }
  };

  return (
    <div className={`calcStatsPkm-calcWrapper ${className}`.trim()}>
      
      {/* ID + Nombre + Sprite */}
      <div>
        <NombreIDPkm
          id={id}
          nombre={pokemonName}
          tipos={typesPkm}
        />
      </div>

      {/* Data completa de la calculadora */}
      <div className="calcStatsPkm-modePanel">
        
        {/* Tabs solo si posee los dos modos */}
        {isChampionsPokemon && (
          <div className="calcStatsPkm-tabsWrapper">
            <div className="calcStatsPkm-tabs">
              
              {/* Tab de 9na Gen */}
              <button
                type="button"
                className={`calcStatsPkm-tab ${calcMode === CALC_MODE_BASE ? "active" : ""}`}
                onClick={() => setActiveTab(CALC_MODE_BASE)}
              >
                ≤ 9na Gen
              </button>

              {/* Tab de Champions */}
              <button
                type="button"
                className={`calcStatsPkm-tab ${calcMode === CALC_MODE_CHAMPIONS ? "active" : ""}`}
                onClick={() => setActiveTab(CALC_MODE_CHAMPIONS)}
              >
                Champions
              </button>

            </div>
          </div>
        )}

        {/* Boton para Exportar la tabla calculada */}
        <div className="calcStatsPkm-exportActions">
          <button
            type="button"
            className={`calcStatsPkm-exportBtn${isExporting ? " calcStatsPkm-exportBtn--busy" : ""}`}
            onClick={handleExportPng}
            title={isExporting ? "Exportando, por favor espere" : "Exportar como imagen PNG"}
            disabled={isExporting}
          >
            {isExporting ? "Exportando..." : "Exportar Características Calculadas"}
            {isExporting ? (
              <AiOutlineLoading3Quarters className="calcStatsPkm-exportBtnIcon calcStatsPkm-exportBtnIcon--spin" />
            ) : (
              <RiImageDownloadFill className="calcStatsPkm-exportBtnIcon" />
            )}
          </button>
        </div>

        {/* Fila superior: (Foto + Tipos) + (Tabla dinamica) */}
        <div className="calcStatsPkm-topRow">
          
          {/* Foto + Tipos */}
          <div className="calcStatsPkm-imagePkmandTypeCont">

            {/* Foto del Pokémon */}
            <div>
              <ImgPokemon
                imgNormal={pokemon?.img || ""}
                imgShiny={pokemon?.imgShiny || ""}
                altText={pokemonName}
              />
            </div>

            {/* Tipos del Pokémon */}
            {typesPkm.length === 1 ? (
              <div className="calcStatsPkm-contenedorTipos">
                <div className="calcStatsPkm-tiposFila">
                  <div
                    className="calcStatsPkm-tipo-wrap-pkm-vertical-UnoSolo"
                    style={{ backgroundColor: getTipoBgPkm(typesPkm[0]) }}
                  >
                    <Tipo
                      tipo={typesPkm[0]}
                      size="normal"
                    />
                  </div>
                </div>
              </div>
            ) : typesPkm.length === 2 ? (
              <div className="calcStatsPkm-tipos-stack-center">
                <div className="calcStatsPkm-contenedor-tipos-horizontal-dos">
                  {typesPkm.map((tipo, index) => (
                    <div
                      key={index}
                      className="calcStatsPkm-tipo-wrap-pkm-horizontal-dos"
                      style={tipoPkmWidth ? {
                        backgroundColor: getTipoBgPkm(tipo),
                        "--tipo-pkm-width": `${tipoPkmWidth}px`
                      } : {
                        backgroundColor: getTipoBgPkm(tipo)
                      }}
                    >
                    <Tipo
                      tipo={tipo}
                      size={isCompactTypesViewport ? "medium" : "normal"}
                    />
                  </div>
                ))}
                </div>
              </div>
            ) : (
              <div className="calcStatsPkm-tipos-stack-center">
                <div className="calcStatsPkm-contenedor-tipos-vertical">
                  {typesPkm.map((tipo, index) => (
                    <div
                      key={index}
                      className="calcStatsPkm-tipo-wrap-pkm-vertical"
                      style={tipoPkmWidth ? {
                        backgroundColor: getTipoBgPkm(tipo),
                        "--tipo-pkm-width": `${tipoPkmWidth}px`
                      } : {
                        backgroundColor: getTipoBgPkm(tipo)
                      }}
                    >
                      <Tipo
                        tipo={tipo}
                        size="normal"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Tabla dinámica */}
          <div className="calcStatsPkm-tablaWrap">
            {renderDinamicTable()}
          </div>

        </div>

        {/* Fila inferior: (Tabla controles) + (Nivel + Naturaleza + Métricas) */}
        <div className="calcStatsPkm-bottomRow">

          {/* (Filtro de Naturalezas) + (Filtro de Nivel + EVs/Puntos de Caracteristica usados y libres) */}
          <div className="calcStatsPkm-sidePanel">
            
            {/* Filtro de Naturalezas */}
            <div className="calcStatsPkm-topControlsPanel">
              {renderNatureFilterBlock()}
            </div>

            {/* Filtro de Nivel + EVs/Puntos de Caracteristica usados y libres */}
            <div className="calcStatsPkm-levelMetricsRow">
              
              {/* El Bloque de nivel solo se ve en modo comun */}
              {!isChampionsMode && (
                <div className="calcStatsPkm-levelMetricsLevel">
                  {renderLevelBlock()}
                </div>
              )}

              {/* EVs/Puntos de Caracteristica usados y libres */}
              <div className={`calcStatsPkm-sideMetrics${isChampionsMode ? " calcStatsPkm-sideMetrics--champions" : ""}`}>
                {renderEvsUsedBlock()}
                {renderEvsFreeBlock()}
              </div>

            </div>

          </div>
          
          {/* Filtro de EVs e IVs (Modo Comun) / Filtro de Puntos de Caracteristica (Champions) */}
          <div className="calcStatsPkm-controlsTableWrap">
            {renderControlsGrid()}
          </div>

        </div>

      </div>

      {/* Bloque invisible que bloquea la vista en lo que descarga la imagen exportada */}
      {isExporting && (
        <div className="calcStatsPkm-exportBlocker" aria-hidden="true" />
      )}

      {/* Bloque de foto + stats oculto para exportar */}
      <div className="calcStatsPkm-exportShell">
        <div ref={exportRef} className="calcStatsPkm-contGral-Export calcStatsPkm-exportMode-root">
          
          {/* Titulo */}
          <div className="calcStatsPkm-exportMode-brandRow">
            <img
              src={LOGO_COMPETIDEX}
              alt="Competidex"
              className="calcStatsPkm-exportMode-brandLogo"
              draggable="false"
            />
          </div>
          
          {/* ID + Nombre + Sprite */}
          <div className="calcStatsPkm-exportMode-nombreId">
            <NombreIDPkm
              id={id}
              nombre={pokemonName}
              tipos={typesPkm}
            />
          </div>

          {/* (Foto + Tipos) + (Tabla) */}
          {renderExportTopBlock()}

          {/* Mini Footer */}
          <div className="calcStatsPkm-exportMode-footer">
            <span className="calcStatsPkm-exportMode-footerText">
              © 2026 Competidex · Elaborado por {" "}
              <span className="calcStatsPkm-exportMode-footerBold">
                <FaLinkedin
                  className="calcStatsPkm-exportMode-footerLinkedInLogo"
                  aria-hidden="true"
                />
                {" "}Joaquin Marcelo Albarracin
              </span>
              {" "}· Datos vía PokéAPI
            </span>
          </div>

        </div>
      </div>

    </div>
  );

}