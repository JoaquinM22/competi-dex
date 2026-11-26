//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\PpMovimiento\PpMovimiento.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  advancedMovesSearchRouteWithFilters,
  getAdvancedSearchTabConfig
} from "../../../../../utils/competidexRoutes";
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

function getPpFilterData(value)
{
  if(Number.isFinite(value) && value > 0)
  {
    return {
      operator: "eq",
      value: value
    };
  }

  return {
    operator: "lte",
    value: 0
  };
}

export default function PpMovimiento({ ppMov, size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();
  const base = useMemo(() => toIntOrNull(ppMov), [ppMov]);
  const maxPP = useMemo(() => (base !== null ? calcMaxPP(base) : null), [base]);
  const ppFilterData = useMemo(() => getPpFilterData(base), [base]);
  const movsAdvancedSearchTabData = getAdvancedSearchTabConfig("movimientos");
  const movsAdvancedSearchDescription = movsAdvancedSearchTabData?.description || "Movimientos";
  const canNavigateToPp = !!enableAdvancedSearchLink;

  const sizeClass = `ppmov-container-${size}`;
  const ppSearchLabel = ppFilterData.operator === "eq"
    ? "Buscar " + movsAdvancedSearchDescription + " con PP Base = " + ppFilterData.value
    : "Buscar " + movsAdvancedSearchDescription + " sin PP";

  function handlePpClick()
  {
    if(!canNavigateToPp) return;

    navigate(advancedMovesSearchRouteWithFilters({
      filters: [
        {
          field: "pp",
          operator: ppFilterData.operator,
          value: ppFilterData.value
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handlePpKeyDown(event)
  {
    if(!canNavigateToPp) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handlePpClick();
  }

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
          <span
            className={"ppmov-valueAction" + (canNavigateToPp ? " ppmov-valueAction-clickable" : "")}
            onClick={canNavigateToPp ? handlePpClick : undefined}
            role={canNavigateToPp ? "button" : undefined}
            tabIndex={canNavigateToPp ? 0 : undefined}
            onKeyDown={handlePpKeyDown}
            aria-label={canNavigateToPp ? ppSearchLabel : undefined}
            title={canNavigateToPp ? ppSearchLabel : undefined}
          >
            {base !== null ? (
              <span>
                {base}{" "}
                <span>
                  ({maxPP !== null ? maxPP : "-"})
                </span>
              </span>
            ) : (
              toDash(ppMov)
            )}
          </span>
        </div>

        {/* Toolip */}
        <div className="ppmov-tooltip" role="tooltip">
          Puntos de Poder: Cantidad de veces que se puede usar el movimiento.
        </div>

      </div>
    </div>
  );

}