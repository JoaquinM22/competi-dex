//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\CriticoMovimiento\CriticoMovimiento.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  advancedMovesSearchRouteWithFilters,
  getAdvancedSearchTabConfig
} from "../../../../../utils/competidexRoutes";
import "./CriticoMovimiento.css";

function toIntOrNull(v)
{
  if(v === null || v === undefined) return null;
  if(typeof v === "number") return isFinite(v) ? Math.floor(v) : null;

  const t = String(v).trim();
  if(!t) return null;

  const n = Number(t);
  return isFinite(n) ? Math.floor(n) : null;
}

function clamp(n, min, max)
{
  if(!isFinite(n)) return min;
  if(n < min) return min;
  if(n > max) return max;
  return n;
}

const CRIT_META_BY_STAGE =
{
  0: { pct: 4, label: "+0" },
  1: { pct: 12.5, label: "+1" },
  2: { pct: 50, label: "+2" },
  3: { pct: 100, label: "+3" },
  4: { pct: 100, label: "+3" }
};

function critPctGen7Plus(stage)
{
  const s = clamp(stage, 0, 4);
  return CRIT_META_BY_STAGE[s]?.pct ?? 100;
}

function critLabelGen7Plus(stage)
{
  if(stage >= 3) return "+" + stage;

  const s = clamp(stage, 0, 3);
  return CRIT_META_BY_STAGE[s]?.label ?? "+0";
}

function fmtPct(p)
{
  if(p === null || p === undefined) return "-";
  if(!isFinite(p)) return "-";

  const needs3 = Math.abs(p - 4.167) < 0.0006;
  let s = needs3 ? p.toFixed(3) : (Math.round(p * 10) / 10).toString();

  if(s.indexOf(".") !== -1)
  {
    s = s.replace(/\.0$/, "");
  }

  s = s.replace(".", ",");

  return s + "%";
}

function getCriticalIndexFilterValue(value)
{
  if(value === null) return "null";
  if(value >= 3) return 3;

  return value;
}

export default function CriticoMovimiento({ indice = null, size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();
  const base = useMemo(() => toIntOrNull(indice), [indice]);
  const pct = useMemo(() => (base !== null ? critPctGen7Plus(base) : null), [base]);
  const critLabel = useMemo(() => (base !== null ? critLabelGen7Plus(base) : "-"), [base]);
  const criticalIndexFilterValue = getCriticalIndexFilterValue(base);
  const movsAdvancedSearchTabData = getAdvancedSearchTabConfig("movimientos");
  const movsAdvancedSearchDescription = movsAdvancedSearchTabData?.description || "Movimientos";
  const canNavigateToCriticalIndex = !!enableAdvancedSearchLink;

  const sizeClass = `critmov-container-${size}`;
  const tooltipText = base !== null ? `Índice: ${critLabel}` : "No posee índice";
  const criticalIndexSearchLabel = base !== null
    ? "Buscar " + movsAdvancedSearchDescription + " con Índice de Crítico = " + fmtPct(pct)
    : "Buscar " + movsAdvancedSearchDescription + " sin Índice de Crítico";

  function handleCriticalIndexClick()
  {
    if(!canNavigateToCriticalIndex) return;

    navigate(advancedMovesSearchRouteWithFilters({
      filters: [
        {
          field: "indiceCritico",
          operator: "eq",
          value: criticalIndexFilterValue
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handleCriticalIndexKeyDown(event)
  {
    if(!canNavigateToCriticalIndex) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handleCriticalIndexClick();
  }

  return (
    <div className={`critmov-container ${sizeClass}`}>
      <div
        className="critmov-row has-tooltip"
        tabIndex={0}
        aria-label={tooltipText}
      >

        {/* Titulo */}
        <div className="critmov-label">
          <span className="critmov-underline">Índice</span>
          <span> </span>
          <span className="critmov-underline">de</span>
          <span> </span>
          <span className="critmov-underline">Crítico</span>
          <span>:</span>
        </div>

        {/* Valor */}
        <div className="critmov-value">
          <span
            className={"critmov-valueAction" + (canNavigateToCriticalIndex ? " critmov-valueAction-clickable" : "")}
            onClick={canNavigateToCriticalIndex ? handleCriticalIndexClick : undefined}
            role={canNavigateToCriticalIndex ? "button" : undefined}
            tabIndex={canNavigateToCriticalIndex ? 0 : undefined}
            onKeyDown={handleCriticalIndexKeyDown}
            aria-label={canNavigateToCriticalIndex ? criticalIndexSearchLabel : undefined}
            title={canNavigateToCriticalIndex ? criticalIndexSearchLabel : undefined}
          >
            {
              (pct !== null) ?
              (
                <span className="critmov-pct">{fmtPct(pct)}</span>
              ) :
              (
                "-"
              )
            }
          </span>
        </div>

        {/* Tooltip */}
        <div className="critmov-tooltip" role="tooltip">
          {tooltipText}
        </div>

      </div>
    </div>
  );

}