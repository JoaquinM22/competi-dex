//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoMovsComponents\ListaMovsPaginada\ResumenMovModal\ResumenMovModal.js

import React, { useEffect, useState } from "react";
import {
  getTypeColor,
  getMoveClassIcon,
  getMoveClassLabelEs,
  getMoveTargetLabelEs
} from "../../../../../utils/competidexMeta";
import { hasCachedImage, preloadCachedImage } from "../../../../../utils/competidexImgCache";

import TituloMasValorPkm from "../../../../SharedComponents/TituloMasValorPkm/TituloMasValorPkm";
import GeneracionPkm from "../../../../SharedComponents/GeneracionPkm/GeneracionPkm";
import Modal from "../../../../SharedComponents/Modal/Modal";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";

import BanderasMovimiento from "../../../../MovimientosComponents/VistaMovimiento/DataMovimiento/BanderasMovimiento/BanderasMovimiento";
import NombreMovimiento from "../../../../MovimientosComponents/VistaMovimiento/DataMovimiento/NombreMovimiento/NombreMovimiento";
import DescMovimiento from "../../../../MovimientosComponents/VistaMovimiento/DataMovimiento/DescMovimiento/DescMovimiento";

import "./ResumenMovModal.css";

function toFiniteNumberOrNull(value)
{
    if(value === null || value === undefined || value === "") return null;

    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
}

function getViewportWidth()
{
    if(typeof window === "undefined") return 1024;
    return Number(window.innerWidth) || 1024;
}

// Máximo con "Más PP" (hasta 3): 160% del base
// Ejemplo: 5 -> 8 ; 10 -> 16  => floor(base*1.6)
function calcMaxPP(basePP)
{
  if (basePP === null || basePP === undefined) return null;
  if (!Number.isFinite(basePP) || basePP <= 0) return null;

  return Math.floor(basePP * 1.6);
}

function buildMoveFlags(move)
{
    const excludedKeys = new Set([
        "apiName",
        "id",
        "display",
        "type",
        "damage_class",
        "power",
        "accuracy",
        "priorityLevel",
        "indiceCritico",
        "generation",
        "pp",
        "machinesByGroup"
    ]);

    return Object.entries(move || {}).reduce(function(acc, [key, value])
    {
        if(excludedKeys.has(key)) return acc;

        acc[key] = value;
        return acc;

    }, {});
}

function getIndiceCriticoData(indiceCriticoMove, powerMove)
{
    if(powerMove === null || powerMove <= 0)
    {
        return {
            pct: "-",
            indice: null
        };
    }

    const indice = Number(indiceCriticoMove);

    if(!Number.isFinite(indice))
    {
        return {
            pct: "-",
            indice: null
        };
    }

    if(indice === 0)
    {
        return { pct: "4%", indice: "+0" };
    }

    if(indice === 1)
    {
        return { pct: "12,5%", indice: "+1" };
    }

    if(indice === 2)
    {
        return { pct: "50%", indice: "+2" };
    }

    return {
        pct: "100%",
        indice: "+" + indice
    };
}

export default function ResumenMovModal({ open, move, onClose })
{
    const id = Number(move?.id) || 0;
    const display = String(move?.display || move?.display_es || move?.apiName || move?.name || "Movimiento");
    const apiName = String(move?.apiName || move?.name || "").trim().toLowerCase();

    const type = String(move?.type || "").trim().toLowerCase();
    const types = type ? [type] : [];
    const [viewportWidth, setViewportWidth] = useState(getViewportWidth);

    const damageClass = String(move?.damage_class || "").trim().toLowerCase();
    const moveClassIcon = getMoveClassIcon(damageClass);
    const moveClassLabel = getMoveClassLabelEs(damageClass);

    const powerMove = toFiniteNumberOrNull(move?.power);
    const accuracyMove = toFiniteNumberOrNull(move?.accuracy);
    
    const ppMove = toFiniteNumberOrNull(move?.pp);
    const maxPMove = Number.isFinite(ppMove) ? calcMaxPP(ppMove) : null;

    const ppDisplay = Number.isFinite(ppMove) && Number.isFinite(maxPMove)
        ? `${ppMove} (${maxPMove})`
        : "-";

    const prioridadMov = toFiniteNumberOrNull(move?.priorityLevel);

    const esDeContacto = !!move?.isContact;
    const esDeContactoDisplay = esDeContacto ? "Sí" : "No";

    const indiceCriticoMove = toFiniteNumberOrNull(move?.indiceCritico);
    const indiceCriticoMoveData = getIndiceCriticoData(indiceCriticoMove, powerMove);

    const indiceCriticoPct = indiceCriticoMoveData.pct;
    const indiceCriticoIndice = indiceCriticoMoveData.indice;

    const indiceCriticoTooltip = indiceCriticoIndice !== null ? `Índice: ${indiceCriticoIndice}` : "No posee Índice de Crítico";

    const tieneEfectoSecundario = !!move?.hasSecondaryEffect;
    const tieneEfectoSecundarioDisplay = tieneEfectoSecundario ? "Sí" : "No";

    const flags = buildMoveFlags(move);

    const blancoMovEs = getMoveTargetLabelEs(move?.blancoMov || "") || move?.blancoMov || "-";

    const descMov = move?.descES || "-";
    const descMovEN = move?.descEN || "-";

    useEffect(() =>
    {
        if(moveClassIcon && !hasCachedImage(moveClassIcon))
        {
            preloadCachedImage(moveClassIcon);
        }

    }, [moveClassIcon]);

    useEffect(() =>
    {
        function handleResize()
        {
            setViewportWidth(getViewportWidth());
        }

        handleResize();
        window.addEventListener("resize", handleResize);

        return function()
        {
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    const isTinyScreen = viewportWidth <= 375;
    const isSmallScreen = viewportWidth <= 500;
    const typeSize = isTinyScreen ? "small" : (isSmallScreen ? "small" : "normal");

    function renderTypesBlock(size = "normal")
    {
        if(!types.length) return null;

        return (
            <div className="resumenMovModalComponent-types" aria-label={`Tipos de ${display}`}>
                {types.map(function(tipo)
                {
                    const bg = getTypeColor(tipo) || "#68A090";

                    return (
                        <div
                            key={tipo}
                            className="resumenMovModalComponent-tipoWrap"
                            style={{ backgroundColor: bg }}
                        >
                            <Tipo
                                tipo={tipo}
                                size={size}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <Modal
            open={!!open}
            title={"Resumen del Movimiento"}
            onClose={onClose}
        >
            <div className="resumenMovModalComponent">

                {/* ID + Nombre Movimiento */}
                <NombreMovimiento
                    id={id}
                    nombre={display}
                    tipos={[type]}
                />

                {/* Fila 1 */}
                <div className="resumenMovModalComponent-mainRow">

                    {/* Bloque Izquierdo: (Clase + Generación + Tipo) + (Potencia + Precision + PP) */}
                    <div className="resumenMovModalComponent-classYMeta">

                        {/* Generación Movimiento */}
                        {move?.generation ? (
                            <GeneracionPkm
                                generacion={move.generation}
                                size={"normal"}
                                backgroundColor={"#323741"}
                            />
                        ) : null}

                        {/* Clase del Movimiento */}
                        {moveClassIcon ? (
                            <img
                                className="resumenMovModalComponent-classIcon"
                                src={moveClassIcon}
                                alt={moveClassLabel}
                                title={moveClassLabel}
                            />
                        ) : (
                            <div className="resumenMovModalComponent-classIcon resumenMovModalComponent-NoclassIcon">
                                Icono no disponible
                            </div>
                        )}

                        {/* Tipo */}
                        {renderTypesBlock(typeSize)}

                        {/* Potencia del Movimiento */}
                        <TituloMasValorPkm
                            label="Potencia"
                            value={powerMove}
                            size={"medium"}
                            tooltip="Potencia del Movimiento"
                        />
                            
                        {/* Precisión del Movimiento */}
                        <TituloMasValorPkm
                            label="Precisión"
                            value={accuracyMove}
                            size={"medium"}
                            tooltip="Precisión del Movimiento"
                        />
                        
                        {/* PP del Movimiento */}
                        <TituloMasValorPkm
                            label="PP"
                            value={ppDisplay}
                            size={"medium"}
                            tooltip="Puntos de Poder del Movimiento"
                        />               
                        
                    </div>

                    {/* Bloque Derecho: Booleanos y otros datos */}
                    <div className="resumenMovModalComponent-dataWrapper-dos">

                        {/* Desc Mov */}
                        <div className="resumenMovModalComponent-dataItemFull resumenMovModalComponent-descMovWraper">
                           <DescMovimiento
                                descMov={descMov}
                                descMovEN={descMovEN}
                                size="normal"
                            />
                        </div>

                        {/* Prioridad del Movimiento */}
                        <TituloMasValorPkm
                            label="Prioridad"
                            value={(prioridadMov === null) ? "-" : ((prioridadMov > 0) ? `+${prioridadMov}` : prioridadMov)}
                            size={"medium"}
                            tooltip="Modifica el orden de turno. Valores mayores actúan antes."
                        />

                        {/* Es de Contacto */}
                        <TituloMasValorPkm
                            label="Es de Contacto"
                            value={esDeContactoDisplay}
                            size={"medium"}
                            tooltip=""
                        />

                        {/* Indice de Critico */}            
                        <TituloMasValorPkm
                            label="Índice de Crítico"
                            value={indiceCriticoPct}
                            size={"medium"}
                            tooltip={indiceCriticoTooltip}
                        />  

                        {/* Posee Efectos Secundarios*/}
                        <TituloMasValorPkm
                            label="Efectos Secundarios"
                            value={tieneEfectoSecundarioDisplay}
                            size={"medium"}
                            tooltip=""
                        /> 

                        {/* Blanco Movimiento */}
                        <div className="resumenMovModalComponent-dataItemFull">
                            <TituloMasValorPkm
                                label="Blanco"
                                value={blancoMovEs}
                                size={"medium"}
                                tooltip={"Indica a quién afecta el movimiento (objetivo)"}
                            />
                        </div>
        
                        {/* Banderas de Inmune a Movimiento */}
                        <BanderasMovimiento
                            titulo="Inmune a Movimiento"
                            groupKey="inmuneAMovimiento"
                            flags={flags}
                            size="normal"
                        />

                    </div>

                </div>

                {/* Fila 2: Resto de Banderas */}
                <div className="resumenMovModalComponent-dataWrapper resumenMovModalComponent-flagsWrapper">

                    {/* Banderas de Afectado Por */}
                    <BanderasMovimiento
                        titulo="Afectado Por"
                        groupKey="afectadoPor"
                        flags={flags}
                        size="normal"
                    />                 

                    {/* Banderas de Tipo de Movimiento */}
                    <BanderasMovimiento
                        titulo="Tipo de Movimiento"
                        groupKey="typeMove"
                        flags={flags}
                        size="normal"
                    />

                    {/* Banderas de Otros Datos */}
                    <BanderasMovimiento
                        titulo="Otros Datos"
                        groupKey="other"
                        flags={flags}
                        size="normal"
                    />  

                </div>

            </div>
        </Modal>
    );

}