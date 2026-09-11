//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoItemsComponents\ListaItemsPaginada\TarjetaItemAvanzado\TarjetaItemAvanzado.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatNumberWithDots, getCategoryItemLabelEs } from "../../../../../utils/competidexMeta";
import { itemRoute } from "../../../../../utils/competidexRoutes";
import SpriteItem from "../../../../ItemsComponents/VistaItem/DataItem/SpriteItem/SpriteItem";
import TituloMasValorPkm from "../../../../SharedComponents/TituloMasValorPkm/TituloMasValorPkm";
import ResumenItemModal from "../ResumenItemModal/ResumenItemModal";
import "./TarjetaItemAvanzado.css";

function normalizeItemId(value)
{
    if(value === null || value === undefined || value === "") return null;

    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
}

export default function TarjetaItemAvanzado({ item })
{
    const navigate = useNavigate();
    const [summaryOpen, setSummaryOpen] = useState(false);

    const apiName = String(item?.apiName || "").trim().toLowerCase();

    const id = normalizeItemId(item?.id);
    const display = String(item?.display || apiName || "Objeto").trim();
    const categoryItem = getCategoryItemLabelEs(String(item?.category || "-").trim());

    const cardClass = "tarjetaItemAvanzadoComponent" + (id ? "" : " tarjetaItemAvanzadoComponent--sin-id");

    function handleOpenSummary()
    {
        setSummaryOpen(true);
    }

    function handleCloseSummary()
    {
        setSummaryOpen(false);
    }

    function handleClickNombre()
    {
        if(!apiName) return;

        navigate(itemRoute(encodeURIComponent(apiName)));
    }

    return (
        <article
            className={cardClass}
            onClick={handleOpenSummary}
            role="button"
            tabIndex={0}
            title={`Ver resumen de objeto: ${display}`}
            onKeyDown={(e) =>
            {
                if(e.key === "Enter" || e.key === " ")
                {
                    e.preventDefault();
                    handleOpenSummary();
                }
            }}
        >

            {/* Cuerpo de la tarjeta */}
            <div className="tarjetaItemAvanzadoComponent-body">

                {/* Sprite del Objeto */}
                <div className="tarjetaItemAvanzadoComponent-spriteWrap">
                    <SpriteItem
                        apiName={apiName}
                        altText={display}
                        thumbSize={96}
                        disabledModal={true}
                        backGroundColorItemContainer="#323741"
                    />
                </div>

                {/* ID del Objeto */}
                <div className="tarjetaItemAvanzadoComponent-id">
                    {id ? `#${formatNumberWithDots(id)}` : "#-"}
                </div>

                {/* Nombre del Objeto */}
                <div
                    className="tarjetaItemAvanzadoComponent-name tarjetaItemAvanzadoComponent-nameClickable"
                    role="button"
                    tabIndex={0}
                    title={`Ver datos de objeto: ${display}`}
                    onClick={(e) =>
                    {
                        e.stopPropagation();
                        handleClickNombre();
                    }}
                    onKeyDown={(e) =>
                    {
                        if(e.key === "Enter" || e.key === " ")
                        {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClickNombre();
                        }
                    }}
                >
                    {display}
                </div>

                {/* Categoria del Objeto */}
                <TituloMasValorPkm
                    label="Categoría"
                    value={categoryItem}
                    size={"mini"}
                    tooltip=""
                    valueTextAlign="center"
                    allowWrap={true}
                />

            </div>

            {/* Resumen del Objeto */}
            <ResumenItemModal
                open={summaryOpen}
                item={item}
                onClose={handleCloseSummary}
            />

        </article>
    );

}