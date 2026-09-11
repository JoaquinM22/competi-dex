//** src\CompetidexComponents\SharedComponents\GeneracionPkm\GeneracionPkm.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import { getGenerationMeta } from "../../../utils/competidexMeta";
import {
  advancedSearchRouteWithFiltersByTab,
  getAdvancedSearchTabConfig
} from "../../../utils/competidexRoutes";
import "./GeneracionPkm.css";

export default function GeneracionPkm({
  generacion,
  size = "normal",
  showLabel = true,
  enableAdvancedSearchLink = false,
  advancedSearchTabKey = "pokemon",
  backgroundColor
})
{
  const navigate = useNavigate();
  const meta = getGenerationMeta(generacion);
  const label = meta?.labelEs;
  const icon = meta?.icon;
  const generationKey = String(generacion || "").trim();
  const advancedSearchTabData = getAdvancedSearchTabConfig(advancedSearchTabKey);
  const advancedSearchTargetDescription = advancedSearchTabData?.description || "Pokémon";
  const canNavigateToAdvancedSearch = !!enableAdvancedSearchLink && !!generationKey;
  const advancedSearchLabel = `Buscar ${advancedSearchTargetDescription} de ${label || generationKey}`;

  useEffect(() =>
  {
    if(!icon) return;

    preloadCachedImage(icon);

  }, [icon]);

  const sizeClass = `gen-container-${size}`;
  const iconSizeClass = `gen-icon-${size}`;
  const containerClass = `gen-container ${sizeClass}${showLabel ? "" : " gen-container--icon-only"}${canNavigateToAdvancedSearch ? " gen-container-clickable" : ""}`;
  const containerStyle = backgroundColor ? { backgroundColor: backgroundColor } : undefined;

  function handleAdvancedSearchClick()
  {
    if(!canNavigateToAdvancedSearch) return;

    navigate(advancedSearchRouteWithFiltersByTab(advancedSearchTabData?.key, {
      filters: [
        {
          field: "generation",
          operator: "eq",
          value: generationKey
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
      className={containerClass}
      style={containerStyle}
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

      {/* Foto de la Generación */}
      {icon ? (
        <img
          src={icon}
          alt={label}
          className={`gen-icon ${iconSizeClass}`}
          title={label}
        />
      ) : null}

      {/* Nombre de la Generación */}
      {showLabel ? (
        <span className="gen-text">
          {label}
        </span>
      ) : null}

    </div>
  );

}