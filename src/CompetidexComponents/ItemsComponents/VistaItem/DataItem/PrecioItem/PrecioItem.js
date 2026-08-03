//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\PrecioItem\PrecioItem.js

import React, { useMemo } from "react";
import { POKE_DOLLAR_IMG } from "../../../../../utils/competidexMeta";
import "./PrecioItem.css";

function toDash(v)
{
    if (v === null || v === undefined) return "-";
    if (typeof v === "number" && v <= 0) return "-";

    const s = String(v).trim();
    if (s === "") return "-";

    const n = Number(s);
    if (!isFinite(n) || n <= 0) return "-";

    return Math.floor(n);
}

function formatMiles(v)
{
    if (v === null || v === undefined || v === "-") return "-";

    const n = Number(v);
    if (!isFinite(n)) return "-";

    return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function PrecioItem({ precioItem, size = "normal" })
{
    const precio = useMemo(function()
    {
        return toDash(precioItem);

    }, [precioItem]);

    const precioFormateado = useMemo(function()
    {
        return formatMiles(precio);

    }, [precio]);

    const sizeClass = "precioitem-container-" + size;
    const dollarIconUrl = POKE_DOLLAR_IMG;

    return (
        <div className={"precioitem-container " + sizeClass}>
            <div
                className="precioitem-row precioitem-has-tooltip"
                tabIndex={0}
                aria-label="Precio del objeto en Pokédólares"
            >
                {/* Titulo */}
                <div className="precioitem-label">
                    <span className="precioitem-underline">Precio</span>
                    <span>:</span>
                </div>

                {/* Valor */}
                <div className="precioitem-value">
                    {precio !== "-" ? (
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
                {precio !== "-" && (
                    <div className="precioitem-tooltip" role="tooltip">
                        {precioFormateado} Pokédólares
                    </div>
                )}

            </div>
        </div>
    );

}