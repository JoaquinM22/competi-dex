//** src\CompetidexComponents\PokedexComponents\PokedexSelector\PokedexSelector.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa6";
import { pokedexRoute } from "../../../utils/competidexRoutes";
import { usePokedex } from "../PokedexProvider";
import "./PokedexSelector.css";

function normalizePath(p)
{
  if(!p) return "/";
  const s = String(p || "").trim();
  return s.charAt(0) === "/" ? s : "/" + s;
}

function getOptionKey(opt)
{
  return [
    String(opt?.apiKey || "").trim().toLowerCase(),
    String(opt?.path || "").trim().toLowerCase(),
    String(opt?.labelEs || "").trim().toLowerCase()
  ].join("::");
}

function CustomSelect({ label, value, displayValue, options, getOptionKey, getOptionLabel, onChange, isOpen, onToggle, onClose })
{
  const listRef = useRef(null);

  function pick(opt)
  {
    onChange(opt);
    onClose();
  }

  function onKeyDown(e)
  {
    if(e.key === "Escape")
    {
      e.preventDefault();
      onClose();
      return;
    }

    if(e.key === "Enter" || e.key === " ")
    {
      e.preventDefault();
      onToggle();
      return;
    }

    if(!isOpen) return;

    const list = listRef.current;
    if(!list) return;

    const items = Array.prototype.slice.call(
      list.querySelectorAll("button[data-opt='1']")
    );

    if(!items.length) return;

    let currentIndex = 0;
    for(let i = 0; i < items.length; i++)
    {
      if(items[i].getAttribute("data-selected") === "1")
      {
        currentIndex = i;
        break;
      }
    }

    if(e.key === "ArrowDown")
    {
      e.preventDefault();
      const ni = Math.min(currentIndex + 1, items.length - 1);
      items[ni].focus();
      items[ni].scrollIntoView({ block: "nearest" });
      return;
    }

    if(e.key === "ArrowUp")
    {
      e.preventDefault();
      const pi = Math.max(currentIndex - 1, 0);
      items[pi].focus();
      items[pi].scrollIntoView({ block: "nearest" });
    }
  }

  return (
    <div className="pokedexSelField">
      <div className="pokedexSelFieldLabel">{label}</div>

      <button
        type="button"
        className={"pokedexSelPick" + (isOpen ? " isOpen" : "")}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="pokedexSelPickText">{displayValue}</span>
        <span className={"pokedexSelMiniCaret" + (isOpen ? " isOpen" : "")} aria-hidden="true">
          <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className="pokedexSelList" role="listbox" aria-label={label}>
          <div className="pokedexSelListInner" ref={listRef}>
            {options.map((opt) =>
            {
              const k = getOptionKey(opt);
              const txt = getOptionLabel(opt);
              const selected = k === value;

              return (
                <button
                  key={k}
                  type="button"
                  className={"pokedexSelOpt" + (selected ? " selected" : "")}
                  onClick={() => pick(opt)}
                  data-opt="1"
                  data-selected={selected ? "1" : "0"}
                  role="option"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                >
                  {txt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
  
}

export default function PokedexSelector({ className, mobileFlyout = false })
{
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith("/pokedex");

  const { pokedexSelectorGroups, pokedexSelectorAllEntries } = usePokedex();

  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [openOpt, setOpenOpt] = useState(false);

  const regionOptions = useMemo(() =>
  {
    const groups = Array.isArray(pokedexSelectorGroups) ? pokedexSelectorGroups : [];

    return [
      { regionKey: "__all__", regionLabel: "Todas las regiones", entries: Array.isArray(pokedexSelectorAllEntries) ? pokedexSelectorAllEntries : [] }
    ].concat(
      groups.map(function(group)
      {
        return {
          regionKey: group.regionGroup || "__empty__",
          regionLabel: group.regionLabel || "Sin región",
          entries: Array.isArray(group.entries) ? group.entries : []
        };
      })
    );

  }, [pokedexSelectorGroups, pokedexSelectorAllEntries]);

  const [regionKey, setRegionKey] = useState("__all__");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const activeRegionOption = useMemo(() =>
  {
    return regionOptions.find(function(opt)
    {
      return opt.regionKey === regionKey;
    }) || regionOptions[0] || { regionKey: "__all__", regionLabel: "Todas las regiones", entries: [] };

  }, [regionOptions, regionKey]);

  const visibleEntries = useMemo(() =>
  {
    if(regionKey === "__all__")
    {
      return Array.isArray(pokedexSelectorAllEntries) ? pokedexSelectorAllEntries : [];
    }

    return Array.isArray(activeRegionOption.entries) ? activeRegionOption.entries : [];

  }, [regionKey, activeRegionOption, pokedexSelectorAllEntries]);

  const [optionKey, setOptionKey] = useState("");

  useEffect(() =>
  {
    if(!visibleEntries.length)
    {
      setOptionKey("");
      setSelectedEntry(null);
      return;
    }

    const stillValid = visibleEntries.some(function(opt)
    {
      return getOptionKey(opt) === optionKey;
    });

    if(!stillValid)
    {
      setOptionKey(getOptionKey(visibleEntries[0]));
      setSelectedEntry(visibleEntries[0]);
    }

  }, [visibleEntries, optionKey]);

  useEffect(() =>
  {
    const pathname = String(location.pathname || "");
    if(!pathname.startsWith("/pokedex/")) return;

    const parts = pathname.split("/").filter(Boolean);
    const slug = normalizePath(parts.slice(1).join("/"));

    const exact = (Array.isArray(pokedexSelectorAllEntries) ? pokedexSelectorAllEntries : []).find(function(opt)
    {
      return normalizePath(opt?.path) === slug;
    });

    if(exact)
    {
      setRegionKey(exact.regionGroup || "__empty__");
      setOptionKey(getOptionKey(exact));
      setSelectedEntry(exact);
    }

  }, [location.pathname, pokedexSelectorAllEntries]);

  function closeAll()
  {
    setOpen(false);
    setOpenRegion(false);
    setOpenOpt(false);
  }

  useEffect(() =>
  {
    if(!open)
    {
      return;
    }

    const body = document.body;

    const prevPos = body.style.position;
    const prevTop = body.style.top;
    const prevLeft = body.style.left;
    const prevRight = body.style.right;
    const prevWidth = body.style.width;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    body.style.position = "fixed";
    body.style.top = (-scrollY) + "px";
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () =>
    {
      body.style.position = prevPos;
      body.style.top = prevTop;
      body.style.left = prevLeft;
      body.style.right = prevRight;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };

  }, [open]);

  useEffect(() =>
  {
    function onDocClick(e)
    {
      const inWrap = wrapRef.current && wrapRef.current.contains(e.target);
      const inMenu = menuRef.current && menuRef.current.contains(e.target);

      if(!inWrap && !inMenu)
      {
        closeAll();
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  
  }, []);

  function toggleMain()
  {
    setOpen(function(o)
    {
      const next = !o;
      if(!next)
      {
        setOpenRegion(false);
        setOpenOpt(false);
      }

      return next;
    });
  }

  function go()
  {
    const opt = selectedEntry || visibleEntries.find(function(entry)
    {
      return getOptionKey(entry) === optionKey;
    });

    if(!opt) return;

    const slug = normalizePath(opt.path).replace(/^\/+/, "");
    
    closeAll();
    navigate(pokedexRoute(slug));
  }

  const optionLabel = visibleEntries.find(function(entry)
  {
    return getOptionKey(entry) === optionKey;
  })?.labelEs || "";

  const menuNode = (
    <div
      ref={menuRef}
      className={"pokedexSelMenu" + (mobileFlyout ? " mobileFlyout" : "")}
      role="dialog"
      aria-label="Selector de Pokédex"
    >
      <div className="pokedexSelGrid">
        <CustomSelect
          label="Región"
          value={regionKey}
          displayValue={activeRegionOption.regionLabel || "—"}
          options={regionOptions}
          getOptionKey={(r) => r.regionKey}
          getOptionLabel={(r) => r.regionLabel}
          onChange={(r) =>
          {
            setRegionKey(r.regionKey);
            setOpenRegion(false);
          }}
          isOpen={openRegion}
          onToggle={() =>
          {
            setOpenRegion((v) => !v);
            setOpenOpt(false);
          }}
          onClose={() => setOpenRegion(false)}
        />

        <CustomSelect
          label="Juego / Variante"
          value={optionKey}
          displayValue={optionLabel || "—"}
          options={visibleEntries}
          getOptionKey={getOptionKey}
          getOptionLabel={(opt) => opt.labelEs || opt.path || opt.apiKey}
          onChange={(opt) =>
          {
            setOptionKey(getOptionKey(opt));
            setSelectedEntry(opt);
            setOpenOpt(false);
          }}
          isOpen={openOpt}
          onToggle={() =>
          {
            setOpenOpt((v) => !v);
            setOpenRegion(false);
          }}
          onClose={() => setOpenOpt(false)}
        />

        <button type="button" className="pokedexSelGo" onClick={go}>
          Ver Pokédex
        </button>
      </div>
    </div>
  );

  return (
    <>
      {open && (
        <div
          className="pokedexSelBackdrop"
          onMouseDown={closeAll}
          aria-hidden="true"
        />
      )}

      <div ref={wrapRef} className={"pokedexSelWrap" + (mobileFlyout ? " mobileFlyout" : "")}>
        <button
          type="button"
          className={"pokedexSelBtn " + (className || "") + (isActive ? " active" : "")}
          onClick={toggleMain}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="pokedexSelText">Pokédex</span>
          <span className={"pokedexSelCaret" + (open ? " isOpen" : "")} aria-hidden="true">
            <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
          </span>
        </button>

        {open && menuNode}
      </div>
    </>
  );

}