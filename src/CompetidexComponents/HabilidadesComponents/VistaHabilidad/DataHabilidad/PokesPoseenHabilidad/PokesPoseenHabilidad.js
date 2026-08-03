//** src\CompetidexComponents\HabilidadesComponents\VistaHabilidad\DataHabilidad\PokesPoseenHabilidad\PokesPoseenHabilidad.js

import React, { useMemo, useRef, useState, useEffect } from "react";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { BiExpandAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { usePokemon } from "../../../../../CompetidexComponents/PokemonComponents/PokemonProvider";
import { spriteUrl, spriteShinyUrl } from "../../../../../config/endpoints";
import { pokemonRoute } from "../../../../../utils/competidexRoutes";
import { getTypeLabelEs, isPokemonBlockedAbilities, toPokemonDisplayName, getBaseApiKeyFromMega } from "../../../../../utils/competidexMeta";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import Modal from "../../../../SharedComponents/Modal/Modal";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import "./PokesPoseenHabilidad.css";

// ------- Funciones Auxiliares ------- 
function normText(s)
{
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function isBlocked(apiName)
{
  return (typeof isPokemonBlockedAbilities === "function")
    ? isPokemonBlockedAbilities(apiName)
    : false;
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
      <span className="pphNameWrap">
        <span className="pphNameText">{baseM}</span>
        <IoMdMale className="pphGenderIcon male" aria-label="Macho" />
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
      <span className="pphNameWrap">
        <span className="pphNameText">{baseF}</span>
        <IoMdFemale className="pphGenderIcon female" aria-label="Hembra" />
      </span>
    );

  }

  return (
    <span className="pphNameWrap">
      <span className="pphNameText">{n}</span>
    </span>
  );

}

function headerClass(sortConfig, key)
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

  return "pphThSortable" + (s ? " sorted " + s.direction : "");

}

function renderSortIcon(sortConfig, key)
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

  if (!s) return <span className="pph-sort-icon"><FaLocationArrow className="competidexArrowIcon" aria-hidden="true" /></span>;

  return (
    <span className={"pph-sort-icon " + (s.direction === "asc" ? "up" : "down")}>
      <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
    </span>
  );

}

function habLabel(isHidden, slot)
{
  if (isHidden) return "Oculta";
  if (Number(slot) === 1) return "Principal";
  if (Number(slot) === 2) return "Secundaria";

  return "Secundaria";
}

// Para ordenar / filtrar por prioridad
function habRank(isHidden, slot)
{
  if (isHidden) return 3; // Oculta al final
  if (Number(slot) === 1) return 1; // Principal primero

  return 2; // Secundaria
}

export default function PokesPoseenHabilidad({ pokesPoseen = [], title = "Pokémon que la tienen", maxHeight = "420px" })
{
  const navigate = useNavigate();

  const { pokemonMapReady, loadingIndex, toApiKeyFromUserInput, getPokemonMini } = usePokemon();
  const [showTableModal, setShowTableModal] = useState(false);
  const [isDesktopTableButton, setIsDesktopTableButton] = useState(false);
  const [isCompactTypes, setIsCompactTypes] = useState(false);
  const [habFilterOpen, setHabFilterOpen] = useState(false);
  const habFilterMenuRef = useRef(null);

  useEffect(() =>
  {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mqDesktop = window.matchMedia("(min-width: 521px)");
    const mqCompact = window.matchMedia("(max-width: 520px)");

    const syncDesktop = () => setIsDesktopTableButton(!!mqDesktop.matches);
    const syncCompact = () => setIsCompactTypes(!!mqCompact.matches);

    syncDesktop();
    syncCompact();

    if(mqDesktop.addEventListener)
    {
      mqDesktop.addEventListener("change", syncDesktop);
      mqCompact.addEventListener("change", syncCompact);
    }
    else
    {
      mqDesktop.addListener(syncDesktop);
      mqCompact.addListener(syncCompact);
    }

    return () =>
    {
      if(mqDesktop.removeEventListener)
      {
        mqDesktop.removeEventListener("change", syncDesktop);
        mqCompact.removeEventListener("change", syncCompact);
      
      }else
      {
        mqDesktop.removeListener(syncDesktop);
        mqCompact.removeListener(syncCompact);
      }
    };

  }, []);

  useEffect(() =>
  {
    if (!isCompactTypes)
    {
      setHabFilterOpen(false);
    }

  }, [isCompactTypes]);

  useEffect(() =>
  {
    if (!habFilterOpen) return;

    function closeIfOutside(e)
    {
      if (habFilterMenuRef.current && !habFilterMenuRef.current.contains(e.target))
      {
        setHabFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("touchstart", closeIfOutside);

    return () =>
    {
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("touchstart", closeIfOutside);
    };

  }, [habFilterOpen]);

  // Ordenamientos
  const [sortConfig, setSortConfig] = useState([{ key: "nombre", direction: "asc" }]);

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

  const clearSort = () => setSortConfig([{ key: "nombre", direction: "asc" }]);

  // Buscador
  const [findText, setFindText] = useState("");
  const [findPos, setFindPos] = useState(0);
  const rowRefs = useRef({});
  const modalRowRefs = useRef({});
  const findInputRef = useRef(null);

  // filtro por tipo de habilidad (Principal/Secundaria/Oculta)
  const [habFilter, setHabFilter] = useState("todas"); // todas | principal | secundaria | oculta

  // lista base
  const baseItems = useMemo(() =>
  {
    if (!pokemonMapReady || loadingIndex) return [];

    const arr = Array.isArray(pokesPoseen) ? pokesPoseen : [];
    const seen = {};
    const out = [];

    for(let i = 0; i < arr.length; i++)
    {
      const raw = arr[i];
      if (!raw) continue;

      // soporta raw="pikachu" o raw = {key, is_hidden, slot}
      const rawKey = (typeof raw === "string") ? raw : raw.key;
      const api = toApiKeyFromUserInput(String(rawKey)) || String(rawKey || "").toLowerCase().trim();

      if (!api) continue;
      if (isBlocked(api)) continue;

      if (seen[api]) continue;
      seen[api] = true;

      const mini = getPokemonMini ? getPokemonMini(api) : null;
      const display = toPokemonDisplayName(api);
      const typesEN = mini && mini.types && mini.types.length ? mini.types : [];
      const id = mini && mini.id ? mini.id : null;

      const isHidden = !!(raw && raw.is_hidden);
      const slot = raw && raw.slot ? raw.slot : 0;

      out.push({
        apiName: api,
        display: display,
        typesEN: typesEN,
        id: id,
        is_hidden: isHidden,
        slot: slot,
        habKind: habLabel(isHidden, slot),
        habRank: habRank(isHidden, slot),
      });

    }

    return out;

  }, [
    pokesPoseen,
    pokemonMapReady,
    loadingIndex,
    toApiKeyFromUserInput,
    getPokemonMini
  ]);

  // aplicar filtro por tipo de habilidad
  const filteredItems = useMemo(() =>
  {
    if (!habFilter || habFilter === "todas") return baseItems;

    const want = habFilter; // principal/secundaria/oculta

    return baseItems.filter(function(it)
    {
      const k = (it.habKind || "").toLowerCase();
      if (want === "principal") return k === "principal";
      if (want === "secundaria") return k === "secundaria";
      if (want === "oculta") return k === "oculta";

      return true;
    });

  }, [baseItems, habFilter]);

  // Items ordenados
  const items = useMemo(() =>
  {
    const arr = filteredItems.slice();
    const rules = (sortConfig && sortConfig.length)
      ? sortConfig
      : [{ key: "nombre", direction: "asc" }];

    arr.sort(function(a, b)
    {
      for(let i = 0; i < rules.length; i++)
      {
        const rule = rules[i];
        const dir = rule.direction === "asc" ? 1 : -1;

        if(rule.key === "nombre")
        {
          let va = normText(a.display || a.apiName);
          let vb = normText(b.display || b.apiName);
          if (va !== vb) return va.localeCompare(vb) * dir;
          
          continue;
        }

        if(rule.key === "tipos")
        {
          const ta = (a.typesEN && a.typesEN.length ? a.typesEN : [])
            .map(getTypeLabelEs)
            .join("|");
          const tb = (b.typesEN && b.typesEN.length ? b.typesEN : [])
            .map(getTypeLabelEs)
            .join("|");

          let va = normText(ta);
          let vb = normText(tb);

          if (!va && vb) return 1;
          if (va && !vb) return -1;
          if (va !== vb) return va.localeCompare(vb) * dir;
          
          continue;
        }

        if(rule.key === "habilidad")
        {
          const ra = a.habRank || 0;
          const rb = b.habRank || 0;
          if (ra !== rb) return (ra - rb) * dir;

          const va = normText(a.habKind || "");
          const vb = normText(b.habKind || "");
          if (va !== vb) return va.localeCompare(vb) * dir;

          continue;
        }
      }

      return normText(a.display || a.apiName).localeCompare(normText(b.display || b.apiName));
    
    });

    return arr;

  }, [filteredItems, sortConfig]);

  // Matches buscador (nombre + habilidad)
  const findMatches = useMemo(() =>
  {
    const q = normText(findText);
    if (!q) return [];

    const hits = [];
    for(let i = 0; i < items.length; i++)
    {
      const it = items[i];
      const nameShown = it.display || it.apiName;
      const habShown = it.habKind || "";
      if
      (
        normText(nameShown).indexOf(q) !== -1 ||
        normText(habShown).indexOf(q) !== -1
      )
      {
        hits.push(it.apiName);
      }
    }

    return hits;

  }, [findText, items]);

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

  // Scroll al match activo
  useEffect(() =>
  {
    if (!findMatches.length) return;

    const activeKey = findMatches[Math.min(findPos, findMatches.length - 1)];
    const refMap = showTableModal ? modalRowRefs.current : rowRefs.current;
    const el = refMap[activeKey];
    if (!el) return;

    el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });

  }, [findPos, findMatches, showTableModal]);

  const activeFindKey = findMatches.length && findMatches[Math.min(findPos, findMatches.length - 1)]
    ? findMatches[Math.min(findPos, findMatches.length - 1)]
    : null;

  function goToPokemon(apiName)
  {
    navigate(pokemonRoute(encodeURIComponent(getBaseApiKeyFromMega(String(apiName || "").trim().toLowerCase()))));
  }

  function sortLabel(k)
  {
    if (k === "nombre") return "nombre";
    if (k === "tipos") return "tipos";
    if (k === "habilidad") return "habilidad";

    return k;
  }

  const habFilterOptions =
  [
    { value: "todas", label: "Todas" },
    { value: "principal", label: "Principal" },
    { value: "secundaria", label: "Secundaria" },
    { value: "oculta", label: "Oculta" },
  ];

  function getHabFilterLabel(value)
  {
    for(let i = 0; i < habFilterOptions.length; i++)
    {
      if(habFilterOptions[i].value === value)
      {
        return habFilterOptions[i].label;
      }
    }

    return "Todas";
  }

  function pickHabFilter(value)
  {
    setHabFilter(value);
    setHabFilterOpen(false);
  }

  function renderHabFilterBar(compactMode = false)
  {
    if (compactMode)
    {
      return (
        <div className="pph-filterBar pph-filterBar--compact">
          <span className="pph-filterLabel">Filtrar:</span>

          <div className="pph-filterDropdown" ref={habFilterMenuRef}>
            <button
              type="button"
              className={"pph-filterPick" + (habFilterOpen ? " isOpen" : "")}
              onClick={() => setHabFilterOpen(function(prev){ return !prev; })}
              aria-haspopup="listbox"
              aria-expanded={habFilterOpen}
            >
              <span className="pph-filterPickText">{getHabFilterLabel(habFilter)}</span>
              <span className={"pph-filterMiniCaret" + (habFilterOpen ? " isOpen" : "")} aria-hidden="true">
                <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
              </span>
            </button>

            {habFilterOpen ? (
              <div className="pph-filterList" role="listbox" aria-label="Filtrar por tipo de habilidad">
                <div className="pph-filterListInner">
                  {habFilterOptions.map(function(opt)
                  {
                    const selected = opt.value === habFilter;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={"pph-filterOpt" + (selected ? " selected" : "")}
                        onClick={() => pickHabFilter(opt.value)}
                        role="option"
                        aria-selected={selected}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div className="pph-filterBar">
        <span className="pph-filterLabel">Filtrar:</span>

        {habFilterOptions.map(function(opt)
        {
          return (
            <button
              key={opt.value}
              type="button"
              className={"pph-filterBtn" + (habFilter === opt.value ? " active" : "")}
              onClick={() => setHabFilter(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  const tipoSize = isCompactTypes ? "small" : "medium";

  function renderTable(trackRefs = true, inModal = false, showControls = false, targetRefs = null)
  {
    const refStore = targetRefs || rowRefs;

    return (
      <div className={`pph-tableWrap${inModal ? " pph-tableWrap--modal" : ""}`} style={inModal ? undefined : { maxHeight: maxHeight }}>
        <div className={inModal ? "pph-modalContent" : ""}>
          {showControls ? (
            <>
              <div className="pph-modalTopMeta">
                <span className="pph-totalCount">
                  Total: {items.length} Pokémon
                </span>
              </div>

              {sortConfig && sortConfig.length ? (
                <div className="pph-orden-info pph-orden-info--compact">
                  <div>
                    Orden actual:{" "}
                    {sortConfig.map(function (s, i) {
                      return (
                        <span key={s.key} className="pph-orden-item">
                          {sortLabel(s.key)} {s.direction === "asc" ? "↑" : "↓"}
                          {i < sortConfig.length - 1 ? ", " : ""}
                        </span>
                      );
                    })}
                  </div>

                  <span className="pph-orden-hint pph-orden-hint--compact">
                    Mantenga <b>Shift</b> + <b>Click</b> para combinar ordenamientos.
                  </span>

                  <div className="pph-orden-actions">
                    <button
                      type="button"
                      className="pph-btn-clear-sort"
                      onClick={clearSort}
                      title="Volver a ordenar por Nombre (Asc)"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              ) : null}

              {renderHabFilterBar(isCompactTypes)}

              <div className="pph-findBar pph-findBar--compact">
                <div className="pph-findLeft">
                  <span className="pph-findLabel">Buscar</span>

                  <input
                    inputMode="text"
                    enterKeyHint="search"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    name="competidex-buscar-hab-pokesposeen"
                    ref={findInputRef}
                    className="pph-findInput"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Nombre o tipo de habilidad… (Enter = siguiente)"
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

                <div className="pph-findRight">
                  <span className={"pph-findCount" + (findMatches.length ? " has" : "")}>
                    {findMatches.length ? findPos + 1 + "/" + findMatches.length : "0/0"}
                  </span>

                  <button
                    type="button"
                    className="pph-findBtn"
                    onClick={() => goFind(-1)}
                    disabled={!findMatches.length}
                    title="Anterior (Shift+Enter)"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    className="pph-findBtn"
                    onClick={() => goFind(1)}
                    disabled={!findMatches.length}
                    title="Siguiente (Enter)"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    className="pph-findBtn clear"
                    onClick={clearFind}
                    disabled={!findText}
                    title="Limpiar (Esc)"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </>
          ) : null}

          <div className={`pph-tableScrollWrap${inModal ? " pph-tableScrollWrap--modal" : ""}`}>
            <table className="pph-table">
            <thead>
              <tr>
                <th className="pph-thSprite">Sprite</th>

                <th
                  className={headerClass(sortConfig, "nombre")}
                  onClick={(e) => handleSort("nombre", e.shiftKey)}
                  title="Ordenar por Nombre"
                >
                  Pokémon {renderSortIcon(sortConfig, "nombre")}
                </th>

                <th
                  className={headerClass(sortConfig, "tipos")}
                  onClick={(e) => handleSort("tipos", e.shiftKey)}
                  title="Ordenar por Tipo/s"
                >
                  Tipo/s {renderSortIcon(sortConfig, "tipos")}
                </th>

                <th
                  className={headerClass(sortConfig, "habilidad")}
                  onClick={(e) => handleSort("habilidad", e.shiftKey)}
                  title="Ordenar por tipo de habilidad"
                >
                  Habilidad {renderSortIcon(sortConfig, "habilidad")}
                </th>
              </tr>
            </thead>

            <tbody>
              {!items.length ? (
                <tr>
                  <td className="pph-empty" colSpan={4}>
                    {(!pokemonMapReady || loadingIndex)
                      ? "Cargando datos…"
                      : "No hay Pokémon para mostrar."}
                  </td>
                </tr>
              ) : (
                items.map(function(it)
                {
                  const isHit = !!findMatchSet[it.apiName];
                  const isActive = activeFindKey ? it.apiName === activeFindKey : false;

                  const rowClass =
                    "pph-row" +
                    (isHit ? " pphFindHit" : "") +
                    (isActive ? " pphFindActive" : "");

                  return (
                    <tr
                      key={it.apiName}
                      className={rowClass}
                      ref={trackRefs ? function(el)
                      {
                        if (el) refStore.current[it.apiName] = el;
                        else delete refStore.current[it.apiName];
                      } : undefined}
                    >
                      <td className="pph-spriteCell">
                        {it.id ? (
                          <SpriteModal
                            normalUrl={spriteUrl(it.id)}
                            shinyUrl={spriteShinyUrl(it.id)}
                            altText={it.display || it.apiName}
                            thumbSize={inModal ? 96 : 150}
                          />
                        ) : (
                          <span className="pph-spriteEmpty">—</span>
                        )}
                      </td>

                      <td className="pph-nameCell">
                        <button
                          type="button"
                          className="pph-nameBtn"
                          title={"Ver datos de Pokémon: " + (it.display || it.apiName)}
                          onClick={() => goToPokemon(it.apiName)}
                        >
                          {renderNombreConGenero(it.display || it.apiName)}
                        </button>
                      </td>

                      <td className="pph-typesCell">
                        <div className="pph-types">
                          {it.typesEN && it.typesEN.length ? (
                            it.typesEN.map(function(t)
                            {
                              return <Tipo key={t} tipo={t} size={inModal ? "small" : tipoSize} />;
                            })
                          ) : (
                            <span className="pph-typesEmpty">—</span>
                          )}
                        </div>
                      </td>

                      <td className="pph-habCell">
                        <span className={"pph-habTag " + normText(it.habKind)}>
                          {it.habKind || "—"}
                        </span>
                      </td>
                    </tr>
                  );

                })
              )}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pph-container">
      <div className="pph-panel">
        
        <div className="pph-titleRow">
          <div className="pph-titleGroup">
            <h3 className="pph-title">{title}</h3>

            {pokemonMapReady && !loadingIndex ? (
              <span className="pph-totalCount">
                Total: {items.length} Pokémon
              </span>
            ) : null}
          </div>

          <div className="pph-titleActions">
            {!pokemonMapReady || loadingIndex ? (
              <span className="pph-loadingMini">Cargando datos…</span>
            ) : isDesktopTableButton && items.length > 0 ? (
              <button
                type="button"
                className="pph-btn-open-table"
                onClick={() => setShowTableModal(true)}
                title="Abrir tabla"
              >
                <BiExpandAlt aria-hidden="true" className="pph-btn-open-table-icon" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Datos de Ordenamiento Actual */}
        {sortConfig && sortConfig.length ? (
          <div className="pph-orden-info">
            <div>
              Orden actual:{" "}
              {sortConfig.map(function (s, i) {
                return (
                  <span key={s.key} className="pph-orden-item">
                    {sortLabel(s.key)} {s.direction === "asc" ? "↑" : "↓"}
                    {i < sortConfig.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </div>

            <span className="pph-orden-hint">
              Mantenga <b>Shift</b> + <b>Click</b> para combinar ordenamientos.
            </span>

            <div className="pph-orden-actions">
              <button
                type="button"
                className="pph-btn-clear-sort"
                onClick={clearSort}
                title="Volver a ordenar por Nombre (Asc)"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        ) : null}

        {/* Filtro por tipo de habilidad */}
        {renderHabFilterBar(isCompactTypes)}

        {/* Buscador */}
        <div className="pph-findBar">
          <div className="pph-findLeft">
            <span className="pph-findLabel">Buscar</span>

            <input
              inputMode="text"
              enterKeyHint="search"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              name="competidex-buscar-hab-pokesposeen-dos"
              ref={findInputRef}
              className="pph-findInput"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Nombre o tipo de habilidad… (Enter = siguiente)"
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

          <div className="pph-findRight">
            <span className={"pph-findCount" + (findMatches.length ? " has" : "")}>
              {findMatches.length ? findPos + 1 + "/" + findMatches.length : "0/0"}
            </span>

            <button
              type="button"
              className="pph-findBtn"
              onClick={() => goFind(-1)}
              disabled={!findMatches.length}
              title="Anterior (Shift+Enter)"
            >
              ↑
            </button>

            <button
              type="button"
              className="pph-findBtn"
              onClick={() => goFind(1)}
              disabled={!findMatches.length}
              title="Siguiente (Enter)"
            >
              ↓
            </button>

            <button
              type="button"
              className="pph-findBtn clear"
              onClick={clearFind}
              disabled={!findText}
              title="Limpiar (Esc)"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="pph-tableWrap-Contenedor">
          <div className="pph-tableWrap" style={{ maxHeight: maxHeight }}>
            <table className="pph-table">
              
              {/* Headers de la Tabla */}
              <thead>
                <tr>
                  <th className="pph-thSprite">Sprite</th>

                  <th
                    className={headerClass(sortConfig, "nombre")}
                    onClick={(e) => handleSort("nombre", e.shiftKey)}
                    title="Ordenar por Nombre"
                  >
                    Pokémon {renderSortIcon(sortConfig, "nombre")}
                  </th>

                  <th
                    className={headerClass(sortConfig, "tipos")}
                    onClick={(e) => handleSort("tipos", e.shiftKey)}
                    title="Ordenar por Tipo/s"
                  >
                    Tipo/s {renderSortIcon(sortConfig, "tipos")}
                  </th>

                  <th
                    className={headerClass(sortConfig, "habilidad")}
                    onClick={(e) => handleSort("habilidad", e.shiftKey)}
                    title="Ordenar por tipo de habilidad"
                  >
                    Habilidad {renderSortIcon(sortConfig, "habilidad")}
                  </th>
                </tr>
              </thead>

              {/* Filas de la Tabla */}
              <tbody>
                {!items.length ? (
                  <tr>
                    <td className="pph-empty" colSpan={4}>
                      {(!pokemonMapReady || loadingIndex)
                        ? "Cargando datos…"
                        : "No hay Pokémon para mostrar."}
                    </td>
                  </tr>
                ) : (
                  items.map(function(it)
                  {
                    const isHit = !!findMatchSet[it.apiName];
                    const isActive = activeFindKey ? it.apiName === activeFindKey : false;

                    const rowClass =
                      "pph-row" +
                      (isHit ? " pphFindHit" : "") +
                      (isActive ? " pphFindActive" : "");

                    return (
                      <tr
                        key={it.apiName}
                        className={rowClass}
                        ref={function(el)
                        {
                          if (el) rowRefs.current[it.apiName] = el;
                          else delete rowRefs.current[it.apiName];
                        }}
                      >
                        <td className="pph-spriteCell">
                          {it.id ? (
                            <SpriteModal
                              normalUrl={spriteUrl(it.id)}
                              shinyUrl={spriteShinyUrl(it.id)}
                              altText={it.display || it.apiName}
                              thumbSize={isCompactTypes ? 96 : 150}
                            />
                          ) : (
                            <span className="pph-spriteEmpty">—</span>
                          )}
                        </td>

                        <td className="pph-nameCell">
                          <button
                            type="button"
                            className="pph-nameBtn"
                            title={"Ver datos de Pokémon: " + (it.display || it.apiName)}
                            onClick={() => goToPokemon(it.apiName)}
                          >
                            {renderNombreConGenero(it.display || it.apiName)}
                          </button>
                        </td>

                        <td className="pph-typesCell">
                          <div className="pph-types">
                            {it.typesEN && it.typesEN.length ? (
                              it.typesEN.map(function(t)
                              {
                                return <Tipo key={t} tipo={t} size={tipoSize} />;
                              })
                            ) : (
                              <span className="pph-typesEmpty">—</span>
                            )}
                          </div>
                        </td>

                        <td className="pph-habCell">
                          <span className={"pph-habTag " + normText(it.habKind)}>
                            {it.habKind || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                    
                  })
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>

      <Modal
        open={showTableModal}
        title="Pokémon que poseen habilidad"
        onClose={() => setShowTableModal(false)}
      >
        {renderTable(true, true, true, modalRowRefs)}
      </Modal>
    </div>
  );

}