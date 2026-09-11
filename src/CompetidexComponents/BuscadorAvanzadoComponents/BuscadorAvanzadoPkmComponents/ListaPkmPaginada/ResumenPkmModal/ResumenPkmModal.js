//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoPkmComponents\ListaPkmPaginada\ResumenPkmModal\ResumenPkmModal.js

import React, { useEffect, useMemo, useState } from "react";
import { getTypeColor, getEggGroupLabelES } from "../../../../../utils/competidexMeta";

import HabilidadResumenPkm from "./HabilidadResumenPkm/HabilidadResumenPkm";

import Modal from "../../../../SharedComponents/Modal/Modal";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import GeneracionPkm from "../../../../SharedComponents/GeneracionPkm/GeneracionPkm";
import BooleanoPkm from "../../../../SharedComponents/BooleanoPkm/BooleanoPkm";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";

import NombreIDPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/NombreIDPkm/NombreIDPkm";
import TablaEstadisticasPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/TablaEstadisticasPkm/TablaEstadisticasPkm";
import PesoYAlturaPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/PesoYAlturaPkm/PesoYAlturaPkm";
import IndiceCapturaPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/IndiceCapturaPkm/IndiceCapturaPkm";
import GeneroPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/GeneroPkm/GeneroPkm";
import ColorPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/ColorPkm/ColorPkm";
import CategoriaPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/CategoriaPkm/CategoriaPkm";
import GruposHuevoPkm from "../../../../PokemonComponents/VistaPokemon/DataPokemon/GruposHuevoPkm/GruposHuevoPkm";

import "./ResumenPkmModal.css";

function returnEmptyEggGroup()
{
  return {
    apiKey: "",
    labelES: ""
  };
}

function buildEggGroups(eggGroupsRaw)
{
  if(!Array.isArray(eggGroupsRaw)) return [];

  return eggGroupsRaw
    .map((grupo) =>
    {
      const apiKey = String(grupo || "").trim().toLowerCase();
      if(!apiKey) return null;

      const eggGroup = returnEmptyEggGroup();
      eggGroup.apiKey = apiKey;
      eggGroup.labelES = getEggGroupLabelES(apiKey);

      return eggGroup;
    })
    .filter(Boolean);
}

function buildAbilitiesBySlot(abilitiesRaw)
{
  const list = Array.isArray(abilitiesRaw) ? abilitiesRaw : [];

  return {
    abilitiesPkmSlot1: list.filter(function(h) { return Number(h?.slot) === 1; }),
    abilitiesPkmSlot2: list.filter(function(h) { return Number(h?.slot) === 2; }),
    abilitiesPkmSlot3: list.filter(function(h) { return Number(h?.slot) === 3; })
  };
}

function getViewportWidth()
{
  if(typeof window === "undefined") return 1024;
  return Number(window.innerWidth) || 1024;
}

export default function ResumenPkmModal({ open, pokemon, onClose })
{
  const apiName = String(pokemon?.apiName || "").trim().toLowerCase();

  const id = Number(pokemon?.id) || 0;
  const display = String(pokemon?.displayES || pokemon?.display || apiName || "Pokémon");
  const types = Array.isArray(pokemon?.types) ? pokemon.types.filter(Boolean) : [];
  const gruposHuevoPkmRaw = Array.isArray(pokemon?.eggGroups) ? pokemon.eggGroups : [];
  const gruposHuevoPkm = buildEggGroups(gruposHuevoPkmRaw);
  const abilitiesPkm = Array.isArray(pokemon?.abilities) ? pokemon.abilities : [];

  const isMegaForm = !!pokemon?.isMegaForm;

  const isGigaForm = !!pokemon?.isGigaForm;
  const isEternatusGigaForm = (apiName === "eternatus-eternamax");
  
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth);

  useEffect(() =>
  {
    function handleResize()
    {
      setViewportWidth(getViewportWidth());
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return function()
    {
      window.removeEventListener("resize", handleResize);
    };

  }, []);

  const isTinyScreen = viewportWidth <= 375;
  const isSmallScreen = viewportWidth <= 500;
  const contentSize = isSmallScreen ? "small" : "normal";
  const typeSize = isTinyScreen ? "small" : (isSmallScreen ? "small" : "normal");
  const spriteThumbSize = isTinyScreen ? 220 : (isSmallScreen ? 250 : 300);

  const {
    abilitiesPkmSlot1,
    abilitiesPkmSlot2,
    abilitiesPkmSlot3
  } = useMemo(() =>
  {
    return buildAbilitiesBySlot(abilitiesPkm);

  }, [abilitiesPkm]);

  const pokemonResumenData = useMemo(() =>
  {
    return {
      generacionSize: contentSize,
      categoriaSize: contentSize,
      generoSize: contentSize,
      pesoAlturaSize: contentSize,
      indiceCapturaSize: contentSize,
      colorSize: contentSize,
      gruposHuevoSize: contentSize,
      booleanoSize: contentSize,
      habilidadesSize: contentSize
    };

  }, [contentSize]);

  function renderTypesBlock(size = "normal")
  {
    if(!types.length) return null;

    return (
      <div className="pokemonResumenModalComponent-types" aria-label={`Tipos de ${display}`}>
        {types.map(function(tipo)
        {
          const bg = getTypeColor(tipo) || "#68A090";

          return (
            <div
              key={tipo}
              className="pokemonResumenModalComponent-tipoWrap"
              style={{ backgroundColor: bg }}
            >
              <Tipo
                tipo={tipo}
                size={size}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // --------- RENDERS DE GIGAMAX - INICIO ---------
  function renderGigaForm()
  {
    return (
      <Modal
        open={!!open}
        title={"Resumen del Pokémon"}
        onClose={onClose}
        modalStyle={{
          width: "600px",
          maxWidth: "600px"
        }}
      >
        <div className="pokemonResumenModalComponent">

          {/* ID + Nombre + Sprite */}
          <div className="pokemonResumenModalComponent-ContIdDisplay">
            <NombreIDPkm
              id={id}
              nombre={display}
              tipos={types}
            />
          </div>

          {/* Gen + Sprite + Tipos + Altura */}
          <div className="pokemonResumenModalComponent-mainRow pokemonResumenModalComponent-gigaForma">
            <div className="pokemonResumenComponent-spriteYGen">

              {/* Generación Pokémon */}
              <GeneracionPkm
                generacion={pokemon.generation}
                size={pokemonResumenData.generacionSize}
              />

              {/* Foto Sprite */}
              <div className="pokemonResumenModalComponent-spriteWrap">
                <SpriteModal
                  id={id || undefined}
                  altText={display}
                  thumbSize={spriteThumbSize}
                  disableModal={false}
                />
              </div>

              {/* Tipos */}
              {renderTypesBlock(typeSize)}

              {/* Peso y Altura Pokémon */}
              <div className="pokemonResumenComponent-contGeneralItems">
                <PesoYAlturaPkm
                  altura={pokemon.height !== null && pokemon.height !== undefined ? pokemon.height : undefined}
                  peso={pokemon.weight !== null && pokemon.weight !== undefined ? pokemon.weight : undefined}
                  size={pokemonResumenData.pesoAlturaSize}
                  isGigaForm={true}
                />
              </div>

            </div>
          </div>

        </div>
      </Modal>
    );
  }

  function renderGigaEternatusForm()
  {
    return (
       <Modal
            open={!!open}
            title={"Resumen del Pokémon"}
            onClose={onClose}
          >
            <div className="pokemonResumenModalComponent">

              {/* ID + Nombre + Sprite */}
              <div className="pokemonResumenModalComponent-ContIdDisplay">
                <NombreIDPkm
                  id={id}
                  nombre={display}
                  tipos={types}
                />
              </div>

              {/* (Gen + Sprite + Tipos + Altura) + Tabla de Stats */}
              <div className="pokemonResumenModalComponent-mainRow">

                {/* Gen + Sprite + Tipos */}
                <div className="pokemonResumenComponent-spriteYGen">

                  {/* Generación Pokémon */}
                  <GeneracionPkm
                    generacion={pokemon.generation}
                    size={pokemonResumenData.generacionSize}
                  />

                  {/* Foto Sprite */}
                  <div className="pokemonResumenModalComponent-spriteWrap">
                    <SpriteModal
                      id={id || undefined}
                      altText={display}
                      thumbSize={spriteThumbSize}
                      disableModal={false}
                    />
                  </div>

                  {/* Tipos */}
                  {renderTypesBlock(typeSize)}

                  {/* Peso y Altura Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <PesoYAlturaPkm
                      altura={pokemon.height !== null && pokemon.height !== undefined ? pokemon.height : undefined}
                      peso={pokemon.weight !== null && pokemon.weight !== undefined ? pokemon.weight : undefined}
                      size={pokemonResumenData.pesoAlturaSize}
                      isGigaForm={true}
                    />
                  </div>

                </div>

                {/* Tabla de Stats */}
                <div className="pokemonResumenModalComponent-tableStatsWrapper">

                  <TablaEstadisticasPkm
                    statsPoke={pokemon.stats}
                    nombrePkm={pokemon.specieName || ""}
                  />

                </div>

              </div>

            </div>
          </Modal>
    );
  }
  // --------- RENDERS DE GIGAMAX - FIN ---------


  // --------- RENDERS DE MEGA EVO - INICIO ---------
  function renderMegaEvoForm()
  {
    return (
       <Modal
            open={!!open}
            title={"Resumen del Pokémon"}
            onClose={onClose}
          >
            <div className="pokemonResumenModalComponent">

              {/* ID + Nombre + Sprite */}
              <div className="pokemonResumenModalComponent-ContIdDisplay">
                <NombreIDPkm
                  id={id}
                  nombre={display}
                  tipos={types}
                />
              </div>

              {/* (Gen + Sprite + Tipos) + Tabla de Stats */}
              <div className="pokemonResumenModalComponent-mainRow">

                {/* Gen + Sprite + Tipos */}
                <div className="pokemonResumenComponent-spriteYGen">

                  {/* Generación Pokémon */}
                  <GeneracionPkm
                    generacion={pokemon.generation}
                    size={pokemonResumenData.generacionSize}
                  />

                  {/* Foto Sprite */}
                  <div className="pokemonResumenModalComponent-spriteWrap">
                    <SpriteModal
                      id={id || undefined}
                      altText={display}
                      thumbSize={spriteThumbSize}
                      disableModal={false}
                    />
                  </div>

                  {/* Tipos */}
                  {renderTypesBlock(typeSize)}

                </div>

                {/* Tabla de Stats */}
                <div className="pokemonResumenModalComponent-tableStatsWrapper">

                  <TablaEstadisticasPkm
                    statsPoke={pokemon.stats}
                    nombrePkm={pokemon.specieName || ""}
                  />

                </div>

              </div>

              {/* Resumen de Datos */}
              <div className="pokemonResumenModalComponent-resumenDatos pokemonResumenModalComponent-MegaCard pokemonResumenModalComponent-megaResumenDatos">
    
                {/* Columna 1 */}
                <div className="pokemonResumenModalComponent-resumenColCenter pokemonResumenModalComponent-megaResumenCol">

                  {/* Genero Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <GeneroPkm
                      porcentajeMacho={pokemon.malePercentage}
                      porcentajeHembra={pokemon.femalePercentage}
                      sinSexo={pokemon.sinSexo}
                      size={pokemonResumenData.generoSize}
                    />
                  </div>

                  {/* Peso y Altura Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <PesoYAlturaPkm
                      altura={pokemon.height !== null && pokemon.height !== undefined ? pokemon.height : undefined}
                      peso={pokemon.weight !== null && pokemon.weight !== undefined ? pokemon.weight : undefined}
                      size={pokemonResumenData.pesoAlturaSize}
                    />
                  </div>

                  {/* Categoria Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <CategoriaPkm
                      categoriaPkm={pokemon.categoryPkm}
                      size={pokemonResumenData.categoriaSize}
                    />
                  </div>

                  {/* Es Pokémon Bebé: Si/No */}
                  <div className="pokemonResumenComponent-contBooleano">
                    <BooleanoPkm
                      label="Es Pokémon Bebé"
                      value={pokemon.isBabyPkm}
                      size={pokemonResumenData.booleanoSize}
                      trueTooltip=""
                      falseTooltip=""
                    />
                  </div>

                  {/* Es Pokémon Mítico/Singular: Si/No */}
                  <div className="pokemonResumenComponent-contBooleano">
                    <BooleanoPkm
                      label="Es Mítico/Singular"
                      value={pokemon.isMythicalPkm}
                      size={pokemonResumenData.booleanoSize}
                      trueTooltip=""
                      falseTooltip=""
                    />
                  </div>

                  {/* Es Pokémon Legendario: Si/No */}
                  <div className="pokemonResumenComponent-contBooleano">
                    <BooleanoPkm
                      label="Es Legendario"
                      value={pokemon.isLegendaryPkm}
                      size={pokemonResumenData.booleanoSize}
                      trueTooltip=""
                      falseTooltip=""
                    />
                  </div>

                </div>

                {/* Columna 2 */}
                <div className="pokemonResumenModalComponent-resumenColRight pokemonResumenModalComponent-megaResumenCol">

                  {/* Color Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <ColorPkm
                      color={pokemon.color}
                      size={pokemonResumenData.colorSize}
                    />
                  </div>
                  
                  {/* Habilidades Principales Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <HabilidadResumenPkm
                      habilidades={abilitiesPkmSlot1}
                      size={pokemonResumenData.habilidadesSize}
                      slot={1}
                    />
                  </div>

                  {/* Habilidades Secundarias Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <HabilidadResumenPkm
                      habilidades={abilitiesPkmSlot2}
                      size={pokemonResumenData.habilidadesSize}
                      slot={2}
                    />
                  </div>

                  {/* Habilidades Ocultas Pokémon */}
                  <div className="pokemonResumenComponent-contGeneralItems">
                    <HabilidadResumenPkm
                      habilidades={abilitiesPkmSlot3}
                      size={pokemonResumenData.habilidadesSize}
                      slot={3}
                    />
                  </div>

                </div>

              </div>

            </div>
          </Modal>
    );
  }
  // --------- RENDERS DE MEGA EVO - FIN ---------

  return (
    <>
      {isGigaForm
        ? (isEternatusGigaForm ? renderGigaEternatusForm() : renderGigaForm())
        : isMegaForm
          ? renderMegaEvoForm()
          : (   
            <Modal
              open={!!open}
              title={"Resumen del Pokémon"}
              onClose={onClose}
            >
              <div className="pokemonResumenModalComponent">

                {/* ID + Nombre + Sprite */}
                <div className="pokemonResumenModalComponent-ContIdDisplay">
                  <NombreIDPkm
                    id={id}
                    nombre={display}
                    tipos={types}
                  />
                </div>

                {/* (Gen + Sprite + Tipos) + Tabla de Stats */}
                <div className="pokemonResumenModalComponent-mainRow">

                  {/* Gen + Sprite + Tipos */}
                  <div className="pokemonResumenComponent-spriteYGen">

                    {/* Generación Pokémon */}
                    <GeneracionPkm
                      generacion={pokemon.generation}
                      size={pokemonResumenData.generacionSize}
                    />

                    {/* Foto Sprite */}
                    <div className="pokemonResumenModalComponent-spriteWrap">
                      <SpriteModal
                        id={id || undefined}
                        altText={display}
                        thumbSize={spriteThumbSize}
                        disableModal={false}
                      />
                    </div>

                    {/* Tipos */}
                    {renderTypesBlock(typeSize)}

                  </div>

                  {/* Tabla de Stats */}
                  <div className="pokemonResumenModalComponent-tableStatsWrapper">

                    <TablaEstadisticasPkm
                      statsPoke={pokemon.stats}
                      nombrePkm={pokemon.specieName || ""}
                    />

                  </div>

                </div>

                {/* Resumen de Datos */}
                <div className="pokemonResumenModalComponent-resumenDatos">

                  {/* Columna 1 */}
                  <div className="pokemonResumenModalComponent-resumenColLeft">

                    {/* Genero Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <GeneroPkm
                        porcentajeMacho={pokemon.malePercentage}
                        porcentajeHembra={pokemon.femalePercentage}
                        sinSexo={pokemon.sinSexo}
                        size={pokemonResumenData.generoSize}
                      />
                    </div>

                    {/* Peso y Altura Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <PesoYAlturaPkm
                        altura={pokemon.height !== null && pokemon.height !== undefined ? pokemon.height : undefined}
                        peso={pokemon.weight !== null && pokemon.weight !== undefined ? pokemon.weight : undefined}
                        size={pokemonResumenData.pesoAlturaSize}
                      />
                    </div>

                    {/* Indice de Captura Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <IndiceCapturaPkm
                        rate={pokemon.captureRate}
                        size={pokemonResumenData.indiceCapturaSize}
                      />
                    </div>

                    {/* Grupos Huevo Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <GruposHuevoPkm
                        gruposHuevo={gruposHuevoPkm}
                        size={pokemonResumenData.gruposHuevoSize}
                      />
                    </div>

                    {/* Puede Criar: Si/No */}
                    <div className="pokemonResumenComponent-contBooleano">
                      <BooleanoPkm
                        label="Puede Criar"
                        value={pokemon.puedeCriar}
                        size={pokemonResumenData.booleanoSize}
                        trueTooltip=""
                        falseTooltip=""
                      />
                    </div>

                  </div>

                  {/* Columna 2 */}
                  <div className="pokemonResumenModalComponent-resumenColCenter">

                    {/* Categoria Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <CategoriaPkm
                        categoriaPkm={pokemon.categoryPkm}
                        size={pokemonResumenData.categoriaSize}
                      />
                    </div>

                    {/* Posee Mega Evolución/es: Si/No */}
                    <div className="pokemonResumenComponent-contBooleano">
                      <BooleanoPkm
                        label="Posee Mega Evolución/es"
                        value={pokemon.hasMegaForms}
                        size={pokemonResumenData.booleanoSize}
                        trueTooltip=""
                        falseTooltip=""
                      />
                    </div>
                    
                    {/* Posee Gigamax: Si/No */}
                    <div className="pokemonResumenComponent-contBooleano">
                      <BooleanoPkm
                        label="Posee Gigamax"
                        value={pokemon.hasGigaForm}
                        size={pokemonResumenData.booleanoSize}
                        trueTooltip=""
                        falseTooltip=""
                      />
                    </div>

                    {/* Es Pokémon Bebé: Si/No */}
                    <div className="pokemonResumenComponent-contBooleano">
                      <BooleanoPkm
                        label="Es Pokémon Bebé"
                        value={pokemon.isBabyPkm}
                        size={pokemonResumenData.booleanoSize}
                        trueTooltip=""
                        falseTooltip=""
                      />
                    </div>

                    {/* Es Pokémon Mítico/Singular: Si/No */}
                    <div className="pokemonResumenComponent-contBooleano">
                      <BooleanoPkm
                        label="Es Mítico/Singular"
                        value={pokemon.isMythicalPkm}
                        size={pokemonResumenData.booleanoSize}
                        trueTooltip=""
                        falseTooltip=""
                      />
                    </div>

                    {/* Es Pokémon Legendario: Si/No */}
                    <div className="pokemonResumenComponent-contBooleano">
                      <BooleanoPkm
                        label="Es Legendario"
                        value={pokemon.isLegendaryPkm}
                        size={pokemonResumenData.booleanoSize}
                        trueTooltip=""
                        falseTooltip=""
                      />
                    </div>

                  </div>

                  {/* Columna 3 */}
                  <div className="pokemonResumenModalComponent-resumenColRight">

                    {/* Color Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <ColorPkm
                        color={pokemon.color}
                        size={pokemonResumenData.colorSize}
                      />
                    </div>
                    
                    {/* Habilidades Principales Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <HabilidadResumenPkm
                        habilidades={abilitiesPkmSlot1}
                        size={pokemonResumenData.habilidadesSize}
                        slot={1}
                      />
                    </div>

                    {/* Habilidades Secundarias Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <HabilidadResumenPkm
                        habilidades={abilitiesPkmSlot2}
                        size={pokemonResumenData.habilidadesSize}
                        slot={2}
                      />
                    </div>

                    {/* Habilidades Ocultas Pokémon */}
                    <div className="pokemonResumenComponent-contGeneralItems">
                      <HabilidadResumenPkm
                        habilidades={abilitiesPkmSlot3}
                        size={pokemonResumenData.habilidadesSize}
                        slot={3}
                      />
                    </div>

                  </div>

                </div>

              </div>
            </Modal>    
          )
      }
    </>
  );

}