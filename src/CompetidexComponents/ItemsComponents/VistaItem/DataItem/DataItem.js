//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\DataItem.js

import React, { useEffect, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";

import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import ErrorNotFoundPkm from "../../../SharedComponents/ErrorNotFoundPkm/ErrorNotFoundPkm";

import NombreItem from "./NombreItem/NombreItem";
import DescItem from "./DescItem/DescItem";

import SpriteItem from "./SpriteItem/SpriteItem";
import PrecioItem from "./PrecioItem/PrecioItem";
import CategoriaItem from "./CategoriaItem/CategoriaItem";
import AtributosItem from "./AtributosItem/AtributosItem";
import "./DataItem.css";

export default function DataItem({ item, loading, error })
{
  const [mostrarDescItem, setMostrarDescItem] = useState(true);

  const {
    id,
    nombreApi,
    nombreItem,
    precioItem,
    categoriaItem,
    descItem,
    atributosItem
  } = item || {};

  const nombreItemNorm = nombreItem || "Objeto";

  useEffect(() =>
  {
    if (!item || loading || error) return;
    
    setMostrarDescItem(true);

  }, [nombreApi, id, item, loading, error]);

  useEffect(() =>
  {
    if (!item || loading || error) return;
    
    setMostrarDescItem(true);

  }, [nombreApi, id, item, loading, error]);

  return (
    <div className="componente-VistaItemJs">
      
      {/* Error al buscar Objeto */}
      {error && (
        <div className="error-containerItem">
          <ErrorNotFoundPkm error="Error al obtener datos del Objeto" />
        </div>
      )}

      {/* Cargando */}
      {!error && loading && (
        <div className="loading-containerItem">
          <LoadingPkm />
        </div>
      )}

      {/* Datos del Item/Objeto */}
      {!loading && !error && item && (
        <>
          <div className="parteArriba-Item">

            <div id="arribaIzq-Item">

              {/* Nombre Item */}
              {(!loading) && item && (
                <div className="nombreID-desktop-Item">
                  <NombreItem
                    id={id}
                    nombre={nombreItemNorm}
                  />
                </div>
              )}

              {/* Desc Movimiento*/}
              <>

                <div className="contenedorTituloSeccion-Item">
                  <h2 className="tituloSeccion-Item">Descripción</h2>
                  <button
                    className="toggleDesc-Item"
                    onClick={() => setMostrarDescItem(!mostrarDescItem)}
                  >
                    <span className={mostrarDescItem ? "iconoRotado-Item" : "iconoNormal-Item"}>
                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                    </span>
                  </button>
                </div>

                <div id="descItemId" className={mostrarDescItem ? "visible" : "oculto"}>
                  <DescItem
                    descItem={descItem}
                    size="normal"
                  />
                </div>

              </>

            </div>

            <div id="arribaDer-Item">

              {/* Nombre Item */}
              {(!loading) && item && (
                <div className="nombreID-mobile-Item paddingCelu-Item">
                  <NombreItem
                    id={id}
                    nombre={nombreItemNorm}
                  />
                </div>
              )}

              {(!loading) && item && (
                <div className="tarjetaInicialWrapper-Item">

                  <div className="tarjetaInicial-Item">

                    <SpriteItem
                      apiName={nombreApi}
                      size="normal"
                    />

                    <PrecioItem
                      precioItem={precioItem}
                      size="normal"
                    />

                    <CategoriaItem
                      categoriaItem={categoriaItem}
                      size="normal"
                    />

                    <AtributosItem
                      atributos={atributosItem}
                      size="normal"
                    />

                  </div>

                </div>
              )}

            </div>

          </div>
        </>
      )}
      
    </div>
  );

}