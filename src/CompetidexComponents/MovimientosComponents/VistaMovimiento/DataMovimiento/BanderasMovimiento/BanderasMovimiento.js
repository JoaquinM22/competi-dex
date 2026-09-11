//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\BanderasMovimiento\BanderasMovimiento.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getFlagsByGroupKey } from "../../../../../utils/competidexMeta";
import {
    advancedMovesSearchRouteWithFilters,
    getAdvancedSearchTabConfig
} from "../../../../../utils/competidexRoutes";
import "./BanderasMovimiento.css";

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
                <span className="banderasMovesComponent-titulo-texto">{part}</span>
                {index < parts.length - 1 ? " " : ""}
            </React.Fragment>
        );
    });
}

function renderItemSubrayado(texto)
{
    const parts = String(texto || "").trim().split(/\s+/).filter(Boolean);

    if(parts.length === 0)
    {
        return null;
    }

    return parts.map(function(part, index)
    {
        const subParts = String(part).split(/([\/"]+)/);

        return (
            <React.Fragment key={`${part}-${index}`}>
                {subParts.map(function(seg, segIndex)
                {
                    if(!seg) return null;

                    const esSinSubrayado = /^[\/"]+$/.test(seg);
                    if(esSinSubrayado)
                    {
                        return (
                            <span key={`${part}-${index}-${segIndex}`} className="banderasMovesComponent-separador">
                                {seg}
                            </span>
                        );
                    }

                    return (
                        <span key={`${part}-${index}-${segIndex}`} className="banderasMovesComponent-underline">
                            {seg}
                        </span>
                    );
                })}
                {index < parts.length - 1 ? " " : ""}
            </React.Fragment>
        );
    });
}

function toBoolValue(v)
{
    return v === true ? true : (v === false ? false : null);
}

export default function BanderasMovimiento({ titulo = "Banderas", groupKey = "", flags = {}, size = "normal", enableAdvancedSearchLink = false })
{
    const navigate = useNavigate();
    const items = useMemo(() =>
    {
        const groupItems = getFlagsByGroupKey(groupKey);
        if(!Array.isArray(groupItems) || groupItems.length === 0) return null;

        const flagMap = (flags && typeof flags === "object") ? flags : {};

        const mapped = groupItems
        .map(function(item)
        {
            const flagValue = toBoolValue(flagMap[item.key]);
            if(flagValue === null) return null;

            return {
                key: item.key,
                title: String(item.title || "").trim(),
                value: flagValue,
                tooltip: flagValue === true ? String(item.tooltipDescTRUE || "").trim() : String(item.tooltipDescFALSE || "").trim()
            };
        })
        .filter(Boolean);

        return mapped.length > 0 ? mapped : null;

    }, [groupKey, flags]);

    const sizeClass = `banderasMovesComponent-container-${size}`;
    const movsAdvancedSearchTabData = getAdvancedSearchTabConfig("movimientos");
    const movsAdvancedSearchDescription = movsAdvancedSearchTabData?.description || "Movimientos";
    const canNavigateToFlags = !!enableAdvancedSearchLink;

    if(!items)
    {
        return null;
    }

    function navigateToFlagFilter(item)
    {
        if(!canNavigateToFlags) return;

        navigate(advancedMovesSearchRouteWithFilters({
            filters: [
                {
                    field: String(item?.key || ""),
                    operator: "eq",
                    value: item?.value === true
                }
            ],
            sort: {
                field: "id",
                direction: "asc"
            }
        }));
    }

    function handleFlagKeyDown(event, item)
    {
        if(!canNavigateToFlags) return;
        if(event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        navigateToFlagFilter(item);
    }

    return (
        <div className={`banderasMovesComponent-container ${sizeClass}`}>

            {/* Titulo del Bloque */}
            <div className="banderasMovesComponent-titulo">
                {renderTituloSubrayado(titulo)}
                <span>:</span>
            </div>

            {/* Render de cada Item */}
            <div className="banderasMovesComponent-lista">
                {items.length > 0 ? (
                    items.map(function(item)
                    {
                        const valorTxt = item.value === true ? "Si" : "No";
                        const hasTooltip = !!item.tooltip;
                        const valueClass = item.value === true ? "banderasMovesComponent-linea--true" : "banderasMovesComponent-linea--false";
                        const flagSearchLabel = "Buscar " + movsAdvancedSearchDescription + " con " + item.title + " = " + valorTxt;

                        return (
                            <div
                                key={item.key}
                                className={
                                    "banderasMovesComponent-item" +
                                    (hasTooltip ? " has-tooltip" : "") +
                                    (canNavigateToFlags ? " banderasMovesComponent-item-clickable" : "")
                                }
                                onClick={canNavigateToFlags ? function() { navigateToFlagFilter(item); } : undefined}
                                role={canNavigateToFlags ? "button" : undefined}
                                tabIndex={canNavigateToFlags ? 0 : undefined}
                                onKeyDown={function(event)
                                {
                                    handleFlagKeyDown(event, item);
                                }}
                                aria-label={canNavigateToFlags ? flagSearchLabel : undefined}
                                title={canNavigateToFlags ? flagSearchLabel : undefined}
                            >
                                
                                {/* Item */}                                
                                <div
                                    className={`banderasMovesComponent-linea ${valueClass}`}
                                    tabIndex={canNavigateToFlags ? -1 : (hasTooltip ? 0 : -1)}
                                    aria-label={canNavigateToFlags ? undefined : `${item.title}: ${valorTxt}`}
                                >
                                    
                                    {/* Titulo (Izquierda) */}
                                    <span className="banderasMovesComponent-nombre">
                                        {renderItemSubrayado(item.title)}
                                        <span>:</span>
                                    </span>
                                    
                                    {/* Valor (Derecha) */}
                                    <span className="banderasMovesComponent-valor">
                                        {valorTxt}
                                    </span>

                                </div>

                                {/* Tooltip */}
                                {hasTooltip && (
                                    <div className="banderasMovesComponent-tooltip" role="tooltip">
                                        {item.tooltip}
                                    </div>
                                )}

                            </div>
                        );
                    })
                ) : null}
            </div>

        </div>
    );

}