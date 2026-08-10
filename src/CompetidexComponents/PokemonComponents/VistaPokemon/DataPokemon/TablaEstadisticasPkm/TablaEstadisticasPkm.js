//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\TablaEstadisticasPkm\TablaEstadisticasPkm.js

import React, { useEffect, useMemo, useState } from "react";
import { hasPokemonInPokedexRegion } from "../../../../../CompetidexComponents/PokedexComponents/pokedexCache";
import "./TablaEstadisticasPkm.css";

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
  const isChampionsPokemon = useMemo(() =>
  {
    const apiKey = String(nombrePkm || "").trim().toLowerCase();
    if(!apiKey) return false;

    return hasPokemonInPokedexRegion("champions", apiKey);

  }, [nombrePkm]);

  const tabs = useMemo(() =>
  {
    if(!isChampionsPokemon) return [];

    return [
      { key: "base", label: "≤ 9na Gen" },
      { key: "champions", label: "Champions" },
    ];

  }, [isChampionsPokemon]);

  const [activeTab, setActiveTab] = useState("base");

  useEffect(() =>
  {
    setActiveTab("base");
  }, [nombrePkm, isChampionsPokemon]);

  // Máximo de stat base del Pokémon (HP, Atk, etc.)
  const maxBase = 200;
  const MAX_BAR_PERCENT = 95; // la barra más alta llega solo al 95% del ancho


  // --------------- STATS BASE - INICIO --------------- 

  // Funcion que calcula las Stats con el metodo de IVs y 252 Evs
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

  // Funcion que calcula la Stat de PS con el metodo de IVs y 252 Evs
  function calcularStatPS(psBase, nivel, favorable, nombrePkmLocal)
  {
    if(String(nombrePkmLocal).toLowerCase() === "shedinja")
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
  function retornarStat(statsPokeLocal, nombrePkmLocal)
  {
    // Stats Nv 100 FAVORABLE
    let stat100Favorable = calcularStat(statsPokeLocal.atk, statsPokeLocal.def, statsPokeLocal.spe_atk, statsPokeLocal.spe_def, statsPokeLocal.speed, 100, true);
    let ps100Favorbale = calcularStatPS(statsPokeLocal.hp, 100, true, nombrePkmLocal);

    // Stats Nv 100 DESFAVORABLE
    let stat100Desfavorable = calcularStat(statsPokeLocal.atk, statsPokeLocal.def, statsPokeLocal.spe_atk, statsPokeLocal.spe_def, statsPokeLocal.speed, 100, false);
    let ps100Desfavorbale = calcularStatPS(statsPokeLocal.hp, 100, false, nombrePkmLocal);

    // Stats Nv 50 FAVORABLE
    let stat50Favorable = calcularStat(statsPokeLocal.atk, statsPokeLocal.def, statsPokeLocal.spe_atk, statsPokeLocal.spe_def, statsPokeLocal.speed, 50, true);
    let ps50Favorbale = calcularStatPS(statsPokeLocal.hp, 50, true, nombrePkmLocal);

    // Stats Nv 50 DESFAVORABLE
    let stat50Desfavorable = calcularStat(statsPokeLocal.atk, statsPokeLocal.def, statsPokeLocal.spe_atk, statsPokeLocal.spe_def, statsPokeLocal.speed, 50, false);
    let ps50Desfavorbale = calcularStatPS(statsPokeLocal.hp, 50, false, nombrePkmLocal);

    return [
      {
        nombre: "PS",
        base: statsPokeLocal.hp,
        min50: ps50Desfavorbale,
        max50: ps50Favorbale,
        min100: ps100Desfavorbale,
        max100: ps100Favorbale,
        pe: statsPokeLocal.effort_hp
      },
      {
        nombre: "Ataque",
        base: statsPokeLocal.atk,
        min50: stat50Desfavorable.atStatFinal,
        max50: stat50Favorable.atStatFinal,
        min100: stat100Desfavorable.atStatFinal,
        max100: stat100Favorable.atStatFinal,
        pe: statsPokeLocal.effort_atk
      },
      {
        nombre: "Defensa",
        base: statsPokeLocal.def,
        min50: stat50Desfavorable.defStatFinal,
        max50: stat50Favorable.defStatFinal,
        min100: stat100Desfavorable.defStatFinal,
        max100: stat100Favorable.defStatFinal,
        pe: statsPokeLocal.effort_def
      },
      {
        nombre: "At. Esp.",
        base: statsPokeLocal.spe_atk,
        min50: stat50Desfavorable.atSpStatFinal,
        max50: stat50Favorable.atSpStatFinal,
        min100: stat100Desfavorable.atSpStatFinal,
        max100: stat100Favorable.atSpStatFinal,
        pe: statsPokeLocal.effort_spe_atk
      },
      {
        nombre: "Def. Esp.",
        base: statsPokeLocal.spe_def,
        min50: stat50Desfavorable.defSpStatFinal,
        max50: stat50Favorable.defSpStatFinal,
        min100: stat100Desfavorable.defSpStatFinal,
        max100: stat100Favorable.defSpStatFinal,
        pe: statsPokeLocal.effort_spe_def
      },
      {
        nombre: "Velocidad",
        base: statsPokeLocal.speed,
        min50: stat50Desfavorable.speedStatFinal,
        max50: stat50Favorable.speedStatFinal,
        min100: stat100Desfavorable.speedStatFinal,
        max100: stat100Favorable.speedStatFinal,
        pe: statsPokeLocal.effort_speed
      }
    ];
  }

  // Stats con Logica Base Normalizada
  const stats = retornarStat(statsPoke, nombrePkm);
  
  // Tabla de Stats con formula 9na Gen
  const renderStatsTable = () => (
    <table className="tabla-estadisticas bordeColor">
      
      {/* Headers de la Tabla de Stats */}
      <thead className="fondoOscuro">
        <tr>
          <th></th>
          <th></th>
          <th>Características base</th>
          <th className="bordeColor">Nivel 50 (Min)</th>
          <th className="bordeColor">Nivel 50 (Max)</th>
          <th className="bordeColor">Nivel 100 (Min)</th>
          <th className="bordeColor">Nivel 100 (Max)</th>
          <th className="bordeColor">PE</th>
        </tr>
      </thead>

      {/* Filas de la Tabla de Stats */}
      <tbody>
        
        {/* Filas de las Stats: Ataque, Ataque Sp, Defensa, Defensa Sp, Velocidad y PS */}
        {stats.map((stat, index) => (
          <tr key={`${index}`} className="bordeColor">
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
              <>
                <div>
                  Valores mínimos calculados con <strong>naturaleza desfavorable</strong>, 0 EVs y 0 IVs.
                </div>
                <div>
                  Valores máximos calculados con <strong>naturaleza favorable</strong>, 252 EVs y 31 IVs.
                </div>
              </> 
            </div>
          </td>
        </tr>
      </tbody>

    </table>
  );

  // --------------- STATS BASE - FIN --------------- 


  // --------------- STATS CHAMPIONS - INICIO --------------- 

  // Funcion que calcula las Stats con el metodo de Pokémon Champions
  function calcularStatChampions(baseStat, statPoints, naturaleza = 1)
  {
    const base = Number(baseStat || 0);
    const points = Number(statPoints || 0);
    const nat = Number(naturaleza || 1); // Solo peude ser: 0.9 (Desfavorable), 1 (Neutro) o 1.1 (Favorable)

    return Math.floor((base + points + 20) * nat);
  }

  // Funcion que calcula la Stat de PS con el metodo de Pokémon Champions
  function calcularStatPSChampions(psBase, statPoints, nombrePkmLocal)
  {
    if(String(nombrePkmLocal).toLowerCase() === "shedinja")
    {
      return 1;
    }

    return Math.floor(Number(psBase || 0) + Number(statPoints || 0) + 75);
  }

  // Funcion que retorna el Objeto con todas las Stats de Pokémon Champions en 3 casos (Naturaleza: Desfavorable, Neutra y Favorable)
  function retornarStatChampions(statsPokeLocal, nombrePkmLocal)
  {
    // Stats DESFAVORABLE
    const psDesfavorable = calcularStatPSChampions(statsPokeLocal.hp, 0, nombrePkmLocal);
    const atkDesfavorable = calcularStatChampions(statsPokeLocal.atk, 0, 0.9);
    const defDesfavorable = calcularStatChampions(statsPokeLocal.def, 0, 0.9);
    const spe_atkDesfavorable = calcularStatChampions(statsPokeLocal.spe_atk, 0, 0.9);
    const spe_defDesfavorable = calcularStatChampions(statsPokeLocal.spe_def, 0, 0.9);
    const speedDesfavorable = calcularStatChampions(statsPokeLocal.speed, 0, 0.9);

    // Stats FAVORABLE
    const psFavorable = calcularStatPSChampions(statsPokeLocal.hp, 32, nombrePkmLocal);
    const atkFavorable = calcularStatChampions(statsPokeLocal.atk, 32, 1.1);
    const defFavorable = calcularStatChampions(statsPokeLocal.def, 32, 1.1);
    const spe_atkFavorable = calcularStatChampions(statsPokeLocal.spe_atk, 32, 1.1);
    const spe_defFavorable = calcularStatChampions(statsPokeLocal.spe_def, 32, 1.1);
    const speedFavorable = calcularStatChampions(statsPokeLocal.speed, 32, 1.1);

    return [
      {
        nombre: "PS",
        base: statsPokeLocal.hp,
        desfavorable: psDesfavorable,
        favorable: psFavorable
      },
      {
        nombre: "Ataque",
        base: statsPokeLocal.atk,
        desfavorable: atkDesfavorable,
        favorable: atkFavorable
      },
      {
        nombre: "Defensa",
        base: statsPokeLocal.def,
        desfavorable: defDesfavorable,
        favorable: defFavorable
      },
      {
        nombre: "At. Esp.",
        base: statsPokeLocal.spe_atk,
        desfavorable: spe_atkDesfavorable,
        favorable: spe_atkFavorable
      },
      {
        nombre: "Def. Esp.",
        base: statsPokeLocal.spe_def,
        desfavorable: spe_defDesfavorable,
        favorable: spe_defFavorable
      },
      {
        nombre: "Velocidad",
        base: statsPokeLocal.speed,
        desfavorable: speedDesfavorable,
        favorable: speedFavorable
      }
    ];
  }

  // Stats con Logica Pokémon Champions
  const statsChampions = retornarStatChampions(statsPoke, nombrePkm);

  // Tabla de Stats con formula Pokémon Champions
  const renderChampionsStatsTable = () => (
    <table className="tabla-estadisticas bordeColor">
      <thead className="fondoOscuro">
        <tr>
          <th></th>
          <th></th>
          <th>Características base</th>
          <th className="bordeColor">
            <span className="natDesfavorable-text">Naturaleza Desfavorable</span>
          </th>
          <th className="bordeColor">
            <span className="natFavorable-text">Naturaleza Favorable</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {statsChampions.map((stat, index) => (
          <tr key={`champions-${index}`} className="bordeColor">
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

            <td className="bordeColor textoNegrita">{stat.desfavorable}</td>
            <td className="bordeColor textoNegrita">{stat.favorable}</td>
          </tr>
        ))}

        <tr className="fila-adicional fondoOscuro">
          <td className="bordeColor">Total</td>
          <td className="bordeColor">
            {statsChampions.reduce((acc, stat) => acc + stat.base, 0)}
          </td>
          <td colSpan="3"></td>
        </tr>

        <tr className="fila-nota">
          <td colSpan="5" className="nota-centro">
            <div className="centrarTexto">
              <div>
                En <strong>Pokémon Champions</strong>, el cálculo siempre se realiza a <strong>nivel 50</strong> y con <strong>31 IVs</strong> en todas las características.
              </div>
              <div>
                Naturaleza <strong>desfavorable</strong> calculada con <strong>0 Puntos de Característica</strong>.
              </div>
              <div>
                Naturaleza <strong>favorable</strong> calculada con <strong>32 Puntos de Característica</strong>.
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
  
  // --------------- STATS CHAMPIONS - FIN --------------- 

  // Funcion que renderiza una tabla segun el modo
  const renderTable = (mode) =>
  {
    switch(mode)
    {
      case "champions":
        return (
          <div className="tabla-container">
            {renderChampionsStatsTable()}
          </div>
        );

      case "base":
        return (
          <div className="tabla-container">
            {renderStatsTable()}
          </div>
        );

      default:
        return (
          <div className="tabla-container">
            {renderStatsTable()}
          </div>
        );
    }
  };

  if(!isChampionsPokemon)
  {
    return renderTable("base");
  }

  return (
    <div className="tabla-tabs-wrapper">
      
      {/* Tabs para elegir Tabla */}
      <div className="tabla-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tabla-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tablas de Stats */}
      <div className="tabla-tabs-content">

        {/* Stats 9na Gen */}
        {activeTab === "base" && renderTable("base")}

        {/* Stats Champions */}
        {activeTab === "champions" && renderTable("champions")}

      </div>

    </div>
  );

}