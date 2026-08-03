//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\CambiosStatsMov\CambiosStatsMov.js

import React from "react";
import { STATS_META, getStatMeta } from "../../../../../utils/competidexMeta";
import "./CambiosStatsMov.css";

function buildRows(statsObj)
{
  const o = statsObj && typeof statsObj === "object" ? statsObj : {};
  const rows = [];

  const orderedKeys = Object.keys(STATS_META)
    .filter((k) => k !== "unknown")
    .sort((a, b) =>
    {
      const oa = STATS_META[a]?.order ?? 999;
      const ob = STATS_META[b]?.order ?? 999;
      return oa - ob;
    });

  for(let i = 0; i < orderedKeys.length; i++)
  {
    const k = orderedKeys[i];
    const item = o[k];
    if (!item) continue;

    const nivel = item.nivel;
    if (typeof nivel !== "number" || !isFinite(nivel) || nivel === 0) continue;

    const efecto = (item.efecto || "").toLowerCase(); // "sube" | "baja"
    const sign = (efecto === "sube") ? "+" : "-";
    const typeClass = (efecto === "sube") ? "up" : "down";
    const meta = getStatMeta(k);

    rows.push({
      statKey: k,
      label: meta?.labelEs,
      icon: meta?.icon,
      valueTxt: sign + Math.abs(nivel),
      typeClass: typeClass,
    });

  }

  return rows;
}

export default function CambiosStatsMov({
  stats = {},
  aplicaA = "objetivo",  // "usuario" | "objetivo"
  target = "",           // texto del target (por ej: "Elegido")
  size = "normal",
})
{
  const rows = buildRows(stats);
  const sizeClass = `cstats-container-${size}`;

  const noData = rows.length === 0;

  return (
    <div className={`cstats-container ${sizeClass}`}>
      <div className="cstats-titulo">
        <span className="titulo-subrayado">Cambios</span>{" "}
        <span className="titulo-subrayado">en</span>{" "}
        <span className="titulo-subrayado">las</span>{" "}
        <span className="titulo-subrayado">estadísticas</span>{" "}
        <span className="titulo-subrayado">del</span>{" "}
        <span className="titulo-subrayado">
          {aplicaA === "usuario" ? "usuario" : "objetivo"}
        </span>
        <span className="titulo-colon">:</span>
      </div>

      <div className="cstats-lista">
        {
          !noData ?
          (
            rows.map((r) => (
              <div key={r.statKey} className="cstats-item">
                <span className="cstats-stat">{r.label}:</span>
                <span className={`cstats-val ${r.typeClass}`}>{r.valueTxt}</span>
              </div>
            ))
          ) :
          (
            <div className="cstats-item is-empty">-</div>
          )
        }
      </div>
    </div>
  );

}