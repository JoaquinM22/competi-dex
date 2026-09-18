//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\DataMovimiento.js

import React, { useEffect, useState, useMemo } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import "./DataMovimiento.css"; 

import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import ErrorNotFoundPkm from "../../../SharedComponents/ErrorNotFoundPkm/ErrorNotFoundPkm";
import GeneracionPkm from "../../../SharedComponents/GeneracionPkm/GeneracionPkm";
import NamesMultiLanguage from "../../../SharedComponents/NamesMultiLanguage/NamesMultiLanguage";

import NombreMovimiento from "./NombreMovimiento/NombreMovimiento";
import StatsMovimiento from "./StatsMovimiento/StatsMovimiento";
import EfectosSecundariosMov from "./EfectosSecundariosMov/EfectosSecundariosMov";
import PpMovimiento from "./PpMovimiento/PpMovimiento";
import PrioridadMovimiento from "./PrioridadMovimiento/PrioridadMovimiento";
import BlancoMovimiento from "./BlancoMovimiento/BlancoMovimiento";
import DescMovimiento from "./DescMovimiento/DescMovimiento";
import PokesAprendenMovimiento from "./PokesAprendenMovimiento/PokesAprendenMovimiento";
import CambiosStatsMov from "./CambiosStatsMov/CambiosStatsMov";
import CriticoMovimiento from "./CriticoMovimiento/CriticoMovimiento";
import EsDeContacto from "./EsDeContacto/EsDeContacto";
import BanderasMovimiento from "./BanderasMovimiento/BanderasMovimiento";

export default function DataMovimiento({ movimiento, loading, error })
{
  const [mostrarDescMov, setMostrarDescMov] = useState(true);
  const [mostrarPokesAprendenMov, setMostrarPokesAprendenMov] = useState(true);

  const {
    id, // id unico numerico del Movimiento 
    key, // Es el api name

    nombreMov, // Nombre lindo normalizado en español (Si no tiene traduccion esta en ingles)
    nombreApi, // api name
    genMov, // Si el mov es de 1era gen, 2da gen, etc
    tipoMov, // tipo: fuego, agua, etc
    claseMov, // especial, fisico o de estado
    potenciaMov, // potencia
    precisionMov, // precision
    ppMov, // Puntos de Poder
    prioridadMov, // Prioridad: 0, +1, +2, -1, etc.
    flags, // Todas las banderas de efectos varios
    blancoMov, //Blanco: Elegido, ususario, pokemon adyacentes, etc
    descMov, // Descripcion en español
    descMovEN, // Descripcion en ingles
    efectoSecundario, // Objeto con el texto de efecto si posee, y los datos con los que armo dicha oracion
    tieneEfectoSecundario, // Booleano para saber si posee efecto secundario o no

    statsCambios, // { usuario:{...}, objetivo:{...} }
    statsCambiosList, // [{ aplicaA, stat, efecto, nivel }]
    tieneStatsCambios, // boolean

    indiceCritico, // Indice de golpe critico: 0, +1, +2, etc

    pokesAprenden, // Lista con los nombres de los pokemon que aprenden dicho mov
    isDamage, // booleano si es de daño (especial o fisico)
    isStatus, // booleano si es de estado
    namesMov // Nombres del Mov en diferentes idiomas
  } = movimiento || {};

  const nombreMovnorm = nombreMov || "Movimiento";

  useEffect(() =>
  {
    if (!movimiento || loading || error) return;

    setMostrarDescMov(true);
    setMostrarPokesAprendenMov(true);

  }, [key, id, movimiento, loading, error]);

  return (
    <div className="componente-VistaMovimientoJs">

      {loading && (
        <div className="loading-containerMovimiento">
          <LoadingPkm/>
        </div>
      )}

      {error && (
        <div className="error-containerMovimiento">
          <ErrorNotFoundPkm error="Error al obtener datos del Movimiento"/>
        </div>
      )}

      {!loading && !error && movimiento && (

        <>

          <div className="parteArriba-Movimiento">

            <div id="arribaIzq-Movimiento">

              {/* Nombre Movimiento */}
              {(!loading) && movimiento && (
                <div className="nombreID-desktop-Movimiento">
                  <NombreMovimiento
                    id={id}
                    nombre={nombreMovnorm}
                    tipos={[tipoMov]}
                  />
                </div>
              )}

              {/* Desc Movimiento*/}
              <>
                        
                <div className="contenedorTituloSeccion-Movimiento">
                    <h2 className="tituloSeccion-Movimiento">Descripción</h2>
                    <button 
                      className="toggleDesc-Mov"
                      onClick={() => setMostrarDescMov(!mostrarDescMov)}
                    >
                      <span className={mostrarDescMov ? "iconoRotado-Movimiento" : "iconoNormal-Movimiento"}>
                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                      </span>
                    </button>
                </div>
                  
                <div id="descMovId" className={mostrarDescMov ? "visible" : "oculto"}>
                  <DescMovimiento
                    descMov={descMov}
                    descMovEN={descMovEN}
                    size="normal"
                  />
                </div>

              </>

              {/* Pokemon que aprenden Movimiento*/}
              <>
                        
                <div className="contenedorTituloSeccion-Movimiento">
                    <h2 className="tituloSeccion-Movimiento">Pokémon que aprenden</h2>
                    <button 
                      className="togglePokesAprenden-Mov"
                      onClick={() => setMostrarPokesAprendenMov(!mostrarPokesAprendenMov)}
                    >
                      <span className={mostrarPokesAprendenMov ? "iconoRotado-Movimiento" : "iconoNormal-Movimiento"}>
                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                      </span>
                    </button>
                </div>  
                  
                <div id="pokesAprendenMovId" className={mostrarPokesAprendenMov ? "visible" : "oculto"}>
                  
                  {mostrarPokesAprendenMov && (
                    <PokesAprendenMovimiento
                      pokesAprenden={pokesAprenden || []}
                      title=""
                      maxHeight="420px"
                    />
                  )}
                  
                </div>

              </>

            </div>

            <div id="arribaDer-Movimiento">

              {/* Nombre Movimiento */}
              {(!loading) && movimiento && (
                <div className="nombreID-mobile-Movimiento paddingCelu-Movimiento">
                  <NombreMovimiento
                    id={id}
                    nombre={nombreMovnorm}
                    tipos={[tipoMov]}
                  />
                </div>
              )}

              {(!loading) && movimiento && (
                <div className="tarjetaInicialWrapper-Movimiento">

                  <div className="tarjetaInicial-Movimiento">

                    <GeneracionPkm
                      generacion={genMov}
                      size="normal"
                      enableAdvancedSearchLink={true}
                      advancedSearchTabKey="movimientos"
                    />

                    <StatsMovimiento
                      claseMov={claseMov}
                      potenciaMov={potenciaMov}
                      precisionMov={precisionMov}
                      tipoMov={tipoMov}
                      size="normal"
                      enableAdvancedSearchClassMovLink={true}
                      enableAdvancedSearchTypeLink={true}
                      enableAdvancedSearchPowerMovLink={true}
                      enableAdvancedSearchAccurancyMovLink={true}
                    />

                    <PpMovimiento
                      ppMov={ppMov}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <NamesMultiLanguage
                      title={"Nombres Movimiento"}
                      names={namesMov}
                      size="normal"
                    />

                    <EfectosSecundariosMov
                      efectos={(efectoSecundario && Array.isArray(efectoSecundario.lista)) ? efectoSecundario.lista : []}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <PrioridadMovimiento
                      prioridadMov={prioridadMov}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <EsDeContacto
                      isContact={flags.isContact}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <BlancoMovimiento
                      blancoMov={blancoMov}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <CambiosStatsMov
                      aplicaA="usuario"
                      target={blancoMov}
                      stats={(statsCambios && statsCambios.usuario) ? statsCambios.usuario : {}}
                      size="normal"
                    />

                    <CambiosStatsMov
                      aplicaA="objetivo"
                      target={blancoMov}
                      stats={(statsCambios && statsCambios.objetivo) ? statsCambios.objetivo : {}}
                      size="normal"
                    />

                    <CriticoMovimiento
                      indice={indiceCritico}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <BanderasMovimiento
                      titulo="Afectado Por"
                      groupKey="afectadoPor"
                      flags={flags}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <BanderasMovimiento
                      titulo="Inmune a Movimiento"
                      groupKey="inmuneAMovimiento"
                      flags={flags}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <BanderasMovimiento
                      titulo="Tipo de Movimiento"
                      groupKey="typeMove"
                      flags={flags}
                      size="normal"
                      enableAdvancedSearchLink={true}
                    />

                    <BanderasMovimiento
                      titulo="Otros Datos"
                      groupKey="other"
                      flags={flags}
                      size="normal"
                      enableAdvancedSearchLink={true}
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