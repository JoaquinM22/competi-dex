//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\AtributosItem\AtributosItem.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { getAttributeItemLabelEs } from "../../../../../utils/competidexMeta";
import { advancedItemsSearchRouteWithFilters, getAdvancedSearchTabConfig } from "../../../../../utils/competidexRoutes";
import "./AtributosItem.css";

export default function AtributosItem({ atributos = [], size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();

  const raw = Array.isArray(atributos) ? atributos : [];
  const items = raw
  .map(function(attribute)
  {
    const key = String(attribute || "").trim();

    return {
      key: key,
      labelEs: getAttributeItemLabelEs(key)
    };
  })
  .filter(function(attribute)
  {
    return String(attribute?.key || "").trim() !== "";
  });

  const itemsAdvancedSearchTabData = getAdvancedSearchTabConfig("objetos");
  const itemsAdvancedSearchDescription = itemsAdvancedSearchTabData?.description || "Objetos";

  const sizeClass = "atribitem-container-" + size;
  const noAttributes = (items.length === 0);

  function navigateToAdvancedAttributeFilter(attributeKey)
  {
    const value = String(attributeKey || "").trim();
    if(!enableAdvancedSearchLink || !value) return;

    navigate(advancedItemsSearchRouteWithFilters({
      filters: [
        {
          field: "attributes",
          operator: "contains",
          value: value
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handleAttributeKeyDown(event, attributeKey)
  {
    if(!enableAdvancedSearchLink) return;
    if(event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    navigateToAdvancedAttributeFilter(attributeKey);
  }

  return (
    <div className={"atribitem-container " + sizeClass}>
      <div className="atribitem-titulo">
        <span className="atribitem-titulo-subrayado">Atributos</span>
        <span>:</span>
      </div>

      <div className="atribitem-lista">
        {
          !noAttributes ?
          (

            items.map(function(attr, i)
            {
              const canNavigate = !!enableAdvancedSearchLink && !!String(attr?.key || "").trim();

              return (
                <div
                  key={attr.key || i}
                  className={"atribitem-item" + (canNavigate ? " atribitem-item-clickable" : "")}
                  onClick={canNavigate ? function() { navigateToAdvancedAttributeFilter(attr.key); } : undefined}
                  role={canNavigate ? "button" : undefined}
                  tabIndex={canNavigate ? 0 : undefined}
                  onKeyDown={canNavigate ? function(event) { handleAttributeKeyDown(event, attr.key); } : undefined}
                  aria-label={canNavigate ? `Buscar ${itemsAdvancedSearchDescription} con Atributo: "${attr.labelEs}"` : undefined}
                  title={canNavigate ? `Buscar ${itemsAdvancedSearchDescription} con Atributo: "${attr.labelEs}"` : undefined}
                >
                  {attr.labelEs}
                </div>
              );
            })

          ) : (

            <div
              className="atribitem-item atribitem-has-tooltip"
              tabIndex={0}
              aria-label="El objeto no posee atributos"
            >
              -
              <div className="atribitem-tooltip" role="tooltip">
                El objeto no posee atributos
              </div>
            </div>
            
          )
        }
      </div>
    </div>
  );

}