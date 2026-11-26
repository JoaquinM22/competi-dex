//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\PrecioItem\PrecioItem.js

import React, { useEffect, useMemo, useState } from "react";
import {
    POKE_DOLLAR_IMG,
    getGroupVersionLabelEs,
    getGroupVersionOrder,
    isGroupVersionEnabled
} from "../../../../../utils/competidexMeta";
import "./PrecioItem.css";

function normalizePriceValue(v)
{
    if(v === null || v === undefined) return null;

    const n = Number(v);
    if(!isFinite(n) || n <= 0) return null;

    return Math.floor(n);
}

function formatMiles(v)
{
    if(v === null || v === undefined || v === "-") return "-";

    const n = Number(v);
    if(!isFinite(n)) return "-";

    return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function normalizePrecioEntry(entry)
{
    if(!entry || typeof entry !== "object") return null;

    const versionJuego = String(entry.versionJuego || "").trim().toLowerCase();
    if(!versionJuego) return null;
    if(!isGroupVersionEnabled(versionJuego)) return null;

    const precioCompra = normalizePriceValue(entry.precioItem);
    const precioVenta = normalizePriceValue(entry.precioVentaItem);

    if(precioCompra === null && precioVenta === null) return null;

    return {
        versionJuego,
        versionLabel: getGroupVersionLabelEs(versionJuego),
        versionOrder: Number(getGroupVersionOrder(versionJuego) || 0),
        precioItem: precioCompra,
        precioVentaItem: precioVenta
    };
}

export default function PrecioItem({ preciosItem, size = "normal" })
{
    const preciosNormalizados = useMemo(() =>
    {
        const raw = Array.isArray(preciosItem) ? preciosItem : [];
        const out = [];

        for(let i = 0; i < raw.length; i++)
        {
            const normalized = normalizePrecioEntry(raw[i]);
            if(normalized) out.push(normalized);
        }

        out.sort((a, b) =>
        {
            if(b.versionOrder !== a.versionOrder)
            {
                return b.versionOrder - a.versionOrder;
            }

            return String(a.versionLabel || "").localeCompare(String(b.versionLabel || ""));
        });

        return out;

    }, [preciosItem]);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() =>
    {
        setActiveIndex(0);

    }, [preciosNormalizados.length]);

    useEffect(() =>
    {
        if(activeIndex >= preciosNormalizados.length)
        {
            setActiveIndex(0);
        }

    }, [activeIndex, preciosNormalizados.length]);

    const total = preciosNormalizados.length;
    const canNavigate = total > 1;
    const activePrecio = total ? preciosNormalizados[Math.min(activeIndex, total - 1)] : null;
    const precioPrincipal = activePrecio
        ? (activePrecio.precioItem !== null ? activePrecio.precioItem : activePrecio.precioVentaItem)
        : null;
    const ventaPrincipal = activePrecio ? activePrecio.precioVentaItem : null;
    const precioFormateado = useMemo(() => formatMiles(precioPrincipal), [precioPrincipal]);
    const ventaFormateada = useMemo(() => formatMiles(ventaPrincipal), [ventaPrincipal]);
    const sizeClass = "precioitem-container-" + size;
    const dollarIconUrl = POKE_DOLLAR_IMG;
    const precioTooltipText = precioFormateado !== "-" ? `Precio de Compra en la Tienda: ${precioFormateado} Pokédólares` : "No hay datos disponibles";
    const ventaTooltipText = ventaFormateada !== "-" ? `Precio de Venta en la Tienda: ${ventaFormateada} Pokédólares` : "No hay datos disponibles";

    const goPrev = () =>
    {
        if(!canNavigate) return;
        setActiveIndex((prev) => (prev - 1 + total) % total);
    };

    const goNext = () =>
    {
        if(!canNavigate) return;
        setActiveIndex((prev) => (prev + 1) % total);
    };

    return (
        <div className={"precioitem-container " + sizeClass}>

            {/* Carrusel de Precios de Compra y Venta */}
            <div className="precioitem-carousel">
                
                {/* Boton anterior */}
                <button
                    className={`precioitem-arrow precioitem-arrow-left ${canNavigate ? "" : "disabled"}`}
                    type="button"
                    onClick={goPrev}
                    aria-label="Ver precio anterior"
                    title="Ver precio anterior"
                    disabled={!canNavigate}
                >
                    ‹
                </button>

                <div className="precioitem-card" tabIndex={0} aria-label="Precio del objeto por juego">
                    
                    {/* Precio de Compra en la Tienda */}
                    <div
                        className="precioitem-row precioitem-has-tooltip"
                    >

                        {/* Titulo */}
                        <div className="precioitem-label">
                            <span className="precioitem-underline">Compra</span>
                            <span>:</span>
                        </div>

                        {/* Valor */}
                        <div className="precioitem-value">
                            {precioFormateado !== "-" ? (
                                <span className="precioitem-valueWrap">
                                    <span
                                        className="precioitem-icon"
                                        aria-hidden="true"
                                        style={{
                                            WebkitMaskImage: 'url("' + dollarIconUrl + '")',
                                            maskImage: 'url("' + dollarIconUrl + '")'
                                        }}
                                    />
                                    <span className="precioitem-number">{precioFormateado}</span>
                                </span>
                            ) : (
                                "-"
                            )}
                        </div>

                        {/* Tooltip */}
                        <div className="precioitem-tooltip" role="tooltip">
                            {precioTooltipText}
                        </div>

                    </div>

                    {/* Precio de Venta en la Tienda */}
                    <div
                        className="precioitem-row precioitem-sale-row precioitem-has-tooltip"
                    >
                        {/* Titulo */}
                        <div className="precioitem-label">
                            <span className="precioitem-underline">Venta</span>
                            <span>:</span>
                        </div>

                        {/* Valor */}
                        <div className="precioitem-value">
                            {ventaFormateada !== "-" ? (
                                <span className="precioitem-valueWrap">
                                    <span
                                        className="precioitem-icon"
                                        aria-hidden="true"
                                        style={{
                                            WebkitMaskImage: 'url("' + dollarIconUrl + '")',
                                            maskImage: 'url("' + dollarIconUrl + '")'
                                        }}
                                    />
                                    <span className="precioitem-number">{ventaFormateada}</span>
                                </span>
                            ) : (
                                "-"
                            )}
                        </div>

                        {/* Tooltip */}
                        <div className="precioitem-tooltip" role="tooltip">
                            {ventaTooltipText}
                        </div>

                    </div>

                    {/* Juego/Variante */}
                    <div className="precioitem-meta">

                        {/* Titulo */}
                        <div className="precioitem-subtitle">Juego / Variante</div>

                        {/* Valor + Contador */}
                        <div className="precioitem-versionRow">
                            
                            {/* Nombre Version */}
                            <div className="precioitem-version">
                                {activePrecio ? activePrecio.versionLabel : "-"}
                            </div>

                            {/* Posicion/Total */}
                            {total > 1 && (
                                <div className="precioitem-counter">
                                    {activeIndex + 1}/{total}
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* Boton siguiente */}
                <button
                    className={`precioitem-arrow precioitem-arrow-right ${canNavigate ? "" : "disabled"}`}
                    type="button"
                    onClick={goNext}
                    aria-label="Ver precio siguiente"
                    title="Ver precio siguiente"
                    disabled={!canNavigate}
                >
                    ›
                </button>

            </div>
        </div>
    );

}