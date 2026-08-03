//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\EsDeContacto\EsDeContacto.js

import React, { useMemo } from "react";
import "./EsDeContacto.css";

function normalizeContactValue(v)
{
    if(v === true) return "Si";
    if(v === false) return "No";
    
    return "-";
}

export default function EsDeContacto({ isContact = null, size = "normal" })
{
    const txt = useMemo(() => normalizeContactValue(isContact), [isContact]);
    const sizeClass = `contactmov-container-${size}`;

    return (
        <div className={`contactmov-container ${sizeClass}`}>
            <div className="contactmov-row">
                
                {/* Titulo */}
                <div className="contactmov-label">
                    <span className="contactmov-underline">Contacto</span>
                    <span>:</span>
                </div>

                {/* Valor */}
                <div className="contactmov-value">
                    {txt}
                </div>

            </div>
        </div>
    );

}