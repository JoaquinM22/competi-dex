//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\PokedexNav\PokedexNav.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { preloadCachedImage } from "../../../../../utils/competidexImgCache";
import { pokemonRoute } from "../../../../../utils/competidexRoutes";
import "./PokedexNav.css";

export default function PokedexNav({ titulo, prev, next, baseId, defaultOpen = true })
{
  const navigate = useNavigate();
  const [open, setOpen] = useState(defaultOpen);
  const prevSprite = String(prev?.sprite || "").trim();
  const nextSprite = String(next?.sprite || "").trim();
  const hasPrev = !!(prev && (prev.entry !== null && prev.entry !== undefined) && String(prev.nombreApi || prev.nombre || "").trim());
  const hasNext = !!(next && (next.entry !== null && next.entry !== undefined) && String(next.nombreApi || next.nombre || "").trim());

  useEffect(() =>
  {
    if(prevSprite) preloadCachedImage(prevSprite);
    if(nextSprite) preloadCachedImage(nextSprite);

  }, [prevSprite, nextSprite]);

  // Detecta género por nombre visible (con símbolos) o por sufijo (-m/-f/-male/-female)
  function detectGender(nombre)
  {
    const s = String(nombre || "").trim();

    if (s.indexOf("♂") !== -1) return "male";
    if (s.indexOf("♀") !== -1) return "female";

    const k = s.toLowerCase();

    if (/-male$/.test(k) || /-m$/.test(k)) return "male";
    if (/-female$/.test(k) || /-f$/.test(k)) return "female";

    return "";
  }

  // Limpia el nombre para mostrarlo sin símbolos ni sufijos de género
  function stripGender(nombre)
  {
    let s = String(nombre || "").trim();

    // saca símbolos
    s = s.replace(/[♂♀]/g, "").trim();

    // saca sufijos
    s = s.replace(/-male$/i, "").replace(/-female$/i, "");
    s = s.replace(/-m$/i, "").replace(/-f$/i, "");

    // por si viniera con doble espacio
    s = s.replace(/\s{2,}/g, " ").trim();

    return s;
  }

  // Render del nombre con ícono si corresponde
  function renderName(nombre)
  {
    const gender = detectGender(nombre);
    const base = stripGender(nombre);

    if(gender === "male")
    {

      return (
        <span className="dexnav-text dexnav-textGender">
          <span className="dexnav-textBase">{base}</span>{" "}
          <IoMdMale className="dexnavGenderIcon male" />
        </span>
      );

    }

    if(gender === "female")
    {

      return (
        <span className="dexnav-text dexnav-textGender">
          <span className="dexnav-textBase">{base}</span>{" "}
          <IoMdFemale className="dexnavGenderIcon female" />
        </span>
      );

    }

    return <span className="dexnav-text">{nombre}</span>;
  }

  return (
    <div className="dexnav">
      
      {/* Header */}
      <div className="dexnav-header">
        <h3 className="dexnav-titulo">{titulo}</h3>
        <button
          className="dexnav-toggle"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <span className={open ? "iconoRotado" : "iconoNormal"}>
            <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
          </span>
        </button>
      </div>

      {/* Cuerpo */}
      <div className={`dexnav-body ${open ? "dn-visible" : "dn-oculto"}`}>
        
        {/* Anterior */}
        {
          hasPrev ? (

            <div
              className="dexnav-card"
              onClick={() => navigate(pokemonRoute(encodeURIComponent(prev.nombreApi)))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
              {
                if(e.key === "Enter" || e.key === " ")
                {
                  e.preventDefault();
                  navigate(pokemonRoute(encodeURIComponent(prev.nombreApi)));
                }
              }}
            >
              <span className="dexnav-sub">Anterior</span>
              {prevSprite ? <img src={prevSprite} alt={prev.nombre} /> : null}
              <div className="dexnav-name">
                <span className="dexnav-badge">#{prev.entry}</span>
                {renderName(prev.nombre)}
              </div>
            </div>

          ) : (

            <div className="dexnav-card invisibleDexNav">—</div>
          
          )
        }

        {/* ID Central */}
        <div className="dexnav-center">
          <div className="dexnav-center-id">#{baseId}</div>
        </div>

        {/* Siguiente */}
        {
          hasNext ? (

            <div
              className="dexnav-card"
              onClick={() => navigate(pokemonRoute(encodeURIComponent(next.nombreApi)))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
              {
                if(e.key === "Enter" || e.key === " ")
                {
                  e.preventDefault();
                  navigate(pokemonRoute(encodeURIComponent(next.nombreApi)));
                }
              }}
            >
              <span className="dexnav-sub">Siguiente</span>
              {nextSprite ? <img src={nextSprite} alt={next.nombre} /> : null}
              <div className="dexnav-name">
                <span className="dexnav-badge">#{next.entry}</span>
                {renderName(next.nombre)}
              </div>
            </div>

          ) : null
        }

      </div>

    </div>
  );

}