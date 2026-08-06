//** src\CompetidexComponents\PokemonComponents\pokemonMapper.js

import {
  toPokemonDisplayName,
  getPokemonRegionKeys, getPokemonRegionDisplayName,
  getPokemonMegaForms, hasPokemonMegaForms,
  getPokemonGigaForm, hasPokemonGigaForm,
  getPokemonForms, hasPokemonForms,
  canPokemonBreed,
  getColorPkmByKey,
  getExtraAbilityKeysByKey,
  getPokemonGenByKey,
  getPokemonEvolutionPatch
} from "../../utils/competidexMeta";
import { officialArtworkUrl, shinyArtworkUrl } from "../../config/endpoints";

// ------------ Funciones Auxiliares - INICIO ------------ 
function ponerMayuscula(txt)
{
  const s = String(txt || "").trim();
  if (!s) return "";

  return s.charAt(0).toUpperCase() + s.slice(1);
}

function safeNumber(value)
{
  return (typeof value === "number" && Number.isFinite(value))
    ? value
    : null;
}

function safeText(value)
{
  if (typeof value !== "string") return null;
  const txt = value.trim();
  return (txt !== "") ? txt : null;
}

function formatWeight(value)
{
  const num = safeNumber(value);
  if (num === null) return null;

  const weightRes = num / 10; // Lo paso a Kg
  return Number(weightRes.toFixed(1));
}

function formatHeight(value)
{
  const num = safeNumber(value);
  if (num === null) return null;

  const heightRes = num / 10; // Lo paso a metros
  return Number(heightRes.toFixed(1));
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

function getGenderPercentagePkm(genderRate)
{
  if(genderRate === -1 || genderRate == null)
  {
    return {
      malePercentage: null,
      femalePercentage: null,
      sinSexo: true
    };
  }

  if(genderRate === 0)
  {
    return {
      malePercentage: 100,
      femalePercentage: null,
      sinSexo: false
    };
  }

  if(genderRate === 8)
  {
    return {
      malePercentage: null,
      femalePercentage: 100,
      sinSexo: false
    };
  }

  const femalePercentage = (genderRate / 8) * 100;
  const malePercentage = 100 - femalePercentage;

  return {
    malePercentage: parseFloat(malePercentage.toFixed(1)),
    femalePercentage: parseFloat(femalePercentage.toFixed(1)),
    sinSexo: false
  };
}

function getMetodoEvo(evolutionInfo)
{
  evolutionInfo = evolutionInfo || {};

  let metodoEvo = "";

  if(evolutionInfo.min_level != null)
  {
    metodoEvo = `Subir al nivel ${evolutionInfo.min_level}`;

  }else if(evolutionInfo.trigger?.name === "trade")
  {
    metodoEvo = "Intercambio";

  }else if(evolutionInfo.trigger?.name === "use-item")
  {
    metodoEvo = `Usar ${evolutionInfo.item?.name}`;

  }else
  {
    metodoEvo = "Subir de nivel";
  }

  if(evolutionInfo.min_happiness != null)
  {
    metodoEvo += " + Amistad";
  }

  if(evolutionInfo.gender != null)
  {
    metodoEvo += evolutionInfo.gender === 1 ? " si es hembra" : " si es macho";
  }

  if(evolutionInfo.held_item != null)
  {
    metodoEvo += ` equipado con ${evolutionInfo.held_item.name}`;
  }

  if(evolutionInfo.known_move != null)
  {
    metodoEvo += ` conociendo el movimiento ${evolutionInfo.known_move.name}`;
  }

  if(evolutionInfo.time_of_day !== "")
  {
    if(evolutionInfo.time_of_day === "night")
    {
      metodoEvo += " de Noche";

    }else if(evolutionInfo.time_of_day === "day")
    {
      metodoEvo += " de Día";

    }else if(evolutionInfo.time_of_day === "full-moon")
    {
      metodoEvo += " durante una Noche de Luna Llena";

    }else
    {
      metodoEvo += ` de ${evolutionInfo.time_of_day}`;
    }
  }

  if(evolutionInfo.needs_overworld_rain)
  {
    metodoEvo += " + Lluvia";
  }

  return metodoEvo;
}

function armarDescFormaConRegion(formaMeta, especieName)
{
  const display = safeText(especieName) || "";

  if(!formaMeta || !display) return "";

  const region = safeText(formaMeta?.region);

  if(region === "original")
  {
    return `Esta es la forma habitual de ${display}.`;
  }

  if(region)
  {
    const regionDisplay = getPokemonRegionDisplayName(region) || region;
    return `Forma regional que adopta ${display} en ${regionDisplay}.`;
  }

  return safeText(formaMeta?.desc) || "";
}

function limpiarCamposComunesFormas(formas)
{
  if(!Array.isArray(formas) || formas.length < 2) return Array.isArray(formas) ? formas : [];

  const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const camposAComparar =
  [
    {
      key: "typesForma",
      empty: [],
      isPresent: (v) => Array.isArray(v) && v.length > 0,
      compare: deepEqual
    },
    {
      key: "weightForma",
      empty: null,
      isPresent: (v) => v !== null && v !== undefined,
      compare: (a, b) => a === b
    },
    {
      key: "heightForma",
      empty: null,
      isPresent: (v) => v !== null && v !== undefined,
      compare: (a, b) => a === b
    },
    {
      key: "colorForma",
      empty: "",
      isPresent: (v) => typeof v === "string" && v.trim() !== "",
      compare: (a, b) => a === b
    },
    {
      key: "imgForma",
      empty: "",
      isPresent: (v) => typeof v === "string" && v.trim() !== "",
      compare: (a, b) => a === b
    },
    {
      key: "imgFormaShiny",
      empty: "",
      isPresent: (v) => typeof v === "string" && v.trim() !== "",
      compare: (a, b) => a === b
    },
    {
      key: "abilitiesForma",
      empty: [],
      isPresent: (v) => Array.isArray(v) && v.length > 0,
      compare: deepEqual
    }
  ];

  const formasClonadas = formas.map(function(forma)
  {
    return { ...forma };
  });

  for(const campo of camposAComparar)
  {
    const formasConDato = formasClonadas.filter(function(forma)
    {
      return campo.isPresent(forma?.[campo.key]);
    });

    if(formasConDato.length === 0)
    {
      continue;
    }

    const valorBase = formasConDato[0][campo.key];

    const sonIgualesEnLasPresentes = formasConDato.every(function(forma)
    {
      return campo.compare(forma?.[campo.key], valorBase);
    });

    if(sonIgualesEnLasPresentes)
    {
      for(const forma of formasConDato)
      {
        forma[campo.key] = campo.empty;
      }
    }
  }

  return formasClonadas;
}

// Borra duplciados de habilidades
function uniqAbilitiesByApiName(arr)
{
  const map = new Map();
  for(const item of (Array.isArray(arr) ? arr : []))
  {
    if(item?.apiName && !map.has(item.apiName))
    {
      map.set(item.apiName, item);
    }
  }
  return [...map.values()];
}

async function mergeAbilitiesWithExtraMeta(baseAbilities, extraKeys, replaceMode, translateAbilitiesByKeys)
{
  const abilitiesBase = Array.isArray(baseAbilities) ? baseAbilities : [];
  const keys = Array.isArray(extraKeys)
    ? extraKeys.filter(Boolean)
    : [];

  if(keys.length === 0)
  {
    return replaceMode === true ? [] : abilitiesBase;
  }

  const translated = await translateAbilitiesByKeys(keys);
  const abilitiesExtra = uniqAbilitiesByApiName(Array.isArray(translated) ? translated : []);

  if(replaceMode === true)
  {
    return abilitiesExtra;
  }

  return uniqAbilitiesByApiName([...abilitiesBase, ...abilitiesExtra]);
}
// ------------ Funciones Auxiliares - FIN ------------ 


// ------------ FORMA OBJETOS - INICIO ------------ 

// Evolucion Pkm
function returnEmptyPkmEvolution()
{
  return {
    "nombreEvolucion": '',
    "metodoEvo": '',
    "minNivel": 0,
    "objetoRequerido": '',
    "region": '',
    "nombrePreEvo": '',
    "tiempoDelDia": '',
    "genero": '',
    "conocerMov": '',
    "necesitaLluviaOverworld": false,
    "fotos": [], // [ officialArtworkUrl(id), shinyArtworkUrl(id) ]
    "nombreEvoApi": ''
  };
}


// Numero en Pokedex del Pokemon
function returnEmptyDexPkm()
{
  return {
    "entry": null,
    "nombreApi": "",
    "nombre": "",
    "sprite": ""
  };
}

function returnEmptyDex()
{
  return {
    "title": "",
    "prev": returnEmptyDexPkm(),
    "next": returnEmptyDexPkm(),
    "baseId": null
  };
}


// Habilidad / Habilidad Oculta
function returnEmptyAbility()
{
  return {
    "apiName": "",
    "display": "",
    "descHab": ""
  };
}


// Estadisticas de Combate
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


// Gigamax
function returnEmptyGigamax()
{
  return {
    "idGiga": null,
    "apiNameGiga": "",
    "displayGiga": "",
    "fotosGiga": [], // [ officialArtworkUrl(idGiga), shinyArtworkUrl(idGiga) ]
    "heightGiga": null, // Altura
    "movGiga": "",
    "descMovGiga": "",
    "desc": "",
    "statsGiga": returnEmptyStats()
  };
}


// Mega Evolucion
function returnEmptyMega()
{
  return {
    "idMega": null,
    "apiNameMega": "",
    "displayMega": "",
    "typesMega": [], // [ "water", "fire" ]
    "statsMega": returnEmptyStats(),
    "abilityMega": returnEmptyAbility(),
    "fotosMega": [], // [ officialArtworkUrl(idMega), shinyArtworkUrl(idMega) ]
    "weightMega": null, // Peso
    "heightMega": null, // Altura
    "colorMega": "",
    "descMega": ""
  };
}


// Forma Pkm
function returnEmptyPkmForm()
{
  return {
    "idForma": null,
    "apiNameForma": "",
    "displayForma": "",
    "typesForma": [], // [ "water", "fire" ]
    "weightForma": null, // Peso
    "heightForma": null, // Altura
    "colorForma": "",
    "imgForma": "", // officialArtworkUrl(idForma)
    "imgFormaShiny": "", // shinyArtworkUrl(idForma)
    "abilitiesForma": [], // [ returnEmptyAbility(), ... ]
    "descForma": "",
    "enableNavigationForma": false
  };
}


// Pokemon
function returnEmptyPkm()
{
  return {
    "id": null,
    "apiName": "",
    "display": "",
    "specieName": "",
    "img": "", // officialArtworkUrl(id)
    "imgShiny": "", // shinyArtworkUrl(id)
    "types": [], // [ "water", "fire" ]
    "abilities": [], // [ returnEmptyAbility(), ... ]
    "hiddenAbilities": [], // [ returnEmptyAbility(), ... ]
    "weight": null, // Peso
    "height": null, // Altura
    "color": "",
    "generation": "",
    "stats": returnEmptyStats(),
    "criesLatest": null,
    "evolutionChain": [], // [ returnEmptyPkmEvolution(), ... ]
    "formas": [], // [ returnEmptyPkmForm(), ... ]
    "giga": returnEmptyGigamax(), 
    "mega": [], // [ returnEmptyMega(), ... ]
    "arrDex": [], // [ returnEmptyDex(), ... ]
    "puedeCriar": true, // Por default en true
    "malePercentage": null,
    "femalePercentage": null,
    "sinSexo": false,
    "captureRate": null
  };

}

// ------------ FORMA OBJETOS - FIN ------------ 

export function createPokemonMapper(opts)
{
  opts = opts || {};
  const getPokemonRaw = opts.getPokemonRaw;
  const getPokemonSpeciesRaw = opts.getPokemonSpeciesRaw;
  const getUrlRaw = opts.getUrlRaw;
  const getPokemonIdByKey = opts.getPokemonIdByKey;
  const translatePokemonAbilities = opts.translatePokemonAbilities;
  const translateAbilitiesByKeys = opts.translateAbilitiesByKeys;
  const translatePokemonItems = opts.translatePokemonItems;
  const translatePokemonMoves = opts.translatePokemonMoves;
  const buildDexEntriesFromPokedexNumbers = opts.buildDexEntriesFromPokedexNumbers;
  const DEBUG_POKEMON = !!opts.DEBUG_POKEMON;

  if(!getPokemonRaw)
  {
    throw new Error("createPokemonMapper: falta opts.getPokemonRaw");
  }

  // ---------------- FUNCIONES AUXILIARES - INICIO ---------------- 
  // Retorna un arreglo con las URL de las fotos de un Pkm (Comun y Shiny)
  function obtenerFotoPkm(nombrePkm)
  {
    const apiKey = String(nombrePkm || "").trim().toLowerCase();
    if(!apiKey) return [];

    const id = (typeof getPokemonIdByKey === "function")
      ? getPokemonIdByKey(apiKey)
      : null;

    if(id == null) return [];

    return [officialArtworkUrl(id), shinyArtworkUrl(id)];
  }
  // ---------------- FUNCIONES AUXILIARES - FIN ----------------


  // ---------------- FORMAS POKÉMON - INICIO ---------------- 
  // Funcion que arma el arreglo completo de habilidades que posee una forma
  async function armarAbilitiesFormaConExtras(dataFormaRaw, formaMeta)
  {
    // Habilidades Comunes y Ocultas
    const mappedAbilities = await translatePokemonAbilities(dataFormaRaw?.abilities);

    // Habilidades Comunes
    const abilitiesNormales = Array.isArray(mappedAbilities?.visibles)
      ? mappedAbilities.visibles
      : [];

    // Habilidades Ocultas
    const abilitiesOcultas = Array.isArray(mappedAbilities?.ocultas)
      ? mappedAbilities.ocultas
      : [];

    // Habilidades extra opcionales
    let abilitiesExtra = [];
    if(Array.isArray(formaMeta?.extraAbilities) && formaMeta.extraAbilities.length > 0)
    {
      const extraKeys = formaMeta.extraAbilities.filter(Boolean);

      if(extraKeys.length > 0)
      {
        abilitiesExtra = await translateAbilitiesByKeys(extraKeys);
      }
    }

    // Retorno todo
    return [
      ...abilitiesNormales,
      ...abilitiesOcultas,
      ...abilitiesExtra
    ];
  }

  // Funcion que arma el objeto final de la forma (Hace peticion en Poke API)
  async function armarFormaPkmConDatos(dataFormaRaw, formaMeta, colorBase = "", especieName= "", apiNameBase)
  {
    try
    {
      const idForma = safeNumber(formaMeta?.id) || safeNumber(dataFormaRaw?.id) || null; // ID
      const apiNameForma = safeText(dataFormaRaw?.name) || ""; // Nombre API

      // Armo Objeto Forma Pokémon Vacio
      const formaPkm = returnEmptyPkmForm();

      formaPkm.idForma = idForma || null; // ID
      formaPkm.apiNameForma = apiNameForma || ""; // Nombre API
      formaPkm.displayForma = safeText(formaMeta?.display) || toPokemonDisplayName(apiNameForma) || ""; // Display
      formaPkm.typesForma = getRawTypes(dataFormaRaw) || []; // Tipos
      formaPkm.weightForma = formatWeight(dataFormaRaw?.weight) || null; // Peso
      formaPkm.heightForma = formatHeight(dataFormaRaw?.height) || null; // Altura
      formaPkm.colorForma = safeText(formaMeta?.color) || safeText(colorBase) || ""; // Color
      formaPkm.imgForma = officialArtworkUrl(idForma) || ""; // Foto
      formaPkm.imgFormaShiny = shinyArtworkUrl(idForma) || ""; // Foto Shiny
      formaPkm.abilitiesForma = formaMeta.abilities || await armarAbilitiesFormaConExtras(dataFormaRaw, formaMeta) || []; // Habilidades (Comunes y Ocultas) y "extraAbilities" si el Meta lo Posee
      formaPkm.descForma = safeText(formaMeta?.desc) || armarDescFormaConRegion(formaMeta, especieName) || ""; // Desc
      formaPkm.enableNavigationForma = formaMeta?.enableNavigation === true; // Si habilita la navegacion 

      return formaPkm;
      
    }catch(error)
    {
      console.error("Error al armar la Forma Pkm:", error);
      throw error;
    }
    
  }

  // Funcion que arma el objeto final de la forma (NO hace ninguna peticion en Poke API)
  function armarFormaPkmManualConDatos(formaMeta, colorBase = "")
  {
    // Armo Objeto Forma Pokémon Vacio
    const formaPkm = returnEmptyPkmForm();

    formaPkm.idForma = safeNumber(formaMeta?.id) || null; // ID
    formaPkm.apiNameForma = safeText(formaMeta?.apiKey) || ""; // Nombre API
    formaPkm.displayForma = safeText(formaMeta?.display) || toPokemonDisplayName(formaPkm.apiNameForma) || ""; // Display: Primero lo toma del Meta, si no esta, intenta deduccirlo mediante ApiKey si es que lo tiene
    formaPkm.typesForma = formaMeta.types || []; // Tipos
    formaPkm.weightForma = formaMeta.weight || null; // Peso
    formaPkm.heightForma = formaMeta.height || null; // Altura
    formaPkm.colorForma = safeText(formaMeta?.color) || safeText(colorBase) || ""; // Color del Meta, fallback el base
    formaPkm.imgForma = safeText(formaMeta?.img) || ""; // Foto
    formaPkm.imgFormaShiny = safeText(formaMeta?.imgShiny) || ""; // Foto Shiny
    formaPkm.abilitiesForma = formaMeta.abilities || []; // Habilidades
    formaPkm.descForma = safeText(formaMeta?.desc) || ""; // Desc
    formaPkm.enableNavigationForma = formaMeta?.enableNavigation === true; // Si habilita la navegacion 

    return formaPkm;
  }

  // Funcion principal que retorna el arreglo completo de las formas de un Pokémon
  async function obtenerFormasPkmConDatos(apiNameBase, colorBase = "", especieName = "")
  {
    try
    {
      const formasPkm = getPokemonForms(apiNameBase);
      if(!formasPkm.length) return [];

      const formas = [];

      for(const formaMeta of formasPkm)
      {
        try
        {
          // Si tiene "needFetch" en true, hace la peticion a la PokeAPI y arma el objeto
          if(formaMeta?.needFetch)
          {
            // Busco la data raw
            const dataFormaRaw = await getPokemonRaw(formaMeta["apiKey"]);
            if(!dataFormaRaw) continue;

            // Armo el Objeto Forma Pkm
            const formitaPkm = await armarFormaPkmConDatos(
              dataFormaRaw,
              formaMeta,
              colorBase,
              especieName,
              apiNameBase
            );

            formas.push(formitaPkm);

          }else // Si tiene "needFetch" en false, no debe hacer ningun peticion, arma el objeto con los datos que posee el Meta
          {
            const formitaPkm = armarFormaPkmManualConDatos(
              formaMeta,
              colorBase,
              apiNameBase
            );

            formas.push(formitaPkm);
          }

        }catch(errorForma)
        {
          console.warn("No se pudo armar una forma:", formaMeta?.apiKey, errorForma);
        }
      }

      return limpiarCamposComunesFormas(formas);

    }catch(error)
    {
      console.error("Error al obtener formas del Pokémon:", error);
      return [];
    }
  }
  // ---------------- FORMAS POKÉMON - FIN ---------------- 


  // ---------------- MEGA EVOLUCIÓN - INICIO ---------------- 
  // Funcion que arma el Objeto de Mega Evolucion
  async function armarMegaEvoConDatos(dataMegaEvoRaw, megaMeta, colorBase = "", apiNameBase = "")
  {
    try
    {
      const idMega = safeNumber(dataMegaEvoRaw?.id); // ID
      const apiNameMega = safeText(dataMegaEvoRaw?.name) || ""; // Nombre API

      // Armo Objeto Mega Evo Vacio
      const megaEvo = returnEmptyMega();

      megaEvo.idMega = idMega; // ID
      megaEvo.apiNameMega = apiNameMega; // Nombre API
      megaEvo.displayMega = safeText(megaMeta?.display) || toPokemonDisplayName(apiNameMega); // Display
      megaEvo.typesMega = getRawTypes(dataMegaEvoRaw); // Tipos
      megaEvo.statsMega = getStats(dataMegaEvoRaw?.stats); // Stats
      
      // Habilidades
      const mappedAbilities = (typeof translatePokemonAbilities === "function")
        ? await translatePokemonAbilities(dataMegaEvoRaw?.abilities)
        : { visibles: [], ocultas: [] };

      const firstAbility =
        (Array.isArray(mappedAbilities?.visibles) && mappedAbilities.visibles.length)
          ? mappedAbilities.visibles[0]
          : (Array.isArray(mappedAbilities?.ocultas) && mappedAbilities.ocultas.length)
            ? mappedAbilities.ocultas[0]
            : null;

      megaEvo.abilityMega = firstAbility
        ? {
            apiName: safeText(firstAbility.apiName) || "",
            display: safeText(firstAbility.display) || safeText(firstAbility.nombreHab) || "",
            descHab: safeText(firstAbility.descHab) || ""
          }
        : returnEmptyAbility();
      
      megaEvo.fotosMega = [officialArtworkUrl(idMega), shinyArtworkUrl(idMega)].filter(Boolean); // Fotos
      megaEvo.weightMega = formatWeight(dataMegaEvoRaw?.weight); // Peso
      megaEvo.heightMega = formatHeight(dataMegaEvoRaw?.height); // Altura
      megaEvo.colorMega = safeText(megaMeta?.color) || safeText(colorBase) || "";  // Color

      // Descripción:
      // 1) meta
      // 2) fallback automático
      if(safeText(megaMeta?.desc))
      {
        megaEvo.descMega = safeText(megaMeta.desc);

      }else
      {
        const baseName = String(apiNameBase || "").trim().toLowerCase();
        let megaPiedra = ponerMayuscula(apiNameBase || apiNameMega) + "ita";

        if(apiNameMega.endsWith("-mega-x"))
        {
          megaPiedra += " X";

        }else if(apiNameMega.endsWith("-mega-y"))
        {
          megaPiedra += " Y";

        }else if(apiNameMega.endsWith("-mega-z"))
        {
          megaPiedra += " Z";
        }

        if(apiNameMega === "rayquaza" || apiNameMega === "rayquaza-mega")
        {
          megaEvo.descMega = "Megaevoluciona conociendo el movimiento Ascenso Draco, sin necesitar una megapiedra.";

        }else
        {
          megaEvo.descMega = `Megaevoluciona con ${megaPiedra} equipada en combate.`;
        }
      }

      return megaEvo;

    }catch(error)
    {
      console.error("Error al armar la Mega Evo:", error);
      throw error;
    }
  }

  // Funcion que retorna todas las Megas de un Pokémon
  async function obtenerMegasConDatos(apiNameBase, colorBase = "")
  {
    try
    {
      const megaForms = getPokemonMegaForms(apiNameBase);
      if(!megaForms.length) return [];

      const megas = [];
      for(const megaMeta of megaForms)
      {
        try
        {
          const dataMegaEvoRaw = await getPokemonRaw(megaMeta["apiKey"]);
          if(!dataMegaEvoRaw) continue;

          const megaEvo = await armarMegaEvoConDatos(
            dataMegaEvoRaw,
            megaMeta,
            colorBase,
            apiNameBase
          );

          megas.push(megaEvo);

        }catch(errorMega)
        {
          console.warn("No se pudo armar una mega:", megaMeta?.apiKey, errorMega);
        }
      }

      return megas;

    }catch(error)
    {
      console.error("Error al obtener megas del Pokémon:", error);
      return [];
    }
  }
  // ---------------- MEGA EVOLUCIÓN - FIN ---------------- 
 
  
  // ---------------- GIGAMAX - INICIO ---------------- 
  // Funcion que arma el Objeto de Gigamax
  function armarGigaConDatos(dataGigaRaw, gigaMeta)
  {
    const idGiga = safeNumber(dataGigaRaw?.id); // ID
    const apiNameGiga = safeText(dataGigaRaw?.name) || ""; // Nombre API

    // Armo Objeto Gigamax Vacio
    const giga = returnEmptyGigamax();

    giga.idGiga = idGiga; // ID
    giga.apiNameGiga = apiNameGiga; // Nombre API
    giga.displayGiga = safeText(gigaMeta?.display) || toPokemonDisplayName(apiNameGiga); // Display
    giga.fotosGiga = [officialArtworkUrl(idGiga), shinyArtworkUrl(idGiga)].filter(Boolean); // Fotos
    giga.heightGiga = formatHeight(dataGigaRaw?.height); // Altura
    giga.movGiga = safeText(gigaMeta?.displayMov) || ""; // Movimiento Gigamax
    giga.descMovGiga = safeText(gigaMeta?.descMov) || ""; // Desc Movimiento Gigamax

    if(apiNameGiga === "eternatus-eternamax")
    {
      giga.desc = safeText(gigaMeta?.desc) || ""; // Desc
      giga.statsGiga = getStats(dataGigaRaw?.stats); // Stats
    }else
    {
      giga.desc = "";
      giga.statsGiga = returnEmptyStats();
    }    

    return giga;
  
  }

  // Funcion que retorna el Gigamaxde un Pokémon
  async function obtenerGigamaxConDatos(apiNameBase)
  {
    try
    {
      const gigaMeta = getPokemonGigaForm(apiNameBase);
      if(!gigaMeta) return null;

      const dataGigaRaw = await getPokemonRaw(gigaMeta["apiKey"]);
      if(!dataGigaRaw) return null;

      return armarGigaConDatos(dataGigaRaw, gigaMeta);

    }catch(error)
    {
      console.error("Error al obtener el Gigamax del Pokémon:", error);
      return null;
    }
  }
  // ---------------- GIGAMAX - FIN ---------------- 
  

  // ---------------- CADENA EVOLUTIVA - INICIO ---------------- 
  // Funcion que rotorna el Arreglo de la Cadena Evolutiva
  async function obtenerCadenaEvolutivaPkm(dataChain, region = "")
  {
    const itemsNecesarios = new Set();
    const movesNecesarios = new Set();

    const regionKey = String(region || "").trim().toLowerCase();
    const esRegionalGlobal = regionKey !== "";

    function elegirDetalleEvo(details)
    {
      if (!Array.isArray(details) || !details.length) return {};
      return esRegionalGlobal ? (details[1] || details[0] || {}) : (details[0] || {});
    }

    function appendRegionIfNeeded(apiKey)
    {
      const key = String(apiKey || "").trim().toLowerCase();
      if(!esRegionalGlobal || !regionKey || !key) return key;

      const sufijo = `-${regionKey}`;
      if(key.endsWith(sufijo)) return key;

      return `${key}${sufijo}`;
    }

    function nombreDisplayDesdeKey(apiKey)
    {
      return toPokemonDisplayName(appendRegionIfNeeded(apiKey));
    }

    function nombreApiForma(apiKey)
    {
      return appendRegionIfNeeded(apiKey);
    }

    function obtenerFotosEvolucion(apiKeyBase)
    {
      return obtenerFotoPkm(nombreApiForma(apiKeyBase));
    }

    (function recolectarItems(node)
    {
      if(!node) return;

      const hijos = Array.isArray(node.evolves_to) ? node.evolves_to : [];
      for(const ev of hijos)
      {
        const info = elegirDetalleEvo(ev.evolution_details || []);
        const held = info?.held_item?.name;
        const direct = info?.item?.name;
        const move = info?.known_move?.name;

        if(held) itemsNecesarios.add(held);
        if(direct) itemsNecesarios.add(direct);
        if(move) movesNecesarios.add(move);

        recolectarItems(ev);
      }

    })(dataChain);

    let mapaItemsES = new Map();
    if(itemsNecesarios.size && typeof translatePokemonItems === "function")
    {
      try
      {
        mapaItemsES = await translatePokemonItems([...itemsNecesarios]);

      }catch
      {
        mapaItemsES = new Map();
      }
    }

    let mapaMovesES = new Map();
    if(movesNecesarios.size && typeof translatePokemonMoves === "function")
    {
      try
      {
        mapaMovesES = await translatePokemonMoves([...movesNecesarios]);

      }catch
      {
        mapaMovesES = new Map();
      }
    }

    const nombreItemES = (apiName) =>
      apiName
        ? (mapaItemsES.get(apiName) || ponerMayuscula(apiName.replace(/-/g, " ")))
        : "";

    const nombreMoveES = (apiName) =>
      apiName
        ? (mapaMovesES.get(apiName) || ponerMayuscula(apiName.replace(/-/g, " ")))
        : "";

    function metodoEvoEs(info, objetoApi, objetoES, moveApi, moveES)
    {
      let base = getMetodoEvo(info);

      if(objetoApi && objetoES)
      {
        const api = objetoApi;
        const apiPretty = api.replace(/-/g, " ");
        const apiCap = ponerMayuscula(apiPretty);
        const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        base = base
          .replace(new RegExp(esc(api), "ig"), objetoES)
          .replace(new RegExp(esc(apiPretty), "ig"), objetoES)
          .replace(new RegExp(esc(apiCap), "ig"), objetoES);
      }

      if(moveApi && moveES)
      {
        const api = moveApi;
        const apiPretty = api.replace(/-/g, " ");
        const apiCap = ponerMayuscula(apiPretty);
        const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        base = base
          .replace(new RegExp(esc(api), "ig"), moveES)
          .replace(new RegExp(esc(apiPretty), "ig"), moveES)
          .replace(new RegExp(esc(apiCap), "ig"), moveES);
      }

      return base;
    }

    const arregloEvos = [];

    const yaExiste = (nombreBonito) =>
      arregloEvos.some((x) => x.nombreEvolucion === nombreBonito);

    async function extraerEvoluciones(node, nombrePreEvo)
    {
      if(!node) return;

      const speciesKey = node.species?.name;
      if(!speciesKey) return;

      const nombreActual = nombreDisplayDesdeKey(speciesKey);
      const nombreApiActual = nombreApiForma(speciesKey);

      if(!yaExiste(nombreActual))
      {
        const fotitos = obtenerFotosEvolucion(speciesKey);

        const evoBase = returnEmptyPkmEvolution();
        evoBase.nombreEvolucion = nombreActual;
        evoBase.minNivel = 1;
        evoBase.fotos = fotitos;
        evoBase.nombreEvoApi = nombreApiActual;

        arregloEvos.push(evoBase);
      }

      const hijos = Array.isArray(node.evolves_to) ? node.evolves_to : [];
      for(const evolucion of hijos)
      {
        const info = elegirDetalleEvo(evolucion.evolution_details || []);
        const evoSpeciesKey = evolucion.species?.name;
        if(!evoSpeciesKey) continue;

        const nombreApiEvo = nombreApiForma(evoSpeciesKey);
        const fotos = obtenerFotosEvolucion(evoSpeciesKey);

        const objetoApi = info?.held_item?.name || info?.item?.name || "";
        const objetoES = nombreItemES(objetoApi);
        const moveApi = info?.known_move?.name || "";
        const moveES = nombreMoveES(moveApi);

        const evoNueva = returnEmptyPkmEvolution();
        evoNueva.nombreEvolucion = nombreDisplayDesdeKey(evoSpeciesKey);
        evoNueva.nombreEvoApi = nombreApiEvo;
        evoNueva.metodoEvo = metodoEvoEs(info, objetoApi, objetoES, moveApi, moveES);
        evoNueva.minNivel = info?.min_level || "";
        evoNueva.objetoRequerido = objetoES;
        evoNueva.region = (info?.location && info.location.name) || "";
        evoNueva.nombrePreEvo = nombrePreEvo ? nombreDisplayDesdeKey(nombrePreEvo) : "";
        evoNueva.tiempoDelDia = info?.time_of_day || "";
        evoNueva.genero = info?.gender || "";
        evoNueva.conocerMov = moveES;
        evoNueva.necesitaLluviaOverworld = !!info?.needs_overworld_rain;
        evoNueva.fotos = fotos;

        arregloEvos.push(evoNueva);
        await extraerEvoluciones(evolucion, evoSpeciesKey);
      }
    }

    await extraerEvoluciones(dataChain, dataChain?.species?.name || "");

    const regionKeys = getPokemonRegionKeys();
    if(regionKeys.includes(regionKey))
    {
      const regionDisplay = getPokemonRegionDisplayName(regionKey) || ponerMayuscula(regionKey);
      const regionSuffix = ` de ${regionDisplay}`.toLowerCase();

      for(const evo of arregloEvos)
      {
        if(evo.nombrePreEvo)
        {
          const current = String(evo.nombrePreEvo || "").trim();
          if(!current.toLowerCase().endsWith(regionSuffix))
          {
            evo.nombrePreEvo = `${current} de ${regionDisplay}`;
          }
        }
      }
    }

    return arregloEvos;
  }

  // Funcion que maneja las evoluciones Pokemon, y aplica un parche definido si tiene
  async function manejarCadenaEvolutivaPkm(apiName, dataEvoChain)
  {
    // Busca el parche; si "apiName" no tiene parche, devuelve null
    const patch = getPokemonEvolutionPatch(apiName);

    // Caso 1: el parche reemplaza toda la cadena
    if(patch?.replace === true)
    {
      return Array.isArray(patch.evolutionChain)
        ? patch.evolutionChain
        : [];
    }

    // Caso 2: hay parche, pero no reemplaza
    // Usa la región del parche si existe; si no, queda ""
    const regionPatch = String(patch?.region || "").trim().toLowerCase();

    const cadenaBase = dataEvoChain?.chain
      ? await obtenerCadenaEvolutivaPkm(dataEvoChain.chain, regionPatch)
      : [];

    const cadenaParche = Array.isArray(patch?.evolutionChain)
      ? patch.evolutionChain
      : [];

    if(!cadenaParche.length)
    {
      return cadenaBase;
    }

    if(!cadenaBase.length)
    {
      return cadenaParche;
    }

    const seen = new Set();
    const merged = [];

    for(const item of [...cadenaBase, ...cadenaParche])
    {
      const key = String(item?.nombreEvoApi || item?.nombreEvolucion || "").trim().toLowerCase();
      if(key && seen.has(key)) continue;
      if(key) seen.add(key);
      merged.push(item);
    }

    return merged;
  }
  // ---------------- CADENA EVOLUTIVA - FIN ---------------- 


  // Funcion Principal que retorna el objeto final del Pokemon con toda la data
  async function obtenerPokemon(nameOrId)
  {
    // API Key del Pokémon
    const key = (typeof nameOrId === "string")
      ? nameOrId.trim().toLowerCase()
      : String(nameOrId);

    // Data RAW y Species Data
    const raw = await getPokemonRaw(key);
    const speciesRaw = await getPokemonSpeciesRaw(raw?.species?.url);

    if(DEBUG_POKEMON && typeof console !== "undefined" && console.log)
    {
      console.log("[pokemonMapper] RAW pokemon:", key, raw);
    }

    // Creo Objeto Pokémon Vacio
    const pokemon = returnEmptyPkm();

    pokemon.id = safeNumber(raw?.id); // ID
    pokemon.apiName = safeText(raw?.name); // Nombre API
    pokemon.display = toPokemonDisplayName(key); // Nombre Español, con fallback a Nombre API
    pokemon.specieName = toPokemonDisplayName(raw?.species?.name); // Especie Pkm
    pokemon.img = officialArtworkUrl(pokemon.id); // Imagen del Pokémon
    pokemon.imgShiny = shinyArtworkUrl(pokemon.id); // Imagen Shiny del Pokémon
    pokemon.types = getRawTypes(raw); // Tipos

    // Habilidades (Comunes y Ocultas)
    const mappedAbilities = await translatePokemonAbilities(raw?.abilities);
    pokemon.abilities = Array.isArray(mappedAbilities?.visibles) ? mappedAbilities.visibles : [];
    pokemon.hiddenAbilities = Array.isArray(mappedAbilities?.ocultas) ? mappedAbilities.ocultas : [];

    // Habilidades extra por meta
    const extraAbilitiesMeta = getExtraAbilityKeysByKey(pokemon.apiName);
    if(
      extraAbilitiesMeta &&
      (
        (Array.isArray(extraAbilitiesMeta.extraVisibles) && extraAbilitiesMeta.extraVisibles.length > 0) ||
        (Array.isArray(extraAbilitiesMeta.extraHidden) && extraAbilitiesMeta.extraHidden.length > 0) ||
        extraAbilitiesMeta.replaceVisibles === true ||
        extraAbilitiesMeta.replaceHidden === true
      )
    )
    {
      pokemon.abilities = await mergeAbilitiesWithExtraMeta(
        pokemon.abilities,
        extraAbilitiesMeta.extraVisibles,
        extraAbilitiesMeta.replaceVisibles,
        translateAbilitiesByKeys
      );

      pokemon.hiddenAbilities = await mergeAbilitiesWithExtraMeta(
        pokemon.hiddenAbilities,
        extraAbilitiesMeta.extraHidden,
        extraAbilitiesMeta.replaceHidden,
        translateAbilitiesByKeys
      );
    }

    pokemon.weight = formatWeight(raw?.weight); // Peso
    pokemon.height = formatHeight(raw?.height); // Altura
    pokemon.color = getColorPkmByKey(pokemon.apiName) || safeText(speciesRaw?.color?.name); // Color Oficial
    pokemon.generation = getPokemonGenByKey(pokemon.apiName, safeText(speciesRaw?.generation?.name)); // Generacion
    pokemon.stats = getStats(raw?.stats); // Stats
    pokemon.criesLatest = safeText(raw?.cries?.latest) || null; // Grito Pokémon

    // Cadena Evolutiva
    const dataEvoChain = (typeof getUrlRaw === "function" && speciesRaw?.evolution_chain?.url)
      ? await getUrlRaw(speciesRaw.evolution_chain.url)
      : null;
    pokemon.evolutionChain = await manejarCadenaEvolutivaPkm(pokemon.apiName, dataEvoChain);

    // Formas
    if(hasPokemonForms(pokemon.apiName))
    {
      pokemon.formas = await obtenerFormasPkmConDatos(pokemon.apiName, (pokemon.color || ""), (pokemon.specieName || ""));
    }

    // Gigamax
    if(hasPokemonGigaForm(pokemon.apiName))
    {
      pokemon.giga = await obtenerGigamaxConDatos(pokemon.apiName);
    }

    // Mega Evoluciones
    if(hasPokemonMegaForms(pokemon.apiName))
    {
      pokemon.mega = await obtenerMegasConDatos(pokemon.apiName, pokemon.color || "");
    }

    // Puede Criar
    pokemon.puedeCriar = canPokemonBreed(pokemon.apiName, speciesRaw); // Puede Criar = [true/false]

    // Entradas de Número de Pokedex del Pokémon
    const dataPokedexPkm = speciesRaw?.pokedex_numbers;
    if(Array.isArray(dataPokedexPkm) && typeof buildDexEntriesFromPokedexNumbers === "function")
    {
      pokemon.arrDex = await buildDexEntriesFromPokedexNumbers(dataPokedexPkm);
    }

    // Genero Pokémon
    const genderPkmData = getGenderPercentagePkm(speciesRaw?.gender_rate);
    pokemon.malePercentage = genderPkmData.malePercentage;
    pokemon.femalePercentage = genderPkmData.femalePercentage;
    pokemon.sinSexo = genderPkmData.sinSexo;

    // Ratio de Captura
    pokemon.captureRate = safeNumber(speciesRaw?.capture_rate);

    // Data Cruda de Movimientos que aprende el Pokémon
    const movesRawData = Array.isArray(raw?.moves) ? raw.moves : [];

    if(DEBUG_POKEMON && typeof console !== "undefined" && console.log)
    {
      console.log("[pokemonMapper] MAPPED pokemon:", key, pokemon);
    }

    // Retorno el Objeto Pokémon normalizado y el rawData de los Movimientos que aprende
    return {
      pokemonData: pokemon,
      movesRawData: movesRawData
    };
  }

  return {
    obtenerPokemon
  };

}