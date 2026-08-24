//** src\CompetidexComponents\BuscadorAvanzadoPkmComponents\VistaBuscadorAvanzadoPkm.js

import React from "react";
import "./VistaBuscadorAvanzadoPkm.css";

export default function VistaBuscadorAvanzadoPkm()
{
    return (
        <div className="vistaBuscadorAvanzadoPkm-page">
            <div className="vistaBuscadorAvanzadoPkm-container">

                {/* Titulo */}
                <div className="vistaBuscadorAvanzadoPkm-titulo-wrapper">
                    <h1 className="vistaBuscadorAvanzadoPkm-title">
                        Buscador Avanzado
                    </h1>
                </div>

                {/* Data Paginada */}
                <div className="vistaBuscadorAvanzadoPkm-data">
                                  
                    {/* Lista de Pokémon */}
                    <div className="vistaBuscadorAvanzadoPkm-panel">
                        
                    </div>

                </div>

            </div>
        </div>
    );
}