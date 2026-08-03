//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\DescItem\DescItem.js

import React, { useMemo } from "react";
import "./DescItem.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
}

export default function DescItem({ descItem, size = "normal" })
{
  const desc = useMemo(() => toDash(descItem), [descItem]);
  const sizeClass = `descitem-container-${size}`;

  return (
    <div className={`descitem-container ${sizeClass}`}>
      <div className="descitem-text">
        {desc}
      </div>
    </div>
  );

}