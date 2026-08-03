//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\NombreMovimiento\NombreMovimiento.js

import React from "react";
import { getTypeMeta } from "../../../../../utils/competidexMeta";
import "./NombreMovimiento.css";

export default function NombreMovimiento({ id, nombre, tipos, tipo })
{
  const nombreBase = (nombre || "").trim() || "Movimiento";

  const arrTipos = Array.isArray(tipos) ? tipos : (tipo ? [tipo] : []);
  const t0 = (arrTipos[0] || "").trim();
  const t1 = (arrTipos[1] || "").trim();

  const meta0 = getTypeMeta(t0);
  const meta1 = t1 ? getTypeMeta(t1) : null;

  const color1 = meta0?.color || getTypeMeta("unknown")?.color || "#68A090";
  const color2 = t1 ? (meta1?.color || color1) : color1;

  const estiloFondo = {
    background: (t1 ? ("linear-gradient(90deg, " + color1 + " 45%, " + color2 + " 55%)") : color1)
  };

  return (
    <div className="contenedorID-NombreMov">

      {/* ID Movimiento */}
      <div className="idMov">
        <h3>#{(id !== null && id !== undefined) ? id : "—"}</h3>
      </div>

      {/* Nombre Movimiento */}
      <div className="nombreMovCard" style={estiloFondo} title={nombreBase}>
        {nombreBase}
      </div>

    </div>
  );

}