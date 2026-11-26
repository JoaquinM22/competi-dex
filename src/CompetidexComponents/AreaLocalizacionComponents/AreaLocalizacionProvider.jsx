//** src\CompetidexComponents\AreaLocalizacionComponents\AreaLocalizacionProvider.js

import React, { createContext, useContext, useMemo } from "react";
import { GAME_VERSIONS_META, GENERATIONS_META } from "../../utils/competidexMeta";
import {
  ensureAreaLocalizacionRaw,
  getAreaLocalizacionRaw,
  clearAreaLocalizacionRaw,
  clearAllAreaLocalizacionCache,
  preloadAreaLocalizacion,
  saveAreaLocalizacionRaw,
  getAreaLocalizacionPersistentRaw,
  CACHE_VERSION
} from "./areaLocalizacionCache";
import {
  buildAreaLocalizacionGroups,
  getAreaLocalizacionGenerationDefinitions,
  prettifyLocationName,
  UNKNOWN_GENERATION,
  getGenerationLabelFromVersion,
  getGenerationKeyFromGameVersion,
  getGenerationMetaByVersion
} from "./areaLocalizacionMapper";

const AreaLocalizacionContext = createContext(null);

export function AreaLocalizacionProvider({ children })
{
  const gameVersionLabelEsByKey = useMemo(() =>
  {
    const out = {};
    Object.entries(GAME_VERSIONS_META || {}).forEach(([key, meta]) =>
    {
      out[key] = String(meta?.versionLabelEs || meta?.labelEs || key || "").trim();
    });

    return out;

  }, []);

  const gameVersionGenerationByKey = useMemo(() =>
  {
    const out = {};

    Object.entries(GENERATIONS_META || {}).forEach(([generationKey, generationMeta]) =>
    {
      const versions = Array.isArray(generationMeta?.gameVersions) ? generationMeta.gameVersions : [];

      versions.forEach((versionKey) =>
      {
        const key = String(versionKey || "").trim().toLowerCase();
        if(!key) return;

        out[key] = generationKey;
      });
    });

    return out;

  }, []);

  const value = useMemo(() =>
  {
    return {
      CACHE_VERSION,

      ensureAreaLocalizacionRaw,
      getAreaLocalizacionRaw,
      clearAreaLocalizacionRaw,
      clearAllAreaLocalizacionCache,
      preloadAreaLocalizacion,
      saveAreaLocalizacionRaw,
      getAreaLocalizacionPersistentRaw,

      buildAreaLocalizacionGroups,
      getAreaLocalizacionGenerationDefinitions,
      prettifyLocationName,
      UNKNOWN_GENERATION,
      getGenerationLabelFromVersion,
      getGenerationKeyFromGameVersion,
      getGenerationMetaByVersion,

      gameVersionLabelEsByKey,
      gameVersionGenerationByKey
    };

  }, [
    gameVersionLabelEsByKey,
    gameVersionGenerationByKey
  ]);

  return (
    <AreaLocalizacionContext.Provider value={value}>
      {children}
    </AreaLocalizacionContext.Provider>
  );
}

export function useAreaLocalizacion()
{
  const ctx = useContext(AreaLocalizacionContext);
  if(!ctx) throw new Error("useAreaLocalizacion debe usarse dentro de <AreaLocalizacionProvider>");

  return ctx;
}