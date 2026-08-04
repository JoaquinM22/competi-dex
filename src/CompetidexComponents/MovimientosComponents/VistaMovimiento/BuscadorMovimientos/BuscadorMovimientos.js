//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\BuscadorMovimientos\BuscadorMovimientos.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useMoves } from "../../MovesProvider";
import { CACHE_VERSION } from "../../moveCache";
import { getMoveClassMeta } from "../../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../../utils/competidexImgCache";
import { showToastr } from "../../../../services/ToastrService";
import Tipo from "../../../SharedComponents/Tipo/Tipo";
import "./BuscadorMovimientos.css";

function clamp(n, a, b)
{
  return Math.max(a, Math.min(b, n));
}

export default function BuscadorMovimientos({ onSearch, titulo = "Movimiento" })
{
  const { suggestMoves, resolveMoveInput } = useMoves();

  const [inputValue, setInputValue] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Evitar duplicar búsquedas si Enter se dispara por submit + keydown
  const lastActionRef = useRef({ key: null, ts: 0 });

  const KEY_LAST_MOVE_KEY = `moves:lastKey:${CACHE_VERSION}`;
  const KEY_LAST_MOVE_SLUG = `moves:lastSlug:${CACHE_VERSION}`;

  useEffect(() =>
  {
    if(!sugs.length) return;

    const seen = new Set();

    sugs.forEach((it) =>
    {
      const metaClass = getMoveClassMeta(it.class);
      const icon = metaClass?.icon;
      if(!icon || seen.has(icon)) return;

      seen.add(icon);
      preloadCachedImage(icon);
    });

  }, [sugs]);

  function closeDropdown()
  {
    setOpen(false);
    setSugs([]);
    setActive(0);
  }

  // Click afuera
  useEffect(() =>
  {

    function handleClickOutside(e)
    {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) closeDropdown();
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  
  }, []);

  useEffect(() =>
  {
    const q = inputValue.trim();
    if(!q)
    {
      setSugs([]);
      setOpen(false);
      setActive(0);
      return;
    }

    const s = suggestMoves(q, 8);
    setSugs(s);
    setOpen(!!s.length);
    setActive((prev) => clamp(prev, 0, Math.max(0, s.length - 1)));
  
  }, [inputValue, suggestMoves]);

  async function executeSearch(resolved)
  {
    if (!resolved || !resolved.key) return;

    const now = Date.now();
    const last = lastActionRef.current;
    if (last.key === resolved.key && now - last.ts < 300) return;
    lastActionRef.current = { key: resolved.key, ts: now };

    onSearch(resolved);

    setInputValue("");
    closeDropdown();
    inputRef.current?.blur();

    // guardo para navbar
    try { sessionStorage.setItem(KEY_LAST_MOVE_KEY, String(resolved.key)); } catch {}
    try { sessionStorage.setItem(KEY_LAST_MOVE_SLUG, String(resolved.slug || "")); } catch {}
  }

  function handleSubmit(e)
  {
    e.preventDefault();

    const q = inputValue.trim();
    if (!q)
    {
      showToastr({
        title: "Aviso en Movimientos",
        text: "El campo está vacío.",
        variant: "warning"
      });

      return;
    }

    const chosen = sugs[active];

    // si hay sugerencia, ya tengo apiKey seguro
    if(chosen && chosen.key)
    {
      const resolved = resolveMoveInput(chosen.key); // devuelve key+slug canónico
      return executeSearch(resolved);
    }

    // Sin sugerencia: resuelvo ES/EN/slug
    const resolved2 = resolveMoveInput(q);
    if (!resolved2 || !resolved2.key)
    {
      showToastr({
        title: "Aviso en Movimientos",
        text: "No se encontró el movimiento.",
        variant: "warning"
      });

      return;
    }

    executeSearch(resolved2);
  }
  
  function chooseSuggestion(it)
  {
    const resolved = resolveMoveInput(it.key);
    executeSearch(resolved);
  }

  function onKeyDown(e)
  {

    if(open && sugs.length)
    {

      if(e.key === "ArrowDown")
      {
        e.preventDefault();
        const nx = Math.min(active + 1, sugs.length - 1);
        setActive(nx);
        listRef.current?.children?.[nx]?.scrollIntoView({ block: "nearest" });
        
        return;
      }

      if(e.key === "ArrowUp")
      {
        e.preventDefault();
        const nx = Math.max(active - 1, 0);
        setActive(nx);
        listRef.current?.children?.[nx]?.scrollIntoView({ block: "nearest" });
        
        return;
      }

      if(e.key === "Enter")
      {
        return;
      }

      if(e.key === "Escape")
      {
        e.preventDefault();
        closeDropdown();
        
        return;
      }

    }else if(e.key === "Enter")
    {
      return;
    }

  }

  return (
    <div className="buscador-mov-wrapper" ref={wrapperRef}>
      <h1 className="buscador-mov-titulo">{titulo}</h1>

      <form onSubmit={handleSubmit} className="buscador-mov-form" autoComplete="off">
        <div className="buscador-mov-autocomplete">
          <input
            inputMode="search"
            enterKeyHint="search"
            ref={inputRef}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            name="move-search"
            placeholder="Escriba el nombre de un Movimiento"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(sugs.length > 0)}
            onBlur={() => setTimeout(closeDropdown, 0)}
            onKeyDown={onKeyDown}
          />
          <button
            type="submit"
            className="buscador-mov-btn-submit"
            aria-label="Buscar"
            title="Buscar"
          >
            <FiSearch aria-hidden="true" className="buscador-mov-btn-icon" />
          </button>

          {open && sugs.length > 0 && (
            <ul
              className="sugerencias-mov"
              ref={listRef}
              role="listbox"
              aria-label="Sugerencias de Movimientos"
            >
              {sugs.map((it, i) =>
              {
                const metaClass = getMoveClassMeta(it.class);

                return (
                  <li
                    key={it.key}
                    className={`sugerencia-mov ${i === active ? "activa" : ""}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={() => chooseSuggestion(it)}
                    onMouseEnter={() => setActive(i)}
                  >
                    <div className="sug-mov-left">
                      {(it.id !== null && it.id !== undefined) && (
                        <span className="sug-mov-id">#{it.id}</span>
                      )}

                      <div className="sug-mov-meta">
                        <span className="sug-mov-name" title={it.display}>
                          {it.display}
                        </span>

                        <div className="sug-mov-types-inline">
                          {it.type && (
                            <div className="sug-mov-type-wrap">
                              <Tipo tipo={it.type} size="mini" />
                            </div>
                          )}

                          {metaClass?.icon && (
                            <div className="sug-mov-class" title={metaClass.labelEs}>
                              <img
                                className="sug-mov-class-icon"
                                src={metaClass.icon}
                                alt={metaClass.labelEs}
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </form>

    </div>
  );

}