//** src\CompetidexComponents\BuscadorAvanzadoComponents\FiltroPkmProvider.js

import React, { createContext, useContext, useMemo } from "react";
import { buildPkmFiltersMeta, buildMovsFiltersMeta, buildHabsFiltersMeta, buildItemsFiltersMeta } from "../../utils/competidexMeta";
import { usePokemon } from "../PokemonComponents/PokemonProvider";
import { useAbilities } from "../HabilidadesComponents/AbilitiesProvider";
import { useMoves } from "../MovimientosComponents/MovesProvider";

const FiltroPkmContext = createContext(null);

export function FiltroPkmProvider({ children })
{
  const { categoryPkmOptions = [], pokemonMapReady } = usePokemon();
  const { abilityOptions = [], esMapReadyAbilities } = useAbilities();
  const { esMapReady } = useMoves();

  const pkmFiltersSchema = useMemo(function()
  {
    const schema = buildPkmFiltersMeta({
      abilityOptions: Array.isArray(abilityOptions) ? abilityOptions : [],
      categoryPkmOptions: Array.isArray(categoryPkmOptions) ? categoryPkmOptions : []
    });

    return schema;

  }, [abilityOptions, categoryPkmOptions]);

  const movsFiltersSchema = useMemo(function()
  {
    const schema = buildMovsFiltersMeta();

    return schema;

  }, []);

  const habsFiltersSchema = useMemo(function()
  {
    const schema = buildHabsFiltersMeta();

    return schema;

  }, []);

  const itemsFiltersSchema = useMemo(function()
  {
    const schema = buildItemsFiltersMeta();

    return schema;

  }, []);

  const value = useMemo(function()
  {
    return {
      filtersSchema: pkmFiltersSchema,
      pkmFiltersSchema: pkmFiltersSchema,
      movsFiltersSchema: movsFiltersSchema,
      habsFiltersSchema: habsFiltersSchema,
      itemsFiltersSchema: itemsFiltersSchema,
      abilityOptions: Array.isArray(abilityOptions) ? abilityOptions : [],
      categoryPkmOptions: Array.isArray(categoryPkmOptions) ? categoryPkmOptions : [],
      ready: !!pokemonMapReady && !!esMapReadyAbilities,
      pkmReady: !!pokemonMapReady && !!esMapReadyAbilities,
      movsReady: !!esMapReady,
      habsReady: !!esMapReadyAbilities,
      itemsReady: true
    };

  }, [pkmFiltersSchema, movsFiltersSchema, habsFiltersSchema, itemsFiltersSchema, abilityOptions, categoryPkmOptions, pokemonMapReady, esMapReadyAbilities, esMapReady]);

  return (
    <FiltroPkmContext.Provider value={value}>
      {children}
    </FiltroPkmContext.Provider>
  );
  
}

export function useFiltroPkm()
{
  const ctx = useContext(FiltroPkmContext);
  if(!ctx)
  {
    throw new Error("useFiltroPkm debe usarse dentro de <FiltroPkmProvider>");
  }

  return ctx;
}