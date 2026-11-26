//** src\CompetidexComponents\CalculadoraDeCaracteristicasComponents\VistaCalculadoraCaracteristicas.js

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePokemon } from "../PokemonComponents/PokemonProvider";
import { CACHE_VERSION } from "../PokemonComponents/pokemonCache";
import { createPokemonCalcCaracteristicasMapper } from "./pokemonCalcCaracteristicasMapper";
import ErrorNotFoundPkm from "../SharedComponents/ErrorNotFoundPkm/ErrorNotFoundPkm";
import LoadingPkm from "../SharedComponents/LoadingPkm/LoadingPkm";
import BuscadorPokemon from "../PokemonComponents/VistaPokemon/BuscadorPokemon/BuscadorPokemon";
import CalculadoraDeCaracteristicas from "./CalculadoraDeCaracteristicas/CalculadoraDeCaracteristicas";
import "./VistaCalculadoraCaracteristicas.css";

const KEY_LAST_CALC_POKEMON_KEY = `calc:lastKey:${CACHE_VERSION}`;

export default function VistaCalculadoraCaracteristicas()
{
    const { getPokemon, resolvePokemonInput } = usePokemon();

    const [pokemonABuscar, setPokemonABuscar] = useState("");
    const [pokemonCalc, setPokemonCalc] = useState(null);
    const [loadingPokemon, setLoadingPokemon] = useState(false);
    const [errorPokemon, setErrorPokemon] = useState(null);

    useEffect(() =>
    {
        let lastKey = "";

        try
        {
            lastKey = String(sessionStorage.getItem(KEY_LAST_CALC_POKEMON_KEY) || "").trim().toLowerCase();

        }catch(e)
        {
            lastKey = "";
        }

        if(lastKey)
        {
            setPokemonABuscar(lastKey);
        }

    }, []);

    const mapper = useMemo(() =>
    {
        return createPokemonCalcCaracteristicasMapper({
            getPokemonRaw: getPokemon,
        });

    }, [getPokemon]);

    const obtenerPokemonCalc = useCallback(async (nameOrId) =>
    {
        return mapper.obtenerPokemonCalcCaracteristicas(nameOrId);

    }, [mapper]);

    function handleSearch(nombre)
    {
        const raw = String(nombre || "").trim();

        if(!raw)
        {
            setPokemonABuscar("");
            setPokemonCalc(null);
            setErrorPokemon(null);
            setLoadingPokemon(false);

            return;
        }

        const resolved = resolvePokemonInput(raw);
        if(!resolved || !resolved.key) return;

        setPokemonABuscar(resolved.key);

        try
        {
            sessionStorage.setItem(KEY_LAST_CALC_POKEMON_KEY, String(resolved.key));
        }catch(e)
        {
            //
        }
    }

    useEffect(() =>
    {
        let alive = true;

        if(!pokemonABuscar)
        {
            setPokemonCalc(null);
            setLoadingPokemon(false);

            return;
        }

        (async () => {

            try
            {
                setLoadingPokemon(true);
                setErrorPokemon(null);

                const pok = await obtenerPokemonCalc(pokemonABuscar);
                if(!alive) return;

                setPokemonCalc(pok);

                const currentApiName = String(pok?.apiName || pokemonABuscar || "").trim().toLowerCase();
                try
                {
                    sessionStorage.setItem(KEY_LAST_CALC_POKEMON_KEY, String(currentApiName || pokemonABuscar));
                }catch(e)
                {
                    //
                }

            }catch(e)
            {
                if(!alive) return;

                setPokemonCalc(null);
                setErrorPokemon(e || new Error("Error al obtener pokemon"));

            }finally
            {
                if(alive) setLoadingPokemon(false);
            }

        })();

        return () => {
            alive = false;
        };

    }, [pokemonABuscar, obtenerPokemonCalc]);

    return (
        <div className="vistaCalcCaracteristicas-page">
            <div className="vistaCalcCaracteristicas-container">

                {/* Titulo */}
                <div className="vistaCalcCaracteristicas-titulo-wrapper">
                    <h1 className="vistaCalcCaracteristicas-title">
                        Calculadora de Características
                    </h1>
                </div>

                {/* Data Calculadora */}
                <div className="vistaCalcCaracteristicas-data">
                    
                    {/* Buscador de Pokémon */}
                    <BuscadorPokemon
                        onSearch={handleSearch}
                        titulo="Elegir Pokémon"
                        wrapperBgColor={"#282c34"}
                        searchWrapperBgColor={"#383b3f"}
                        useBlockedAbilitiesList={true}
                    />

                    {/* Calculadora del Pokémon elegido */}
                    <div className="vistaCalcCaracteristicas-panel">
                        
                        {loadingPokemon && (
                            <div className="vistaCalcCaracteristicas-dataContent">
                                <LoadingPkm  />
                            </div>
                        )}

                        {!loadingPokemon && errorPokemon && (
                            <div className="vistaCalcCaracteristicas-dataContent">
                                <ErrorNotFoundPkm error="Error al obtener datos del Pokémon" />
                            </div>
                        )}

                        {!loadingPokemon && !errorPokemon && pokemonCalc && (
                            <CalculadoraDeCaracteristicas pokemon={pokemonCalc} />
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
  
}