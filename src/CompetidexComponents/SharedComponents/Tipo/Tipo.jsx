//** src\CompetidexComponents\SharedComponents\Tipo\Tipo.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import { getTypeMeta } from "../../../utils/competidexMeta";
import {
  advancedSearchRouteWithFiltersByTab,
  getAdvancedSearchTabConfig
} from "../../../utils/competidexRoutes";
import "./Tipo.css";

export default function Tipo({
  tipo,
  size = "normal",
  enableAdvancedSearchLink = false,
  advancedSearchTabKey = "pokemon"
})
{
  const navigate = useNavigate();
  const meta = getTypeMeta(tipo);
  const label = meta?.labelEs;
  const color = meta?.color;
  const icon = meta?.icon || null;
  const typeKey = String(tipo || "").trim().toLowerCase();
  const advancedSearchTabData = getAdvancedSearchTabConfig(advancedSearchTabKey);
  const advancedSearchTargetDescription = advancedSearchTabData?.description || "Pokémon";
  const advancedSearchTypeField = String(advancedSearchTabData?.typeFilterField || "types");
  const advancedSearchTypeOperator = String(advancedSearchTabData?.typeFilterOperator || "contains");
  const canNavigateToAdvancedSearch = !!enableAdvancedSearchLink && !!typeKey && typeKey !== "ninguno";
  const advancedSearchLabel = `Buscar ${advancedSearchTargetDescription} de Tipo ${label || typeKey}`;

  useEffect(() =>
  {
    if(!icon) return;

    preloadCachedImage(icon);

  }, [icon]);

  // Se genera la clase dinámica en función del tamaño
  const sizeClass = `tipo-boton-${size}`;
  const typeNameClassName = "tipo-nombre" + (canNavigateToAdvancedSearch ? " tipo-nombre-clickable" : "");

  function handleAdvancedSearchClick()
  {
    if(!canNavigateToAdvancedSearch) return;

    navigate(advancedSearchRouteWithFiltersByTab(advancedSearchTabData?.key, {
      filters: [
        {
          field: advancedSearchTypeField,
          operator: advancedSearchTypeOperator,
          value: typeKey
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  return (
    <div 
      className={`${sizeClass} tipo-boton`}
      style={{
        "backgroundColor": color,
        "color": "#ffffff",
        "border": `2px solid ${color}`
      }}
      title={`Tipo ${label}`}
    >
      {/* Icono del Tipo */}
      {icon ? (
        <img src={icon} alt={`${label} icon`} className="tipo-icono" />
      ) : (
        <FiX className="tipo-icono tipo-icono-x" aria-hidden="true" />
      )}

      {/* Nombre del Tipo */}
      <span
        className={typeNameClassName}
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
        aria-label={canNavigateToAdvancedSearch ? advancedSearchLabel : undefined}
        title={canNavigateToAdvancedSearch ? advancedSearchLabel : undefined}
      >
        {label}
      </span>

    </div>
  );

}
