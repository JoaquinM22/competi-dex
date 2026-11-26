//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoMovsComponents\ListaMovsPaginada\TarjetaMovAvanzado\TarjetaMovAvanzado.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMoveClassIcon, getMoveClassLabelEs, formatNumberWithDots } from "../../../../../utils/competidexMeta";
import { moveRoute } from "../../../../../utils/competidexRoutes";
import { hasCachedImage, preloadCachedImage } from "../../../../../utils/competidexImgCache";
import Tipo from "../../../../SharedComponents/Tipo/Tipo";
import TituloMasValorPkm from "../../../../SharedComponents/TituloMasValorPkm/TituloMasValorPkm";
import ResumenMovModal from "../ResumenMovModal/ResumenMovModal";
import "./TarjetaMovAvanzado.css";

function toFiniteNumberOrNull(value)
{
  if(value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

// Máximo con "Más PP" (hasta 3): 160% del base
// Ejemplo: 5 -> 8 ; 10 -> 16  => floor(base*1.6)
function calcMaxPP(basePP)
{
  if (basePP === null || basePP === undefined) return null;
  if (!isFinite(basePP) || basePP <= 0) return null;

  return Math.floor(basePP * 1.6);
}

export default function TarjetaMovAvanzado({ move })
{
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const id = Number(move?.id) || 0;
  const display = String(move?.display || move?.apiName || "Movimiento");
  const apiName = String(move?.apiName || "").trim().toLowerCase();

  const type = String(move?.type || "").trim().toLowerCase();

  const damageClass = String(move?.damage_class || "").trim().toLowerCase();
  const moveClassIcon = getMoveClassIcon(damageClass);
  const moveClassLabel = getMoveClassLabelEs(damageClass);

  useEffect(function()
  {
    if(moveClassIcon && !hasCachedImage(moveClassIcon))
    {
      preloadCachedImage(moveClassIcon);
    }

  }, [moveClassIcon]);

  const powerMove = toFiniteNumberOrNull(move?.power);
  const accuracyMove = toFiniteNumberOrNull(move?.accuracy);
  
  const ppMove = toFiniteNumberOrNull(move?.pp);
  const maxPMove = Number.isFinite(ppMove) ? calcMaxPP(ppMove) : null;

  const ppDisplay = Number.isFinite(ppMove) && Number.isFinite(maxPMove)
    ? `${ppMove} (${maxPMove})`
    : "-";

  const cardClass = "tarjetaMovAvanzadaComponent" + (id ? "" : " tarjetaMovAvanzadaComponent--sin-id");

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
    navigate(moveRoute(encodeURIComponent(apiName)));
  }

  return (
    <article
      className={cardClass}
      onClick={handleOpenSummary}
      role="button"
      tabIndex={0}
      title={`Ver resumen de movimiento: ${display}`}
      onKeyDown={(e) =>
      {
        if(e.key === "Enter" || e.key === " ")
        {
          e.preventDefault();
          handleOpenSummary();
        }
      }}
    >

      {/* Clase del Movimiento */}
      {moveClassIcon ? (
        <img
          className="tarjetaMovAvanzadaComponent-classIcon"
          src={moveClassIcon}
          alt={moveClassLabel}
          title={moveClassLabel}
        />
      ) : (
        <div className="tarjetaMovAvanzadaComponent-classIcon tarjetaMovAvanzadaComponent-NoclassIcon">
          Icono no disponible
        </div>
      )}

      {/* Cuerpo de la tarjeta */}
      <div className="tarjetaMovAvanzadaComponent-body">

        {/* ID del Movimiento */}
        <div className="tarjetaMovAvanzadaComponent-id">
          {id ? `#${formatNumberWithDots(id)}` : "#-"}
        </div>

        {/* Nombre del Movimiento */}
        <div
          className="tarjetaMovAvanzadaComponent-name tarjetaMovAvanzadaComponent-nameClickable"
          role="button"
          tabIndex={0}
          title={`Ver datos de movimiento: ${display}`}
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

        {/* Tipo del Movimiento */}
        {type ? (
          <div className="tarjetaMovAvanzadaComponent-types" aria-label={`Tipo de ${display}`}>
            <Tipo
              tipo={type}
              size="mini"
            />
          </div>
        ) : null}
 
        {/* Potencia del Movimiento */}
        <TituloMasValorPkm
          label="Potencia"
          value={powerMove}
          size={"mini"}
          tooltip=""
        />
         
        {/* Precisión del Movimiento */}
        <TituloMasValorPkm
          label="Precisión"
          value={accuracyMove}
          size={"mini"}
          tooltip=""
        />
     
        {/* PP del Movimiento */}
        <TituloMasValorPkm
          label="PP"
          value={ppDisplay}
          size={"mini"}
          tooltip=""
        />
 
      </div>

      {/* Resumen del Movimiento */}
      <ResumenMovModal
        open={summaryOpen}
        move={move}
        onClose={handleCloseSummary}
      />

    </article>
  );

}