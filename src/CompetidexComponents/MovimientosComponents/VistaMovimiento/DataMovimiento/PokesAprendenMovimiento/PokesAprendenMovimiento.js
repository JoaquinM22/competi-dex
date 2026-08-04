//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\PokesAprendenMovimiento\PokesAprendenMovimiento.js

import React, { useMemo, useRef, useState, useEffect } from "react";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BiExpandAlt } from "react-icons/bi";
import { usePokemon } from "../../../../../CompetidexComponents/PokemonComponents/PokemonProvider";
import { spriteUrl, spriteShinyUrl } from "../../../../../config/endpoints";
import { pokemonRoute } from "../../../../../utils/competidexRoutes";
import { getTypeLabelEs, isPokemonBlocked, PIKACHU_RUNING_GIF, toPokemonDisplayName } from "../../../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../../../utils/competidexImgCache";
import Modal from "../../../../SharedComponents/Modal/Modal";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import "./PokesAprendenMovimiento.css";

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
      <span className="pamNameWrap">
        <span className="pamNameText">{baseM}</span>
        <IoMdMale className="pamGenderIcon male" aria-label="Macho" />
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
      <span className="pamNameWrap">
        <span className="pamNameText">{baseF}</span>
        <IoMdFemale className="pamGenderIcon female" aria-label="Hembra" />
      </span>
    );

  }

  return (
    <span className="pamNameWrap">
      <span className="pamNameText">{n}</span>
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

  return "pamThSortable" + (s ? " sorted " + s.direction : "");
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

  if (!s) return <span className="pam-sort-icon"><FaLocationArrow className="competidexArrowIcon" aria-hidden="true" /></span>;

  return (
    <span className={"pam-sort-icon " + (s.direction === "asc" ? "up" : "down")}>
      <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
    </span>
  );
}

export default function PokesAprendenMovimiento({ pokesAprenden = [], title = "Pokémon que aprenden", maxHeight = "420px" })
{
  const navigate = useNavigate();
  const [isCompactTypes, setIsCompactTypes] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [isDesktopTableButton, setIsDesktopTableButton] = useState(false);

  const {
    pokemonMapReady,
    loadingIndex,
    toApiKeyFromUserInput,
    getPokemonMini
  } = usePokemon();

  useEffect(() =>
  {
    preloadCachedImage(PIKACHU_RUNING_GIF);

  }, []);

  useEffect(() =>
  {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(min-width: 521px)");
    const sync = () => setIsDesktopTableButton(!!mq.matches);

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
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(max-width: 520px)");
    const sync = () => setIsCompactTypes(!!mq.matches);

    sync();

    if (mq.addEventListener)
    {
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }

    mq.addListener(sync);
    return () => mq.removeListener(sync);

  }, []);

  // Ordenamientos
  const [sortConfig, setSortConfig] = useState([{ key: "nombre", direction: "asc" }]);

  const handleSort = (key, shiftPressed) =>
  {
    setSortConfig(function (prev)
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

  // Lista base
  const baseItems = useMemo(() =>
  {
    if (!pokemonMapReady || loadingIndex) return [];

    const arr = Array.isArray(pokesAprenden) ? pokesAprenden : [];
    const seen = {};
    const out = [];

    for(let i = 0; i < arr.length; i++)
    {
      const raw = arr[i];
      if (raw == null) continue;

      const api = toApiKeyFromUserInput(String(raw)) || String(raw).toLowerCase().trim();

      if (!api) continue;
      if (isPokemonBlocked(api)) continue;

      if (seen[api]) continue;
      seen[api] = true;

      const mini = getPokemonMini ? getPokemonMini(api) : null;

      const display = toPokemonDisplayName(api);
      const typesEN = mini && mini.types && mini.types.length ? mini.types : [];
      const id = mini && mini.id ? mini.id : null;

      out.push({
        apiName: api,
        display: display,
        typesEN: typesEN,
        id: id,
      });

    }

    return out;

  }, [
    pokesAprenden,
    pokemonMapReady,
    loadingIndex,
    toApiKeyFromUserInput,
    getPokemonMini
  ]);

  // Items ordenados por sortConfig (nombre/tipos)
  const items = useMemo(() =>
  {
    const arr = baseItems.slice();

    // Si no hay sortConfig, fallback nombre asc
    const rules = (sortConfig && sortConfig.length) ? sortConfig : [{ key: "nombre", direction: "asc" }];

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
          const ta = (a.typesEN && a.typesEN.length ? a.typesEN : []).map(getTypeLabelEs).join("|");
          const tb = (b.typesEN && b.typesEN.length ? b.typesEN : []).map(getTypeLabelEs).join("|");

          let va = normText(ta);
          let vb = normText(tb);

          if (!va && vb) return 1;
          if (va && !vb) return -1;
          if (va !== vb) return va.localeCompare(vb) * dir;

          continue;
        }

      }

      // Fallback estable
      return normText(a.display || a.apiName).localeCompare(normText(b.display || b.apiName));

    });

    return arr;

  }, [baseItems, sortConfig]);

  // Matches buscador
  const findMatches = useMemo(() =>
  {
    const q = normText(findText);
    if (!q) return [];

    const hits = [];
    for(let i = 0; i < items.length; i++)
    {
      const it = items[i];
      const nameShown = it.display || it.apiName;

      if (normText(nameShown).indexOf(q) !== -1) hits.push(it.apiName);
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
    navigate(pokemonRoute(encodeURIComponent(String(apiName || "").trim().toLowerCase())));
  }

  // label orden
  function sortLabel(k)
  {
    if (k === "nombre") return "nombre";
    if (k === "tipos") return "tipos";

    return k;
  }

  const tipoSize = isCompactTypes ? "small" : "medium";

  function renderTable(trackRefs = true, inModal = false, showControls = false, targetRefs = null)
  {
    const refStore = targetRefs || rowRefs;

    return (
      <div className={`pam-tableWrap-contenedor${!inModal ? " pam-tableWrap-contenedor-bordeColor" : ""}`}>
        <div className={`pam-tableWrap${inModal ? " pam-tableWrap--modal" : ""}`} style={inModal ? undefined : { maxHeight }}>
          <div className={inModal ? "pam-modalContent" : ""}>
            {showControls ? (
              <>
                <div className="pam-modalTopMeta">
                  <span className="pam-totalCount">
                    Total: {items.length} Pokémon
                  </span>
                </div>

                {sortConfig && sortConfig.length ? (
                  <div className="pam-orden-info pam-orden-info--compact">
                    <div>
                      Orden actual:{" "}
                      {sortConfig.map(function (s, i) {
                        return (
                          <span key={s.key} className="pam-orden-item">
                            {sortLabel(s.key)} {s.direction === "asc" ? "↑" : "↓"}
                            {i < sortConfig.length - 1 ? ", " : ""}
                          </span>
                        );
                      })}
                    </div>

                    <span className="pam-orden-hint pam-orden-hint--compact">
                      Mantenga <b>Shift</b> + <b>Click</b> para combinar ordenamientos.
                    </span>

                    <div className="pam-orden-actions">
                      <button
                        type="button"
                        className="pam-btn-clear-sort"
                        onClick={clearSort}
                        title="Limpiar filtros"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="pam-findBar pam-findBar--compact">
                  <div className="pam-findLeft">
                    <span className="pam-findLabel">Buscar</span>

                    <input
                      inputMode="search"
                      enterKeyHint="search"
                      type="search"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      name="pokes-aprenden-search-mobile"
                      ref={findInputRef}
                      className="pam-findInput"
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

                  <div className="pam-findRight">
                    <span className={"pam-findCount" + (findMatches.length ? " has" : "")}>
                      {findMatches.length ? findPos + 1 + "/" + findMatches.length : "0/0"}
                    </span>

                    <button
                      type="button"
                      className="pam-findBtn"
                      onClick={() => goFind(-1)}
                      disabled={!findMatches.length}
                      title="Anterior (Shift+Enter)"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      className="pam-findBtn"
                      onClick={() => goFind(1)}
                      disabled={!findMatches.length}
                      title="Siguiente (Enter)"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      className="pam-findBtn clear"
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

            <div className={`pam-tableScrollWrap${inModal ? " pam-tableScrollWrap--modal" : ""}`}>
              <table className="pam-table">
              
              <thead>
                <tr>
                  <th className="pam-thSprite">Sprite</th>
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
                </tr>
              </thead>

              <tbody>
                {!items.length ? (
                  <tr>
                    <td className="pam-empty" colSpan={3}>
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
                      "pam-row" +
                      (isHit ? " pamFindHit" : "") +
                      (isActive ? " pamFindActive" : "");

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
                        <td className="pam-spriteCell">
                          {it.id ? (
                            <SpriteModal
                              normalUrl={spriteUrl(it.id)}
                              shinyUrl={spriteShinyUrl(it.id)}
                              altText={it.display || it.apiName}
                              thumbSize={inModal ? 96 : 150}
                            />
                          ) : (
                            <span className="pam-spriteEmpty">—</span>
                          )}
                        </td>

                        <td className="pam-nameCell">
                          <button
                            type="button"
                            className="pam-nameBtn"
                            title={"Ver datos de Pokémon: " + (it.display || it.apiName)}
                            onClick={() => goToPokemon(it.apiName)}
                          >
                            {renderNombreConGenero(it.display || it.apiName)}
                          </button>
                        </td>

                        <td className="pam-typesCell">
                          <div className="pam-types">
                            {it.typesEN && it.typesEN.length ? (
                              it.typesEN.map(function(t)
                              {
                                return <Tipo key={t} tipo={t} size={tipoSize} />;
                              })
                            ) : (
                              <span className="pam-typesEmpty">—</span>
                            )}
                          </div>
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
      </div>
    );
  }

  return (
    <div className="pam-container">
      <div className="pam-panel">
        
        <div className="pam-titleRow">

          {/* Total de Pokemon que aprenden Movimiento */}
          <div className="pam-titleGroup">
            <h3 className="pam-title">{title}</h3>

            {pokemonMapReady && !loadingIndex ? (
              <span className="pam-totalCount">
                Total: {items.length} Pokémon
              </span>
            ) : null}
          </div>

          {isDesktopTableButton && pokemonMapReady && !loadingIndex && items.length > 0 ? (
            <div className="pam-titleActions">
              <button
                type="button"
                className="pam-btn-open-table"
                onClick={() => setShowTableModal(true)}
                title="Abrir tabla"
              >
                <BiExpandAlt aria-hidden="true" className="pam-btn-open-table-icon" />
              </button>
            </div>
          ) : null}

          {/* Cargando Movimientos */}
          {!pokemonMapReady || loadingIndex ? (
            <> 
              <span className="pam-loadingMini">Cargando Pokémon…</span>

              <img
                src={PIKACHU_RUNING_GIF}
                alt="Pikachu corriendo"
                className="pikachu-spinnerMovsAprendenMov"
              />

            </>
          ) : null}

        </div>

        {/* Info de orden actual + limpiar*/}
        {sortConfig && sortConfig.length ? (
          <div className="pam-orden-info">
            <div>
              Orden actual:{" "}
              {sortConfig.map(function (s, i) {
                return (
                  <span key={s.key} className="pam-orden-item">
                    {sortLabel(s.key)} {s.direction === "asc" ? "↑" : "↓"}
                    {i < sortConfig.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </div>

            <span className="pam-orden-hint">
              Mantenga <b>Shift</b> + <b>Click</b> para combinar ordenamientos.
            </span>

            <div className="pam-orden-actions">
              <button
                type="button"
                className="pam-btn-clear-sort"
                onClick={clearSort}
                title="Limpiar filtros"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        ) : null}

        {/* Buscador */}
        <div className="pam-findBar">
          <div className="pam-findLeft">
            <span className="pam-findLabel">Buscar</span>

            <input
              inputMode="search"
              enterKeyHint="search"
              type="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              name="pokes-aprenden-search"
              ref={findInputRef}
              className="pam-findInput"
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

          <div className="pam-findRight">
            <span className={"pam-findCount" + (findMatches.length ? " has" : "")}>
              {findMatches.length ? findPos + 1 + "/" + findMatches.length : "0/0"}
            </span>

            <button
              type="button"
              className="pam-findBtn"
              onClick={() => goFind(-1)}
              disabled={!findMatches.length}
              title="Anterior (Shift+Enter)"
            >
              ↑
            </button>

            <button
              type="button"
              className="pam-findBtn"
              onClick={() => goFind(1)}
              disabled={!findMatches.length}
              title="Siguiente (Enter)"
            >
              ↓
            </button>

            <button
              type="button"
              className="pam-findBtn clear"
              onClick={clearFind}
              disabled={!findText}
              title="Limpiar (Esc)"
            >
              Limpiar
            </button>
          </div>
        </div>

        {renderTable(true, false, false, rowRefs)}

      </div>

      <Modal
        open={showTableModal}
        title="Pokémon que aprenden"
        onClose={() => setShowTableModal(false)}
      >
        {renderTable(true, true, true, modalRowRefs)}
      </Modal>
    </div>
  );

}