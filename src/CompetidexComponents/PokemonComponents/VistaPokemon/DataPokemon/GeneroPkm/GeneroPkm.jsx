//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\GeneroPkm\GeneroPkm.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { advancedPokemonSearchRouteWithFilters } from "../../../../../utils/competidexRoutes";
import "./GeneroPkm.css";

export default function GeneroPkm({ porcentajeMacho, porcentajeHembra, sinSexo, size = "normal", enableAdvancedSearchLink = false })
{
  const navigate = useNavigate();

  // Clase de tamaño
  const sizeClass = `genero-pkm-${size}`;
  const canNavigateToAdvancedSearch = !!enableAdvancedSearchLink;

  function navigateToAdvancedGenderFilter(field, value)
  {
    if(!canNavigateToAdvancedSearch) return;

    navigate(advancedPokemonSearchRouteWithFilters({
      filters: [
        {
          field,
          operator: "eq",
          value
        }
      ],
      sort: {
        field: "id",
        direction: "asc"
      }
    }));
  }

  function handleMalePercentageClick()
  {
    navigateToAdvancedGenderFilter("malePercentage", porcentajeMacho);
  }

  function handleFemalePercentageClick()
  {
    navigateToAdvancedGenderFilter("femalePercentage", porcentajeHembra);
  }

  function handleSinSexoClick()
  {
    navigateToAdvancedGenderFilter("sinSexo", true);
  }

  function renderGenderFilterChip({ className = "", label, onClick, children })
  {
    const isClickable = canNavigateToAdvancedSearch;

    return (
      <span
        className={"genero-filter-chip" + (className ? ` ${className}` : "") + (isClickable ? " genero-filter-chip-clickable" : "")}
        onClick={isClickable ? onClick : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={function(event)
        {
          if(!isClickable) return;
          if(event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          onClick();
        }}
        aria-label={isClickable ? label : undefined}
        title={isClickable ? label : undefined}
      >
        {children}
      </span>
    );
  }

  let contenido;

  if(sinSexo)
  {
    contenido = renderGenderFilterChip({
      className: "texto-sin-genero",
      label: "Buscar Pokémon Sin Sexo",
      onClick: handleSinSexoClick,
      children: "Sin Sexo"
    });

  }else if(porcentajeMacho === 100 && !porcentajeHembra)
  {

    contenido = renderGenderFilterChip({
      label: "Buscar Pokémon con: 100% Macho",
      onClick: handleMalePercentageClick,
      children: (
        <>
          <IoMdMale className="genderForma maleForma" /> 100%
        </>
      )
    });

  }else if(porcentajeHembra === 100 && !porcentajeMacho)
  {

    contenido = renderGenderFilterChip({
      label: "Buscar Pokémon con: 100% Hembra",
      onClick: handleFemalePercentageClick,
      children: (
        <>
          <IoMdFemale className="genderForma femaleForma" /> 100%
        </>
      )
    });

  }else if(porcentajeMacho != null && porcentajeHembra != null)
  {

    contenido = (
      <span className="texto-genero">
        {renderGenderFilterChip({
          label: `Buscar Pokémon con: ${porcentajeMacho}% Macho`,
          onClick: handleMalePercentageClick,
          children: (
            <>
              <IoMdMale className="genderForma maleForma" /> {porcentajeMacho}%
            </>
          )
        })}

        {renderGenderFilterChip({
          label: `Buscar Pokémon con ${porcentajeHembra}% Hembra`,
          onClick: handleFemalePercentageClick,
          children: (
            <>
              <IoMdFemale className="genderForma femaleForma" /> {porcentajeHembra}%
            </>
          )
        })}
      </span>
    );

  }else
  {
    contenido = <span className="texto-sin-genero">—</span>;
  }

  return (
    <div className={`genero-pkm ${sizeClass}`}>
      <div className="genero-pkm-info">
        <span className="genero-label" aria-label="Sexo">
          <span className="genero-label-word">Sexo</span>:
        </span>
        <span className="tarjeta-genero">{contenido}</span>
      </div>
    </div>
  );

}