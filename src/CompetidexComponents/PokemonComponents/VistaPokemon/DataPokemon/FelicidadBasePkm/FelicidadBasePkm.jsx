//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\FelicidadBasePkm\FelicidadBasePkm.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { advancedPokemonSearchRouteWithFilters } from "../../../../../utils/competidexRoutes";
import "./FelicidadBasePkm.css";

export default function FelicidadBasePkm({ felicidadBase = null, size = "normal", enableAdvancedSearchLink = false })
{
    const navigate = useNavigate();
    const displayValue = typeof felicidadBase === "number" && Number.isFinite(felicidadBase) ? felicidadBase : "-";
    const sizeClass = `felicidadBasePkmComponent-${size}`;
    const canNavigateToAdvancedSearch = !!enableAdvancedSearchLink && typeof displayValue === "number";

    function handleAdvancedSearchClick()
    {
        if(!canNavigateToAdvancedSearch) return;

        navigate(advancedPokemonSearchRouteWithFilters({
            filters: [
                {
                    field: "baseHappiness",
                    operator: "eq",
                    value: displayValue
                }
            ],
            sort: {
                field: "id",
                direction: "asc"
            }
        }));
    }

    return (
        <div className={`felicidadBasePkmComponent ${sizeClass}`}>
            <span className="felicidadBasePkmComponent-label" aria-label="Felicidad Base">
                <span className="felicidadBasePkmComponent-label-word">Felicidad</span>{" "}
                <span className="felicidadBasePkmComponent-label-word">Base</span>:
            </span>
            <span
                className={"felicidadBasePkmComponent-value" + (canNavigateToAdvancedSearch ? " felicidadBasePkmComponent-value-clickable" : "")}
                onClick={canNavigateToAdvancedSearch ? handleAdvancedSearchClick : undefined}
                role={canNavigateToAdvancedSearch ? "button" : undefined}
                tabIndex={canNavigateToAdvancedSearch ? 0 : undefined}
                onKeyDown={function(event)
                {
                    if(!canNavigateToAdvancedSearch) return;
                    if(event.key !== "Enter" && event.key !== " ") return;

                    event.preventDefault();
                    handleAdvancedSearchClick();
                }}
                aria-label={canNavigateToAdvancedSearch ? `Buscar Pokémon con: Felicidad Base = ${displayValue}` : undefined}
                title={canNavigateToAdvancedSearch ? `Buscar Pokémon con: Felicidad Base = ${displayValue}` : undefined}
            >
                {displayValue}
            </span>
        </div>
    );
}
