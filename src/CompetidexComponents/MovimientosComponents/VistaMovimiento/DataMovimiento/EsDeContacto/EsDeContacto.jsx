//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\EsDeContacto\EsDeContacto.js

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    advancedMovesSearchRouteWithFilters,
    getAdvancedSearchTabConfig
} from "../../../../../utils/competidexRoutes";
import "./EsDeContacto.css";

function normalizeContactValue(v)
{
    if(v === true) return "Sí";
    if(v === false) return "No";
    
    return "-";
}

export default function EsDeContacto({ isContact = null, size = "normal", enableAdvancedSearchLink = false })
{
    const navigate = useNavigate();
    const txt = useMemo(() => normalizeContactValue(isContact), [isContact]);
    const movsAdvancedSearchTabData = getAdvancedSearchTabConfig("movimientos");
    const movsAdvancedSearchDescription = movsAdvancedSearchTabData?.description || "Movimientos";
    const canNavigateToContact = !!enableAdvancedSearchLink && typeof isContact === "boolean";
    const sizeClass = `contactmov-container-${size}`;
    const contactSearchLabel = isContact === true
        ? "Buscar " + movsAdvancedSearchDescription + " que hacen Contacto"
        : "Buscar " + movsAdvancedSearchDescription + " que no hacen Contacto";

    function handleContactClick()
    {
        if(!canNavigateToContact) return;

        navigate(advancedMovesSearchRouteWithFilters({
            filters: [
                {
                    field: "isContact",
                    operator: "eq",
                    value: isContact
                }
            ],
            sort: {
                field: "id",
                direction: "asc"
            }
        }));
    }

    function handleContactKeyDown(event)
    {
        if(!canNavigateToContact) return;
        if(event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        handleContactClick();
    }

    return (
        <div className={`contactmov-container ${sizeClass}`}>
            <div className="contactmov-row">
                
                {/* Titulo */}
                <div className={(txt === "Sí") ? "contactmov-label contactmov-trueLabelAndValue" : "contactmov-label"}>
                    <span className="contactmov-underline">Contacto</span>
                    <span>:</span>
                </div>

                {/* Valor */}
                <div className={(txt === "Sí") ? "contactmov-value contactmov-trueLabelAndValue" : "contactmov-value"}>
                    <span
                        className={"contactmov-valueAction" + (canNavigateToContact ? " contactmov-valueAction-clickable" : "")}
                        onClick={canNavigateToContact ? handleContactClick : undefined}
                        role={canNavigateToContact ? "button" : undefined}
                        tabIndex={canNavigateToContact ? 0 : undefined}
                        onKeyDown={handleContactKeyDown}
                        aria-label={canNavigateToContact ? contactSearchLabel : undefined}
                        title={canNavigateToContact ? contactSearchLabel : undefined}
                    >
                        {txt}
                    </span>
                </div>

            </div>
        </div>
    );

}