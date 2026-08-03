//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\SpriteItem\SpriteItem.js

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdDownload } from "react-icons/md";
import { itemSpriteUrl } from "../../../../../config/endpoints";
import { ERROR_404_SPRITE_IMG } from "../../../../../utils/competidexMeta";
import { preloadCachedImage, probeCachedImage } from "../../../../../utils/competidexImgCache";
import "./SpriteItem.css";

function slugifyItemName(name)
{
  if (!name) name = "item";
  let s = String(name).toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/’|‘|‚|‛|'/g, "");
  s = s.replace(/[^a-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");

  return s || "item";
}

function resolveThumbSize(size)
{
  if(typeof size === "number" && isFinite(size) && size > 0)
  {
    return size;
  }

  switch (String(size || "medium").toLowerCase())
  {
    case "small": return 72;
    case "medium": return 120;
    case "normal": return 150;
    case "large": return 220;
    default: return 120;
  }

}

export default function SpriteItem({ apiName, size = "medium", altText })
{
  const [open, setOpen] = useState(false);
  const [dlOpen, setDlOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ok, setOk] = useState(true);

  const probeCacheRef = useRef(new Map());

  const thumbSize = resolveThumbSize(size);
  const spriteUrl = itemSpriteUrl(apiName || "");
  const finalAlt = altText || apiName || "Item";

  useEffect(function()
  {
    if(spriteUrl) preloadCachedImage(spriteUrl);

  }, [spriteUrl]);

  useEffect(function()
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
      if(document.body.dataset.prevOverflowItem == null)
      {
        document.body.dataset.prevOverflowItem = document.body.style.overflow || "";
      }

      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");

    }else
    {
      document.body.style.overflow = document.body.dataset.prevOverflowItem || "";
      delete document.body.dataset.prevOverflowItem;
      document.body.classList.remove("modal-open");
    }

    return function(){
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = document.body.dataset.prevOverflowItem || "";
      delete document.body.dataset.prevOverflowItem;
      document.body.classList.remove("modal-open");
    };

  }, [open]);

  useEffect(function()
  {
    setOk(true);
    setDlOpen(false);

  }, [apiName, altText, size]);

  async function abrir()
  {
    setOpen(true);
    const exists = await probeCachedImage(spriteUrl || "");
    setOk(!!exists);

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
    return new Promise(function(resolve, reject)
    {
      const img = new Image();
      img.onload = function() { resolve(img); };
      img.onerror = function() { reject(new Error("No se pudo cargar imagen")); };
      img.src = URL.createObjectURL(blob);
    });

  }

  async function downloadAtSize(targetSize)
  {
    if (isDownloading || !ok) return;

    try
    {
      setIsDownloading(true);

      const resp = await fetch(spriteUrl, { cache: "force-cache" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);

      const blob = await resp.blob();

      const safeName = slugifyItemName(apiName);
      const outName =
        safeName +
        (targetSize === 96 ? "" : "_" + targetSize + "x" + targetSize) +
        ".png";

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
      console.error("Error descargando sprite de item:", e);

    }finally
    {
      setIsDownloading(false);
      setDlOpen(false);
    }

  }

  function handleDownload()
  {
    if (isDownloading || !ok) return;
    setDlOpen(true);
  }

  return (
    <>
      
      {/* Sprite del Objeto */}
      <div
        className="itemSpriteThumbWrap"
        onClick={abrir}
        title="Abrir sprite"
        role="button"
        tabIndex={0}
        onKeyDown={function(e)
        {
          if(e.key === "Enter" || e.key === " ")
          {
            e.preventDefault();
            abrir();
          }

        }}
        style={{
          width: thumbSize + 28 + "px",
          height: thumbSize + 28 + "px"
        }}
      >
        <img
          className="itemSpriteThumb"
          src={spriteUrl || ERROR_404_SPRITE_IMG}
          alt={finalAlt}
          width={thumbSize}
          height={thumbSize}
          loading="lazy"
          decoding="async"
          onError={function(e)
          {
            e.currentTarget.src = ERROR_404_SPRITE_IMG;
          }}
          style={{
            width: thumbSize + "px",
            height: thumbSize + "px",
            imageRendering: "pixelated",
            display: "block",
            margin: "0 auto"
          }}
        />
      </div>

      {/* Modal abierto: Sprite en grande con boton de descarga */}
      {open && createPortal(
        <div
          className="itemSpriteModalOverlay"
          onClick={function()
          {
            setDlOpen(false);
            setOpen(false);
          }}
        >
          <div
            className="itemSpriteModalContent"
            onClick={function(e) { e.stopPropagation(); }}
            role="dialog"
            aria-modal="true"
          >
            
            {/* Boton descargar Sprite */}
            <div className="itemSpriteModalTop">
              <div className="itemSpriteDownloadWrap">
                
                {/* Boton descargar Sprite */}
                <button
                  type="button"
                  className="itemSpriteBtn"
                  onClick={handleDownload}
                  disabled={isDownloading || !ok}
                  title={ok ? "Descargar" : "Sin imagen disponible"}
                  aria-label={ok ? "Descargar sprite del item" : "Sin imagen disponible"}
                >
                  {isDownloading ? "..." : <MdDownload size={22} />}
                </button>

                {/* Mini modal para elegir el tamaño del sprite a descargar */}
                {dlOpen ? (
                  <div
                    className="itemSpriteDlPopover"
                    onClick={function(e) { e.stopPropagation(); }}
                  >
                    <div className="itemSpriteDlTitle">Descargar Sprite</div>

                    {/* 96x96 (Original) */}
                    <button
                      type="button"
                      className="itemSpriteDlOpt"
                      onClick={function() { downloadAtSize(96); }}
                      disabled={isDownloading}
                    >
                      Original (96×96)
                    </button>

                    {/* 150x150 */}
                    <button
                      type="button"
                      className="itemSpriteDlOpt"
                      onClick={function() { downloadAtSize(150); }}
                      disabled={isDownloading}
                    >
                      150×150
                    </button>

                    {/* 350x350 */}
                    <button
                      type="button"
                      className="itemSpriteDlOpt"
                      onClick={function() { downloadAtSize(350); }}
                      disabled={isDownloading}
                    >
                      350×350
                    </button>

                    {/* 750x750 */}
                    <button
                      type="button"
                      className="itemSpriteDlOpt"
                      onClick={function() { downloadAtSize(750); }}
                      disabled={isDownloading}
                    >
                      750×750
                    </button>

                    {/* Cancelar*/}
                    <button
                      type="button"
                      className="itemSpriteDlCancel"
                      onClick={function() { setDlOpen(false); }}
                      disabled={isDownloading}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : null}

              </div>
            </div>

            {/* Sprite Objeto */}
            <div className="itemSpriteModalBody">
              {ok ? (
                <img
                  src={spriteUrl}
                  alt={finalAlt}
                  className="itemSpriteModalImg"
                  onError={function() {
                    setOk(false);
                  }}
                />
              ) : (
                <div className="itemSpriteFallback">
                  <img
                    src={ERROR_404_SPRITE_IMG}
                    alt="Imagen no disponible"
                    className="itemSpriteModalImg itemSpriteModalImg--fallback"
                    draggable="false"
                  />
                  <div className="itemSpriteFallbackTitle">NOT FOUND</div>
                  <div className="itemSpriteFallbackText">No se encontró el sprite del objeto</div>
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