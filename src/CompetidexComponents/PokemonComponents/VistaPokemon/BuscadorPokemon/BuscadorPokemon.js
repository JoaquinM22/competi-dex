//** src\CompetidexComponents\PokemonComponents\VistaPokemon\BuscadorPokemon\BuscadorPokemon.js

import React, { useEffect, useRef, useState } from "react";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { usePokemon } from "../../PokemonProvider";
import { spriteUrl } from "../../../../config/endpoints";
import { preloadCachedImage } from "../../../../utils/competidexImgCache";
import { showToastr } from "../../../../services/ToastrService";
import Tipo from "../../../SharedComponents/Tipo/Tipo";
import "./BuscadorPokemon.css";

export default function BuscadorPokemon({ onSearch, titulo = "Pokémon" })
{
  const {
    suggestPokemon,
    resolvePokemonInput,
    loadingIndex,
    pokemonMap,
  } = usePokemon();

  const [inputValue, setInputValue] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() =>
  {
    if(!sugs.length) return;

    sugs.forEach((it) =>
    {
      const sprite = spriteUrl(it.id);
      if(sprite) preloadCachedImage(sprite);
    });

  }, [sugs]);

  function parseGender(display = "")
  {
    const male = /(?:♂|\bmacho\b)/i.test(display);
    const female = /(?:♀|\bhembra\b)/i.test(display);
    const baseName = display
      .replace(/[♂♀]/g, "")
      .replace(/\b(macho|hembra)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    return { baseName: baseName || display, male, female };
  }

  function closeDropdown()
  {
    setOpen(false);
    setSugs([]);
    setActive(0);
  }

  function executeSearch(key)
  {
    if (onSearch) onSearch(key);

    setInputValue("");
    closeDropdown();
    if (inputRef.current) inputRef.current.blur();
  }

  useEffect(() =>
  {
    function handleClickOutside(e)
    {
      if(wrapperRef.current && !wrapperRef.current.contains(e.target))
      {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  
  }, []);

  // Sugerencias: si todavía carga el índice remoto, no intentes sugerir
  useEffect(() =>
  {
    const q = inputValue.trim();

    if(!q)
    {
      setSugs([]);
      setOpen(false);
      return;
    }

    if(loadingIndex)
    {
      setSugs([]);
      setOpen(false);
      return;
    }

    const s = suggestPokemon(q, 8);
    setSugs(s);
    setOpen(!!s.length);
    setActive(0);

  }, [inputValue, suggestPokemon, loadingIndex]);

  function handleSubmit(e)
  {
    e.preventDefault();

    if(loadingIndex)
    {
      showToastr({
        title: "Aviso en Pokémon",
        text: "Cargando Pokédex…",
        variant: "default"
      });

      return;
    }

    const q = inputValue.trim();
    if (!q)
    {
      showToastr({
        title: "Aviso en Pokémon",
        text: "El campo está vacío.",
        variant: "warning"
      });

      return;
    }

    const chosen = sugs[active];
    const key = chosen ? (chosen.apiName || chosen.key) : (resolvePokemonInput(q)?.key || q);
    executeSearch(key);
  }

  function chooseSuggestion(it)
  {
    executeSearch(it.apiName || it.key);
  }

  function onKeyDown(e)
  {
    if(loadingIndex)
    {
      if(e.key === "Enter")
      {
        e.preventDefault();
        showToastr({
          title: "Aviso en Pokémon",
          text: "Cargando Pokédex…",
          variant: "default"
        });
      }

      return;
    }

    if(open && sugs.length)
    {
      if(e.key === "ArrowDown")
      {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, sugs.length - 1));
        listRef.current?.children?.[Math.min(active + 1, sugs.length - 1)]?.scrollIntoView({ block: "nearest" });
        
        return;
      }

      if(e.key === "ArrowUp")
      {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        listRef.current?.children?.[Math.max(active - 1, 0)]?.scrollIntoView({ block: "nearest" });
        
        return;
      }

      if(e.key === "Enter")
      {
        e.preventDefault();
        executeSearch(sugs[active].apiName || sugs[active].key);
        
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
      e.preventDefault();
      const q = inputValue.trim();
      if (!q)
      {
        showToastr({
          title: "Aviso en Pokémon",
          text: "El campo está vacío.",
          variant: "warning"
        });

        return;
      }

      const key = resolvePokemonInput(q)?.key || q;
      executeSearch(key);
    }

  }

  function onFocusInput()
  {
    // Si está cargando, no abro dropdown
    if (loadingIndex) return;

    // Si ya hay sugs calculadas, abrimos
    setOpen(sugs.length > 0);
  }

  return (
    <div className="buscador-wrapper" ref={wrapperRef}>
      
      {/* Titulo del Buscador */}
      <h1 className="buscador-titulo">{titulo}</h1>

      {/* Buscador con suggest */}
      <form onSubmit={handleSubmit} className="buscador-form" autoComplete="off">
        <div className="buscador-autocomplete">
          <input
            inputMode="text"
            enterKeyHint="search"
            ref={inputRef}
            type="text"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            name="competidex-buscar-pokemon"
            placeholder={loadingIndex ? "Cargando Pokédex..." : "Escriba el nombre de un Pokémon"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={onFocusInput}
            onBlur={() => setTimeout(closeDropdown, 0)}
            onKeyDown={onKeyDown}
            disabled={false}
          />
          <button
            type="submit"
            disabled={false}
            className="buscador-btn-submit"
            aria-label="Buscar"
            title="Buscar"
          >
            <FiSearch aria-hidden="true" className="buscador-btn-icon" />
          </button>

          {/* Hint simple mientras carga */}
          {loadingIndex && inputValue.trim() && (
            <ul className="sugerencias" role="listbox" aria-label="Sugerencias de Pokémon">
              <li className="sugerencia" role="option" aria-selected="false">
                <div className="sug-left">
                  <span className="sug-name">Cargando Pokédex…</span>
                </div>
              </li>
            </ul>
          )}

          {open && sugs.length > 0 && !loadingIndex && (
            <ul className="sugerencias" ref={listRef} role="listbox" aria-label="Sugerencias de Pokémon">
              {sugs.map((it, i) => {
                
                const sprite = spriteUrl(it.id);
                const display = it.displayES;
                const { baseName, male, female } = parseGender(display);
                const typesEn = Array.isArray(it.types) ? it.types : [];

                return (
                  <li
                    key={`${it.apiName || it.key}-${i}`}
                    className={`sugerencia ${i === active ? "activa" : ""}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={() => chooseSuggestion(it)}
                  >
                    <div className="sug-left">
                      <span className="sug-id">#{it.id}</span>
                      <img
                        className="sug-sprite"
                        src={sprite}
                        alt={display}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                      />

                      <div className="sug-name-row">
                        <span className="sug-name">
                          {baseName}
                          {male && <IoMdMale aria-hidden="true" style={{ marginLeft: 6, verticalAlign: "middle", color: "#5BB1FF" }} />}
                          {female && <IoMdFemale aria-hidden="true" style={{ marginLeft: 4, verticalAlign: "middle", color: "#FF76B3" }} />}
                        </span>

                        {typesEn.length > 0 && (
                          <div className="sug-types-inline">
                            {typesEn.map((t) => (
                              <div key={t} className="sug-type-wrap">
                                <Tipo
                                  tipo={t}
                                  size="mini"
                                />
                              </div>
                            ))}
                          </div>
                        )}
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