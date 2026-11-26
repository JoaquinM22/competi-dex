//** src\CompetidexComponents\SharedComponents\BooleanoPkm\BooleanoPkm.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { advancedPokemonSearchRouteWithFilters } from "../../../utils/competidexRoutes";
import "./BooleanoPkm.css";

const BOOLEAN_ADVANCED_SEARCH_FIELDS = new Set([
    "puedeCriar",
    "isBabyPkm",
    "isMythicalPkm",
    "isLegendaryPkm",
    "hasMegaForms",
    "hasGigaForm"
]);

const BOOLEAN_ADVANCED_SEARCH_TITLE_BY_FIELD = {
    puedeCriar: {
        true: "Buscar Pokémon que Pueden Criar",
        false: "Buscar Pokémon que No Pueden Criar"
    },
    isBabyPkm: {
        true: "Buscar Pokémon Bebé",
        false: "Buscar Pokémon que No son Bebé"
    },
    isMythicalPkm: {
        true: "Buscar Pokémon Míticos/Singulares",
        false: "Buscar Pokémon que no son Míticos/Singulares"
    },
    isLegendaryPkm: {
        true: "Buscar Pokémon Legendarios",
        false: "Buscar Pokémon que no son Legendarios"
    },
    hasMegaForms: {
        true: "Buscar Pokémon que poseen Mega Evoluciones",
        false: "Buscar Pokémon que no poseen Mega Evoluciones"
    },
    hasGigaForm: {
        true: "Buscar Pokémon que poseen Gigamax",
        false: "Buscar Pokémon que no poseen Gigamax"
    }
};

function normalizeBooleanValue(v)
{
    if(v === true) return "Si";
    if(v === false) return "No";

    return "-";
}

function renderLabelSubrayado(texto)
{
    const parts = String(texto || "").match(/[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+|[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+/g) || [];

    if(!parts.length)
    {
        return null;
    }

    return parts.map(function(part, index)
    {
        const isWord = /[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]/.test(part);

        return (
            <React.Fragment key={`${part}-${index}`}>
                {isWord ? (
                    <span className="booleanoPkmComponent-underline">{part}</span>
                ) : (
                    part
                )}
            </React.Fragment>
        );
    });

}

export default function BooleanoPkm({   
    value = null,
    label = "",
    size = "normal",
    trueTooltip = "",
    falseTooltip = "",
    enableAdvancedSearchLink = false,
    advancedSearchFilterKey = ""
})
{
    const navigate = useNavigate();
    const txt = useMemo(() => normalizeBooleanValue(value), [value]);
    const sizeClass = `booleanoPkmComponent-${size}`;
    const tooltip = value === true ? String(trueTooltip || "").trim() : value === false ? String(falseTooltip || "").trim() : "";
    const filterField = String(advancedSearchFilterKey || "").trim();
    const isValidAdvancedSearchField = BOOLEAN_ADVANCED_SEARCH_FIELDS.has(filterField);
    const canNavigateToAdvancedSearch = enableAdvancedSearchLink === true && isValidAdvancedSearchField && typeof value === "boolean";
    const advancedSearchTitle = canNavigateToAdvancedSearch
        ? BOOLEAN_ADVANCED_SEARCH_TITLE_BY_FIELD[filterField]?.[String(value)]
        : undefined;

    function handleAdvancedSearchNavigation()
    {
        if(!canNavigateToAdvancedSearch) return;

        navigate(advancedPokemonSearchRouteWithFilters({
            filters: [
                {
                    field: filterField,
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
        <div className={`booleanoPkmComponent ${sizeClass}`}>
            <div
                className={`booleanoPkmComponent-row ${tooltip ? "has-tooltip" : ""} ${value === true ? "is-true" : ""}`}
                tabIndex={tooltip ? 0 : undefined}
                aria-label={tooltip || label || "Valor booleano"}
            >

                {/* Titulo */}
                <div className="booleanoPkmComponent-label">
                    {renderLabelSubrayado(label)}
                    <span>:</span>
                </div>

                {/* Valor */}
                <div className="booleanoPkmComponent-valueWrap">
                    <button
                        type="button"
                        className={"booleanoPkmComponent-value" + (canNavigateToAdvancedSearch ? " booleanoPkmComponent-value-clickable" : "")}
                        onClick={handleAdvancedSearchNavigation}
                        disabled={!canNavigateToAdvancedSearch}
                        title={advancedSearchTitle}
                        aria-label={advancedSearchTitle}
                    >
                        {txt}
                    </button>
                </div>

                {/* Tooltip */}
                {tooltip && (
                    <div className="booleanoPkmComponent-tooltip" role="tooltip">
                        {tooltip}
                    </div>
                )}

            </div>
        </div>
    );

}