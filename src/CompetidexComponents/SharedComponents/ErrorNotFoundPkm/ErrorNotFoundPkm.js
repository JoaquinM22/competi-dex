//** src\CompetidexComponents\SharedComponents\ErrorNotFoundPkm\ErrorNotFoundPkm.js

import React, { useEffect } from "react";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import { ERROR_404_IMG } from "../../../utils/competidexMeta";
import "./ErrorNotFoundPkm.css";

export default function ErrorNotFoundPkm({ error })
{
    useEffect(() =>
    {
        preloadCachedImage(ERROR_404_IMG);

    }, []);

    if (!error) return null;

    return (
        <div className="error-container">
            
            {/* Titulo */}
            <h1 className="error-titulo">ERROR</h1>
            
            {/* Foto Error */}
            <img 
                src={ERROR_404_IMG} 
                alt="Error Pokémon" 
                className="error-imagen"
            />

            {/* Texto grande "Not Found" */}
            <h2 className="error-subtitulo">NOT FOUND</h2>

            {/* Texto de detalle */}
            <p className="error-texto">{error}</p>

        </div>
    );

}