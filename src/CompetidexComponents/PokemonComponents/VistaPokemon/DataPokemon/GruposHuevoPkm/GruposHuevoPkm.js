//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\GruposHuevoPkm\GruposHuevoPkm.js

import React, { useMemo } from "react";
import "./GruposHuevoPkm.css";

export default function GruposHuevoPkm({ gruposHuevo = [], size = "normal" })
{
    const items = useMemo(() =>
    {
        return (Array.isArray(gruposHuevo) ? gruposHuevo : [])
        .map(function(item)
        {
            return {
                apiKey: String(item?.apiKey || "").trim().toLowerCase(),
                labelES: String(item?.labelES || "").trim()
            };
        })
        .filter(function(item)
        {
            return !!item.labelES;
        });

    }, [gruposHuevo]);

    const sizeClass = `gruposHuevoPkmComponent-container-${size}`;

    return (
        <div className={`gruposHuevoPkmComponent-container ${sizeClass}`}>
            
            {/* Titulo */}
            <div className="gruposHuevoPkmComponent-title">
                <span className="gruposHuevoPkmComponent-title-text">
                    {items.length > 1 ? "Grupos" : "Grupo"}
                </span>{" "}
                <span className="gruposHuevoPkmComponent-title-text">Huevo</span>
                <span>:</span>
            </div>

            {/* Valor/Valores */}
            <div className="gruposHuevoPkmComponent-lista">
                {items.length > 0 ? (
                    items.map(function(item, i)
                    {
                        return (
                            <div key={`${item.apiKey || item.labelES || i}`} className="gruposHuevoPkmComponent-item">
                                <span className="gruposHuevoPkmComponent-label">
                                    {item.labelES}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="gruposHuevoPkmComponent-item">Ninguno</div>
                )}
            </div>

        </div>
    );

}