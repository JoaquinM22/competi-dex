//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\ListaMovimientosPkm\ListaMovimientosPkm.js

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { getMoveClassIcon, getMoveClassLabelEs, getTypeMeta } from "../../../../../utils/competidexMeta";
import { moveRoute, pokemonRoute } from "../../../../../utils/competidexRoutes";
import { preloadCachedImage } from "../../../../../utils/competidexImgCache";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import "./ListaMovimientosPkm.css";

// Normaliza texto para comparar
function normText(s)
{
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Slug para URL: espacios -> "_"
function slugifyForUrl(s)
{
  let t = String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .toLowerCase()
    .trim();

  // espacios/guiones -> "_"
  t = t.replace(/[\s\-]+/g, "_");

  // limpia símbolos raros (deja letras/números/_)
  t = t.replace(/[^a-z0-9_]/g, "");

  t = t.replace(/_+/g, "_");

  t = t.replace(/^_+|_+$/g, "");

  return t;
}

function displayPokemonName(s)
{
  return String(s || "")
    .replace(/♂/g, "Macho")
    .replace(/♀/g, "Hembra")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const getClaseIcon = (c) => getMoveClassIcon(c);
const fmt = (v) => (v === null || v === undefined || v === "-" ? "—" : v);

function measureTextWidth(text, fontSize = 12)
{
  const value = String(text || "");
  if (!value) return 0;

  if (typeof document === "undefined")
  {
    return value.length * fontSize * 0.62;
  }

  try
  {
    const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement("canvas"));
    const ctx = canvas.getContext("2d");
    if (!ctx) return value.length * fontSize * 0.62;

    const fontFamily = getComputedStyle(document.body || document.documentElement).fontFamily || "Arial, sans-serif";
    ctx.font = `700 ${fontSize}px ${fontFamily}`;

    return ctx.measureText(value).width;

  }catch(e)
  {
    return value.length * fontSize * 0.62;
  }
}

/*

  * grupos: [{ grupoVersion, nivel: [], mt: [], tutor: [], huevo: [], ... }]
  * modo: "nivel" | "mt" | "tutor" | "huevo"
*/
export default function ListaMovimientosPkm({
  grupos,
  modo = "nivel",
  emptyOverride,
  nombrePokemon,
  puedeCriar = true,
  evolutionChain = [],
  pokemonApiName = ""
})
{
  const navigate = useNavigate();
  const ordered = Array.isArray(grupos) ? grupos : [];

  const goToMove = useCallback((nombreMovApi, nombreMov) =>
  {
    const slug = slugifyForUrl(nombreMovApi || nombreMov);

    if (!slug) return;

    navigate(moveRoute(encodeURIComponent(String(nombreMovApi || slug))));

  }, [navigate]);

  const defaultIndex = useMemo(() =>
  {
    return 0;

  }, [ordered]);

  const [active, setActive] = useState(defaultIndex);

  useEffect(() =>
  {
    setActive(0);
    setSortConfig([]);

  }, [nombrePokemon, ordered]);

  // Tabs scroll
  const railRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() =>
  {
    const el = railRef.current; if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);

  }, []);

  const scrollByDir = (dir) =>
  {
    const el = railRef.current; if (!el) return;
    const delta = Math.round(el.clientWidth * 0.75) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() =>
  {
    const el = railRef.current; if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateArrows); ro.observe(el);
    window.addEventListener("resize", updateArrows);
    
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", updateArrows);
    };

  }, [updateArrows]);

  const firstRender = useRef(true);
  useEffect(() =>
  {
    if(firstRender.current)
    {
      firstRender.current = false;
      return;
    }
    
    const rail = railRef.current; if (!rail) return;
    const activeBtn = rail.querySelector(".tab.active");
    
    if(activeBtn && activeBtn.scrollIntoView)
    {
      activeBtn.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
    }

  }, [active]);

  // Orden (multi-sort con shift-click)
  const [sortConfig, setSortConfig] = useState([]);

  const handleSort = (key, shiftPressed) =>
  {
    setSortConfig((prev) =>
    {
      const existing = prev.find((s) => s.key === key);
      if(existing)
      {
        const newDir = existing.direction === "asc" ? "desc" : "asc";
        
        if(shiftPressed)
        {
          return prev.map((s) => (s.key === key ? { ...s, direction: newDir } : s));
        }

        return [{ key, direction: newDir }];

      }

      if (shiftPressed) return prev.concat([{ key, direction: "asc" }]);
      
      return [{ key, direction: "asc" }];

    });

  };

  useEffect(() =>
  {
    const onKey = (e) =>
    {
      if (e.key === "Escape" && sortConfig.length) setSortConfig([]);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [sortConfig.length]);

  // Filas ordenadas (según pestaña + modo + sort)
  const filas = useMemo(() =>
  {
    const g = ordered[active]; if (!g) return [];
    const bucket = Array.isArray(g[modo]) ? g[modo] : [];

    const withLevel = bucket.map((m) => ({
      ...m,
      nivel: typeof m.nivel === "number" ? m.nivel : null
    }));

    let sorted = withLevel.slice();

    if(sortConfig.length > 0)
    {

      sorted.sort((a, b) =>
      {

        for(let i = 0; i < sortConfig.length; i++)
        {
          const rule = sortConfig[i];
          const key = rule.key;
          const direction = rule.direction;

          let valA = a[key];
          let valB = b[key];

          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;

          // números
          if(typeof valA === "number" && typeof valB === "number")
          {
            if (valA !== valB) return direction === "asc" ? valA - valB : valB - valA;
            continue;
          }

          // strings
          valA = String(valA);
          valB = String(valB);

          if(valA !== valB)
          {
            return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }

        }

        return 0;

      });

    }else
    {
      // default
      if(modo === "nivel")
      {
        sorted.sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0) || String(a.nombre || "").localeCompare(String(b.nombre || "")));
      }

      if(modo === "mt")
      {
        sorted.sort((a, b) => String(a.nombre || "").localeCompare(String(b.nombre || "")));
      }

    }

    return sorted;

  }, [ordered, active, modo, sortConfig]);

  const tipoCellWidth = useMemo(() =>
  {
    const labels = new Set();

    for(let i = 0; i < filas.length; i++)
    {
      const rawType = filas[i]?.tipo;
      const label = String(getTypeMeta(rawType)?.labelEs || rawType || "").trim();
      if (label) labels.add(label);
    }

    if (!labels.size) return 0;

    const fontSize = 12;
    const paddingX = 10;
    const gap = 4;
    const iconSize = 14;
    const borderWidth = 2;
    const extra = 12;

    let maxLabelWidth = 0;
    labels.forEach((label) =>
    {
      maxLabelWidth = Math.max(maxLabelWidth, measureTextWidth(label, fontSize));
    });

    return Math.ceil(maxLabelWidth + (paddingX * 2) + iconSize + gap + (borderWidth * 2) + extra);

  }, [filas]);

  // Texto vacío por modo
  const activeGroup = (ordered[active] && ordered[active].grupoVersion) ? ordered[active].grupoVersion : "este grupo";
  const nombre = nombrePokemon || "Este Pokémon";

  const huevoContext = useMemo(() =>
  {
    if(modo !== "huevo")
    {
      return {
        canRenderTable: true,
        message: "",
        targetName: "",
        targetApiName: ""
      };
    }

    if(!puedeCriar)
    {
      return {
        canRenderTable: false,
        message: `${nombre} no tiene movimientos por Huevo porque no puede criar.`,
        targetName: "",
        targetApiName: ""
      };
    }

    const firstEvo = Array.isArray(evolutionChain) ? evolutionChain[0] : null;
    const firstEvoName = displayPokemonName(firstEvo?.nombreEvolucion || "").trim();
    const firstEvoApi = String(firstEvo?.nombreEvoApi || "").trim().toLowerCase();
    const currentApi = String(pokemonApiName || "").trim().toLowerCase();
    const isFirstEvolution = !!firstEvoApi && !!currentApi && firstEvoApi === currentApi;

    if(firstEvo && !isFirstEvolution)
    {
      return {
        canRenderTable: false,
        message: `Para ver los movimientos Huevo de ${nombre}, consulte los movimientos de ${firstEvoName || "la primera evolución"}.`,
        targetName: firstEvoName,
        targetApiName: firstEvoApi
      };
    }

    return {
      canRenderTable: true,
      message: "",
      targetName: "",
      targetApiName: ""
    };

  }, [modo, puedeCriar, evolutionChain, nombre, pokemonApiName]);

  const displayName = displayPokemonName(nombre);
  const displayActiveGroup = displayPokemonName(activeGroup);

  const emptyTextByMode = {
    nivel: `${displayName} no aprende movimientos por nivel en ${displayActiveGroup}.`,
    mt:    `${displayName} no tiene movimientos por MT/DT/MO en ${displayActiveGroup}.`,
    tutor: `${displayName} no tiene movimientos por Tutor en ${displayActiveGroup}.`,
    huevo: `${displayName} no tiene movimientos por Huevo en ${displayActiveGroup}.`,
  };

  // Buscador Movimiento
  const [findText, setFindText] = useState("");
  const [findPos, setFindPos] = useState(0);

  const findInputRef = useRef(null);
  const rowRefs = useRef({});
  const tableScrollRef = useRef(null);

  useEffect(() =>
  {
    if(!filas.length) return;

    const seen = new Set();

    filas.forEach((mov) =>
    {
      const icon = getClaseIcon(mov.categoria);
      if(!icon || seen.has(icon)) return;

      seen.add(icon);
      preloadCachedImage(icon);
    });

  }, [filas]);

  // Reseteos cuando cambia pestaña o modo
  useEffect(() =>
  {
    setFindText("");
    setFindPos(0);
    rowRefs.current = {};

    // sube al top el contenedor
    const el = tableScrollRef.current;
    if (el) el.scrollLeft = 0;

  }, [active, modo]);

  const findMatches = useMemo(() =>
  {
    const q = normText(findText);
    if (!q) return [];

    const hits = [];
    for(let i = 0; i < filas.length; i++)
    {
      const m = filas[i] || {};
      const nombreMov = m.nombre || "";
      if(normText(nombreMov).indexOf(q) !== -1)
      {
        hits.push(String(i)); // key simple por índice
      }
    }

    return hits;

  }, [findText, filas]);

  const findMatchSet = useMemo(() =>
  {
    const s = {};
    for (let i = 0; i < findMatches.length; i++) s[findMatches[i]] = true;
    
    return s;

  }, [findMatches]);

  useEffect(() =>
  {

    setFindPos(0);

  }, [findText, findMatches.length]);

  function goFind(delta)
  {
    if (!findMatches.length) return;

    setFindPos((prev) =>
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

  // Scroll hacia la fila activa
  useEffect(() =>
  {
    if (!findMatches.length) return;

    const activeKey = findMatches[Math.min(findPos, findMatches.length - 1)];
    const el = rowRefs.current[activeKey];
    if (!el || !el.scrollIntoView) return;

    el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });

  }, [findPos, findMatches]);

  const activeFindKey = (findMatches.length && findMatches[Math.min(findPos, findMatches.length - 1)])
    ? findMatches[Math.min(findPos, findMatches.length - 1)]
    : null;

  function handleGoToEvolutionEggTarget()
  {
    if(!huevoContext.targetApiName) return;
    navigate(pokemonRoute(encodeURIComponent(huevoContext.targetApiName)));
  }

  // Render
  if(!ordered.length)
  {

    return (
      <div className="movs-wrapper">
        <div className="tabs-shell"><div className="tabs-rail" /></div>
        <div className="tabla-scroll" ref={tableScrollRef}>
          <table className="tabla-mov">
            <tbody>
              <tr><td className="empty-row">{emptyOverride || `${nombre} no tiene datos en ${activeGroup}.`}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    );

  }

  const getColSpan = () => (modo === "nivel" || modo === "mt") ? 7 : 6;
  const showHuevoBlockedMessage = modo === "huevo" && !huevoContext.canRenderTable;

  const renderSortIcon = (key) =>
  {
    const s = sortConfig.find((c) => c.key === key);
    const iconStyle = s
      ? { transform: s.direction === "asc" ? "rotate(-45deg)" : "rotate(135deg)" }
      : undefined;

    if (!s)
    {
      return (
        <span className="sort-icon neutral" aria-hidden="true">
          <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
        </span>
      );
    }

    return (
      <span className={`sort-icon ${s.direction === "asc" ? "up" : "down"}`} aria-hidden="true">
        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" style={iconStyle} />
      </span>
    );
  };

  return (
    <div className="movs-wrapper">
      
      {/* Tabs de Juegos */}
      {!showHuevoBlockedMessage && (
      <div className="tabs-shell" role="tablist" aria-label="Grupos de versión">
        
        {/* Boton Mover a la izquierda */}
        <button
          className={`tabs-arrow left ${canLeft ? "" : "disabled"}`}
          onClick={() => canLeft && scrollByDir("left")}
          type="button"
        >
          ‹
        </button>

        {/* Botones Juegos */}
        <div className="tabs-rail" ref={railRef}>
          {ordered.map((g, i) => (
            <button
              key={`${g.grupoVersion}-${i}`}
              className={`tab ${i === active ? "active" : ""}`}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              title={g.grupoVersion}
              type="button"
            >
              <span className="tab-title">{g.grupoVersion}</span>
            </button>
          ))}
        </div>

        {/* Boton Mover a la derecha */}
        <button
          className={`tabs-arrow right ${canRight ? "" : "disabled"}`}
          onClick={() => canRight && scrollByDir("right")}
          type="button"
        >
          ›
        </button>

      </div>
      )}

      {/* Mensaje especial para huevo */}
      {showHuevoBlockedMessage && (
        <div className="movs-empty-huevo">
          <p>
            {puedeCriar
              ? <>Para ver los movimientos Huevo de {displayName}, consulte los movimientos de </>
              : <>{displayName} no tiene movimientos por Huevo porque no puede criar.</>
            }
            {huevoContext.targetApiName ? (
              <button
                type="button"
                title={`Ver Pokémon: ${huevoContext.targetName || "la primera evolución"}`}
                className="mov-nombre-link mov-nombre-link--inline"
                onClick={handleGoToEvolutionEggTarget}
              >
                {displayPokemonName(huevoContext.targetName || "la primera evolución")}
              </button>
            ) : null}
            {puedeCriar && huevoContext.targetApiName ? "." : null}
          </p>
        </div>
      )}

      {/* Orden actual + acciones */}
      {sortConfig.length > 0 && huevoContext.canRenderTable && (
        <div className="orden-info">
          <div>
            Orden actual:{" "}
            {sortConfig.map((s, i) => (
              <span key={s.key} className="orden-item">
                {s.key} {s.direction === "asc" ? "↑" : "↓"}
                {i < sortConfig.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>

          <span className="orden-hint">
            Mantenga <b>Shift</b> + <b>Click</b> para combinar ordenamientos.
          </span>

          <div className="orden-actions">
            <button
              type="button"
              className="btn-clear-sort"
              onClick={() => setSortConfig([])}
              title="Limpiar todos los ordenamientos (Esc)"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Buscador de Movimientos */}
      {huevoContext.canRenderTable && (
      <div className="movsFindBar">
        <div className="movsFindLeft">
          <span className="movsFindLabel">Buscar movimiento</span>

          <input
            inputMode="text"
            enterKeyHint="search"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            name="competidex-buscar-lista-movs"
            ref={findInputRef}
            className="movsFindInput"
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

        <div className="movsFindRight">
          <span className={"movsFindCount" + (findMatches.length ? " has" : "")}>
            {findMatches.length ? (findPos + 1) + "/" + findMatches.length : "0/0"}
          </span>

          <button
            type="button"
            className="movsFindBtn"
            onClick={() => goFind(-1)}
            disabled={!findMatches.length}
            title="Anterior (Shift+Enter)"
          >
            ↑
          </button>

          <button
            type="button"
            className="movsFindBtn"
            onClick={() => goFind(1)}
            disabled={!findMatches.length}
            title="Siguiente (Enter)"
          >
            ↓
          </button>

          <button
            type="button"
            className="movsFindBtn clear"
            onClick={clearFind}
            disabled={!findText}
            title="Limpiar (Esc)"
          >
            Limpiar
          </button>
        </div>
      </div>
      )}

      {/* Tabla */}
      {huevoContext.canRenderTable ? (
      <div className="tabla-scroll" ref={tableScrollRef}>
        <table className="tabla-mov">
          <thead>

            {/* Movimientos por Nivel */}
            {modo === "nivel" && (
              <tr>
                <th onClick={(e) => handleSort("nivel", e.shiftKey)}>Nivel {renderSortIcon("nivel")}</th>
                <th onClick={(e) => handleSort("nombre", e.shiftKey)}>Movimiento {renderSortIcon("nombre")}</th>
                <th onClick={(e) => handleSort("tipo", e.shiftKey)}>Tipo {renderSortIcon("tipo")}</th>
                <th onClick={(e) => handleSort("potencia", e.shiftKey)}>Potencia {renderSortIcon("potencia")}</th>
                <th onClick={(e) => handleSort("precision", e.shiftKey)}>Precisión {renderSortIcon("precision")}</th>
                <th onClick={(e) => handleSort("categoria", e.shiftKey)}>Categoría {renderSortIcon("categoria")}</th>
                <th onClick={(e) => handleSort("pp", e.shiftKey)}>PP {renderSortIcon("pp")}</th>
              </tr>
            )}

            {/* Movimientos por MT/DT/MO */}
            {modo === "mt" && (
              <tr>
                <th onClick={(e) => handleSort("mtmo", e.shiftKey)}>MT/DT/MO {renderSortIcon("mtmo")}</th>
                <th onClick={(e) => handleSort("nombre", e.shiftKey)}>Movimiento {renderSortIcon("nombre")}</th>
                <th onClick={(e) => handleSort("tipo", e.shiftKey)}>Tipo {renderSortIcon("tipo")}</th>
                <th onClick={(e) => handleSort("potencia", e.shiftKey)}>Potencia {renderSortIcon("potencia")}</th>
                <th onClick={(e) => handleSort("precision", e.shiftKey)}>Precisión {renderSortIcon("precision")}</th>
                <th onClick={(e) => handleSort("categoria", e.shiftKey)}>Categoría {renderSortIcon("categoria")}</th>
                <th onClick={(e) => handleSort("pp", e.shiftKey)}>PP {renderSortIcon("pp")}</th>
              </tr>
            )}

            {/* Movimientos por Tutor/Huevo */}
            {(modo === "tutor" || modo === "huevo") && (
              <tr>
                <th onClick={(e) => handleSort("nombre", e.shiftKey)}>Movimiento {renderSortIcon("nombre")}</th>
                <th onClick={(e) => handleSort("tipo", e.shiftKey)}>Tipo {renderSortIcon("tipo")}</th>
                <th onClick={(e) => handleSort("potencia", e.shiftKey)}>Potencia {renderSortIcon("potencia")}</th>
                <th onClick={(e) => handleSort("precision", e.shiftKey)}>Precisión {renderSortIcon("precision")}</th>
                <th onClick={(e) => handleSort("categoria", e.shiftKey)}>Categoría {renderSortIcon("categoria")}</th>
                <th onClick={(e) => handleSort("pp", e.shiftKey)}>PP {renderSortIcon("pp")}</th>
              </tr>
            )}

          </thead>

          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={getColSpan()} className="empty-row">
                  {emptyOverride || emptyTextByMode[modo]}
                </td>
              </tr>
            ) : (
              filas.map((m, idx) =>
              {
                const rowKey = String(idx);
                const isHit = !!findMatchSet[rowKey];
                const isActive = activeFindKey ? rowKey === activeFindKey : false;

                const findClass =
                  (isHit ? " movsFindHit" : "") +
                  (isActive ? " movsFindActive" : "");

                return (
                  <tr
                    key={`${m.nombre}-${idx}`}
                    className={findClass}
                    ref={(el) => {
                      if (el) rowRefs.current[rowKey] = el;
                      else delete rowRefs.current[rowKey];
                    }}
                  >
                    {modo === "nivel" && <td className="col-nivel">{fmt(m.nivel)}</td>}
                    {modo === "mt" && <td className="col-mtmo">{fmt(m.mtmo)}</td>}

                    <td className="col-nombre">
                      <button
                        type="button"
                        className="mov-nombre-link"
                        onClick={() => goToMove(m.nombreMovApi || m.nombre)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            goToMove(m.nombreMovApi || m.nombre);
                          }
                        }}
                        title={"Ver movimiento: " + (m.nombre || m.nombreMovApi || "") }
                      >
                        {m.nombre}
                      </button>
                    </td>

                    <td className="col-tipo">
                      <div
                        className="tipo-wrap"
                        style={tipoCellWidth ? { "--tipo-cell-width": `${tipoCellWidth}px` } : undefined}
                      >
                        <Tipo tipo={m.tipo} size="small" />
                      </div>
                    </td>

                    <td className="col-potencia">{fmt(m.potencia)}</td>
                    <td className="col-precision">{fmt(m.precision)}</td>

                    <td className="col-clase">
                      <div className="clase-wrapper">
                        <img src={getClaseIcon(m.categoria)} alt={getMoveClassLabelEs(m.categoria)} className="icono-clase" title={getMoveClassLabelEs(m.categoria)} />
                      </div>
                    </td>

                    <td className="col-pp">{fmt(m.pp)}</td>
                  </tr>
                );

              })
            )}
          </tbody>
        </table>
      </div>
      ) : null}

    </div>
  );

}