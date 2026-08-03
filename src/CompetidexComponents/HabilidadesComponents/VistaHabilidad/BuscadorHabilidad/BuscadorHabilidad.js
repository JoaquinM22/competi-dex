//** src\CompetidexComponents\HabilidadesComponents\VistaHabilidad\BuscadorHabilidad\BuscadorHabilidad.js

import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useAbilities } from "../../AbilitiesProvider";
import { getGenerationIcon, getGenerationLabelEs } from "../../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../../utils/competidexImgCache";
import { showToastr } from "../../../../services/ToastrService";
import "./BuscadorHabilidad.css";

function clamp(n, a, b)
{
  return Math.max(a, Math.min(b, n));
}

function decorateSuggestion(it)
{
  const genKey = String(it?.gen || "").trim().toLowerCase();
  const genIcon = getGenerationIcon(genKey) || "";
  const genLabel = getGenerationLabelEs(genKey) || "";

  return {
    ...it,
    genIcon: genIcon,
    genLabel: genLabel,
  };
}

function buildSearchPayload(meta, resolved)
{
  return {
    ...(meta || {}),
    ...(resolved || {}),
  };
}

export default function BuscadorHabilidad({ onSearch, titulo = "Habilidad" })
{
  const { suggestAbilities, resolveAbilityInput } = useAbilities();

  const [inputValue, setInputValue] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  function closeDropdown()
  {
    setOpen(false);
    setSugs([]);
    setActive(0);
  }

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

    const s = suggestAbilities(q, 8);
    const decorated = s.map(decorateSuggestion);
    setSugs(decorated);
    setOpen(!!decorated.length);
    setActive((prev) => clamp(prev, 0, Math.max(0, decorated.length - 1)));

  }, [inputValue, suggestAbilities]);

  useEffect(() =>
  {
    for(const it of sugs)
    {
      if(it?.genIcon) preloadCachedImage(it.genIcon);
    }
  }, [sugs]);

  function executeSearch(payload)
  {
    if (!payload || !payload.key) return;
    onSearch && onSearch(payload);
    setInputValue("");
    closeDropdown();
    inputRef.current && inputRef.current.blur();
  }

  function handleSubmit(e)
  {
    e.preventDefault();

    const q = inputValue.trim();
    if (!q)
    {
      showToastr({
        title: "Aviso en Habilidades",
        text: "El campo está vacío.",
        variant: "warning"
      });

      return;
    }

    const chosen = sugs[active];
    if(chosen && chosen.key)
    {
      const resolved = resolveAbilityInput(chosen.key);
      return executeSearch(buildSearchPayload(chosen, resolved));
    }

    const resolved2 = resolveAbilityInput(q);
    if (!resolved2 || !resolved2.key) return;
    const meta = sugs.find((it) => it.key === resolved2.key) || null;
    executeSearch(buildSearchPayload(meta, resolved2));
  }

  function chooseSuggestion(it)
  {
    const resolved = resolveAbilityInput(it.key);
    executeSearch(buildSearchPayload(it, resolved));
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
        listRef.current && listRef.current.children && listRef.current.children[nx] && listRef.current.children[nx].scrollIntoView({ block: "nearest" });

        return;
      }

      if(e.key === "ArrowUp")
      {
        e.preventDefault();
        const nx = Math.max(active - 1, 0);
        setActive(nx);
        listRef.current && listRef.current.children && listRef.current.children[nx] && listRef.current.children[nx].scrollIntoView({ block: "nearest" });

        return;
      }

      if(e.key === "Escape")
      {
        e.preventDefault();
        closeDropdown();

        return;
      }

    }
  }

  return (
    <div className="buscador-hab-wrapper" ref={wrapperRef}>
      <h1 className="buscador-hab-titulo">{titulo}</h1>

      <form onSubmit={handleSubmit} className="buscador-hab-form" autoComplete="off">
        <div className="buscador-hab-autocomplete">
          <input
            inputMode="text"
            enterKeyHint="search"
            ref={inputRef}
            type="text"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            name="competidex-buscar-habilidad"
            placeholder="Escriba el nombre de una Habilidad"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(sugs.length > 0)}
            onBlur={() => setTimeout(closeDropdown, 0)}
            onKeyDown={onKeyDown}
          />
          <button
            type="submit"
            className="buscador-hab-btn-submit"
            aria-label="Buscar"
            title="Buscar"
          >
            <FiSearch aria-hidden="true" className="buscador-hab-btn-icon" />
          </button>

          {open && sugs.length > 0 && (
            <ul className="sugerencias-hab" ref={listRef} role="listbox">
              {sugs.map((it, i) => (
                <li
                  key={it.key}
                  className={`sugerencia-hab ${i === active ? "activa" : ""}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={() => chooseSuggestion(it)}
                  onMouseEnter={() => setActive(i)}
                >
                  <div className="sug-hab-left">
                    {it.id !== undefined && it.id !== null && (
                      <span className="sug-hab-id">#{it.id}</span>
                    )}

                    <div className="sug-hab-name-row">
                      <span className="sug-hab-name">
                        {it.display || it.key}
                      </span>

                      {!!it.genIcon && (
                        <div className="sug-hab-gen" title={it.genLabel || ""}>
                          <img
                            className="sug-hab-gen-icon"
                            src={it.genIcon}
                            alt={it.genLabel || "Gen"}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

    </div>
  );
  
}
