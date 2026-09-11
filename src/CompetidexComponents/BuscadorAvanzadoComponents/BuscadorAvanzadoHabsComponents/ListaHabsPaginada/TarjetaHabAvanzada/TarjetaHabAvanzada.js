//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoHabsComponents\ListaHabsPaginada\TarjetaHabAvanzada\TarjetaHabAvanzada.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { formatNumberWithDots } from "../../../../../utils/competidexMeta";
import { abilityRoute } from "../../../../../utils/competidexRoutes";
import GeneracionPkm from "../../../../SharedComponents/GeneracionPkm/GeneracionPkm";
import "./TarjetaHabAvanzada.css";

function normalizeAbilityId(value)
{
    if(value === null || value === undefined || value === "") return null;

    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
}

export default function TarjetaHabAvanzada({ ability })
{
    const navigate = useNavigate();

    const apiName = String(ability?.apiName || "").trim().toLowerCase();

    const id = normalizeAbilityId(ability?.id);
    const display = String(ability?.display || apiName || "Habilidad").trim();
    const generation = String(ability?.generation || "").trim();
    const descHab = ability?.descES || "-";

    const cardClass = "tarjetaHabAvanzadaComponent" + (id ? "" : " tarjetaHabAvanzadaComponent--sin-id");

    function handleClickNombre()
    {
        if(!apiName) return;

        navigate(abilityRoute(encodeURIComponent(apiName)));
    }

    return (
        <article
            className={cardClass}
            title={`Ver datos de habilidad: ${display}`}
        >

            {/* Cuerpo de la tarjeta */}
            <div className="tarjetaHabAvanzadaComponent-body">

                <GeneracionPkm
                    generacion={generation}
                    size={"small"}
                    backgroundColor={"#323741"}
                />

                {/* ID de la Habilidad */}
                <div className="tarjetaHabAvanzadaComponent-id">
                    {id ? `#${formatNumberWithDots(id)}` : "#-"}
                </div>

                {/* Nombre de la Habilidad */}
                <div
                    className="tarjetaHabAvanzadaComponent-name tarjetaHabAvanzadaComponent-nameClickable"
                    role="button"
                    tabIndex={0}
                    title={`Ver datos de habilidad: ${display}`}
                    onClick={handleClickNombre}
                    onKeyDown={(e) =>
                    {
                        if(e.key === "Enter" || e.key === " ")
                        {
                            e.preventDefault();
                            handleClickNombre();
                        }
                    }}
                >
                    {display}
                </div>

                {/* Desc de la Habilidad */}
                <div className="tarjetaHabAvanzadaComponent-descContainer">
                    {descHab}
                </div>

            </div>

        </article>
    );

}