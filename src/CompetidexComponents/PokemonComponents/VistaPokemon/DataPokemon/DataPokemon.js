//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\DataPokemon.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { getTypeColor, getTypeMeta } from "../../../../utils/competidexMeta";
import { useMoves } from "../../../MovimientosComponents/MovesProvider";
import { useAreaLocalizacion } from "../../../AreaLocalizacionComponents/AreaLocalizacionProvider";
import Tipo from "../../../SharedComponents/Tipo/Tipo";
import GeneracionPkm from "../../../SharedComponents/GeneracionPkm/GeneracionPkm";
import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import ErrorNotFoundPkm from "../../../SharedComponents/ErrorNotFoundPkm/ErrorNotFoundPkm";
import DebilidadesYResistencias from "../../../SharedComponents/DebilidadesYResistencias/DebilidadesYResistencias";
import ListaMovimientosPkm from "./ListaMovimientosPkm/ListaMovimientosPkm";
import PesoYAlturaPkm from "./PesoYAlturaPkm/PesoYAlturaPkm";
import TablaEstadisticasPkm from "./TablaEstadisticasPkm/TablaEstadisticasPkm";
import CadenaEvolutivaPkm from "./CadenaEvolutivaPkm/CadenaEvolutivaPkm";
import ImgPokemon from "./ImgPokemon/ImgPokemon";
import ColorPkm from "./ColorPkm/ColorPkm";
import HabilidadesPkm from "./HabilidadesPkm/HabilidadesPkm";
import NombreIDPkm from "./NombreIDPkm/NombreIDPkm";
import FormasPkm from "./FormasPkm/FormasPkm";
import MegaEvoPkm from "./MegaEvoPkm/MegaEvoPkm";
import GigaPkm from "./GigaPkm/GigaPkm";
import GritoPkm from "./GritoPkm/GritoPkm";
import PokedexNav from "./PokedexNav/PokedexNav";
import GeneroPkm from "./GeneroPkm/GeneroPkm";
import IndiceCapturaPkm from "./IndiceCapturaPkm/IndiceCapturaPkm";
import AreaLocalizacion from "../../../AreaLocalizacionComponents/AreaLocalizacion/AreaLocalizacion";
import "./DataPokemon.css";

// Funcion Auxiliar para normalizar una habilidad para DYR
function getAbilityForDYR(ability)
{
    if(!ability) return null;

    if(typeof ability === "string")
    {
        const apiName = String(ability || "").trim();
        if(!apiName) return null;

        return { apiName: apiName, display: "" };
    }

    const apiName = String(ability.apiName || "").trim();
    if(!apiName) return null;

    return {
        apiName: apiName,
        display: String(ability.display || "").trim()
    };
}

// Calcula el ancho de los Tipos a mostrar
function measureTextWidth(text, fontSize = 12)
{
    const value = String(text || "");
    if(!value) return 0;

    if(typeof document === "undefined")
    {
        return value.length * fontSize * 0.62;
    }

    try
    {
        const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement("canvas"));
        const ctx = canvas.getContext("2d");
        if(!ctx) return value.length * fontSize * 0.62;

        const fontFamily = getComputedStyle(document.body || document.documentElement).fontFamily || "Arial, sans-serif";
        ctx.font = `700 ${fontSize}px ${fontFamily}`;

        return ctx.measureText(value).width;

    }catch(e)
    {
        return value.length * fontSize * 0.62;
    }
}

export default function DataPokemon({ pokemon, movesRawData = [], loading, error })
{
    const { getPokemonMovesGroupVersion } = useMoves();
    const {
        ensureAreaLocalizacionRaw,
        buildAreaLocalizacionGroups,
        gameVersionLabelEsByKey,
        gameVersionGenerationByKey
    } = useAreaLocalizacion();
    const [pokemonApiNameActual, setPokemonApiNameActual] = useState("");
    const [mostrarStats, setMostrarStats] = useState(true);
    const [mostrarMovsPcipal, setMostrarMovsPcipal] = useState(false);
    const [mostrarMovsNivel, setMostrarMovsNivel] = useState(true);
    const [mostrarMovsMT, setMostrarMovsMT] = useState(true);
    const [mostrarMovsTutor, setMostrarMovsTutor] = useState(true);
    const [mostrarMovsHuevo, setMostrarMovsHuevo] = useState(true);
    const [mostrarEvolucion, setMostrarEvolucion] = useState(false);
    const [mostrarFormas, setMostrarFormas] = useState(false);
    const [mostrarMegas, setMostrarMegas] = useState(false);
    const [mostrarGiga, setMostrarGiga] = useState(false);
    const [mostrarAreaLocalizacion, setMostrarAreaLocalizacion] = useState(false);
    const [mostrarDebilidadesYResistencias, setMostrarDebilidadesYResistencias] = useState(false);
    const [montarDYR, setMontarDYR] = useState(false);
    const [movimientosNormalizados, setMovimientosNormalizados] = useState(null);
    const [loadingMovimientos, setLoadingMovimientos] = useState(false);
    const [areasLocalizacionNormalizadas, setAreasLocalizacionNormalizadas] = useState([]);
    const [loadingAreaLocalizacion, setLoadingAreaLocalizacion] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(() =>
    {
        if(typeof window === "undefined") return false;
        return window.innerWidth <= 640;
    });
    const tarjetaInicialRef = useRef(null);

    const scrollToPokemonTop = useMemo(() =>
    {
        return () =>
        {
            if(typeof window === "undefined") return;

            window.scrollTo({ top: 0, left: 0, behavior: "auto" });

            if(document.documentElement)
            {
                document.documentElement.scrollTop = 0;
            }

            if(document.body)
            {
                document.body.scrollTop = 0;
            }

            if(tarjetaInicialRef.current)
            {
                tarjetaInicialRef.current.scrollTop = 0;
            }
        };

    }, []);

    // Vuelve la vista arriba del todo
    useEffect(() =>
    {
        const h = typeof window !== "undefined" ? window.history : null;
        if(h && "scrollRestoration" in h)
        {
            try { h.scrollRestoration = "manual"; } catch { }
        }
    }, []);

    useEffect(() =>
    {
        if(typeof window === "undefined") return;

        const mq = window.matchMedia("(max-width: 640px)");
        const sync = () => setIsMobileViewport(mq.matches);

        sync();

        if(mq.addEventListener)
        {
            mq.addEventListener("change", sync);
            return () => mq.removeEventListener("change", sync);
        }

        mq.addListener(sync);
        return () => mq.removeListener(sync);
    }, []);

    // Cuando abro la seccion de "DYR" por primera vez, ahi recien renderiza el componente, para mejor performance
    useEffect(() =>
    {
        if(mostrarDebilidadesYResistencias)
        {
            setMontarDYR(true);
        }
    }, [mostrarDebilidadesYResistencias]);

    useEffect(() =>
    {
        const nextApiName = String(pokemon?.apiName || "").trim().toLowerCase();
        if(!nextApiName) return;

        setPokemonApiNameActual(nextApiName);
        scrollToPokemonTop();

        const rafId = window.requestAnimationFrame
            ? window.requestAnimationFrame(() => scrollToPokemonTop())
            : window.setTimeout(() => scrollToPokemonTop(), 0);

        // Cada vez que cambia el pokemon, se resetea la UI de secciones
        setMostrarStats(true);
        setMostrarMovsPcipal(false);
        setMostrarMovsNivel(false);
        setMostrarMovsMT(false);
        setMostrarMovsTutor(false);
        setMostrarMovsHuevo(false);
        setMostrarEvolucion(false);
        setMostrarFormas(false);
        setMostrarMegas(false);
        setMostrarGiga(false);
        setMostrarAreaLocalizacion(false);
        setMostrarDebilidadesYResistencias(false);
        setMontarDYR(false);
        setMovimientosNormalizados(null);
        setLoadingMovimientos(false);
        setAreasLocalizacionNormalizadas([]);
        setLoadingAreaLocalizacion(false);

        return () =>
        {
            if(window.cancelAnimationFrame && typeof rafId === "number")
            {
                window.cancelAnimationFrame(rafId);
            
            }else
            {
                window.clearTimeout(rafId);
            }
        };

    }, [pokemon?.apiName, scrollToPokemonTop]);

    // Normaliza los movimientos crudos del Pokemon para dejarlos listos para la vista de movimientos
    useEffect(() =>
    {
        let alive = true;
        const rawMoves = Array.isArray(movesRawData) ? movesRawData : [];

        setLoadingMovimientos(true);
        setMovimientosNormalizados(null);

        const run = async () =>
        {
            if(!rawMoves.length)
            {
                if(alive)
                {
                    setMovimientosNormalizados([]);
                    setLoadingMovimientos(false);
                }
                return;
            }

            if(typeof getPokemonMovesGroupVersion !== "function")
            {
                if(alive)
                {
                    setMovimientosNormalizados([]);
                    setLoadingMovimientos(false);
                }
                return;
            }

            try
            {
                const normalizados = await getPokemonMovesGroupVersion(rawMoves);
                if(alive)
                {
                    setMovimientosNormalizados(Array.isArray(normalizados) ? normalizados : []);
                    setLoadingMovimientos(false);
                }

            }catch(errorMoves)
            {
                if(alive)
                {
                    setMovimientosNormalizados([]);
                    setLoadingMovimientos(false);
                }
            }
        };

        run();

        return () =>
        {
            alive = false;
        };

    }, [movesRawData, getPokemonMovesGroupVersion]);

    // Normaliza las areas de localizacion del Pokemon
    useEffect(() =>
    {
        let alive = true;
        const pokemonId = pokemon?.id;

        if(!pokemonId)
        {
            setAreasLocalizacionNormalizadas([]);
            setLoadingAreaLocalizacion(false);
            return;
        }

        setLoadingAreaLocalizacion(true);
        setAreasLocalizacionNormalizadas([]);

        const run = async () =>
        {
            try
            {
                const rawAreas = await ensureAreaLocalizacionRaw(pokemonId);
                const normalizadas = buildAreaLocalizacionGroups(rawAreas, {
                    gameVersionLabelEsByKey,
                    gameVersionGenerationByKey
                });

                if(alive)
                {
                    setAreasLocalizacionNormalizadas(Array.isArray(normalizadas) ? normalizadas : []);
                    setLoadingAreaLocalizacion(false);
                }

            }catch(errorArea)
            {
                if(alive)
                {
                    setAreasLocalizacionNormalizadas([]);
                    setLoadingAreaLocalizacion(false);
                }

            }
        };

        run();

        return () =>
        {
            alive = false;
        };

    }, [
        pokemon?.id,
        ensureAreaLocalizacionRaw,
        buildAreaLocalizacionGroups,
        gameVersionLabelEsByKey,
        gameVersionGenerationByKey
    ]);

    const pokemonData = pokemon || null;
    const nombreActual = pokemon?.display;
    const tipos = Array.isArray(pokemonData?.types) ? pokemonData.types : [];
    const habilidadesVisibles = Array.isArray(pokemonData?.abilities) ? pokemonData.abilities : [];
    const habilidadesOcultas = Array.isArray(pokemonData?.hiddenAbilities) ? pokemonData.hiddenAbilities : [];
    const formas = Array.isArray(pokemonData?.formas) ? pokemonData.formas : [];
    const megas = Array.isArray(pokemonData?.mega) ? pokemonData.mega : [];
    const arrDex = Array.isArray(pokemonData?.arrDex) ? pokemonData.arrDex : [];
    const gigaEter = Array.isArray(pokemonData?.gigaEter) ? pokemonData.gigaEter : null;
    const tieneGiga = !!pokemonData?.giga && (
        pokemonData.giga.displayGiga ||
        pokemonData.giga.apiNameGiga ||
        pokemonData.giga.idGiga != null
    );

    // Arreglo de habilidades para DYR
    const habilidadesNombres = useMemo(() =>
    {
        return [...habilidadesVisibles, ...habilidadesOcultas]
            .map(getAbilityForDYR)
            .filter(Boolean);

    }, [habilidadesVisibles, habilidadesOcultas]);

    // Funcion Auxiliar para obtener el color de un Tipo Pokémon
    const getTipoBgPkm = (tipo) => getTypeColor(tipo) || "#68A090";
    
    const getTipoLabelPkm = (tipo) =>
    {
        const meta = getTypeMeta(tipo);
        return String(meta?.labelEs || tipo || "").trim();
    };
    
    // Guarda el ancho base para componente Tipo
    const tipoPkmWidth = useMemo(() =>
    {
        const labels = tipos
            .map((tipo) => getTipoLabelPkm(tipo))
            .filter(Boolean);

        if(!labels.length) return 0;

        const fontSize = 22;
        const paddingX = 25;
        const gap = 5;
        const iconSize = 18;
        const borderWidth = 2;
        const extra = 14;

        let maxLabelWidth = 0;

        for(let i = 0; i < labels.length; i++)
        {
            const label = labels[i];
            maxLabelWidth = Math.max(maxLabelWidth, measureTextWidth(label, fontSize));
        }

        return Math.ceil(maxLabelWidth + (paddingX * 2) + iconSize + gap + (borderWidth * 2) + extra);

    }, [tipos]);

    return (
        <div className="componenteVistaPokemonJs">

            {/* Cargando Pokemon */}
            {loading && (
                <div className="loading-containerPokemon">
                    <LoadingPkm />
                </div>
            )}

            {/* Error al obtener info de un Pokemon */}
            {error && (
                <div className="error-containerPokemon">
                    <ErrorNotFoundPkm error="Error al obtener datos del Pokémon" />
                </div>
            )}

            {/* Data Completa del Pokemon */}
            {!loading && !error && pokemonData && (
                <div className="componentePokemon">

                    {/* Parte Superior: Stats + Tarjeta Resumen */}
                    <div className="parteArriba">

                        {/* Parte Superior Izquierda: "Nombre e ID", "Stats" y "Cadena Evolutiva" */}
                        <div id="arribaIzq">

                            {/* Nombre e ID: Se muestra solo en pantallas grandes */}
                            <div className="nombreID-desktop">
                                <NombreIDPkm
                                    id={pokemonData.id}
                                    nombre={nombreActual}
                                    tipos={tipos}
                                />
                            </div>

                            {/* Estadísticas de Combate */}
                            {pokemonData.stats && (
                                <>
                                    {/* Titulo Seccion Estadísticas de Combate */}
                                    <div className="contenedorTituloSeccion">
                                        <h2 className="tituloSeccion">Características de Combate</h2>
                                        {/* <button 
                                            className="toggleStats"
                                            onClick={() => setMostrarStats(!mostrarStats)}
                                            type="button"
                                        >
                                            <span className={mostrarStats ? "iconoRotado" : "iconoNormal"}>
                                                <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                            </span>
                                        </button>  */}
                                    </div>

                                    {/* Componente Estadísticas de Combate */}
                                    <div id="idStats" className={mostrarStats ? "visible" : "oculto"}>
                                        <div id="contenedorStats">
                                            <div>
                                                <TablaEstadisticasPkm
                                                    statsPoke={pokemonData.stats}
                                                    nombrePkm={pokemonData.specieName || ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Cadena Evolutiva */}
                            {Array.isArray(pokemonData.evolutionChain) && pokemonData.evolutionChain.length > 0 && (
                                <>
                                    {/* Titulo Cadena Evolutiva */}
                                    <div className="contenedorTituloSeccion">
                                        <h2 className="tituloSeccion">Cadena Evolutiva</h2>
                                        <button
                                            className="toggleEvolucion"
                                            onClick={() => setMostrarEvolucion(!mostrarEvolucion)}
                                            type="button"
                                        >
                                            <span className={mostrarEvolucion ? "iconoRotado" : "iconoNormal"}>
                                                <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                            </span>
                                        </button>
                                    </div>

                                    {/* Componente Cadena Evolutiva */}
                                    <div id="cadenaEvo" className={mostrarEvolucion ? "visible" : "oculto"}>
                                        <div className={`evo-viewport ${pokemonData.evolutionChain.length === 1 ? "solo-una-evo" : ""}`}>
                                            <div className="evo-track">
                                                <CadenaEvolutivaPkm
                                                    cadenaEvolutiva={pokemonData.evolutionChain}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>

                        {/* Parte Superior Derecha: Tarjeta Resumen del Pokémon */}
                        <div id="arribaDer">

                            {/* Nombre e ID: Se muestra solo en pantallas pequeñas */}
                            <div className="nombreID-mobile paddingCelu">
                                <NombreIDPkm
                                    id={pokemonData.id}
                                    nombre={nombreActual}
                                    tipos={tipos}
                                />
                            </div>

                            {/* Tarjeta Resumen con info del Pokémon */}
                            <div className="tarjetaInicialWrapper">
                                <div className="tarjetaInicial" ref={tarjetaInicialRef}>

                                    {/* Generación Pokémon */}
                                    <GeneracionPkm
                                        generacion={pokemonData.generation}
                                        size="normal"
                                    />

                                    {/* Imagen Pokémon */}
                                    <ImgPokemon
                                        imgNormal={pokemonData.img}
                                        imgShiny={pokemonData.imgShiny}
                                        altText={nombreActual}
                                    />

                                    {/* Tipos Pokémon */}
                                    {tipos.length === 1 ? (
                                        <div className="contenedorTipos">
                                            <div className="tiposFila">
                                                <div
                                                    className="tipo-wrap-pkm-vertical-UnoSolo"
                                                    style={{ "backgroundColor": getTipoBgPkm(tipos[0]) }}
                                                >
                                                    <Tipo
                                                        tipo={tipos[0]}
                                                        size="normal"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : tipos.length === 2 ? (
                                        <div className="tipos-stack-center">
                                            <div className="contenedor-tipos-horizontal-dos">
                                                {tipos.map((tipo, index) => (
                                                    <div
                                                        key={index}
                                                        className="tipo-wrap-pkm-horizontal-dos"
                                                        style={tipoPkmWidth ? {
                                                            "backgroundColor": getTipoBgPkm(tipo),
                                                            "--tipo-pkm-width": `${tipoPkmWidth}px`
                                                        } : {
                                                            "backgroundColor": getTipoBgPkm(tipo)
                                                        }}
                                                    >
                                                        <Tipo
                                                            tipo={tipo}
                                                            size={"normal"}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="tipos-stack-center">
                                            <div className="contenedor-tipos-vertical">
                                                {tipos.map((tipo, index) => (
                                                    <div
                                                        key={index}
                                                        className="tipo-wrap-pkm-vertical"
                                                        style={tipoPkmWidth ? {
                                                            "backgroundColor": getTipoBgPkm(tipo),
                                                            "--tipo-pkm-width": `${tipoPkmWidth}px`
                                                        } : {
                                                            "backgroundColor": getTipoBgPkm(tipo)
                                                        }}
                                                    >
                                                        <Tipo
                                                            tipo={tipo}
                                                            size="normal"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Pokémon */}
                                    <div className="contenedorGenerico contenedorColorPkm margenAbajo">
                                        <ColorPkm
                                            color={pokemonData.color}
                                            size="normal"
                                        />
                                    </div>

                                    {/* Genero Pokémon */}
                                    <div className="contenedorGenerico contenedorGeneroPkm margenAbajo">
                                        <GeneroPkm
                                            porcentajeMacho={pokemonData.malePercentage}
                                            porcentajeHembra={pokemonData.femalePercentage}
                                            sinSexo={pokemonData.sinSexo}
                                            size="normal"
                                        />
                                    </div>

                                    {/* Peso y Altura Pokémon */}
                                    <div className="contenedorGenerico contenedorPesoYAlturaPkm margenAbajo">
                                        <PesoYAlturaPkm
                                            altura={pokemonData.height !== null && pokemonData.height !== undefined ? `${pokemonData.height}m` : undefined}
                                            peso={pokemonData.weight !== null && pokemonData.weight !== undefined ? `${pokemonData.weight}Kg` : undefined}
                                            size="normal"
                                        />
                                    </div>

                                    {/* Indice de Captura Pokémon */}
                                    <div className="contenedorGenerico contenedorIndiceCapturaPkm margenAbajo">
                                        <IndiceCapturaPkm
                                            rate={pokemonData.captureRate}
                                            size="normal"
                                        />
                                    </div>

                                    {/* Habilidades Pokémon */}
                                    {habilidadesVisibles.length > 0 && (
                                        <div className="contenedorGenerico contenedorHabilidadPkm margenAbajo">
                                            <HabilidadesPkm
                                                habilidades={habilidadesVisibles}
                                                isHidden={false}
                                                size="normal"
                                            />
                                        </div>
                                    )}

                                    {/* Habilidades Ocultas Pokémon */}
                                    {habilidadesOcultas.length > 0 && (
                                        <div className="contenedorGenerico contenedorHabilidadPkm margenAbajo">
                                            <HabilidadesPkm
                                                habilidades={habilidadesOcultas}
                                                isHidden={true}
                                                size="normal"
                                            />
                                        </div>
                                    )}

                                    {/* Grito Pokémon */}
                                    <div className="contenedorGenerico margenAbajo">
                                        <GritoPkm
                                            gritoUrl={pokemonData.criesLatest || null}
                                            size="large"
                                        />
                                    </div>

                                    {/* Numero de Pokedex en todos los juegos donde aparece */}
                                    {arrDex.map((dex, index) => (
                                        <PokedexNav
                                            key={index}
                                            titulo={dex.title}
                                            baseId={dex.baseId}
                                            prev={dex.prev}
                                            next={dex.next}
                                            defaultOpen={!isMobileViewport}
                                        />
                                    ))}

                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Debilidades y Resistencias */}
                    {!loading && !error && Array.isArray(tipos) && tipos.length > 0 && Array.isArray(habilidadesNombres) && habilidadesNombres.length > 0 && (
                        <>
                            {/* Titulo Seccion Debilidades y Resistencias */}
                            <div className="contenedorTituloSeccion">
                                <h2 className="tituloSeccion">Debilidades y Resistencias</h2>
                                <button
                                    className="toggleDebilidadesYResistencias"
                                    onClick={() =>
                                    {
                                        setMostrarDebilidadesYResistencias(prev =>
                                        {
                                            const next = !prev;
                                            if(next) setMontarDYR(true);
                                            return next;
                                        });
                                    }}
                                    aria-expanded={mostrarDebilidadesYResistencias}
                                    aria-controls="idDebilidadesYResistencias"
                                    type="button"
                                >
                                    <span className={mostrarDebilidadesYResistencias ? "iconoRotado" : "iconoNormal"}>
                                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                    </span>
                                </button>
                            </div>

                            {/* Componente de Debilidades y Resistencias */}
                            {montarDYR && (
                                <div id="idDebilidadesYResistencias" className={mostrarDebilidadesYResistencias ? "visible" : "oculto"}>
                                    <div className="unMargenSuperior">
                                        <DebilidadesYResistencias
                                            tipos={tipos}
                                            habilidades={habilidadesNombres}
                                            enPlenosPS={true}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Formas Pokémon */}
                    {formas.length > 0 && (
                        <>
                            {/* Titulo Seccion Formas */}
                            <div className="contenedorTituloSeccion">
                                <h2 className="tituloSeccion">Formas</h2>
                                <button
                                    className="toggleFormas"
                                    onClick={() => setMostrarFormas(!mostrarFormas)}
                                    type="button"
                                >
                                    <span className={mostrarFormas ? "iconoRotado" : "iconoNormal"}>
                                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                    </span>
                                </button>
                            </div>

                            {/* Componente de Formas Pokémon */}
                            <div id="formasPkm" className={mostrarFormas ? "visible" : "oculto"}>
                                <div className="formas-viewport">
                                    <FormasPkm
                                        formas={formas}
                                        apiKey={pokemonData?.apiName || ""}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Mega Evoluciones */}
                    {megas.length > 0 && (
                        <>
                            {/* Titulo Seccion Mega Evoluciones */}
                            <div className="contenedorTituloSeccion">
                                <h2 className="tituloSeccion">Mega Evoluciones</h2>
                                <button
                                    className="toggleMegas"
                                    onClick={() => setMostrarMegas(!mostrarMegas)}
                                    type="button"
                                >
                                    <span className={mostrarMegas ? "iconoRotado" : "iconoNormal"}>
                                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                    </span>
                                </button>
                            </div>

                            {/* Componente Mega Evoluciones */}
                            <div id="idMegasPkm" className={mostrarMegas ? "visible" : "oculto"}>
                                <div>
                                    <MegaEvoPkm
                                        megas={megas}
                                        apiNameBasePkm={pokemonData.specieName || ""}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Gigamax */}
                    {tieneGiga && (
                        <>
                            {/* Titulo Seccion Gigamax */}
                            <div className="contenedorTituloSeccion">
                                <h2 className="tituloSeccion">Gigamax</h2>
                                <button
                                    className="toggleGiga"
                                    onClick={() => setMostrarGiga(!mostrarGiga)}
                                    type="button"
                                >
                                    <span className={mostrarGiga ? "iconoRotado" : "iconoNormal"}>
                                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                    </span>
                                </button>
                            </div>

                            {/* Componente Gigamax - Para Eternatus se muestra de forma especial */}
                            <div id="idGigaPkm" className={mostrarGiga ? "visible" : "oculto"}>
                                {pokemonData?.apiName === "eternatus" && pokemonData.giga ? (
                                    <MegaEvoPkm megas={[pokemonData.giga]} />                       
                                ) : (
                                    <GigaPkm
                                        giga={pokemonData.giga}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {/* Áreas de Localización */}
                    {pokemonData && (
                        <>
                            <div className="contenedorTituloSeccion">
                                <h2 className="tituloSeccion">Áreas de Localización</h2>
                                <button
                                    className="toggleAreaLocalizacion"
                                    onClick={() =>
                                    {
                                        setMostrarAreaLocalizacion(prev => !prev);
                                    }}
                                    type="button"
                                >
                                    <span className={mostrarAreaLocalizacion ? "iconoRotado" : "iconoNormal"}>
                                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                    </span>
                                </button>
                            </div>

                            <div id="idAreasLocalizacionPkm" className={mostrarAreaLocalizacion ? "visible" : "oculto"}>
                                <div className="unMargenSuperior">
                                    {loadingAreaLocalizacion ? (
                                        <div className="loading-containerPokemon">
                                            <LoadingPkm inline />
                                        </div>
                                    ) : (
                                        <AreaLocalizacion areasLocalizacion={areasLocalizacionNormalizadas} />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Movimientos */}
                    {pokemonData && (
                        <>
                            <div className="contenedorTituloSeccion">
                                <h2 className="tituloSeccion">Movimientos</h2>
                                <button
                                    className="toggleMovimientosPcipal"
                                    onClick={() =>
                                    {
                                        setMostrarMovsPcipal(prev =>
                                        {
                                            const next = !prev;
                                            return next;
                                        });
                                    }}
                                    type="button"
                                >
                                    <span className={mostrarMovsPcipal ? "iconoRotado" : "iconoNormal"}>
                                        <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                    </span>
                                </button>
                            </div>

                            <div id="idMovsPcipal" className={mostrarMovsPcipal ? "visible" : "oculto"}>
                                {loadingMovimientos ? (
                                    <div className="loading-containerPokemon unMargenSuperior">
                                        <LoadingPkm inline />
                                    </div>
                                ) : (
                                    <>
                                        <div className="subContenedorTituloSeccion">
                                            <h2>Movimientos por Nivel</h2>
                                            <button
                                                className="toggleMovsNivel"
                                                onClick={() => setMostrarMovsNivel(!mostrarMovsNivel)}
                                                type="button"
                                            >
                                                <span className={mostrarMovsNivel ? "iconoRotado" : "iconoNormal"}>
                                                    <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                                </span>
                                            </button>
                                        </div>

                                        <div id="idMovsNivel" className={mostrarMovsNivel ? "visible" : "oculto"}>
                                            <ListaMovimientosPkm
                                                grupos={Array.isArray(movimientosNormalizados) ? movimientosNormalizados : []}
                                                modo="nivel"
                                                nombrePokemon={nombreActual}
                                            />
                                        </div>

                                        <div className="subContenedorTituloSeccion">
                                            <h2>Movimientos por MT, DT y MO</h2>
                                            <button
                                                className="toggleMovsMT"
                                                onClick={() => setMostrarMovsMT(!mostrarMovsMT)}
                                                type="button"
                                            >
                                                <span className={mostrarMovsMT ? "iconoRotado" : "iconoNormal"}>
                                                    <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                                </span>
                                            </button>
                                        </div>

                                        <div id="idMovsMT" className={mostrarMovsMT ? "visible" : "oculto"}>
                                            <ListaMovimientosPkm
                                                grupos={Array.isArray(movimientosNormalizados) ? movimientosNormalizados : []}
                                                modo="mt"
                                                nombrePokemon={nombreActual}
                                            />
                                        </div>

                                        <div className="subContenedorTituloSeccion">
                                            <h2>Movimientos por Tutor</h2>
                                            <button
                                                className="toggleMovsTutor"
                                                onClick={() => setMostrarMovsTutor(!mostrarMovsTutor)}
                                                type="button"
                                            >
                                                <span className={mostrarMovsTutor ? "iconoRotado" : "iconoNormal"}>
                                                    <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                                </span>
                                            </button>
                                        </div>

                                        <div id="idMovsTutor" className={mostrarMovsTutor ? "visible" : "oculto"}>
                                            <ListaMovimientosPkm
                                                grupos={Array.isArray(movimientosNormalizados) ? movimientosNormalizados : []}
                                                modo="tutor"
                                                nombrePokemon={nombreActual}
                                            />
                                        </div>

                                        <div className="subContenedorTituloSeccion">
                                            <h2>Movimientos Huevo</h2>
                                            <button
                                                className="toggleMovsHuevo"
                                                onClick={() => setMostrarMovsHuevo(!mostrarMovsHuevo)}
                                                type="button"
                                            >
                                                <span className={mostrarMovsHuevo ? "iconoRotado" : "iconoNormal"}>
                                                    <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
                                                </span>
                                            </button>
                                        </div>

                                        <div id="idMovsHuevo" className={mostrarMovsHuevo ? "visible" : "oculto"}>
                                            <ListaMovimientosPkm
                                                grupos={Array.isArray(movimientosNormalizados) ? movimientosNormalizados : []}
                                                modo="huevo"
                                                nombrePokemon={nombreActual}
                                                puedeCriar={!!pokemonData?.puedeCriar}
                                                evolutionChain={Array.isArray(pokemonData?.evolutionChain) ? pokemonData.evolutionChain : []}
                                                pokemonApiName={pokemonData?.apiName || ""}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </div>
            )}

        </div>
    );

}