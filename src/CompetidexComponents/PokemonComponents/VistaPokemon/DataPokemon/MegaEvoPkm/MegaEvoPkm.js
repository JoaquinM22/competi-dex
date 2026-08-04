//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\MegaEvoPkm\MegaEvoPkm.js

import React, { useEffect, useState } from "react";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa6";
import { spriteUrl, spriteShinyUrl } from "../../../../../config/endpoints";
import { getTypeColor, getTypeMeta } from "../../../../../utils/competidexMeta";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import PesoYAlturaPkm from "../PesoYAlturaPkm/PesoYAlturaPkm";
import ColorPkm from "../ColorPkm/ColorPkm";
import HabilidadesPkm from "../HabilidadesPkm/HabilidadesPkm";
import TablaEstadisticas from "../TablaEstadisticasPkm/TablaEstadisticasPkm";
import ImgPokemon from "../ImgPokemon/ImgPokemon";
import DebilidadesYResistencias from "../../../../SharedComponents/DebilidadesYResistencias/DebilidadesYResistencias";
import "./MegaEvoPkm.css";

export default function MegaEvoPkm({ megas })
{
  const [openDYR, setOpenDYR] = useState({});
  const [mountedDYR, setMountedDYR] = useState({});

  useEffect(() =>
  {
    setOpenDYR({});
    setMountedDYR({});

  }, [megas]);

  const norm = (s = "") =>
    String(s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const measureTextWidth = (text, fontSize = 12) =>
  {
    const value = String(text || "");
    if(!value) return 0;

    if(typeof document === "undefined")
    {
      return value.length * fontSize * 0.62;
    }

    try
    {
      const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement("canvas"));
      const ctx = canvas.getContext("2d");
      if(!ctx) return value.length * fontSize * 0.62;

      const fontFamily = getComputedStyle(document.body || document.documentElement).fontFamily || "Arial, sans-serif";
      ctx.font = `700 ${fontSize}px ${fontFamily}`;

      return ctx.measureText(value).width;

    }catch(e)
    {
      return value.length * fontSize * 0.62;
    }
  };

  const getTypeLabel = (tipo) =>
  {
    const meta = getTypeMeta(tipo);
    return String(meta?.labelEs || tipo || "").trim();
  };

  const getTipoBg = (tipo) => getTypeColor(tipo) || "#68A090";
  const renderUnderlinedWords = (text = "") =>
  {
    const words = String(text || "").trim().split(/\s+/).filter(Boolean);

    return words.map((word, index) => (
      <span
        key={`${word}-${index}`}
        className="desc-titulo-word"
        style={{ marginRight: index < words.length - 1 ? "0.25em" : 0 }}
      >
        {word}
      </span>
    ));
  };

  const detectGenderFromName = (name) =>
  {
    const s = String(name || "").trim();

    if(s.indexOf("♂") !== -1) return "male";
    if(s.indexOf("♀") !== -1) return "female";

    const k = s.toLowerCase();
    if(/-male$/.test(k) || /\s+macho$/.test(k)) return "male";
    if(/-female$/.test(k) || /\s+hembra$/.test(k)) return "female";

    return "";
  };

  const stripGenderFromName = (name) =>
  {
    let s = String(name || "").trim();

    s = s.replace(/[♂♀]/g, "").trim();
    s = s.replace(/-male$/i, "").replace(/-female$/i, "");
    s = s.replace(/\s+macho$/i, "").replace(/\s+hembra$/i, "");
    s = s.replace(/\s{2,}/g, " ").trim();

    return s;
  };

  const renderDisplayTitle = (display = "") =>
  {
    const texto = String(display || "").trim();
    const gender = detectGenderFromName(texto);
    const base = stripGenderFromName(texto);

    return (
      <>
        {renderUnderlinedWords(base)}
        {gender === "male" && <IoMdMale className="desc-gender-icon desc-gender-icon--male" />}
        {gender === "female" && <IoMdFemale className="desc-gender-icon desc-gender-icon--female" />}
      </>
      );
    };

  const renderDisplayName = (display = "") =>
  {
    const texto = String(display || "").trim();
    const gender = detectGenderFromName(texto);
    const base = stripGenderFromName(texto);

    return (
      <>
        {base}
        {gender === "male" && <IoMdMale className="name-gender-icon name-gender-icon--male" />}
        {gender === "female" && <IoMdFemale className="name-gender-icon name-gender-icon--female" />}
      </>
    );
  };

  const normalizeAbilityForDYR = (ability) =>
  {
    if(!ability) return null;

    if(typeof ability === "string")
    {
      const apiName = String(ability || "").trim();
      if(!apiName) return null;

      return { apiName, display: apiName };
    }

    if(typeof ability === "object")
    {
      const apiName = String(ability.apiName || ability.nombreApi || ability.key || "").trim();
      if(!apiName) return null;

      return {
        apiName,
        display: String(ability.display || ability.nombreHab || ability.labelEs || apiName).trim(),
      };
    }

    const apiName = String(ability || "").trim();
    if(!apiName) return null;

    return { apiName, display: apiName };
  };

  if(!Array.isArray(megas) || megas.length === 0) return null;

  const isSingleGigaEternamax =
    megas.length === 1 &&
    String(megas[0]?.apiNameGiga || "").trim() === "eternatus-eternamax";

  const gigaEternamaxData = isSingleGigaEternamax ? megas[0] : null;
  const gigaEternamaxView = isSingleGigaEternamax
    ? (() =>
    {
      const giga = gigaEternamaxData || {};
      const fotosGiga = Array.isArray(giga.fotosGiga) ? giga.fotosGiga : [];
      const nombreGiga = String(giga.displayGiga || giga.apiNameGiga || "Gigamax").trim();

      return {
        fotosGiga,
        nombreGiga,
        tiposGiga: Array.isArray(giga.typesGiga) ? giga.typesGiga : [],
        abilityGiga: giga.abilityGiga || null,
        statsGiga: giga.statsGiga || null,
        heightGiga: giga.heightGiga !== null && giga.heightGiga !== undefined && giga.heightGiga !== ""
          ? giga.heightGiga
          : undefined,
        weightGiga: giga.weightGiga !== null && giga.weightGiga !== undefined && giga.weightGiga !== ""
          ? giga.weightGiga
          : undefined,
        colorGiga: giga.colorGiga || "",
      };
    })()
    : null;

  const getTiposWidth = (tipos = [], fontSize = 16, paddingX = 18, gap = 5, iconSize = 18, borderWidth = 2, extra = 14) =>
  {
    const labels = (Array.isArray(tipos) ? tipos : [])
      .map((tipo) => getTypeLabel(tipo))
      .filter(Boolean);

    if(!labels.length) return 0;

    let maxLabelWidth = 0;
    for(let i = 0; i < labels.length; i++)
    {
      maxLabelWidth = Math.max(maxLabelWidth, measureTextWidth(labels[i], fontSize));
    }

    return Math.ceil(maxLabelWidth + (paddingX * 2) + iconSize + gap + (borderWidth * 2) + extra);
  };

  const gigaTiposWidth = getTiposWidth(Array.isArray(gigaEternamaxView?.tiposGiga) ? gigaEternamaxView.tiposGiga : []);

  return (
    <div className="contenedor-mega">
      
      {/* Megas Comunes */}
      {!isSingleGigaEternamax ? (
      
        <>

          {/* Descripciones arriba */}
          <div className="contenedor-descripciones-mega">
            {megas.map((mega, i) =>
            {
              if(!mega || !mega.descMega) return null;

              const spriteId = (mega.idMega !== null && mega.idMega !== undefined) ? Number(mega.idMega) : null;
              const altText = mega.displayMega || mega.apiNameMega || "Mega Evolución";

              return (
                <div key={i} className="descripcion-mega-row">

                  {/* Sprite de la Mega Evo */}
                  <div className="descripcion-mega-sprite">
                    <SpriteModal
                      normalUrl={spriteId ? spriteUrl(spriteId) : ""}
                      shinyUrl={spriteId ? spriteShinyUrl(spriteId) : ""}
                      altText={altText}
                      thumbSize={80}
                    />
                  </div>

                  {/* Desc de la Mega Evo */}
                  <p className="descripcion-mega">
                    <strong className="desc-titulo">
                      {renderDisplayTitle(mega.displayMega)}
                    </strong>
                    <span className="desc-colon">:</span> {mega.descMega}
                  </p>

                </div>
              );

            })}
          </div>

          {/* Tarjetas + stats + panel DYR por mega */}
          <div>
            {megas.map((mega, index) =>
            {
              const tiposMega = Array.isArray(mega?.typesMega) ? mega.typesMega : [];
              const tiposOk = tiposMega.length > 0;
              const tiposMegaWidth = getTiposWidth(tiposMega);

              const abilityMega = mega?.abilityMega || null;
              const abilityMegaNormalize = normalizeAbilityForDYR(abilityMega);
              const habOk = !!(abilityMegaNormalize?.display || abilityMegaNormalize?.apiName);
              const statsMega = mega?.statsMega || null;

              const isOpen = !!openDYR[index];
              const isMounted = !!mountedDYR[index];
              const panelId = `idDebilidadesYResistenciasCMegaEvo-${index}`;

              const fotosMega = Array.isArray(mega?.fotosMega) ? mega.fotosMega : [];
              const nombreMega = String(mega?.displayMega || "").trim();

              return (
                <div key={index} className="mega-contenedor">
                  
                  {/* Tarjeta izquierda */}
                  <div className="mega-card">

                    {/* Imagen Mega Evo */}
                    <ImgPokemon
                      imgNormal={fotosMega[0] || "placeholder.png"}
                      imgShiny={fotosMega[1] || fotosMega[0] || "placeholder.png"}
                      altText={nombreMega}
                      className="contenedor-ImgPkm-Forma"
                    />

                    <div className="forma-stack">

                      {/* Nombre Mega Evo */}
                      <div className="nombresitoForma">
                        <div className="nombre-forma">{renderDisplayName(nombreMega)}</div>
                      </div>

                      {/* Tipos Mega Evo */}
                      {tiposOk && (
                        <div className="slot">
                          <div
                            className={`contenedor-tipos-mega wrap-narrow ${tiposMega.length === 1 ? "solo" : ""}`}
                            style={tiposMegaWidth ? { "--tipo-mega-item-width": `${tiposMegaWidth}px` } : undefined}
                          >
                            {tiposMega.map((tipo, i) => (
                              <div
                                key={`${nombreMega}-${tipo}-${i}`}
                                className="tipo-bg-forma-inline"
                                style={{ backgroundColor: getTipoBg(tipo) }}
                                title={tipo}
                              >
                                <Tipo tipo={tipo} size="medium" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Altura y Peso Mega Evo */}
                      {(mega?.heightMega !== -1 || mega?.weightMega !== -1) && (
                        <div className="slot">
                          <PesoYAlturaPkm
                            altura={
                              mega?.heightMega !== -1
                                ? mega.heightMega + "m"
                                : undefined
                            }
                            peso={mega?.weightMega !== -1 ? mega.weightMega + "Kg" : undefined}
                            size="medium"
                            mostrarTexto={false}
                          />
                        </div>
                      )}

                      {/* Color Mega Evo */}
                      {mega?.colorMega && (
                        <div className="slot">
                          <div className="contenedorColorFormaPkm">
                            <ColorPkm color={mega.colorMega} size="medium" />
                          </div>
                        </div>
                      )}

                      {/* Habilidad Mega Evo */}
                      {habOk && (
                        <div className="slot">
                          <div className="contenedorDatosFormaPkm">
                            <HabilidadesPkm
                              habilidades={[abilityMega]}
                              isHidden={false}
                              size="medium"
                            />
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Stats Mega Evo */}
                  <div className="mega-stats-col">
                    {statsMega && (
                      <div className="stats-scroll">
                        <div className="stats-inner">
                          <TablaEstadisticas
                            statsPoke={statsMega}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Debilidades y Resistencias Mega Evo */}
                  <div className="mega-dyr-wrap">
                    {tiposOk && habOk && (
                      <div>
                        <div className="contenedorTituloSeccionCMegaEvo">
                          <h2>Debilidades y Resistencias</h2>
                          <button
                            className="toggleDebilidadesYResistenciasCMegaEvo"
                            onClick={() =>
                            {
                              setOpenDYR(prev =>
                              {
                                const next = !prev[index];
                                if(next) setMountedDYR(m => ({ ...m, [index]: true }));
                                return { ...prev, [index]: next };
                              });
                            }}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                          >
                            <span className={isOpen ? "iconoRotadoCMegaEvo" : "iconoNormalCMegaEvo"}>
                                <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                            </span>
                          </button>
                        </div>

                        {isMounted && (
                          <div id={panelId} className={`mega-dyr panel-dyr ${isOpen ? "is-open" : ""}`}>
                            <DebilidadesYResistencias
                              tipos={tiposMega}
                              habilidades={[abilityMegaNormalize]}
                              enPlenosPS={true}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );

            })}
          </div>

        </>

      ) : (

        <>

          {/* Descripcion Eternatus */}
          <div className="contenedor-descripciones-mega">
            <div className="descripcion-mega-row">
              
              {/* Sprite de Eternatus */}
              <div className="descripcion-mega-sprite">
                <SpriteModal
                  normalUrl={Array.isArray(gigaEternamaxView?.fotosGiga) ? (gigaEternamaxView.fotosGiga[0] || "") : ""}
                  shinyUrl={Array.isArray(gigaEternamaxView?.fotosGiga) ? (gigaEternamaxView.fotosGiga[1] || gigaEternamaxView.fotosGiga[0] || "") : ""}
                  altText={gigaEternamaxView?.nombreGiga || "Gigamax"}
                  thumbSize={80}
                />
              </div>

              {/* Desc de Eternatus */}
              <p className="descripcion-mega">
                <strong className="desc-titulo">
                  {renderDisplayTitle(gigaEternamaxView?.nombreGiga || "Gigamax")}
                </strong>
                <span className="desc-colon">:</span> {gigaEternamaxData?.desc || ""}
              </p>

            </div>
          </div>

          {/* Tarjetas + stats + panel DYR por mega */}
          <div>
            <div className="mega-contenedor">

              {/* Tarjeta izquierda */}
              <div className="mega-card">

                {/* Imagen Gigamax */}
                <ImgPokemon
                  imgNormal={gigaEternamaxView?.fotosGiga?.[0] || "placeholder.png"}
                  imgShiny={gigaEternamaxView?.fotosGiga?.[1] || "placeholder.png"}
                  altText={gigaEternamaxView?.nombreGiga || "Gigamax"}
                  className="contenedor-ImgPkm-Forma"
                />

                <div className="forma-stack">

                  {/* Nombre Gigamax */}
                  <div className="nombresitoForma">
                    <div className="nombre-forma">{gigaEternamaxView?.nombreGiga || "Gigamax"}</div>
                  </div>

                  {/* Tipos Gigamax */}
                  {Array.isArray(gigaEternamaxView?.tiposGiga) && gigaEternamaxView.tiposGiga.length > 0 && (
                    <div className="slot">
                      <div
                        className={`contenedor-tipos-mega wrap-narrow ${gigaEternamaxView.tiposGiga.length === 1 ? "solo" : ""}`}
                        style={gigaTiposWidth ? { "--tipo-mega-item-width": `${gigaTiposWidth}px` } : undefined}
                      >
                        {gigaEternamaxView.tiposGiga.map((tipo, i) => (
                          <div
                            key={`${gigaEternamaxView?.nombreGiga}-${tipo}-${i}`}
                            className="tipo-bg-forma-inline"
                            style={{ backgroundColor: getTipoBg(tipo) }}
                            title={tipo}
                          >
                            <Tipo tipo={tipo} size="medium" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Altura Gigamax */}       
                  {gigaEternamaxView?.heightGiga !== undefined && (
                    <div className="slot">             
                      <p className="altura-giga-eternatus">
                        <strong className="subrayadoGiga-eternatus">Altura</strong>: Más de{" "}
                        <strong>{gigaEternamaxView.heightGiga}m</strong>
                      </p>
                    </div>
                  )}                       

                  {/* Color Gigamax */}
                  {gigaEternamaxView?.colorGiga && (
                    <div className="slot">
                      <div className="contenedorColorFormaPkm">
                        <ColorPkm color={gigaEternamaxView.colorGiga} size="medium" />
                      </div>
                    </div>
                  )}

                  {/* Habilidad Gigamax */}
                  {gigaEternamaxView?.abilityGiga && (
                    <div className="slot">
                      <div className="contenedorDatosFormaPkm">
                        <HabilidadesPkm
                          habilidades={[gigaEternamaxView.abilityGiga]}
                          isHidden={false}
                          size="medium"
                        />
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Stats Gigamax */}
              <div className="mega-stats-col">
                {gigaEternamaxView?.statsGiga && (
                  <div className="stats-scroll">
                    <div className="stats-inner">
                      <TablaEstadisticas
                        statsPoke={gigaEternamaxView.statsGiga}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </>
 
      )}

    </div>
  );

}