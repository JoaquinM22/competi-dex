//** src\CompetidexComponents\SharedComponents\Tipo\Tipo.js

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import { getTypeMeta } from "../../../utils/competidexMeta";
import "./Tipo.css";

export default function Tipo({ tipo, size = "normal" })
{
  const meta = getTypeMeta(tipo);
  const label = meta?.labelEs;
  const color = meta?.color;
  const icon = meta?.icon || null;

  useEffect(() =>
  {
    if(!icon) return;

    preloadCachedImage(icon);

  }, [icon]);

  // Se genera la clase dinámica en función del tamaño
  const sizeClass = `tipo-boton-${size}`;

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
      <span className="tipo-nombre">{label}</span>

    </div>
  );

}