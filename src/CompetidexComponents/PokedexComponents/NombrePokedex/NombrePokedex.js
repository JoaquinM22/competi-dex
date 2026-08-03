//** src\CompetidexComponents\PokedexComponents\NombrePokedex\NombrePokedex.js

import React, { useEffect, useState } from "react";
import "./NombrePokedex.css";
import GeneracionPkm from "../../SharedComponents/GeneracionPkm/GeneracionPkm";

export default function NombrePokedex({ nombre, gen })
{
  const nombreBase = (nombre || "").trim() || "Pokedex";
  const genBase = (gen !== undefined && gen !== null) ? String(gen).trim() : "";
  const [showGenLabel, setShowGenLabel] = useState(() =>
  {
    if (typeof window === "undefined") return true;
    return (window.innerWidth || 0) > 480;
  });

  // Si no hay gen => No se muestra nada
  const noGen = !genBase;

  useEffect(() =>
  {
    function handleResize()
    {
      if (typeof window === "undefined") return;
      setShowGenLabel((window.innerWidth || 0) > 480);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);

  const classNameRoot = "contenedorNombrePokedex_Gen" + (noGen ? " contenedorNombrePokedex_Gen--noGen" : "");

  return (
    <div className={classNameRoot}>

      {/* Nombre Pokedex */}
      <div className="nombrePokedex_GenCard" title={nombreBase}>
        {nombreBase}
      </div>

      {/* Nombre Generacion (Solo si tiene) */}
      {genBase ? (
        <div className="idGen_Pokedex">
          <GeneracionPkm
            generacion={genBase}
            size="normal"
            showLabel={showGenLabel}
          />
        </div>
      ) : null}

    </div>
  );
}