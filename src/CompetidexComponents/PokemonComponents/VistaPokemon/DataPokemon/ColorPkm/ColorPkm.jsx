//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\ColorPkm\ColorPkm.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { getColorLabelEs, getColorColor } from "../../../../../utils/competidexMeta";
import { advancedPokemonSearchRouteWithFilters } from "../../../../../utils/competidexRoutes";
import "./ColorPkm.css";

export default function ColorPkm({ color, size = "normal", enableAdvancedSearchLink = false })
{
    const navigate = useNavigate();
    const colorFondo = getColorColor(color) || null;
    const colorLabel = getColorLabelEs(color) || "Desconocido";
    const normalizedColor = String(color || "").trim().toLowerCase();
    const canNavigateToAdvancedSearch = enableAdvancedSearchLink && !!normalizedColor && !!colorFondo;

    // Si el color es blanco o amarillo, el texto será negro, de lo contrario será blanco
    const colorContorno = (colorFondo === "#FFFFFF" || colorFondo === "#FFD700") ? "#000000" : "#FFFFFF";

    // Definir clase de tamaño basado en la prop `size`
    const sizeClass = `color-pkm-${size}`;
    const sizeBoxClass = `color-box-${size}`;
    const containerClassName = `color-pkm ${sizeClass}`;
    const valueActionClassName = "color-pkm-valueAction" + (canNavigateToAdvancedSearch ? " color-pkm-clickable" : "");

    function handleAdvancedSearchClick()
    {
        if(!canNavigateToAdvancedSearch) return;

        navigate(advancedPokemonSearchRouteWithFilters({
            filters: [
                {
                    field: "color",
                    operator: "eq",
                    value: normalizedColor
                }
            ],
            sort: {
                field: "id",
                direction: "asc"
            }
        }));
    }

    return (
        <div className={containerClassName}>
            <div className="color-pkm-info">
                <span className="color-label" aria-label="Color">
                    <span className="color-label-word">Color</span>:
                </span>
                <span
                    className={valueActionClassName}
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
                    aria-label={canNavigateToAdvancedSearch ? `Buscar Pokémon de Color: ${colorLabel}` : undefined}
                    title={canNavigateToAdvancedSearch ? `Buscar Pokémon de Color: ${colorLabel}` : undefined}
                >
                    <span style={{ color: colorFondo || "#FFFFFF" }}>
                        {colorFondo ? colorLabel : "Desconocido"}
                    </span>

                    {colorFondo && (
                        <span
                            className={`color-box ${sizeBoxClass}`}
                            style={{
                                backgroundColor: colorFondo,
                                border: `2px solid ${colorContorno}`
                            }}
                        ></span>
                    )}
                </span>
            </div>
        </div>
    );
    
}