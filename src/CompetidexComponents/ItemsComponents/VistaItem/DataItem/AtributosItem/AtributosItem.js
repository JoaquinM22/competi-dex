//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\AtributosItem\AtributosItem.js

import React from "react";
import "./AtributosItem.css";

export default function AtributosItem({ atributos = [], size = "normal" })
{
  const raw = Array.isArray(atributos) ? atributos : [];

  const items = raw
    .map(function(attr)
    {
      const texto = attr ? String(attr).trim() : "";
      return { nombreAttr: texto };
    })
    .filter(function(x)
    {
      return x.nombreAttr !== "";
    });

  const sizeClass = "atribitem-container-" + size;
  const noAttributes = (items.length === 0);

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
              return (
                <div key={i} className="atribitem-item">
                  {attr.nombreAttr}
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