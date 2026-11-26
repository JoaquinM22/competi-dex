//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\PrioridadMovimiento\PrioridadMovimiento.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  advancedMovesSearchRouteWithFilters,
  getAdvancedSearchTabConfig
} from "../../../../../utils/competidexRoutes";
import "./PrioridadMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  if (typeof v === "number" && !isFinite(v)) return "-";
  const s = String(v).trim();

  return s === "" ? "-" : s;
}

function toIntOrNull(v)
{
  if (v === null || v === undefined) return null;

  if(typeof v === "number")
  {
    return isFinite(v) ? Math.trunc(v) : null;
  }

  const t = String(v).trim();
  if (!t) return null;

  const n = Number(t);

  return isFinite(n) ? Math.trunc(n) : null;
}

function formatSigned(n)
{
  if (n === null || n === undefined) return "-";
  if (!isFinite(n)) return "-";
  if (n > 0) return "+" + n;

  return String(n); // 0 o negativos ya vienen con signo
}

export default function PrioridadMovimiento({ prioridadMov, size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();
  const pri = useMemo(() => toIntOrNull(prioridadMov), [prioridadMov]);
  const movsAdvancedSearchTabData = getAdvancedSearchTabConfig("movimientos");
  const movsAdvancedSearchDescription = movsAdvancedSearchTabData?.description || "Movimientos";
  const canNavigateToPriority = !!enableAdvancedSearchLink && pri !== null;
  const sizeClass = `primov-container-${size}`;
  const prioritySearchLabel = "Buscar " + movsAdvancedSearchDescription + " con Prioridad = " + pri;

  function handlePriorityClick()
  {
    if(!canNavigateToPriority) return;

    navigate(advancedMovesSearchRouteWithFilters({
      filters: [
        {
          field: "priorityLevel",
          operator: "eq",
          value: pri
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handlePriorityKeyDown(event)
  {
    if(!canNavigateToPriority) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handlePriorityClick();
  }

  return (
    <div className={`primov-container ${sizeClass}`}>
      <div
        className="primov-row has-tooltip"
        tabIndex={0}
        aria-label="Modifica el orden de turno. Valores mayores actúan antes."
      >
        {/* Titulo */}
        <div className="primov-label">
          <span className="primov-underline">Prioridad</span>
          <span>:</span>
        </div>

        {/* Valor */}
        <div className="primov-value">
          <span
            className={"primov-valueAction" + (canNavigateToPriority ? " primov-valueAction-clickable" : "")}
            onClick={canNavigateToPriority ? handlePriorityClick : undefined}
            role={canNavigateToPriority ? "button" : undefined}
            tabIndex={canNavigateToPriority ? 0 : undefined}
            onKeyDown={handlePriorityKeyDown}
            aria-label={canNavigateToPriority ? prioritySearchLabel : undefined}
            title={canNavigateToPriority ? prioritySearchLabel : undefined}
          >
            {pri !== null ? formatSigned(pri) : toDash(prioridadMov)}
          </span>
        </div>

        {/* Tooltip */}
        <div className="primov-tooltip" role="tooltip">
          Modifica el orden de turno. Valores mayores actúan antes.
        </div>

      </div>
    </div>
  );

}