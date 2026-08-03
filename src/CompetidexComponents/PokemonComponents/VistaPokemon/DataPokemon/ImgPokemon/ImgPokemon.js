//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\ImgPokemon\ImgPokemon.js

import React, { useState, useEffect, useRef } from "react";
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

  const [natural, setNatural] = useState({
    normal: { w: 0, h: 0 },
    shiny: { w: 0, h: 0 },
  });

  const [box, setBox] = useState({ w: 0, h: 0 });

  const wrapRef = useRef(null);

  const slugifyName = (name, shinyFlag) =>
  {
    if (!name) name = "pokemon";
    let s = String(name).toLowerCase();
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    s = s
      .replace(/♂/g, " macho ")
      .replace(/♀/g, " hembra ")
      .replace(/&/g, " y ")
      .replace(/’|‘|‚|‛|'/g, "");
    s = s.replace(/[^a-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
    
    if (shinyFlag) s += "_shiny";
    
    return s || (shinyFlag ? "pokemon_shiny" : "pokemon");

  };

  // Precarga para tomar tamaños
  useEffect(() =>
  {
    let cancelled = false;

    const preload = async (url, key) =>
    {
      if (!url) return;

      const img = await preloadCachedImage(url);
      if(cancelled || !img) return;

      setNatural((prev) => ({
        ...prev,
        [key]: { w: img.naturalWidth || 0, h: img.naturalHeight || 0 },
      }));
    };

    preload(imgNormal, "normal");
    preload(imgShiny, "shiny");
    preloadCachedImage(SHINY_ICON_IMG);

    return () =>
    {
      cancelled = true;
    };

  }, [imgNormal, imgShiny]);

  useEffect(() =>
  {
    if(!wrapRef.current) return;

    const ro = new ResizeObserver(([entry]) =>
    {
      const cr = entry.contentRect;
      setBox({ w: cr.width, h: cr.height });
    });

    ro.observe(wrapRef.current);

    return () => ro.disconnect();

  }, [wrapRef]);

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

  useEffect(() => setEsShiny(false), [imgNormal, imgShiny, altText]);

  const onImgLoad = (e) =>
  {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    
    setNatural((prev) =>
      esShiny ? { ...prev, shiny: { w, h } } : { ...prev, normal: { w, h } }
    );

  };

  const computeRenderSize = () =>
  {
    const { w: nW, h: nH } = esShiny ? natural.shiny : natural.normal;
    if (!nW || !nH || !box.w || !box.h) return { w: "100%", h: "100%" };
    const scale = Math.min(box.w / nW, box.h / nH, 1);
    
    return { w: Math.floor(nW * scale), h: Math.floor(nH * scale) };
  };

  const renderSize = computeRenderSize();

  const handleDownload = async() =>
  {
    const okActual = esShiny ? okModal.shiny : okModal.normal;
    if (isDownloading || !okActual) return;

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
        ref={wrapRef}
      >
        <img
          className={`fotoPkm ${tieneMedidasPersonalizadas ? "fotoPkm--fill" : ""}`}
          src={esShiny ? (imgShiny || ERROR_404_IMG) : (imgNormal || ERROR_404_IMG)}
          alt={altText}
          onClick={abrirModal}
          onLoad={onImgLoad}
          onError={(e) => (e.currentTarget.src = ERROR_404_IMG)}
          style={{
            width: typeof renderSize.w === "number" ? `${renderSize.w}px` : renderSize.w,
            height: typeof renderSize.h === "number" ? `${renderSize.h}px` : renderSize.h,
            objectFit: "contain",
          }}
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