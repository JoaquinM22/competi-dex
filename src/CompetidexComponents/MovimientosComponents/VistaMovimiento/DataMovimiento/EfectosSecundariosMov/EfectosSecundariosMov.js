//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\EfectosSecundariosMov\EfectosSecundariosMov.js

import React from "react";
import "./EfectosSecundariosMov.css";

function countSubeffects(e)
{
  if (!e) return 0;

  const d = e.detalle || {};

  // Caso principal: stat_changes trae N cambios
  if (Array.isArray(d.stat_changes) && d.stat_changes.length > 0)
  {
    return d.stat_changes.length;
  }

  if (Array.isArray(d.effects) && d.effects.length > 0) return d.effects.length;
  if (Array.isArray(d.ailments) && d.ailments.length > 0) return d.ailments.length;

  // Para el resto (ailment único, flinch, heal, drain, etc.)
  // si hay texto, contamos 1 efecto
  if (e.texto) return 1;

  return 0;
}

export default function EfectosSecundariosMov({ efectos = [], size = "normal" })
{
  const raw = Array.isArray(efectos) ? efectos : [];

  const items = raw
    .map((e) =>
    {

      const texto = (e && e.texto) ? String(e.texto).trim() : "";
      
      return { nombreEf: texto };

    })
    .filter((x) => x.nombreEf !== "");

  // Cantidad real de efectos (sumando sub-efectos)
  let totalEffects = 0;
  for(let i = 0; i < raw.length; i++)
  {
    totalEffects += countSubeffects(raw[i]);
  }

  // plural si hay más de 1 efecto real
  const plural = totalEffects > 1;
  const sizeClass = `efectosmov-container-${size}`;

  const noEffects = (items.length === 0);

  return (
    <div className={`efectosmov-container ${sizeClass}`}>
      <div className="efectosmov-titulo">
        <span className="titulo-subrayado">{plural ? "Efectos" : "Efecto"}</span>
        <span className="titulo-sep"> </span>
        <span className="titulo-subrayado">{plural ? "secundarios" : "secundario"}</span>
        <span>:</span>
      </div>

      <div className="efectosmov-lista">
        {items.length > 0 ? (

          items.map((e, i) => (
            <div key={i} className="efectomov-item">
              {e.nombreEf}
            </div>
          ))

        ) : (

          <div
            className="efectomov-item has-tooltip"
            tabIndex={0}
            aria-label="No posee efectos secundarios"
          >
            -
            <div className="efectomov-tooltip" role="tooltip">
              No posee efectos secundarios
            </div>
          </div>
          
        )}
      </div>
    </div>
  );

}