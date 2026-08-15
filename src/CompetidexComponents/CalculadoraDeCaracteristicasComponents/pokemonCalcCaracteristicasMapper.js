//** src\CompetidexComponents\CalculadoraDeCaracteristicasComponents\pokemonCalcCaracteristicasMapper.js

import { officialArtworkUrl, shinyArtworkUrl } from "../../config/endpoints";
import { toPokemonDisplayName } from "../../utils/competidexMeta";

function safeNumber(value)
{
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function emptyStats()
{
  return {
    "hp": null,
    "atk": null,
    "def": null,
    "spe_atk": null,
    "spe_def": null,
    "speed": null,
  };
}

function getRawTypes(raw)
{
  const types = Array.isArray(raw)
    ? raw
    : (raw && Array.isArray(raw.types) ? raw.types : []);

  return types
    .map((item) => item?.type?.name)
    .filter(Boolean);
}

// Caracteristicas de Combate
function returnEmptyStats()
{
  return {
    "hp": null,
    "effort_hp": null,

    "atk": null,
    "effort_atk": null,

    "def": null,
    "effort_def": null,

    "spe_atk": null,
    "effort_spe_atk": null,

    "spe_def": null,
    "effort_spe_def": null,

    "speed": null,
    "effort_speed": null,
  };
}

function getStats(rawStats)
{
  const statsPoke = returnEmptyStats();
  const arr = Array.isArray(rawStats) ? rawStats : [];

  for(const item of arr)
  {
    const name = item?.stat?.name;
    const base = item?.base_stat ?? null;
    const effort = item?.effort ?? null;

    switch(name)
    {
      case "hp":
        statsPoke.hp = base;
        statsPoke.effort_hp = effort;
        break;

      case "attack":
        statsPoke.atk = base;
        statsPoke.effort_atk = effort;
        break;

      case "defense":
        statsPoke.def = base;
        statsPoke.effort_def = effort;
        break;

      case "special-attack":
        statsPoke.spe_atk = base;
        statsPoke.effort_spe_atk = effort;
        break;

      case "special-defense":
        statsPoke.spe_def = base;
        statsPoke.effort_spe_def = effort;
        break;

      case "speed":
        statsPoke.speed = base;
        statsPoke.effort_speed = effort;
        break;
    }
  }

  return statsPoke;
}

export function createPokemonCalcCaracteristicasMapper({ getPokemonRaw })
{
  if(typeof getPokemonRaw !== "function")
  {
    throw new Error("createPokemonCalcCaracteristicasMapper: falta getPokemonRaw");
  }

  async function obtenerPokemonCalcCaracteristicas(nameOrId)
  {
    const raw = await getPokemonRaw(nameOrId);
    if(!raw)
    {
      throw new Error("No se pudo obtener el Pokémon");
    }

    const id = safeNumber(raw?.id);
    const apiName = String(raw?.name || nameOrId || "").trim().toLowerCase();

    return {
      "id": id,
      "apiName": apiName,
      "display": toPokemonDisplayName(apiName),
      "img": id ? officialArtworkUrl(id) : "",
      "imgShiny": id ? shinyArtworkUrl(id) : "",
      "types": getRawTypes(raw),
      "stats": getStats(raw?.stats)
    };
  }

  return {
    obtenerPokemonCalcCaracteristicas,
  };

}