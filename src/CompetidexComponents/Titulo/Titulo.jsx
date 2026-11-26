//** src\CompetidexComponents\Titulo\Titulo.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOGO_COMPETIDEX } from "../../utils/competidexMeta";
import { preloadCachedImage } from "../../utils/competidexImgCache";
import { inicioRoute } from "../../utils/competidexRoutes";
import "./Titulo.css";

export default function Titulo()
{
    const navigate = useNavigate();

    useEffect(() =>
    {
        preloadCachedImage(LOGO_COMPETIDEX);

    }, []);

    return (
        <>
            {/* Logo de la Pagina */}
            <button
                type="button"
                className="titulo-homeButton"
                onClick={() => navigate(inicioRoute())}
                title="Ir al inicio"
                aria-label="Ir al inicio"
            >
                <img
                    className="logo"
                    src={LOGO_COMPETIDEX}
                    alt="logo-competidex"
                />
            </button>
        </>
    );

}