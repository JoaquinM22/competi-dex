//** src\CompetidexComponents\SharedComponents\LoadingPkm\LoadingPkm.js

import React, { useEffect } from "react";
import { PIKACHU_RUNING_GIF } from "../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import "./LoadingPkm.css";

export default function LoadingPkm({ inline = false, className = "" })
{
  useEffect(() =>
  {
    if(inline) return;

    // Bloquear scroll
    document.body.style.overflow = "hidden";

    // Restaurar al desmontar
    return () => {
      document.body.style.overflow = "auto";
    };

  }, [inline]);

  useEffect(() =>
  {
    preloadCachedImage(PIKACHU_RUNING_GIF);

  }, []);

  return (
    <div className={"loading-container" + (inline ? " inline" : "") + (className ? " " + className : "")}>
      <p className="loading-text">Cargando...</p>
      <img
        src={PIKACHU_RUNING_GIF}
        alt="Pikachu corriendo"
        className="pikachu-spinner"
      />
    </div>
  );
  
}