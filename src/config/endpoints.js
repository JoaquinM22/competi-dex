//** src\config\endpoints.js

// URL de Poke API
export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

// URL de Competidex Data
export const COMPETIDEX_DATA_BASE_URL = "https://joaquinm22.github.io/competidex-data";

// URL base de sprites de PokeAPI via jsDelivr
export const SPRITES_BASE_URL = "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master";

// Endpoints con el detalle que usa cada Provider
export const POKEAPI =
{
  pokemon: (idOrName) => `${POKEAPI_BASE_URL}/pokemon/${idOrName}`, // Pokemon Provider
  pokemonSpecies: (idOrName) => `${POKEAPI_BASE_URL}/pokemon-species/${idOrName}`, // Pokemon Provider
  pokemonEvolutionChain: (id) => `${POKEAPI_BASE_URL}/evolution-chain/${id}`, // Pokemon Provider
  pokedex: (idOrName) => `${POKEAPI_BASE_URL}/pokedex/${idOrName}`, // Pokedex Provider
  pokedexList: () => `${POKEAPI_BASE_URL}/pokedex`, // Pokedex Provider
  move: (idOrName) => `${POKEAPI_BASE_URL}/move/${idOrName}`, // Moves Provider
  item: (idOrName) => `${POKEAPI_BASE_URL}/item/${idOrName}`, // Items Provider
  ability: (idOrName) => `${POKEAPI_BASE_URL}/ability/${idOrName}`, // Abilities Provider
  pokemonEncounters: (idOrName) => `${POKEAPI_BASE_URL}/pokemon/${idOrName}/encounters` // Area Localizacion
};

// Endpoints con el json Map de cada Provider
export const COMPETIDEX_DATA =
{
  base: COMPETIDEX_DATA_BASE_URL,

  pokemonManifest: `${COMPETIDEX_DATA_BASE_URL}/pokemon/manifest.json`,
  movesManifest: `${COMPETIDEX_DATA_BASE_URL}/moves/manifest.json`,
  itemsManifest: `${COMPETIDEX_DATA_BASE_URL}/items/manifest.json`,
  abilitiesManifest: `${COMPETIDEX_DATA_BASE_URL}/abilities/manifest.json`,

  pokemonMap: (path) => `${COMPETIDEX_DATA_BASE_URL}${path}`,
  movesMap: (path) => `${COMPETIDEX_DATA_BASE_URL}${path}`,
  itemsMap: (path) => `${COMPETIDEX_DATA_BASE_URL}${path}`,
  abilitiesMap: (path) => `${COMPETIDEX_DATA_BASE_URL}${path}`,
};

export function pokeApiUrl(resource, idOrName)
{
  return `${POKEAPI_BASE_URL}/${resource}/${idOrName}`;
}

export function competidexDataUrl(path)
{
  return `${COMPETIDEX_DATA_BASE_URL}${path}`;
}


// ---------------- FUNCIONES PARA SPRITES Y FOTOS - INICIO ---------------- 

// Sprites Pokémon (Comun y Shiny)
export function spriteUrl(id)
{
  return `${SPRITES_BASE_URL}/sprites/pokemon/${id}.png`;
}

export function spriteShinyUrl(id)
{
  return `${SPRITES_BASE_URL}/sprites/pokemon/shiny/${id}.png`;
}


// Arte Oficial Pokémon (Comun y Shiny)
export function officialArtworkUrl(id)
{
  return `${SPRITES_BASE_URL}/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function shinyArtworkUrl(id)
{
  return `${SPRITES_BASE_URL}/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}


// Arte HOME Pokémon (Comun y Shiny)
export function homeArtworkUrl(id)
{
  return `${SPRITES_BASE_URL}/sprites/pokemon/other/home/${id}.png`;
}

export function homeShinyArtworkUrl(id)
{
  return `${SPRITES_BASE_URL}/sprites/pokemon/other/home/shiny/${id}.png`;
}


// Sprite Objetos Pokémon
export function itemSpriteUrl(apiName)
{
  return `${SPRITES_BASE_URL}/sprites/items/${String(apiName || "").trim().toLowerCase()}.png`;
}
// ---------------- FUNCIONES PARA SPRITES Y FOTOS - FIN ---------------- 
