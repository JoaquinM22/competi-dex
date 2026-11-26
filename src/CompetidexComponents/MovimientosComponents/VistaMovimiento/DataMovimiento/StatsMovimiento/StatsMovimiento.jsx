//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\StatsMovimiento\StatsMovimiento.js

import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMoveClassMeta } from "../../../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../../../utils/competidexImgCache";
import {
  advancedMovesSearchRouteWithFilters,
  getAdvancedSearchTabConfig
} from "../../../../../utils/competidexRoutes";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import "./StatsMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  if (typeof v === "number" && v < 0) return "-";

  const s = String(v).trim();
  return s === "" ? "-" : s;
}

function getPositiveNumberFilterData(value)
{
  const numericValue = Number(value);

  if(Number.isFinite(numericValue) && numericValue > 0)
  {
    return {
      operator: "eq",
      value: numericValue
    };
  }

  return {
    operator: "lte",
    value: 0
  };
}

export default function StatsMovimiento({
  claseMov,
  potenciaMov,
  precisionMov,
  size = "normal",
  tipoMov,
  enableAdvancedSearchClassMovLink = false,
  enableAdvancedSearchTypeLink = false,
  enableAdvancedSearchPowerMovLink = false,
  enableAdvancedSearchAccurancyMovLink = false
})
{
  const navigate = useNavigate();
  const metaClase = useMemo(() => getMoveClassMeta(claseMov), [claseMov]);
  const clase = metaClase?.labelEs;
  const icon = metaClase?.icon;
  const moveClassKey = String(claseMov || "").trim();
  const movsAdvancedSearchTabData = getAdvancedSearchTabConfig("movimientos");
  const movsAdvancedSearchDescription = movsAdvancedSearchTabData?.description || "Movimientos";
  const canNavigateToMoveClass = !!enableAdvancedSearchClassMovLink && !!moveClassKey && String(metaClase?.apiKey || "") === moveClassKey;
  const powerFilterData = getPositiveNumberFilterData(potenciaMov);
  const accuracyFilterData = getPositiveNumberFilterData(precisionMov);
  const canNavigateToPower = !!enableAdvancedSearchPowerMovLink;
  const canNavigateToAccuracy = !!enableAdvancedSearchAccurancyMovLink;

  useEffect(() =>
  {
    if(!icon) return;

    preloadCachedImage(icon);

  }, [icon]);

  const sizeClass = `statsmov-container-${size}`;
  const iconSizeClass = `statsmov-icon-${size}`;
  const moveClassSearchLabel = `Buscar ${movsAdvancedSearchDescription} de Clase: ${clase || moveClassKey}`;

  function handleMoveClassClick()
  {
    if(!canNavigateToMoveClass) return;

    navigate(advancedMovesSearchRouteWithFilters({
      filters: [
        {
          field: "damage_class",
          operator: "eq",
          value: moveClassKey
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handleMoveClassKeyDown(event)
  {
    if(!canNavigateToMoveClass) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handleMoveClassClick();
  }

  function navigateToAdvancedNumberFilter(field, filterData)
  {
    navigate(advancedMovesSearchRouteWithFilters({
      filters: [
        {
          field,
          operator: filterData.operator,
          value: filterData.value
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handlePowerClick()
  {
    if(!canNavigateToPower) return;

    navigateToAdvancedNumberFilter("power", powerFilterData);
  }

  function handleAccuracyClick()
  {
    if(!canNavigateToAccuracy) return;

    navigateToAdvancedNumberFilter("accuracy", accuracyFilterData);
  }

  function handleNumberKeyDown(event, canNavigate, onClick)
  {
    if(!canNavigate) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onClick();
  }

  function renderStatValueAction({ canNavigate, label, onClick, children })
  {
    return (
      <span
        className={"statsmov-valueAction" + (canNavigate ? " statsmov-valueAction-clickable" : "")}
        onClick={canNavigate ? onClick : undefined}
        role={canNavigate ? "button" : undefined}
        tabIndex={canNavigate ? 0 : undefined}
        onKeyDown={function(event)
        {
          handleNumberKeyDown(event, canNavigate, onClick);
        }}
        aria-label={canNavigate ? label : undefined}
        title={canNavigate ? label : undefined}
      >
        {children}
      </span>
    );
  }

  return (
    <div className={`statsmov-container ${sizeClass}`}>
      
      {/* Imagen Clase del Mov (Especial, Estado o Físico) */}
      <div className="statsmov-top">
        <div
          className={"statsmov-iconwrap" + (canNavigateToMoveClass ? " statsmov-iconwrap-clickable" : "")}
          onClick={canNavigateToMoveClass ? handleMoveClassClick : undefined}
          role={canNavigateToMoveClass ? "button" : undefined}
          tabIndex={canNavigateToMoveClass ? 0 : undefined}
          onKeyDown={handleMoveClassKeyDown}
          aria-label={canNavigateToMoveClass ? moveClassSearchLabel : undefined}
          title={canNavigateToMoveClass ? moveClassSearchLabel : undefined}
        >
          {icon ? (
            <img
              src={icon}
              alt={"Clase Movimiento: " + clase}
              title={!enableAdvancedSearchClassMovLink ? ("Clase: " + clase) : undefined}
              className={`statsmov-icon ${iconSizeClass}`}
            />
          ) : (
            <div className="statsmov-icon-placeholder">—</div>
          )}
        </div>
      </div>

      {/* Tipo del Mov (Fuego, Agua, etc) */}
      <div className="statsmov-typeRow">
        <Tipo
          tipo={tipoMov || "Ninguno"}
          size="large"
          enableAdvancedSearchLink={enableAdvancedSearchTypeLink}
          advancedSearchTabKey="movimientos"
        />
      </div>

      {/* Potencia y Precisión del Mov */}
      <div className="statsmov-grid">

        {/* Potencia */}
        <div className="statsmov-row">
          <div><span className="statsmov-label statsmov-label--underline">Potencia</span>:</div>
          <div className="statsmov-value">
            {renderStatValueAction({
              canNavigate: canNavigateToPower,
              label: powerFilterData.operator === "eq"
                ? "Buscar " + movsAdvancedSearchDescription + " con Potencia = " + powerFilterData.value
                : "Buscar " + movsAdvancedSearchDescription + " sin Potencia",
              onClick: handlePowerClick,
              children: toDash(potenciaMov)
            })}
          </div>
        </div>

        {/* Precisión */}
        <div className="statsmov-row">
          <div><span className="statsmov-label statsmov-label--underline">Precisión</span>:</div>
          <div className="statsmov-value">
            {renderStatValueAction({
              canNavigate: canNavigateToAccuracy,
              label: accuracyFilterData.operator === "eq"
                ? "Buscar " + movsAdvancedSearchDescription + " con Precisión = " + accuracyFilterData.value
                : "Buscar " + movsAdvancedSearchDescription + " sin Precisión",
              onClick: handleAccuracyClick,
              children: toDash(precisionMov)
            })}
          </div>
        </div>

      </div>

    </div>
  );

}