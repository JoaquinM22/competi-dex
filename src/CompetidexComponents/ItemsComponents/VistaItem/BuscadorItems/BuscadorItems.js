//** src\CompetidexComponents\ItemsComponents\VistaItem\BuscadorItems\BuscadorItems.js

import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useItems } from "../../ItemsProvider";
import { CACHE_VERSION } from "../../itemCache";
import { itemSpriteUrl } from "../../../../config/endpoints";
import { ERROR_404_SPRITE_IMG } from "../../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../../utils/competidexImgCache";
import { showToastr } from "../../../../services/ToastrService";
import "./BuscadorItems.css";

function clamp(n, a, b)
{
  return Math.max(a, Math.min(b, n));
}

function normalizeFreeTextToApiKey(input)
{
  let s = String(input || "").trim().toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[^a-z0-9]+/g, "-");
  s = s.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

  return s;
}

export default function BuscadorItems({ onSearch, titulo = "Objeto" })
{
  const { suggestItems } = useItems();

  const [inputValue, setInputValue] = useState("");
  const [sugs, setSugs] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const lastActionRef = useRef({ key: null, ts: 0 });

  const KEY_LAST_ITEM_KEY  = `items:lastKey:${CACHE_VERSION}`;
  const KEY_LAST_ITEM_SLUG = `items:lastSlug:${CACHE_VERSION}`;

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
      if(wrapperRef.current && !wrapperRef.current.contains(e.target))
      {
        closeDropdown();
      }
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

    const s = suggestItems(q, 8);
    setSugs(s);
    setOpen(!!s.length);
    setActive((prev) => clamp(prev, 0, Math.max(0, s.length - 1)));

  }, [inputValue, suggestItems]);

  useEffect(() =>
  {
    if(!sugs.length) return;

    const seen = new Set();
    sugs.forEach((it) =>
    {
      const sprite = itemSpriteUrl(it.key);
      if(!sprite || seen.has(sprite)) return;

      seen.add(sprite);
      preloadCachedImage(sprite);
    });

  }, [sugs]);

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
    if (inputRef.current) inputRef.current.blur();

    try { sessionStorage.setItem(KEY_LAST_ITEM_KEY, String(resolved.key)); } catch {}
    try { sessionStorage.setItem(KEY_LAST_ITEM_SLUG, String(resolved.slug || resolved.key || "")); } catch {}
  }

  function handleSubmit(e)
  {
    e.preventDefault();

    const q = inputValue.trim();
    if (!q)
    {
      showToastr({
        title: "Aviso en Objetos",
        text: "El campo está vacío.",
        variant: "warning"
      });

      return;
    }

    const chosen = sugs[active];

    if (chosen && chosen.key) {
      return executeSearch(chosen);
    }

    const apiKey = normalizeFreeTextToApiKey(q);
    if (!apiKey)
    {
      showToastr({
        title: "Aviso en Objetos",
        text: "El campo está vacío.",
        variant: "warning"
      });

      return;
    }

    executeSearch({
      key: apiKey,
      slug: apiKey,
      display: q,
      id: null,
      category: ""
    });
  }

  function chooseSuggestion(it)
  {
    executeSearch(it);
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

        if(listRef.current && listRef.current.children && listRef.current.children[nx])
        {
          listRef.current.children[nx].scrollIntoView({ block: "nearest" });
        }

        return;
      }

      if(e.key === "ArrowUp")
      {
        e.preventDefault();
        const nx = Math.max(active - 1, 0);
        setActive(nx);
        if(listRef.current && listRef.current.children && listRef.current.children[nx])
        {
          listRef.current.children[nx].scrollIntoView({ block: "nearest" });
        }

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
    <div className="buscador-item-wrapper" ref={wrapperRef}>
      <h1 className="buscador-item-titulo">{titulo}</h1>

      <form onSubmit={handleSubmit} className="buscador-item-form" autoComplete="off">
        <div className="buscador-item-autocomplete">
          <input
            inputMode="search"
            enterKeyHint="search"
            ref={inputRef}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            name="item-search"
            placeholder="Escriba el nombre de un Objeto"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(sugs.length > 0)}
            onBlur={() => setTimeout(closeDropdown, 0)}
            onKeyDown={onKeyDown}
          />
          <button
            type="submit"
            className="buscador-item-btn-submit"
            aria-label="Buscar"
            title="Buscar"
          >
            <FiSearch aria-hidden="true" className="buscador-item-btn-icon" />
          </button>

          {open && sugs.length > 0 && (
            <ul
              className="sugerencias-item"
              ref={listRef}
              role="listbox"
              aria-label="Sugerencias de Items"
            >
              {sugs.map((it, i) => (
                <li
                  key={it.key}
                  className={`sugerencia-item ${i === active ? "activa" : ""}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={() => chooseSuggestion(it)}
                  onMouseEnter={() => setActive(i)}
                >
                  <div className="sug-item-left">
                    {(it.id !== null && it.id !== undefined) && (
                      <span className="sug-item-id">#{it.id}</span>
                    )}

                    <img
                      className="sug-item-sprite"
                      src={itemSpriteUrl(it.key)}
                      alt={it.display}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = ERROR_404_SPRITE_IMG;
                      }}
                    />

                    <span className="sug-item-name" title={it.display}>
                      {it.display}
                    </span>
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