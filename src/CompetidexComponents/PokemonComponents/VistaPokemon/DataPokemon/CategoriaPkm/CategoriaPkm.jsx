//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\CategoriaPkm\CategoriaPkm.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { advancedPokemonSearchRouteWithFilters } from "../../../../../utils/competidexRoutes";
import "./CategoriaPkm.css";

function renderCategoriaValue(displayValue)
{
    const text = String(displayValue || "").trim();
    if(!text) return "-";

    const pokemonPrefixMatch = text.match(/^Pokémon\s+(.+)$/i);
    if(pokemonPrefixMatch)
    {
        const suffix = pokemonPrefixMatch[1].trim();

        if(!suffix)
        {
            return "Pokémon";
        }

        return (
            <>
                <span>Pokémon</span>
                <span className="categoriaPkmComponent-valor-highlight">{suffix}</span>
            </>
        );
    }

    const pokemonSuffixMatch = text.match(/^(.+?)\s+Pok[eé]mon$/i);
    if(pokemonSuffixMatch)
    {
        const prefix = pokemonSuffixMatch[1].trim();

        if(!prefix)
        {
            return "Pokémon";
        }

        return (
            <>
                <span className="categoriaPkmComponent-valor-highlight">{prefix}</span>
                <span>Pokémon</span>
            </>
        );
    }

    return text;
}

export default function CategoriaPkm({ categoriaPkm, size = "normal", enableAdvancedSearchLink = false })
{
    const navigate = useNavigate();
    const value = (typeof categoriaPkm === "string" && categoriaPkm.trim() !== "")
        ? categoriaPkm.trim()
        : null;
    const displayValue = value || "-";
    const showTooltip = displayValue === "-";
    const canNavigateToAdvancedSearch = enableAdvancedSearchLink && !!value;

    const sizeClass = `categoriaPkmComponent-contenedor-${size}`;
    const valueClassName = "categoriaPkmComponent-valor" + (canNavigateToAdvancedSearch ? " categoriaPkmComponent-valorClickable" : "");

    function handleAdvancedSearchClick()
    {
        if(!canNavigateToAdvancedSearch) return;

        navigate(advancedPokemonSearchRouteWithFilters({
            filters: [
                {
                    field: "categoryPkm",
                    operator: "eq",
                    value: value
                }
            ],
            sort: {
                field: "id",
                direction: "asc"
            }
        }));
    }

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
                        className={valueClassName}
                        onClick={canNavigateToAdvancedSearch ? handleAdvancedSearchClick : undefined}
                        role={canNavigateToAdvancedSearch ? "button" : undefined}
                        tabIndex={canNavigateToAdvancedSearch ? 0 : (showTooltip ? 0 : -1)}
                        onKeyDown={function(event)
                        {
                            if(!canNavigateToAdvancedSearch) return;
                            if(event.key !== "Enter" && event.key !== " ") return;

                            event.preventDefault();
                            handleAdvancedSearchClick();
                        }}
                        aria-label={`Categoría ${displayValue}`}
                        title={canNavigateToAdvancedSearch ? `Buscar Pokémon de Categoría: ${displayValue}` : undefined}
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