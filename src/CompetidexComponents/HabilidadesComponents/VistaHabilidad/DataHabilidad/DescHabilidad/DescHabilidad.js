//** src\CompetidexComponents\HabilidadesComponents\VistaHabilidad\DataHabilidad\DescHabilidad\DescHabilidad.js

import React, { useMemo } from "react";
import "./DescHabilidad.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
}

export default function DescHabilidad({ descHab, size = "normal" })
{
  const desc = useMemo(() => toDash(descHab), [descHab]);
  const sizeClass = "deschab-container-" + size;

  return (
    <div className={`deschab-container ${sizeClass}`}>
      <div className="deschab-text">
        {desc}
      </div>
    </div>
  );
  
}