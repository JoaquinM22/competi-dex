//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoItemsComponents\ListaItemsPaginada\ResumenItemModal\ResumenItemModal.js

import React from "react";
import { getAttributeItemLabelEs } from "../../../../../utils/competidexMeta";
import Modal from "../../../../SharedComponents/Modal/Modal";
import NombreItem from "../../../../ItemsComponents/VistaItem/DataItem/NombreItem/NombreItem";
import SpriteItem from "../../../../ItemsComponents/VistaItem/DataItem/SpriteItem/SpriteItem";
import CategoriaItem from "../../../../ItemsComponents/VistaItem/DataItem/CategoriaItem/CategoriaItem";
import AtributosItem from "../../../../ItemsComponents/VistaItem/DataItem/AtributosItem/AtributosItem";
import DescItem from "../../../../ItemsComponents/VistaItem/DataItem/DescItem/DescItem";
import "./ResumenItemModal.css";

function toFiniteNumberOrNull(value)
{
    if(value === null || value === undefined || value === "") return null;

    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
}

export default function ResumenItemModal({ open, item, onClose })
{
    const apiName = String(item?.apiName || "").trim().toLowerCase();

    const id = toFiniteNumberOrNull(item?.id);

    const display = String(item?.display || apiName || "Objeto").trim();
    const category = String(item?.category || "").trim() || "-";
    const attributesRaw = Array.isArray(item?.attributes) ? item.attributes : [];

    const descItem = item?.descES || "-";

    return (
        <Modal
            open={!!open}
            title={"Resumen del Objeto"}
            onClose={onClose}
            modalStyle={{
                width: "600px",
                maxWidth: "600px"
            }}
        >
            <div className="resumenItemModalComponent">

                {/* ID + Nombre Objeto */}
                <NombreItem
                    id={id}
                    nombre={display}
                />

                {/* Sprite del Objeto */}
                <SpriteItem
                    apiName={apiName}
                    size="large"
                    altText={display}
                />

                {/* Categoria del Objeto */}
                <CategoriaItem
                    categoriaItem={category}
                    size="normal"
                />
                
                {/* Desc del Objeto */}
                <DescItem
                    descItem={descItem}
                    size="normal"
                />

                {/* Atributos del Objeto */}
                <AtributosItem
                    atributos={attributesRaw}
                    size="normal"
                />    

            </div>
        </Modal>
    );

}