//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\BlancoMovimiento\BlancoMovimiento.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMoveTargetMeta } from "../../../../../utils/competidexMeta";
import {
  advancedMovesSearchRouteWithFilters,
  getAdvancedSearchTabConfig
} from "../../../../../utils/competidexRoutes";
import "./BlancoMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
}

function cleanText(v)
{
  const s0 = toDash(v);
  if (s0 === "-") return "-";

  const meta = getMoveTargetMeta(s0);
  if (meta?.labelEs) return meta.labelEs;

  const s = String(s0).replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function BlancoMovimiento({ blancoMov, size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();
  const txt = useMemo(() => cleanText(blancoMov), [blancoMov]);
  const blancoMovKey = useMemo(() => {
    if(blancoMov === null || blancoMov === undefined) return "";

    return String(blancoMov).trim();
  }, [blancoMov]);
  const movsAdvancedSearchTabData = getAdvancedSearchTabConfig("movimientos");
  const movsAdvancedSearchDescription = movsAdvancedSearchTabData?.description || "Movimientos";
  const canNavigateToBlancoMov = !!enableAdvancedSearchLink && !!blancoMovKey;
  const sizeClass = `blmov-container-${size}`;
  const blancoMovSearchLabel = "Buscar " + movsAdvancedSearchDescription + " con Blanco = " + txt;

  function handleBlancoMovClick()
  {
    if(!canNavigateToBlancoMov) return;

    navigate(advancedMovesSearchRouteWithFilters({
      filters: [
        {
          field: "blancoMov",
          operator: "eq",
          value: blancoMovKey
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handleBlancoMovKeyDown(event)
  {
    if(!canNavigateToBlancoMov) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handleBlancoMovClick();
  }

  return (
    <div className={`blmov-container ${sizeClass}`}>
      <div
        className="blmov-row has-tooltip"
        tabIndex={0}
        aria-label="Indica a quién afecta el movimiento (objetivo)."
      >
        <div className="blmov-label">
          <span className="blmov-underline">Blanco</span>
          <span>:</span>
        </div>

        <div className="blmov-value">
          <span
            className={"blmov-valueAction" + (canNavigateToBlancoMov ? " blmov-valueAction-clickable" : "")}
            onClick={canNavigateToBlancoMov ? handleBlancoMovClick : undefined}
            role={canNavigateToBlancoMov ? "button" : undefined}
            tabIndex={canNavigateToBlancoMov ? 0 : undefined}
            onKeyDown={handleBlancoMovKeyDown}
            aria-label={canNavigateToBlancoMov ? blancoMovSearchLabel : undefined}
            title={canNavigateToBlancoMov ? blancoMovSearchLabel : undefined}
          >
            {txt}
          </span>
        </div>

        <div className="blmov-tooltip" role="tooltip">
          Indica a quién afecta el movimiento (objetivo).
        </div>
      </div>
    </div>
  );
  
}