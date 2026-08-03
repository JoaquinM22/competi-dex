//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\TablaEstadisticasPkm\TablaEstadisticasPkm.js

import React from "react";
import './TablaEstadisticasPkm.css';

// Escala relativa a la stat máxima del propio Pokémon
function calcularAnchoBarra(base, maxBase, maxPorcentaje)
{
  if (!maxBase || maxBase <= 0) return 0;

  const ratio = base / maxBase; // 0..1
  const clamped = Math.max(0, Math.min(ratio, 1));

  return clamped * maxPorcentaje; // 0..maxPorcentaje
}

function getColor(base)
{
  const minStat = 30; // Mínimo esperado (rojo puro)
  const maxStat = 160; // Máximo esperado (verde puro)

  const percentage = (base - minStat) / (maxStat - minStat);
  const hue = 0 + percentage * 120; // Rojo (0°) → Verde (120°)

  return `hwb(${hue} 0% 0%)`;
}

export default function TablaEstadisticasPkm({ statsPoke, nombrePkm = "" })
{
  // Funcion que calcula las Stats con el metodo de IVs y 252Evs
  function calcularStat(atBase, defBase, atSpBase, defSpbase, speedBase, nivel, favorable)
  {
    let iv, ev, natureBonus;

    if(favorable)
    {
      iv = 31;
      ev = 252;
      natureBonus = 1.1;

    }else
    {
      iv = 0;
      ev = 0;
      natureBonus = 0.9;
    }

    let atStat = Math.floor(((2 * atBase + iv + (ev / 4)) * nivel / 100) + 5);
    let atStatFinal = Math.floor(atStat * natureBonus);

    let defStat = Math.floor(((2 * defBase + iv + (ev / 4)) * nivel / 100) + 5);
    let defStatFinal = Math.floor(defStat * natureBonus);

    let atSpStat = Math.floor(((2 * atSpBase + iv + (ev / 4)) * nivel / 100) + 5);
    let atSpStatFinal = Math.floor(atSpStat * natureBonus);

    let defSpStat = Math.floor(((2 * defSpbase + iv + (ev / 4)) * nivel / 100) + 5);
    let defSpStatFinal = Math.floor(defSpStat * natureBonus);

    let speedStat = Math.floor(((2 * speedBase + iv + (ev / 4)) * nivel / 100) + 5);
    let speedStatFinal = Math.floor(speedStat * natureBonus);

    return { atStatFinal, defStatFinal, atSpStatFinal, defSpStatFinal, speedStatFinal };
  }

  // Funcion que calcula la Stat de PS con el metodo de IVs y 252Evs
  function calcularStatPS(psBase, nivel, favorable, nombrePkm)
  {
    if(String(nombrePkm).toLowerCase() === "shedinja")
    {
      return 1; // Shedinja siempre tiene 1 PS
    }

    let iv, ev;

    if(favorable)
    {
      iv = 31;
      ev = 252;

    }else
    {
      iv = 0;
      ev = 0;
    }

    return Math.floor(((2 * psBase + iv + (ev / 4)) * nivel / 100) + nivel + 10);
  }

  // Funcion que retorna el Objeto con todas las Stats en 4 casos (Nv 50 y 100, Favorable y Desfavorable)
  function retonarStat(statsPoke, nombrePkm)
  {
    // Stats Nv 100 FAVORABLE
    let stat100Favorable = calcularStat(statsPoke.atk, statsPoke.def, statsPoke.spe_atk, statsPoke.spe_def, statsPoke.speed, 100, true);
    let ps100Favorbale = calcularStatPS(statsPoke.hp, 100, true, nombrePkm);

    // Stats Nv 100 DESFAVORABLE
    let stat100Desfavorable = calcularStat(statsPoke.atk, statsPoke.def, statsPoke.spe_atk, statsPoke.spe_def, statsPoke.speed, 100, false);
    let ps100Desfavorbale = calcularStatPS(statsPoke.hp, 100, false, nombrePkm);

    // Stats Nv 50 FAVORABLE
    let stat50Favorable = calcularStat(statsPoke.atk, statsPoke.def, statsPoke.spe_atk, statsPoke.spe_def, statsPoke.speed, 50, true);
    let ps50Favorbale = calcularStatPS(statsPoke.hp, 50, true, nombrePkm);

    // Stats Nv 50 DESFAVORABLE
    let stat50Desfavorable = calcularStat(statsPoke.atk, statsPoke.def, statsPoke.spe_atk, statsPoke.spe_def, statsPoke.speed, 50, false);
    let ps50Desfavorbale = calcularStatPS(statsPoke.hp, 50, false, nombrePkm);

    return [
      {
        nombre: "PS",
        base: statsPoke.hp,
        min50: ps50Desfavorbale,
        max50: ps50Favorbale,
        min100: ps100Desfavorbale,
        max100: ps100Favorbale,
        pe: statsPoke.effort_hp
      },
      {
        nombre: "Ataque",
        base: statsPoke.atk,
        min50: stat50Desfavorable.atStatFinal,
        max50: stat50Favorable.atStatFinal,
        min100: stat100Desfavorable.atStatFinal,
        max100: stat100Favorable.atStatFinal,
        pe: statsPoke.effort_atk
      },
      {
        nombre: "Defensa",
        base: statsPoke.def,
        min50: stat50Desfavorable.defStatFinal,
        max50: stat50Favorable.defStatFinal,
        min100: stat100Desfavorable.defStatFinal,
        max100: stat100Favorable.defStatFinal,
        pe: statsPoke.effort_def
      },
      {
        nombre: "At. Esp.",
        base: statsPoke.spe_atk,
        min50: stat50Desfavorable.atSpStatFinal,
        max50: stat50Favorable.atSpStatFinal,
        min100: stat100Desfavorable.atSpStatFinal,
        max100: stat100Favorable.atSpStatFinal,
        pe: statsPoke.effort_spe_atk
      },
      {
        nombre: "Def. Esp.",
        base: statsPoke.spe_def,
        min50: stat50Desfavorable.defSpStatFinal,
        max50: stat50Favorable.defSpStatFinal,
        min100: stat100Desfavorable.defSpStatFinal,
        max100: stat100Favorable.defSpStatFinal,
        pe: statsPoke.effort_spe_def
      },
      {
        nombre: "Velocidad",
        base: statsPoke.speed,
        min50: stat50Desfavorable.speedStatFinal,
        max50: stat50Favorable.speedStatFinal,
        min100: stat100Desfavorable.speedStatFinal,
        max100: stat100Favorable.speedStatFinal,
        pe: statsPoke.effort_speed
      }
    ];
  }

  const stats = retonarStat(statsPoke, nombrePkm);

  // Máximo de stat base del Pokémon (HP, Atk, etc.)
  const maxBase = 200;
  const MAX_BAR_PERCENT = 95; // la barra más alta llega solo al 95% del ancho

  return (
    <div className="tabla-container">
      <table className="tabla-estadisticas bordeColor">
        
        {/* Headers de la Tabla de Stats */}
        <thead className="fondoOscuro">
          <tr>
            <th></th>
            <th></th>
            <th>Características base</th>
            <th className="bordeColor">Nivel 50 (Mín)</th>
            <th className="bordeColor">Nivel 50 (Máx)</th>
            <th className="bordeColor">Nivel 100 (Mín)</th>
            <th className="bordeColor">Nivel 100 (Máx)</th>
            <th className="bordeColor">PE</th>
          </tr>
        </thead>

        {/* Filas de la Tabla de Stats */}
        <tbody>

          {/* Filas de las Stats: Ataque, Ataque Sp, Defensa, Defensa Sp, Velocidad y PS */}
          {stats.map((stat, index) => (
            <tr key={index} className="bordeColor">
              <td className="bordeColor fondoOscuro textoNegrita">{stat.nombre}</td>
              <td className="textoNegrita">{stat.base}</td>
              <td className="bordeColor barraGrafico">
                <div className="barra-container">
                  <div
                    className="barra"
                    style={{
                      width: `${calcularAnchoBarra(stat.base, maxBase, MAX_BAR_PERCENT)}%`,
                      backgroundColor: getColor(stat.base),
                    }}
                  ></div>
                </div>
              </td>
              <td className="bordeColor">{stat.min50}</td>
              <td className="bordeColor">{stat.max50}</td>
              <td className="bordeColor">{stat.min100}</td>
              <td className="bordeColor textoNegrita">{stat.max100}</td>
              <td className="bordeColor">{stat.pe}</td>
            </tr>
          ))}

          {/* Total de Puntos Base */}
          <tr className="fila-adicional fondoOscuro">
            <td className="bordeColor">Total</td>
            <td className="bordeColor">
              {stats.reduce((acc, stat) => acc + stat.base, 0)}
            </td>
            <td colSpan="6"></td>
          </tr>

          {/* Mini detalle informativo */}
          <tr className="fila-nota">
            <td colSpan="8" className="nota-centro">
              <div className="centrarTexto">
                <div>
                  Valores mínimos calculados con <strong>naturaleza desfavorable</strong>, 0 EVs y 0 IVs.
                </div>
                <div>
                  Valores máximos calculados con <strong>naturaleza favorable</strong>, 252 EVs y 31 IVs.
                </div>
              </div>
            </td>
          </tr>

        </tbody>

      </table>
    </div>
  );
 
}