//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoPkmComponents\ListaPkmPaginada\TarjetaPkmAvanzado\TarjetaPkmAvanzado.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { pokemonRoute } from "../../../../../utils/competidexRoutes";
import { formatNumberWithDots, getBaseApiKeyFromGiga, getBaseApiKeyFromMega } from "../../../../../utils/competidexMeta";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import ResumenPkmModal from "../ResumenPkmModal/ResumenPkmModal";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import "./TarjetaPkmAvanzado.css";

function detectGenderFromName(name)
{
  const s = String(name || "").trim();

  if(s.indexOf("\u2642") !== -1) return "male";
  if(s.indexOf("\u2640") !== -1) return "female";

  const k = s.toLowerCase();
  if(/-male$/.test(k) || /\s+macho$/.test(k)) return "male";
  if(/-female$/.test(k) || /\s+hembra$/.test(k)) return "female";

  return "";
}

function normalizePkmNameGender(name)
{
  let s = String(name || "").trim();

  s = s.replace(/\u2642/g, " Macho");
  s = s.replace(/\u2640/g, " Hembra");

  s = s.replace(/(^|[\s-])male(?=$|[\s-])/gi, "$1Macho");
  s = s.replace(/(^|[\s-])female(?=$|[\s-])/gi, "$1Hembra");

  s = s.replace(/\s{2,}/g, " ").trim();

  return s;
}

function stripGenderFromName(name)
{
  let s = String(name || "").trim();
  s = s.replace(/[\u2642\u2640]/g, "").trim();
  s = s.replace(/-male$/i, "").replace(/-female$/i, "");
  s = s.replace(/\s+macho$/i, "").replace(/\s+hembra$/i, "");
  s = s.replace(/\s{2,}/g, " ").trim();
  return s;
}

export default function TarjetaPkmAvanzado({ pokemon })
{
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const apiName = String(pokemon?.apiName || "").trim().toLowerCase();

  const id = Number(pokemon?.id) || 0;
  const display = String(pokemon?.displayES || pokemon?.display || apiName || "Pokémon");
  const gender = detectGenderFromName(display);
  const baseDisplay = stripGenderFromName(display); 
  const baseDisplayTitle = normalizePkmNameGender(display);
  const types = Array.isArray(pokemon?.types) ? pokemon.types.filter(Boolean) : [];

  const isMegaForm = !!pokemon?.isMegaForm;
  const isGigaForm = !!pokemon?.isGigaForm;

  const cardClass = "tarjetaPokemonAvanzado" + (id ? "" : " tarjetaPokemonAvanzado--sin-id");

  function getNavigateApiName()
  {
    if(!apiName) return "";

    if(isMegaForm)
    {
      return String(getBaseApiKeyFromMega(apiName) || apiName).trim().toLowerCase();
    }

    if(isGigaForm)
    {
      return String(getBaseApiKeyFromGiga(apiName) || apiName).trim().toLowerCase();
    }

    return apiName;
  }

  function handleClickNombre()
  {
    const navigateApiName = getNavigateApiName();
    if(!navigateApiName) return;

    navigate(pokemonRoute(encodeURIComponent(navigateApiName)));
  }

  function openSummary()
  {
    setSummaryOpen(true);
  }

  function closeSummary()
  {
    setSummaryOpen(false);
  }

  return (
    <article
      className={cardClass}
      onClick={openSummary}
      role="button"
      tabIndex={0}
      title={`Abrir resumen de ${baseDisplayTitle}`}
      onKeyDown={(e) =>
      {
        if(e.key === "Enter" || e.key === " ")
        {
          e.preventDefault();
          openSummary();
        }
      }}
    >

      {/* Sprite del Pokémon */}
      <div className="tarjetaPokemonAvanzado-sprite">
        <SpriteModal
          id={id || undefined}
          altText={display}
          thumbSize={104}
          disableModal={true}
          backgrounColorSpriteContainer="#323741"
        />
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="tarjetaPokemonAvanzado-body">
        
        {/* ID del Pokémon */}
        <div className="tarjetaPokemonAvanzado-id">
          {id ? `#${formatNumberWithDots(id)}` : "#-"}
        </div>

        {/* Nombre del Pokémon */}
        <div
          className="tarjetaPokemonAvanzado-name tarjetaPokemonAvanzado-nameClickable"
          role="button"
          tabIndex={0}
          title={`Ver datos de Pokémon: ${baseDisplayTitle}`}
          onClick={(e) =>
          {
            e.stopPropagation();
            handleClickNombre();
          }}
          onKeyDown={(e) =>
          {
            if(e.key === "Enter" || e.key === " ")
            {
              e.preventDefault();
              e.stopPropagation();
              handleClickNombre();
            }
          }}
        >
          {baseDisplay}
          {gender === "male" ? (
            <IoMdMale className="tarjetaPkmAvanzadoComponent-genderForma tarjetaPkmAvanzadoComponent-maleForma" aria-label="Macho" />
          ) : null}
          {gender === "female" ? (
            <IoMdFemale className="tarjetaPkmAvanzadoComponent-genderForma tarjetaPkmAvanzadoComponent-femaleForma" aria-label="Hembra" />
          ) : null}
        </div>

        {/* Tipos del Pokémon */}
        {types.length ? (
          <div className="tarjetaPokemonAvanzado-types" aria-label={`Tipos de ${display}`}>
            {types.map(function(tipo)
            {
              return (
                <Tipo
                  key={tipo}
                  tipo={tipo}
                  size="mini"
                />
              );
            })}
          </div>
        ) : null}

      </div>

      {/* Modal de Resumen del Pokemon */}
      <ResumenPkmModal
        open={summaryOpen}
        pokemon={pokemon}
        onClose={closeSummary}
      />

    </article>
  );

}