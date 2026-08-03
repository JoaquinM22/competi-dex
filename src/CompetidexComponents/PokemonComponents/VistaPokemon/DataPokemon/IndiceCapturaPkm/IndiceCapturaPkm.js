//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\IndiceCapturaPkm\IndiceCapturaPkm.js

import React from "react";
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

export default function IndiceCaptura({ rate, size = "normal" })
{
  const value = (typeof rate === "number" && rate >= 0) ? rate : null;
  const { label, className } = getCaptureTier(value);

  const sizeClass = `captura-contenedor-${size}`;

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
            <span className="captura-valor-num">{value}</span>
            <span className={`captura-tag ${className}`}>
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );

}