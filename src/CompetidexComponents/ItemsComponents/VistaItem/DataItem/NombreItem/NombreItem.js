//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\NombreItem\NombreItem.js

import React from "react";
import "./NombreItem.css";

export default function NombreItem({ id, nombre })
{
  const nombreBase = (nombre || "").trim() || "Objeto";

  return (
    <div className="contenedorID-NombreItem">

      {/* ID Objeto */}
      <div className="idItem">
        <h3>#{(id !== null && id !== undefined) ? id : "—"}</h3>
      </div>

      {/* Nobre Objeto */}
      <div className="nombreItemCard" title={nombreBase}>
        {nombreBase}
      </div>

    </div>
  );
}