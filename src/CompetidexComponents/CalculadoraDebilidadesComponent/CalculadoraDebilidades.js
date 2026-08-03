//** src\CompetidexComponents\CalculadoraDebilidadesComponent\CalculadoraDebilidades.js

import React, { useMemo, useState, useRef, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import DebilidadesYResistencias from "../SharedComponents/DebilidadesYResistencias/DebilidadesYResistencias";
import Tipo from "../SharedComponents/Tipo/Tipo";
import {
  TYPES_META,
  ABILITIES_WITH_EFFECT_META,
  getTypeColor,
  getTypeLabelEs,
  getAbilityLabelEs,
  getAbilityEffectMeta,
} from "../../utils/competidexMeta";
import "./CalculadoraDebilidades.css";

const ALL_TYPES = Object.keys(TYPES_META).filter((k) => k !== "unknown" && k !== "ninguno");
const ALL_ABILITIES = Object.keys(ABILITIES_WITH_EFFECT_META).filter((k) => k !== "unknown");

function hexToRgba(hex, a)
{
    if (!hex) return "rgba(0,0,0,0)";
    if (hex.indexOf("rgba") === 0) return hex;

    const h = String(hex).replace("#", "").trim();
    if (h.length !== 6) return hex;

    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

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

function buildPanelBgForType(tipo)
{
    const base = getTypeColor(tipo);

    const c1 = hexToRgba(base, 0.78);
    const c2 = hexToRgba(base, 0.46);
    const dark = "rgba(34, 38, 46, 1)";

    return "linear-gradient(180deg, " + c1 + " 0%, " + c2 + " 68%, " + dark + " 100%)";
}

function buildTipo2GridItems()
{
    const out = ALL_TYPES.slice();
    return out;
}

function CustomSelect({
    label,
    value,
    displayValue,
    options,
    getOptionKey,
    getOptionLabel,
    getOptionDisabled,
    renderValue,
    renderOption,
    onChange,
    isOpen,
    onToggle,
    onClose
})
{
  const rootRef = useRef(null);
  const listRef = useRef(null);

  function pick(opt)
  {
    if (getOptionDisabled && getOptionDisabled(opt)) return;
    onChange(opt);
    onClose();
  }

  useEffect(() =>
  {
    if (!isOpen) return;

    function handleOutsideClick(event)
    {
      const root = rootRef.current;
      if (!root) return;

      if (!root.contains(event.target))
      {
        onClose();
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () =>
    {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };

  }, [isOpen, onClose]);

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

    if (!isOpen) return;

    const list = listRef.current;
    if (!list) return;

    const items = Array.prototype.slice.call(
      list.querySelectorAll("button[data-opt='1']:not([data-disabled='1'])")
    );

    if (!items.length) return;

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

    if (e.key === "ArrowUp")
    {
      e.preventDefault();
      const pi = Math.max(currentIndex - 1, 0);
      items[pi].focus();
      items[pi].scrollIntoView({ block: "nearest" });
      
      return;
    }

  }

  return (
    <div className="cdAbilityField" ref={rootRef}>
      <div className="cdAbilityFieldLabel">{label}</div>

      <button
        type="button"
        className={"cdAbilityPick" + (isOpen ? " isOpen" : "")}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {renderValue ? (
          <span className="cdAbilityPickNode">{renderValue()}</span>
        ) : (
          <span className="cdAbilityPickText">{displayValue}</span>
        )}
        <span
          className={"cdAbilityMiniCaret" + (isOpen ? " isOpen" : "")}
          aria-hidden="true"
        >
          <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className="cdAbilityList" role="listbox" aria-label={label}>
          <div className="cdAbilityListInner" ref={listRef}>
            {options.map((opt) =>
            {
              const k = getOptionKey(opt);
              const txt = getOptionLabel(opt);
              const selected = k === value;
              const disabled = !!(getOptionDisabled && getOptionDisabled(opt));

              return (
                <button
                  key={k}
                  type="button"
                  className={
                    "cdAbilityOpt" +
                    (selected ? " selected" : "") +
                    (disabled ? " disabled" : "")
                  }
                  onClick={() => pick(opt)}
                  data-opt="1"
                  data-selected={selected ? "1" : "0"}
                  data-disabled={disabled ? "1" : "0"}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={disabled}
                  tabIndex={disabled ? -1 : (selected ? 0 : -1)}
                >
                  {renderOption ? renderOption(opt, selected) : txt}
                </button>
              );

            })}
          </div>
        </div>
      )}
    </div>
  );

}

function TypeSelect({
  title,
  value,
  options,
  getOptionKey,
  getOptionLabel,
  getOptionDisabled,
  onChange,
  onClear,
  isOpen,
  onToggle,
  onClose,
  chipWidth
})
{
  const [search, setSearch] = useState("");
  const current = options.find((opt) => getOptionKey(opt) === value) || null;
  const currentLabel = current ? (getOptionLabel(current) || "Ninguno") : "Ninguno";
  const normalizedSearch = normalizeAbilityFilterText(search);
  const filteredOptions = useMemo(() =>
  {
    if (!normalizedSearch) return options;

    return options.filter((opt) =>
    {
      const labelText = normalizeAbilityFilterText(getOptionLabel(opt));
      return labelText.indexOf(normalizedSearch) !== -1;
    });

  }, [options, getOptionLabel, normalizedSearch]);

  return (
    <div
      className={
        "cd-mobile-select cd-block cd-block-type" +
        (isOpen ? " isOpen" : "")
      }
      style={chipWidth ? { "--cd-type-chip-width": `${chipWidth}px` } : undefined}
    >
      <div className="cd-block-head">
        <div className="cd-block-title">{title}</div>
        <button
          title={`Limpiar ${title.toLowerCase()}`}
          className="cd-btn"
          type="button"
          onClick={() =>
          {
            setSearch("");
            if (onClear) onClear();
            onClose();
          }}
        >
          Limpiar
        </button>
      </div>

      <div className="cd-ability-box">
        <label className="cd-label">Buscar</label>
        <input
          inputMode="text"
          enterKeyHint="search"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          name="competidex-buscar-dyr"
          className="cd-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Escribí para filtrar..."
          onFocus={() =>
          {
            if (!isOpen) onToggle();
          }}
        />

        <div style={{ marginTop: 10 }}>
          <CustomSelect
            label="Seleccionar"
            value={value}
            displayValue={currentLabel}
            options={filteredOptions}
            getOptionKey={getOptionKey}
            getOptionLabel={getOptionLabel}
            getOptionDisabled={getOptionDisabled}
            renderValue={() =>
            {
              const current = filteredOptions.find((opt) => getOptionKey(opt) === value) || options.find((opt) => getOptionKey(opt) === value) || null;
              const tipo = current?.tipo || (value || "Ninguno");
              return <Tipo tipo={tipo} size="small" />;
            }}
            renderOption={(opt) => <Tipo tipo={opt.tipo} size="small" />}
            onChange={onChange}
            isOpen={isOpen}
            onToggle={onToggle}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

function normalizeAbilityFilterText(input)
{
    return String(input || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export default function CalculadoraDebilidades()
{
    const [tipo1, setTipo1] = useState("normal");
    const [tipo2, setTipo2] = useState("");
    const [habilidad, setHabilidad] = useState("");
    const [abilitySearch, setAbilitySearch] = useState("");
    const [openAbility, setOpenAbility] = useState(false);
    const [openType1, setOpenType1] = useState(false);
    const [openType2, setOpenType2] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(() =>
    {
        if (typeof window === "undefined") return 0;
        return window.innerWidth || 0;
    });

    const tipos = useMemo(() =>
    {
        const out = [];
        if (tipo1) out.push(tipo1);
        if (tipo2) out.push(tipo2);
        return out;
    }, [tipo1, tipo2]);

    const availableAbilities = useMemo(() =>
    {
        return ALL_ABILITIES
            .filter((k) => !!getAbilityEffectMeta(k)?.apiKey)
            .map((apiName) => ({
                apiName: apiName,
                display: String(getAbilityLabelEs(apiName) || apiName).trim(),
            }));

    }, []);

    const habilidades = useMemo(() =>
    {
        if (!habilidad) return [];
        const selected = availableAbilities.find((opt) => opt.apiName === habilidad) || null;
        if(!selected) return [];

        return [selected];

    }, [habilidad, availableAbilities]);

    const filteredAbilities = useMemo(() =>
    {
        const s = normalizeAbilityFilterText(abilitySearch);
        const all = availableAbilities;
        if (!s) return all;

        return all.filter((a) =>
        {
            const label = normalizeAbilityFilterText(a.display);
            const key = normalizeAbilityFilterText(a.apiName);
            return label.indexOf(s) !== -1 || key.indexOf(s) !== -1;
        });

    }, [abilitySearch, availableAbilities]);

    const tipo2GridItems = useMemo(() => buildTipo2GridItems(), []);
    const typeOptions = useMemo(() =>
    {
        return ALL_TYPES.map((t) => ({
            key: t,
            tipo: t,
            label: String(getTypeLabelEs(t) || t).trim(),
            disabled: false,
        }));

    }, []);

    const type2Options = useMemo(() =>
    {
        return typeOptions.concat([{
            key: "__NONE__",
            tipo: "Ninguno",
            label: "Ninguno",
            disabled: false,
        }]);

    }, [typeOptions]);

    const typeChipWidth = useMemo(() =>
    {
        const labels = new Set();

        for (let i = 0; i < ALL_TYPES.length; i++)
        {
            const label = String(getTypeLabelEs(ALL_TYPES[i]) || "").trim();
            if (label) labels.add(label);
        }

        labels.add("Ninguno");

        if (!labels.size) return 0;

        const fontSize = 12;
        const isNarrow = viewportWidth > 0 && viewportWidth <= 720;
        const paddingX = isNarrow ? 22 : 20;
        const gap = isNarrow ? 8 : 4;
        const iconSize = isNarrow ? 24 : 14;
        const borderWidth = 4;
        const extra = isNarrow ? 24 : 10;

        let maxLabelWidth = 0;
        labels.forEach((label) =>
        {
            maxLabelWidth = Math.max(maxLabelWidth, measureTextWidth(label, fontSize));
        });

        return Math.ceil(maxLabelWidth + paddingX + iconSize + gap + borderWidth + extra);

    }, [viewportWidth]);

    useEffect(() =>
    {
        function handleResize()
        {
            if (typeof window === "undefined") return;
            setViewportWidth(window.innerWidth || 0);
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    function onPickTipo1(t)
    {
        setTipo1(t);
        if (tipo2 === t) setTipo2("");
    }

    function onPickTipo2(t)
    {
        if(!t)
        {
            setTipo2("");
            return;
        }

        if (t === tipo1) return;
        setTipo2(t);
    }

    function clearAbility()
    {
        setHabilidad("");
        setAbilitySearch("");
        setOpenAbility(false);
    }

    const habilidadDisplay = habilidad
        ? (availableAbilities.find((opt) => opt.apiName === habilidad)?.display || getAbilityLabelEs(habilidad) || habilidad)
        : "Ninguna";
    const tipo1PanelBg = buildPanelBgForType(tipo1);
    const tipo2PanelBg = buildPanelBgForType(tipo2 ? tipo2 : "Ninguno");

    return (
        <div className="cd-page">
            <div className="cd-container">

                {/* Titulo */}
                <div className="cdyr-titulo-wrapper">
                    <h1 className="cd-title">
                        Calculadora de Debilidades y Resistencias
                    </h1>
                </div>

                {/* Data Calculadora */}
                <div className="componente-cdyr-data">

                    {/* Selector de Tipo 1 y Tipo 2 + Elegir Habilidad */}
                    <div className="cd-layout">
                        <div className="cd-types-mobile">
                            <TypeSelect
                                title="Primer Tipo"
                                label="Primer Tipo"
                                value={tipo1}
                                options={typeOptions}
                                chipWidth={typeChipWidth}
                                getOptionKey={(opt) => opt.key}
                                getOptionLabel={(opt) => opt.label}
                                onClear={() =>
                                {
                                    onPickTipo1("normal");
                                }}
                                onChange={(opt) =>
                                {
                                    onPickTipo1(opt.key);
                                    setOpenType1(false);
                                }}
                                isOpen={openType1}
                                onToggle={() =>
                                {
                                    setOpenType1((v) => !v);
                                    setOpenType2(false);
                                }}
                                onClose={() => setOpenType1(false)}
                            />

                            <TypeSelect
                                title="Segundo Tipo"
                                label="Segundo Tipo"
                                value={tipo2 ? tipo2 : "__NONE__"}
                                options={type2Options}
                                chipWidth={typeChipWidth}
                                getOptionKey={(opt) => opt.key}
                                getOptionLabel={(opt) => opt.label}
                                getOptionDisabled={(opt) => opt.key === tipo1}
                                onClear={() =>
                                {
                                    onPickTipo2("");
                                }}
                                onChange={(opt) =>
                                {
                                    onPickTipo2(opt.key === "__NONE__" ? "" : opt.key);
                                    setOpenType2(false);
                                }}
                                isOpen={openType2}
                                onToggle={() =>
                                {
                                    setOpenType2((v) => !v);
                                    setOpenType1(false);
                                }}
                                onClose={() => setOpenType2(false)}
                            />
                        </div>

                        <div
                            className="cd-types-row"
                            style={typeChipWidth ? { "--cd-type-chip-width": `${typeChipWidth}px` } : undefined}
                        >
                            
                            {/* Selector de Tipo 1 */}
                            <div className="cd-block cd-block-type" style={{ "--cd-type-panel-bg": tipo1PanelBg }}>
                                <div className="cd-block-head">
                                    <div className="cd-block-title">Primer Tipo</div>
                                    <div className="cd-selected">
                                        <Tipo tipo={tipo1} size="medium" />
                                    </div>
                                </div>

                                <div className="cd-types-grid cd-types-grid-6">
                                    {ALL_TYPES.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            className={"cd-type-btn" + (tipo1 === t ? " active" : "")}
                                            onClick={() => onPickTipo1(t)}
                                            title={t}
                                        >
                                            <Tipo tipo={t} size="small" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selector de Tipo 2 */}
                            <div className="cd-block cd-block-type" style={{ "--cd-type-panel-bg": tipo2PanelBg }}>
                                <div className="cd-block-head">
                                    <div className="cd-block-title">Segundo Tipo</div>
                                    <div className="cd-selected">
                                        <Tipo tipo={tipo2 ? tipo2 : "Ninguno"} size="medium" />
                                    </div>
                                </div>

                                <div className="cd-types-grid cd-types-grid-6">
                                    {tipo2GridItems.map((t) =>
                                    {
                                        const disabled = (t === tipo1);
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                className={
                                                    "cd-type-btn" +
                                                    (tipo2 === t ? " active" : "") +
                                                    (disabled ? " disabled" : "")
                                                }
                                                onClick={() => onPickTipo2(t)}
                                                disabled={disabled}
                                                title={disabled ? "No puede ser igual al primer Tipo" : t}
                                            >
                                                <Tipo tipo={t} size="small" />
                                            </button>
                                        );
                                    })}
                                    <button
                                        key="__NONE__"
                                        type="button"
                                        className={"cd-type-btn" + (!tipo2 ? " active" : "")}
                                        onClick={() => onPickTipo2("")}
                                        title="Ninguno"
                                    >
                                        <Tipo tipo="Ninguno" size="small" />
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div className="cd-ability-row">
                            <div className="cd-block cd-ability-block">
                                <div className="cd-block-head">
                                    <div className="cd-block-title">Habilidad</div>
                                    <button title="Limpiar Habilidad" className="cd-btn" type="button" onClick={clearAbility}>
                                        Limpiar
                                    </button>
                                </div>

                                <div className="cd-ability-box">
                                    <label className="cd-label">Buscar</label>
                                    <input
                                        inputMode="text"
                                        enterKeyHint="search"
                                        autoComplete="new-password"
                                        autoCorrect="off"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        name="competidex-buscar-dyr-hab"
                                        className="cd-input"
                                        value={abilitySearch}
                                        onChange={(e) => setAbilitySearch(e.target.value)}
                                        placeholder="Escribí para filtrar…"
                                        onFocus={() => setOpenAbility(true)}
                                    />

                                    <div style={{ marginTop: 10 }}>
                                        <CustomSelect
                                            label="Seleccionar"
                                            value={habilidad || "__NONE__"}
                                            displayValue={habilidadDisplay}
                                            options={[{ apiName: "__NONE__", display: "Ninguna" }].concat(filteredAbilities)}
                                            getOptionKey={(opt) => opt.apiName}
                                            getOptionLabel={(opt) => opt.display}
                                            onChange={(opt) =>
                                            {
                                                setHabilidad(opt.apiName === "__NONE__" ? "" : opt.apiName);
                                                setOpenAbility(false);
                                            }}
                                            isOpen={openAbility}
                                            onToggle={() => setOpenAbility((v) => !v)}
                                            onClose={() => setOpenAbility(false)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de DYR */}
                    <div className="cd-result">
                        <DebilidadesYResistencias
                            tipos={tipos}
                            habilidades={habilidades}
                        />
                    </div>

                </div>

            </div>
        </div>
    );

}