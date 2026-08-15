//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\ImgPokemon\ImgPokemon.js

import React, { useState, useEffect } from "react";
import { MdDownload } from "react-icons/md";
import { createPortal } from "react-dom";
import { ERROR_404_IMG, SHINY_ICON_IMG } from "../../../../../utils/competidexMeta";
import { preloadCachedImage, probeCachedImage } from "../../../../../utils/competidexImgCache";
import "./ImgPokemon.css";

export default function ImgPokemon({ imgNormal, imgShiny, altText, ancho = null, alto = null, encogerSiChico = false })
{
  const [esShiny, setEsShiny] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [okModal, setOkModal] = useState({ normal: true, shiny: true });

  const slugifyName = (name, shinyFlag) =>
  {
    let s = String(name || "pokemon").toLowerCase();
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    s = s
      .replace(/♂/g, " macho ")
      .replace(/♀/g, " hembra ")
      .replace(/&/g, " y ")
      .replace(/’|‘|‚|‛|'/g, "");
    s = s.replace(/[^a-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");

    if(shinyFlag) s += "_shiny";
    return s || (shinyFlag ? "pokemon_shiny" : "pokemon");
  };

  useEffect(() =>
  {
    preloadCachedImage(imgNormal || "");
    preloadCachedImage(imgShiny || "");
    preloadCachedImage(SHINY_ICON_IMG);

  }, [imgNormal, imgShiny]);

  useEffect(() => setEsShiny(false), [imgNormal, imgShiny, altText]);

  useEffect(() =>
  {
    const onEsc = (e) => e.key === "Escape" && setModalAbierto(false);

    if(modalAbierto)
    {
      document.addEventListener("keydown", onEsc);

      if(document.body.dataset.prevOverflow == null)
      {
        document.body.dataset.prevOverflow = document.body.style.overflow || "";
      }

      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");

    }else
    {
      document.body.style.overflow = document.body.dataset.prevOverflow || "";
      delete document.body.dataset.prevOverflow;
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = document.body.dataset.prevOverflow || "";
      delete document.body.dataset.prevOverflow;
      document.body.classList.remove("modal-open");
    };

  }, [modalAbierto]);

  const handleDownload = async() =>
  {
    const okActual = esShiny ? okModal.shiny : okModal.normal;
    if(isDownloading || !okActual) return;

    try
    {
      setIsDownloading(true);

      const url = esShiny ? imgShiny : imgNormal;
      const resp = await fetch(url);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const safeName = slugifyName(altText, esShiny);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${safeName}.png`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

    }catch(e)
    {
      console.error("Error descargando imagen:", e);

    }finally
    {
      setIsDownloading(false);
    }
  };

  const tieneMedidasPersonalizadas = Boolean(ancho || alto);
  const wrapperStyle = tieneMedidasPersonalizadas
    ? {
        width: ancho ?? undefined,
        height: alto ?? undefined,
        maxWidth: "unset",
        aspectRatio: ancho && alto ? "auto" : "1 / 1",
      }
    : undefined;

  const abrirModal = async() =>
  {
    setModalAbierto(true);

    const [okN, okS] = await Promise.all([
      probeCachedImage(imgNormal || ""),
      probeCachedImage(imgShiny || ""),
    ]);

    setOkModal({ normal: !!okN, shiny: !!okS });
  };

  const urlActual = esShiny ? imgShiny : imgNormal;
  const okActual = esShiny ? okModal.shiny : okModal.normal;

  return (
    <div className="contenedorImagen">
      
      {/* Vista normal */}
      <div
        className={`fotoWrapper ${tieneMedidasPersonalizadas ? "fotoWrapper--custom" : ""}`}
        style={wrapperStyle}
      >

        <img
          className={`fotoPkm ${tieneMedidasPersonalizadas ? "fotoPkm--fill" : ""}`}
          src={esShiny ? (imgShiny || ERROR_404_IMG) : (imgNormal || ERROR_404_IMG)}
          alt={altText}
          crossOrigin="anonymous"
          onClick={abrirModal}
          onError={(e) => (e.currentTarget.src = ERROR_404_IMG)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          loading="lazy"
          decoding="async"
        />

        <div className="botonesWrapper">
          <button
            className={`botonShiny ${esShiny ? "activo" : ""}`}
            onClick={() => setEsShiny(!esShiny)}
            disabled={isDownloading}
            aria-label="Alternar shiny"
            title="Alternar shiny"
          >
            <img src={SHINY_ICON_IMG} alt="Shiny" className="iconoBoton" />
          </button>
        </div>

      </div>

      {/* Modal */}
      {modalAbierto && createPortal(
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modalImgWrap">
              
              <div className="botonesWrapper modalButtons">
                
                <button
                  className="botonDescargar"
                  onClick={handleDownload}
                  disabled={isDownloading || !okActual}
                  aria-label={okActual ? "Descargar imagen" : "Sin imagen disponible"}
                  title={okActual ? "Descargar" : "Sin imagen disponible"}
                >
                  {isDownloading ? "..." : <MdDownload color="white" size={22} />}
                </button>

                <button
                  className={`botonShiny ${esShiny ? "activo" : ""}`}
                  onClick={() => setEsShiny(!esShiny)}
                  disabled={isDownloading}
                  aria-label="Alternar shiny"
                  title="Alternar shiny"
                >
                  <img src={SHINY_ICON_IMG} alt="Shiny" className="iconoBoton" />
                </button>

              </div>

              {okActual ? (
                <img
                  src={urlActual}
                  alt={altText}
                  crossOrigin="anonymous"
                  className="imagen-ampliada"
                  onError={() =>
                    setOkModal((p) => (esShiny ? { ...p, shiny: false } : { ...p, normal: false }))
                  }
                />
              ) : (
                <div className="fallbackCard">
                  <img src={ERROR_404_IMG} alt="Imagen no disponible" className="fallbackImage" />
                  <div className="fallbackText big">NOT FOUND</div>
                  <div className="fallbackText">No se encontró la foto</div>
                </div>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );

}