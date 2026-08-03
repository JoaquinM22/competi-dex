//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\GeneroPkm\GeneroPkm.js

import React from "react";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import "./GeneroPkm.css";

export default function GeneroPkm({ porcentajeMacho, porcentajeHembra, sinSexo, size = "normal" })
{
  // Clase de tamaño
  const sizeClass = `genero-pkm-${size}`;

  let contenido;

  if(sinSexo)
  {
    contenido = <span className="texto-sin-genero">Sin Sexo</span>;

  }else if(porcentajeMacho === 100 && !porcentajeHembra)
  {

    contenido = (
      <span className="texto-genero">
        <IoMdMale className="genderForma maleForma" /> 100% 
      </span>
    );

  }else if(porcentajeHembra === 100 && !porcentajeMacho)
  {

    contenido = (
      <span className="texto-genero">
        <IoMdFemale className="genderForma femaleForma" /> 100% 
      </span>
    );

  }else if(porcentajeMacho != null && porcentajeHembra != null)
  {

    contenido = (
      <span className="texto-genero">
        <IoMdMale className="genderForma maleForma" />{" "} {porcentajeMacho}% 
        <IoMdFemale className="genderForma femaleForma" /> {porcentajeHembra}% 
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