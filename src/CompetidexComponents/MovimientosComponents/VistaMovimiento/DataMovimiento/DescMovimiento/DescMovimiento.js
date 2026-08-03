//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\DescMovimiento\DescMovimiento.js

import React, { useMemo } from "react";
import "./DescMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
}

export default function DescMovimiento({ descMov, size = "normal" })
{
  const desc = useMemo(() => toDash(descMov), [descMov]);
  const sizeClass = `descmov-container-${size}`;

  return (
    <div className={`descmov-container ${sizeClass}`}>
      <div className="descmov-text">
        {desc}
      </div>
    </div>
  );

}