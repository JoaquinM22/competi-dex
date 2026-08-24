//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\BanderasMovimiento\BanderasMovimiento.js

import React, { useMemo } from "react";
import { getFlagsByGroupKey } from "../../../../../utils/competidexMeta";
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

export default function BanderasMovimiento({ titulo = "Banderas", groupKey = "", flags = {}, size = "normal" })
{
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

    if(!items)
    {
        return null;
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

                        return (
                            <div
                                key={item.key}
                                className={`banderasMovesComponent-item ${hasTooltip ? "has-tooltip" : ""}`}
                            >
                                
                                {/* Item */}
                                <div
                                    className="banderasMovesComponent-linea"
                                    tabIndex={hasTooltip ? 0 : -1}
                                    aria-label={`${item.title}: ${valorTxt}`}
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