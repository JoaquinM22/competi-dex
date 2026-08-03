//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\StatsMovimiento\StatsMovimiento.js

import React, { useEffect, useMemo } from "react";
import { getMoveClassMeta } from "../../../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../../../utils/competidexImgCache";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import "./StatsMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  if (typeof v === "number" && v < 0) return "-";

  const s = String(v).trim();
  return s === "" ? "-" : s;
}

export default function StatsMovimiento({ claseMov, potenciaMov, precisionMov, size = "normal", tipoMov })
{
  const metaClase = useMemo(() => getMoveClassMeta(claseMov), [claseMov]);
  const clase = metaClase?.labelEs;
  const icon = metaClase?.icon;

  useEffect(() =>
  {
    if(!icon) return;

    preloadCachedImage(icon);

  }, [icon]);

  const sizeClass = `statsmov-container-${size}`;
  const iconSizeClass = `statsmov-icon-${size}`;

  return (
    <div className={`statsmov-container ${sizeClass}`}>
      
      {/* Imagen Clase del Mov (Especial, Estado o Físico) */}
      <div className="statsmov-top">
        <div className="statsmov-iconwrap">
          {icon ? (
            <img
              src={icon}
              alt={"Clase Movimiento: " + clase}
              title={"Clase: " + clase}
              className={`statsmov-icon ${iconSizeClass}`}
            />
          ) : (
            <div className="statsmov-icon-placeholder">—</div>
          )}
        </div>
      </div>

      {/* Tipo del Mov (Fuego, Agua, etc) */}
      <div className="statsmov-typeRow">
        <Tipo tipo={tipoMov || "Ninguno"} size="large" />
      </div>

      {/* Potencia y Precisión del Mov */}
      <div className="statsmov-grid">

        {/* Potencia */}
        <div className="statsmov-row">
          <div><span className="statsmov-label statsmov-label--underline">Potencia</span>:</div>
          <div className="statsmov-value">{toDash(potenciaMov)}</div>
        </div>

        {/* Precisión */}
        <div className="statsmov-row">
          <div><span className="statsmov-label statsmov-label--underline">Precisión</span>:</div>
          <div className="statsmov-value">{toDash(precisionMov)}</div>
        </div>

      </div>

    </div>
  );

}