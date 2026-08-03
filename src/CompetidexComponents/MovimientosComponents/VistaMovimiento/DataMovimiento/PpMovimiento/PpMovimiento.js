//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\PpMovimiento\PpMovimiento.js

import React, { useMemo } from "react";
import "./PpMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  if (typeof v === "number" && v < 0) return "-";
  const s = String(v).trim();

  return s === "" ? "-" : s;
}

function toIntOrNull(v)
{
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return isFinite(v) ? Math.floor(v) : null;

  const t = String(v).trim();
  if (!t) return null;

  // por si viene "5" o "5.0"
  const n = Number(t);

  return isFinite(n) ? Math.floor(n) : null;
}

// Máximo con "Más PP" (hasta 3): 160% del base
// Ejemplo: 5 -> 8 ; 10 -> 16  => floor(base*1.6)
function calcMaxPP(basePP)
{
  if (basePP === null || basePP === undefined) return null;
  if (!isFinite(basePP) || basePP <= 0) return null;

  return Math.floor(basePP * 1.6);
}

export default function PpMovimiento({ ppMov, size = "normal" })
{
  const base = useMemo(() => toIntOrNull(ppMov), [ppMov]);
  const maxPP = useMemo(() => (base !== null ? calcMaxPP(base) : null), [base]);

  const sizeClass = `ppmov-container-${size}`;

  return (
    <div className={`ppmov-container ${sizeClass}`}>
      <div className="ppmov-row has-tooltip" tabIndex={0} aria-label="Puntos de Poder: Cantidad de veces que se puede usar el movimiento.">
        
        {/* Titulo */}
        <div className="ppmov-label">
          <span className="ppmov-underline">PP</span>
          <span>:</span>
        </div>

        {/* Valor */}
        <div className="ppmov-value">
          {base !== null ? (
            <span>
              {base}{" "}
              <span className="ppmov-max">
                ({maxPP !== null ? maxPP : "-"})
              </span>
            </span>
          ) : (
            toDash(ppMov)
          )}
        </div>

        {/* Toolip */}
        <div className="ppmov-tooltip" role="tooltip">
          Puntos de Poder: Cantidad de veces que se puede usar el movimiento.
        </div>

      </div>
    </div>
  );

}