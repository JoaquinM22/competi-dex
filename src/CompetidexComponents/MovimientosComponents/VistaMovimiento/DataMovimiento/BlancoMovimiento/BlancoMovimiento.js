//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\BlancoMovimiento\BlancoMovimiento.js

import React, { useMemo } from "react";
import { getMoveTargetMeta } from "../../../../../utils/competidexMeta";
import "./BlancoMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
}

function cleanText(v)
{
  const s0 = toDash(v);
  if (s0 === "-") return "-";

  const meta = getMoveTargetMeta(s0);
  if (meta?.labelEs) return meta.labelEs;

  const s = String(s0).replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function BlancoMovimiento({ blancoMov, size = "normal" })
{
  const txt = useMemo(() => cleanText(blancoMov), [blancoMov]);
  const sizeClass = `blmov-container-${size}`;

  return (
    <div className={`blmov-container ${sizeClass}`}>
      <div
        className="blmov-row has-tooltip"
        tabIndex={0}
        aria-label="Indica a quién afecta el movimiento (objetivo)."
      >
        <div className="blmov-label">
          <span className="blmov-underline">Blanco</span>
          <span>:</span>
        </div>

        <div className="blmov-value">
          {txt}
        </div>

        <div className="blmov-tooltip" role="tooltip">
          Indica a quién afecta el movimiento (objetivo).
        </div>
      </div>
    </div>
  );
  
}