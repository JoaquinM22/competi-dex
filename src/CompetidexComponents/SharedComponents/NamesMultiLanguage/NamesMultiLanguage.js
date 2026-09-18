//** src\CompetidexComponents\SharedComponents\NamesMultiLanguage\NamesMultiLanguage.js

import React, { useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { FaLocationArrow } from "react-icons/fa6";
import { getLanguageMeta, getLanguageReactFlagCode } from "../../../utils/competidexMeta";
import "./NamesMultiLanguage.css";

function renderTituloSubrayado(texto)
{
    const parts = String(texto || "").trim().split(/\s+/).filter(Boolean);

    if(parts.length === 0)
    {
        return null;
    }

    return parts.map(function(part, index)
    {
        return (
            <React.Fragment key={`${part}-${index}`}>
                <span className="namesMultiLanguageComponent-titulo-texto">{part}</span>
                {index < parts.length - 1 ? " " : ""}
            </React.Fragment>
        );
    });
}

function toNameItem(item, index)
{
    const label = item && item.label ? String(item.label).trim() : "";
    const languageKey = item && item.languageKey ? String(item.languageKey).trim() : "";

    if(!label) return null;

    const languageMeta = getLanguageMeta(languageKey);
    const flagCodes = getLanguageReactFlagCode(languageKey)
        .map(function(code)
        {
            return String(code || "").trim().toUpperCase();
        })
        .filter(Boolean);

    return {
        key: `${languageKey || "unknown"}-${label}-${index}`,
        label,
        languageKey,
        order: (typeof languageMeta?.order === "number") ? languageMeta.order : 9999,
        languageLabel: languageMeta?.labelEs || "Idioma Desconocido",
        flagCodes
    };
}

export default function NamesMultiLanguage({ title = "Nombres Especie Pokémon", names = [], size = "normal", hideHeader = false })
{
    const [open, setOpen] = useState(false);
    const items = useMemo(function()
    {
        const list = Array.isArray(names) ? names : [];
        const mapped = list.map(toNameItem).filter(Boolean);

        mapped.sort(function(a, b)
        {
            const orderA = (typeof a.order === "number") ? a.order : 9999;
            const orderB = (typeof b.order === "number") ? b.order : 9999;

            if(orderA !== orderB)
            {
                return orderA - orderB;
            }

            return String(a.languageKey || "").localeCompare(String(b.languageKey || ""));
        });

        return mapped.length > 0 ? mapped : null;

    }, [names]);

    const sizeClass = `namesMultiLanguageComponent-container-${size}`;
    const showList = hideHeader || open;

    if(!items)
    {
        return null;
    }

    function namesItems()
    {
        return (
            <>
                {/* Listado de Nombres segun el Idioma */}
                <div className={"namesMultiLanguageComponent-lista " + (showList ? "namesMultiLanguageComponent-visible" : "namesMultiLanguageComponent-oculto")}>
                    {items.map(function(item)
                    {
                        const hasFlags = item.flagCodes.length > 0;
                        const hasTooltip = !!item.languageLabel;

                        return (
                            <div
                                key={item.key}
                                className={
                                    "namesMultiLanguageComponent-item" +
                                    (hasTooltip ? " has-tooltip" : "")
                                }
                            >

                                {/* Nombre + Banderas */}
                                <div
                                    className="namesMultiLanguageComponent-linea"
                                    tabIndex={hasTooltip ? 0 : -1}
                                    aria-label={`${item.label}: ${item.languageLabel}`}
                                >
                                    
                                    {/* Nombre */}
                                    <span className="namesMultiLanguageComponent-nombre">
                                        {item.label}
                                    </span>

                                    {/* Banderas */}
                                    <span className="namesMultiLanguageComponent-valor">
                                        {hasFlags ? (
                                            item.flagCodes.map(function(flagCode)
                                            {
                                                return (
                                                    <ReactCountryFlag
                                                        key={`${item.key}-${flagCode}`}
                                                        countryCode={flagCode}
                                                        svg
                                                        title={item.languageLabel}
                                                        className="namesMultiLanguageComponent-flag"
                                                    />
                                                );
                                            })
                                        ) : null}
                                    </span>

                                </div>

                                {/* Tooltip */}
                                {hasTooltip && (
                                    <div className="namesMultiLanguageComponent-tooltip" role="tooltip">
                                        {item.languageLabel}
                                    </div>
                                )}

                            </div>
                        );
                    })}
                </div>
            </>
        );
    }

    if(hideHeader)
    {
        return (
            <>
                <div className={`namesMultiLanguageComponent-container ${sizeClass}`}>

                    {namesItems()}
                </div>    
            </>     
        );
    }

    return (
        <div className={`namesMultiLanguageComponent-container ${sizeClass}`}>

            {/* Titulo + Boton desplegable */}
            <div className="namesMultiLanguageComponent-header">
                
                {/* Titulo */}
                <h3 className="namesMultiLanguageComponent-titulo">
                    {renderTituloSubrayado(title)}
                </h3>

                {/* Boton desplegable */}         
                <button
                    className="namesMultiLanguageComponent-toggle"
                    onClick={function()
                    {
                        setOpen(!open);
                    }}
                    type="button"
                    aria-label={open ? "Ocultar nombres" : "Mostrar nombres"}
                    title={open ? "Ocultar nombres" : "Mostrar nombres"}
                >
                    <span className={open ? "namesMultiLanguageComponent-iconoRotado" : "namesMultiLanguageComponent-iconoNormal"}>
                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                    </span>
                </button>
            
            </div>
           
            {namesItems()}

        </div>
    );

}