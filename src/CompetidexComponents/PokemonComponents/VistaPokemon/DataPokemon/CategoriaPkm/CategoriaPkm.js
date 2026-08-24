//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\CategoriaPkm\CategoriaPkm.js

import React from "react";
import "./CategoriaPkm.css";

function renderCategoriaValue(displayValue)
{
    const text = String(displayValue || "").trim();
    if(!text) return "-";

    const match = text.match(/^Pokémon\s+(.+)$/i);
    if(!match)
    {
        return text;
    }

    const suffix = match[1].trim();
    if(!suffix)
    {
        return "Pokémon";
    }

    return (
        <>
            <span>Pokémon </span>
            <span className="categoriaPkmComponent-valor-highlight">{suffix}</span>
        </>
    );
}

export default function CategoriaPkm({ categoriaPkm, size = "normal" })
{
    const value = (typeof categoriaPkm === "string" && categoriaPkm.trim() !== "")
        ? categoriaPkm.trim()
        : null;
    const displayValue = value || "-";
    const showTooltip = displayValue === "-";

    const sizeClass = `categoriaPkmComponent-contenedor-${size}`;

    return (
        <div className={`categoriaPkmComponent-contenedor ${sizeClass}`}>
            <div className="categoriaPkmComponent-row">
                
                {/* Titulo */}
                <span className="categoriaPkmComponent-label" aria-label="Categoría">
                    <span className="categoriaPkmComponent-label-word">Categoría</span>:
                </span>

                <span className={`categoriaPkmComponent-valorWrap ${showTooltip ? "has-tooltip" : ""}`}>
                    
                    {/* Valor */}
                    <span
                        className="categoriaPkmComponent-valor"
                        tabIndex={showTooltip ? 0 : -1}
                        aria-label={`Categoría ${displayValue}`}
                    >
                        {renderCategoriaValue(displayValue)}
                    </span>

                    {/* Tooltip */}
                    {showTooltip && (
                        <span className="categoriaPkmComponent-tooltip" role="tooltip">
                            El Pokémon no posee Categoría
                        </span>
                    )}

                </span>

            </div>
        </div>
    );

}