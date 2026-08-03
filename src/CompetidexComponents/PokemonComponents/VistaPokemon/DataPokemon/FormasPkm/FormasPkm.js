//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\FormasPkm\FormasPkm.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { spriteUrl, spriteShinyUrl } from "../../../../../config/endpoints";
import { getTypeColor, getTypeMeta, shouldInlineFormaDescByApiKey, mezclasAlcremie, confitesAlcremie } from "../../../../../utils/competidexMeta";
import { pokemonRoute } from "../../../../../utils/competidexRoutes";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import PesoYAlturaPkm from "../PesoYAlturaPkm/PesoYAlturaPkm";
import ColorPkm from "../ColorPkm/ColorPkm";
import HabilidadesPkm from "../HabilidadesPkm/HabilidadesPkm";
import ImgPokemon from "../ImgPokemon/ImgPokemon";
import "./FormasPkm.css";

export default function FormasPkm({ formas, apiKey = "" })
{
  const navigate = useNavigate();
  const formasSafe = Array.isArray(formas) ? formas : [];

  const isAlcremie = String(apiKey || "").trim().toLowerCase() === "alcremie";
  const getTipoBg = (tipo) => getTypeColor(tipo) || "#68A090";
  const shouldInlineDesc = shouldInlineFormaDescByApiKey(apiKey);

  const measureTextWidth = (text, fontSize = 12) =>
  {
    const value = String(text || "");
    if (!value) return 0;

    if (typeof document === "undefined")
    {
      return value.length * fontSize * 0.62;
    }

    try
    {
      const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement("canvas"));
      const ctx = canvas.getContext("2d");
      if (!ctx) return value.length * fontSize * 0.62;

      const fontFamily = getComputedStyle(document.body || document.documentElement).fontFamily || "Arial, sans-serif";
      ctx.font = `700 ${fontSize}px ${fontFamily}`;

      return ctx.measureText(value).width;

    }catch(e)
    {
      return value.length * fontSize * 0.62;
    }
  };

  const getTipoLabel = (tipo) =>
  {
    const meta = getTypeMeta(tipo);
    return String(meta?.labelEs || tipo || "").trim();
  };

  const tipoMeasureConfig = {
    small: { fontSize: 12, paddingX: 10, iconSize: 14, gap: 4, borderWidth: 2, extra: 12 },
    medium: { fontSize: 16, paddingX: 18, iconSize: 18, gap: 5, borderWidth: 2, extra: 18 },
    normal: { fontSize: 22, paddingX: 25, iconSize: 20, gap: 6, borderWidth: 2, extra: 18 }
  };

  const tiposWidthByForma = useMemo(() =>
  {
    const result = {};

    for(let i = 0; i < formasSafe.length; i++)
    {
      const forma = formasSafe[i];
      const tiposForma = Array.isArray(forma?.typesForma) ? forma.typesForma : [];
      const labels = tiposForma.map((tipo) => getTipoLabel(tipo)).filter(Boolean);

      if(!labels.length)
      {
        result[forma?.idForma ?? i] = 0;
        continue;
      }

      const cfg = tipoMeasureConfig.medium;

      let maxLabelWidth = 0;
      labels.forEach((label) =>
      {
        maxLabelWidth = Math.max(maxLabelWidth, measureTextWidth(label, cfg.fontSize));
      });

      result[forma?.idForma ?? i] = Math.ceil(
        maxLabelWidth +
        (cfg.paddingX * 2) +
        cfg.iconSize +
        cfg.gap +
        (cfg.borderWidth * 2) +
        cfg.extra
      );
    }

    return result;

  }, [formasSafe]);

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

    if(s.indexOf("\u2642") !== -1) return "male";
    if(s.indexOf("\u2640") !== -1) return "female";

    const k = s.toLowerCase();
    if(/-male$/.test(k) || /\s+macho$/.test(k)) return "male";
    if(/-female$/.test(k) || /\s+hembra$/.test(k)) return "female";

    return "";
  };

  const stripGenderFromName = (name) =>
  {
    let s = String(name || "").trim();

    s = s.replace(/[\u2642\u2640]/g, "").trim();
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

  const getFormaDisplay = (forma) =>
    String(forma?.displayForma || "").trim();

  const getFormaImgNormal = (forma) =>
    forma?.imgForma || "placeholder.png";

  const getFormaImgShiny = (forma) =>
    forma?.imgFormaShiny || "placeholder.png";

  const getAlcremieFormaAt = (mixIndex, confiteIndex) => {
    const idx = (mixIndex * confitesAlcremie.length) + confiteIndex;
    return formasSafe[idx] || null;
  };

  const descripciones = !shouldInlineDesc && !isAlcremie
    ? formasSafe
      .filter((forma) => !!String(forma?.descForma || "").trim())
      .map((forma) => (
        {
          idForma: forma?.idForma,
          displayForma: String(forma?.displayForma || "").trim(),
          descForma: String(forma?.descForma || "").trim()
        }
      ))
    : [];

  if(formasSafe.length === 0) return null;

  if(isAlcremie)
  {
    return (
      <div className="contenedor-formas">
        <div className="alcremie-matrix-wrap">
          <div className="alcremie-matrix">
            <div className="alcremie-corner" />

            {/* Filas: Nombre Mezcla + Color */}
            {/* Columnas: Nombre Confites */}

            {confitesAlcremie.map((confite) => (
              <div key={confite.en} className="alcremie-col-header">
                {confite.es}
              </div>
            ))}

            {mezclasAlcremie.map((mix, mixIndex) => (
              <React.Fragment key={mix.en}>
                <div className="alcremie-row-header">
                  <div className="alcremie-row-header-title">{mix.es}</div>
                  <div className="alcremie-row-header-color">
                    <ColorPkm
                      color={mix.color}
                      size="small"
                    />
                  </div>
                </div>

                {confitesAlcremie.map((confite, confiteIndex) =>
                {
                  const forma = getAlcremieFormaAt(mixIndex, confiteIndex);
                  const nombreMostrado = getFormaDisplay(forma);

                  return (
                    <div key={`${mix.en}-${confite.en}`} className="alcremie-cell">
                      {forma ? (
                        <div className="forma-card forma-card--mini">
                          <div className="contenedor-ImgPkm-Forma alcremie-mini-sprite">
                            <ImgPokemon
                              imgNormal={getFormaImgNormal(forma)}
                              imgShiny={getFormaImgShiny(forma)}
                              altText={nombreMostrado || "Forma Pokemon"}
                            />
                          </div>

                          <div className="nombresitoForma">
                            <div className="nombre-forma alcremie-mini-name">
                              {nombreMostrado}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="alcremie-empty-cell">-</div>
                      )}
                    </div>
                  );

                })}
              </React.Fragment>
            ))}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor-formas">
      
      {/* Descripciones arriba */}
      {!shouldInlineDesc && descripciones.length > 0 && (
        <div className="contenedor-descripciones">
          {descripciones.map((forma, i) =>
          {
            const spriteId = (forma.idForma !== null && forma.idForma !== undefined)
              ? Number(forma.idForma)
              : null;

            const spriteNormalUrlValue = spriteId ? spriteUrl(spriteId) : "";
            const spriteShinyUrlValue = spriteId ? spriteShinyUrl(spriteId) : "";

            return (
              <div key={i} className="descripcion-row">
                
                {/* Sprite de la Forma */}
                <div className="descripcion-sprite">
                  <SpriteModal
                    normalUrl={spriteNormalUrlValue}
                    shinyUrl={spriteShinyUrlValue}
                    altText={forma.displayForma || "Forma"}
                    thumbSize={80}
                  />
                </div>

                {/* Mini desc de la Forma */}
                <p className="descripcion-forma descripcion-externa">
                  <strong className="desc-titulo">
                    {renderDisplayTitle(forma.displayForma)}
                  </strong>
                  <span className="desc-colon">:</span> {forma.descForma}
                </p>

              </div>
            );

          })}
        </div>
      )}

      {/* Tarjetas, una por cada Forma */}
      <div className="contenedor-formas-filas">
        {formasSafe.map((forma, index) =>
        {
          if(!forma) return null;

          const tiposForma = Array.isArray(forma.typesForma) ? forma.typesForma : [];
          const hasTipos = tiposForma.length > 0;
          const hasPesoAltura =
            (forma.heightForma !== -1 && forma.heightForma !== null && forma.heightForma !== undefined) ||
            (forma.weightForma !== -1 && forma.weightForma !== null && forma.weightForma !== undefined);
          const hasColor = !!forma.colorForma;
          const habsForma = Array.isArray(forma.abilitiesForma) ? forma.abilitiesForma : [];
          const hasHabs = habsForma.length > 0;
          const canNavigate = !!forma.enableNavigationForma;

          const nombreMostrado = String(forma.displayForma || "").trim();
          const apiNameForma = String(forma.apiNameForma || "").trim().toLowerCase();
          const gender = detectGenderFromName(nombreMostrado);
          const nombreBase = stripGenderFromName(nombreMostrado);
          const tipoFormaWidth = tiposWidthByForma[forma.idForma ?? index] || 0;

          function handleClickNombre()
          {
            if(!canNavigate || !apiNameForma) return;
            navigate(pokemonRoute(encodeURIComponent(apiNameForma)));
          }

          return (
            <div key={forma.idForma || index} className="forma-card">
              
              {/* Imagen */}
              <div className="contenedor-ImgPkm-Forma">
                <ImgPokemon
                  imgNormal={forma.imgForma || "placeholder.png"}
                  imgShiny={forma.imgFormaShiny || forma.imgForma || "placeholder.png"}
                  altText={nombreMostrado || "Forma Pokemon"}
                />
              </div>

              {/* Stack uniforme */}
              <div className="forma-stack">
                
                {/* Nombre */}
                <div className="nombresitoForma">
                  {canNavigate ? (
                    <div
                      className="nombre-forma nombre-forma-clickable"
                      role="button"
                      tabIndex={0}
                      title={`Ver datos de Pokémon: ${nombreMostrado}`}
                      onClick={handleClickNombre}
                      onKeyDown={(e) =>
                      {
                        if(e.key === "Enter" || e.key === " ")
                        {
                          e.preventDefault();
                          handleClickNombre();
                        }
                      }}
                    >
                      {nombreBase}
                      {gender === "male" && <IoMdMale className="genderForma maleForma" />}
                      {gender === "female" && <IoMdFemale className="genderForma femaleForma" />}
                    </div>
                  ) : (
                    <div className="nombre-forma">
                      {nombreBase}
                      {gender === "male" && <IoMdMale className="genderForma maleForma" />}
                      {gender === "female" && <IoMdFemale className="genderForma femaleForma" />}
                    </div>
                  )}
                </div>

                {/* Tipos */}
                {hasTipos && (
                  <div className="slot">
                    <div
                      className={`contenedor-tiposForma ${tiposForma.length === 2 ? "tipos-dobles" : ""}`}
                      style={tipoFormaWidth ? { "--tipo-forma-item-width": `${tipoFormaWidth}px` } : undefined}
                    >
                      {tiposForma.map((tipo) => (
                        <div
                          key={`${apiNameForma}-${tipo}`}
                          className="tipo-bg-forma"
                          style={{ backgroundColor: getTipoBg(tipo) }}
                          title={tipo}
                        >
                          <Tipo
                            tipo={tipo}
                            size="medium"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Peso y Altura */}
                {hasPesoAltura && (
                  <div className="slot">
                    <PesoYAlturaPkm
                      altura={forma.heightForma !== -1 && forma.heightForma !== null && forma.heightForma !== undefined ? `${forma.heightForma}m` : undefined}
                      peso={forma.weightForma !== -1 && forma.weightForma !== null && forma.weightForma !== undefined ? `${forma.weightForma}Kg` : undefined}
                      size="medium"
                      mostrarTexto={false}
                    />
                  </div>
                )}

                {/* Color */}
                {hasColor && (
                  <div className="slot">
                    <div className="contenedorColorFormaPkm">
                      <ColorPkm
                        color={forma.colorForma}
                        size="medium"
                      />
                    </div>
                  </div>
                )}

                {/* Habilidades */}
                {hasHabs && (
                  <div className="slot">
                    <div className="contenedorDatosFormaPkm">
                      <HabilidadesPkm
                        habilidades={habsForma}
                        isHidden={false}
                        size="medium"
                      />
                    </div>
                  </div>
                )}

                {shouldInlineDesc && forma.descForma && (
                  <p className="descripcion-forma">
                    <strong>{forma.descForma}</strong>
                  </p>
                )}

              </div>

            </div>
          );

        })}
      </div>

    </div>
  );

}