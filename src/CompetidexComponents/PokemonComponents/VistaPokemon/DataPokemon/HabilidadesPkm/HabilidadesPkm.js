//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\HabilidadesPkm\HabilidadesPkm.js

import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { abilityRoute } from "../../../../../utils/competidexRoutes";
import "./HabilidadesPkm.css";

export default function HabilidadesPkm({ habilidades = [], isHidden = false, size = "normal" })
{
  const navigate = useNavigate();

  const items = useMemo(() =>
  {
    return (Array.isArray(habilidades) ? habilidades : [])
      .map(function(h)
      {
        if(typeof h === "string")
        {
          return {
            apiName: "",
            display: String(h || "").trim(),
            descHab: ""
          };
        }

        return {
          apiName: String(h?.apiName || "").trim().toLowerCase(),
          display: String(h?.display || h?.nombreHab || h?.nombre || h?.name || "").trim(),
          descHab: String(h?.descHab || "").trim()
        };
      })
      .filter(function(h)
      {
        return !!h.display;
      });

  }, [habilidades]);

  const sizeClass = `habilidades-container-${size}`;
  const titulo = isHidden
    ? (items.length === 1 ? "Habilidad Oculta" : "Habilidades Ocultas")
    : (items.length === 1 ? "Habilidad" : "Habilidades");
  const mostrarDosPuntos = isHidden ? items.length > 1 : items.length === 1;

  const goToAbility = useCallback(function(item)
  {
    const apiKey = String(item?.apiName || "").trim().toLowerCase();
    if(!apiKey) return;

    navigate(abilityRoute(encodeURIComponent(apiKey)));

  }, [navigate]);

  return (
    <div className={`habilidades-container ${sizeClass}`}>
      
      {/* Titulo */}
      <div className="habilidades-titulo">
        <span className="titulo-texto">{titulo}</span>
        {mostrarDosPuntos && <span>:</span>}
      </div>

      {/* Lista de Habilidades */}
      <div className="habilidades-lista">
        {items.length > 0 ? (
          items.map(function(h, i)
          {
            return (
              <div
                key={i}
                className={`habilidad-item ${h.descHab ? "has-tooltip" : ""}`}
              >
                <button
                  type="button"
                  className="habilidad-link"
                  onClick={() => goToAbility(h)}
                  onKeyDown={(e) =>
                  {
                    if(e.key === "Enter" || e.key === " ")
                    {
                      e.preventDefault();
                      goToAbility(h);
                    }
                  }}
                  aria-label={`Ver Pokémon que aprenden: ${h.display}`}
                  title={`Ver Pokémon que aprenden: ${h.display}`}
                >
                  {h.display}
                </button>

                {h.descHab && (
                  <div className="habilidad-tooltip" role="tooltip">
                    {h.descHab}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="habilidad-item">Ninguna</div>
        )}
      </div>
      
    </div>
  );
}