//** src\CompetidexComponents\HabilidadesComponents\VistaHabilidad\DataHabilidad\NombreHabilidad\NombreHabilidad.js

import React, { useEffect, useState } from "react";
import GeneracionPkm from "../../../../SharedComponents/GeneracionPkm/GeneracionPkm";
import "./NombreHabilidad.css";

export default function NombreHabilidad({ id, nombre, gen })
{
  const nombreBase = (nombre || "").trim() || "Habilidad";
  const genBase = (gen !== undefined && gen !== null) ? gen : "";
  const [showGenLabel, setShowGenLabel] = useState(true);

  useEffect(() =>
  {
    const updateShowGenLabel = () =>
    {
      setShowGenLabel(window.innerWidth > 750);
    };

    updateShowGenLabel();
    window.addEventListener("resize", updateShowGenLabel);

    return () =>
    {
      window.removeEventListener("resize", updateShowGenLabel);
    };
  }, []);

  return (
    <div className="contenedorID-NombreHab">
      
      {/* ID de la Habilidad */}
      <div className="idHab">
        <h3>#{(id !== null && id !== undefined) ? id : "-"}</h3>
      </div>

      {/* Nombre Habilidad */}
      <div className="nombreHabCard" title={nombreBase}>
        {nombreBase}
      </div>

      {/* Imagen Gen Habilidad */}
      <div className="idGen_HabPkm">
        <GeneracionPkm
          generacion={genBase}
          size="normal"
          showLabel={showGenLabel}
        />
      </div>

    </div>
  );
}