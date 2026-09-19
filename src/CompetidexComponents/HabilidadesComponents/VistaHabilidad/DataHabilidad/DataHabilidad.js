//** src\CompetidexComponents\HabilidadesComponents\VistaHabilidad\DataHabilidad\DataHabilidad.js

import React, { useEffect, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";

import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import ErrorNotFoundPkm from "../../../SharedComponents/ErrorNotFoundPkm/ErrorNotFoundPkm";
import NamesMultiLanguage from "../../../SharedComponents/NamesMultiLanguage/NamesMultiLanguage";

import NombreHabilidad from "./NombreHabilidad/NombreHabilidad";
import DescHabilidad from "./DescHabilidad/DescHabilidad";
import PokesPoseenHabilidad from "./PokesPoseenHabilidad/PokesPoseenHabilidad";
import "./DataHabilidad.css";

export default function DataHabilidad({ habilidad = null, loading, error })
{
  const [mostrarDescHabilidad, setMostrarDescHabilidad] = useState(true);
  const [mostrarPokesPoseenHabilidad, setMostrarPokesPoseenHabilidad] = useState(true);
  const [mostrarNombresHabilidad, setMostrarNombresHabilidad] = useState(true);

  const data = habilidad || {};

  const {
    id,
    nombreHab,
    genHab,
    descHab,
    descHabEN,
    pokesTienen,
    namesHabilidad,
    efectoHabilidadEN
  } = data;

  useEffect(() =>
  {
    if (!habilidad || loading || error) return;

    setMostrarDescHabilidad(true);
    setMostrarPokesPoseenHabilidad(true);
    setMostrarNombresHabilidad(true);

  }, [id, habilidad, loading, error]);

  return (

    <div className="componente-VistaHabilidadJs">

      {loading && (
        <div className="loading-containerHabilidad">
          <LoadingPkm />
        </div>
      )}

      {error && (
        <div className="error-containerHabilidad">
          <ErrorNotFoundPkm error="Error al obtener datos de la Habilidad" />
        </div>
      )}

      {!loading && !error && habilidad && (

        <>

          <div className="parteArriba-Habilidad">

            <div className="contenidoPpal-Habilidad">

              {/* Nombre Habilidad */}
              {(!loading) && habilidad && (
                <div className="nombreID-desktop-Habilidad">
                  <NombreHabilidad
                    id={id}
                    nombre={nombreHab}
                    gen={genHab}
                  />
                </div>
              )}

              {/* Desc Habilidad*/}
              <>

                <div className="contenedorTituloSeccion-Habilidad">
                  <h2 className="tituloSeccion-Habilidad">Descripción</h2>
                  <button
                    className="toggleDesc-Habilidad"
                    onClick={() => setMostrarDescHabilidad(!mostrarDescHabilidad)}
                  >
                    <span className={mostrarDescHabilidad ? "iconoRotado-Habilidad" : "iconoNormal-Habilidad"}>
                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                    </span>
                  </button>
                </div>

                <div id="descHabilidadId" className={mostrarDescHabilidad ? "visible" : "oculto"}>
                  <DescHabilidad
                    descHab={descHab}
                    descHabEN={descHabEN}
                    efectoHabEN={efectoHabilidadEN}
                    size="normal"
                  />
                </div>

              </>

              {/* Pokemon que poseen Habilidad*/}
              <>

                <div className="contenedorTituloSeccion-Habilidad">
                  <h2 className="tituloSeccion-Habilidad">Pokémon que poseen habilidad</h2>
                  <button
                    className="togglePokesPoseen-Habilidad"
                    onClick={() => setMostrarPokesPoseenHabilidad(!mostrarPokesPoseenHabilidad)}
                  >
                    <span className={mostrarPokesPoseenHabilidad ? "iconoRotado-Habilidad" : "iconoNormal-Habilidad"}>
                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                    </span>
                  </button>
                </div>

                <div id="pokesPoseenHabilidadId" className={mostrarPokesPoseenHabilidad ? "visible" : "oculto"}>

                  {mostrarPokesPoseenHabilidad && (
                    <PokesPoseenHabilidad
                      pokesPoseen={pokesTienen || []}
                      title=""
                      maxHeight="420px"
                    />
                  )}

                </div>

              </>

              {/* Nombres Habilidad*/}
              <>

                <div className="contenedorTituloSeccion-Habilidad">
                  <h2 className="tituloSeccion-Habilidad">Nombres Habilidad</h2>
                  <button
                    className="toggleDesc-Habilidad"
                    onClick={() => setMostrarNombresHabilidad(!mostrarNombresHabilidad)}
                  >
                    <span className={mostrarNombresHabilidad ? "iconoRotado-Habilidad" : "iconoNormal-Habilidad"}>
                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                    </span>
                  </button>
                </div>

                <div id="nombresHabilidadId" className={mostrarNombresHabilidad ? "visible" : "oculto"}>
                 
                  <NamesMultiLanguage
                    title={"Nombres Habilidad"}
                    names={namesHabilidad}
                    size="normal"
                    hideHeader={true}
                  />
              
                </div>
                

              </> 

            </div>

          </div>

        </>

      )}

    </div>

  );

}