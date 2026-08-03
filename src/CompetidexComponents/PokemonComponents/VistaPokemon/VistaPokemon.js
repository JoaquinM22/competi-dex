//** src\CompetidexComponents\PokemonComponents\VistaPokemon\VistaPokemon.js

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePokemon } from "../PokemonProvider";
import { usePokedex } from "../../PokedexComponents/PokedexProvider";
import { useAbilities } from "../../HabilidadesComponents/AbilitiesProvider";
import { useItems } from "../../ItemsComponents/ItemsProvider";
import { useMoves } from "../../MovimientosComponents/MovesProvider";
import { createPokemonMapper } from "../pokemonMapper";
import { CACHE_VERSION } from "../pokemonCache";
import { pokemonRoute } from "../../../utils/competidexRoutes";
import BuscadorPokemon from "./BuscadorPokemon/BuscadorPokemon";
import DataPokemon from "./DataPokemon/DataPokemon";
import "./VistaPokemon.css";

function toSlugApiKey(key = "")
{
  return encodeURIComponent(String(key || "").trim().toLowerCase());
}

const KEY_LAST_POKEMON_KEY = `pokemon:lastKey:${CACHE_VERSION}`;
const KEY_LAST_POKEMON_SLUG = `pokemon:lastSlug:${CACHE_VERSION}`;

export default function VistaPokemon()
{
  const { nombre: paramNombre } = useParams();
  const navigate = useNavigate();
  const { getPokemon, getPokemonSpecies, getUrl, getPokemonIdByKey, getPokemonKeyById, resolvePokemonInput, getPokemonSlug, pokemonMapReady } = usePokemon();
  const { buildDexEntriesFromPokedexNumbers } = usePokedex();
  const { translatePokemonAbilities, translateAbilitiesByKeys } = useAbilities();
  const { translatePokemonItems } = useItems();
  const { translatePokemonMoves } = useMoves();

  const [pokemonABuscar, setPokemonABuscar] = useState("");
  const [unPokemon, setUnPokemon] = useState(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [errorPokemon, setErrorPokemon] = useState(null);

  const mapper = useMemo(function()
  {
    return createPokemonMapper({
      getPokemonRaw: getPokemon,
      getPokemonSpeciesRaw: getPokemonSpecies,
      getUrlRaw: getUrl,
      getPokemonIdByKey: getPokemonIdByKey,
      translatePokemonAbilities: translatePokemonAbilities,
      translateAbilitiesByKeys: translateAbilitiesByKeys,
      translatePokemonItems: translatePokemonItems,
      translatePokemonMoves: translatePokemonMoves,
      buildDexEntriesFromPokedexNumbers: function(pokedexNumbers)
      {
        return buildDexEntriesFromPokedexNumbers(pokedexNumbers, getPokemonKeyById);
      },
      DEBUG_POKEMON: false
    });

  }, [getPokemon, getPokemonSpecies, getUrl, getPokemonIdByKey, getPokemonKeyById, translatePokemonAbilities, translateAbilitiesByKeys, translatePokemonItems, translatePokemonMoves, buildDexEntriesFromPokedexNumbers]);

  const obtenerPokemon = useCallback(async function(nameOrId)
  {
    return mapper.obtenerPokemon(nameOrId);

  }, [mapper]);

  // 1) Si NO hay param, restauro el ultimo pokemon visto
  useEffect(() =>
  {
    if (paramNombre) return;

    let lastSlug = "";
    let lastKey = "";

    try { lastSlug = (sessionStorage.getItem(KEY_LAST_POKEMON_SLUG) || "").trim().toLowerCase(); } catch (e) {}
    try { lastKey = (sessionStorage.getItem(KEY_LAST_POKEMON_KEY) || "").trim().toLowerCase(); } catch (e) {}

    const safeSlug = lastKey
      ? (getPokemonSlug(lastKey) || lastSlug || lastKey)
      : lastSlug;

    if(safeSlug)
    {
      navigate(pokemonRoute(toSlugApiKey(safeSlug)), { replace: true });
    }

  }, [paramNombre, navigate, getPokemonSlug]);

  // 2) Param URL -> resolver (slug/display/key) -> apiKey y canonizar URL
  useEffect(() =>
  {
    if (!paramNombre) return;
    if (!pokemonMapReady) return;

    let rawParam = "";
    try { rawParam = decodeURIComponent(paramNombre); } catch (e) { rawParam = String(paramNombre || ""); }
    rawParam = String(rawParam || "").trim();

    const resolved = resolvePokemonInput(rawParam);

    if(resolved && resolved.key)
    {
      setPokemonABuscar(resolved.key);

      const safeSlug = getPokemonSlug(resolved.key) || resolved.slug || resolved.key;
      const want = toSlugApiKey(safeSlug);
      const cur = toSlugApiKey(rawParam);

      if(want && cur !== want)
      {
        navigate(pokemonRoute(want), { replace: true });
      }

      try { sessionStorage.setItem(KEY_LAST_POKEMON_KEY, String(resolved.key)); } catch (e) {}
      try { sessionStorage.setItem(KEY_LAST_POKEMON_SLUG, String(safeSlug)); } catch (e) {}

    }else
    {
      setPokemonABuscar(String(rawParam || "").toLowerCase().trim());
    }

  }, [paramNombre, pokemonMapReady, resolvePokemonInput, navigate, getPokemonSlug]);

  // 3) Buscar cuando cambia pokemonABuscar
  useEffect(() =>
  {
    let alive = true;

    if(!pokemonABuscar)
    {
      setLoadingPokemon(false);
      return;
    }

    (async () =>
    {
      
      try
      {
        setLoadingPokemon(true);
        setErrorPokemon(null);

        const pok = await obtenerPokemon(pokemonABuscar);
        if (!alive) return;

        setUnPokemon(pok);

        const currentApiName = String(pok?.pokemonData?.apiName || pokemonABuscar || "").trim().toLowerCase();
        try { sessionStorage.setItem(KEY_LAST_POKEMON_KEY, String(currentApiName || pokemonABuscar)); } catch (e) {}
        try { sessionStorage.setItem(KEY_LAST_POKEMON_SLUG, String(toSlugApiKey(currentApiName || pokemonABuscar))); } catch (e) {}

      }catch(e)
      {
        if (!alive) return;
        setUnPokemon(null);
        setErrorPokemon(e || new Error("Error al obtener pokemon"));

      }finally
      {
        if (alive) setLoadingPokemon(false);
      }

    })();

    return () => { alive = false; };

  }, [pokemonABuscar, obtenerPokemon]);

  function handleSearch(nombre)
  {
    const raw = (nombre || "").trim();
    if(!raw)
    {
      setPokemonABuscar("");
      setUnPokemon(null);
      setErrorPokemon(null);
      navigate(pokemonRoute(), { replace: false });

      return;
    }

    const resolved = resolvePokemonInput(raw);
    if (!resolved || !resolved.key) return;

    const safeSlug = getPokemonSlug(resolved.key) || resolved.slug || resolved.key;

    setPokemonABuscar(resolved.key);
    navigate(pokemonRoute(toSlugApiKey(safeSlug)), { replace: false });

    try { sessionStorage.setItem(KEY_LAST_POKEMON_KEY, String(resolved.key)); } catch (e) {}
    try { sessionStorage.setItem(KEY_LAST_POKEMON_SLUG, String(safeSlug)); } catch (e) {}
  }

  return (
    <div className="vista-wrapper">
      <div className="componenteVistaPokemon">

        {/* Buscador de Pokemon, alimentado por el Provider */}
        <BuscadorPokemon
          onSearch={handleSearch}
          titulo="Pokémon"
        />

        {/* Componente de data del Pokemon */}
        <DataPokemon
          pokemon={unPokemon?.pokemonData || null}
          movesRawData={Array.isArray(unPokemon?.movesRawData) ? unPokemon.movesRawData : []}
          loading={loadingPokemon}
          error={errorPokemon}
        />

      </div>
    </div>
  );

}
