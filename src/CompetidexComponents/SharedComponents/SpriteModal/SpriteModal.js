//** src\CompetidexComponents\SharedComponents\SpriteModal\SpriteModal.js

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdDownload } from "react-icons/md";
import { ERROR_404_SPRITE_IMG, SHINY_ICON_IMG } from "../../../utils/competidexMeta";
import { preloadCachedImage, probeCachedImage } from "../../../utils/competidexImgCache";
import "./SpriteModal.css";

function slugifyName(name, shinyFlag)
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
}

export default function SpriteModal({ normalUrl, shinyUrl, altText, thumbSize = 150 })
{
  const [open, setOpen] = useState(false);
  const [dlOpen, setDlOpen] = useState(false); // Mini pop up descarga
  const [isShiny, setIsShiny] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ok, setOk] = useState({ normal: true, shiny: true });
  const downloadWrapRef = useRef(null);

  useEffect(() =>
  {
    function onEsc(e)
    {
      if(e.key === "Escape")
      {
        setDlOpen(false);
        setOpen(false);
      }
    }

    if(open)
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

    return function(){
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = document.body.dataset.prevOverflow || "";
      delete document.body.dataset.prevOverflow;
      document.body.classList.remove("modal-open");
    };

  }, [open]);

  useEffect(() =>
  {
    setIsShiny(false);
    setOk({ normal: true, shiny: true });
    setDlOpen(false);
    preloadCachedImage(SHINY_ICON_IMG);

  }, [normalUrl, shinyUrl, altText]);

  useEffect(() =>
  {
    if(!dlOpen) return;

    function onPointerDown(e)
    {
      if(downloadWrapRef.current && !downloadWrapRef.current.contains(e.target))
      {
        setDlOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return function()
    {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };

  }, [dlOpen]);

  const hasNormalUrl = !!String(normalUrl || "").trim();
  const hasShinyUrl = !!String(shinyUrl || "").trim();

  async function abrir()
  {
    setOpen(true);
    const normalPromise = hasNormalUrl
      ? probeCachedImage(normalUrl || "")
      : Promise.resolve(false);
    const shinyPromise = hasShinyUrl
      ? probeCachedImage(shinyUrl || "")
      : Promise.resolve(false);

    const [okNormal, okShiny] = await Promise.all([normalPromise, shinyPromise]);
    setOk({ normal: !!okNormal, shiny: !!okShiny });
  }

  function urlActual()
  {
    return isShiny ? shinyUrl : normalUrl;
  }

  function okActual()
  {
    return isShiny ? ok.shiny : ok.normal;
  }

  function triggerDownload(blob, filename)
  {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(function()
    {
      URL.revokeObjectURL(blobUrl);

    }, 250);

  }

  function loadImageFromBlob(blob)
  {
    return new Promise(function (resolve, reject){
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("No se pudo cargar imagen")); };
      img.src = URL.createObjectURL(blob);
    });

  }

  async function downloadAtSize(targetSize)
  {
    if (isDownloading || !okActual()) return;

    try
    {
      setIsDownloading(true);

      const url = urlActual();
      const resp = await fetch(url, { cache: "force-cache" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);

      const blob = await resp.blob();

      const safeName = slugifyName(altText, isShiny);
      const outName =
        safeName +
        (targetSize === 96 ? "" : "_" + targetSize + "x" + targetSize) +
        ".png";

      // 96x96 = original
      if(targetSize === 96)
      {
        triggerDownload(blob, outName);
        return;
      }

      const img = await loadImageFromBlob(blob);

      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;

      ctx.clearRect(0, 0, targetSize, targetSize);

      ctx.drawImage(img, 0, 0, targetSize, targetSize);

      const outBlob = await new Promise(function(resolve)
      {
        canvas.toBlob(function(b)
        {
          resolve(b);

        }, "image/png");

      });

      if (!outBlob) throw new Error("No se pudo generar PNG");

      triggerDownload(outBlob, outName);

    }catch(e)
    {
      console.error("Error descargando sprite:", e);

    }finally
    {
      setIsDownloading(false);
      setDlOpen(false);
    }

  }

  function handleDownload()
  {
    if (isDownloading || !okActual()) return;
    setDlOpen(true);
  }

  return (
    <>
      {/* Imagen Sprite */}
      <img
        className="pokedexSpriteThumb"
        src={normalUrl || ERROR_404_SPRITE_IMG}
        alt={altText}
        width={thumbSize}
        height={thumbSize}
        loading="lazy"
        decoding="async"
        onClick={abrir}
        onError={(e) => (e.currentTarget.src = ERROR_404_SPRITE_IMG)}
        style={{
          width: thumbSize + "px",
          height: thumbSize + "px",
          imageRendering: "pixelated",
          cursor: "pointer",
          display: "block",
          margin: "0 auto",
        }}
      />

      {/* Pop Up Imagen + Acciones */}
      {open && createPortal(
        <div className="spriteModalOverlay" onClick={() => { setDlOpen(false); setOpen(false); }}>
          <div
            className="spriteModalContent"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >

            {/* Botones de Shiny + Descarga */}
            <div className="spriteModalTop">
              
              {/* Boton de Descarga + Mini Modal */}
              <div className="spriteDownloadWrap" ref={downloadWrapRef}>
                
                {/* Boton de Descarga */}
                <button
                  type="button"
                  className="spriteBtn"
                  onClick={handleDownload}
                  disabled={isDownloading || !okActual()}
                  title={okActual() ? "Descargar" : "Sin imagen disponible"}
                  aria-label={okActual() ? "Descargar sprite" : "Sin imagen disponible"}
                >
                  {isDownloading ? "..." : <MdDownload size={22} />}
                </button>

                {/* Mini popup para tamaño de descarga */}
                {dlOpen ? (
                  <div className="spriteDlPopover" onClick={(e) => e.stopPropagation()}>
                    <div className="spriteDlTitle">Descargar Sprite</div>

                    {/* 96x96 (Original) */}
                    <button
                      type="button"
                      className="spriteDlOpt"
                      onClick={() => downloadAtSize(96)}
                      disabled={isDownloading}
                    >
                      Original (96×96)
                    </button>

                    {/* 150x150 */}
                    <button
                      type="button"
                      className="spriteDlOpt"
                      onClick={() => downloadAtSize(150)}
                      disabled={isDownloading}
                    >
                      150×150
                    </button>

                    {/* 350x350 */}
                    <button
                      type="button"
                      className="spriteDlOpt"
                      onClick={() => downloadAtSize(350)}
                      disabled={isDownloading}
                    >
                      350×350
                    </button>

                    {/* 750x750 */}
                    <button
                      type="button"
                      className="spriteDlOpt"
                      onClick={() => downloadAtSize(750)}
                      disabled={isDownloading}
                    >
                      750×750
                    </button>

                    {/* Cancelar */}
                    <button
                      type="button"
                      title="Cancelar"
                      className="spriteDlCancel"
                      onClick={() => setDlOpen(false)}
                      disabled={isDownloading}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : null}

              </div>

              {/* Boton de Activar/Desactivar Shiny */}
              <button
                type="button"
                className={"spriteBtn " + (isShiny ? "active" : "")}
                onClick={() => setIsShiny(!isShiny)}
                disabled={isDownloading || (!hasNormalUrl && !hasShinyUrl)}
                title="Alternar shiny"
                aria-label="Alternar shiny"
              >
                <img src={SHINY_ICON_IMG} alt="Shiny" className="spriteShinyIcon" />
              </button>

            </div>

            {/* Imagen Sprite */}
            <div className="spriteModalBody">
              {okActual() ? (
                <img
                  src={urlActual()}
                  alt={altText}
                  className="spriteModalImg"
                  onError={() =>
                    setOk(function(p)
                    {
                      return isShiny ? { ...p, shiny: false } : { ...p, normal: false };
                    })
                  }
                />
              ) : (
                <div className="spriteFallback">
                  <img
                    src={ERROR_404_SPRITE_IMG}
                    alt="Imagen no disponible"
                    className="spriteModalImg spriteModalImg--fallback"
                    draggable="false"
                  />
                  <div className="spriteFallbackTitle">NOT FOUND</div>
                  <div className="spriteFallbackText">No se encontró el sprite</div>
                </div>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

    </>
  );

}