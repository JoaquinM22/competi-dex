//** src\CompetidexComponents\SharedComponents\GeneracionPkm\GeneracionPkm.js

import React, { useEffect } from "react";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import { getGenerationMeta } from "../../../utils/competidexMeta";
import "./GeneracionPkm.css";

export default function GeneracionPkm({ generacion, size = "normal", showLabel = true })
{
  const meta = getGenerationMeta(generacion);
  const label = meta?.labelEs;
  const icon = meta?.icon;

  useEffect(() =>
  {
    if(!icon) return;

    preloadCachedImage(icon);

  }, [icon]);

  const sizeClass = `gen-container-${size}`;
  const iconSizeClass = `gen-icon-${size}`;
  const containerClass = `gen-container ${sizeClass}${showLabel ? "" : " gen-container--icon-only"}`;

  return (
    <div className={containerClass}>

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
