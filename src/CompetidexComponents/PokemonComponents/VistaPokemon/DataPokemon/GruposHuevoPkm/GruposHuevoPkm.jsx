//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\GruposHuevoPkm\GruposHuevoPkm.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { advancedPokemonSearchRouteWithFilters } from "../../../../../utils/competidexRoutes";
import "./GruposHuevoPkm.css";

export default function GruposHuevoPkm({ gruposHuevo = [], size = "normal", enableAdvancedSearchLink = false })
{
    const navigate = useNavigate();

    const items = useMemo(() =>
    {
        return (Array.isArray(gruposHuevo) ? gruposHuevo : [])
        .map(function(item)
        {
            return {
                apiKey: String(item?.apiKey || "").trim().toLowerCase(),
                labelES: String(item?.labelES || "").trim()
            };
        })
        .filter(function(item)
        {
            return !!item.labelES;
        });

    }, [gruposHuevo]);

    const sizeClass = `gruposHuevoPkmComponent-container-${size}`;

    function handleAdvancedSearchClick(eggGroupKey)
    {
        const normalizedEggGroupKey = String(eggGroupKey || "").trim().toLowerCase();
        if(!enableAdvancedSearchLink || !normalizedEggGroupKey) return;

        navigate(advancedPokemonSearchRouteWithFilters({
            filters: [
                {
                    field: "eggGroups",
                    operator: "contains",
                    value: normalizedEggGroupKey
                }
            ],
            sort: {
                field: "id",
                direction: "asc"
            }
        }));
    }

    function renderEggGroupLabel(item)
    {
        const canNavigateToAdvancedSearch = !!enableAdvancedSearchLink && !!item.apiKey;
        const labelClassName = "gruposHuevoPkmComponent-label" + (canNavigateToAdvancedSearch ? " gruposHuevoPkmComponent-label-clickable" : "");

        return (
            <span
                className={labelClassName}
                onClick={canNavigateToAdvancedSearch ? () => handleAdvancedSearchClick(item.apiKey) : undefined}
                role={canNavigateToAdvancedSearch ? "button" : undefined}
                tabIndex={canNavigateToAdvancedSearch ? 0 : undefined}
                onKeyDown={function(event)
                {
                    if(!canNavigateToAdvancedSearch) return;
                    if(event.key !== "Enter" && event.key !== " ") return;

                    event.preventDefault();
                    handleAdvancedSearchClick(item.apiKey);
                }}
                aria-label={canNavigateToAdvancedSearch ? `Buscar Pokémon del Grupo Huevo: ${item.labelES}` : undefined}
                title={canNavigateToAdvancedSearch ? `Buscar Pokémon del Grupo Huevo: ${item.labelES}` : undefined}
            >
                {item.labelES}
            </span>
        );
    }

    return (
        <div className={`gruposHuevoPkmComponent-container ${sizeClass}`}>
            
            {/* Titulo */}
            <div className="gruposHuevoPkmComponent-title">
                <span className="gruposHuevoPkmComponent-title-text">
                    {items.length > 1 ? "Grupos" : "Grupo"}
                </span>{" "}
                <span className="gruposHuevoPkmComponent-title-text">Huevo</span>
                <span>:</span>
            </div>

            {/* Valor/Valores */}
            <div className="gruposHuevoPkmComponent-lista">
                {items.length > 0 ? (
                    items.map(function(item, i)
                    {
                        return (
                            <div key={`${item.apiKey || item.labelES || i}`} className="gruposHuevoPkmComponent-item">
                                {renderEggGroupLabel(item)}
                            </div>
                        );
                    })
                ) : (
                    <div className="gruposHuevoPkmComponent-item">Ninguno</div>
                )}
            </div>

        </div>
    );

}