//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\CategoriaItem\CategoriaItem.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryItemLabelEs } from "../../../../../utils/competidexMeta";
import { advancedItemsSearchRouteWithFilters, getAdvancedSearchTabConfig } from "../../../../../utils/competidexRoutes";
import "./CategoriaItem.css";

export default function CategoriaItem({ categoriaItem, size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();

  const categoria = useMemo(function()
  {
    return getCategoryItemLabelEs(categoriaItem);

  }, [categoriaItem]);

  const itemsAdvancedSearchTabData = getAdvancedSearchTabConfig("objetos");
  const itemsAdvancedSearchDescription = itemsAdvancedSearchTabData?.description || "Objetos";

  const sizeClass = "categoriaitem-container-" + size;
  const sinCategoria = (categoria === "-");
  const categoryValue = String(categoriaItem || "").trim();
  const canNavigateToCategory = !!enableAdvancedSearchLink && !!categoryValue && !sinCategoria;

  function navigateToAdvancedCategoryFilter()
  {
    if(!canNavigateToCategory) return;

    navigate(advancedItemsSearchRouteWithFilters({
      filters: [
        {
          field: "category",
          operator: "eq",
          value: categoryValue
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handleCategoryKeyDown(event)
  {
    if(!canNavigateToCategory) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    navigateToAdvancedCategoryFilter();
  }

  return (
    <div className={"categoriaitem-container " + sizeClass}>
      <div
        className={
          "categoriaitem-row categoriaitem-has-tooltip" +
          (canNavigateToCategory ? " categoriaitem-row-clickable" : "")
        }
        onClick={canNavigateToCategory ? navigateToAdvancedCategoryFilter : undefined}
        role={canNavigateToCategory ? "button" : undefined}
        tabIndex={canNavigateToCategory ? 0 : 0}
        onKeyDown={handleCategoryKeyDown}
        aria-label={
          canNavigateToCategory
            ? `Buscar ${itemsAdvancedSearchDescription} de Categoría: ${categoria}`
            : (sinCategoria ? "El objeto no posee categoría" : "Categoría del objeto")
        }
        title={canNavigateToCategory ? `Buscar ${itemsAdvancedSearchDescription} de Categoría: ${categoria}` : undefined}
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