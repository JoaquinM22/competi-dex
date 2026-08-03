//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\CategoriaItem\CategoriaItem.js

import React, { useMemo } from "react";
import { getCategoryItemLabelEs } from "../../../../../utils/competidexMeta";
import "./CategoriaItem.css";

export default function CategoriaItem({ categoriaItem, size = "normal" })
{
  const categoria = useMemo(function()
  {
    return getCategoryItemLabelEs(categoriaItem);

  }, [categoriaItem]);

  const sizeClass = "categoriaitem-container-" + size;
  const sinCategoria = (categoria === "-");

  return (
    <div className={"categoriaitem-container " + sizeClass}>
      <div
        className="categoriaitem-row categoriaitem-has-tooltip"
        tabIndex={0}
        aria-label={sinCategoria ? "El objeto no posee categoría" : "Categoría del objeto"}
      >
        <div className="categoriaitem-label">
          <span className="categoriaitem-underline">Categoría</span>
          <span>:</span>
        </div>

        <div className="categoriaitem-value">
          {categoria}
        </div>

        <div className="categoriaitem-tooltip" role="tooltip">
          {sinCategoria ? "El objeto no posee categoría" : "Categoría del objeto"}
        </div>
      </div>
    </div>
  );
  
}