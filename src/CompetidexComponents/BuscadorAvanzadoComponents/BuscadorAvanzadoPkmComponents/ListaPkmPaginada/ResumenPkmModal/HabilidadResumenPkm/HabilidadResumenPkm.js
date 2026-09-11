//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoPkmComponents\ListaPkmPaginada\ResumenPkmModal\HabilidadResumenPkm\HabilidadResumenPkm.js

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { abilityRoute } from "../../../../../../utils/competidexRoutes";
import { useAbilities } from "../../../../../HabilidadesComponents/AbilitiesProvider";
import "./HabilidadResumenPkm.css";

function renderTituloSubrayado(texto)
{
  const parts = String(texto || "").trim().split(/\s+/).filter(Boolean);

  if(parts.length === 0)
  {
    return null;
  }

  return parts.map(function(part, index)
  {
    return (
      <React.Fragment key={`${part}-${index}`}>
        <span className="habilidadesResumenPkmComponent-tituloTexto">{part}</span>
        {index < parts.length - 1 ? " " : ""}
      </React.Fragment>
    );
  });
}

function normalizeSlot(slot)
{
  const value = Number(slot);
  return [1, 2, 3].includes(value) ? value : null;
}

function buildTitle(slot, total)
{
  if(slot === 1)
  {
    return total === 1 ? "Habilidad Principal" : "Habilidades Principales";
  }

  if(slot === 2)
  {
    return total === 1 ? "Habilidad Secundaria" : "Habilidades Secundarias";
  }

  if(slot === 3)
  {
    return total === 1 ? "Habilidad Oculta" : "Habilidades Ocultas";
  }

  return total === 1 ? "Habilidad" : "Habilidades";
}

export default function HabilidadResumenPkm({ habilidades = [], size = "normal", slot = 1 })
{
  const { translateAbilitiesByKeys } = useAbilities();
  const navigate = useNavigate();
  const slotNormalizado = normalizeSlot(slot);
  const [items, setItems] = useState([]);

  const sizeClass = `habilidadesResumenPkmComponent-${size}`;

  const habilidadesFiltradas = useMemo(() =>
  {
    const lista = Array.isArray(habilidades) ? habilidades : [];

    return lista
      .filter(function(h)
      {
        if(!slotNormalizado) return true;
        return Number(h?.slot) === slotNormalizado;
      })
      .map(function(h)
      {
        const apiName = String(h?.name || h?.apiName || h?.ability?.name || "").trim().toLowerCase();
        if(!apiName) return null;

        return {
          apiName: apiName,
          slot: Number(h?.slot) || slotNormalizado || 0
        };
      })
      .filter(Boolean);

  }, [habilidades, slotNormalizado]);

  useEffect(() =>
  {
    let alive = true;

    async function loadAbilities()
    {
      if(!habilidadesFiltradas.length)
      {
        setItems([]);
        return;
      }

      try
      {
        const translated = await translateAbilitiesByKeys(habilidadesFiltradas.map(function(h) { return h.apiName; }));
        if(!alive) return;

        const byKey = new Map(
          Array.isArray(translated)
            ? translated.map(function(item)
            {
              return [String(item?.apiName || "").trim().toLowerCase(), item];
            })
            : []
        );

        const ordered = habilidadesFiltradas.map(function(h)
        {
          const item = byKey.get(h.apiName);

          return {
            apiName: h.apiName,
            display: String(item?.display || h.apiName).trim(),
            descHab: String(item?.descHab || "").trim()
          };
        });

        setItems(ordered);

      }catch(e)
      {
        if(!alive) return;

        setItems(
          habilidadesFiltradas.map(function(h)
          {
            return {
              apiName: h.apiName,
              display: h.apiName,
              descHab: ""
            };
          })
        );
      }
    }

    loadAbilities();

    return function()
    {
      alive = false;
    };

  }, [habilidadesFiltradas, translateAbilitiesByKeys]);

  const titulo = buildTitle(slotNormalizado, items.length);

  const goToAbility = useCallback(function(item)
  {
    const apiKey = String(item?.apiName || "").trim().toLowerCase();
    if(!apiKey) return;

    navigate(abilityRoute(encodeURIComponent(apiKey)));

  }, [navigate]);

  return (
    <div className={`habilidadesResumenPkmComponent ${sizeClass}`}>

      {/* Titulo */}
      <div className="habilidadesResumenPkmComponent-titulo">
        {renderTituloSubrayado(titulo)}
        <span>:</span>
      </div>

      {/* Lista de Habilidades */}
      <div className="habilidadesResumenPkmComponent-lista">
        {items.length > 0 ? (
          items.map(function(h, i)
          {
            const canNavigate = !!String(h?.apiName || "").trim();

            return (
              <div
                key={`${h.apiName}-${i}`}
                className={`habilidadesResumenPkmComponent-item ${h.descHab ? "has-tooltip" : ""}`}
              >
                <button
                  type="button"
                  className="habilidadesResumenPkmComponent-link"
                  onClick={() => goToAbility(h)}
                  onKeyDown={(e) =>
                  {
                    if(e.key === "Enter" || e.key === " ")
                    {
                      e.preventDefault();
                      goToAbility(h);
                    }
                  }}
                  aria-label={canNavigate ? `Ver Pokémon que aprenden: ${h.display}` : undefined}
                  title={canNavigate ? `Ver Pokémon que aprenden: ${h.display}` : undefined}
                  disabled={!canNavigate}
                >
                  {h.display}
                </button>

                {h.descHab && (
                  <div className="habilidadesResumenPkmComponent-tooltip" role="tooltip">
                    {h.descHab}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="habilidadesResumenPkmComponent-item">Ninguna</div>
        )}
      </div>

    </div>
  );

}