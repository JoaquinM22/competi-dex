//** src\CompetidexComponents\Titulo\Titulo.js

import React, { useEffect } from "react";
import { LOGO_COMPETIDEX } from "../../utils/competidexMeta";
import { preloadCachedImage } from "../../utils/competidexImgCache";
import "./Titulo.css";

export default function Titulo()
{
    useEffect(() =>
    {
        preloadCachedImage(LOGO_COMPETIDEX);

    }, []);

    return (
        <>
            {/* Logo de la Pagina */}
            <img
                className="logo"
                src={LOGO_COMPETIDEX}
                alt="logo-competidex"
            />
        </>
    );

}