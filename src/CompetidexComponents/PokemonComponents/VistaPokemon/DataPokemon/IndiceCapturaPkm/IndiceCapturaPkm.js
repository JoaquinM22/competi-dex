//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\IndiceCapturaPkm\IndiceCapturaPkm.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { advancedPokemonSearchRouteWithFilters } from "../../../../../utils/competidexRoutes";
import "./IndiceCapturaPkm.css";

// Clasificación por tramos
function getCaptureTier(rate)
{
  if(rate == null || isNaN(rate))
  {
    return { label: "Desconocido", className: "tier-unknown" };
  }

  if (rate >= 200) return { label: "Muy fácil", className: "tier-very-easy" };
  if (rate >= 150) return { label: "Fácil", className: "tier-easy" };
  if (rate >= 100) return { label: "Normal", className: "tier-normal" };
  if (rate >= 60) return { label: "Algo difícil", className: "tier-bit-hard" };
  if (rate >= 30) return { label: "Difícil", className: "tier-hard" };
  
  return { label: "Muy difícil", className: "tier-very-hard" };
}

export default function IndiceCaptura({ rate, size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();
  const value = (typeof rate === "number" && rate >= 0) ? rate : null;
  const { label, className } = getCaptureTier(value);
  const sizeClass = `captura-contenedor-${size}`;
  const canNavigateToAdvancedSearch = !!enableAdvancedSearchLink && value !== null;

  function handleAdvancedSearchClick()
  {
    if(!canNavigateToAdvancedSearch) return;

    navigate(advancedPokemonSearchRouteWithFilters({
      filters: [
        {
          field: "captureRate",
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

  return (
    <div className={`captura-contenedor ${sizeClass}`}>
      <div className="captura-row">
        <span className="captura-label" aria-label="Índice de captura">
          <span className="captura-label-word">Índice</span>{" "}
          <span className="captura-label-word">de</span>{" "}
          <span className="captura-label-word">captura</span>:
        </span>

        {value == null ? (
          <span className="captura-valor captura-desconocido">
            {label}
          </span>
        ) : (
          <div className="captura-right">
            <span
              className={"captura-valor-num" + (canNavigateToAdvancedSearch ? " captura-valor-num-clickable" : "")}
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
              aria-label={canNavigateToAdvancedSearch ? `Buscar Pokémon con: Índice de Captura ${value}` : undefined}
              title={canNavigateToAdvancedSearch ? `Buscar Pokémon con: Índice de Captura ${value}` : undefined}
            >
              {value}
            </span>
            <span className={`captura-tag ${className}`}>
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );

}