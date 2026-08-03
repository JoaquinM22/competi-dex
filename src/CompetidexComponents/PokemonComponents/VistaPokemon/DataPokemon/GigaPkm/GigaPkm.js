//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\GigaPkm\GigaPkm.js

import React from "react";
import { spriteUrl, spriteShinyUrl } from "../../../../../config/endpoints";
import ImgPokemon from "../ImgPokemon/ImgPokemon";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import "./GigaPkm.css";

export default function GigaPkm({ giga })
{
  if(!giga) return null;

  // Subrayado palabra por palabra (":" va aparte, sin subrayar)
  const renderTituloSubrayado = (texto) => (
    <strong className="giga-titulo">
      {String(texto || "")
        .split(" ")
        .filter(Boolean)
        .map((w, i, arr) => (
          <React.Fragment key={i}>
            <span className="giga-titulo-word">{w}</span>
            {i < arr.length - 1 ? " " : null}
          </React.Fragment>
        ))}
    </strong>
  );

  // Sprite por ID (si existe)
  const spriteId = giga.idGiga;
  const nombreGiga = String(giga.displayGiga || "").trim();
  const apiNameGiga = String(giga.apiNameGiga || "").trim();
  const alturaGiga = giga.heightGiga;
  const fotosGiga = Array.isArray(giga.fotosGiga) ? giga.fotosGiga : [];

  // Alt para el modal
  const altSprite = nombreGiga || apiNameGiga || "Gigamax";

  return (
    <div className="contenedor-gigaPrincipal">
      
      {/* Descripción del movimiento (sprite + texto) */}
      {giga.descMovGiga ? (
        <div className="descripcion-giga-row">
          <div className="descripcion-giga-sprite">
            {spriteId ? (
              <SpriteModal
                normalUrl={spriteUrl(spriteId)}
                shinyUrl={spriteShinyUrl(spriteId)}
                altText={altSprite}
                thumbSize={80}
              />
            ) : null}
          </div>

          <div className="descripcion-mov-giga">
            <p>
              <strong className="subrayadoGiga">{giga.movGiga}</strong>
              <strong>:</strong> {giga.descMovGiga}
            </p>
          </div>
        </div>
      ) : null}

      {/* Imagen del Gigamax */}
      <div className="contenedor-gigaCard">
        <div className="giga-card">
          
          {/* Nombre forma Gigamax */}
          <h2 className="nombre-giga">{nombreGiga}</h2>

          {/* Imagen GRANDE por defecto (responsiva) */}
          <ImgPokemon
            imgNormal={fotosGiga[0] || "placeholder.png"}
            imgShiny={fotosGiga[1] || fotosGiga[0] || "placeholder.png"}
            altText={nombreGiga}
            ancho="clamp(350px, 38vw, 850px)"
            alto="clamp(350px, 38vw, 850px)"
          />

          {/* Altura */}
          {alturaGiga !== null && alturaGiga !== undefined && (
            <p className="altura-giga">
              <strong className="subrayadoGiga">Altura</strong>: Más de{" "}
              <strong>{alturaGiga}m</strong>
            </p>
          )}

          {/* Movimiento Gigamax (subrayado por palabra) */}
          {giga.movGiga !== "" && (
            <p className="movimiento-giga">
              {renderTituloSubrayado("Movimiento Gigamax")}
              <strong className="giga-colon">:</strong> {giga.movGiga}
            </p>
          )}

        </div>
      </div>

    </div>
  );

}