//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\PesoYAlturaPkm\PesoYAlturaPkm.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "./PesoYAlturaPkm.css";
import { GiWeight } from "react-icons/gi";
import { CiLineHeight } from "react-icons/ci";
import { advancedPokemonSearchRouteWithFilters } from "../../../../../utils/competidexRoutes";

function hasValue(value)
{
    return value !== null && value !== undefined && value !== "";
}

function formatDisplayNumber(value)
{
    const rawValue = String(value).trim();
    const numericValue = Number(rawValue.replace(",", "."));

    if(!Number.isFinite(numericValue))
    {
        return rawValue;
    }

    return numericValue.toLocaleString("es-AR", {
        maximumFractionDigits: 20
    });
}

function formatMeasureValue(value, unit)
{
    if(!hasValue(value)) return "";

    const normalizedValue = String(value)
        .trim()
        .replace(/kg$/i, "")
        .replace(/m$/i, "")
        .trim();

    if(!normalizedValue) return "";

    return `${formatDisplayNumber(normalizedValue)}${unit}`;
}

function getNumericMeasureValue(value)
{
    if(!hasValue(value)) return null;

    const normalizedValue = String(value)
        .trim()
        .replace(/kg$/i, "")
        .replace(/m$/i, "")
        .replace(",", ".")
        .trim();
    const numericValue = Number(normalizedValue);

    return Number.isFinite(numericValue) ? numericValue : null;
}

export default function PesoYAlturaPkm({ altura, peso, size = "normal", mostrarTexto = true, enableAdvancedSearchLink = false, isGigaForm = false, noBackGroundAlturaGigaPkm = false })
{
    const navigate = useNavigate();

    // Clases dinámicas para el tamaño
    const sizeClass = `info-contenedor-${size}`;
    const containerClassName = `info-contenedor ${sizeClass}${noBackGroundAlturaGigaPkm ? " info-contenedor-noBackground" : ""}`;
    const alturaLabel = formatMeasureValue(altura, "m");
    const alturaDisplayLabel = isGigaForm && alturaLabel ? `Más de ${alturaLabel}` : alturaLabel;
    const pesoLabel = formatMeasureValue(peso, "Kg");
    const alturaValue = getNumericMeasureValue(altura);
    const pesoValue = getNumericMeasureValue(peso);
    const canNavigateToHeight = !!enableAdvancedSearchLink && alturaValue !== null;
    const canNavigateToWeight = !isGigaForm && !!enableAdvancedSearchLink && pesoValue !== null;

    function navigateToAdvancedMeasureFilter(field, value)
    {
        if(!enableAdvancedSearchLink || value === null) return;

        navigate(advancedPokemonSearchRouteWithFilters({
            filters: [
                {
                    field,
                    operator: "eq",
                    value
                }
            ],
            sort: {
                field: "id",
                direction: "asc"
            }
        }));
    }

    function handleHeightClick()
    {
        navigateToAdvancedMeasureFilter("height", alturaValue);
    }

    function handleWeightClick()
    {
        navigateToAdvancedMeasureFilter("weight", pesoValue);
    }

    function renderMeasureAction({ canNavigate, label, onClick, children })
    {
        return (
            <span
                className={"info-measureAction" + (canNavigate ? " info-measureAction-clickable" : "")}
                onClick={canNavigate ? onClick : undefined}
                role={canNavigate ? "button" : undefined}
                tabIndex={canNavigate ? 0 : undefined}
                onKeyDown={function(event)
                {
                    if(!canNavigate) return;
                    if(event.key !== "Enter" && event.key !== " ") return;

                    event.preventDefault();
                    onClick();
                }}
                aria-label={canNavigate ? label : undefined}
                title={canNavigate ? label : undefined}
            >
                {children}
            </span>
        );
    }

    return (
        <div className={containerClassName}>
            
            {/* Altura (solo si hay valor) */}
            {alturaLabel && (
                <div className="info-item">
                    {/* Si mostrarTexto es true, muestra "Altura: X"; si no, solo el valor */}
                    {mostrarTexto && (
                        <span className="info-nombre">
                            <span className="info-label-word">Altura</span>:
                        </span>
                    )}

                    {renderMeasureAction({
                        canNavigate: canNavigateToHeight,
                        label: `Buscar Pokémon con Altura: ${alturaDisplayLabel}`,
                        onClick: handleHeightClick,
                        children: (
                            <>
                                <span className="info-nombre">
                                    {alturaDisplayLabel}
                                </span>
                                <CiLineHeight className="info-icon" />
                            </>
                        )
                    })}
                </div>
            )}

            {/* Peso (solo si hay valor) */}
            {!isGigaForm && pesoLabel && (
                <div className="info-item">
                    {/* Si mostrarTexto es true, muestra "Peso: X"; si no, solo el valor */}
                    {mostrarTexto && (
                        <span className="info-nombre">
                            <span className="info-label-word">Peso</span>:
                        </span>
                    )}

                    {renderMeasureAction({
                        canNavigate: canNavigateToWeight,
                        label: `Buscar Pokémon con Peso: ${pesoLabel}`,
                        onClick: handleWeightClick,
                        children: (
                            <>
                                <span className="info-nombre">
                                    {pesoLabel}
                                </span>
                                <GiWeight className="info-icon" />
                            </>
                        )
                    })}
                </div>
            )}
            
        </div>
    );

}