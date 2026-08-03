//** src\utils\competidexMeta.js

import {
  officialArtworkUrl,
  shinyArtworkUrl,
  homeArtworkUrl,
  homeShinyArtworkUrl
} from "../config/endpoints";


// -------------- UBICACIONES DE FOTOS - INICIO -------------- 
//#region IMG
export const POKEBALL_BACKGROUND = "/assets/poke_ball_icon.webp";
export const LOGO_COMPETIDEX = "/assets/competidex_logo.png";
export const ERROR_404_IMG = "/assets/error_404_pokemon.png";
export const ERROR_404_SPRITE_IMG = "/assets/error_404_Pkm_pixelArt.png";
export const POKE_DOLLAR_IMG = "/assets/poke_dollar.png";
export const SHINY_ICON_IMG = "/assets/shiny_icon.png";
export const PIKACHU_RUNING_GIF = "/assets/gif-pikachu-runing.webp";

// -------------- UBICACIONES DE FOTOS - FIN -------------- 


// -------------- DATOS META DE CLASE MOVIMIENTOS - INICIO -------------- 
//#region CLASE MOV

// https://pokeapi.co/api/v2/move-damage-class?limit=9999
export const MOVE_CLASS_META =
{
  "unknown": {
    "apiKey": null,
    "labelEs": "Clase Desconocida",
    "icon": null
  },
  "physical": {
    "apiKey": "physical",
    "labelEs": "Físico",
    "icon": "/assets/movsIcons/fisico_logo.png"
  },
  "special": {
    "apiKey": "special",
    "labelEs": "Especial",
    "icon": "/assets/movsIcons/especial_logo.png"
  },
  "status": {
    "apiKey": "status",
    "labelEs": "Estado",
    "icon": "/assets/movsIcons/estado_logo.png"
  }
};

export function normalizeMoveClass(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getMoveClassMeta(input)
{
  const key = normalizeMoveClass(input);
  return (key && MOVE_CLASS_META[key])
    ? MOVE_CLASS_META[key]
    : MOVE_CLASS_META.unknown;
}

export function getMoveClassIcon(input)
{
  return getMoveClassMeta(input)?.icon || null;
}

export function getMoveClassLabelEs(input)
{
  return getMoveClassMeta(input)?.labelEs || "Clase Desconocida";
}
// -------------- DATOS META DE CLASE MOVIMIENTOS - FIN -------------- 


// -------------- DATOS META DE BLANCO MOVIMIENTOS - INICIO -------------- 
//#region BLANCO MOV

// https://pokeapi.co/api/v2/move-target?limit=9999
export const TARGET_MOVES_META =
{
  "unknown": {
    "apiKey": null,
    "labelEs": "Blanco Desconocido",
    "icon": null
  },
  "specific-move": {
    "apiKey": "specific-move",
    "labelEs": "Movimiento específico",
    "icon": null
  },
  "selected-pokemon-me-first": {
    "apiKey": "selected-pokemon-me-first",
    "labelEs": "Elegido con Prioridad",
    "icon": null
  },
  "ally": {
    "apiKey": "ally",
    "labelEs": "Pokémon aliado",
    "icon": null
  },
  "users-field": {
    "apiKey": "users-field",
    "labelEs": "Equipo aliado",
    "icon": null
  },
  "user-or-ally": {
    "apiKey": "user-or-ally",
    "labelEs": "Usuario o Pokémon aliado",
    "icon": null
  },
  "opponents-field": {
    "apiKey": "opponents-field",
    "labelEs": "Equipo enemigo",
    "icon": null
  },
  "user": {
    "apiKey": "user",
    "labelEs": "Usuario",
    "icon": null
  },
  "random-opponent": {
    "apiKey": "random-opponent",
    "labelEs": "Oponente al azar",
    "icon": null
  },
  "all-other-pokemon": {
    "apiKey": "all-other-pokemon",
    "labelEs": "Pokémon adyacentes",
    "icon": null
  },
  "selected-pokemon": {
    "apiKey": "selected-pokemon",
    "labelEs": "Elegido",
    "icon": null
  },
  "all-opponents": {
    "apiKey": "all-opponents",
    "labelEs": "Oponentes adyacentes",
    "icon": null
  },
  "entire-field": {
    "apiKey": "all-other-pokemon",
    "labelEs": "Todos los Pokémon",
    "icon": null
  },
  "user-and-allies": {
    "apiKey": "user-and-allies",
    "labelEs": "Todos los aliados",
    "icon": null
  },
  "all-pokemon": {
    "apiKey": "all-pokemon",
    "labelEs": "Todos los Pokémon",
    "icon": null
  },
  "all-allies": {
    "apiKey": "all-allies",
    "labelEs": "Todos los aliados",
    "icon": null
  },
  "fainting-pokemon": {
    "apiKey": "fainting-pokemon",
    "labelEs": "Pokémon debilitados",
    "icon": null
  }
};

export function normalizeMoveTarget(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getMoveTargetMeta(input)
{
  const key = normalizeMoveTarget(input);
  return (key && TARGET_MOVES_META[key])
    ? TARGET_MOVES_META[key]
    : TARGET_MOVES_META.unknown;
}

export function getMoveTargetIcon(input)
{
  return getMoveTargetMeta(input)?.icon || null;
}

export function getMoveTargetLabelEs(input)
{
  return getMoveTargetMeta(input)?.labelEs || "Blanco Desconocido";
}
// -------------- DATOS META DE BLANCO MOVIMIENTOS - FIN -------------- 


// -------------- DATOS META DE ESTADÍSTICAS - INICIO --------------
// #region STATS

//https://pokeapi.co/api/v2/stat?limit=9999
export const STATS_META =
{
  "unknown": {
    "order": 999,
    "apiKey": null,
    "labelEs": "Estadística Desconocida",
    "icon": null,
    "conector": ""
  },
  "attack": {
    "order": 1,
    "apiKey": "attack",
    "labelEs": "Ataque",
    "icon": null,
    "conector": "el"
  },
  "defense": {
    "order": 2,
    "apiKey": "defense",
    "labelEs": "Defensa",
    "icon": null,
    "conector": "la"
  },
  "special-attack": {
    "order": 3,
    "apiKey": "special-attack",
    "labelEs": "Ataque Especial",
    "icon": null,
    "conector": "el"
  },
  "special-defense": {
    "order": 4,
    "apiKey": "special-defense",
    "labelEs": "Defensa Especial",
    "icon": null,
    "conector": "la"
  },
  "speed": {
    "order": 5,
    "apiKey": "speed",
    "labelEs": "Velocidad",
    "icon": null,
    "conector": "la"
  }
};

export function normalizeStatKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getStatMeta(input)
{
  const key = normalizeStatKey(input);
  return (key && STATS_META[key])
    ? STATS_META[key]
    : STATS_META.unknown;
}

export function getStatLabelEs(input)
{
  return getStatMeta(input)?.labelEs || "Estadística Desconocida";
}

export function getStatConector(input)
{
  return getStatMeta(input)?.conector || "";
}
// -------------- DATOS META DE ESTADÍSTICAS - FIN -------------- 


// -------------- DATOS META DE POKÉMON BLOQUEADOS - INICIO -------------- 
// #region BLOCKED PKM
export const BLOCKED_EXACT =
[
  "greninja-battle-bond", // Greninja Forma Ash
  "dudunsparce-three-segment", // Dudunsparce 3 Segmentos
  "cramorant-gulping", // Cramorant con Pez
  "cramorant-gorging", // Cramorant con Pikachu

  // Koraidon Monturas
  "koraidon-limited-build",
  "koraidon-gliding-build",
  "koraidon-swimming-build",
  "koraidon-sprinting-build",

  // Miraidon Monturas
  "miraidon-drive-mode",
  "miraidon-glide-mode",
  "miraidon-aquatic-mode",
  "miraidon-low-power-mode",
  "maushold-family-of-three",

  "zarude-dada", // Zarude Papá 
  "magearna-original", // Magearna Vetusto
  "rockruff-own-tempo", // Rockruff con Hab Oculta 
  "keldeo-resolute", // Keldeo Brio
  "zygarde-10-power-construct", // Zygarde 10% (Hab Agrupamiento)
  "zygarde-50-power-construct", // Zygarde 50% (Hab Agrupamiento)
  
  // Tatsugiri Formas
  "tatsugiri-droopy",
  "tatsugiri-stretchy",

  // Mimikyu Formas
  "mimikyu-busted",
  "mimikyu-totem-busted",
  "mimikyu-totem-disguised",

  // Minior Formas
  "minior-orange-meteor",
  "minior-yellow-meteor",
  "minior-green-meteor",
  "minior-blue-meteor",
  "minior-indigo-meteor",
  "minior-violet-meteor",

  "morpeko-hangry", // Morpeko Enojado

  // Pikachus con Gorra
  "pikachu-partner-cap",
  "pikachu-original-cap",
  "pikachu-hoenn-cap",
  "pikachu-sinnoh-cap",
  "pikachu-unova-cap",
  "pikachu-kalos-cap",
  "pikachu-alola-cap",
  "pikachu-world-cap"
];

export const BLOCKED_CONTAINS =
[
  "totem",
  "-eternamax",
  "-starter",
  "-belle",
  "-phd",
  "-libre",
  "-rock-star",
  "-pop-star",
  "-cosplay",
  "-gmax"
];

export function isPokemonBlocked(apiName)
{
  const n = String(apiName || "").toLowerCase();
  if (!n) return true;

  if (BLOCKED_EXACT.includes(n)) return true;

  if (n.indexOf("-mega") !== -1) return true;
  if (n.indexOf("mega-") === 0) return true;

  for(let i = 0; i < BLOCKED_CONTAINS.length; i++)
  {
    if (n.indexOf(BLOCKED_CONTAINS[i]) !== -1) return true;
  }

  return false;
}

export const BLOCKED_EXACT_HABS =
[
  "greninja-battle-bond", // Greninja Forma Ash
  "dudunsparce-three-segment", // Dudunsparce 3 Segmentos
  "cramorant-gulping", // Cramorant con Pez
  "cramorant-gorging", // Cramorant con Pikachu

  // Koraidon Monturas
  "koraidon-limited-build",
  "koraidon-gliding-build",
  "koraidon-swimming-build",
  "koraidon-sprinting-build",

  // Miraidon Monturas
  "miraidon-drive-mode",
  "miraidon-glide-mode",
  "miraidon-aquatic-mode",
  "miraidon-low-power-mode",
  "maushold-family-of-three",

  "zarude-dada", // Zarude Papá 
  "magearna-original", // Magearna Vetusto
  "keldeo-resolute", // Keldeo Brio
  "zygarde-10-power-construct", // Zygarde 10% (Hab Agrupamiento)
  "zygarde-50-power-construct", // Zygarde 50% (Hab Agrupamiento)
  
  // Tatsugiri Formas
  "tatsugiri-droopy",
  "tatsugiri-stretchy",

  // Mimikyu Formas
  "mimikyu-busted",
  "mimikyu-totem-busted",
  "mimikyu-totem-disguised",

  // Minior Formas
  "minior-orange-meteor",
  "minior-yellow-meteor",
  "minior-green-meteor",
  "minior-blue-meteor",
  "minior-indigo-meteor",
  "minior-violet-meteor",

  "morpeko-hangry", // Morpeko Enojado

  // Pikachus con Gorra
  "pikachu-partner-cap",
  "pikachu-original-cap",
  "pikachu-hoenn-cap",
  "pikachu-sinnoh-cap",
  "pikachu-unova-cap",
  "pikachu-kalos-cap",
  "pikachu-alola-cap",
  "pikachu-world-cap"
];

export function isPokemonBlockedAbilities(apiName)
{
  const n = String(apiName || "").toLowerCase();
  if (!n) return true;

  if (BLOCKED_EXACT_HABS.includes(n)) return true;

  for(let i = 0; i < BLOCKED_CONTAINS.length; i++)
  {
    if (n.indexOf(BLOCKED_CONTAINS[i]) !== -1) return true;
  }

  return false;
}
// -------------- DATOS META DE POKÉMON BLOQUEADOS - FIN -------------- 


// -------------- DATOS META DE TIPOS POKÉMON - INICIO --------------
// #region TIPOS PKM

// https://pokeapi.co/api/v2/type?limit=9999
export const TYPES_META =
{
  "unknown": {
    "apiKey": null,
    "labelEs": "Tipo Desconocido",
    "color": "#68A090",
    "icon": null
  },
  "ninguno": {
    "apiKey": null,
    "labelEs": "Ninguno",
    "color": "rgba(255,255,255,0.14)",
    "icon": null
  },
  "normal": {
    "apiKey": "normal",
    "labelEs": "Normal",
    "color": "#A1A1A1",
    "icon": "/assets/typesIcons/normal.svg"
  },
  "fire": {
    "apiKey": "fire",
    "labelEs": "Fuego",
    "color": "#F08030",
    "icon": "/assets/typesIcons/fire.svg"
  },
  "water": {
    "apiKey": "water",
    "labelEs": "Agua",
    "color": "#1C7CBD",
    "icon": "/assets/typesIcons/water.svg"
  },
  "electric": {
    "apiKey": "electric",
    "labelEs": "Eléctrico",
    "color": "#F8D030",
    "icon": "/assets/typesIcons/electric.svg"
  },
  "grass": {
    "apiKey": "grass",
    "labelEs": "Planta",
    "color": "#4ABB3A",
    "icon": "/assets/typesIcons/grass.svg"
  },
  "ice": {
    "apiKey": "ice",
    "labelEs": "Hielo",
    "color": "#68D1D1",
    "icon": "/assets/typesIcons/ice.svg"
  },
  "fighting": {
    "apiKey": "fighting",
    "labelEs": "Lucha",
    "color": "#AD3116",
    "icon": "/assets/typesIcons/fighting.svg"
  },
  "poison": {
    "apiKey": "poison",
    "labelEs": "Veneno",
    "color": "#6B33E4",
    "icon": "/assets/typesIcons/poison.svg"
  },
  "ground": {
    "apiKey": "ground",
    "labelEs": "Tierra",
    "color": "#9D5B11",
    "icon": "/assets/typesIcons/ground.svg"
  },
  "flying": {
    "apiKey": "flying",
    "labelEs": "Volador",
    "color": "#7491D0",
    "icon": "/assets/typesIcons/flying.svg"
  },
  "psychic": {
    "apiKey": "psychic",
    "labelEs": "Psíquico",
    "color": "#DF3E68",
    "icon": "/assets/typesIcons/psychic.svg"
  },
  "bug": {
    "apiKey": "bug",
    "labelEs": "Bicho",
    "color": "#898700",
    "icon": "/assets/typesIcons/bug.svg"
  },
  "rock": {
    "apiKey": "rock",
    "labelEs": "Roca",
    "color": "#B2AD74",
    "icon": "/assets/typesIcons/rock.svg"
  },
  "ghost": {
    "apiKey": "ghost",
    "labelEs": "Fantasma",
    "color": "#554570",
    "icon": "/assets/typesIcons/ghost.svg"
  },
  "dragon": {
    "apiKey": "dragon",
    "labelEs": "Dragón",
    "color": "#3444AF",
    "icon": "/assets/typesIcons/dragon.svg"
  },
  "dark": {
    "apiKey": "dark",
    "labelEs": "Siniestro",
    "color": "#322B2B",
    "icon": "/assets/typesIcons/dark.svg"
  },
  "steel": {
    "apiKey": "steel",
    "labelEs": "Acero",
    "color": "#549EBF",
    "icon": "/assets/typesIcons/steel.svg"
  },
  "fairy": {
    "apiKey": "fairy",
    "labelEs": "Hada",
    "color": "#DD65DD",
    "icon": "/assets/typesIcons/fairy.svg"
  }
};

export const TYPES_ES_TO_KEY_MAP =
{
  "Normal": "normal",
  "Ninguno": "ninguno",
  "Fuego": "fire",
  "Agua": "water",
  "Eléctrico": "electric",
  "Planta": "grass",
  "Hielo": "ice",
  "Lucha": "fighting",
  "Veneno": "poison",
  "Tierra": "ground",
  "Volador": "flying",
  "Psíquico": "psychic",
  "Bicho": "bug",
  "Roca": "rock",
  "Fantasma": "ghost",
  "Dragón": "dragon",
  "Siniestro": "dark",
  "Acero": "steel",
  "Hada": "fairy"
};

export function normalizeTypeKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getTypeMeta(input)
{
  const key = normalizeTypeKey(input);
  return (key && TYPES_META[key])
    ? TYPES_META[key]
    : TYPES_META.unknown;
}

export function getTypeIcon(input)
{
  return getTypeMeta(input)?.icon || null;
}

export function getTypeLabelEs(input)
{
  return getTypeMeta(input)?.labelEs || "Tipo Desconocido";
}

export function getTypeColor(input)
{
  return getTypeMeta(input)?.color || "#68A090";
}

export function getTypeKeyFromLabelEs(input)
{
  const raw = normalizeTypeKey(input);
  if (!raw) return "unknown";

  for(const [labelEs, key] of Object.entries(TYPES_ES_TO_KEY_MAP))
  {
    if (normalizeTypeKey(labelEs) === raw) return key;
  }

  return "unknown";
}
// -------------- DATOS META DE TIPOS POKÉMON - FIN -------------- 


// -------------- DATOS META DE GENERACIONES POKÉMON - INICIO -------------- 
// #region GEN PKM

// https://pokeapi.co/api/v2/generation?limit=9999
export const GENERATIONS_META =
{
  "unknown": {
    "order": -1,
    "apiKey": null,
    "labelEs": "Generación Desconocida",
    "icon": null,
    "gameVersions": []
  },
  "generation-i": {
    "order": 1,
    "apiKey": "generation-i",
    "labelEs": "Primera Generación",
    "icon": "/assets/genIcons/gen_1.svg",
    "gameVersions": ["red", "blue", "yellow", "red-japan", "blue-japan", "green-japan"]
  },
  "generation-ii": {
    "order": 2,
    "apiKey": "generation-ii",
    "labelEs": "Segunda Generación",
    "icon": "/assets/genIcons/gen_2.svg",
    "gameVersions": ["gold", "silver", "crystal"]
  },
  "generation-iii": {
    "order": 3,
    "apiKey": "generation-iii",
    "labelEs": "Tercera Generación",
    "icon": "/assets/genIcons/gen_3.svg",
    "gameVersions": ["ruby", "sapphire", "emerald", "firered", "leafgreen"]
  },
  "generation-iv": {
    "order": 4,
    "apiKey": "generation-iv",
    "labelEs": "Cuarta Generación",
    "icon": "/assets/genIcons/gen_4.svg",
    "gameVersions": ["diamond", "pearl", "platinum", "heartgold", "soulsilver", "brilliant-diamond", "shining-pearl"]
  },
  "generation-v": {
    "order": 5,
    "apiKey": "generation-v",
    "labelEs": "Quinta Generación",
    "icon": "/assets/genIcons/gen_5.svg",
    "gameVersions": ["black", "white", "colosseum", "xd", "black-2", "white-2"]
  },
  "generation-vi": {
    "order": 6,
    "apiKey": "generation-vi",
    "labelEs": "Sexta Generación",
    "icon": "/assets/genIcons/gen_6.svg",
    "gameVersions": ["x", "y", "omega-ruby", "alpha-sapphire"]
  },
  "generation-vii": {
    "order": 7,
    "apiKey": "generation-vii",
    "labelEs": "Séptima Generación",
    "icon": "/assets/genIcons/gen_7.svg",
    "gameVersions": ["sun", "moon", "ultra-sun", "ultra-moon", "lets-go-pikachu", "lets-go-eevee"]
  },
  "generation-viii": {
    "order": 8,
    "apiKey": "generation-viii",
    "labelEs": "Octava Generación",
    "icon": "/assets/genIcons/gen_8.svg",
    "gameVersions": ["sword", "shield", "the-isle-of-armor", "the-crown-tundra", "legends-arceus"]
  },
  "generation-ix": {
    "order": 9,
    "apiKey": "generation-ix",
    "labelEs": "Novena Generación",
    "icon": "/assets/genIcons/gen_9.svg",
    "gameVersions": ["scarlet", "violet", "the-teal-mask", "the-indigo-disk", "legends-z-a", "mega-dimension"]
  }
};

export const PKM_GEN_BY_KEY =
{
  // Alola (7ma Gen)
  "raichu-alola": "generation-vii",

  "rattata-alola": "generation-vii",
  "raticate-alola": "generation-vii",

  "sandshrew-alola": "generation-vii",
  "sandslash-alola": "generation-vii",

  "vulpix-alola": "generation-vii",
  "ninetales-alola": "generation-vii",

  "diglett-alola": "generation-vii",
  "dugtrio-alola": "generation-vii",

  "geodude-alola": "generation-vii",
  "graveler-alola": "generation-vii",
  "golem-alola": "generation-vii",

  "grimer-alola": "generation-vii",
  "muk-alola": "generation-vii",

  "exeggutor-alola": "generation-vii",

  "marowak-alola": "generation-vii",

  "meowth-alola": "generation-vii",
  "persian-alola": "generation-vii",

  // Galar (8va Gen)
  "meowth-galar": "generation-viii",

  "weezing-galar": "generation-viii",

  "corsola-galar": "generation-viii",

  "zigzagoon-galar": "generation-viii",
  "linoone-galar": "generation-viii",

  "yamask-galar": "generation-viii",

  "farfetchd-galar": "generation-viii",

  "slowpoke-galar": "generation-viii",
  "slowbro-galar": "generation-viii",
  "slowking-galar": "generation-viii",

  "articuno-galar": "generation-viii",
  "zapdos-galar": "generation-viii",
  "moltres-galar": "generation-viii",

  "stunfisk-galar": "generation-viii",

  "ponyta-galar": "generation-viii",
  "rapidash-galar": "generation-viii",

  "darumaka-galar": "generation-viii",
  "darmanitan-galar-standard": "generation-viii",
  "darmanitan-galar-zen": "generation-viii",

  "mr-mime-galar": "generation-viii",

  // Hisui (8va Gen)
  "lilligant-hisui": "generation-viii",

  "braviary-hisui": "generation-viii",

  "sliggoo-hisui": "generation-viii",
  "goodra-hisui": "generation-viii",

  "avalugg-hisui": "generation-viii",

  "typhlosion-hisui": "generation-viii",
  "decidueye-hisui": "generation-viii",
  "samurott-hisui": "generation-viii",

  "basculin-white-striped": "generation-viii",

  "growlithe-hisui": "generation-viii",
  "arcanine-hisui": "generation-viii",

  "voltorb-hisui": "generation-viii",
  "electrode-hisui": "generation-viii",

  "qwilfish-hisui": "generation-viii",

  "sneasel-hisui": "generation-viii",

  "zorua-hisui": "generation-viii",
  "zoroark-hisui": "generation-viii",

  // Paldea (9na Gen)
  "wooper-paldea": "generation-ix",

  "tauros-paldea-aqua-breed": "generation-ix",
  "tauros-paldea-blaze-breed": "generation-ix",
  "tauros-paldea-combat-breed": "generation-ix"
};

export function normalizeGenerationKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getGenerationMeta(input)
{
  const key = normalizeGenerationKey(input);
  return (key && GENERATIONS_META[key])
    ? GENERATIONS_META[key]
    : GENERATIONS_META.unknown;
}

export function getGenerationIcon(input)
{
  return getGenerationMeta(input)?.icon || null;
}

export function getGenerationLabelEs(input)
{
  return getGenerationMeta(input)?.labelEs || "Generación Desconocida";
}

export function getPokemonGenByKey(apiKey, fallback = "")
{
  const key = String(apiKey || "").trim().toLowerCase();
  if(!key) return fallback;

  return PKM_GEN_BY_KEY[key] || fallback;
}

export function hasPokemonGenByKey(apiKey)
{
  const key = String(apiKey || "").trim().toLowerCase();
  if(!key) return false;

  return !!PKM_GEN_BY_KEY[key];
}
// -------------- DATOS META DE GENERACIONES POKÉMON - FIN -------------- 


// -------------- DATOS META DE VERSIONES JUEGOS POKÉMON - INICIO -------------- 
// #region VERSIONES 

// https://pokeapi.co/api/v2/version?limit=9999

export const GAME_VERSIONS_META =
{
  // Versión Desconocida
  "unknown": {
    "order": 999,
    "apiKey": null,
    "labelEs": "Versión Desconocida",
    "versionLabelEs": "Versión Desconocida",
    "icon": null,
    "enabled": false
  },

  // Primera Generación
  "red": {
    "order": 1,
    "apiKey": "red",
    "labelEs": "Pokémon Rojo",
    "versionLabelEs": "Rojo",
    "icon": null,
    "enabled": true
  },
  "blue": {
    "order": 2,
    "apiKey": "blue",
    "labelEs": "Pokémon Azul",
    "versionLabelEs": "Azul",
    "icon": null,
    "enabled": true
  },
  "yellow": {
    "order": 3,
    "apiKey": "yellow",
    "labelEs": "Pokémon Amarillo",
    "versionLabelEs": "Amarillo",
    "icon": null,
    "enabled": true
  },

  "red-japan": {
    "order": 4,
    "apiKey": "red-japan",
    "labelEs": "Pokémon Rojo (Japón)",
    "versionLabelEs": "Rojo (Japón)",
    "icon": null,
    "enabled": true
  },
  "blue-japan": {
    "order": 5,
    "apiKey": "blue-japan",
    "labelEs": "Pokémon Azul (Japón)",
    "versionLabelEs": "Azul (Japón)",
    "icon": null,
    "enabled": true
  },
  "green-japan": {
    "order": 6,
    "apiKey": "green-japan",
    "labelEs": "Pokémon Verde (Japón)",
    "versionLabelEs": "Verde (Japón)",
    "icon": null,
    "enabled": true
  },


  // Segunda Generación
  "gold": {
    "order": 7,
    "apiKey": "gold",
    "labelEs": "Pokémon Oro",
    "versionLabelEs": "Oro",
    "icon": null,
    "enabled": true
  },
  "silver": {
    "order": 8,
    "apiKey": "silver",
    "labelEs": "Pokémon Plata",
    "versionLabelEs": "Plata",
    "icon": null,
    "enabled": true
  },
  "crystal": {
    "order": 9,
    "apiKey": "crystal",
    "labelEs": "Pokémon Cristal",
    "versionLabelEs": "Cristal",
    "icon": null,
    "enabled": true
  },


  // Tercera Generación
  "ruby": {
    "order": 10,
    "apiKey": "ruby",
    "labelEs": "Pokémon Rubí",
    "versionLabelEs": "Rubí",
    "icon": null,
    "enabled": true
  },
  "sapphire": {
    "order": 11,
    "apiKey": "sapphire",
    "labelEs": "Pokémon Zafiro",
    "versionLabelEs": "Zafiro",
    "icon": null,
    "enabled": true
  },
  "emerald": {
    "order": 12,
    "apiKey": "emerald",
    "labelEs": "Pokémon Esmeralda",
    "versionLabelEs": "Esmeralda",
    "icon": null,
    "enabled": true
  },

  "firered": {
    "order": 13,
    "apiKey": "firered",
    "labelEs": "Pokémon Rojo Fuego",
    "versionLabelEs": "Rojo Fuego",
    "icon": null,
    "enabled": true
  },
  "leafgreen": {
    "order": 14,
    "apiKey": "leafgreen",
    "labelEs": "Pokémon Verde Hoja",
    "versionLabelEs": "Verde Hoja",
    "icon": null,
    "enabled": true
  },


  // Cuarta Generación
  "diamond": {
    "order": 15,
    "apiKey": "diamond",
    "labelEs": "Pokémon Diamante",
    "versionLabelEs": "Diamante",
    "icon": null,
    "enabled": true
  },
  "pearl": {
    "order": 16,
    "apiKey": "pearl",
    "labelEs": "Pokémon Perla",
    "versionLabelEs": "Perla",
    "icon": null,
    "enabled": true
  },
  "platinum": {
    "order": 17,
    "apiKey": "platinum",
    "labelEs": "Pokémon Platino",
    "versionLabelEs": "Platino",
    "icon": null,
    "enabled": true
  },

  "heartgold": {
    "order": 18,
    "apiKey": "heartgold",
    "labelEs": "Pokémon HeartGold",
    "versionLabelEs": "HeartGold",
    "icon": null,
    "enabled": true
  },
  "soulsilver": {
    "order": 19,
    "apiKey": "soulsilver",
    "labelEs": "Pokémon SoulSilver",
    "versionLabelEs": "SoulSilver",
    "icon": null,
    "enabled": true
  },

  
  "brilliant-diamond": {
    "order": 20,
    "apiKey": "brilliant-diamond",
    "labelEs": "Pokémon Diamante Brillante",
    "versionLabelEs": "Diamante Brillante",
    "icon": null,
    "enabled": true
  },
  "shining-pearl": {
    "order": 21,
    "apiKey": "shining-pearl",
    "labelEs": "Pokémon Perla Reluciente",
    "versionLabelEs": "Perla Reluciente",
    "icon": null,
    "enabled": true
  },


  // Quinta Generación
  "black": {
    "order": 22,
    "apiKey": "black",
    "labelEs": "Pokémon Negro",
    "versionLabelEs": "Negro",
    "icon": null,
    "enabled": true
  },
  "white": {
    "order": 23,
    "apiKey": "white",
    "labelEs": "Pokémon Blanco",
    "versionLabelEs": "Blanco",
    "icon": null,
    "enabled": true
  },

  "colosseum": {
    "order": 24,
    "apiKey": "colosseum",
    "labelEs": "Pokémon Colosseum",
    "versionLabelEs": "Colosseum",
    "icon": null,
    "enabled": false
  },
  "xd": {
    "order": 25,
    "apiKey": "xd",
    "labelEs": "Pokémon XD",
    "versionLabelEs": "XD",
    "icon": null,
    "enabled": false
  },

  "black-2": {
    "order": 26,
    "apiKey": "black-2",
    "labelEs": "Pokémon Negro 2",
    "versionLabelEs": "Negro 2",
    "icon": null,
    "enabled": true
  },
  "white-2": {
    "order": 27,
    "apiKey": "white-2",
    "labelEs": "Pokémon Blanco 2",
    "versionLabelEs": "Blanco 2",
    "icon": null,
    "enabled": true
  },


  // Sexta Generación
  "x": {
    "order": 28,
    "apiKey": "x",
    "labelEs": "Pokémon X",
    "versionLabelEs": "X",
    "icon": null,
    "enabled": true
  },
  "y": {
    "order": 29,
    "apiKey": "y",
    "labelEs": "Pokémon Y",
    "versionLabelEs": "Y",
    "icon": null,
    "enabled": true
  },

  "omega-ruby": {
    "order": 30,
    "apiKey": "omega-ruby",
    "labelEs": "Pokémon Rubí Omega",
    "versionLabelEs": "Rubí Omega",
    "icon": null,
    "enabled": true
  },
  "alpha-sapphire": {
    "order": 31,
    "apiKey": "alpha-sapphire",
    "labelEs": "Pokémon Zafiro Alfa",
    "versionLabelEs": "Zafiro Alfa",
    "icon": null,
    "enabled": true
  },


  // Septima Generación
  "sun": {
    "order": 32,
    "apiKey": "sun",
    "labelEs": "Pokémon Sol",
    "versionLabelEs": "Sol",
    "icon": null,
    "enabled": true
  },
  "moon": {
    "order": 33,
    "apiKey": "moon",
    "labelEs": "Pokémon Luna",
    "versionLabelEs": "Luna",
    "icon": null,
    "enabled": true
  },

  "ultra-sun": {
    "order": 34,
    "apiKey": "ultra-sun",
    "labelEs": "Pokémon Ultra Sol",
    "versionLabelEs": "Ultra Sol",
    "icon": null,
    "enabled": true
  },
  "ultra-moon": {
    "order": 35,
    "apiKey": "ultra-moon",
    "labelEs": "Pokémon Ultra Luna",
    "versionLabelEs": "Ultra Luna",
    "icon": null,
    "enabled": true
  },

  "lets-go-pikachu": {
    "order": 36,
    "apiKey": "lets-go-pikachu",
    "labelEs": "Pokémon Let's Go Pikachu",
    "versionLabelEs": "Let's Go Pikachu",
    "icon": null,
    "enabled": true
  },
  "lets-go-eevee": {
    "order": 37,
    "apiKey": "lets-go-eevee",
    "labelEs": "Pokémon Let's Go Eevee",
    "versionLabelEs": "Let's Go Eevee",
    "icon": null,
    "enabled": true
  },


  // Octava Generación
  "sword": {
    "order": 38,
    "apiKey": "sword",
    "labelEs": "Pokémon Espada",
    "versionLabelEs": "Espada",
    "icon": null,
    "enabled": true
  },
  "shield": {
    "order": 39,
    "apiKey": "shield",
    "labelEs": "Pokémon Escudo",
    "versionLabelEs": "Escudo",
    "icon": null,
    "enabled": true
  },

  "the-isle-of-armor": {
    "order": 40,
    "apiKey": "the-isle-of-armor",
    "labelEs": "Pokémon DLC La Isla de la Armadura",
    "versionLabelEs": "La Isla de la Armadura",
    "icon": null,
    "enabled": true
  },
  "the-crown-tundra": {
    "order": 41,
    "apiKey": "the-crown-tundra",
    "labelEs": "Pokémon DLC Las Nieves de la Corona",
    "versionLabelEs": "Las Nieves de la Corona",
    "icon": null,
    "enabled": true
  },

  "legends-arceus": {
    "order": 42,
    "apiKey": "legends-arceus",
    "labelEs": "Pokémon Leyendas: Arceus",
    "versionLabelEs": "Leyendas: Arceus",
    "icon": null,
    "enabled": true
  },


  // Novena Generación
  "scarlet": {
    "order": 43,
    "apiKey": "scarlet",
    "labelEs": "Pokémon Escarlata",
    "versionLabelEs": "Escarlata",
    "icon": null,
    "enabled": true
  },
  "violet": {
    "order": 44,
    "apiKey": "violet",
    "labelEs": "Pokémon Púrpura",
    "versionLabelEs": "Púrpura",
    "icon": null,
    "enabled": true
  },

  "the-teal-mask": {
    "order": 45,
    "apiKey": "the-teal-mask",
    "labelEs": "Pokémon DLC La Máscara Turquesa",
    "versionLabelEs": "La Máscara Turquesa",
    "icon": null,
    "enabled": true
  },
  "the-indigo-disk": {
    "order": 46,
    "apiKey": "the-indigo-disk",
    "labelEs": "Pokémon DLC El Disco Índigo",
    "versionLabelEs": "El Disco Índigo",
    "icon": null,
    "enabled": true
  },

  "legends-za": {
    "order": 47,
    "apiKey": "legends-za",
    "labelEs": "Pokémon Leyendas: ZA",
    "versionLabelEs": "Leyendas: ZA",
    "icon": null,
    "enabled": true
  },
  "mega-dimension": {
    "order": 48,
    "apiKey": "mega-dimension",
    "labelEs": "Pokémon DLC Megadimensión",
    "versionLabelEs": "Megadimensión",
    "icon": null,
    "enabled": true
  },


  // Champions
  "champions": {
    "order": 49,
    "apiKey": "champions",
    "labelEs": "Pokémon Champions",
    "versionLabelEs": "Champions",
    "icon": null,
    "enabled": true
  }

};

export function normalizeGameVersionKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getGameVersionMeta(input)
{
  const key = normalizeGameVersionKey(input);
  return (key && GAME_VERSIONS_META[key])
    ? GAME_VERSIONS_META[key]
    : GAME_VERSIONS_META.unknown;
}

export function getGameVersionLabelEs(input)
{
  return getGameVersionMeta(input)?.labelEs || "Versión Desconocida";
}

export function getGameVersionVersionLabelEs(input)
{
  return getGameVersionMeta(input)?.versionLabelEs || "Versión Desconocida";
}

export function getGameVersionOrder(input)
{
  return getGameVersionMeta(input)?.order || null;
}

export function isGameVersionEnabled(input)
{
  return getGameVersionMeta(input)?.enabled;
}
// -------------- DATOS META DE VERSIONES JUEGOS POKÉMON - FIN -------------- 


// -------------- DATOS META DE GRUPO VERSIONES JUEGOS POKÉMON - INICIO -------------- 
// #region GRUPO VERSIONES 

// https://pokeapi.co/api/v2/version-group?limit=9999

export const GROUP_VERSIONS_META =
{
  // Grupo Versión Desconocida
  "unknown": {
    "order": 0,
    "apiKey": null,
    "labelEs": "Grupo Versión Desconocida",
    "groupVersionLabelEs": "Grupo Versión Desconocida",
    "icon": null,
    "enabled": true
  },

  // Primera Generación 1º (I)
  "blue-japan": {
    "order": 1,
    "apiKey": "blue-japan",
    "labelEs": "Pokémon Azul (JP)",
    "groupVersionLabelEs": "Azul (JP)",
    "generation": "generation-i",
    "icon": null,
    "enabled": true
  },

  "red-green-japan": {
    "order": 2,
    "apiKey": "red-green-japan",
    "labelEs": "Pokémon Rojo/Verde (JP)",
    "groupVersionLabelEs": "Rojo/Verde (JP)",
    "generation": "generation-i",
    "icon": null,
    "enabled": true
  },

  "red-blue": {
    "order": 3,
    "apiKey": "red-blue",
    "labelEs": "Pokémon Rojo/Azul",
    "groupVersionLabelEs": "Rojo/Azul",
    "generation": "generation-i",
    "icon": null,
    "enabled": true
  },

  "yellow": {
    "order": 4,
    "apiKey": "yellow",
    "labelEs": "Pokémon Amarillo",
    "groupVersionLabelEs": "Amarillo",
    "generation": "generation-i",
    "icon": null,
    "enabled": true
  },

  // Segunda Generación 2º (II)
  "gold-silver": {
    "order": 5,
    "apiKey": "gold-silver",
    "labelEs": "Pokémon Oro/Plata",
    "groupVersionLabelEs": "Oro/Plata",
    "generation": "generation-ii",
    "icon": null,
    "enabled": true
  },

  "crystal": {
    "order": 6,
    "apiKey": "crystal",
    "labelEs": "Pokémon Cristal",
    "groupVersionLabelEs": "Cristal",
    "generation": "generation-ii",
    "icon": null,
    "enabled": true
  },

  // Tercera Generación 3º (III)
  "ruby-sapphire": {
    "order": 7,
    "apiKey": "ruby-sapphire",
    "labelEs": "Pokémon Rubí/Zafiro",
    "groupVersionLabelEs": "Rubí/Zafiro",
    "generation": "generation-iii",
    "icon": null,
    "enabled": true
  },

  "emerald": {
    "order": 8,
    "apiKey": "emerald",
    "labelEs": "Pokémon Esmeralda",
    "groupVersionLabelEs": "Esmeralda",
    "generation": "generation-iii",
    "icon": null,
    "enabled": true
  },

  "firered-leafgreen": {
    "order": 9,
    "apiKey": "firered-leafgreen",
    "labelEs": "Pokémon Rojo Fuego/Verde Hoja",
    "groupVersionLabelEs": "Rojo Fuego/Verde Hoja",
    "generation": "generation-iii",
    "icon": null,
    "enabled": true
  },

  // Cuarta Generación 4º (IV)
  "diamond-pearl": {
    "order": 10,
    "apiKey": "diamond-pearl",
    "labelEs": "Pokémon Diamante/Perla",
    "groupVersionLabelEs": "Diamante/Perla",
    "generation": "generation-iv",
    "icon": null,
    "enabled": true
  },

  "platinum": {
    "order": 11,
    "apiKey": "platinum",
    "labelEs": "Pokémon Platino",
    "groupVersionLabelEs": "Platino",
    "generation": "generation-iv",
    "icon": null,
    "enabled": true
  },

  "heartgold-soulsilver": {
    "order": 12,
    "apiKey": "heartgold-soulsilver",
    "labelEs": "Pokémon HeartGold/SoulSilver",
    "groupVersionLabelEs": "HeartGold/SoulSilver",
    "generation": "generation-iv",
    "icon": null,
    "enabled": true
  },

  // Quinta Generación 5º (V)
  "black-white": {
    "order": 13,
    "apiKey": "black-white",
    "labelEs": "Pokémon Negro/Blanco",
    "groupVersionLabelEs": "Negro/Blanco",
    "generation": "generation-v",
    "icon": null,
    "enabled": true
  },

  "colosseum": {
    "order": 14,
    "apiKey": "colosseum",
    "labelEs": "Pokémon Colosseum",
    "groupVersionLabelEs": "Colosseum",
    "generation": "generation-v",
    "icon": null,
    "enabled": false
  },

  "xd": {
    "order": 15,
    "apiKey": "xd",
    "labelEs": "Pokémon XD",
    "groupVersionLabelEs": "XD",
    "generation": "generation-v",
    "icon": null,
    "enabled": false
  },

  "black-2-white-2": {
    "order": 16,
    "apiKey": "black-2-white-2",
    "labelEs": "Pokémon Negro 2/Blanco 2",
    "groupVersionLabelEs": "Negro 2/Blanco 2",
    "generation": "generation-v",
    "icon": null,
    "enabled": true
  },

  // Sexta Generación 6º (VI)
  "x-y": {
    "order": 17,
    "apiKey": "x-y",
    "labelEs": "Pokémon X/Y",
    "groupVersionLabelEs": "X/Y",
    "generation": "generation-vi",
    "icon": null,
    "enabled": true
  },

  "omega-ruby-alpha-sapphire": {
    "order": 18,
    "apiKey": "omega-ruby-alpha-sapphire",
    "labelEs": "Pokémon Rubí Omega/Zafiro Alfa",
    "groupVersionLabelEs": "Rubí Omega/Zafiro Alfa",
    "generation": "generation-vi",
    "icon": null,
    "enabled": true
  },

  // Septima Generación 7º (VII)
  "sun-moon": {
    "order": 19,
    "apiKey": "sun-moon",
    "labelEs": "Pokémon Sol/Luna",
    "groupVersionLabelEs": "Sol/Luna",
    "generation": "generation-vii",
    "icon": null,
    "enabled": true
  },

  "ultra-sun-ultra-moon": {
    "order": 20,
    "apiKey": "ultra-sun-ultra-moon",
    "labelEs": "Pokémon Ultra Sol/Ultra Luna",
    "groupVersionLabelEs": "Ultra Sol/Ultra Luna",
    "generation": "generation-vii",
    "icon": null,
    "enabled": true
  },

  "lets-go-pikachu-lets-go-eevee": {
    "order": 21,
    "apiKey": "lets-go-pikachu-lets-go-eevee",
    "labelEs": "Pokémon Let's Go Pikachu/Eevee",
    "groupVersionLabelEs": "Let's Go Pikachu/Eevee",
    "generation": "generation-vii",
    "icon": null,
    "enabled": true
  },

  // Octava Generación 8º (VIII)
  "sword-shield": {
    "order": 22,
    "apiKey": "sword-shield",
    "labelEs": "Pokémon Espada/Escudo",
    "groupVersionLabelEs": "Espada/Escudo",
    "generation": "generation-viii",
    "icon": null,
    "enabled": true
  },

  "the-isle-of-armor": {
    "order": 23,
    "apiKey": "the-isle-of-armor",
    "labelEs": "Pokémon DLC La Isla de la Armadura",
    "groupVersionLabelEs": "DLC La Isla de la Armadura",
    "generation": "generation-viii",
    "icon": null,
    "enabled": true
  },

  "the-crown-tundra": {
    "order": 24,
    "apiKey": "the-crown-tundra",
    "labelEs": "Pokémon DLC Las Nieves de la Corona",
    "groupVersionLabelEs": "DLC Las Nieves de la Corona",
    "generation": "generation-viii",
    "icon": null,
    "enabled": true
  },

  "brilliant-diamond-shining-pearl": {
    "order": 25,
    "apiKey": "brilliant-diamond-shining-pearl",
    "labelEs": "Pokémon Diamante Brillante/Perla Reluciente",
    "groupVersionLabelEs": "Diamante Brillante/Perla Reluciente",
    "generation": "generation-iv",
    "icon": null,
    "enabled": true
  },

  "legends-arceus": {
    "order": 26,
    "apiKey": "legends-arceus",
    "labelEs": "Pokémon Leyendas: Arceus",
    "groupVersionLabelEs": "Leyendas: Arceus",
    "generation": "generation-viii",
    "icon": null,
    "enabled": true
  },

  // Novena Generación 9º (IX)
  "scarlet-violet": {
    "order": 27,
    "apiKey": "scarlet-violet",
    "labelEs": "Pokémon Escarlata/Púrpura",
    "groupVersionLabelEs": "Escarlata/Púrpura",
    "generation": "generation-ix",
    "icon": null,
    "enabled": true
  },

  "the-teal-mask": {
    "order": 28,
    "apiKey": "the-teal-mask",
    "labelEs": "Pokémon DLC La Máscara Turquesa",
    "groupVersionLabelEs": "DLC La Máscara Turquesa",
    "generation": "generation-ix",
    "icon": null,
    "enabled": true
  },

  "the-indigo-disk": {
    "order": 29,
    "apiKey": "the-indigo-disk",
    "labelEs": "Pokémon DLC El Disco Índigo",
    "groupVersionLabelEs": "DLC El Disco Índigo",
    "generation": "generation-ix",
    "icon": null,
    "enabled": true
  },

  "legends-za": {
    "order": 30,
    "apiKey": "legends-za",
    "labelEs": "Pokémon Leyendas: ZA",
    "groupVersionLabelEs": "Leyendas: ZA",
    "generation": "generation-ix",
    "icon": null,
    "enabled": true
  },

  "mega-dimension": {
    "order": 31,
    "apiKey": "mega-dimension",
    "labelEs": "Pokémon DLC Megadimensión",
    "groupVersionLabelEs": "DLC Megadimensión",
    "generation": "generation-ix",
    "icon": null,
    "enabled": true
  },

  // Champions
  "champions": {
    "order": 32,
    "apiKey": "champions",
    "labelEs": "Pokémon Champions",
    "groupVersionLabelEs": "Champions",
    "generation": "",
    "icon": null,
    "enabled": true
  }

};

export function normalizeGrupVersionKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getGroupVersionMeta(input)
{
  const key = normalizeGrupVersionKey(input);
  return (key && GROUP_VERSIONS_META[key])
    ? GROUP_VERSIONS_META[key]
    : GROUP_VERSIONS_META.unknown;
}

export function getGroupVersionLabelEs(input)
{
  return getGroupVersionMeta(input)?.labelEs || "Grupo Versión Desconocida";
}

export function getGroupVersionOrder(input)
{
  return getGroupVersionMeta(input)?.order || null;
}

export function isGroupVersionEnabled(input)
{
  return getGroupVersionMeta(input)?.enabled;
}
// -------------- DATOS META DE GRUPO VERSIONES JUEGOS POKÉMON - FIN -------------- 


// -------------- DATOS META DE POKEDEX POKÉMON - INICIO -------------- 
// #region POKEDEX
// https://pokeapi.co/api/v2/pokedex?limit=9999

export const POKEDEX_DATA_META =
[

  // ------------ 1º (I) GENERACIÓN (KANTO) ------------ 
  {
    "apiKey": "kanto",
    "labelEs": "Pokédex Rojo/Azul/Amarillo",
    "path": "/rojo-azul-amarillo",
    "icon": null,
    "gameVersions": ["red", "blue", "yellow"],
    "generation": "generation-i",
    "regionGroup": "kanto",
    "enabled": true,
    "order": 1
  },


  // ------------ 2º (II) GENERACIÓN (JOHTO) ------------ 
  {
    "apiKey": "original-johto",
    "labelEs": "Pokédex Oro/Plata/Cristal",
    "path": "/oro-plata-cristal",
    "icon": null,
    "gameVersions": ["gold", "silver", "crystal"],
    "generation": "generation-ii",
    "regionGroup": "johto",
    "enabled": true,
    "order": 2
  },


  // ------------ 3º (III) GENERACIÓN (HOENN) ------------ 
  {
    "apiKey": "hoenn",
    "labelEs": "Pokédex Rubí/Zafiro/Esmeralda",
    "path": "/rubi-zafiro-esmeralda",
    "icon": null,
    "gameVersions": ["ruby", "sapphire", "crystal"],
    "generation": "generation-iii",
    "regionGroup": "hoenn",
    "enabled": true,
    "order": 3
  },
  {
    "apiKey": "kanto",
    "labelEs": "Pokédex Rojo Fuego/Verde Hoja",
    "path": "/rojo-fuego-verde-hoja",
    "icon": null,
    "gameVersions": ["firered", "leafgreen"],
    "generation": "generation-iii",
    "regionGroup": "kanto",
    "enabled": true,
    "order": 4
  },


  // ------------ 4º (IV) GENERACIÓN (SINNOH) ------------ 
  {
    "apiKey": "original-sinnoh",
    "labelEs": "Pokédex Diamante/Perla",
    "path": "/diamante-perla",
    "icon": null,
    "gameVersions": ["diamond", "pearl"],
    "generation": "generation-iv",
    "regionGroup": "sinnoh",
    "enabled": true,
    "order": 5
  },
  {
    "apiKey": "extended-sinnoh",
    "labelEs": "Pokédex Platino",
    "path": "/platino",
    "icon": null,
    "gameVersions": ["platinum"],
    "generation": "generation-iv",
    "regionGroup": "sinnoh",
    "enabled": true,
    "order": 6
  },

  {
    "apiKey": "updated-johto",
    "labelEs": "Pokédex HeartGold/SoulSilver",
    "path": "/heartgold-soulsilver",
    "icon": null,
    "gameVersions": ["heartgold", "soulsilver"],
    "generation": "generation-iv",
    "regionGroup": "johto",
    "enabled": true,
    "order": 7
  },

  {
    "apiKey": "original-sinnoh",
    "labelEs": "Pokédex Diamante Brillante/Perla Reluciente",
    "path": "/diamante-brillante-perla-reluciente",
    "icon": null,
    "gameVersions": ["brilliant-diamond", "shining-pearl"],
    "generation": "generation-iv",
    "regionGroup": "sinnoh",
    "enabled": true,
    "order": 8
  },


  // ------------ 5º (V) GENERACIÓN (UNOVA/TESELIA) ------------
  {
    "apiKey": "original-unova",
    "labelEs": "Pokédex Negro/Blanco",
    "path": "/negro-blanco",
    "icon": null,
    "gameVersions": ["black", "white"],
    "generation": "generation-v",
    "regionGroup": "unova-teselia",
    "enabled": true,
    "order": 9
  },
  {
    "apiKey": "updated-unova",
    "labelEs": "Pokédex Negro 2/Blanco 2",
    "path": "/negro-blanco",
    "icon": null,
    "gameVersions": ["black-2", "white-2"],
    "generation": "generation-v",
    "regionGroup": "unova-teselia",
    "enabled": true,
    "order": 10
  },


  // ------------ 6º (VI) GENERACIÓN (KALOS) ------------
  {
    "apiKey": "kalos-central",
    "labelEs": "Pokédex X/Y (Kalos Central)",
    "path": "/x-y-central",
    "icon": null,
    "gameVersions": ["x", "y"],
    "generation": "generation-vi",
    "regionGroup": "kalos",
    "enabled": true,
    "order": 11
  },
  {
    "apiKey": "kalos-coastal",
    "labelEs": "Pokédex X/Y (Kalos Costera)",
    "path": "/x-y-costera",
    "icon": null,
    "gameVersions": ["x", "y"],
    "generation": "generation-vi",
    "regionGroup": "kalos",
    "enabled": true,
    "order": 12
  },
  {
    "apiKey": "kalos-mountain",
    "labelEs": "Pokédex X/Y (Kalos Montaña)",
    "path": "/x-y-mountain",
    "icon": null,
    "gameVersions": ["x", "y"],
    "generation": "generation-vi",
    "regionGroup": "kalos",
    "enabled": true,
    "order": 13
  },
  {
    "apiKey": "updated-hoenn",
    "labelEs": "Pokédex Rubí Omega/Zafiro Alfa",
    "path": "/rubi-omega-zafiro-alfa",
    "icon": null,
    "gameVersions": ["omega-ruby", "alpha-sapphire"],
    "generation": "generation-vi",
    "regionGroup": "hoenn",
    "enabled": true,
    "order": 14
  },


  // ------------ 7º (VII) GENERACIÓN (ALOLA) ------------
  {
    "apiKey": "original-alola",
    "labelEs": "Pokédex Sol/Luna",
    "path": "/sol-luna",
    "icon": null,
    "gameVersions": ["sun", "moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 19
  },
  {
    "apiKey": "original-melemele",
    "labelEs": "Pokédex Melemele (Sol/Luna)",
    "path": "/sol-luna-melemele",
    "icon": null,
    "gameVersions": ["sun", "moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 18
  },
  {
    "apiKey": "original-akala",
    "labelEs": "Pokédex Akala (Sol/Luna)",
    "path": "/sol-luna-akala",
    "icon": null,
    "gameVersions": ["sun", "moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 17
  },
  {
    "apiKey": "original-ulaula",
    "labelEs": "Pokédex Ula-Ula (Sol/Luna)",
    "path": "/sol-luna-ula-ula",
    "icon": null,
    "gameVersions": ["sun", "moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 16
  },
  {
    "apiKey": "original-poni",
    "labelEs": "Pokédex Poni (Sol/Luna)",
    "path": "/sol-luna-poni",
    "icon": null,
    "gameVersions": ["sun", "moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 15
  },

  {
    "apiKey": "updated-alola",
    "labelEs": "Pokédex Ultrasol/Ultraluna",
    "path": "/ultrasol-ultraluna",
    "icon": null,
    "gameVersions": ["ultra-sun", "ultra-moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 24
  },
  {
    "apiKey": "updated-melemele",
    "labelEs": "Pokédex Melemele (Ultrasol/Ultraluna)",
    "path": "/ultrasol-ultraluna-melemele",
    "icon": null,
    "gameVersions": ["ultra-sun", "ultra-moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 23
  },
  {
    "apiKey": "updated-akala",
    "labelEs": "Pokédex Akala (Ultrasol/Ultraluna)",
    "path": "/ultrasol-ultraluna-akala",
    "icon": null,
    "gameVersions": ["ultra-sun", "ultra-moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 22
  },
  {
    "apiKey": "updated-ulaula",
    "labelEs": "Pokédex Ula-Ula (Ultrasol/Ultraluna)",
    "path": "/ultrasol-ultraluna-ula-ula",
    "icon": null,
    "gameVersions": ["ultra-sun", "ultra-moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 21
  },
  {
    "apiKey": "updated-poni",
    "labelEs": "Pokédex Poni (Ultrasol/Ultraluna)",
    "path": "/ultrasol-ultraluna-poni",
    "icon": null,
    "gameVersions": ["ultra-sun", "ultra-moon"],
    "generation": "generation-vii",
    "regionGroup": "alola",
    "enabled": true,
    "order": 20
  },

  {
    "apiKey": "letsgo-kanto",
    "labelEs": "Pokédex Let's Go Pikachu/Eevee",
    "path": "/lets-go-pikachu-eevee",
    "icon": null,
    "gameVersions": ["lets-go-pikachu", "lets-go-eevee"],
    "generation": "generation-vii",
    "regionGroup": "kanto",
    "enabled": true,
    "order": 25
  },


  // ------------ 8º (VIII) GENERACIÓN (GALAR y HISUI) ------------
  {
    "apiKey": "galar",
    "labelEs": "Pokédex Espada/Escudo",
    "path": "/espada-escudo",
    "icon": null,
    "gameVersions": ["sword", "shield"],
    "generation": "generation-viii",
    "regionGroup": "galar",
    "enabled": true,
    "order": 26
  },
  {
    "apiKey": "isle-of-armor",
    "labelEs": "Pokédex DLC Isla de la Armadura (Espada/Escudo)",
    "path": "/espada-escudo-isla-de-la-armadura",
    "icon": null,
    "gameVersions": ["the-isle-of-armor"],
    "generation": "generation-viii",
    "regionGroup": "galar",
    "enabled": true,
    "order": 27
  },
  {
    "apiKey": "crown-tundra",
    "labelEs": "Pokédex DLC Nieves de la Corona (Espada/Escudo)",
    "path": "/espada-escudo-nieves-de-la-corona",
    "icon": null,
    "gameVersions": ["the-crown-tundra"],
    "generation": "generation-viii",
    "regionGroup": "galar",
    "enabled": true,
    "order": 28
  },

  {
    "apiKey": "hisui",
    "labelEs": "Pokédex Leyendas: Arceus",
    "path": "/leyendas-arceus",
    "icon": null,
    "gameVersions": ["legends-arceus"],
    "generation": "generation-viii",
    "regionGroup": "hisui",
    "enabled": true,
    "order": 29
  },


  // ------------ 9º (IX) GENERACIÓN (PALDEA) ------------
  {
    "apiKey": "paldea",
    "labelEs": "Pokédex Escarlata/Púrpura",
    "path": "/escarlata-purpura",
    "icon": null,
    "gameVersions": ["scarlet", "violet"],
    "generation": "generation-ix",
    "regionGroup": "paldea",
    "enabled": true,
    "order": 30
  },
  {
    "apiKey": "kitakami",
    "labelEs": "Pokédex DLC Comarca de Noroteo (Escarlata/Púrpura)",
    "path": "/escarlata-purpura-la-mascara-turquesa",
    "icon": null,
    "gameVersions": ["the-teal-mask"],
    "generation": "generation-ix",
    "regionGroup": "paldea",
    "enabled": true,
    "order": 31
  },
  {
    "apiKey": "blueberry",
    "labelEs": "Pokédex DLC Academia Arándano (Escarlata/Púrpura)",
    "path": "/escarlata-purpura-el-disco-indigo",
    "icon": null,
    "gameVersions": ["the-indigo-disk"],
    "generation": "generation-ix",
    "regionGroup": "paldea",
    "enabled": true,
    "order": 32
  },

  {
    "apiKey": "lumiose-city",
    "labelEs": "Pokédex Ciudad Luminalia (Leyendas: ZA)",
    "path": "/leyendas-za",
    "icon": null,
    "gameVersions": ["legends-za"],
    "generation": "generation-ix",
    "regionGroup": "kalos",
    "enabled": true,
    "order": 33
  },
  {
    "apiKey": "hyperspace",
    "labelEs": "Pokédex DLC Luminalia Dimensional (Leyendas: ZA)",
    "path": "/leyendas-za-mega-dimension",
    "icon": null,
    "gameVersions": ["mega-dimension"],
    "generation": "generation-ix",
    "regionGroup": "kalos",
    "enabled": true,
    "order": 34
  },


  // ------------ CHAMPIONS ------------
  {
    "apiKey": "champions",
    "labelEs": "Pokédex Champions",
    "path": "/champions",
    "icon": null,
    "gameVersions": ["champions"],
    "generation": "",
    "regionGroup": "champions",
    "enabled": true,
    "order": 35
  },


  // ------------ NACIONAL ------------ 
  {
    "apiKey": "national",
    "labelEs": "Pokédex Nacional",
    "path": "/nacional",
    "icon": null,
    "gameVersions": [],
    "generation": "",
    "regionGroup": "nacional",
    "enabled": true,
    "order": 36
  }
];

function buildPokedexDataMetaMap()
{
  const map = new Map();

  for(const entry of (POKEDEX_DATA_META || []))
  {
    const key = String(entry?.apiKey || "").trim().toLowerCase();
    if(key) map.set(key, entry);
  }

  return map;
}

const POKEDEX_DATA_META_BY_KEY = buildPokedexDataMetaMap();

export function getPokedexDataMetaEntries(includeDisabled = false)
{
  return (POKEDEX_DATA_META || []).filter(function(entry)
  {
    return includeDisabled || entry?.enabled !== false;
  });
}

export function getEnabledPokedexDataMetaEntries()
{
  return getPokedexDataMetaEntries(false);
}

export function getPokedexDataMetaByKey(input)
{
  const key = String(input || "").trim().toLowerCase();
  if(!key) return null;

  return POKEDEX_DATA_META_BY_KEY.get(key) || null;
}

function normalizePokedexPath(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if(!raw) return "";

  return raw.charAt(0) === "/" ? raw : "/" + raw;
}

export function getPokedexDataMetaByPath(input, includeDisabled = false)
{
  const wanted = normalizePokedexPath(input);
  if(!wanted) return null;

  const entries = getPokedexDataMetaEntries(includeDisabled);

  for(const entry of entries)
  {
    if(normalizePokedexPath(entry?.path) === wanted)
    {
      return entry;
    }
  }

  return null;
}

export function hasPokedexDataMetaByPath(input, includeDisabled = false)
{
  return !!getPokedexDataMetaByPath(input, includeDisabled);
}

export function getPokedexDataMetaOrder(input)
{
  const entry = (input && typeof input === "object")
    ? input
    : getPokedexDataMetaByKey(input);

  const order = entry?.order;
  return Number.isFinite(order) ? order : null;
}

export function hasPokedexDataMetaByKey(input)
{
  return !!getPokedexDataMetaByKey(input);
}

export function getPokedexApiKeys(includeDisabled = false)
{
  return getPokedexDataMetaEntries(includeDisabled)
    .map(function(entry) { return entry?.apiKey; })
    .filter(Boolean);
}

export function getEnabledPokedexApiKeys()
{
  return getPokedexApiKeys(false);
}

export function getDefaultPokedexDataMetaEntry()
{
  const entries = getEnabledPokedexDataMetaEntries().slice().sort(function(a, b)
  {
    const ao = getPokedexDataMetaOrder(a);
    const bo = getPokedexDataMetaOrder(b);

    if(ao !== bo)
    {
      return (Number.isFinite(ao) ? ao : 9999) - (Number.isFinite(bo) ? bo : 9999);
    }

    return String(a?.labelEs || a?.path || a?.apiKey || "")
      .localeCompare(String(b?.labelEs || b?.path || b?.apiKey || ""));
  });

  return entries[0] || null;
}

export function getDefaultPokedexDataMetaPath()
{
  return getDefaultPokedexDataMetaEntry()?.path || "/nacional";
}
// -------------- DATOS META DE POKEDEX POKÉMON - FIN -------------- 


// ---------------- DATOS META NOMBRE REGIONES - INICIO ---------------- 
//#region REGIONES

export const REGIONS_META =
{
  "kanto": {
    "apiKey": "kanto",
    "labelEs": "Kanto",
    "icon": null,
    "order": 1
  },
  "johto": {
    "apiKey": "johto",
    "labelEs": "Johto",
    "icon": null,
    "order": 2
  },
  "hoenn": {
    "apiKey": "hoenn",
    "labelEs": "Hoenn",
    "icon": null,
    "order": 3
  },
  "sinnoh": {
    "apiKey": "sinnoh",
    "labelEs": "Sinnoh",
    "icon": null,
    "order": 4
  },
  "unova-teselia": {
    "apiKey": "unova-teselia",
    "labelEs": "Unova/Teselia",
    "icon": null,
    "order": 5
  },
  "kalos": {
    "apiKey": "kalos",
    "labelEs": "Kalos",
    "icon": null,
    "order": 6
  },
  "alola": {
    "apiKey": "alola",
    "labelEs": "Alola",
    "icon": null,
    "order": 7
  },
  "galar": {
    "apiKey": "galar",
    "labelEs": "Galar",
    "icon": null,
    "order": 8
  },
  "hisui": {
    "apiKey": "hisui",
    "labelEs": "Hisui",
    "icon": null,
    "order": 9
  },
  "paldea": {
    "apiKey": "paldea",
    "labelEs": "Paldea",
    "icon": null,
    "order": 10
  },
  "champions": {
    "apiKey": "champions",
    "labelEs": "Champions",
    "icon": null,
    "order": 11
  },
  "nacional": {
    "apiKey": "nacional",
    "labelEs": "Nacional",
    "icon": null,
    "order": 12
  }
};

export function normalizeRegionKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getRegionMeta(input)
{
  const key = normalizeRegionKey(input);
  return (key && REGIONS_META[key])
    ? REGIONS_META[key]
    : null;
}

export function getRegionLabelEs(input)
{
  return getRegionMeta(input)?.labelEs || "Region Desconocida";
}

export function getRegionIcon(input)
{
  return getRegionMeta(input)?.icon || null;
}

export function getRegionOrder(input)
{
  const order = getRegionMeta(input)?.order;
  return Number.isFinite(order) ? order : null;
}
// ---------------- DATOS META NOMBRE REGIONES - FIN ---------------- 


// ---------------- DATOS META DE OBJETOS/ITEMS - INICIO ---------------- 
// #region ITEMS PKM

// ------- CATEGORIAS - INICIO ------- 
// https://pokeapi.co/api/v2/item-category?limit=9999
export const CATEGORY_ITEM_META =
{
  "unknown": {
    "apiKey": "unknown",
    "labelEs": "Categoría Desconocida",
    "isAllowed": false
  },
  "stat-boosts": {
    "apiKey": "stat-boosts",
    "labelEs": "Aumento de estadísticas",
    "isAllowed": true
  },
  "effort-drop": {
    "apiKey": "effort-drop",
    "labelEs": "Bayas que reducen Puntos de Esfuerzo",
    "isAllowed": true
  },
  "medicine": {
    "apiKey": "medicine",
    "labelEs": "Bayas curativas",
    "isAllowed": true
  },
  "other": {
    "apiKey": "other",
    "labelEs": "Bayas",
    "isAllowed": true
  },
  "in-a-pinch": {
    "apiKey": "in-a-pinch",
    "labelEs": "Bayas para momentos de apuro",
    "isAllowed": true
  },
  "picky-healing": {
    "apiKey": "picky-healing",
    "labelEs": "Bayas curativas",
    "isAllowed": true
  },
  "type-protection": {
    "apiKey": "type-protection",
    "labelEs": "Bayas contra ataques supereficaces",
    "isAllowed": true
  },
  "baking-only": {
    "apiKey": "baking-only",
    "labelEs": "Para hornear",
    "isAllowed": false
  },
  "collectibles": {
    "apiKey": "collectibles",
    "labelEs": "Coleccionables",
    "isAllowed": false
  },
  "evolution": {
    "apiKey": "evolution",
    "labelEs": "Objetos evolutivos",
    "isAllowed": true
  },
  "spelunking": {
    "apiKey": "spelunking",
    "labelEs": "Objetos de huida",
    "isAllowed": true
  },
  "held-items": {
    "apiKey": "held-items",
    "labelEs": "Objetos equipables",
    "isAllowed": true
  },
  "choice": {
    "apiKey": "choice",
    "labelEs": "Movimiento elegido",
    "isAllowed": true
  },
  "effort-training": {
    "apiKey": "effort-training",
    "labelEs": "Entrenamiento de Puntos de Esfuerzo",
    "isAllowed": true
  },
  "bad-held-items": {
    "apiKey": "bad-held-items",
    "labelEs": "Provoca un estado alterado",
    "isAllowed": true
  },
  "training": {
    "apiKey": "training",
    "labelEs": "Entrenamiento",
    "isAllowed": true
  },
  "plates": {
    "apiKey": "plates",
    "labelEs": "-",
    "isAllowed": false
  },
  "species-specific": {
    "apiKey": "species-specific",
    "labelEs": "Efecto en algunas especies",
    "isAllowed": true
  },
  "type-enhancement": {
    "apiKey": "type-enhancement",
    "labelEs": "Potencia movimientos de un tipo",
    "isAllowed": true
  },
  "event-items": {
    "apiKey": "event-items",
    "labelEs": "Objetos de evento",
    "isAllowed": false
  },
  "gameplay": {
    "apiKey": "gameplay",
    "labelEs": "Objeto clave",
    "isAllowed": false
  },
  "plot-advancement": {
    "apiKey": "plot-advancement",
    "labelEs": "Avance de la aventura",
    "isAllowed": false
  },
  "unused": {
    "apiKey": "unused",
    "labelEs": "No utilizable",
    "isAllowed": false
  },
  "loot": {
    "apiKey": "loot",
    "labelEs": "Tesoros",
    "isAllowed": true
  },
  "all-mail": {
    "apiKey": "all-mail",
    "labelEs": "Correo",
    "isAllowed": false
  },
  "vitamins": {
    "apiKey": "vitamins",
    "labelEs": "Vitaminas",
    "isAllowed": true
  },
  "healing": {
    "apiKey": "healing",
    "labelEs": "Objetos curativos",
    "isAllowed": true
  },
  "pp-recovery": {
    "apiKey": "pp-recovery",
    "labelEs": "Recuperación de PP",
    "isAllowed": true
  },
  "revival": {
    "apiKey": "revival",
    "labelEs": "Objetos para revivir",
    "isAllowed": true
  },
  "status-cures": {
    "apiKey": "status-cures",
    "labelEs": "Cura estados alterados",
    "isAllowed": true
  },
  "mulch": {
    "apiKey": "mulch",
    "labelEs": "Abono",
    "isAllowed": true
  },
  "special-balls": {
    "apiKey": "special-balls",
    "labelEs": "Poké Balls especiales",
    "isAllowed": true
  },
  "standard-balls": {
    "apiKey": "standard-balls",
    "labelEs": "Poké Balls comunes",
    "isAllowed": true
  },
  "dex-completion": {
    "apiKey": "dex-completion",
    "labelEs": "Fósiles",
    "isAllowed": true
  },
  "scarves": {
    "apiKey": "scarves",
    "labelEs": "Pañuelos",
    "isAllowed": true
  },
  "all-machines": {
    "apiKey": "all-machines",
    "labelEs": "MTs",
    "isAllowed": true
  },
  "flutes": {
    "apiKey": "flutes",
    "labelEs": "Flautas",
    "isAllowed": true
  },
  "apricorn-balls": {
    "apiKey": "apricorn-balls",
    "labelEs": "Poké Balls de Bonguri",
    "isAllowed": true
  },
  "apricorn-box": {
    "apiKey": "apricorn-box",
    "labelEs": "Bonguris",
    "isAllowed": true
  },
  "data-cards": {
    "apiKey": "data-cards",
    "labelEs": "Cartas",
    "isAllowed": false
  },
  "jewels": {
    "apiKey": "jewels",
    "labelEs": "Joyas",
    "isAllowed": true
  },
  "miracle-shooter": {
    "apiKey": "miracle-shooter",
    "labelEs": "-",
    "isAllowed": false
  },
  "mega-stones": {
    "apiKey": "mega-stones",
    "labelEs": "Megapiedras",
    "isAllowed": true
  },
  "memories": {
    "apiKey": "memories",
    "labelEs": "Discos de Silvally",
    "isAllowed": true
  },
  "z-crystals": {
    "apiKey": "z-crystals",
    "labelEs": "Cristales Z",
    "isAllowed": true
  },
  "species-candies": {
    "apiKey": "species-candies",
    "labelEs": "Caramelos de especie",
    "isAllowed": false
  },
  "catching-bonus": {
    "apiKey": "catching-bonus",
    "labelEs": "Bayas para captura",
    "isAllowed": false
  },
  "dynamax-crystals": {
    "apiKey": "dynamax-crystals",
    "labelEs": "Cristales Dinamax",
    "isAllowed": false
  },
  "nature-mints": {
    "apiKey": "nature-mints",
    "labelEs": "Mentas",
    "isAllowed": true
  },
  "curry-ingredients": {
    "apiKey": "curry-ingredients",
    "labelEs": "Ingredientes para curry",
    "isAllowed": false
  },
  "tera-shard": {
    "apiKey": "tera-shard",
    "labelEs": "Fragmentos de Teracristal",
    "isAllowed": true
  },
  "sandwich-ingredients": {
    "apiKey": "sandwich-ingredients",
    "labelEs": "Ingredientes para bocadillos",
    "isAllowed": false
  },
  "tm-materials": {
    "apiKey": "tm-materials",
    "labelEs": "Materiales para MTs",
    "isAllowed": false
  },
  "picnic": {
    "apiKey": "picnic",
    "labelEs": "Objetos de picnic",
    "isAllowed": false
  }
};

export function normalizeCategoryItemKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getCategoryItemMeta(input)
{
  const key = normalizeCategoryItemKey(input);
  return (key && CATEGORY_ITEM_META[key])
    ? CATEGORY_ITEM_META[key]
    : CATEGORY_ITEM_META.unknown;
}

export function getCategoryItemLabelEs(input)
{
  return getCategoryItemMeta(input)?.labelEs || "Categoría Desconocida";
}

export function getCategoryItemIsAllowed(input)
{
  return !!getCategoryItemMeta(input)?.isAllowed;
}
// ------- CATEGORIAS - FIN ------- 

// ------- ATRIBUTOS - INICIO ------- 
// https://pokeapi.co/api/v2/item-attribute?limit=9999
export const ATTRIBUTES_ITEM_EN_TO_ES_MAP =
{
  "unknown": "Atributo Desconocido",
  "countable": "Acumulable en la bolsa",
  "consumable": "Consumible de un solo uso",
  "usable-overworld": "Usable fuera del combate",
  "usable-in-battle": "Usable en combate",
  "holdable": "Equipable por un Pokémon",
  "holdable-passive": "Efecto pasivo al equiparse",
  "holdable-active": "Puede activarse o consumirse en combate",
  "underground": "Disponible en el Subsuelo de Sinnoh"
};

export function normalizeAttributeItemKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getAttributeItemLabelEs(input)
{
  const raw = normalizeAttributeItemKey(input);
  if (!raw) return "Atributo Desconocido";

  return ATTRIBUTES_ITEM_EN_TO_ES_MAP[raw] || "Atributo Desconocido";
}
// ------- ATRIBUTOS - FIN ------- 

// ---------------- DATOS META DE OBJETOS/ITEMS - FIN ---------------- 


// ---------------- DATOS META DE ESTADOS ALTERADOS - INICIO ----------------
// #region ST. ALTERADOS

// https://pokeapi.co/api/v2/move-ailment?limit=9999
export const STATUSES_ALTERED_META =
{
  "unknown": {
    "apiKey": null,
    "labelEs": "Estado Alterado Desconocido",
    "nameEs": "Estado Alterado Desconocido",
    "icon": null,
    "conector": ""
  },
  "none": {
    "apiKey": "none",
    "labelEs": "Ninguno",
    "nameEs": "Ninguno",
    "icon": null,
    "conector": ""
  },
  "paralysis": {
    "apiKey": "paralysis",
    "labelEs": "Parálisis",
    "nameEs": "Parálisis",
    "icon": null,
    "conector": "de"
  },
  "sleep": {
    "apiKey": "sleep",
    "labelEs": "Sueño",
    "nameEs": "Sueño",
    "icon": null,
    "conector": "de"
  },
  "freeze": {
    "apiKey": "freeze",
    "labelEs": "Congelado",
    "nameEs": "Congelado",
    "icon": null,
    "conector": ""
  },
  "burn": {
    "apiKey": "burn",
    "labelEs": "Quemado",
    "nameEs": "Quemado",
    "icon": null,
    "conector": ""
  },
  "poison": {
    "apiKey": "poison",
    "labelEs": "Envenenado",
    "nameEs": "Envenenado",
    "icon": null,
    "conector": ""
  },
  "confusion": {
    "apiKey": "confusion",
    "labelEs": "Confusión",
    "nameEs": "Confusión",
    "icon": null,
    "conector": "de"
  },
  "infatuation": {
    "apiKey": "infatuation",
    "labelEs": "Enamoramiento",
    "nameEs": "Enamoramiento",
    "icon": null,
    "conector": "de"
  },
  "trap": {
    "apiKey": "trap",
    "labelEs": "Atrapado",
    "nameEs": "Atrapado",
    "icon": null,
    "conector": ""
  },
  "nightmare": {
    "apiKey": "nightmare",
    "labelEs": "Maldito",
    "nameEs": "Maldito",
    "icon": null,
    "conector": ""
  },
  "torment": {
    "apiKey": "torment",
    "labelEs": "Atormentado",
    "nameEs": "Atormentado",
    "icon": null,
    "conector": ""
  },
  "disable": {
    "apiKey": "disable",
    "labelEs": "Anulación",
    "nameEs": "Anulación",
    "icon": null,
    "conector": "de"
  },
  "yawn": {
    "apiKey": "yawn",
    "labelEs": "Bostezo",
    "nameEs": "Bostezo",
    "icon": null,
    "conector": "de"
  },
  "heal-block": {
    "apiKey": "heal-block",
    "labelEs": "Anticuración",
    "nameEs": "Anticuración",
    "icon": null,
    "conector": "de"
  },
  "no-type-immunity": {
    "apiKey": "no-type-immunity",
    "labelEs": "Sin inmunidad de tipo",
    "nameEs": "Sin inmunidad de tipo",
    "icon": null,
    "conector": ""
  },
  "leech-seed": {
    "apiKey": "leech-seed",
    "labelEs": "Drenadoras",
    "nameEs": "Drenadoras",
    "icon": null,
    "conector": ""
  },
  "embargo": {
    "apiKey": "embargo",
    "labelEs": "Embargo",
    "nameEs": "Embargo",
    "icon": null,
    "conector": "de"
  },
  "perish-song": {
    "apiKey": "perish-song",
    "labelEs": "Canto Mortal",
    "nameEs": "Canto Mortal",
    "icon": null,
    "conector": "de"
  },
  "ingrain": {
    "apiKey": "ingrain",
    "labelEs": "Arraigo",
    "nameEs": "Arraigo",
    "icon": null,
    "conector": "de"
  }
};

export function normalizeStatusesAlteredKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getStatusesAlteredMeta(input)
{
  const key = normalizeStatusesAlteredKey(input);
  return (key && STATUSES_ALTERED_META[key])
    ? STATUSES_ALTERED_META[key]
    : STATUSES_ALTERED_META.unknown;
}

export function getStatusesAltereLabelEs(input)
{
  return getStatusesAlteredMeta(input)?.labelEs || "Estado Alterado Desconocido";
}

export function getStatusesAltereConector(input)
{
  return getStatusesAlteredMeta(input)?.conector || "";
}

export function getStatusesAltereNameEs(input)
{
  return getStatusesAlteredMeta(input)?.nameEs || "Estado Alterado Desconocido";
}
// ---------------- DATOS META DE ESTADOS ALTERADOS - FIN ---------------- 


// ---------------- DATOS META DE DEBILIDADES Y RESISTENCIAS - INICIO ----------------
// #region DYR MATRIX

export const LEVEL_OF_WEAKNESS =
{
  "x4": {
    "labelEs": "Hipereficaz",
    "color": "#bf0a00"
  },
  "x3": {
    "labelEs": "Hipereficaz (x3)",
    "color": "#990800ff"
  },
  "x2": {
    "labelEs": "Supereficaz",
    "color": "#c76700"
  },
  "x1.5": {
    "labelEs": "Eficaz",
    "color": "#9b5000ff"
  },
  "x1": {
    "labelEs": "Neutro",
    "color": "#55606b"
  },
  "x0.5": {
    "labelEs": "Poco eficaz",
    "color": "#007dc5"
  },
  "x0.25": {
    "labelEs": "Muy poco eficaz",
    "color": "#00b020"
  },
  "x0": {
    "labelEs": "Inmune",
    "color": "#ffffff"
  }
};

export function normalizeWeaknessKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getLevelOfWeaknessMeta(input)
{
  const key = normalizeWeaknessKey(input);
  return (key && LEVEL_OF_WEAKNESS[key])
    ? LEVEL_OF_WEAKNESS[key]
    : LEVEL_OF_WEAKNESS["x1"];
}

export function getLevelOfWeaknessLabelEs(input)
{
  return getLevelOfWeaknessMeta(input)?.labelEs || "Neutro";
}

export function getLevelOfWeaknessColor(input)
{
  return getLevelOfWeaknessMeta(input)?.color || LEVEL_OF_WEAKNESS["x1"].color;
}

export const DAMAGE_MATRIX =
{
  // Tipo de Movimiento -> Efectividad contra Tipo de Pokémon
  // Ej: Normal (movimiento) es 0.5x contra Roca, 0x contra Fantasma, 0.5x contra Acero. Para el resto de tipos es Neutro (x1)
  "normal": { "rock": 0.5, "ghost": 0, "steel": 0.5 },
  "fire": { "fire": 0.5, "water": 0.5, "grass": 2, "ice": 2, "bug": 2, "rock": 0.5, "dragon": 0.5, "steel": 2 },
  "water": { "fire": 2, "water": 0.5, "grass": 0.5, "ground": 2, "rock": 2, "dragon": 0.5 },
  "electric": { "water": 2, "electric": 0.5, "grass": 0.5, "ground": 0, "flying": 2, "dragon": 0.5 },
  "grass": { "fire": 0.5, "water": 2, "grass": 0.5, "poison": 0.5, "ground": 2, "flying": 0.5, "bug": 0.5, "rock": 2, "dragon": 0.5, "steel": 0.5 },
  "ice": { "fire": 0.5, "water": 0.5, "grass": 2, "ice": 0.5, "ground": 2, "flying": 2, "dragon": 2, "steel": 0.5 },
  "fighting": { "normal": 2, "ice": 2, "rock": 2, "dark": 2, "steel": 2, "poison": 0.5, "flying": 0.5, "psychic": 0.5, "bug": 0.5, "ghost": 0, "fairy": 0.5 },
  "poison": { "grass": 2, "poison": 0.5, "ground": 0.5, "rock": 0.5, "ghost": 0.5, "steel": 0, "fairy": 2 },
  "ground": { "fire": 2, "electric": 2, "poison": 2, "rock": 2, "steel": 2, "grass": 0.5, "bug": 0.5, "flying": 0 },
  "flying": { "grass": 2, "fighting": 2, "bug": 2, "electric": 0.5, "rock": 0.5, "steel": 0.5 },
  "psychic": { "fighting": 2, "poison": 2, "psychic": 0.5, "steel": 0.5, "dark": 0 },
  "bug": { "grass": 2, "psychic": 2, "dark": 2, "fire": 0.5, "fighting": 0.5, "poison": 0.5, "flying": 0.5, "ghost": 0.5, "steel": 0.5, "fairy": 0.5 },
  "rock": { "fire": 2, "ice": 2, "flying": 2, "bug": 2, "fighting": 0.5, "ground": 0.5, "steel": 0.5 },
  "ghost": { "psychic": 2, "ghost": 2, "dark": 0.5, "normal": 0 },
  "dragon": { "dragon": 2, "steel": 0.5, "fairy": 0 },
  "dark": { "psychic": 2, "ghost": 2, "fighting": 0.5, "dark": 0.5, "fairy": 0.5 },
  "steel": { "rock": 2, "ice": 2, "fairy": 2, "fire": 0.5, "water": 0.5, "electric": 0.5, "steel": 0.5 },
  "fairy": { "fighting": 2, "dragon": 2, "dark": 2, "fire": 0.5, "poison": 0.5, "steel": 0.5 },
};

// Forma Base de las habilidades con efecto especial sobre Debilidades y Resistencias.
// #region HABILIDAD
/*

  "nombre-ApiKey":
  {
    "apiKey": "nombre-ApiKey",                                              //** 1) Texto: Api Key real de la habilidad para Poke API.
    "labelEs": "Nombre ES",                                                 //** 2) Texto: Display en Español.
    "damageImmunities": ["water", "fire", ...],                             //** 3) Arrego de tipos a los que es inmune, guarda la apikey real. Ej: "water", "fire", etc.
    "healsOnHit": [ { "water": 0.25 }, { "fire": 0.5 }, ... ],              //** 4) Arreglo de tipos que curan con el procentaje de vida que se cura al recibir un ataque de ese type.
    "redirects": ["water"],                                                 //** 5) Arreglo de tipos de movs que atrae el poseedor de la habilidad. Ej: "water", "fire", etc.
    "damageWeaknesses": [                                                   //** 6) Arreglo de tipos a los que genera una debilidad, con el multiplicador de daño.
      { "triggerType": "fighting", "mult": 2 },
      { "triggerType": "ground", "mult": 2 }
    ],
    "damageResistances": [                                                  //** 7) Arreglo de tipos a los que genera una resistencia, con el multiplicador de daño.
      { "triggerType": "ground", "mult": 0.5 },
      { "triggerType": "ice", "mult": 0.5 }
    ],
    "statBoosts": [                                                         //** 8) Arreglo de estadísticas que se aumentan al recibir un ataque de un tipo específico, junto con la cantidad de niveles que se aumentan (+1, +2, etc).
      { "triggerType": "grass", "stat": "defense", "stages": 2 },
      { "triggerType": "electric", "stat": "special-attack", "stages": 1 }
    ],
    "moveBoosts": [ { "fire": 1.5 } ],                                      //** 9) Arreglo de tipos de movimientos que se potencian, al recibir un movimiento de ese mismo tipo, con el porcentaje de aumento de daño (1.5 = 50% más de daño, 2 = 100% más de daño, etc.).
    "statusImmunities": [                                                   //** 10) Arreglo de estados alterados a los que es inmune, si es "all", es inmune a todos los estados alterados
      "burn"
    ],
    "statusEffectOverrides": [                                              //** 11) Arreglo Estados cuyos efectos se modifican.
      { "burn": "1/32 de PS por turno" },
      { "poison": "1/8 de PS por turno" }
    ],
    "superEffectiveModifier": 0.75/null,                                    //** 12) Valor numerico, que modifica daño supereficaz al valor ingresado. Si es null, no hace efecto. Ej: 0.75 = 25% (1/4) menos de daño, 1.5 = 50% más de daño, etc.
    "onlySuperEffectiveDamage": false/true,                                 //** 13) Booleano: Si es true, solo es debil a movs eficaces. Si es false, no hace efecto. El unico Pokemon con esta habilidad es Shedinja, que solo es debil a movs supereficaces.
    "damageToHalfAtFullHP": false/true,                                     //** 14) Booleano: Si es true, convierte todo el daño recibido en poco eficaz (x0.5) cuando posee PS al 100%. Si es false, no hace efecto. Es la habilidad de Terapagos.
    "superEffectiveModifierAtFullHP": false/true,                           //** 15) Booleano: Si es true, reduce a la mitad el daño recibido de los movimientos supereficaces cuando posee los PS al máximo. Si es false, no hace efecto. Ej: Multiescamas de Dragonite.
    "weaknessToHalfForTypes": ["flying"],                                   //** 16) Arreglo de tipos, cuyas debilidades se reducen a la mitad mientras el poseedor de la habilidad este en el campo de batalla. Ej: Rafaga Delta de Mega-Rayquaza, que reduce a la mitad la debilidad a movs de tipo Volador mientras el poseedor de la habilidad este en el campo de batalla.
    "contactHalfDamage": true/false                                         //** 17) Booleano: Si es true, los moviminetos que son de contacto hacen la mitad de daño. Si es false no hace efecto. Ej: Peluche.
  },

*/
export const ABILITIES_WITH_EFFECT_META =
{
  "unknown": {
    "apiKey": null,
    "labelEs": "Habilidad Desconocida",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "water-absorb": {
    "apiKey": "water-absorb",
    "labelEs": "Absorbe Agua",
    "damageImmunities": ["water"],
    "healsOnHit": [ { "water": 0.25 } ],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "volt-absorb": {
    "apiKey": "volt-absorb",
    "labelEs": "Absorbe Electricidad",
    "damageImmunities": ["electric"],
    "healsOnHit": [ { "electric": 0.25 } ],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "flash-fire": {
    "apiKey": "flash-fire",
    "labelEs": "Absorbe Fuego",
    "damageImmunities": ["fire"],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [ { "fire": 1.5 } ],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "storm-drain": {
    "apiKey": "storm-drain",
    "labelEs": "Colector",
    "damageImmunities": ["water"],
    "healsOnHit": [ { "water": 0.25 } ],
    "redirects": ["water"],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [ { "triggerType": "water", "stat": "special-attack", "stages": 1 } ],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "lightning-rod": {
    "apiKey": "lightning-rod",
    "labelEs": "Pararrayos",
    "damageImmunities": ["electric"],
    "healsOnHit": [],
    "redirects": ["electric"],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [ { "triggerType": "electric", "stat": "special-attack", "stages": 1 } ],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "earth-eater": {
    "apiKey": "earth-eater",
    "labelEs": "Geofagia",
    "damageImmunities": ["ground"],
    "healsOnHit": [{ "ground": 0.25 }],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "levitate": {
    "apiKey": "levitate",
    "labelEs": "Levitación",
    "damageImmunities": ["ground"],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "well-baked-body": {
    "apiKey": "well-baked-body",
    "labelEs": "Cuerpo Horneado",
    "damageImmunities": ["fire"],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [ { "triggerType": "fire", "stat": "defense", "stages": 2 } ],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "thick-fat": {
    "apiKey": "thick-fat",
    "labelEs": "Sebo",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [
      { "triggerType": "fire", "mult": 0.5 },
      { "triggerType": "ice", "mult": 0.5 }
    ],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "heatproof": {
    "apiKey": "heatproof",
    "labelEs": "Ignífugo",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [ { "triggerType": "fire", "mult": 0.5 } ],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [ { "burn": "pierde 1/32 de sus PS máximos en cada turno" } ],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "water-bubble": {
    "apiKey": "water-bubble",
    "labelEs": "Pompa",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [ { "triggerType": "fire", "mult": 0.5 } ],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": ["burn"],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "purifying-salt": {
    "apiKey": "purifying-salt",
    "labelEs": "Sal Purificadora",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [ { "triggerType": "ghost", "mult": 0.5 } ],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": ["all"],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "filter": {
    "apiKey": "filter",
    "labelEs": "Filtro",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": 0.75,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "wonder-guard": {
    "apiKey": "wonder-guard",
    "labelEs": "Superguarda",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": true,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "tera-shell": {
    "apiKey": "tera-shell",
    "labelEs": "Teracaparazón",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": true,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "delta-stream": {
    "apiKey": "delta-stream",
    "labelEs": "Ráfaga Delta",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": ["flying"],
    "contactHalfDamage": false
  },
  "motor-drive": {
    "apiKey": "motor-drive",
    "labelEs": "Electromotor",
    "damageImmunities": ["electric"],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [ { "triggerType": "electric", "stat": "special-attack", "stages": 1 } ],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "dry-skin": {
    "apiKey": "dry-skin",
    "labelEs": "Piel Seca",
    "damageImmunities": ["water"],
    "healsOnHit": [ { "water": 0.25 } ],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "fluffy": {
    "apiKey": "fluffy",
    "labelEs": "Peluche",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [ { "triggerType": "fire", "mult": 2 } ],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": true
  },
  "sap-sipper": {
    "apiKey": "sap-sipper",
    "labelEs": "Herbívoro",
    "damageImmunities": ["grass"],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [ { "triggerType": "grass", "stat": "attack", "stages": 1 } ],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "solid-rock": {
    "apiKey": "solid-rock",
    "labelEs": "Roca Sólida",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": 0.75,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "multiscale": {
    "apiKey": "multiscale",
    "labelEs": "Multiescamas",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": true,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "prism-armor": {
    "apiKey": "prism-armor",
    "labelEs": "Armadura Prisma",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": 0.75,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": false,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  },
  "shadow-shield": {
    "apiKey": "shadow-shield",
    "labelEs": "Guardia Espectro",
    "damageImmunities": [],
    "healsOnHit": [],
    "redirects": [],
    "damageWeaknesses": [],
    "damageResistances": [],
    "statBoosts": [],
    "moveBoosts": [],
    "statusImmunities": [],
    "statusEffectOverrides": [],
    "superEffectiveModifier": null,
    "onlySuperEffectiveDamage": false,
    "damageToHalfAtFullHP": false,
    "superEffectiveModifierAtFullHP": true,
    "weaknessToHalfForTypes": [],
    "contactHalfDamage": false
  }
};

export function normalizeAbilityKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getAbilityEffectMeta(input)
{
  const key = normalizeAbilityKey(input);
  return (key && ABILITIES_WITH_EFFECT_META[key])
    ? ABILITIES_WITH_EFFECT_META[key]
    : ABILITIES_WITH_EFFECT_META.unknown;
}

function getAbilityEffectMetaField(input, field, fallback)
{
  const meta = getAbilityEffectMeta(input);
  const value = meta?.[field];

  return value !== undefined ? value : fallback;
}

export function getAbilityApiKey(input)
{
  return getAbilityEffectMetaField(input, "apiKey", null);
}

export function getAbilityLabelEs(input)
{
  return getAbilityEffectMetaField(input, "labelEs", "Habilidad Desconocida");
}

export function getAbilityDamageImmunities(input)
{
  return getAbilityEffectMetaField(input, "damageImmunities", []);
}

export function getAbilityHealsOnHit(input)
{
  return getAbilityEffectMetaField(input, "healsOnHit", []);
}

export function getAbilityRedirects(input)
{
  return getAbilityEffectMetaField(input, "redirects", []);
}

export function getAbilityDamageWeaknesses(input)
{
  return getAbilityEffectMetaField(input, "damageWeaknesses", []);
}

export function getAbilityDamageResistances(input)
{
  return getAbilityEffectMetaField(input, "damageResistances", []);
}

export function getAbilityStatBoosts(input)
{
  return getAbilityEffectMetaField(input, "statBoosts", []);
}

export function getAbilityMoveBoosts(input)
{
  return getAbilityEffectMetaField(input, "moveBoosts", []);
}

export function getAbilityStatusImmunities(input)
{
  return getAbilityEffectMetaField(input, "statusImmunities", []);
}

export function getAbilityStatusEffectOverrides(input)
{
  return getAbilityEffectMetaField(input, "statusEffectOverrides", []);
}

export function getAbilitySuperEffectiveModifier(input)
{
  return getAbilityEffectMetaField(input, "superEffectiveModifier", null);
}

export function getAbilityOnlySuperEffectiveDamage(input)
{
  return getAbilityEffectMetaField(input, "onlySuperEffectiveDamage", false);
}

export function getAbilityDamageToHalfAtFullHP(input)
{
  return getAbilityEffectMetaField(input, "damageToHalfAtFullHP", false);
}

export function getAbilitySuperEffectiveModifierAtFullHP(input)
{
  return getAbilityEffectMetaField(input, "superEffectiveModifierAtFullHP", false);
}

export function getAbilityWeaknessToHalfForTypes(input)
{
  return getAbilityEffectMetaField(input, "weaknessToHalfForTypes", []);
}

export function getAbilityContactHalfDamage(input)
{
  return getAbilityEffectMetaField(input, "contactHalfDamage", false);
}
// ---------------- DATOS META DE DEBILIDADES Y RESISTENCIAS - FIN ---------------- 


// ---------------- DATOS META FORMAS REGIONALES - INICIO ---------------- 
//#region FORMAS REGIONALES

export const REGION_DISPLAY_META =
{
  "galar": "Galar",
  "alola": "Alola",
  "hisui": "Hisui",
  "paldea": "Paldea",
};

export function getPokemonRegionKeys()
{
  return Object.keys(REGION_DISPLAY_META || {});
}

export function getPokemonRegionDisplayName(regionKey)
{
  const key = String(regionKey || "").toLowerCase().trim();
  return (key && REGION_DISPLAY_META[key])
    ? REGION_DISPLAY_META[key]
    : "";
}
// ---------------- DATOS META FORMAS REGIONALES - FIN ---------------- 


// ---------------- DATOS META DE NOMBRES POKÉMON - INICIO ---------------- 
//#region NOMBRES PKM

export function normalizePokemonText(input)
{
  return String(input || "")
    .toLowerCase()
    .replace(/♀/g, " female ")
    .replace(/♂/g, " male ")
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export const DISPLAY_ES_NAME_SPECIAL_PKM_BY_KEY =
{
  // Formas Paradoja
  "iron-boulder": "Ferromole",
  "iron-bundle": "Ferrosaco",
  "iron-crown": "Ferrotesta",
  "iron-hands": "Ferropalmas",
  "iron-jugulis": "Ferrocuello",
  "iron-leaves": "Ferroverdor",
  "iron-moth": "Ferropolilla",
  "iron-thorns": "Ferropúas",
  "iron-treads": "Ferrodada",
  "iron-valiant": "Ferropaladín",
  "roaring-moon": "Bramaluna",
  "walking-wake": "Ondulagua",
  "sandy-shocks": "Pelarena",
  "flutter-mane": "Melenaleteo",
  "brute-bonnet": "Furioseta",
  "scream-tail": "Colagrito",
  "slither-wing": "Reptalada",
  "great-tusk": "Colmilargo",
  "raging-bolt": "Electrofuria",
  "gouging-fire": "Flamariete",

  // Greninga Ash
  "greninja-ash": "Greninja Ash",

  // Formas Darmanitan
  "darmanitan-galar-standard": "Darmanitan de Galar",
  "darmanitan-galar-zen": "Darmanitan de Galar Modo Daruma",
  "darmanitan-standard": "Darmanitan",
  "darmanitan-zen": "Darmanitan Modo Daruma",

  // Formas Terapagos
  "terapagos": "Terapagos",
  "terapagos-terastal": "Terapagos Forma Teracristal",
  "terapagos-stellar": "Terapagos Forma Astral",

  // Formas Floette
  "floette-eternal": "Floette Flor eterna",
  "flabebe": "Flabebé",

  // Formas Tauros
  "tauros-paldea-aqua-breed": "Tauros de Paldea variedad acuática",
  "tauros-paldea-blaze-breed": "Tauros de Paldea variedad ardiente",
  "tauros-paldea-combat-breed": "Tauros de Paldea variedad combatiente",

  // Formas Ursaluna
  "ursaluna": "Ursaluna",
  "ursaluna-bloodmoon": "Ursaluna Luna Carmesí",

  // Formas Gimmighoul
  "gimmighoul": "Gimmighoul Forma Cofre",
  "gimmighoul-roaming": "Gimmighoul Forma Andante",

  // Formas Maushold
  "maushold-family-of-four": "Maushold",
  "maushold-family-of-three": "Maushold Familia de Tres",

  // Formas Zarude
  "zarude": "Zarude",
  "zarude-dada": "Zarude Papá/Dada",

  // Formas Toxtricity
  "toxtricity-amped": "Toxtricity Forma Aguda",
  "toxtricity-low-key": "Toxtricity Forma Grave",

  // Formas Ogerpon
  "ogerpon": "Ogerpon Máscara Turquesa",
  "ogerpon-wellspring-mask": "Ogerpon Máscara Fuente",
  "ogerpon-hearthflame-mask": "Ogerpon Máscara Horno",
  "ogerpon-cornerstone-mask": "Ogerpon Máscara Cimiento",

  // Formas Urshifu
  "urshifu-single-strike": "Urshifu Estilo Brusco",
  "urshifu-rapid-strike": "Urshifu Estilo Fluido",

  // Formas Calyrex
  "calyrex-ice": "Calyrex Jinete Glacial",
  "calyrex-shadow": "Calyrex Jinete Espectral",

  // Formas Oricorio
  "oricorio-baile": "Oricorio Estilo Apasionado",
  "oricorio-pom-pom": "Oricorio Estilo Animado",
  "oricorio-pau": "Oricorio Estilo Plácido",
  "oricorio-sensu": "Oricorio Estilo Refinado",
  
  // Formas Castform
  "castform": "Castform",
  "castform-rainy": "Castform Forma Lluvia",
  "castform-snowy": "Castform Forma Nieve",
  "castform-sunny": "Castform Forma Sol",

  // Formas Hoopa
  "hoopa": "Hoopa contenido",
  "hoopa-unbound": "Hoopa desatado",

  // Nombre Keldeo
  "keldeo-ordinary": "Keldeo",

  // Nombres de Frillish y Evos
  "frillish-male": "Frillish",
  "jellicent-male": "Jellicent",

  "pyroar-male": "Pyroar",

  // Formas Kyurem
  "kyurem-white": "Kyurem Blanco",
  "kyurem-black": "Kyurem Negro",

  // Formas Shaymin
  "shaymin-land": "Shaymin Forma Tierra",
  "shaymin-sky": "Shaymin Forma Cielo",

  // Formas Dialga, Palkia y Giratina
  "dialga-origin": "Dialga Forma Origen",
  "palkia-origin": "Palkia Forma Origen",
  "giratina-altered": "Giratina",
  "giratina-origin": "Giratina Forma Origen",

  // Formas Rotom
  "rotom-heat": "Rotom Forma Calor",
  "rotom-wash": "Rotom Forma Lavado",
  "rotom-frost": "Rotom Forma Frío",
  "rotom-fan": "Rotom Forma Ventilador",
  "rotom-mow": "Rotom Forma Corte",

  // Formas Zacian y Zamazenta
  "zacian-crowned": "Zacian Espada Suprema",
  "zamazenta-crowned": "Zamazenta Escudo Supremo",

  // Formas Necrozma
  "necrozma-dusk": "Necrozma melena crepuscular",
  "necrozma-dawn": "Necrozma alas del alba",
  "necrozma-ultra": "Ultra-Necrozma",

  // Formas Zygarde
  "zygarde-10": "Zygarde al 10%",
  "zygarde-50": "Zygarde al 50%",
  "zygarde-complete": "Zygarde Completo",

  // Formas Eiscue
  "eiscue-ice": "Eiscue Cara de Hielo",
  "eiscue-noice": "Eiscue Cara Deshielo",

  // Formas Wishiwashi
  "wishiwashi-solo": "Wishiwashi Forma individual",
  "wishiwashi-school": "Wishiwashi Forma Banco",

  // Formas Aegislash
  "aegislash-shield": "Aegislash Forma Escudo",
  "aegislash-blade": "Aegislash Forma Filo",

  // Formas Meloetta
  "meloetta-aria": "Meloetta Forma Lírica",
  "meloetta-pirouette": "Meloetta Forma Danza",

  // Formas Kyogre y Groudon
  "kyogre-primal": "Kyogre Primigenio",
  "groudon-primal": "Groudon Primigenio",

  // Formas Wormadam
  "wormadam-plant": "Wormadam Tronco Planta",
  "wormadam-sandy": "Wormadam Tronco Arena",
  "wormadam-trash": "Wormadam Tronco Basura",

  // Formas Basculin
  "basculin-red-striped": "Basculin Raya Roja",
  "basculin-blue-striped": "Basculin Raya Azul",
  "basculin-white-striped": "Basculin Raya Blanca",

  // Formas Basculegion
  "basculegion-male": "Basculegion ♂",
  "basculegion-female": "Basculegion ♀",

  // Forma Dudunsparce
  "dudunsparce-two-segment": "Dudunsparce",

  // Formas Tatsugiri
  "tatsugiri-curly": "Tatsugiri",
  "tatsugiri-droopy": "Tatsugiri Forma Lánguida",
  "tatsugiri-stretchy": "Tatsugiri Forma Recta",

  // Formas Squawkabilly
  "squawkabilly-green-plumage": "Squawkabilly Plumaje Verde",
  "squawkabilly-blue-plumage": "Squawkabilly Plumaje Azul",
  "squawkabilly-yellow-plumage": "Squawkabilly Plumaje Amarillo",
  "squawkabilly-white-plumage": "Squawkabilly Plumaje Blanco",

  // Formas Meowstic
  "meowstic-male": "Meowstic ♂",
  "meowstic-female": "Meowstic ♀",

  // Formas Pumpkaboo
  "pumpkaboo-average": "Pumpkaboo Tamaño Normal",
  "pumpkaboo-small": "Pumpkaboo Tamaño Pequeño",
  "pumpkaboo-large": "Pumpkaboo Tamaño Grande",
  "pumpkaboo-super": "Pumpkaboo Tamaño Extragrande",

  // Formas Gourgeist
  "gourgeist-average": "Gourgeist Tamaño Normal",
  "gourgeist-small": "Gourgeist Tamaño Pequeño",
  "gourgeist-large": "Gourgeist Tamaño Grande",
  "gourgeist-super": "Gourgeist Tamaño Extragrande",

  // Formas Mimikyu
  "mimikyu-disguised": "Mimikyu",

  // Formas Minior
  "minior-red-meteor": "Minior Forma Meteorito",
  "minior-red": "Minior Núcleo Rojo",
  "minior-orange": "Minior Núcleo Naranja",
  "minior-yellow": "Minior Núcleo Amarillo",
  "minior-green": "Minior Núcleo Verde",
  "minior-blue": "Minior Núcleo Azul",
  "minior-indigo": "Minior Núcleo Añil",
  "minior-violet": "Minior Núcleo Violeta",

  // Formas Morpeko
  "morpeko-full-belly": "Morpeko",

  // Formas Palafin
  "palafin-zero": "Palafin Forma ingenua",
  "palafin-hero": "Palafin Forma Heroica",
  
  // Formas Magearna
  "magearna": "Magearna",
  "magearna-original": "Magearna Color Vetusto",

  "rockruff-own-tempo": "Rockruff",

  // Formas Lycanroc
  "lycanroc-midday": "Lycanroc Forma Diurna",
  "lycanroc-midnight": "Lycanroc Forma Nocturna",
  "lycanroc-dusk": "Lycanroc Forma Crepuscular",

  // Formas Genios
  "tornadus-incarnate": "Tornadus Forma Avatar",
  "tornadus-therian": "Tornadus Forma Tótem",

  "thundurus-incarnate": "Thundurus Forma Avatar",
  "thundurus-therian": "Thundurus Forma Tótem",

  "landorus-incarnate": "Landorus Forma Avatar",
  "landorus-therian": "Landorus Forma Tótem",

  "enamorus-incarnate": "Enamorus Forma Avatar",
  "enamorus-therian": "Enamorus Forma Tótem",

  // Codigo Cero
  "type-null": "Código Cero",

  // Formas Deoxys
  "deoxys-normal": "Deoxys Forma Normal",
  "deoxys-attack": "Deoxys Forma Ataque",
  "deoxys-defense": "Deoxys Forma Defensa",
  "deoxys-speed": "Deoxys Forma Velocidad",

  // Formas Indeedee
  "indeedee-male": "Indeedee ♂",
  "indeedee-female": "Indeedee ♀",

  // Nombres farfetchd y evos
  "farfetchd-galar": "Farfetch'd de Galar",
  "sirfetchd": "Sirfetch'd",
  "farfetchd": "Farfetch'd",

  // Formas Mr Mime y cadena evo
  "mime-jr": "Mime Jr.",
  "mr-mime": "Mr. Mime",
  "mr-mime-galar": "Mr. Mime de Galar",
  "mr-rime": "Mr. Rime",

  // Nombres Pokemon con guiones
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "jangmo-o": "Jangmo-O",
  "hakamo-o": "Hakamo-O",
  "kommo-o": "Kommo-O",

  // Formas Oinkologne
  "oinkologne-male": "Oinkologne ♂",
  "oinkologne-female": "Oinkologne ♀",

  // Nombres de las Calamidades Paldea
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",

  // Nombres Nidoran macho y hembra
  "nidoran-m": "Nidoran ♂",
  "nidoran-f": "Nidoran ♀"

};

export const KEY_BY_DISPLAY_PKM_META = Object.fromEntries(
  Object.entries(DISPLAY_ES_NAME_SPECIAL_PKM_BY_KEY).map(function([apiKey, displayEs])
  {
    return [normalizePokemonText(displayEs), apiKey];
  })
);

// Fixes para endpoint /pokemon/{name} - La pokedex devuelve species names, pero /pokemon usa "pokemon form names" en varios casos.
export const POKEMON_ENDPOINT_FIX_META =
{
  "mimikyu": "mimikyu-disguised",
  "morpeko": "morpeko-full-belly",
  "keldeo": "keldeo-ordinary",
  "frillish": "frillish-male",
  "jellicent": "jellicent-male",
  "pyroar": "pyroar-male",
  "giratina": "giratina-altered",
  "oricorio": "oricorio-baile",
  "rockruff-own-tempo": "rockruff"
};

function escapePokemonRegExp(text)
{
  return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function titleFromPokemonKey(key)
{
  return String(key || "")
    .split("-")
    .map(function(word)
    {
      return word ? word[0].toUpperCase() + word.slice(1) : word;

    })
    .join(" ");
}

function fallbackPokemonDisplayForKey(key)
{
  const rawKey = String(key || "").toLowerCase().trim();

  const megaDisplay = MEGA_DISPLAY_BY_KEY[rawKey];
  if (megaDisplay)
  {
    return megaDisplay;
  }

  const regionKeys = Object.keys(REGION_DISPLAY_META || {});
  const regionPattern = regionKeys.length ? regionKeys.map(escapePokemonRegExp).join("|") : "";

  if(!regionPattern)
  {
    return titleFromPokemonKey(key);
  }

  const m = String(key || "").match(new RegExp(`^(.*?)-(${regionPattern})$`));
  if(m)
  {
    const base = titleFromPokemonKey(m[1]);
    const regionDisplay = REGION_DISPLAY_META[m[2]];
    if (regionDisplay) return `${base} de ${regionDisplay}`;
  }

  return titleFromPokemonKey(key);
}

function buildPokemonRegionDisplayToKeyMap()
{
  const out = {};
  const entries = Object.entries(REGION_DISPLAY_META || {});

  for(let i = 0; i < entries.length; i++)
  {
    const regionKey = String(entries[i][0] || "").toLowerCase().trim();
    const regionDisplay = String(entries[i][1] || "").trim();

    if(regionKey)
    {
      out[normalizePokemonText(regionKey)] = regionKey;
    }

    if(regionDisplay)
    {
      out[normalizePokemonText(regionDisplay)] = regionKey;
    }
  }

  return out;
}

export function toPokemonDisplayName(key)
{
  return DISPLAY_ES_NAME_SPECIAL_PKM_BY_KEY[String(key || "").toLowerCase()] || fallbackPokemonDisplayForKey(key);
}

export function toPokemonApiKeyFromUserInput(raw)
{
  const n = normalizePokemonText(raw);
  if (!n) return "";

  if (KEY_BY_DISPLAY_PKM_META[n]) return KEY_BY_DISPLAY_PKM_META[n];

  const regionDisplayToKey = buildPokemonRegionDisplayToKeyMap();

  const m = n.match(/^(.*)\s+de\s+(.+)$/);
  if(m)
  {
    const base = m[1].trim().replace(/\s+/g, "-");
    const regionRaw = m[2].trim();
    const regionKey = regionDisplayToKey[regionRaw] || regionDisplayToKey[normalizePokemonText(regionRaw)] || null;

    if(regionKey)
    {
      return `${base}-${regionKey}`;
    }

  }

  return n.replace(/\s+/g, "-");
}

export function toPokemonEndpointName(apiName)
{
  const k = String(apiName || "").toLowerCase().trim();
  return POKEMON_ENDPOINT_FIX_META[k] || k;
}

export function slugifyPokemonForUrl(s)
{
  let t = normalizePokemonText(s);
  t = t.replace(/[\s\-]+/g, "_");
  t = t.replace(/[^a-z0-9_]/g, "");
  t = t.replace(/_+/g, "_");
  t = t.replace(/^_+|_+$/g, "");

  return t;
}
// ---------------- DATOS META DE NOMBRES POKÉMON - FIN ---------------- 


// ---------------- DATOS META DE COLORES POKÉMON - INICIO ---------------- 
//#region COLORES PKM

export const OFFICIAL_COLORS =
{
  "yellow": {
    "apiKey": "yellow",
    "labelEs": "Amarillo",
    "color": "#FFD700"
  },
  "blue": {
    "apiKey": "blue",
    "labelEs": "Azul",
    "color": "#0065FD"
  },
  "white": {
    "apiKey": "white",
    "labelEs": "Blanco",
    "color": "#FFFFFF"
  },
  "gray": {
    "apiKey": "gray",
    "labelEs": "Gris",
    "color": "#808080"
  },
  "brown": {
    "apiKey": "brown",
    "labelEs": "Marrón",
    "color": "#8B4513"
  },
  "purple": {
    "apiKey": "purple",
    "labelEs": "Morado",
    "color": "#800080"
  },
  "black": {
    "apiKey": "black",
    "labelEs": "Negro",
    "color": "#000000"
  },
  "red": {
    "apiKey": "red",
    "labelEs": "Rojo",
    "color": "#FF0000"
  },
  "pink": {
    "apiKey": "pink",
    "labelEs": "Rosa",
    "color": "#FF69B4"
  },
  "green": {
    "apiKey": "green",
    "labelEs": "Verde",
    "color": "#008000"
  }
};

export function normalizeColorKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getColorMeta(input)
{
  const key = normalizeColorKey(input);
  return (key && OFFICIAL_COLORS[key])
    ? OFFICIAL_COLORS[key]
    : {};
}

export function getColorLabelEs(input)
{
  return getColorMeta(input)?.labelEs || "Color Desconocido";
}

export function getColorColor(input)
{
  return getColorMeta(input)?.color || "#68A090";
}

export const COLOR_BY_KEY_PKM =
{
  "raichu": "yellow",
  "raichu-alola": "brown",

  "rattata": "purple",
  "rattata-alola": "black",

  "raticate": "brown",
  "raticate-alola": "black",

  "sandshrew": "yellow",
  "sandshrew-alola": "white",

  "sandslash": "yellow",
  "sandslash-alola": "blue",

  "vulpix": "brown",
  "vulpix-alola": "white",

  "ninetales": "yellow",
  "ninetales-alola": "blue",

  "grimer": "purple",
  "grimer-alola": "green",

  "muk": "purple",
  "muk-alola": "green",

  "marowak": "brown",
  "marowak-alola": "purple",

  "geodude": "brown",
  "geodude-alola": "gray",

  "graveler": "brown",
  "graveler-alola": "gray",

  "golem": "brown",
  "golem-alola": "gray",

  "meowth": "yellow",
  "persian": "yellow",

  "meowth-alola": "blue",
  "persian-alola": "blue",

  "meowth-galar": "brown",
  "perrserker": "brown",

  "mime-jr": "pink",
  "mr-mime": "pink",
  "mr-mime-galar": "white",
  "mr-rime": "purple",

  "darumaka": "red",
  "darumaka-galar": "white",

  "darmanitan-standard": "red",
  "darmanitan-zen": "blue",

  "darmanitan-galar-standard": "white",
  "darmanitan-galar-zen": "white",

  "charizard-mega-x": "black",

  "tatsugiri-curly": "red",
  "tatsugiri-curly-mega": "red",

  "tatsugiri-droopy": "pink",
  "tatsugiri-droopy-mega": "pink",

  "tatsugiri-stretchy": "yellow",
  "tatsugiri-stretchy-mega": "yellow",

  "articuno": "blue",
  "articuno-galar": "purple",

  "moltres": "yellow",
  "moltres-galar": "red",

  "stunfisk": "brown",
  "stunfisk-galar": "green",

  "ponyta": "yellow",
  "ponyta-galar": "white",

  "rapidash": "yellow",
  "rapidash-galar": "white",

  "weezing": "purple",
  "weezing-galar": "gray",

  "corsola": "pink",
  "corsola-galar": "white",

  "zigzagoon": "brown",
  "zigzagoon-galar": "white",

  "braviary": "red",
  "braviary-hisui": "white",

  "wooper": "blue",
  "wooper-paldea": "brown",

  "tauros": "brown",
  "tauros-paldea-aqua-breed": "black",
  "tauros-paldea-blaze-breed": "black",
  "tauros-paldea-combat-breed": "black",

  "castform": "gray",
  "castform-sunny": "red",
  "castform-rainy": "blue",
  "castform-snowy": "white",

  "wormadam-plant": "green",
  "wormadam-sandy": "brown",
  "wormadam-trash": "red",

  "burmy-plant": "green",
  "burmy-sandy": "brown", // esta api key no existe, pero la uso solo para mostrar color de forma
  "burmy-trash": "red", // esta api key no existe, pero la uso solo para mostrar color de forma

  "cherrim": "purple",
  "cherrim-sunshine": "pink", // esta api key no existe, pero la uso solo para mostrar color de forma

  "zygarde-10": "black",
  "zygarde-50": "green",
  "zygarde-complete": "green",
  "zygarde-mega": "green",

  "minior-red": "red",
  "minior-orange": "red",
  "minior-yellow": "yellow",
  "minior-green": "green",
  "minior-blue": "blue",
  "minior-indigo": "blue",
  "minior-violet": "purple",
  "minior-red-meteor": "brown",

  "necrozma": "black",
  "necrozma-dusk": "yellow",
  "necrozma-dawn": "blue",
  "necrozma-ultra": "yellow",

  "oricorio-baile": "red",
  "oricorio-pom-pom": "yellow",
  "oricorio-pau": "pink",
  "oricorio-sensu": "purple",

  "calyrex": "green",
  "calyrex-ice": "white",
  "calyrex-shadow": "black",

  "ogerpon": "green",
  "ogerpon-wellspring-mask": "blue",
  "ogerpon-hearthflame-mask": "red",
  "ogerpon-cornerstone-mask": "gray",

  "lycanroc-midday": "brown",
  "lycanroc-midnight": "red",
  "lycanroc-dusk": "brown",

  "magearna": "gray",
  "magearna-original": "red",

  "squawkabilly-green-plumage": "green",
  "squawkabilly-blue-plumage": "blue",
  "squawkabilly-yellow-plumage": "yellow",
  "squawkabilly-white-plumage": "white",

  "gimmighoul": "red",
  "gimmighoul-roaming": "gray",

  "meowstic-male": "blue",
  "meowstic-female": "white",

  "shellos": "purple",
  "shellos_este": "blue",

  "gastrodon": "purple",
  "gastrodon_este": "blue",

  "oinkologne-male": "gray",
  "oinkologne-female": "brown"
};

export function getColorPkmByKey(input)
{
  const key = normalizeColorKey(input);
  if (!key) return "";

  return COLOR_BY_KEY_PKM[key] || "";
}
// ---------------- DATOS META DE COLORES POKÉMON - FIN ---------------- 


// ---------------- DATOS META DE MEGA EVOLUCIONES POKÉMON - INICIO ---------------- 
//#region MEGAS PKM

// Map de los Pokemon con Mega Evoluciones, con el apiKey, Display, etc.
export const MEGAS_PKM_META =
{
  "venusaur":
  {
    "megaForms": [ { "apiKey": "venusaur-mega", "display": "Mega-Venusaur" } ]
  },
  "charizard":
  {
    "megaForms": [
      { "apiKey": "charizard-mega-x", "display": "Mega-Charizard X", "color": getColorPkmByKey("charizard-mega-x") },
      { "apiKey": "charizard-mega-y", "display": "Mega-Charizard Y" }
    ]
  },
  "blastoise":
  {
    "megaForms": [ { "apiKey": "blastoise-mega", "display": "Mega-Blastoise" } ]
  },
  "alakazam":
  {
    "megaForms": [
      { "apiKey": "alakazam-mega", "display": "Mega-Alakazam" }
    ]
  },
  "gengar":
  {
    "megaForms": [
      { "apiKey": "gengar-mega", "display": "Mega-Gengar" }
    ]
  },
  "kangaskhan":
  {
    "megaForms": [
      { "apiKey": "kangaskhan-mega", "display": "Mega-Kangaskhan" }
    ]
  },
  "pinsir":
  {
    "megaForms": [
      { "apiKey": "pinsir-mega", "display": "Mega-Pinsir" }
    ]
  },
  "gyarados":
  {
    "megaForms": [
      { "apiKey": "gyarados-mega", "display": "Mega-Gyarados" }
    ]
  },
  "aerodactyl":
  {
    "megaForms": [
      { "apiKey": "aerodactyl-mega", "display": "Mega-Aerodactyl" }
    ]
  },
  "mewtwo":
  {
    "megaForms": [
      { "apiKey": "mewtwo-mega-x", "display": "Mega-Mewtwo X" },
      { "apiKey": "mewtwo-mega-y", "display": "Mega-Mewtwo Y" }
    ]
  },
  "ampharos":
  {
    "megaForms": [
      { "apiKey": "ampharos-mega", "display": "Mega-Ampharos" }
    ]
  },
  "scizor":
  {
    "megaForms": [
      { "apiKey": "scizor-mega", "display": "Mega-Scizor" }
    ]
  },
  "heracross":
  {
    "megaForms": [
      { "apiKey": "heracross-mega", "display": "Mega-Heracross" }
    ]
  },
  "houndoom":
  {
    "megaForms": [
      { "apiKey": "houndoom-mega", "display": "Mega-Houndoom" }
    ]
  },
  "tyranitar":
  {
    "megaForms": [
      { "apiKey": "tyranitar-mega", "display": "Mega-Tyranitar" }
    ]
  },
  "blaziken":
  {
    "megaForms": [
      { "apiKey": "blaziken-mega", "display": "Mega-Blaziken" }
    ]
  },
  "gardevoir":
  {
    "megaForms": [
      { "apiKey": "gardevoir-mega", "display": "Mega-Gardevoir" }
    ]
  },
  "mawile":
  {
    "megaForms": [
      { "apiKey": "mawile-mega", "display": "Mega-Mawile" }
    ]
  },
  "aggron":
  {
    "megaForms": [
      { "apiKey": "aggron-mega", "display": "Mega-Aggron" }
    ]
  },
  "medicham":
  {
    "megaForms": [
      { "apiKey": "medicham-mega", "display": "Mega-Medicham" }
    ]
  },
  "manectric":
  {
    "megaForms": [
      { "apiKey": "manectric-mega", "display": "Mega-Manectric" }
    ]
  },
  "banette":
  {
    "megaForms": [
      { "apiKey": "banette-mega", "display": "Mega-Banette" }
    ]
  },
  "abomasnow":
  {
    "megaForms": [
      { "apiKey": "abomasnow-mega", "display": "Mega-Abomasnow" }
    ]
  },
  "beedrill":
  {
    "megaForms": [
      { "apiKey": "beedrill-mega", "display": "Mega-Beedrill" }
    ]
  },
  "pidgeot":
  {
    "megaForms": [
      { "apiKey": "pidgeot-mega", "display": "Mega-Pidgeot" }
    ]
  },
  "slowbro":
  {
    "megaForms": [
      { "apiKey": "slowbro-mega", "display": "Mega-Slowbro" }
    ]
  },
  "steelix":
  {
    "megaForms": [
      { "apiKey": "steelix-mega", "display": "Mega-Steelix" }
    ]
  },
  "sceptile":
  {
    "megaForms": [
      { "apiKey": "sceptile-mega", "display": "Mega-Sceptile" }
    ]
  },
  "swampert":
  {
    "megaForms": [
      { "apiKey": "swampert-mega", "display": "Mega-Swampert" }
    ]
  },
  "sableye":
  {
    "megaForms": [
      { "apiKey": "sableye-mega", "display": "Mega-Sableye" }
    ]
  },
  "sharpedo":
  {
    "megaForms": [
      { "apiKey": "sharpedo-mega", "display": "Mega-Sharpedo" }
    ]
  },
  "camerupt":
  {
    "megaForms": [
      { "apiKey": "camerupt-mega", "display": "Mega-Camerupt" }
    ]
  },
  "altaria":
  {
    "megaForms": [
      { "apiKey": "altaria-mega", "display": "Mega-Altaria" }
    ]
  },
  "glalie":
  {
    "megaForms": [
      { "apiKey": "glalie-mega", "display": "Mega-Glalie" }
    ]
  },
  "salamence":
  {
    "megaForms": [
      { "apiKey": "salamence-mega", "display": "Mega-Salamence" }
    ]
  },
  "metagross":
  {
    "megaForms": [
      { "apiKey": "metagross-mega", "display": "Mega-Metagross" }
    ]
  },
  "latias":
  {
    "megaForms": [
      { "apiKey": "latias-mega", "display": "Mega-Latias", "color": "purple" }
    ]
  },
  "latios":
  {
    "megaForms": [
      { "apiKey": "latios-mega", "display": "Mega-Latios", "color": "purple" }
    ]
  },
  "rayquaza":
  {
    "megaForms": [
      { "apiKey": "rayquaza-mega", "display": "Mega-Rayquaza", "desc": "Megaevoluciona conociendo el movimiento Ascenso Draco, sin necesitar una megapiedra." }
    ]
  },
  "lopunny":
  {
    "megaForms": [
      { "apiKey": "lopunny-mega", "display": "Mega-Lopunny" }
    ]
  },
  "gallade":
  {
    "megaForms": [
      { "apiKey": "gallade-mega", "display": "Mega-Gallade" }
    ]
  },
  "audino":
  {
    "megaForms": [
      { "apiKey": "audino-mega", "display": "Mega-Audino" }
    ]
  },
  "diancie":
  {
    "megaForms": [
      { "apiKey": "diancie-mega", "display": "Mega-Diancie" }
    ]
  },
  "dragonite":
  {
    "megaForms": [
      { "apiKey": "dragonite-mega", "display": "Mega-Dragonite" }
    ]
  },
  "victreebel":
  {
    "megaForms": [
      { "apiKey": "victreebel-mega", "display": "Mega-Victreebel" }
    ]
  },
  "hawlucha":
  {
    "megaForms": [
      { "apiKey": "hawlucha-mega", "display": "Mega-Hawlucha" }
    ]
  },
  "malamar":
  {
    "megaForms": [
      { "apiKey": "malamar-mega", "display": "Mega-Malamar" }
    ]
  },
  "greninja":
  {
    "megaForms": [
      { "apiKey": "greninja-mega", "display": "Mega-Greninja" }
    ]
  },
  "delphox":
  {
    "megaForms": [
      { "apiKey": "delphox-mega", "display": "Mega-Delphox" }
    ]
  },
  "chesnaught":
  {
    "megaForms": [
      { "apiKey": "chesnaught-mega", "display": "Mega-Chesnaught" }
    ]
  },
  "drampa":
  {
    "megaForms": [
      { "apiKey": "drampa-mega", "display": "Mega-Drampa" }
    ]
  },
  "excadrill":
  {
    "megaForms": [
      { "apiKey": "excadrill-mega", "display": "Mega-Excadrill" }
    ]
  },
  "eelektross":
  {
    "megaForms": [
      { "apiKey": "eelektross-mega", "display": "Mega-Eelektross" }
    ]
  },
  "chandelure":
  {
    "megaForms": [
      { "apiKey": "chandelure-mega", "display": "Mega-Chandelure" }
    ]
  },
  "falinks":
  {
    "megaForms": [
      { "apiKey": "falinks-mega", "display": "Mega-Falinks" }
    ]
  },
  "barbaracle":
  {
    "megaForms": [
      { "apiKey": "barbaracle-mega", "display": "Mega-Barbaracle" }
    ]
  },
  "skarmory":
  {
    "megaForms": [
      { "apiKey": "skarmory-mega", "display": "Mega-Skarmory" }
    ]
  },
  "scolipede":
  {
    "megaForms": [
      { "apiKey": "scolipede-mega", "display": "Mega-Scolipede" }
    ]
  },
  "froslass":
  {
    "megaForms": [
      { "apiKey": "froslass-mega", "display": "Mega-Froslass" }
    ]
  },
  "dragalge":
  {
    "megaForms": [
      { "apiKey": "dragalge-mega", "display": "Mega-Dragalge" }
    ]
  },
  "clefable":
  {
    "megaForms": [
      { "apiKey": "clefable-mega", "display": "Mega-Clefable" }
    ]
  },
  "scrafty":
  {
    "megaForms": [
      { "apiKey": "scrafty-mega", "display": "Mega-Scrafty" }
    ]
  },
  "starmie":
  {
    "megaForms": [
      { "apiKey": "starmie-mega", "display": "Mega-Starmie" }
    ]
  },
  "pyroar-male":
  {
    "megaForms": [
      { "apiKey": "pyroar-mega", "display": "Mega-Pyroar", "desc": "Megaevoluciona con Pyroarita equipada en combate." }
    ]
  },
  "meganium":
  {
    "megaForms": [
      { "apiKey": "meganium-mega", "display": "Mega-Meganium" }
    ]
  },
  "feraligatr":
  {
    "megaForms": [
      { "apiKey": "feraligatr-mega", "display": "Mega-Feraligatr" }
    ]
  },
  "emboar":
  {
    "megaForms": [
      { "apiKey": "emboar-mega", "display": "Mega-Emboar" }
    ]
  },
  "floette-eternal":
  {
    "megaForms": [
      { "apiKey": "floette-mega", "display": "Mega-Floette Flor Eterna", "desc": "Megaevoluciona con Floetteita equipada en combate." }
    ]
  },
  "zygarde-complete":
  {
    "megaForms": [
      { "apiKey": "zygarde-mega", "display": "Mega-Zygarde Forma Completa", "color": getColorPkmByKey("zygarde-complete"), "desc": "Megaevoluciona con Zygardeita equipada en combate." }
    ]
  },
  "zeraora":
  {
    "megaForms": [
      { "apiKey": "zeraora-mega", "display": "Mega-Zeraora" }
    ]
  },
  "golisopod":
  {
    "megaForms": [
      { "apiKey": "golisopod-mega", "display": "Mega-Golisopod" }
    ]
  },
  "magearna":
  {
    "megaForms": [
      { "apiKey": "magearna-mega", "display": "Mega-Magearna", "color": getColorPkmByKey("magearna"), "desc": "Megaevoluciona con Magearnaita equipada en combate." },
      { "apiKey": "magearna-original-mega", "display": "Mega-Magearna Color Vetusto", "color": getColorPkmByKey("magearna-original"), "desc": "Megaevoluciona con Magearnaita equipada en combate." }
    ]
  },
  "magearna-original":
  {
    "megaForms": [
      { "apiKey": "magearna-mega", "display": "Mega-Magearna", "color": getColorPkmByKey("magearna"), "desc": "Megaevoluciona con Magearnaita equipada en combate." },
      { "apiKey": "magearna-original-mega", "display": "Mega-Magearna Color Vetusto", "color": getColorPkmByKey("magearna-original"), "desc": "Megaevoluciona con Magearnaita equipada en combate." }
    ]
  },
  "chimecho":
  {
    "megaForms": [
      { "apiKey": "chimecho-mega", "display": "Mega-Chimecho" }
    ]
  },
  "staraptor":
  {
    "megaForms": [
      { "apiKey": "staraptor-mega", "display": "Mega-Staraptor" }
    ]
  },
  "heatran":
  {
    "megaForms": [
      { "apiKey": "heatran-mega", "display": "Mega-Heatran" }
    ]
  },
  "darkrai":
  {
    "megaForms": [
      { "apiKey": "darkrai-mega", "display": "Mega-Darkrai" }
    ]
  },
  "golurk":
  {
    "megaForms": [
      { "apiKey": "golurk-mega", "display": "Mega-Golurk" }
    ]
  },
  "meowstic-male":
  {
    "megaForms": [
      { "apiKey": "meowstic-male-mega", "display": "Mega-Meowstic ♂", "desc": "Megaevoluciona con Meowsticita equipada en combate." }
    ]
  },
  "meowstic-female":
  {
    "megaForms": [
      { "apiKey": "meowstic-female-mega", "display": "Mega-Meowstic ♀", "desc": "Megaevoluciona con Meowsticita equipada en combate." }
    ]
  },
  "crabominable":
  {
    "megaForms": [
      { "apiKey": "crabominable-mega", "display": "Mega-Crabominable" }
    ]
  },
  "scovillain":
  {
    "megaForms": [
      { "apiKey": "scovillain-mega", "display": "Mega-Scovillain" }
    ]
  },
  "glimmora":
  {
    "megaForms": [
      { "apiKey": "glimmora-mega", "display": "Mega-Glimmora" }
    ]
  },
  "tatsugiri-curly":
  {
    "megaForms": [
      { "apiKey": "tatsugiri-curly-mega", "display": "Mega-Tatsugiri Forma Curvada", "color": getColorPkmByKey("tatsugiri-curly-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." },
      { "apiKey": "tatsugiri-droopy-mega", "display": "Mega-Tatsugiri Forma Lánguida", "color": getColorPkmByKey("tatsugiri-droopy-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." },
      { "apiKey": "tatsugiri-stretchy-mega", "display": "Mega-Tatsugiri Forma Recta", "color": getColorPkmByKey("tatsugiri-stretchy-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." }
    ]
  },
  "tatsugiri-droopy":
  {
    "megaForms": [
      { "apiKey": "tatsugiri-curly-mega", "display": "Mega-Tatsugiri Forma Curvada", "color": getColorPkmByKey("tatsugiri-curly-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." },
      { "apiKey": "tatsugiri-droopy-mega", "display": "Mega-Tatsugiri Forma Lánguida", "color": getColorPkmByKey("tatsugiri-droopy-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." },
      { "apiKey": "tatsugiri-stretchy-mega", "display": "Mega-Tatsugiri Forma Recta", "color": getColorPkmByKey("tatsugiri-stretchy-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." }
    ]
  },
  "tatsugiri-stretchy":
  {
    "megaForms": [
      { "apiKey": "tatsugiri-curly-mega", "display": "Mega-Tatsugiri Forma Curvada", "color": getColorPkmByKey("tatsugiri-curly-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." },
      { "apiKey": "tatsugiri-droopy-mega", "display": "Mega-Tatsugiri Forma Lánguida", "color": getColorPkmByKey("tatsugiri-droopy-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." },
      { "apiKey": "tatsugiri-stretchy-mega", "display": "Mega-Tatsugiri Forma Recta", "color": getColorPkmByKey("tatsugiri-stretchy-mega"), "desc": "Megaevoluciona con Tatsugirita equipada en combate." }
    ]
  },
  "baxcalibur":
  {
    "megaForms": [
      { "apiKey": "baxcalibur-mega", "display": "Mega-Baxcalibur" }
    ]
  },
  "lucario":
  {
    "megaForms": [
      { "apiKey": "lucario-mega", "display": "Mega-Lucario" },
      { "apiKey": "lucario-mega-z", "display": "Mega-Lucario Z" }
    ]
  },
  "garchomp":
  {
    "megaForms": [
      { "apiKey": "garchomp-mega", "display": "Mega-Garchomp" },
      { "apiKey": "garchomp-mega-z", "display": "Mega-Garchomp Z" }
    ]
  },
  "absol":
  {
    "megaForms": [
      { "apiKey": "absol-mega", "display": "Mega-Absol" },
      { "apiKey": "absol-mega-z", "display": "Mega-Absol Z" }
    ]
  },
  "raichu":
  {
    "megaForms": [
      { "apiKey": "raichu-mega-x", "display": "Mega-Raichu X" },
      { "apiKey": "raichu-mega-y", "display": "Mega-Raichu Y" }
    ]
  }
};

export const MEGA_DISPLAY_BY_KEY = Object.fromEntries(
  Object.values(MEGAS_PKM_META || {})
    .flatMap((entry) =>
      Array.isArray(entry?.megaForms)
        ? entry.megaForms.map((mega) => [
            String(mega?.apiKey || "").toLowerCase().trim(),
            String(mega?.display || "").trim(),
          ])
        : []
    )
    .filter(([apiKey, display]) => apiKey && display)
);

export const MEGA_APIKEY_TO_BASE_APIKEY =
{
  "venusaur-mega": "venusaur",

  "charizard-mega-x": "charizard",
  "charizard-mega-y": "charizard",

  "blastoise-mega": "blastoise",
  "alakazam-mega": "alakazam",
  "gengar-mega": "gengar",
  "kangaskhan-mega": "kangaskhan",
  "pinsir-mega": "pinsir",
  "gyarados-mega": "gyarados",
  "aerodactyl-mega": "aerodactyl",

  "mewtwo-mega-x": "mewtwo",
  "mewtwo-mega-y": "mewtwo",

  "ampharos-mega": "ampharos",
  "scizor-mega": "scizor",
  "heracross-mega": "heracross",
  "houndoom-mega": "houndoom",
  "tyranitar-mega": "tyranitar",
  "blaziken-mega": "blaziken",
  "gardevoir-mega": "gardevoir",
  "mawile-mega": "mawile",
  "aggron-mega": "aggron",
  "medicham-mega": "medicham",
  "manectric-mega": "manectric",
  "banette-mega": "banette",
  "abomasnow-mega": "abomasnow",
  "beedrill-mega": "beedrill",
  "pidgeot-mega": "pidgeot",
  "slowbro-mega": "slowbro",
  "steelix-mega": "steelix",
  "sceptile-mega": "sceptile",
  "swampert-mega": "swampert",
  "sableye-mega": "sableye",
  "sharpedo-mega": "sharpedo",
  "camerupt-mega": "camerupt",
  "altaria-mega": "altaria",
  "glalie-mega": "glalie",
  "salamence-mega": "salamence",
  "metagross-mega": "metagross",
  "latias-mega": "latias",
  "latios-mega": "latios",
  "rayquaza-mega": "rayquaza",
  "lopunny-mega": "lopunny",
  "gallade-mega": "gallade",
  "audino-mega": "audino",
  "diancie-mega": "diancie",
  "dragonite-mega": "dragonite",
  "victreebel-mega": "victreebel",
  "hawlucha-mega": "hawlucha",
  "malamar-mega": "malamar",
  "greninja-mega": "greninja",
  "delphox-mega": "delphox",
  "chesnaught-mega": "chesnaught",
  "drampa-mega": "drampa",
  "excadrill-mega": "excadrill",
  "eelektross-mega": "eelektross",
  "chandelure-mega": "chandelure",
  "falinks-mega": "falinks",
  "barbaracle-mega": "barbaracle",
  "skarmory-mega": "skarmory",
  "scolipede-mega": "scolipede",
  "froslass-mega": "froslass",
  "dragalge-mega": "dragalge",
  "clefable-mega": "clefable",
  "scrafty-mega": "scrafty",
  "starmie-mega": "starmie",
  "pyroar-mega": "pyroar",
  "meganium-mega": "meganium",
  "feraligatr-mega": "feraligatr",
  "emboar-mega": "emboar",

  "floette-mega": "floette-eternal",
  "zygarde-mega": "zygarde-complete",
  "zeraora-mega": "zeraora",
  "golisopod-mega": "golisopod",

  "magearna-mega": "magearna",
  "magearna-original-mega": "magearna",

  "chimecho-mega": "chimecho",
  "staraptor-mega": "staraptor",
  "heatran-mega": "heatran",
  "darkrai-mega": "darkrai",
  "golurk-mega": "golurk",
  "meowstic-male-mega": "meowstic-male",
  "meowstic-female-mega": "meowstic-female",
  "crabominable-mega": "crabominable",
  "scovillain-mega": "scovillain",
  "glimmora-mega": "glimmora",

  "tatsugiri-curly-mega": "tatsugiri-curly",
  "tatsugiri-droopy-mega": "tatsugiri-curly",
  "tatsugiri-stretchy-mega": "tatsugiri-curly",

  "baxcalibur-mega": "baxcalibur",
  "lucario-mega": "lucario",
  "lucario-mega-z": "lucario",

  "garchomp-mega": "garchomp",
  "garchomp-mega-z": "garchomp",

  "absol-mega": "absol",
  "absol-mega-z": "absol",

  "raichu-mega-x": "raichu",
  "raichu-mega-y": "raichu"
};

export function getBaseApiKeyFromMega(apiKey)
{
  const key = String(apiKey || "").trim().toLowerCase();
  if(!key) return "";

  return MEGA_APIKEY_TO_BASE_APIKEY[key] || key;
}

export function normalizePkmBaseMegaKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getPokemonMegaMeta(input)
{
  const key = normalizePkmBaseMegaKey(input);
  return key ? (MEGAS_PKM_META[key] || null) : null;
}

export function getPokemonMegaForms(input)
{
  const forms = getPokemonMegaMeta(input)?.megaForms;
  return Array.isArray(forms) ? forms : [];
}

export function hasPokemonMegaForms(apiKey)
{
  return getPokemonMegaForms(apiKey).length > 0;
}
// ---------------- DATOS META DE MEGA EVOLUCIONES POKÉMON - FIN ---------------- 


// ---------------- DATOS META DE GIGAMAX POKÉMON - INICIO ---------------- 
//#region GIGAMAX PKM

// Map de los Pokemon con Gigamax, con el apiKey, Display, etc.
export const GIGAS_PKM_META =
{
  "charizard":
  {
    "apiKey": "charizard-gmax",
    "display": "Charizard Gigamax",
    "displayMov": "Gigallamarada",
    "descMov": "Causa daño al objetivo y, al final de cada turno, inflige daño a todos los Pokémon rivales que no sean de tipo fuego durante 4 turnos, restándoles 1/6 de sus PS máximos."
  },
  "butterfree":
  {
    "apiKey": "butterfree-gmax",
    "display": "Butterfree Gigamax",
    "displayMov": "Gigaestupor",
    "descMov": "Causa daño al objetivo y siempre inflige un estado aleatorio a los oponentes adyacentes entre paralizado, dormido o envenenado."
  },
  "pikachu":
  {
    "apiKey": "pikachu-gmax",
    "display": "Pikachu Gigamax",
    "displayMov": "Gigatronada",
    "descMov": "Causa daño al objetivo y paraliza a todos los Pokémon del bando rival."
  },
  "meowth":
  {
    "apiKey": "meowth-gmax",
    "display": "Meowth Gigamax",
    "displayMov": "Gigamonedas",
    "descMov": "Causa daño al objetivo y siempre deja confundidos a todos los Pokémon rivales. Además, esparce monedas por el campo de batalla que pueden recogerse al final del combate."
  },
  "machamp":
  {
    "apiKey": "machamp-gmax",
    "display": "Machamp Gigamax",
    "displayMov": "Gigapuñición",
    "descMov": "Causa daño al objetivo y aumenta en un nivel el índice de golpe crítico tanto del usuario como de los Pokémon aliados en combate."
  },
  "gengar":
  {
    "apiKey": "gengar-gmax",
    "display": "Gengar Gigamax",
    "displayMov": "Gigaaparición",
    "descMov": "Causa daño al objetivo e impide que este sea cambiado por otro Pokémon mientras el usuario siga en combate."
  },
  "kingler":
  {
    "apiKey": "kingler-gmax",
    "display": "Kingler Gigamax",
    "displayMov": "Gigaespuma",
    "descMov": "Causa daño al objetivo y reduce en dos niveles la velocidad de los oponentes adyacentes."
  },
  "lapras":
  {
    "apiKey": "lapras-gmax",
    "display": "Lapras Gigamax",
    "displayMov": "Gigamelodía",
    "descMov": "Causa daño al objetivo y establece una barrera de velo aurora en el equipo aliado sin necesidad de que esté granizando."
  },
  "eevee":
  {
    "apiKey": "eevee-gmax",
    "display": "Eevee Gigamax",
    "displayMov": "Gigaternura",
    "descMov": "Causa daño al objetivo y siempre deja enamorados a todos los Pokémon rivales que sean del sexo opuesto al del usuario."
  },
  "snorlax":
  {
    "apiKey": "snorlax-gmax",
    "display": "Snorlax Gigamax",
    "displayMov": "Gigarreciclaje",
    "descMov": "Causa daño al objetivo y tiene una probabilidad del 50% de restaurar las bayas del equipo aliado que han sido consumidas de forma natural o lanzadas mediante lanzamiento."
  },
  "garbodor":
  {
    "apiKey": "garbodor-gmax",
    "display": "Garbodor Gigamax",
    "displayMov": "Gigapestilencia",
    "descMov": "Causa daño al objetivo y envenena a todos los Pokémon del bando rival."
  },
  "melmetal":
  {
    "apiKey": "melmetal-gmax",
    "display": "Melmetal Gigamax",
    "displayMov": "Gigafundido",
    "descMov": "Causa daño al objetivo e impide a los oponentes usar un mismo movimiento 2 veces seguidas."
  },
  "corviknight":
  {
    "apiKey": "corviknight-gmax",
    "display": "Corviknight Gigamax",
    "displayMov": "Gigahuracán",
    "descMov": "Causa daño al objetivo y elimina los efectos de barreras del campo del oponente, las trampas de ambos campos, así como los campos que haya activos."
  },
  "orbeetle":
  {
    "apiKey": "orbeetle-gmax",
    "display": "Orbeetle Gigamax",
    "displayMov": "Gigabóveda",
    "descMov": "Causa daño al objetivo y causa los efectos de gravedad durante 5 turnos."
  },
  "drednaw":
  {
    "apiKey": "drednaw-gmax",
    "display": "Drednaw Gigamax",
    "displayMov": "Gigatrampa Rocas",
    "descMov": "Causa daño al objetivo y coloca trampa rocas en el campo del oponente."
  },
  "coalossal":
  {
    "apiKey": "coalossal-gmax",
    "display": "Coalossal Gigamax",
    "displayMov": "Gigarroca Ígnea",
    "descMov": "Causa daño al objetivo y, al final de cada turno, inflige daño a todos los Pokémon rivales que no sean de tipo roca durante 4 turnos, restándoles 1/6 de sus PS máximos."
  },
  "flapple":
  {
    "apiKey": "flapple-gmax",
    "display": "Flapple Gigamax",
    "displayMov": "Gigacorrosión",
    "descMov": "Causa daño al objetivo y reduce en un nivel la evasión de todos los Pokémon rivales."
  },
  "appletun":
  {
    "apiKey": "appletun-gmax",
    "display": "Appletun Gigamax",
    "displayMov": "Giganéctar",
    "descMov": "Causa daño al objetivo y cura los problemas de estado del usuario y los Pokémon aliados."
  },
  "sandaconda":
  {
    "apiKey": "sandaconda-gmax",
    "display": "Sandaconda Gigamax",
    "displayMov": "Gigapolvareda",
    "descMov": "Causa daño y deja a los oponentes apresados en bucle arena durante 4 o 5 turnos, restándoles 1/16 de los PS máximos durante cada turno e impidiendo su cambio."
  },
  "toxtricity-amped":
  {
    "apiKey": "toxtricity-amped-gmax",
    "display": "Toxtricity Gigamax",
    "displayMov": "Gigadescarga",
    "descMov": "Causa daño al objetivo y siempre inflige un estado aleatorio a los oponentes adyacentes entre paralizado o envenenado."
  },
  "toxtricity-low-key":
  {
    "apiKey": "toxtricity-low-key-gmax",
    "display": "Toxtricity Gigamax",
    "displayMov": "Gigadescarga",
    "descMov": "Causa daño al objetivo y siempre inflige un estado aleatorio a los oponentes adyacentes entre paralizado o envenenado."
  },
  "centiskorch":
  {
    "apiKey": "centiskorch-gmax",
    "display": "Centiskorch Gigamax",
    "displayMov": "Gigacienfuegos",
    "descMov": "Causa daño al objetivo y deja a los oponentes apresados en giro fuego. Los oponentes quedan apresados durante 4 o 5 turnos y les resta 1/8 de los PS máximos al final de cada turno hasta ser liberados."
  },
  "hatterene":
  {
    "apiKey": "hatterene-gmax",
    "display": "Hatterene Gigamax",
    "displayMov": "Gigacastigo",
    "descMov": "Causa daño al objetivo y siempre deja confundidos a todos los Pokémon rivales."
  },
  "grimmsnarl":
  {
    "apiKey": "grimmsnarl-gmax",
    "display": "Grimmsnarl Gigamax",
    "displayMov": "Gigasopor",
    "descMov": "Causa daño al objetivo y tiene una probabilidad del 50% de adormecer al oponente en el primer turno, haciendo que se duerma al final del siguiente turno."
  },
  "alcremie":
  {
    "apiKey": "alcremie-gmax",
    "display": "Alcremie Gigamax",
    "displayMov": "Gigacolofón",
    "descMov": "Causa daño al objetivo y restaura al usuario y los Pokémon aliados en combate 1/6 de sus respectivos PS máximos."
  },
  "copperajah":
  {
    "apiKey": "copperajah-gmax",
    "display": "Copperajah Gigamax",
    "displayMov": "Gigatrampa Acero",
    "descMov": "Causa daño al objetivo y coloca piezas de acero en el campo del oponente."
  },
  "duraludon":
  {
    "apiKey": "duraludon-gmax",
    "display": "Duraludon Gigamax",
    "displayMov": "Gigadesgaste",
    "descMov": "Causa daño al objetivo y reduce 4 PP del último movimiento usado por el oponente."
  },
  "venusaur":
  {
    "apiKey": "venusaur-gmax",
    "display": "Venusaur Gigamax",
    "displayMov": "Gigalianas",
    "descMov": "Causa daño al objetivo y, al final de cada turno, inflige daño a todos los Pokémon rivales que no sean de tipo planta durante 4 turnos, restándoles 1/6 de sus PS máximos."
  },
  "blastoise":
  {
    "apiKey": "blastoise-gmax",
    "display": "Blastoise Gigamax",
    "displayMov": "Gigacañonazo",
    "descMov": "Causa daño al objetivo y, al final de cada turno, inflige daño a todos los Pokémon rivales que no sean de tipo agua durante 4 turnos, restándoles 1/6 de sus PS máximos."
  },
  "rillaboom":
  {
    "apiKey": "rillaboom-gmax",
    "display": "Rillaboom Gigamax",
    "displayMov": "Gigarredoble",
    "descMov": "Causa daño al objetivo ignorando los efectos de la habilidad del mismo."
  },
  "cinderace":
  {
    "apiKey": "cinderace-gmax",
    "display": "Cinderace Gigamax",
    "displayMov": "Gigaesfera Ígnea",
    "descMov": "Causa daño al objetivo ignorando los efectos de la habilidad del mismo."
  },
  "inteleon":
  {
    "apiKey": "inteleon-gmax",
    "display": "Inteleon Gigamax",
    "displayMov": "Gigadisparo",
    "descMov": "Causa daño al objetivo ignorando los efectos de la habilidad del mismo."
  },
  "urshifu-single-strike":
  {
    "apiKey": "urshifu-single-strike-gmax",
    "display": "Urshifu Gigamax Estilo Brusco",
    "displayMov": "Gigagolpe Brusco",
    "descMov": "Causa daño al objetivo, incluso aunque este se esté protegiendo. El movimiento es incluso capaz de atravesar el movimiento maxibarrera."
  },
  "urshifu-rapid-strike":
  {
    "apiKey": "urshifu-rapid-strike-gmax",
    "display": "Urshifu Gigamax Estilo Fluido",
    "displayMov": "Gigagolpe Fluido",
    "descMov": "Causa daño al objetivo, incluso aunque este se esté protegiendo. El movimiento es incluso capaz de atravesar el movimiento maxibarrera."
  },
  "eternatus":
  {
    "apiKey": "eternatus-eternamax",
    "display": "Eternatus Eternamax",
    "desc": "Esta es la forma Gigamax que posee Eternatus. No es posible obtenerla en el juego; únicamente aparece durante la batalla final en Pokémon Espada y Escudo."
  }
};

export function normalizePkmBaseGigaKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getPokemonGigaMeta(input)
{
  const key = normalizePkmBaseGigaKey(input);
  return key ? (GIGAS_PKM_META[key] || null) : null;
}

export function getPokemonGigaForm(input)
{
  const meta = getPokemonGigaMeta(input);
  return meta || null;
}

export function hasPokemonGigaForm(apiKey)
{
  return getPokemonGigaForm(apiKey) !== null;
}
// ---------------- DATOS META DE GIGAMAX POKÉMON - FIN ---------------- 


// ---------------- DATOS META DE POKÉMON QUE NO PUEDEN CRIAR - INICIO ---------------- 
//#region CRIANZA PKM
export const NO_PUEDEN_CRIAR =
[
  // Paradojas de Escarlata
  "roaring-moon", "walking-wake", "sandy-shocks", "flutter-mane",
  "brute-bonnet", "scream-tail", "slither-wing", "great-tusk",
  // Indigo Disk / DLC
  "raging-bolt", "gouging-fire",


  // Paradojas de Púrpura
  "iron-treads", "iron-hands", "iron-thorns", "iron-jugulis",
  "iron-moth", "iron-bundle", "iron-valiant", "iron-leaves",
  // Indigo Disk / DLC
  "iron-crown", "iron-boulder"

];

export const PUEDEN_CRIAR =
[
  "phione",
  "manaphy"
];

export function normalizePkmBreedKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function pokemonCanBreedByList(apiKey)
{
  const key = normalizePkmBreedKey(apiKey);
  if (!key) return false;

  return PUEDEN_CRIAR.includes(key);
}

export function pokemonCannotBreedByList(apiKey)
{
  const key = normalizePkmBreedKey(apiKey);
  if (!key) return false;

  return NO_PUEDEN_CRIAR.includes(key);
}

export function canPokemonBreed(apiKey, speciesData = null)
{
  const key = normalizePkmBreedKey(apiKey);
  if (!key) return false;

  // Casos especiales con prioridad
  if (pokemonCanBreedByList(key)) return true;
  if (pokemonCannotBreedByList(key)) return false;

  // Regla general
  if (speciesData?.is_legendary) return false;
  if (speciesData?.is_mythical) return false;

  return true;
}
// ---------------- DATOS META DE POKÉMON QUE NO PUEDEN CRIAR - FIN ---------------- 


// ---------------- DATOS META DE FORMAS POKÉMON - INICIO ---------------- 
//#region FORMAS PKM

// Funcion que retorna el arreglo completo de las formas de "Alcremie"
export const mezclasAlcremie =
[
  { "en": "caramel-swirl", "es": "Mezcla Caramelo", "slug": "mezcla-caramelo", "color": "brown" },
  { "en": "lemon-cream", "es": "Crema de Limón", "slug": "crema-de-limon", "color": "yellow" },
  { "en": "matcha-cream", "es": "Crema de Té", "slug": "crema-de-te", "color": "green" },
  { "en": "mint-cream", "es": "Crema de Menta", "slug": "crema-de-menta", "color": "blue" },
  { "en": "rainbow-swirl", "es": "Tres Sabores", "slug": "tres-sabores", "color": "yellow" },
  { "en": "ruby-cream", "es": "Crema Rosa", "slug": "crema-rosa", "color": "pink" },
  { "en": "ruby-swirl", "es": "Mezcla Rosa", "slug": "mezcla-rosa", "color": "yellow" },
  { "en": "salted-cream", "es": "Crema Salada", "slug": "crema-salada", "color": "white" },
  { "en": "vanilla-cream", "es": "Crema de Vainilla", "slug": "crema-de-vainilla", "color": "white" }
];

export const confitesAlcremie =
[
  { "en": "berry", "es": "Confite Fruto", "slug": "confite-fruto" },
  { "en": "clover", "es": "Confite Trébol", "slug": "confite-trebol" },
  { "en": "flower", "es": "Confite Flor", "slug": "confite-flor" },
  { "en": "love", "es": "Confite Corazón", "slug": "confite-corazon" },
  { "en": "ribbon", "es": "Confite Lazo", "slug": "confite-lazo" },
  { "en": "star", "es": "Confite Estrella", "slug": "confite-estrella" },
  { "en": "strawberry", "es": "Confite Fresa", "slug": "confite-fresa" }
];

function generarFormasAlcremie()
{
  const arrFormas = [];
  mezclasAlcremie.forEach((mezcla) =>
  {
    confitesAlcremie.forEach((confite) =>
    {

      arrFormas.push({
        "display": `${toPokemonDisplayName("alcremie")} ${mezcla.es} (${confite.es})`,
        "color": mezcla.color,
        "img": `/assets/fotosFormas/alcremieFormas/alcremie-${mezcla.slug}-${confite.slug}.png`,
        "imgShiny": `/assets/fotosFormas/alcremieFormas/alcremie-confite-${confite.slug.replace("confite-", "")}_shiny.png`,
        "needFetch": false,
        "enableNavigation": false,
      });

    });

  });

  return arrFormas;
}

export const FORMAS_PKM_META =
{
  // DE ALOLA
  "raichu":
  {
    "forms": [
      {
        "apiKey": "raichu",
        "color": getColorPkmByKey("raichu"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "raichu-alola",
        "color": getColorPkmByKey("raichu-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "raichu-alola":
  {
    "forms": [
      {
        "apiKey": "raichu",
        "color": getColorPkmByKey("raichu"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "raichu-alola",
        "color": getColorPkmByKey("raichu-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "rattata":
  {
    "forms": [
      {
        "apiKey": "rattata",
        "color": getColorPkmByKey("rattata"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rattata-alola",
        "color": getColorPkmByKey("rattata-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "rattata-alola":
  {
    "forms": [
      {
        "apiKey": "rattata",
        "color": getColorPkmByKey("rattata"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rattata-alola",
        "color": getColorPkmByKey("rattata-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "raticate":
  {
    "forms": [
      {
        "apiKey": "raticate",
        "color": getColorPkmByKey("raticate"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "raticate-alola",
        "color": getColorPkmByKey("raticate-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "raticate-alola":
  {
    "forms": [
      {
        "apiKey": "raticate",
        "color": getColorPkmByKey("raticate"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "raticate-alola",
        "color": getColorPkmByKey("raticate-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "sandshrew":
  {
    "forms": [
      {
        "apiKey": "sandshrew",
        "color": getColorPkmByKey("sandshrew"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sandshrew-alola",
        "color": getColorPkmByKey("sandshrew-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "sandshrew-alola":
  {
    "forms": [
      {
        "apiKey": "sandshrew",
        "color": getColorPkmByKey("sandshrew"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sandshrew-alola",
        "color": getColorPkmByKey("sandshrew-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "sandslash":
  {
    "forms": [
      {
        "apiKey": "sandslash",
        "color": getColorPkmByKey("sandslash"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sandslash-alola",
        "color": getColorPkmByKey("sandslash-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "sandslash-alola":
  {
    "forms": [
      {
        "apiKey": "sandslash",
        "color": getColorPkmByKey("sandslash"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sandslash-alola",
        "color": getColorPkmByKey("sandslash-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "vulpix":
  {
    "forms": [
      {
        "apiKey": "vulpix",
        "color": getColorPkmByKey("vulpix"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "vulpix-alola",
        "color": getColorPkmByKey("vulpix-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "vulpix-alola":
  {
    "forms": [
      {
        "apiKey": "vulpix",
        "color": getColorPkmByKey("vulpix"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "vulpix-alola",
        "color": getColorPkmByKey("vulpix-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "ninetales":
  {
    "forms": [
      {
        "apiKey": "ninetales",
        "color": getColorPkmByKey("ninetales"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ninetales-alola",
        "color": getColorPkmByKey("ninetales-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "ninetales-alola":
  {
    "forms": [
      {
        "apiKey": "ninetales",
        "color": getColorPkmByKey("ninetales"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ninetales-alola",
        "color": getColorPkmByKey("ninetales-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "diglett":
  {
    "forms": [
      {
        "apiKey": "diglett",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "diglett-alola",
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "diglett-alola":
  {
    "forms": [
      {
        "apiKey": "diglett",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "diglett-alola",
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "dugtrio":
  {
    "forms": [
      {
        "apiKey": "dugtrio",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "dugtrio-alola",
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "dugtrio-alola":
  {
    "forms": [
      {
        "apiKey": "dugtrio",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "dugtrio-alola",
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "geodude":
  {
    "forms": [
      {
        "apiKey": "geodude",
        "color": getColorPkmByKey("geodude"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "geodude-alola",
        "color": getColorPkmByKey("geodude-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "geodude-alola":
  {
    "forms": [
      {
        "apiKey": "geodude",
        "color": getColorPkmByKey("geodude"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "geodude-alola",
        "color": getColorPkmByKey("geodude-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "graveler":
  {
    "forms": [
      {
        "apiKey": "graveler",
        "color": getColorPkmByKey("graveler"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "graveler-alola",
        "color": getColorPkmByKey("graveler-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "graveler-alola":
  {
    "forms": [
      {
        "apiKey": "graveler",
        "color": getColorPkmByKey("graveler"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "graveler-alola",
        "color": getColorPkmByKey("graveler-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "golem":
  {
    "forms": [
      {
        "apiKey": "golem",
        "color": getColorPkmByKey("golem"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "golem-alola",
        "color": getColorPkmByKey("golem-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "golem-alola":
  {
    "forms": [
      {
        "apiKey": "golem",
        "color": getColorPkmByKey("golem"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "golem-alola",
        "color": getColorPkmByKey("golem-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "grimer":
  {
    "forms": [
      {
        "apiKey": "grimer",
        "color": getColorPkmByKey("grimer"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "grimer-alola",
        "color": getColorPkmByKey("grimer-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "grimer-alola":
  {
    "forms": [
      {
        "apiKey": "grimer",
        "color": getColorPkmByKey("grimer"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "grimer-alola",
        "color": getColorPkmByKey("grimer-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "muk":
  {
    "forms": [
      {
        "apiKey": "muk",
        "color": getColorPkmByKey("muk"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "muk-alola",
        "color": getColorPkmByKey("muk-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "muk-alola":
  {
    "forms": [
      {
        "apiKey": "muk",
        "color": getColorPkmByKey("muk"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "muk-alola",
        "color": getColorPkmByKey("muk-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "exeggutor":
  {
    "forms": [
      {
        "apiKey": "exeggutor",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "exeggutor-alola",
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "exeggutor-alola":
  {
    "forms": [
      {
        "apiKey": "exeggutor",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "exeggutor-alola",
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "marowak":
  {
    "forms": [
      {
        "apiKey": "marowak",
        "color": getColorPkmByKey("marowak"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "marowak-alola",
        "color": getColorPkmByKey("marowak-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "marowak-alola":
  {
    "forms": [
      {
        "apiKey": "marowak",
        "color": getColorPkmByKey("marowak"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "marowak-alola",
        "color": getColorPkmByKey("marowak-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "persian":
  {
    "forms": [
      {
        "apiKey": "persian",
        "color": getColorPkmByKey("persian"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "persian-alola",
        "color": getColorPkmByKey("persian-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "persian-alola":
  {
    "forms": [
      {
        "apiKey": "persian",
        "color": getColorPkmByKey("persian"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "persian-alola",
        "color": getColorPkmByKey("persian-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "meowth":
  {
    "forms": [
      {
        "apiKey": "meowth",
        "color": getColorPkmByKey("meowth"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowth-alola",
        "color": getColorPkmByKey("meowth-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowth-galar",
        "color": getColorPkmByKey("meowth-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "meowth-alola":
  {
    "forms": [
      {
        "apiKey": "meowth",
        "color": getColorPkmByKey("meowth"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowth-alola",
        "color": getColorPkmByKey("meowth-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowth-galar",
        "color": getColorPkmByKey("meowth-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "meowth-galar":
  {
    "forms": [
      {
        "apiKey": "meowth",
        "color": getColorPkmByKey("meowth"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowth-alola",
        "color": getColorPkmByKey("meowth-alola"),
        "region": "alola",  
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowth-galar",
        "color": getColorPkmByKey("meowth-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  // FORMAS GALAR
  "mr-mime":
  {
    "forms": [
      {
        "apiKey": "mr-mime",
        "color": getColorPkmByKey("mr-mime"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "mr-mime-galar",
        "color": getColorPkmByKey("mr-mime-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "mr-mime-galar":
  {
    "forms": [
      {
        "apiKey": "mr-mime",
        "color": getColorPkmByKey("mr-mime"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "mr-mime-galar",
        "color": getColorPkmByKey("mr-mime-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "slowpoke":
  {
    "forms": [
      {
        "apiKey": "slowpoke",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "slowpoke-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "slowpoke-galar":
  {
    "forms": [
      {
        "apiKey": "slowpoke",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "slowpoke-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "slowbro":
  {
    "forms": [
      {
        "apiKey": "slowbro",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "slowbro-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "slowbro-galar":
  {
    "forms": [
      {
        "apiKey": "slowbro",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "slowbro-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "slowking":
  {
    "forms": [
      {
        "apiKey": "slowking",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "slowking-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "slowking-galar":
  {
    "forms": [
      {
        "apiKey": "slowking",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "slowking-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "articuno":
  {
    "forms": [
      {
        "apiKey": "articuno",
        "color": getColorPkmByKey("articuno"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "articuno-galar",
        "color": getColorPkmByKey("articuno-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "articuno-galar":
  {
    "forms": [
      {
        "apiKey": "articuno",
        "color": getColorPkmByKey("articuno"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "articuno-galar",
        "color": getColorPkmByKey("articuno-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "zapdos":
  {
    "forms": [
      {
        "apiKey": "zapdos",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zapdos-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zapdos-galar":
  {
    "forms": [
      {
        "apiKey": "zapdos",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zapdos-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "moltres":
  {
    "forms": [
      {
        "apiKey": "moltres",
        "color": getColorPkmByKey("moltres"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "moltres-galar",
        "color": getColorPkmByKey("moltres-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "moltres-galar":
  {
    "forms": [
      {
        "apiKey": "moltres",
        "color": getColorPkmByKey("moltres"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "moltres-galar",
        "color": getColorPkmByKey("moltres-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "stunfisk":
  {
    "forms": [
      {
        "apiKey": "stunfisk",
        "color": getColorPkmByKey("stunfisk"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "stunfisk-galar",
        "color": getColorPkmByKey("stunfisk-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "stunfisk-galar":
  {
    "forms": [
      {
        "apiKey": "stunfisk",
        "color": getColorPkmByKey("stunfisk"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "stunfisk-galar",
        "color": getColorPkmByKey("stunfisk-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "ponyta":
  {
    "forms": [
      {
        "apiKey": "ponyta",
        "color": getColorPkmByKey("ponyta"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ponyta-galar",
        "color": getColorPkmByKey("ponyta-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "ponyta-galar":
  {
    "forms": [
      {
        "apiKey": "ponyta",
        "color": getColorPkmByKey("ponyta"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ponyta-galar",
        "color": getColorPkmByKey("ponyta-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "rapidash":
  {
    "forms": [
      {
        "apiKey": "rapidash",
        "color": getColorPkmByKey("rapidash"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rapidash-galar",
        "color": getColorPkmByKey("rapidash-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "rapidash-galar":
  {
    "forms": [
      {
        "apiKey": "rapidash",
        "color": getColorPkmByKey("rapidash"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rapidash-galar",
        "color": getColorPkmByKey("rapidash-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "farfetchd":
  {
    "forms": [
      {
        "apiKey": "farfetchd",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "farfetchd-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "farfetchd-galar":
  {
    "forms": [
      {
        "apiKey": "farfetchd",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "farfetchd-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "weezing":
  {
    "forms": [
      {
        "apiKey": "weezing",
        "color": getColorPkmByKey("weezing"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "weezing-galar",
        "color": getColorPkmByKey("weezing-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "weezing-galar":
  {
    "forms": [
      {
        "apiKey": "weezing",
        "color": getColorPkmByKey("weezing"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "weezing-galar",
        "color": getColorPkmByKey("weezing-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "zigzagoon":
  {
    "forms": [
      {
        "apiKey": "zigzagoon",
        "color": getColorPkmByKey("zigzagoon"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zigzagoon-galar",
        "color": getColorPkmByKey("zigzagoon-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zigzagoon-galar":
  {
    "forms": [
      {
        "apiKey": "zigzagoon",
        "color": getColorPkmByKey("zigzagoon"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zigzagoon-galar",
        "color": getColorPkmByKey("zigzagoon-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "linoone":
  {
    "forms": [
      {
        "apiKey": "linoone",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "linoone-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "linoone-galar":
  {
    "forms": [
      {
        "apiKey": "linoone",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "linoone-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "darumaka":
  {
    "forms": [
      {
        "apiKey": "darumaka",
        "color": getColorPkmByKey("darumaka"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darumaka-galar",
        "color": getColorPkmByKey("darumaka-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "darumaka-galar":
  {
    "forms": [
      {
        "apiKey": "darumaka",
        "color": getColorPkmByKey("darumaka"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darumaka-galar",
        "color": getColorPkmByKey("darumaka-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "darmanitan-standard":
  {
    "forms": [
      {
        "apiKey": "darmanitan-standard",
        "color": getColorPkmByKey("darmanitan-standard"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-zen",
        "color": getColorPkmByKey("darmanitan-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-standard",
        "color": getColorPkmByKey("darmanitan-galar-standard"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-zen",
        "color": getColorPkmByKey("darmanitan-galar-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan de Galar si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "darmanitan-zen":
  {
    "forms": [
      {
        "apiKey": "darmanitan-standard",
        "color": getColorPkmByKey("darmanitan-standard"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-zen",
        "color": getColorPkmByKey("darmanitan-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-standard",
        "color": getColorPkmByKey("darmanitan-galar-standard"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-zen",
        "color": getColorPkmByKey("darmanitan-galar-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan de Galar si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "darmanitan-galar-standard":
  {
    "forms": [
      {
        "apiKey": "darmanitan-standard",
        "color": getColorPkmByKey("darmanitan-standard"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-zen",
        "color": getColorPkmByKey("darmanitan-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-standard",
        "color": getColorPkmByKey("darmanitan-galar-standard"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-zen",
        "color": getColorPkmByKey("darmanitan-galar-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan de Galar si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "darmanitan-galar-zen":
  {
    "forms": [
      {
        "apiKey": "darmanitan-standard",
        "color": getColorPkmByKey("darmanitan-standard"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-zen",
        "color": getColorPkmByKey("darmanitan-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-standard",
        "color": getColorPkmByKey("darmanitan-galar-standard"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "darmanitan-galar-zen",
        "color": getColorPkmByKey("darmanitan-galar-zen"),
        "desc": (
          "Esta es la forma que adquiere Darmanitan de Galar si posee la habilidad Modo Daruma cuando sus PS " +
          "restantes son del 50% o menos al final del turno."
        ),
        "abilities": [
          {
            "apiName": "zen-mode",
            "display": "Modo Daruma",
            "descHab": "Cambia de forma si sus PS se ven reducidos a la mitad."
          }
        ],
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "yamask":
  {
    "forms": [
      {
        "apiKey": "yamask",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "yamask-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "yamask-galar":
  {
    "forms": [
      {
        "apiKey": "yamask",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "yamask-galar",
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "corsola":
  {
    "forms": [
      {
        "apiKey": "corsola",
        "color": getColorPkmByKey("corsola"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "corsola-galar",
        "color": getColorPkmByKey("corsola-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "corsola-galar":
  {
    "forms": [
      {
        "apiKey": "corsola",
        "color": getColorPkmByKey("corsola"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "corsola-galar",
        "color": getColorPkmByKey("corsola-galar"),
        "region": "galar",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },


  // FORMAS HISUI
  "voltorb":
  {
    "forms": [
      {
        "apiKey": "voltorb",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "voltorb-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "voltorb-hisui":
  {
    "forms": [
      {
        "apiKey": "voltorb",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "voltorb-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "electrode":
  {
    "forms": [
      {
        "apiKey": "electrode",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "electrode-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "electrode-hisui":
  {
    "forms": [
      {
        "apiKey": "electrode",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "electrode-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "growlithe":
  {
    "forms": [
      {
        "apiKey": "growlithe",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "growlithe-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "growlithe-hisui":
  {
    "forms": [
      {
        "apiKey": "growlithe",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "growlithe-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "arcanine":
  {
    "forms": [
      {
        "apiKey": "arcanine",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "arcanine-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "arcanine-hisui":
  {
    "forms": [
      {
        "apiKey": "arcanine",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "arcanine-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "zorua":
  {
    "forms": [
      {
        "apiKey": "zorua",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zorua-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zorua-hisui":
  {
    "forms": [
      {
        "apiKey": "zorua",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zorua-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "zoroark":
  {
    "forms": [
      {
        "apiKey": "zoroark",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zoroark-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zoroark-hisui":
  {
    "forms": [
      {
        "apiKey": "zoroark",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zoroark-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "qwilfish":
  {
    "forms": [
      {
        "apiKey": "qwilfish",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "qwilfish-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "qwilfish-hisui":
  {
    "forms": [
      {
        "apiKey": "qwilfish",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "qwilfish-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "sneasel":
  {
    "forms": [
      {
        "apiKey": "sneasel",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sneasel-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "sneasel-hisui":
  {
    "forms": [
      {
        "apiKey": "sneasel",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sneasel-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "lilligant":
  {
    "forms": [
      {
        "apiKey": "lilligant",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lilligant-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "lilligant-hisui":
  {
    "forms": [
      {
        "apiKey": "lilligant",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lilligant-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "braviary":
  {
    "forms": [
      {
        "apiKey": "braviary",
        "color": getColorPkmByKey("braviary"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "braviary-hisui",
        "color": getColorPkmByKey("braviary-hisui"),
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "braviary-hisui":
  {
    "forms": [
      {
        "apiKey": "braviary",
        "color": getColorPkmByKey("braviary"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "braviary-hisui",
        "color": getColorPkmByKey("braviary-hisui"),
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "sliggoo":
  {
    "forms": [
      {
        "apiKey": "sliggoo",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sliggoo-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "sliggoo-hisui":
  {
    "forms": [
      {
        "apiKey": "sliggoo",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "sliggoo-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "goodra":
  {
    "forms": [
      {
        "apiKey": "goodra",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "goodra-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "goodra-hisui":
  {
    "forms": [
      {
        "apiKey": "goodra",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "goodra-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "avalugg":
  {
    "forms": [
      {
        "apiKey": "avalugg",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "avalugg-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "avalugg-hisui":
  {
    "forms": [
      {
        "apiKey": "avalugg",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "avalugg-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "typhlosion":
  {
    "forms": [
      {
        "apiKey": "typhlosion",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "typhlosion-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "typhlosion-hisui":
  {
    "forms": [
      {
        "apiKey": "typhlosion",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "typhlosion-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "decidueye":
  {
    "forms": [
      {
        "apiKey": "decidueye",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "decidueye-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "decidueye-hisui":
  {
    "forms": [
      {
        "apiKey": "decidueye",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "decidueye-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "samurott":
  {
    "forms": [
      {
        "apiKey": "samurott",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "samurott-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "samurott-hisui":
  {
    "forms": [
      {
        "apiKey": "samurott",
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "samurott-hisui",
        "region": "hisui",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  // FORMAS PALDEA
  "wooper":
  {
    "forms": [
      {
        "apiKey": "wooper",
        "color": getColorPkmByKey("wooper"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wooper-paldea",
        "color": getColorPkmByKey("wooper-paldea"),
        "region": "paldea",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "wooper-paldea":
  {
    "forms": [
      {
        "apiKey": "wooper",
        "color": getColorPkmByKey("wooper"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wooper-paldea",
        "color": getColorPkmByKey("wooper-paldea"),
        "region": "paldea",  
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "tauros":
  {
    "forms": [
      {
        "apiKey": "tauros",
        "color": getColorPkmByKey("tauros"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-combat-breed",
        "color": getColorPkmByKey("tauros-paldea-combat-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo lucha."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-blaze-breed",
        "color": getColorPkmByKey("tauros-paldea-blaze-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Fuego."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-aqua-breed",
        "color": getColorPkmByKey("tauros-paldea-aqua-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Agua."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "tauros-paldea-combat-breed":
  {
    "forms": [
      {
        "apiKey": "tauros",
        "color": getColorPkmByKey("tauros"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-combat-breed",
        "color": getColorPkmByKey("tauros-paldea-combat-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo lucha."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-blaze-breed",
        "color": getColorPkmByKey("tauros-paldea-blaze-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Fuego."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-aqua-breed",
        "color": getColorPkmByKey("tauros-paldea-aqua-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Agua."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "tauros-paldea-blaze-breed":
  {
    "forms": [
      {
        "apiKey": "tauros",
        "color": getColorPkmByKey("tauros"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-combat-breed",
        "color": getColorPkmByKey("tauros-paldea-combat-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo lucha."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-blaze-breed",
        "color": getColorPkmByKey("tauros-paldea-blaze-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Fuego."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-aqua-breed",
        "color": getColorPkmByKey("tauros-paldea-aqua-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Agua."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "tauros-paldea-aqua-breed":
  {
    "forms": [
      {
        "apiKey": "tauros",
        "color": getColorPkmByKey("tauros"),
        "region": "original",   
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-combat-breed",
        "color": getColorPkmByKey("tauros-paldea-combat-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo lucha."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-blaze-breed",
        "color": getColorPkmByKey("tauros-paldea-blaze-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Fuego."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tauros-paldea-aqua-breed",
        "color": getColorPkmByKey("tauros-paldea-aqua-breed"),
        "desc": (
          "Esta es una de las formas que puede adoptar Tauros en Paldea, es de tipo Lucha/Agua."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  // FORMAS VARIAS
  "pikachu":
  {
    "forms": [
      {
        "needFetch": false,
        "display": "Pikachu",
        "id": 25,
        "img": officialArtworkUrl(25),
        "imgShiny": shinyArtworkUrl(25),
        "desc": "Esta es la forma habitual de Pikachu.",
        "enableNavigation": true
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Compañero)",
        "id": 10148,
        "img": officialArtworkUrl(10148),
        "imgShiny": shinyArtworkUrl(10148),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en la región de Alola en el Anime " +
          "Pokémon Sol y Luna. Se pudo obtener en los juegos Pokémon Ultrasol y Ultraluna mediante un código de " +
          "evento entre los años 2017 y 2018 como parte de la campaña del 20° aniversario " +
          "del Anime."
        ),
        "enableNavigation": false
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Original)",
        "id": 10094,
        "img": officialArtworkUrl(10094),
        "imgShiny": shinyArtworkUrl(10094),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en la región de Kanto y Johto en el Anime. Se distribuyó " +
          "en Pokémon Sol, Luna, Ultrasol, Ultraluna y en Espada y Escudo mediante eventos especiales."
        ),
        "enableNavigation": false
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Hoenn)",
        "id": 10095,
        "img": officialArtworkUrl(10095),
        "imgShiny": shinyArtworkUrl(10095),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en la región de Hoenn en el Anime. Se distribuyó " +
          "en Pokémon Sol, Luna, Ultrasol, Ultraluna y en Espada y Escudo mediante eventos especiales."
        ),
        "enableNavigation": false
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Sinnoh)",
        "id": 10096,
        "img": officialArtworkUrl(10096),
        "imgShiny": shinyArtworkUrl(10096),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en la región de Sinnoh en el Anime. Se distribuyó " +
          "en Pokémon Sol, Luna, Ultrasol, Ultraluna y en Espada y Escudo mediante eventos especiales."
        ),
        "enableNavigation": false
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Teselia)",
        "id": 10097,
        "img": officialArtworkUrl(10097),
        "imgShiny": shinyArtworkUrl(10097),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en la región de Teselia en el Anime. Se distribuyó " +
          "en Pokémon Sol, Luna, Ultrasol, Ultraluna y en Espada y Escudo mediante eventos especiales."
        ),
        "enableNavigation": false
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Kalos)",
        "id": 10098,
        "img": officialArtworkUrl(10098),
        "imgShiny": shinyArtworkUrl(10098),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en la región de Kalos en el Anime. Se distribuyó " +
          "en Pokémon Sol, Luna, Ultrasol, Ultraluna y en Espada y Escudo mediante eventos especiales."
        ),
        "enableNavigation": false
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Alola)",
        "id": 10099,
        "img": officialArtworkUrl(10099),
        "imgShiny": shinyArtworkUrl(10099),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en la región de Alola en el Anime. Se distribuyó " +
          "en Pokémon Sol, Luna, Ultrasol, Ultraluna y en Espada y Escudo mediante eventos especiales."
        ),
        "enableNavigation": false
      },
      {
        "needFetch": false,
        "display": "Pikachu (Gorra Trotamundos)",
        "id": 10160,
        "img": officialArtworkUrl(10160),
        "imgShiny": shinyArtworkUrl(10160),
        "desc": (
          "En esta forma Pikachu posee la gorra que Ash usa en el anime Viajes Pokémon. Se distribuyó " +
          "en Pokémon Espada y Escudo mediante eventos especiales."
        ),
        "enableNavigation": false
      }
    ]
  },

  "basculin-red-striped":
  {
    "forms": [
      {
        "apiKey": "basculin-red-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya roja."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculin-blue-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya azul."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculin-white-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya blanca."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "basculin-blue-striped":
  {
    "forms": [
      {
        "apiKey": "basculin-red-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya roja."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculin-blue-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya azul."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculin-white-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya blanca."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "basculin-white-striped":
  {
    "forms": [
      {
        "apiKey": "basculin-red-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya roja."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculin-blue-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya azul."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculin-white-striped",
        "desc": (
          "Es una de las formas que posee Basculin, se caracteriza por tener una raya blanca."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "basculegion-male":
  {
    "forms": [
      {
        "apiKey": "basculegion-male",
        "desc": (
          "Esta es la forma que poseen los Basculegion machos. Poseen más ataque fisico."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculegion-female",
        "desc": (
          "Esta es la forma que poseen los Basculegion hembras. Poseen más ataque especial."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "basculegion-female":
  {
    "forms": [
      {
        "apiKey": "basculegion-male",
        "desc": (
          "Esta es la forma que poseen los Basculegion machos. Poseen más ataque fisico."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "basculegion-female",
        "desc": (
          "Esta es la forma que poseen los Basculegion hembras. Poseen más ataque especial."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "castform":
  {
    "forms": [
      {
        "apiKey": "castform",
        "desc": (
          "Es la forma estándar de CastForm cuando no hay clima soleado, lluvioso " +
          "o nevado. Es de tipo normal."
        ),
        "color": getColorPkmByKey("castform"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-sunny",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima soleado. Es de tipo fuego."
        ),
        "color": getColorPkmByKey("castform-sunny"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-rainy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima lluvioso. Es de tipo agua."
        ),
        "color": getColorPkmByKey("castform-rainy"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-snowy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima nevado. Es de tipo hielo."
        ),
        "color": getColorPkmByKey("castform-snowy"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "castform-sunny":
  {
    "forms": [
      {
        "apiKey": "castform",
        "desc": (
          "Es la forma estándar de CastForm cuando no hay clima soleado, lluvioso " +
          "o nevado. Es de tipo normal."
        ),
        "color": getColorPkmByKey("castform"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-sunny",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima soleado. Es de tipo fuego."
        ),
        "color": getColorPkmByKey("castform-sunny"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-rainy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima lluvioso. Es de tipo agua."
        ),
        "color": getColorPkmByKey("castform-rainy"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-snowy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima nevado. Es de tipo hielo."
        ),
        "color": getColorPkmByKey("castform-snowy"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "castform-rainy":
  {
    "forms": [
      {
        "apiKey": "castform",
        "desc": (
          "Es la forma estándar de CastForm cuando no hay clima soleado, lluvioso " +
          "o nevado. Es de tipo normal."
        ),
        "color": getColorPkmByKey("castform"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-sunny",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima soleado. Es de tipo fuego."
        ),
        "color": getColorPkmByKey("castform-sunny"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-rainy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima lluvioso. Es de tipo agua."
        ),
        "color": getColorPkmByKey("castform-rainy"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-snowy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima nevado. Es de tipo hielo."
        ),
        "color": getColorPkmByKey("castform-snowy"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "castform-snowy":
  {
    "forms": [
      {
        "apiKey": "castform",
        "desc": (
          "Es la forma estándar de CastForm cuando no hay clima soleado, lluvioso " +
          "o nevado. Es de tipo normal."
        ),
        "color": getColorPkmByKey("castform"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-sunny",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima soleado. Es de tipo fuego."
        ),
        "color": getColorPkmByKey("castform-sunny"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-rainy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima lluvioso. Es de tipo agua."
        ),
        "color": getColorPkmByKey("castform-rainy"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "castform-snowy",
        "desc": (
          "Es la forma que adopta CastForm en combate cuando hay clima nevado. Es de tipo hielo."
        ),
        "color": getColorPkmByKey("castform-snowy"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "wormadam-plant":
  {
    "forms": [
      {
        "apiKey": "wormadam-plant",
        "desc": (
          "Esta es la forma que posee después de combatir en hierba alta, bosques o lugares al aire libre."
        ),
        "color": getColorPkmByKey("wormadam-plant"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wormadam-sandy",
        "desc": (
          "Esta es la forma que posee después de combatir en cuevas, playas o árboles con miel."
        ),
        "color": getColorPkmByKey("wormadam-sandy"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wormadam-trash",
        "desc": (
          "Esta es la forma que posee después de combatir dentro de edificios o construcciones."
        ),
        "color": getColorPkmByKey("wormadam-trash"),
        "needFetch": true,
        "enableNavigation": true
      }  
    ]
  },
  "wormadam-sandy":
  {
    "forms": [
      {
        "apiKey": "wormadam-plant",
        "desc": (
          "Esta es la forma que posee después de combatir en hierba alta, bosques o lugares al aire libre."
        ),
        "color": getColorPkmByKey("wormadam-plant"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wormadam-sandy",
        "desc": (
          "Esta es la forma que posee después de combatir en cuevas, playas o árboles con miel."
        ),
        "color": getColorPkmByKey("wormadam-sandy"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wormadam-trash",
        "desc": (
          "Esta es la forma que posee después de combatir dentro de edificios o construcciones."
        ),
        "color": getColorPkmByKey("wormadam-trash"),
        "needFetch": true,
        "enableNavigation": true
      }  
    ]
  },
  "wormadam-trash":
  {
    "forms": [
      {
        "apiKey": "wormadam-plant",
        "desc": (
          "Esta es la forma que posee después de combatir en hierba alta, bosques o lugares al aire libre."
        ),
        "color": getColorPkmByKey("wormadam-plant"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wormadam-sandy",
        "desc": (
          "Esta es la forma que posee después de combatir en cuevas, playas o árboles con miel."
        ),
        "color": getColorPkmByKey("wormadam-sandy"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wormadam-trash",
        "desc": (
          "Esta es la forma que posee después de combatir dentro de edificios o construcciones."
        ),
        "color": getColorPkmByKey("wormadam-trash"),
        "needFetch": true,
        "enableNavigation": true
      }  
    ]
  },

  "burmy":
  {
    "forms": [
      {
        "display": "Burmy Tronco Planta",
        "desc": (
          "Esta es la forma que posee después de combatir en hierba alta, bosques o lugares al " + 
          "aire libre. También es la forma con la que aparece salvaje en los árboles con miel."
        ),
        "color": getColorPkmByKey("burmy-plant"),
        "img": "/assets/fotosFormas/burmyFormas/burmy-plant.png",
        "imgShiny": "/assets/fotosFormas/burmyFormas/burmy-plant_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Burmy Tronco Arena",
        "desc": (
          "Esta es la forma que posee después de combatir en cuevas, playas o árboles con miel."
        ),
        "color": getColorPkmByKey("burmy-sandy"),
        "img": "/assets/fotosFormas/burmyFormas/burmy-sandy.png",
        "imgShiny": "/assets/fotosFormas/burmyFormas/burmy-sandy_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Burmy Tronco Basura",
        "desc": (
          "Esta es la forma que posee después de combatir dentro de edificios o construcciones."
        ),
        "color": getColorPkmByKey("burmy-trash"),
        "img": "/assets/fotosFormas/burmyFormas/burmy-trash.png",
        "imgShiny": "/assets/fotosFormas/burmyFormas/burmy-trash_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "kyogre":
  {
    "forms": [
      {
        "apiKey": "kyogre",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyogre-primal",
        "desc": (
          "Es capaz de adoptar esta forma si posee el objeto Prisma Azul equipado en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "kyogre-primal":
  {
    "forms": [
      {
        "apiKey": "kyogre",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyogre-primal",
        "desc": (
          "Es capaz de adoptar esta forma si posee el objeto Prisma Azul equipado en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "groudon":
  {
    "forms": [
      {
        "apiKey": "groudon",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "groudon-primal",
        "desc": (
          "Es capaz de adoptar esta forma si posee el objeto Prisma Rojo equipado en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "groudon-primal":
  {
    "forms": [
      {
        "apiKey": "groudon",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "groudon-primal",
        "desc": (
          "Es capaz de adoptar esta forma si posee el objeto Prisma Rojo equipado en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "cherrim":
  {
    "forms": [
      {
        "display": "Cherrim Forma encapotada",
        "desc": (
          "Es la forma habitual de Cherrim siempre que no haya clima soleado en combate."
        ),
        "id": 421,
        "img": officialArtworkUrl(421),
        "imgShiny": shinyArtworkUrl(421),
        "color": getColorPkmByKey("cherrim"),
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Cherrim Forma soleada",
        "desc": (
          "Esta es la forma que adquiere en combate cuando hay clima soleado. " +
          "Al terminar el combate vuelve a su forma Encapotada."
        ),
        "img": "/assets/fotosFormas/cherrimFormas/cherrim-sunshine.png",
        "imgShiny": "/assets/fotosFormas/cherrimFormas/cherrim-sunshine_shiny.png",
        "color": getColorPkmByKey("cherrim-sunshine"),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "meloetta-aria":
  {
    "forms": [
      {
        "apiKey": "meloetta-aria",
        "desc": (
          "Meloetta cambia de forma cada vez que utiliza el movimiento canto arcaico en combate. " +
          "En esta forma su ataque especial y defensa especial son muy altos."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meloetta-pirouette",
        "desc": (
          "Meloetta cambia de forma cada vez que utiliza el movimiento canto arcaico en combate. " +
          "En esta forma su ataque físico y su velocidad son muy altos."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "meloetta-pirouette":
  {
    "forms": [
      {
        "apiKey": "meloetta-aria",
        "desc": (
          "Meloetta cambia de forma cada vez que utiliza el movimiento canto arcaico en combate. " +
          "En esta forma su ataque especial y defensa especial son muy altos."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meloetta-pirouette",
        "desc": (
          "Meloetta cambia de forma cada vez que utiliza el movimiento canto arcaico en combate. " +
          "En esta forma su ataque físico y su velocidad son muy altos."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "aegislash-shield":
  {
    "forms": [
      {
        "apiKey": "aegislash-shield",
        "desc": (
          "Adopta esta forma al utilizar su movimiento característico Escudo Real. En esta " +
          "forma sus estadísticas defensivas son muy altas y es inmune a los movimientos de " +
          "cambio de estados."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "aegislash-blade",
        "desc": (
          "Adopta esta forma al utilizar un movimiento ofensivo físico o especial. En esta " +
          "forma sus estadísticas ofensivas son muy altas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "aegislash-blade":
  {
    "forms": [
      {
        "apiKey": "aegislash-shield",
        "desc": (
          "Adopta esta forma al utilizar su movimiento característico Escudo Real. En esta " +
          "forma sus estadísticas defensivas son muy altas y es inmune a los movimientos de " +
          "cambio de estados."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "aegislash-blade",
        "desc": (
          "Adopta esta forma al utilizar un movimiento ofensivo físico o especial. En esta " +
          "forma sus estadísticas ofensivas son muy altas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "wishiwashi-solo":
  {
    "forms": [
      {
        "apiKey": "wishiwashi-solo",
        "desc": (
          "Posee esta forma de manera permanente si su nivel es menor a 20. Si es nivel 20 o más, " +
          "adopta esta forma en combate si sus PS se reducen al 25% o menos de sus PS máximos."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wishiwashi-school",
        "desc": (
          "Si es nivel 20 o más, adopta esta forma en combate si sus PS están por encima " +
          "del 25% de sus PS máximos."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "wishiwashi-school":
  {
    "forms": [
      {
        "apiKey": "wishiwashi-solo",
        "desc": (
          "Posee esta forma de manera permanente si su nivel es menor a 20. Si es nivel 20 o más, " +
          "adopta esta forma en combate si sus PS se reducen al 25% o menos de sus PS máximos."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "wishiwashi-school",
        "desc": (
          "Si es nivel 20 o más, adopta esta forma en combate si sus PS están por encima " +
          "del 25% de sus PS máximos."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "eiscue-ice":
  {
    "forms": [
      {
        "apiKey": "eiscue-ice",
        "desc": (
          "En esta forma es capaz de recibir un solo ataque físico sin sufrir daño, pero " +
          "pasará a su forma cara deshielo. Se caracteriza por tener altas defensas y una " +
          "velocidad reducida. Posee esta forma al entrar como al salir de combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "eiscue-noice",
        "desc": (
          "Adquiere esta forma en combate luego de recibir un ataque físico. En esta forma " +
          "sus características de defensa bajan y su velocidad aumenta. Si está nevando pasara " +
          "a su forma cara de hielo."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "eiscue-noice":
  {
    "forms": [
      {
        "apiKey": "eiscue-ice",
        "desc": (
          "En esta forma es capaz de recibir un solo ataque físico sin sufrir daño, pero " +
          "pasará a su forma cara deshielo. Se caracteriza por tener altas defensas y una " +
          "velocidad reducida. Posee esta forma al entrar como al salir de combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "eiscue-noice",
        "desc": (
          "Adquiere esta forma en combate luego de recibir un ataque físico. En esta forma " +
          "sus características de defensa bajan y su velocidad aumenta. Si está nevando pasara " +
          "a su forma cara de hielo."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "zygarde-10":
  {
    "forms": [
      {
        "apiKey": "zygarde-10",
        "desc": (
          "Esta es la forma de Zygarde al poseer el 10% de sus células. Solo si tiene la habilidad " +
          "agrupamiento, puede pasar a su forma completa cuando su salud se reduce a la mitad o menos."
        ),
        "color": getColorPkmByKey("zygarde-10"),
        "extraAbilities": ["power-construct"],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zygarde-50",
        "desc": (
          "Esta es la forma de Zygarde al poseer la mitad de sus células. Solo si tiene la habilidad " +
          "agrupamiento, puede pasar a su forma completa cuando su salud se reduce a la mitad o menos."
        ),
        "color": getColorPkmByKey("zygarde-50"),
        "extraAbilities": ["power-construct"],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zygarde-complete",
        "desc": (
          "Es la forma definitiva que adopta Zygarde cuando se logran reunir todas las células."
        ),
        "color": getColorPkmByKey("zygarde-complete"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zygarde-50":
  {
    "forms": [
      {
        "apiKey": "zygarde-10",
        "desc": (
          "Esta es la forma de Zygarde al poseer el 10% de sus células. Solo si tiene la habilidad " +
          "agrupamiento, puede pasar a su forma completa cuando su salud se reduce a la mitad o menos."
        ),
        "color": getColorPkmByKey("zygarde-10"),
        "extraAbilities": ["power-construct"],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zygarde-50",
        "desc": (
          "Esta es la forma de Zygarde al poseer la mitad de sus células. Solo si tiene la habilidad " +
          "agrupamiento, puede pasar a su forma completa cuando su salud se reduce a la mitad o menos."
        ),
        "color": getColorPkmByKey("zygarde-50"),
        "extraAbilities": ["power-construct"],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zygarde-complete",
        "desc": (
          "Es la forma definitiva que adopta Zygarde cuando se logran reunir todas las células."
        ),
        "color": getColorPkmByKey("zygarde-complete"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zygarde-complete":
  {
    "forms": [
      {
        "apiKey": "zygarde-10",
        "desc": (
          "Esta es la forma de Zygarde al poseer el 10% de sus células. Solo si tiene la habilidad " +
          "agrupamiento, puede pasar a su forma completa cuando su salud se reduce a la mitad o menos."
        ),
        "color": getColorPkmByKey("zygarde-10"),
        "extraAbilities": ["power-construct"],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zygarde-50",
        "desc": (
          "Esta es la forma de Zygarde al poseer la mitad de sus células. Solo si tiene la habilidad " +
          "agrupamiento, puede pasar a su forma completa cuando su salud se reduce a la mitad o menos."
        ),
        "color": getColorPkmByKey("zygarde-50"),
        "extraAbilities": ["power-construct"],
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zygarde-complete",
        "desc": (
          "Es la forma definitiva que adopta Zygarde cuando se logran reunir todas las células."
        ),
        "color": getColorPkmByKey("zygarde-complete"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "minior-red-meteor":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "minior-red":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "minior-orange":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "minior-yellow":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "minior-green":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "minior-blue":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "minior-indigo":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "minior-violet":
  {
    "forms": [
      {
        "apiKey": "minior-red-meteor",
        "display": "Minior Meteorito",
        "desc": (
          "Es la forma que posee Minior al entrar en combate si sus PS están por encima del 50% de " +
          "sus PS maximos. En esta forma es inmune a los problemas de estado."
        ),
        "id": 774,
        "img": officialArtworkUrl(774),
        "imgShiny": shinyArtworkUrl(774),
        "weight": 40,
        "color": getColorPkmByKey("minior-red-meteor"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-red",
        "display": "Minior Núcleo Rojo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10136,
        "img": officialArtworkUrl(10136),
        "imgShiny": shinyArtworkUrl(10136),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-red"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-orange",
        "display": "Minior Núcleo Naranja",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10137,
        "img": officialArtworkUrl(10137),
        "imgShiny": shinyArtworkUrl(10137),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-orange"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-yellow",
        "display": "Minior Núcleo Amarillo",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10138,
        "img": officialArtworkUrl(10138),
        "imgShiny": shinyArtworkUrl(10138),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-yellow"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-green",
        "display": "Minior Núcleo Verde",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10139,
        "img": officialArtworkUrl(10139),
        "imgShiny": shinyArtworkUrl(10139),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-green"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-blue",
        "display": "Minior Núcleo Azul",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10140,
        "img": officialArtworkUrl(10140),
        "imgShiny": shinyArtworkUrl(10140),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-blue"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-indigo",
        "display": "Minior Núcleo Añil",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10141,
        "img": officialArtworkUrl(10141),
        "imgShiny": shinyArtworkUrl(10141),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-indigo"),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "minior-violet",
        "display": "Minior Núcleo Violeta",
        "desc": (
          "Minior puede adoptar esta forma en combate si sus PS están por debajo del 50% de sus PS " +
          "máximos. En esta forma bajan sus estadísticas de defensas, pero aumentan " +
          "sus ataques y su velocidad."
        ),
        "id": 10142,
        "img": officialArtworkUrl(10142),
        "imgShiny": shinyArtworkUrl(10142),
        "weight": 0.3,
        "color": getColorPkmByKey("minior-violet"),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },

  "mimikyu-disguised":
  {
    "forms": [
      {
        "apiKey": "mimikyu-disguised",
        "display": "Mimikyu Forma encubierta",
        "desc": (
          "Esta es la forma que posee Mimikyu cuando todavía no recibió ningún ataque."
        ),
        "needFetch": true,
        "enableNavigation": false
      },
      {
        "display": "Mimikyu Forma descubierta",
        "desc": (
          "Esta es la forma que posee Mimikyu cuando ya recibió un ataque."
        ),
        "id": 10143,
        "img": homeArtworkUrl(10143),
        "imgShiny": homeShinyArtworkUrl(10143),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "necrozma":
  {
    "forms": [
      {
        "apiKey": "necrozma",
        "region": "original",
        "color": getColorPkmByKey("necrozma"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dusk",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Solgaleo en el " +
          "equipo mediante el objeto Necrosol."
        ),
        "color": getColorPkmByKey("necrozma-dusk"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dawn",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Lunala en el equipo " +
          "mediante el objeto Necroluna."
        ),
        "color": getColorPkmByKey("necrozma-dawn"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-ultra",
        "desc": (
          "Adquiere esta forma al equiparle a Necrozma melena crepuscular o a Necrozma alas " +
          "del alba un Ultranecrostal Z y sufrir el fenómeno de Ultraexplosión durante un combate."
        ),
        "color": getColorPkmByKey("necrozma-ultra"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "necrozma-dusk":
  {
    "forms": [
      {
        "apiKey": "necrozma",
        "region": "original",
        "color": getColorPkmByKey("necrozma"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dusk",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Solgaleo en el " +
          "equipo mediante el objeto Necrosol."
        ),
        "color": getColorPkmByKey("necrozma-dusk"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dawn",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Lunala en el equipo " +
          "mediante el objeto Necroluna."
        ),
        "color": getColorPkmByKey("necrozma-dawn"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-ultra",
        "desc": (
          "Adquiere esta forma al equiparle a Necrozma melena crepuscular o a Necrozma alas " +
          "del alba un Ultranecrostal Z y sufrir el fenómeno de Ultraexplosión durante un combate."
        ),
        "color": getColorPkmByKey("necrozma-ultra"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "necrozma-dawn":
  {
    "forms": [
      {
        "apiKey": "necrozma",
        "region": "original",
        "color": getColorPkmByKey("necrozma"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dusk",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Solgaleo en el " +
          "equipo mediante el objeto Necrosol."
        ),
        "color": getColorPkmByKey("necrozma-dusk"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dawn",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Lunala en el equipo " +
          "mediante el objeto Necroluna."
        ),
        "color": getColorPkmByKey("necrozma-dawn"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-ultra",
        "desc": (
          "Adquiere esta forma al equiparle a Necrozma melena crepuscular o a Necrozma alas " +
          "del alba un Ultranecrostal Z y sufrir el fenómeno de Ultraexplosión durante un combate."
        ),
        "color": getColorPkmByKey("necrozma-ultra"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "necrozma-ultra":
  {
    "forms": [
      {
        "apiKey": "necrozma",
        "region": "original",
        "color": getColorPkmByKey("necrozma"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dusk",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Solgaleo en el " +
          "equipo mediante el objeto Necrosol."
        ),
        "color": getColorPkmByKey("necrozma-dusk"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-dawn",
        "desc": (
          "Esta es la forma que adquiere Necrozma fusionándolo con Lunala en el equipo " +
          "mediante el objeto Necroluna."
        ),
        "color": getColorPkmByKey("necrozma-dawn"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "necrozma-ultra",
        "desc": (
          "Adquiere esta forma al equiparle a Necrozma melena crepuscular o a Necrozma alas " +
          "del alba un Ultranecrostal Z y sufrir el fenómeno de Ultraexplosión durante un combate."
        ),
        "color": getColorPkmByKey("necrozma-ultra"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "cramorant":
  {
    "forms": [
      {
        "apiKey": "cramorant",
        "region": "original",
        "needFetch": true,
        "enableNavigation": false
      },
      {
        "display": "Cramorant Forma tragatodo",
        "desc": (
          "Esta forma es la que adquiere Cramorant en combate después de utilizar buceo o surf " +
          "cuando posee más de la mitad de PS, volviendo con un Arrokuda en el pico. Al ser " +
          "golpeado en esta forma, dispara el Arrokuda al Pokémon que lo golpeó, restándole un " +
          "25% de sus PS máximos y reduciendo su defensa física en un nivel. Después de eso vuelve" +
          "a su forma habitual."
        ),
        "id": 10182,
        "img": homeArtworkUrl(10182),
        "imgShiny": homeShinyArtworkUrl(10182),
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Cramorant Forma engulletodo",
        "desc": (
          "Esta forma es la que adquiere Cramorant en combate después de utilizar buceo o surf " +
          "cuando posee la mitad o menos de sus PS máximos, volviendo con un Pikachu en el pico. Al ser " +
          "golpeado en esta forma, dispara el Pikachu al Pokémon que lo golpeó, restándole un 25% de " +
          "sus PS máximos y dejándolo paralizado. Después de eso vuelve a su forma habitual."
        ),
        "id": 10183,
        "img": homeArtworkUrl(10183),
        "imgShiny": homeShinyArtworkUrl(10183),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "morpeko-full-belly":
  {
    "forms": [
      {
        "apiKey": "morpeko-full-belly",
        "display": "Morpeko Forma saciada",
        "desc": (
          "Esta es la forma habitual de Morpeko fuera de combate y al entrar por primera vez al mismo. " +
          "En esta forma su movimiento característico, Rueda Aural, es de tipo eléctrico. Al terminar " +
          "el turno pasa a su forma Voraz."
        ),
        "needFetch": true,
        "enableNavigation": false
      },
      {
        "display": "Morpeko Forma voraz",
        "desc": (
          "En esta forma su movimiento característico, Rueda Aural, es de tipo siniestro. Al terminar " +
          "el turno pasa a su forma Saciada."
        ),
        "id": 10187,
        "img": officialArtworkUrl(10187),
        "imgShiny": shinyArtworkUrl(10187),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "zacian":
  {
    "forms": [
      {
        "apiKey": "zacian",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zacian-crowned",
        "desc": (
          "Esta es la forma que adquiere Zacian en combate si tiene equipado el objeto Espada Oxidada. Si " +
          "Zacian conoce cabeza de hierro, este se transformará en Tajo Supremo, su movimiento característico."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zacian-crowned":
  {
    "forms": [
      {
        "apiKey": "zacian",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zacian-crowned",
        "desc": (
          "Esta es la forma que adquiere Zacian en combate si tiene equipado el objeto Espada Oxidada. Si " +
          "Zacian conoce cabeza de hierro, este se transformará en Tajo Supremo, su movimiento característico."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "zamazenta":
  {
    "forms": [
      {
        "apiKey": "zamazenta",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zamazenta-crowned",
        "desc": (
          "Esta es la forma que adquiere Zamazenta en combate si tiene equipado el objeto Escudo Oxidado. " +
          "Si Zamazenta conoce cabeza de hierro, este se transformará en Embate Supremo, su movimiento " +
          "característico."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "zamazenta-crowned":
  {
    "forms": [
      {
        "apiKey": "zamazenta",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "zamazenta-crowned",
        "desc": (
          "Esta es la forma que adquiere Zamazenta en combate si tiene equipado el objeto Escudo Oxidado. " +
          "Si Zamazenta conoce cabeza de hierro, este se transformará en Embate Supremo, su movimiento " +
          "característico."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "palafin-zero":
  {
    "forms": [
      {
        "apiKey": "palafin-zero",
        "desc": (
          "Esta es la forma que habitual de Palafin y la forma que posee al entrar por primera vez en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "palafin-hero",
        "desc": (
          "Esta es la forma que adquiere Palafin cuando vuelve a entrar en combate. Mantiene esta " +
          "forma durante todo el combate, al finalizar el mismo vuelve a su forma ingenua."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "palafin-hero":
  {
    "forms": [
      {
        "apiKey": "palafin-zero",
        "desc": (
          "Esta es la forma que habitual de Palafin y la forma que posee al entrar por primera vez en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "palafin-hero",
        "desc": (
          "Esta es la forma que adquiere Palafin cuando vuelve a entrar en combate. Mantiene esta " +
          "forma durante todo el combate, al finalizar el mismo vuelve a su forma ingenua."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "terapagos":
  {
    "forms": [
      {
        "apiKey": "terapagos",
        "desc": (
          "Es la forma habitual de Terapagos. Su habilidad Teracambio, le permite cambiar de forma a " +
          "Terapagos Forma Teracristal en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "terapagos-terastal",
        "desc": (
          "Adquiere esta forma al entrar en combate gracias a su habilidad Teracambio, una vez adopta " +
          "esta forma su habilidad pasa a ser Teracaparazón."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "terapagos-stellar",
        "desc": (
          "Adquiere esta forma en combate al utilizar la Teracristalización. Su habilidad pasa a ser " +
          "Teraformación 0. Su teratipo siempre es Astral y no se puede cambiar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "terapagos-terastal":
  {
    "forms": [
      {
        "apiKey": "terapagos",
        "desc": (
          "Es la forma habitual de Terapagos. Su habilidad Teracambio, le permite cambiar de forma a " +
          "Terapagos Forma Teracristal en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "terapagos-terastal",
        "desc": (
          "Adquiere esta forma al entrar en combate gracias a su habilidad Teracambio, una vez adopta " +
          "esta forma su habilidad pasa a ser Teracaparazón."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "terapagos-stellar",
        "desc": (
          "Adquiere esta forma en combate al utilizar la Teracristalización. Su habilidad pasa a ser " +
          "Teraformación 0. Su teratipo siempre es Astral y no se puede cambiar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "terapagos-stellar":
  {
    "forms": [
      {
        "apiKey": "terapagos",
        "desc": (
          "Es la forma habitual de Terapagos. Su habilidad Teracambio, le permite cambiar de forma a " +
          "Terapagos Forma Teracristal en combate."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "terapagos-terastal",
        "desc": (
          "Adquiere esta forma al entrar en combate gracias a su habilidad Teracambio, una vez adopta " +
          "esta forma su habilidad pasa a ser Teracaparazón."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "terapagos-stellar",
        "desc": (
          "Adquiere esta forma en combate al utilizar la Teracristalización. Su habilidad pasa a ser " +
          "Teraformación 0. Su teratipo siempre es Astral y no se puede cambiar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "deoxys-normal":
  {
    "forms": [
      {
        "apiKey": "deoxys-normal",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma sus ataques y velocidad están equilibrados."
        ),
        "id": 386,
        "img": officialArtworkUrl(386),
        "imgShiny": shinyArtworkUrl(386),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-attack",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su ataque y ataque especial son más altos."
        ),
        "id": 10001,
        "img": officialArtworkUrl(10001),
        "imgShiny": shinyArtworkUrl(10001),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-defense",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su defensa y defensa especial son más altas."
        ),
        "id": 10002,
        "img": officialArtworkUrl(10002),
        "imgShiny": shinyArtworkUrl(10002),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-speed",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su velocidad es más alta."
        ),
        "id": 10003,
        "img": officialArtworkUrl(10003),
        "imgShiny": shinyArtworkUrl(10003),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "deoxys-attack":
  {
    "forms": [
      {
        "apiKey": "deoxys-normal",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma sus ataques y velocidad están equilibrados."
        ),
        "id": 386,
        "img": officialArtworkUrl(386),
        "imgShiny": shinyArtworkUrl(386),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-attack",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su ataque y ataque especial son más altos."
        ),
        "id": 10001,
        "img": officialArtworkUrl(10001),
        "imgShiny": shinyArtworkUrl(10001),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-defense",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su defensa y defensa especial son más altas."
        ),
        "id": 10002,
        "img": officialArtworkUrl(10002),
        "imgShiny": shinyArtworkUrl(10002),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-speed",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su velocidad es más alta."
        ),
        "id": 10003,
        "img": officialArtworkUrl(10003),
        "imgShiny": shinyArtworkUrl(10003),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "deoxys-defense":
  {
    "forms": [
      {
        "apiKey": "deoxys-normal",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma sus ataques y velocidad están equilibrados."
        ),
        "id": 386,
        "img": officialArtworkUrl(386),
        "imgShiny": shinyArtworkUrl(386),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-attack",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su ataque y ataque especial son más altos."
        ),
        "id": 10001,
        "img": officialArtworkUrl(10001),
        "imgShiny": shinyArtworkUrl(10001),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-defense",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su defensa y defensa especial son más altas."
        ),
        "id": 10002,
        "img": officialArtworkUrl(10002),
        "imgShiny": shinyArtworkUrl(10002),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-speed",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su velocidad es más alta."
        ),
        "id": 10003,
        "img": officialArtworkUrl(10003),
        "imgShiny": shinyArtworkUrl(10003),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },
  "deoxys-speed":
  {
    "forms": [
      {
        "apiKey": "deoxys-normal",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma sus ataques y velocidad están equilibrados."
        ),
        "id": 386,
        "img": officialArtworkUrl(386),
        "imgShiny": shinyArtworkUrl(386),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-attack",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su ataque y ataque especial son más altos."
        ),
        "id": 10001,
        "img": officialArtworkUrl(10001),
        "imgShiny": shinyArtworkUrl(10001),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-defense",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su defensa y defensa especial son más altas."
        ),
        "id": 10002,
        "img": officialArtworkUrl(10002),
        "imgShiny": shinyArtworkUrl(10002),
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "deoxys-speed",
        "desc": (
          "Esta es una de las 4 formas que puede adoptar. En esta forma su velocidad es más alta."
        ),
        "id": 10003,
        "img": officialArtworkUrl(10003),
        "imgShiny": shinyArtworkUrl(10003),
        "needFetch": false,
        "enableNavigation": true
      }
    ]
  },

  "rotom":
  {
    "forms": [
      {
        "apiKey": "rotom",
        "desc": (
          "Esta es la forma habitual de Rotom cuando no está introducido en ningún electrodoméstico. En " +
          "esta forma conoce el movimiento Impactrueno."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-heat",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un Horno microondas. En esta " +
          "forma aprende el movimiento Sofoco."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-wash",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una lavadora. En esta forma " +
          "aprende el movimiento Hidrobomba."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-frost",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una nevera. En esta forma aprende " +
          "el movimiento Ventisca."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-fan",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un ventilador. En esta forma " +
          "aprende el movimiento Tajo Aéreo."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-mow",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un cortacésped. En esta forma " +
          "aprende el movimiento Lluevehojas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "rotom-heat":
  {
    "forms": [
      {
        "apiKey": "rotom",
        "desc": (
          "Esta es la forma habitual de Rotom cuando no está introducido en ningún electrodoméstico. En " +
          "esta forma conoce el movimiento Impactrueno."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-heat",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un Horno microondas. En esta " +
          "forma aprende el movimiento Sofoco."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-wash",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una lavadora. En esta forma " +
          "aprende el movimiento Hidrobomba."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-frost",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una nevera. En esta forma aprende " +
          "el movimiento Ventisca."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-fan",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un ventilador. En esta forma " +
          "aprende el movimiento Tajo Aéreo."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-mow",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un cortacésped. En esta forma " +
          "aprende el movimiento Lluevehojas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "rotom-wash":
  {
    "forms": [
      {
        "apiKey": "rotom",
        "desc": (
          "Esta es la forma habitual de Rotom cuando no está introducido en ningún electrodoméstico. En " +
          "esta forma conoce el movimiento Impactrueno."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-heat",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un Horno microondas. En esta " +
          "forma aprende el movimiento Sofoco."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-wash",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una lavadora. En esta forma " +
          "aprende el movimiento Hidrobomba."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-frost",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una nevera. En esta forma aprende " +
          "el movimiento Ventisca."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-fan",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un ventilador. En esta forma " +
          "aprende el movimiento Tajo Aéreo."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-mow",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un cortacésped. En esta forma " +
          "aprende el movimiento Lluevehojas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "rotom-frost":
  {
    "forms": [
      {
        "apiKey": "rotom",
        "desc": (
          "Esta es la forma habitual de Rotom cuando no está introducido en ningún electrodoméstico. En " +
          "esta forma conoce el movimiento Impactrueno."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-heat",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un Horno microondas. En esta " +
          "forma aprende el movimiento Sofoco."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-wash",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una lavadora. En esta forma " +
          "aprende el movimiento Hidrobomba."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-frost",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una nevera. En esta forma aprende " +
          "el movimiento Ventisca."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-fan",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un ventilador. En esta forma " +
          "aprende el movimiento Tajo Aéreo."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-mow",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un cortacésped. En esta forma " +
          "aprende el movimiento Lluevehojas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "rotom-fan":
  {
    "forms": [
      {
        "apiKey": "rotom",
        "desc": (
          "Esta es la forma habitual de Rotom cuando no está introducido en ningún electrodoméstico. En " +
          "esta forma conoce el movimiento Impactrueno."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-heat",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un Horno microondas. En esta " +
          "forma aprende el movimiento Sofoco."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-wash",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una lavadora. En esta forma " +
          "aprende el movimiento Hidrobomba."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-frost",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una nevera. En esta forma aprende " +
          "el movimiento Ventisca."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-fan",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un ventilador. En esta forma " +
          "aprende el movimiento Tajo Aéreo."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-mow",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un cortacésped. En esta forma " +
          "aprende el movimiento Lluevehojas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "rotom-mow":
  {
    "forms": [
      {
        "apiKey": "rotom",
        "desc": (
          "Esta es la forma habitual de Rotom cuando no está introducido en ningún electrodoméstico. En " +
          "esta forma conoce el movimiento Impactrueno."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-heat",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un Horno microondas. En esta " +
          "forma aprende el movimiento Sofoco."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-wash",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una lavadora. En esta forma " +
          "aprende el movimiento Hidrobomba."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-frost",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en una nevera. En esta forma aprende " +
          "el movimiento Ventisca."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-fan",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un ventilador. En esta forma " +
          "aprende el movimiento Tajo Aéreo."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "rotom-mow",
        "desc": (
          "Esta es la forma que adquiere Rotom cuando es introducido en un cortacésped. En esta forma " +
          "aprende el movimiento Lluevehojas."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "dialga":
  {
    "forms": [
      {
        "apiKey": "dialga",
        "display": "Dialga Forma Normal",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "dialga-origin",
        "desc": (
          "Esta es la forma que adopta Dialga cuando tiene equipado el objeto Gran Diamansfera."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "dialga-origin":
  {
    "forms": [
      {
        "apiKey": "dialga",
        "display": "Dialga Forma Normal",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "dialga-origin",
        "desc": (
          "Esta es la forma que adopta Dialga cuando tiene equipado el objeto Gran Diamansfera."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "palkia":
  {
    "forms": [
      {
        "apiKey": "palkia",
        "display": "Palkia Forma Normal",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "palkia-origin",
        "desc": (
          "Esta es la forma que adopta Palkia cuando tiene equipado el objeto Gran Lustresfera."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "palkia-origin":
  {
    "forms": [
      {
        "apiKey": "palkia",
        "display": "Palkia Forma Normal",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "palkia-origin",
        "desc": (
          "Esta es la forma que adopta Palkia cuando tiene equipado el objeto Gran Lustresfera."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "giratina-altered":
  {
    "forms": [
      {
        "apiKey": "giratina-altered",
        "display": "Giratina Forma Modificada",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "giratina-origin",
        "desc": (
          "Esta es la forma que adopta Giratina cuando tiene equipado el objeto Gran Griseosfera."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "giratina-origin":
  {
    "forms": [
      {
        "apiKey": "giratina-altered",
        "display": "Giratina Forma Modificada",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "giratina-origin",
        "desc": (
          "Esta es la forma que adopta Giratina cuando tiene equipado el objeto Gran Griseosfera."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "shaymin-land":
  {
    "forms": [
      {
        "apiKey": "shaymin-land",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "shaymin-sky",
        "desc": (
          "Esta es la forma que adopta Shaymin si es expuesta a una Gracídea durante el día."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "shaymin-sky":
  {
    "forms": [
      {
        "apiKey": "shaymin-land",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "shaymin-sky",
        "desc": (
          "Esta es la forma que adopta Shaymin si es expuesta a una Gracídea durante el día."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "tornadus-incarnate":
  {
    "forms": [
      {
        "apiKey": "tornadus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tornadus-therian",
        "desc": (
          "Esta es la forma que adopta Tornadus Forma Avatar si es expuesto al espejo veraz. Si vuelve a " +
          "ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "tornadus-therian":
  {
    "forms": [
      {
        "apiKey": "tornadus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "tornadus-therian",
        "desc": (
          "Esta es la forma que adopta Tornadus Forma Avatar si es expuesto al espejo veraz. Si vuelve a " +
          "ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "thundurus-incarnate":
  {
    "forms": [
      {
        "apiKey": "thundurus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "thundurus-therian",
        "desc": (
          "Esta es la forma que adopta Thundurus Forma Avatar si es expuesto al espejo veraz. Si vuelve " +
          "a ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "thundurus-therian":
  {
    "forms": [
      {
        "apiKey": "thundurus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "thundurus-therian",
        "desc": (
          "Esta es la forma que adopta Thundurus Forma Avatar si es expuesto al espejo veraz. Si vuelve " +
          "a ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "landorus-incarnate":
  {
    "forms": [
      {
        "apiKey": "landorus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "landorus-therian",
        "desc": (
          "Esta es la forma que adopta Landorus Forma Avatar si es expuesto al espejo veraz. Si vuelve " +
          "a ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "landorus-therian":
  {
    "forms": [
      {
        "apiKey": "landorus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "landorus-therian",
        "desc": (
          "Esta es la forma que adopta Landorus Forma Avatar si es expuesto al espejo veraz. Si vuelve " +
          "a ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "enamorus-incarnate":
  {
    "forms": [
      {
        "apiKey": "enamorus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "enamorus-therian",
        "desc": (
          "Esta es la forma que adopta Enamorus Forma Avatar si es expuesto al espejo veraz. Si vuelve " +
          "a ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "enamorus-therian":
  {
    "forms": [
      {
        "apiKey": "enamorus-incarnate",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "enamorus-therian",
        "desc": (
          "Esta es la forma que adopta Enamorus Forma Avatar si es expuesto al espejo veraz. Si vuelve " +
          "a ser expuesto regresa a su forma Avatar."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "kyurem":
  {
    "forms": [
      {
        "apiKey": "kyurem",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyurem-white",
        "desc": (
          "Esta es la forma que adquiere Kyurem fusionándolo con Reshiram en el equipo mediante el " +
          "objeto Punta ADN."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyurem-black",
        "desc": (
          "Esta es la forma que adquiere Kyurem fusionándolo con Zekrom en el equipo mediante el " +
          "objeto Punta ADN."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "kyurem-white":
  {
    "forms": [
      {
        "apiKey": "kyurem",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyurem-white",
        "desc": (
          "Esta es la forma que adquiere Kyurem fusionándolo con Reshiram en el equipo mediante el " +
          "objeto Punta ADN."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyurem-black",
        "desc": (
          "Esta es la forma que adquiere Kyurem fusionándolo con Zekrom en el equipo mediante el " +
          "objeto Punta ADN."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "kyurem-black":
  {
    "forms": [
      {
        "apiKey": "kyurem",
        "region": "original",
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyurem-white",
        "desc": (
          "Esta es la forma que adquiere Kyurem fusionándolo con Reshiram en el equipo mediante el " +
          "objeto Punta ADN."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "kyurem-black",
        "desc": (
          "Esta es la forma que adquiere Kyurem fusionándolo con Zekrom en el equipo mediante el " +
          "objeto Punta ADN."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "keldeo-ordinary":
  {
    "forms": [
      {
        "apiKey": "keldeo-ordinary",
        "display": "Keldeo Forma Habitual",
        "region": "original",
        "needFetch": true,
        "enableNavigation": false
      },
      {
        "display": "Keldeo Forma Brío",
        "desc": (
          "Esta es la forma que adopta Keldeo si conoce el movimiento Sable Místico."
        ),
        "id": 10024,
        "img": officialArtworkUrl(10024),
        "imgShiny": shinyArtworkUrl(10024),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "hoopa":
  {
    "forms": [
      {
        "apiKey": "hoopa",
        "desc": (
          "Esta es la forma contenida de Hoopa."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "hoopa-unbound",
        "desc": (
          "Esta es la forma que adopta Hoopa si es expuesto al objeto Vasija Castigo. Si vuelve a ser " +
          "expuesto a la vasija regresa a su forma contenida."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "hoopa-unbound":
  {
    "forms": [
      {
        "apiKey": "hoopa",
        "desc": (
          "Esta es la forma contenida de Hoopa."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "hoopa-unbound",
        "desc": (
          "Esta es la forma que adopta Hoopa si es expuesto al objeto Vasija Castigo. Si vuelve a ser " +
          "expuesto a la vasija regresa a su forma contenida."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "oricorio-baile":
  {
    "forms": [
      {
        "apiKey": "oricorio-baile",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rojo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-baile"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pom-pom",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar amarillo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pom-pom"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pau",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rosa, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pau"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-sensu",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar violeta, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-sensu"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "oricorio-pom-pom":
  {
    "forms": [
      {
        "apiKey": "oricorio-baile",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rojo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-baile"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pom-pom",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar amarillo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pom-pom"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pau",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rosa, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pau"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-sensu",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar violeta, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-sensu"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "oricorio-pau":
  {
    "forms": [
      {
        "apiKey": "oricorio-baile",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rojo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-baile"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pom-pom",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar amarillo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pom-pom"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pau",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rosa, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pau"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-sensu",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar violeta, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-sensu"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "oricorio-sensu":
  {
    "forms": [
      {
        "apiKey": "oricorio-baile",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rojo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-baile"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pom-pom",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar amarillo, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pom-pom"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-pau",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar rosa, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-pau"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oricorio-sensu",
        "desc": (
          "Adquiere esta forma si se usa sobre el Pokémon el objeto Néctar violeta, después de esto " +
          "el objeto se consumirá. Si ya posee esta forma el objeto no tendrá efecto."
        ),
        "color": getColorPkmByKey("oricorio-sensu"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "calyrex":
  {
    "forms": [
      {
        "apiKey": "calyrex",
        "desc": (
          "Esta es la forma habitual de Calyrex."
        ),
        "color": getColorPkmByKey("calyrex"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "calyrex-ice",
        "desc": (
          "Esta es la forma que adquiere Calyrex si se utiliza el objeto Riendas Unión " +
          "con Glastrier en el equipo."
        ),
        "color": getColorPkmByKey("calyrex-ice"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "calyrex-shadow",
        "desc": (
          "Esta es la forma que adquiere Calyrex si se utiliza el objeto Riendas Unión " +
          "con Spectrier en el equipo."
        ),
        "color": getColorPkmByKey("calyrex-shadow"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "calyrex-ice":
  {
    "forms": [
      {
        "apiKey": "calyrex",
        "desc": (
          "Esta es la forma habitual de Calyrex."
        ),
        "color": getColorPkmByKey("calyrex"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "calyrex-ice",
        "desc": (
          "Esta es la forma que adquiere Calyrex si se utiliza el objeto Riendas Unión " +
          "con Glastrier en el equipo."
        ),
        "color": getColorPkmByKey("calyrex-ice"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "calyrex-shadow",
        "desc": (
          "Esta es la forma que adquiere Calyrex si se utiliza el objeto Riendas Unión " +
          "con Spectrier en el equipo."
        ),
        "color": getColorPkmByKey("calyrex-shadow"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "calyrex-shadow":
  {
    "forms": [
      {
        "apiKey": "calyrex",
        "desc": (
          "Esta es la forma habitual de Calyrex."
        ),
        "color": getColorPkmByKey("calyrex"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "calyrex-ice",
        "desc": (
          "Esta es la forma que adquiere Calyrex si se utiliza el objeto Riendas Unión " +
          "con Glastrier en el equipo."
        ),
        "color": getColorPkmByKey("calyrex-ice"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "calyrex-shadow",
        "desc": (
          "Esta es la forma que adquiere Calyrex si se utiliza el objeto Riendas Unión " +
          "con Spectrier en el equipo."
        ),
        "color": getColorPkmByKey("calyrex-shadow"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "urshifu-single-strike":
  {
    "forms": [
      {
        "apiKey": "urshifu-single-strike",
        "desc": (
          "En esta forma Urshifu es de tipo Lucha/Siniestro y su movimiento característico es Golpe Oscuro."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "urshifu-rapid-strike",
        "desc": (
          "En esta forma Urshifu es de tipo Lucha/Agua y su movimiento característico es Azote torrencial."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "urshifu-rapid-strike":
  {
    "forms": [
      {
        "apiKey": "urshifu-single-strike",
        "desc": (
          "En esta forma Urshifu es de tipo Lucha/Siniestro y su movimiento característico es Golpe Oscuro."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "urshifu-rapid-strike",
        "desc": (
          "En esta forma Urshifu es de tipo Lucha/Agua y su movimiento característico es Azote torrencial."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "ogerpon":
  {
    "forms": [
      {
        "apiKey": "ogerpon",
        "desc": (
          "Esta es la forma que adopta Ogerpon cuando no lleva ninguna máscara equipada."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-wellspring-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Fuente equipada."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-hearthflame-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Horno equipada."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-cornerstone-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Cimiento equipada."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "display": "Ogerpon Máscara Turquesa (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Turquesa cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Velocidad en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "types": ["grass"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Velocidad al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Fuente (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Fuente cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa Especial en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "types": ["water"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa Especial al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Horno (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Horno cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Ataque en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "types": ["fire"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta el Ataque al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Cimiento (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Cimiento cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "types": ["rock"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "ogerpon-wellspring-mask":
  {
    "forms": [
      {
        "apiKey": "ogerpon",
        "desc": (
          "Esta es la forma que adopta Ogerpon cuando no lleva ninguna máscara equipada."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-wellspring-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Fuente equipada."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-hearthflame-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Horno equipada."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-cornerstone-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Cimiento equipada."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "display": "Ogerpon Máscara Turquesa (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Turquesa cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Velocidad en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "types": ["grass"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Velocidad al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Fuente (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Fuente cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa Especial en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "types": ["water"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa Especial al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Horno (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Horno cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Ataque en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "types": ["fire"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta el Ataque al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Cimiento (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Cimiento cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "types": ["rock"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "ogerpon-hearthflame-mask":
  {
    "forms": [
      {
        "apiKey": "ogerpon",
        "desc": (
          "Esta es la forma que adopta Ogerpon cuando no lleva ninguna máscara equipada."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-wellspring-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Fuente equipada."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-hearthflame-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Horno equipada."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-cornerstone-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Cimiento equipada."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "display": "Ogerpon Máscara Turquesa (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Turquesa cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Velocidad en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "types": ["grass"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Velocidad al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Fuente (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Fuente cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa Especial en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "types": ["water"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa Especial al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Horno (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Horno cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Ataque en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "types": ["fire"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta el Ataque al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Cimiento (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Cimiento cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "types": ["rock"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "ogerpon-cornerstone-mask":
  {
    "forms": [
      {
        "apiKey": "ogerpon",
        "desc": (
          "Esta es la forma que adopta Ogerpon cuando no lleva ninguna máscara equipada."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-wellspring-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Fuente equipada."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-hearthflame-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Horno equipada."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ogerpon-cornerstone-mask",
        "desc": (
          "Esta es la forma que adopta Ogerpon si lleva la Máscara Cimiento equipada."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "display": "Ogerpon Máscara Turquesa (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Turquesa cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Velocidad en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon"),
        "types": ["grass"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Velocidad al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_verde.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Fuente (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Fuente cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa Especial en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-wellspring-mask"),
        "types": ["water"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa Especial al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_azul.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Horno (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Horno cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Ataque en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-hearthflame-mask"),
        "types": ["fire"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta el Ataque al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_rojo.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Ogerpon Máscara Cimiento (Teracristalizado)",
        "desc": (
          "Esta es la forma que adopta Ogerpon Máscara Cimiento cuando teracristaliza. En esta forma, su habilidad pasa a ser Evocarecuerdos y aumenta su Defensa en un nivel."
        ),
        "color": getColorPkmByKey("ogerpon-cornerstone-mask"),
        "types": ["rock"],
        "abilities": [{
          "apiName": "embody-aspect",
          "display": "Evocarrecuerdos",
          "descHab": "Aumenta la Defensa al entrar en combate."
        }],
        "img": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "imgShiny": "/assets/fotosFormas/ogerponTeraFormas/ogerpon_tera_gris.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "magearna":
  {
    "forms": [
      {
        "apiKey": "magearna",
        "desc": (
          "Forma de Magearna en el tiempo actual."
        ),
        "color": getColorPkmByKey("magearna"),
        "needFetch": true,
        "enableNavigation": false
      },
      {
        "display": "Magearna Color Vetusto",
        "desc": (
          "Forma original que poseía Magearna hace 500 años cuando fue creada."
        ),
        "id": 10147,
        "img": officialArtworkUrl(10147),
        "imgShiny": shinyArtworkUrl(10147),
        "color": getColorPkmByKey("magearna-original"),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "toxtricity-amped":
  {
    "forms": [
      {
        "apiKey": "toxtricity-amped",
        "desc": (
          "Toxtricity adquirirá esta forma si el Toxel del que evoluciona posee una naturaleza " +
          "activa, agitada, alegre, alocada, audaz, dócil, firme, floja, fuerte, grosera, ingenua, " +
          "pícara o rara."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "toxtricity-low-key",
        "desc": (
          "Toxtricity adquirirá esta forma si el Toxel del que evoluciona posee una naturaleza " +
          "afable, amable, cauta, huraña, mansa, miedosa, modesta, osada, plácida, serena, seria o tímida."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "toxtricity-low-key":
  {
    "forms": [
      {
        "apiKey": "toxtricity-amped",
        "desc": (
          "Toxtricity adquirirá esta forma si el Toxel del que evoluciona posee una naturaleza " +
          "activa, agitada, alegre, alocada, audaz, dócil, firme, floja, fuerte, grosera, ingenua, " +
          "pícara o rara."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "toxtricity-low-key",
        "desc": (
          "Toxtricity adquirirá esta forma si el Toxel del que evoluciona posee una naturaleza " +
          "afable, amable, cauta, huraña, mansa, miedosa, modesta, osada, plácida, serena, seria o tímida."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "zarude":
  {
    "forms": [
      {
        "apiKey": "zarude",
        "desc": (
          "Esta es la forma habitual de Zarude."
        ),
        "needFetch": true,
        "enableNavigation": false
      },
      {
        "apiKey": "zarude-dada",
        "desc": (
          "En esta forma puramente estética, Zarude lleva un pañuelo rosa a modo de capa con los " +
          "números 251, haciendo referencia a Celebi ya que es su número en la Pokedex Nacional."
        ),
        "id": 10192,
        "img": officialArtworkUrl(10192),
        "imgShiny": shinyArtworkUrl(10192),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "maushold-family-of-four":
  {
    "forms": [
      {
        "apiKey": "maushold-family-of-four",
        "display": "Maushold Familia de Cuatro",
        "desc": (
          "Esta es la forma más común de Maushold, está compuesta por 2 padres y 2 hijos. Tandemaus " +
          "tiene una probabilidad del 99% de evolucionar a esta forma."
        ),
        "weight": 2.8,
        "img": homeArtworkUrl(925),
        "imgShiny": homeShinyArtworkUrl(925),
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "apiKey": "maushold-family-of-three",
        "desc": (
          "Esta es la forma menos común de Maushold, está compuesta por 2 padres y 1 hijo. Tandemaus " +
          "tiene una probabilidad del 1% de evolucionar a esta forma."
        ),
        "id": 10257,
        "img": homeArtworkUrl(10257),
        "imgShiny": homeShinyArtworkUrl(10257),
        "weight": 2.3,
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "squawkabilly-green-plumage":
  {
    "forms": [
      {
        "apiKey": "squawkabilly-green-plumage",
        "desc": (
          "En esta forma su plumaje es verde y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-green-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-blue-plumage",
        "desc": (
          "En esta forma su plumaje es azul y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-blue-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-yellow-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-yellow-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-white-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-white-plumage"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "squawkabilly-blue-plumage":
  {
    "forms": [
      {
        "apiKey": "squawkabilly-green-plumage",
        "desc": (
          "En esta forma su plumaje es verde y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-green-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-blue-plumage",
        "desc": (
          "En esta forma su plumaje es azul y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-blue-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-yellow-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-yellow-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-white-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-white-plumage"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "squawkabilly-yellow-plumage":
  {
    "forms": [
      {
        "apiKey": "squawkabilly-green-plumage",
        "desc": (
          "En esta forma su plumaje es verde y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-green-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-blue-plumage",
        "desc": (
          "En esta forma su plumaje es azul y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-blue-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-yellow-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-yellow-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-white-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-white-plumage"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "squawkabilly-white-plumage":
  {
    "forms": [
      {
        "apiKey": "squawkabilly-green-plumage",
        "desc": (
          "En esta forma su plumaje es verde y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-green-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-blue-plumage",
        "desc": (
          "En esta forma su plumaje es azul y su habilidad oculta es Agallas."
        ),
        "color": getColorPkmByKey("squawkabilly-blue-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-yellow-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-yellow-plumage"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "squawkabilly-white-plumage",
        "desc": (
          "En esta forma su plumaje es amarillo y su habilidad oculta es Potencia bruta."
        ),
        "color": getColorPkmByKey("squawkabilly-white-plumage"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "tatsugiri-curly":
  {
    "forms": [
      {
        "apiKey": "tatsugiri-curly",
        "display": "Tatsugiri Forma Curvada",
        "desc": (
          "En esta forma Tatsugiri posee un color anaranjado y hace que el movimiento oído cocina aumente el ataque de Dondozo."
        ),
        "color": getColorPkmByKey("tatsugiri-curly"),
        "id": 978,
        "img": officialArtworkUrl(978),
        "imgShiny": shinyArtworkUrl(978),
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Tatsugiri Forma Lánguida",
        "desc": (
          "En esta forma Tatsugiri posee un color rosado y hace que el movimiento oído cocina aumente la defensa de Dondozo."
        ),
        "color": getColorPkmByKey("tatsugiri-droopy"),
        "id": 10258,
        "img": officialArtworkUrl(10258),
        "imgShiny": shinyArtworkUrl(10258),
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Tatsugiri Forma Recta",
        "desc": (
          "En esta forma Tatsugiri posee un color amarillo y hace que el movimiento oído cocina aumente la velocidad de Dondozo."
        ),
        "color": getColorPkmByKey("tatsugiri-stretchy"),
        "id": 10259,
        "img": officialArtworkUrl(10259),
        "imgShiny": shinyArtworkUrl(10259),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "dudunsparce-two-segment":
  {
    "forms": [
      {
        "apiKey": "dudunsparce-two-segment",
        "display": "Dudunsparce Forma Binodular",
        "desc": (
          "En esta forma Dudunsparce posee 2 segmentos y 2 pares de alas. Tiene una probabilidad del 99% de adquirir esta forma al evolucionar de Dunsparce. Todos los Dudunsparce salvajes y de Teraincursiones poseen esta forma."
        ),
        "weight": 39.2,
        "height": 3.6,
        "id": 982,
        "img": homeArtworkUrl(982),
        "imgShiny": homeShinyArtworkUrl(982),
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Dudunsparce Forma Trinodular",
        "desc": (
          "En esta forma Dudunsparce posee 3 segmentos y 3 pares de alas. Tiene una probabilidad del 1% de adquirir esta forma únicamente al evolucionar de Dunsparce."
        ),
        "weight": 47.4,
        "height": 4.5,
        "id": 10255,
        "img": homeArtworkUrl(10255),
        "imgShiny": homeShinyArtworkUrl(10255),
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "gimmighoul":
  {
    "forms": [
      {
        "apiKey": "gimmighoul",
        "desc": (
          "En esta forma, Gimmighoul se encuentra escondido dentro de un cofre y posee más defensa y defensa especial que su forma andante."
        ),
        "color": getColorPkmByKey("gimmighoul"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gimmighoul-roaming",
        "desc": (
          "En esta forma, Gimmighoul lleva una moneda en su espalda y camina libremente. Posee más ataque especial y velocidad que su forma cofre."
        ),
        "color": getColorPkmByKey("gimmighoul-roaming"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "gimmighoul-roaming":
  {
    "forms": [
      {
        "apiKey": "gimmighoul",
        "desc": (
          "En esta forma, Gimmighoul se encuentra escondido dentro de un cofre y posee más defensa y defensa especial que su forma andante."
        ),
        "color": getColorPkmByKey("gimmighoul"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gimmighoul-roaming",
        "desc": (
          "En esta forma, Gimmighoul lleva una moneda en su espalda y camina libremente. Posee más ataque especial y velocidad que su forma cofre."
        ),
        "color": getColorPkmByKey("gimmighoul-roaming"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "meowstic-male":
  {
    "forms": [
      {
        "apiKey": "meowstic-male",
        "desc": (
          "Apariencia que poseen los Meowstic Macho. Su habilidad oculta es Bromista."
        ),
        "color": getColorPkmByKey("meowstic-male"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowstic-female",
        "desc": (
          "Apariencia que poseen los Meowstic Hembra. Su habilidad oculta es Tenacidad."
        ),
        "color": getColorPkmByKey("meowstic-female"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "meowstic-female":
  {
    "forms": [
      {
        "apiKey": "meowstic-male",
        "desc": (
          "Apariencia que poseen los Meowstic Macho. Su habilidad oculta es Bromista."
        ),
        "color": getColorPkmByKey("meowstic-male"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "meowstic-female",
        "desc": (
          "Apariencia que poseen los Meowstic Hembra. Su habilidad oculta es Tenacidad."
        ),
        "color": getColorPkmByKey("meowstic-female"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "pumpkaboo-small":
  {
    "forms": [
      {
        "apiKey": "pumpkaboo-small",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-average",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-large",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-super",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "pumpkaboo-average":
  {
    "forms": [
      {
        "apiKey": "pumpkaboo-small",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-average",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-large",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-super",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "pumpkaboo-large":
  {
    "forms": [
      {
        "apiKey": "pumpkaboo-small",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-average",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-large",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-super",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "pumpkaboo-super":
  {
    "forms": [
      {
        "apiKey": "pumpkaboo-small",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-average",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-large",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "pumpkaboo-super",
        "desc": (
          "Esta es la forma que posee Pumpkaboo en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "gourgeist-small":
  {
    "forms": [
      {
        "apiKey": "gourgeist-small",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-average",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-large",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-super",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "gourgeist-average":
  {
    "forms": [
      {
        "apiKey": "gourgeist-small",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-average",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-large",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-super",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "gourgeist-large":
  {
    "forms": [
      {
        "apiKey": "gourgeist-small",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-average",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-large",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-super",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "gourgeist-super":
  {
    "forms": [
      {
        "apiKey": "gourgeist-small",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño pequeño."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-average",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-large",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño grande."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "gourgeist-super",
        "desc": (
          "Esta es la forma que posee Gourgeist en su tamaño extragrande."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "ursaluna":
  {
    "forms": [
      {
        "apiKey": "ursaluna",
        "desc": (
          "Esta es la forma habitual de Ursaluna."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ursaluna-bloodmoon",
        "desc": (
          "Esta es una forma especial de Ursaluna que puede encontrarse en la Comarca de Noroteo."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "ursaluna-bloodmoon":
  {
    "forms": [
      {
        "apiKey": "ursaluna",
        "desc": (
          "Esta es la forma habitual de Ursaluna."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "ursaluna-bloodmoon",
        "desc": (
          "Esta es una forma especial de Ursaluna que puede encontrarse en la Comarca de Noroteo."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "greninja":
  {
    "forms": [
      {
        "apiKey": "greninja",
        "desc": (
          "Esta es la forma normal de Greninja."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "greninja-ash",
        "desc": (
          "Esta es la forma que adquiere Greninja teniendo la habilidad Fuerte Afecto, después de " +
          "debilitar a un Pokémon en combate. A partir de la novena generación, la habilidad Fuerte " +
          "Afecto ya no cambia su forma, sino que aumenta en +1 su ataque, ataque especial y velocidad " +
          "tras debilitar al primer oponente."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "greninja-ash":
  {
    "forms": [
      {
        "apiKey": "greninja",
        "desc": (
          "Esta es la forma normal de Greninja."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "greninja-ash",
        "desc": (
          "Esta es la forma que adquiere Greninja teniendo la habilidad Fuerte Afecto, después de " +
          "debilitar a un Pokémon en combate. A partir de la novena generación, la habilidad Fuerte " +
          "Afecto ya no cambia su forma, sino que aumenta en +1 su ataque, ataque especial y velocidad " +
          "tras debilitar al primer oponente."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "shellos":
  {
    "forms": [
      {
        "display": "Shellos Mar Oeste",
        "desc": (
          "Esta es la forma que posee Shellos Mar Oeste."
        ),
        "color": getColorPkmByKey("shellos"),
        "id": 422,
        "img": "/assets/fotosFormas/shellosFormas/shellos-west.png",
        "imgShiny": "/assets/fotosFormas/shellosFormas/shellos-west_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Shellos Mar Este",
        "desc": (
          "Esta es la forma que posee Shellos Mar Este."
        ),
        "color": getColorPkmByKey("shellos_este"),
        "img": "/assets/fotosFormas/shellosFormas/shellos-east.png",
        "imgShiny": "/assets/fotosFormas/shellosFormas/shellos-east_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "gastrodon":
  {
    "forms": [
      {
        "display": "Gastrodon Mar Oeste",
        "desc": (
          "Esta es la forma que posee Gastrodon Mar Oeste."
        ),
        "color": getColorPkmByKey("gastrodon"),
        "id": 423,
        "img": "/assets/fotosFormas/gastrodonFormas/gastrodon-west.png",
        "imgShiny": "/assets/fotosFormas/gastrodonFormas/gastrodon-west_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Gastrodon Mar Este",
        "desc": (
          "Esta es la forma que posee Gastrodon Mar Este."
        ),
        "color": getColorPkmByKey("gastrodon_este"),
        "img": "/assets/fotosFormas/gastrodonFormas/gastrodon-east.png",
        "imgShiny": "/assets/fotosFormas/gastrodonFormas/gastrodon-east_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "sinistea":
  {
    "forms": [
      {
        "display": "Sinistea Forma Falsificada",
        "desc": (
          "Esta es la forma más común que puede poseer Sinistea. El 93% de los Sinistea salvajes " +
          "son falsificaciones, además de todos los obtenidos en incursiones (excepto en el nido " +
          "especial del Viejo Cementerio) y mediante crianza. En esta forma el sello de autenticidad " +
          "en la parte inferior de la taza está ausente. Para evolucionar a Polteageist necesita una " +
          "tetera agrietada."
        ),
        "img": "/assets/fotosFormas/sinisteaFormas/sinistea_false.png",
        "imgShiny": "/assets/fotosFormas/sinisteaFormas/sinistea_false.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Sinistea Forma Genuina",
        "desc": (
          "Esta es la forma más rara que puede poseer Sinistea. El 7% de los Sinistea salvajes " +
          "lo son, también pueden ser obtenidos en incursiones en el nido especial del Viejo Cementerio. " +
          "En la parte inferior de la taza posee un sello verde azulado que denota la autenticidad de " +
          "la pieza. Para evolucionar a Polteageist necesita una tetera rota."
        ),
        "id": 854,
        "img": "/assets/fotosFormas/sinisteaFormas/sinistea_true.png",
        "imgShiny": "/assets/fotosFormas/sinisteaFormas/sinistea_true.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "polteageist":
  {
    "forms": [
      {
        "display": "Polteageist Forma Falsificada",
        "desc": (
          "Esta es la forma más común que puede poseer Polteageist. El 93% de los Polteageist " +
          "salvajes son falsificaciones, además de todos los obtenidos en incursiones (excepto " +
          "en el nido especial del Viejo Cementerio) y mediante crianza. En esta forma el " +
          "sello de autenticidad en la parte inferior de la tetera está ausente. Evoluciona " +
          "de un Sinistea usando una tetera agrietada."
        ),
        "img": "/assets/fotosFormas/sinisteaFormas/polteageist_false.png",
        "imgShiny": "/assets/fotosFormas/sinisteaFormas/polteageist_false.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Polteageist Forma Genuina",
        "desc": (
          "Esta es la forma más rara que puede poseer Polteageist. El 7% de los Polteageist salvajes " +
          "lo son, también pueden ser obtenidos en incursiones en el nido especial del Viejo Cementerio. " +
          "En la parte inferior de la tetera posee un sello verde azulado que denota la autenticidad " +
          "de la pieza. Evoluciona de un Sinistea usando una tetera rota."
        ),
        "id": 855,
        "img": "/assets/fotosFormas/sinisteaFormas/polteageist_true.png",
        "imgShiny": "/assets/fotosFormas/sinisteaFormas/polteageist_true.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "poltchageist":
  {
    "forms": [
      {
        "display": "Poltchageist Forma Mediocre",
        "desc": (
          "Esta es la forma más común que puede poseer Poltchageist. 19 de cada 20 de los " +
          "Poltchageist salvajes la poseen. Cualquier Poltchageist de Teraincursión o nacido " +
          "de un huevo tendrá esta forma, independientemente de la forma de los padres. En esta " +
          "forma el sello de autenticidad en la parte inferior de la vasija está ausente. Para " +
          "evolucionar a Sinistcha necesita un cuenco mediocre."
        ),
        "img": "/assets/fotosFormas/sinistchaFormas/poltchageist_false.png",
        "imgShiny": "/assets/fotosFormas/sinistchaFormas/poltchageist_false.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Poltchageist Forma Exquisita",
        "desc": (
          "Esta es la forma más rara que puede poseer Poltchageist. Solo 1 de cada 20 de los " +
          "Poltchageist salvajes lo son. En la parte inferior de la vasija posee un sello gris " +
          "que denota la autenticidad de la pieza. Para evolucionar a Sinistcha " +
          "necesita un cuenco exquisito."
        ),
        "id": 1012,
        "img": "/assets/fotosFormas/sinistchaFormas/poltchageist_true.png",
        "imgShiny": "/assets/fotosFormas/sinistchaFormas/poltchageist_true.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "sinistcha":
  {
    "forms": [
      {
        "display": "Sinistcha Forma Mediocre",
        "desc": (
          "Esta es la forma más común que puede poseer Sinistcha. 30 de cada 31 de los " +
          "Sinistcha salvajes lo son. En esta forma el sello de autenticidad en la parte " +
          "inferior de la taza está ausente. Evoluciona de Poltchageist usando " +
          "un cuenco mediocre."
        ),
        "img": "/assets/fotosFormas/sinistchaFormas/sinistcha_false.png",
        "imgShiny": "/assets/fotosFormas/sinistchaFormas/sinistcha_false.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Sinistcha Forma Exquisita",
        "desc": (
          "Esta es la forma más rara que puede poseer Sinistcha. Solo 1 de cada 31 de los " +
          "Sinistcha lo son. En esta forma presenta un sello de autenticidad de color " +
          "grisáceo en la parte inferior de la taza. Evoluciona de Poltchageist " +
          "usando un cuenco exquisito."
        ),
        "id": 1013,
        "img": "/assets/fotosFormas/sinistchaFormas/sinistcha_true.png",
        "imgShiny": "/assets/fotosFormas/sinistchaFormas/sinistcha_true.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "indeedee-male":
  {
    "forms": [
      {
        "apiKey": "indeedee-male",
        "desc": (
          "Esta es la forma que poseen los Indeedee Macho."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "indeedee-female",
        "desc": (
          "Esta es la forma que poseen los Indeedee Hembra."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "indeedee-female":
  {
    "forms": [
      {
        "apiKey": "indeedee-male",
        "desc": (
          "Esta es la forma que poseen los Indeedee Macho."
        ),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "indeedee-female",
        "desc": (
          "Esta es la forma que poseen los Indeedee Hembra."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "oinkologne-male":
  {
    "forms": [
      {
        "apiKey": "oinkologne-male",
        "desc": (
          "Apariencia que poseen los Oinkologne Macho. Poseen la habilidad Olor persistente."
        ),
        "color": getColorPkmByKey("oinkologne-male"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oinkologne-female",
        "desc": (
          "Apariencia que poseen los Oinkologne Hembra. Poseen la habilidad Velo aroma."
        ),
        "color": getColorPkmByKey("oinkologne-female"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "oinkologne-female":
  {
    "forms": [
      {
        "apiKey": "oinkologne-male",
        "desc": (
          "Apariencia que poseen los Oinkologne Macho. Poseen la habilidad Olor persistente."
        ),
        "color": getColorPkmByKey("oinkologne-male"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "oinkologne-female",
        "desc": (
          "Apariencia que poseen los Oinkologne Hembra. Poseen la habilidad Velo aroma."
        ),
        "color": getColorPkmByKey("oinkologne-female"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "lycanroc-midday":
  {
    "forms": [
      {
        "apiKey": "lycanroc-midday",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando Rockruff evoluciona por el día."
        ),
        "color": getColorPkmByKey("lycanroc-midday"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lycanroc-midnight",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando Rockruff evoluciona por la noche."
        ),
        "color": getColorPkmByKey("lycanroc-midnight"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lycanroc-dusk",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando un Rockruff con la habilidad Ritmo Propio evoluciona por el atardecer."
        ),
        "color": getColorPkmByKey("lycanroc-dusk"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "lycanroc-midnight":
  {
    "forms": [
      {
        "apiKey": "lycanroc-midday",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando Rockruff evoluciona por el día."
        ),
        "color": getColorPkmByKey("lycanroc-midday"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lycanroc-midnight",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando Rockruff evoluciona por la noche."
        ),
        "color": getColorPkmByKey("lycanroc-midnight"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lycanroc-dusk",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando un Rockruff con la habilidad Ritmo Propio evoluciona por el atardecer."
        ),
        "color": getColorPkmByKey("lycanroc-dusk"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "lycanroc-dusk":
  {
    "forms": [
      {
        "apiKey": "lycanroc-midday",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando Rockruff evoluciona por el día."
        ),
        "color": getColorPkmByKey("lycanroc-midday"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lycanroc-midnight",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando Rockruff evoluciona por la noche."
        ),
        "color": getColorPkmByKey("lycanroc-midnight"),
        "needFetch": true,
        "enableNavigation": true
      },
      {
        "apiKey": "lycanroc-dusk",
        "desc": (
          "Esta es la forma que adquiere Lycanroc cuando un Rockruff con la habilidad Ritmo Propio evoluciona por el atardecer."
        ),
        "color": getColorPkmByKey("lycanroc-dusk"),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },

  "flabebe":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("flabebe") + " Flor Roja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("flabebe") + " Flor Roja") + "."
        ),
        "img": "/assets/fotosFormas/flabebeFormas/flabebe-red.png",
        "imgShiny": "/assets/fotosFormas/flabebeFormas/flabebe-red_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("flabebe") + " Flor Amarilla"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("flabebe") + " Flor Amarilla") + "."
        ),
        "img": "/assets/fotosFormas/flabebeFormas/flabebe-yellow.png",
        "imgShiny": "/assets/fotosFormas/flabebeFormas/flabebe-yellow_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("flabebe") + " Flor Naranja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("flabebe") + " Flor Naranja") + "."
        ),
        "img": "/assets/fotosFormas/flabebeFormas/flabebe-orange.png",
        "imgShiny": "/assets/fotosFormas/flabebeFormas/flabebe-orange_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("flabebe") + " Flor Azul"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("flabebe") + " Flor Azul") + "."
        ),
        "img": "/assets/fotosFormas/flabebeFormas/flabebe-blue.png",
        "imgShiny": "/assets/fotosFormas/flabebeFormas/flabebe-blue_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("flabebe") + " Flor Blanca"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("flabebe") + " Flor Blanca") + "."
        ),
        "img": "/assets/fotosFormas/flabebeFormas/flabebe-white.png",
        "imgShiny": "/assets/fotosFormas/flabebeFormas/flabebe-white_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "floette":
  {
    "forms": [
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Roja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Roja") + "."
        ),
        "id": 670,
        "img": "/assets/fotosFormas/floetteFormas/floette-red.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-red_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Amarilla"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Amarilla") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-yellow.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-yellow_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Naranja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Naranja") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-orange.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-orange_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Azul"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Azul") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-blue.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-blue_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Blanca"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Blanca") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-white.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-white_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "apiKey": "floette-eternal",
        "desc": (
          "Esta es la forma que posee Floette Flor Eterna. Es incapaz de evolucionar ni ciriar, el " +
          "objeto mineral evolutivo no tiene efecto sobre el y sus estadisticas son superiores a las " +
          "de un Floette normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "floette-eternal":
  {
    "forms": [
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Roja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Roja") + "."
        ),
        "id": 670,
        "img": "/assets/fotosFormas/floetteFormas/floette-red.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-red_shiny.png",
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Amarilla"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Amarilla") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-yellow.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-yellow_shiny.png",
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Naranja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Naranja") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-orange.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-orange_shiny.png",
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Azul"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Azul") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-blue.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-blue_shiny.png",
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "floette",
        "display": (toPokemonDisplayName("floette") + " Flor Blanca"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("floette") + " Flor Blanca") + "."
        ),
        "img": "/assets/fotosFormas/floetteFormas/floette-white.png",
        "imgShiny": "/assets/fotosFormas/floetteFormas/floette-white_shiny.png",
        "needFetch": false,
        "enableNavigation": true
      },
      {
        "apiKey": "floette-eternal",
        "desc": (
          "Esta es la forma que posee Floette Flor Eterna. Es incapaz de evolucionar ni ciriar, el " +
          "objeto mineral evolutivo no tiene efecto sobre el y sus estadisticas son superiores a las " +
          "de un Floette normal."
        ),
        "needFetch": true,
        "enableNavigation": true
      }
    ]
  },
  "florges":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("florges") + " Flor Roja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("florges") + " Flor Roja") + "."
        ),
        "img": "/assets/fotosFormas/florgesFormas/florges-red.png",
        "imgShiny": "/assets/fotosFormas/florgesFormas/florges-red_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("florges") + " Flor Amarilla"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("florges") + " Flor Amarilla") + "."
        ),
        "img": "/assets/fotosFormas/florgesFormas/florges-yellow.png",
        "imgShiny": "/assets/fotosFormas/florgesFormas/florges-yellow_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("florges") + " Flor Naranja"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("florges") + " Flor Naranja") + "."
        ),
        "img": "/assets/fotosFormas/florgesFormas/florges-orange.png",
        "imgShiny": "/assets/fotosFormas/florgesFormas/florges-orange_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("florges") + " Flor Azul"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("florges") + " Flor Azul") + "."
        ),
        "img": "/assets/fotosFormas/florgesFormas/florges-blue.png",
        "imgShiny": "/assets/fotosFormas/florgesFormas/florges-blue_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("florges") + " Flor Blanca"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("florges") + " Flor Blanca") + "."
        ),
        "img": "/assets/fotosFormas/florgesFormas/florges-white.png",
        "imgShiny": "/assets/fotosFormas/florgesFormas/florges-white_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "deerling":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("deerling") + " Forma Primavera"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("deerling") + " Forma Primavera") + "."
        ),
        "color": "pink",
        "img": "/assets/fotosFormas/deerlingFormas/deerling-primavera.png",
        "imgShiny": "/assets/fotosFormas/deerlingFormas/deerling-primavera_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("deerling") + " Forma Verano"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("deerling") + " Forma Verano") + "."
        ),
        "color": "green",
        "img": "/assets/fotosFormas/deerlingFormas/deerling-verano.png",
        "imgShiny": "/assets/fotosFormas/deerlingFormas/deerling-verano_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("deerling") + " Forma Otoño"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("deerling") + " Forma Otoño") + "."
        ),
        "color": "red",
        "img": "/assets/fotosFormas/deerlingFormas/deerling-otono.png",
        "imgShiny": "/assets/fotosFormas/deerlingFormas/deerling-otono_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("deerling") + " Forma Invierno"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("deerling") + " Forma Invierno") + "."
        ),
        "color": "brown",
        "img": "/assets/fotosFormas/deerlingFormas/deerling-invierno.png",
        "imgShiny": "/assets/fotosFormas/deerlingFormas/deerling-invierno_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "sawsbuck":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("sawsbuck") + " Forma Primavera"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("sawsbuck") + " Forma Primavera") + "."
        ),
        "color": "pink",
        "img": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-primavera.png",
        "imgShiny": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-primavera_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("sawsbuck") + " Forma Verano"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("sawsbuck") + " Forma Verano") + "."
        ),
        "color": "green",
        "img": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-verano.png",
        "imgShiny": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-verano_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("sawsbuck") + " Forma Otoño"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("sawsbuck") + " Forma Otoño") + "."
        ),
        "color": "red",
        "img": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-otono.png",
        "imgShiny": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-otono_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("sawsbuck") + " Forma Invierno"),
        "desc": (
          "Esta es la forma que posee " + (toPokemonDisplayName("sawsbuck") + " Forma Invierno") + "."
        ),
        "color": "brown",
        "img": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-invierno.png",
        "imgShiny": "/assets/fotosFormas/sawsbuckFormas/sawsbuck-invierno_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "genesect":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("genesect") + " (sin ROM)"),
        "desc": (
          "Esta es la forma que posee Genesect cuando no tiene equipado ningún cartucho. En esta forma, " +
          "su movimiento característico Tecno Shock es de tipo Normal."
        ),
        "img": "/assets/fotosFormas/genesectFormas/genesect.png",
        "imgShiny": "/assets/fotosFormas/genesectFormas/genesect_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("genesect") + " (con hidroROM)"),
        "desc": (
          "Esta es la forma que posee Genesect cuando tiene equipado el cartucho hidroROM. En esta forma, " +
          "su movimiento característico Tecno Shock es de tipo Agua."
        ),
        "img": "/assets/fotosFormas/genesectFormas/genesect-hidroROM.png",
        "imgShiny": "/assets/fotosFormas/genesectFormas/genesect-hidroROM_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("genesect") + " (con fulgoROM)"),
        "desc": (
          "Esta es la forma que posee Genesect cuando tiene equipado el cartucho fulgoROM. En esta forma, " +
          "su movimiento característico Tecno Shock es de tipo Eléctrico."
        ),
        "img": "/assets/fotosFormas/genesectFormas/genesect-fulgoROM.png",
        "imgShiny": "/assets/fotosFormas/genesectFormas/genesect-fulgoROM_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("genesect") + " (con piroROM)"),
        "desc": (
          "Esta es la forma que posee Genesect cuando tiene equipado el cartucho piroROM. En esta forma, " +
          "su movimiento característico Tecno Shock es de tipo Fuego."
        ),
        "img": "/assets/fotosFormas/genesectFormas/genesect-piroROM.png",
        "imgShiny": "/assets/fotosFormas/genesectFormas/genesect-piroROM_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("genesect") + " (con crioROM)"),
        "desc": (
          "Esta es la forma que posee Genesect cuando tiene equipado el cartucho crioROM. En esta forma, " +
          "su movimiento característico Tecno Shock es de tipo Hielo."
        ),
        "img": "/assets/fotosFormas/genesectFormas/genesect-crioROM.png",
        "imgShiny": "/assets/fotosFormas/genesectFormas/genesect-crioROM_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "unown":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("unown") + " (A)"),
        "img": "/assets/fotosFormas/unownFormas/a-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/a-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (B)"),
        "img": "/assets/fotosFormas/unownFormas/b-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/b-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (C)"),
        "img": "/assets/fotosFormas/unownFormas/c-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/c-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (D)"),
        "img": "/assets/fotosFormas/unownFormas/d-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/d-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (E)"),
        "img": "/assets/fotosFormas/unownFormas/e-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/e-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (F)"),
        "img": "/assets/fotosFormas/unownFormas/f-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/f-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (G)"),
        "img": "/assets/fotosFormas/unownFormas/g-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/g-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (H)"),
        "img": "/assets/fotosFormas/unownFormas/h-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/h-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (I)"),
        "img": "/assets/fotosFormas/unownFormas/i-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/i-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (J)"),
        "img": "/assets/fotosFormas/unownFormas/j-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/j-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (K)"),
        "img": "/assets/fotosFormas/unownFormas/k-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/k-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (L)"),
        "img": "/assets/fotosFormas/unownFormas/l-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/l-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (M)"),
        "img": "/assets/fotosFormas/unownFormas/m-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/m-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (N)"),
        "img": "/assets/fotosFormas/unownFormas/n-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/n-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (O)"),
        "img": "/assets/fotosFormas/unownFormas/o-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/o-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (P)"),
        "img": "/assets/fotosFormas/unownFormas/p-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/p-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (Q)"),
        "img": "/assets/fotosFormas/unownFormas/q-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/q-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (R)"),
        "img": "/assets/fotosFormas/unownFormas/r-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/r-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (S)"),
        "img": "/assets/fotosFormas/unownFormas/s-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/s-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (T)"),
        "img": "/assets/fotosFormas/unownFormas/t-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/t-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (U)"),
        "img": "/assets/fotosFormas/unownFormas/u-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/u-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (V)"),
        "img": "/assets/fotosFormas/unownFormas/v-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/v-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (W)"),
        "img": "/assets/fotosFormas/unownFormas/w-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/w-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (X)"),
        "img": "/assets/fotosFormas/unownFormas/x-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/x-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (Y)"),
        "img": "/assets/fotosFormas/unownFormas/y-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/y-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (Z)"),
        "img": "/assets/fotosFormas/unownFormas/z-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/z-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (!)"),
        "img": "/assets/fotosFormas/unownFormas/exclamacion-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/exclamacion-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("unown") + " (?)"),
        "img": "/assets/fotosFormas/unownFormas/interrogacion-unown.png",
        "imgShiny": "/assets/fotosFormas/unownFormas/interrogacion-unown_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "furfrou":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("furfrou") + " Forma Salvaje"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-natural.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-natural_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Corazón"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-corazon.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-corazon_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Estrella"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-estrella.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-estrella_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Rombo"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-rombo.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-rombo_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Señorita"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-senorita.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-senorita_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Dama"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-dama.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-dama_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Caballero"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-caballero.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-caballero_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Aristocrático"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-aristocratico.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-aristocratico_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Kabuki"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-kabuki.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-kabuki_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("furfrou") + " Corte Faraónico"),
        "img": "/assets/fotosFormas/furfrouFormas/furfrou-corte-faraonico.png",
        "imgShiny": "/assets/fotosFormas/furfrouFormas/furfrou-corte-faraonico_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "vivillon":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo floral"),
        "color": "pink",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-floral.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-floral_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo isleño"),
        "color": "brown",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-islenio.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-islenio_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo continental"),
        "color": "yellow",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-continental.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-continental_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo oriental"),
        "color": "purple",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-oriental.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-oriental_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo vergel"),
        "color": "green",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-vergel.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-vergel_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo estepa"),
        "color": "brown",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-estepa.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-estepa_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo polar"),
        "color": "white",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-polar.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-polar_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo jungla"),
        "color": "green",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-jungla.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-jungla_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo marino"),
        "color": "blue",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-marino.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-marino_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo moderno"),
        "color": "red",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-moderno.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-moderno_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo monzón"),
        "color": "gray",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-monzon.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-monzon_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo océano"),
        "color": "red",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-oceano.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-oceano_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo taiga"),
        "color": "blue",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-taiga.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-taiga_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo oasis"),
        "color": "brown",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-oasis.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-oasis_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo desierto"),
        "color": "brown",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-desierto.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-desierto_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo pantano"),
        "color": "green",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-pantano.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-pantano_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo solar"),
        "color": "red",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-solar.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-solar_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo tundra"),
        "color": "blue",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-tundra.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-tundra_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo fantasía"),
        "color": "pink",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-fantasia.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-fantasia_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("vivillon") + " Motivo Poké Ball"),
        "color": "red",
        "img": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-poke-ball.png",
        "imgShiny": "/assets/fotosFormas/vivillonFormas/vivillon-motivo-poke-ball_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "arceus":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Normal)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando no tiene ninguna tabla equipada, o cuando tiene equipada la Tabla Neutra (solo en Pokémon Leyendas Arceus)."
        ),
        "types": ["normal"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-normal.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-normal_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Fuego)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Llama o un Pirostal Z."
        ),
        "types": ["fire"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-fire.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-fire_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Agua)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Linfa o un Hidrostal Z."
        ),
        "types": ["water"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-water.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-water_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Eléctrico)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Trueno o un Electrostal Z."
        ),
        "types": ["electric"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-electric.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-electric_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Planta)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Pradal o un Fitostal Z."
        ),
        "types": ["grass"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-grass.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-grass_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Hielo)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Helada o un Criostal Z."
        ),
        "types": ["ice"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-ice.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-ice_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Lucha)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Fuerte o un Lizastal Z."
        ),
        "types": ["fighting"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-fighting.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-fighting_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Veneno)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Tóxica o un Toxistal Z."
        ),
        "types": ["poison"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-poison.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-poison_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Tierra)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Terrax o un Geostal Z."
        ),
        "types": ["ground"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-ground.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-ground_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Volador)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Cielo o un Aerostal Z."
        ),
        "types": ["flying"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-flying.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-flying_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Psíquico)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Mental o un Psicostal Z."
        ),
        "types": ["psychic"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-psychic.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-psychic_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Bicho)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Bicho o un Insectostal Z."
        ),
        "types": ["bug"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-bug.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-bug_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Roca)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Pétrea o un Litostal Z."
        ),
        "types": ["rock"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-rock.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-rock_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Fantasma)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Terror o un Espectrostal Z."
        ),
        "types": ["ghost"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-ghost.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-ghost_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Dragón)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Draco o un Dracostal Z."
        ),
        "types": ["dragon"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-dragon.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-dragon_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Siniestro)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Oscura o un Nicostal Z."
        ),
        "types": ["dark"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-dark.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-dark_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Acero)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Acero o un Metalostal Z."
        ),
        "types": ["steel"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-steel.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-steel_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("arceus") + " (Tipo Hada)"),
        "desc": (
          "Esta es la forma que posee Arceus cuando tiene equipada la Tabla Duende o un Feeristal Z."
        ),
        "types": ["fairy"],
        "img": "/assets/fotosFormas/arceusFormas/arceus-fairy.png",
        "imgShiny": "/assets/fotosFormas/arceusFormas/arceus-fairy_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "silvally":
  {
    "forms": [
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Normal)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando no tiene ningún Disco equipado."
        ),
        "types": ["normal"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-normal.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-normal_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Fuego)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Fuego equipado."
        ),
        "types": ["fire"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-fire.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-fire_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Agua)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Agua equipado."
        ),
        "types": ["water"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-water.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-water_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Eléctrico)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Eléctrico equipado."
        ),
        "types": ["electric"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-electric.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-electric_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Planta)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Planta equipado."
        ),
        "types": ["grass"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-grass.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-grass_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Hielo)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Hielo equipado."
        ),
        "types": ["ice"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-ice.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-ice_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Lucha)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Lucha equipado."
        ),
        "types": ["fighting"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-fighting.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-fighting_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Veneno)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Veneno equipado."
        ),
        "types": ["poison"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-poison.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-poison_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Tierra)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Tierra equipado."
        ),
        "types": ["ground"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-ground.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-ground_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Volador)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Volador equipado."
        ),
        "types": ["flying"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-flying.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-flying_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Psíquico)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Psíquico equipado."
        ),
        "types": ["psychic"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-psychic.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-psychic_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Bicho)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Bicho equipado."
        ),
        "types": ["bug"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-bug.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-bug_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Roca)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Roca equipado."
        ),
        "types": ["rock"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-rock.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-rock_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Fantasma)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Fantasma equipado."
        ),
        "types": ["ghost"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-ghost.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-ghost_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Dragón)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Dragón equipado."
        ),
        "types": ["dragon"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-dragon.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-dragon_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Siniestro)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Siniestro equipado."
        ),
        "types": ["dark"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-dark.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-dark_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Acero)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Acero equipado."
        ),
        "types": ["steel"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-steel.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-steel_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": (toPokemonDisplayName("silvally") + " (Tipo Hada)"),
        "desc": (
          "Esta es la forma que posee Silvally cuando tiene el Disco Hada equipado."
        ),
        "types": ["fairy"],
        "img": "/assets/fotosFormas/silvallyFormas/silvally-fairy.png",
        "imgShiny": "/assets/fotosFormas/silvallyFormas/silvally-fairy_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "alcremie":
  {
    "forms": generarFormasAlcremie()
  },

  "unfezant":
  {
    "forms": [
      {
        "display": "Unfezant Macho",
        "desc": (
          "Esta es la forma que poseen los Unfezant machos."
        ),
        "id": 521,
        "img": "/assets/fotosFormas/unfezantFormas/unfezant-male.png",
        "imgShiny": "/assets/fotosFormas/unfezantFormas/unfezant-male_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Unfezant Hembra",
        "desc": (
          "Esta es la forma que poseen los Unfezant hembras."
        ),
        "img": "/assets/fotosFormas/unfezantFormas/unfezant-female.png",
        "imgShiny":  "/assets/fotosFormas/unfezantFormas/unfezant-female_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "frillish-male":
  {
    "forms": [
      {
        "display": "Frillish Macho",
        "desc": (
          "Esta es la forma que poseen los Frillish machos."
        ),
        "id": 592,
        "img": "/assets/fotosFormas/frillishFormas/frillish-male.png",
        "imgShiny": "/assets/fotosFormas/frillishFormas/frillish-male_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Frillish Hembra",
        "desc": (
          "Esta es la forma que poseen los Frillish hembras."
        ),
        "img": "/assets/fotosFormas/frillishFormas/frillish-female.png",
        "imgShiny":  "/assets/fotosFormas/frillishFormas/frillish-female_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "jellicent-male":
  {
    "forms": [
      {
        "display": "Jellicent Macho",
        "desc": (
          "Esta es la forma que poseen los Jellicent machos."
        ),
        "id": 593,
        "img": "/assets/fotosFormas/jellicentFormas/jellicent-male.png",
        "imgShiny": "/assets/fotosFormas/jellicentFormas/jellicent-male_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Jellicent Hembra",
        "desc": (
          "Esta es la forma que poseen los Jellicent hembras."
        ),
        "img": "/assets/fotosFormas/jellicentFormas/jellicent-female.png",
        "imgShiny":  "/assets/fotosFormas/jellicentFormas/jellicent-female_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "pyroar-male":
  {
    "forms": [
      {
        "display": "Pyroar Macho",
        "desc": (
          "Esta es la forma que poseen los Pyroar machos."
        ),
        "id": 668,
        "img": "/assets/fotosFormas/pyroarFormas/pyroar-male.png",
        "imgShiny": "/assets/fotosFormas/pyroarFormas/pyroar-male_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Pyroar Hembra",
        "desc": (
          "Esta es la forma que poseen los Pyroar hembras."
        ),
        "img": "/assets/fotosFormas/pyroarFormas/pyroar-female.png",
        "imgShiny":  "/assets/fotosFormas/pyroarFormas/pyroar-female_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },

  "hippopotas":
  {
    "forms": [
      {
        "display": "Hippopotas Macho",
        "desc": (
          "Esta es la forma que poseen los Hippopotas machos."
        ),
        "id": 449,
        "img": "/assets/fotosFormas/hippopotasFormas/hippopotas-male.png",
        "imgShiny": "/assets/fotosFormas/hippopotasFormas/hippopotas-male_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Hippopotas Hembra",
        "desc": (
          "Esta es la forma que poseen los Hippopotas hembras."
        ),
        "img": "/assets/fotosFormas/hippopotasFormas/hippopotas-female.png",
        "imgShiny": "/assets/fotosFormas/hippopotasFormas/hippopotas-female_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  },
  "hippowdon":
  {
    "forms": [
      {
        "display": "Hippowdon Macho",
        "desc": (
          "Esta es la forma que poseen los Hippowdon machos."
        ),
        "id": 450,
        "img": "/assets/fotosFormas/hippowdonFormas/hippowdon-male.png",
        "imgShiny": "/assets/fotosFormas/hippowdonFormas/hippowdon-male_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      },
      {
        "display": "Hippowdon Hembra",
        "desc": (
          "Esta es la forma que poseen los Hippowdon hembras."
        ),
        "img": "/assets/fotosFormas/hippowdonFormas/hippowdon-female.png",
        "imgShiny": "/assets/fotosFormas/hippowdonFormas/hippowdon-female_shiny.png",
        "needFetch": false,
        "enableNavigation": false
      }
    ]
  }
};

export function normalizePkmBaseFormKey(input)
{
  const raw = String(input || "").trim().toLowerCase();
  if (!raw) return null;

  return raw;
}

export function getPokemonFormMeta(input)
{
  const key = normalizePkmBaseFormKey(input);
  return key ? (FORMAS_PKM_META[key] || null) : null;
}

export function getPokemonForms(input)
{
  const forms = getPokemonFormMeta(input)?.forms;
  return Array.isArray(forms) ? forms : [];
}

export function hasPokemonForms(apiKey)
{
  return getPokemonForms(apiKey).length > 0;
}

export const FORMS_PKM_INLINE_DESC_API_KEYS = new Set([
  "arceus",
  "genesect",
  "silvally",
  "pikachu",

  "ogerpon",
  "ogerpon-horn-mask",
  "ogerpon-wellspring-mask",
  "ogerpon-hearthflame-mask",
  "ogerpon-cornerstone-mask",

  "rotom",
  "rotom-heat",
  "rotom-wash",
  "rotom-frost",
  "rotom-fan",
  "rotom-mow",

  "burmy",
  "cherrim",

  "pumpkaboo-small",
  "pumpkaboo-average",
  "pumpkaboo-large",
  "pumpkaboo-super",

  "maushold-family-of-four",

  "shellos",
  "gastrodon",

  "gourgeist-small",
  "gourgeist-average",
  "gourgeist-large",
  "gourgeist-super",

  "flabebe",
  "floette",
  "floette-eternal",
  "florges",

  "deerling",
  "sawsbuck"

  //minor debe ser una sola desc, caso especial

]);

export function shouldInlineFormaDescByApiKey(input)
{
  const key = String(input || "").toLowerCase().trim();
  return key ? FORMS_PKM_INLINE_DESC_API_KEYS.has(key) : false;
}
// ---------------- DATOS META DE FORMAS POKÉMON - FIN ---------------- 


// ---------------- DATOS META DE PARCHE EVOLUCIÓN POKÉMON - INICIO ---------------- 
//#region EVO PKM
export const EVOLUTION_PATCH_PKM_META =
{
  // Evos Manuales
  "meowth":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("meowth"),
        "nombreEvoApi": "meowth",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(52), shinyArtworkUrl(52)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("persian"),
        "nombreEvoApi": "persian",
        "nombrePreEvo": toPokemonDisplayName("meowth"),
        "fotos": [officialArtworkUrl(53), shinyArtworkUrl(53)],  
        "metodoEvo": "Subir al nivel 28",
        "minNivel": 28,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "yamask":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("yamask"),
        "nombreEvoApi": "yamask",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(562), shinyArtworkUrl(562)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("cofagrigus"),
        "nombreEvoApi": "cofagrigus",
        "nombrePreEvo": toPokemonDisplayName("yamask"),
        "fotos": [officialArtworkUrl(563), shinyArtworkUrl(563)],  
        "metodoEvo": "Subir al nivel 34",
        "minNivel": 34,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "mr-mime":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("mime-jr"),
        "nombreEvoApi": "mime-jr",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(439), shinyArtworkUrl(439)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("mr-mime"),
        "nombreEvoApi": "mr-mime",
        "nombrePreEvo": toPokemonDisplayName("mime-jr"),
        "fotos": [officialArtworkUrl(122), shinyArtworkUrl(122)],  
        "metodoEvo": "Conociendo mimético + nivel (fuera de Galar)",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("mr-mime-galar"),
        "nombreEvoApi": "mr-mime-galar",
        "nombrePreEvo": toPokemonDisplayName("mime-jr"),
        "fotos": [officialArtworkUrl(10168), shinyArtworkUrl(10168)],  
        "metodoEvo": "Conociendo mimético + nivel (en Galar)",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("mr-rime"),
        "nombreEvoApi": "mr-rime",
        "nombrePreEvo": toPokemonDisplayName("mr-mime-galar"),
        "fotos": [officialArtworkUrl(866), shinyArtworkUrl(866)],  
        "metodoEvo": "Subir al nivel 42",
        "minNivel": 42,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "farfetchd":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("farfetchd"),
        "nombreEvoApi": "farfetchd",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(83), shinyArtworkUrl(83)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "zigzagoon":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("zigzagoon"),
        "nombreEvoApi": "zigzagoon",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(263), shinyArtworkUrl(263)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("linoone"),
        "nombreEvoApi": "linoone",
        "nombrePreEvo": toPokemonDisplayName("zigzagoon"),
        "fotos": [officialArtworkUrl(264), shinyArtworkUrl(264)],  
        "metodoEvo": "Subir al nivel 20",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "darumaka":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("darumaka"),
        "nombreEvoApi": "darumaka",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(554), shinyArtworkUrl(554)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("darmanitan-standard"),
        "nombreEvoApi": "darmanitan-standard",
        "nombrePreEvo": toPokemonDisplayName("darumaka"),
        "fotos": [officialArtworkUrl(555), shinyArtworkUrl(555)],  
        "metodoEvo": "Subir al nivel 35",
        "minNivel": 35,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "qwilfish":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("qwilfish"),
        "nombreEvoApi": "qwilfish",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(211), shinyArtworkUrl(211)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "sneasel":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("sneasel"),
        "nombreEvoApi": "sneasel",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(215), shinyArtworkUrl(215)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("weavile"),
        "nombreEvoApi": "weavile",
        "nombrePreEvo": toPokemonDisplayName("sneasel"),
        "fotos": [officialArtworkUrl(461), shinyArtworkUrl(461)],  
        "metodoEvo": "Subir de nivel equipado con Garra Afilada de Noche",
        "minNivel": 1,
        "objetoRequerido": "Garra Afilada",
        "region": "",
        "tiempoDelDia": "night",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "petilil":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("petilil"),
        "nombreEvoApi": "petilil",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(548), shinyArtworkUrl(548)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("lilligant"),
        "nombreEvoApi": "lilligant",
        "nombrePreEvo": toPokemonDisplayName("petilil"),
        "fotos": [officialArtworkUrl(549), shinyArtworkUrl(549)],  
        "metodoEvo": "Usar Piedra Solar (fuera de Hisui)",
        "minNivel": 1,
        "objetoRequerido": "Piedra Solar",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("lilligant-hisui"),
        "nombreEvoApi": "lilligant-hisui",
        "nombrePreEvo": toPokemonDisplayName("petilil"),
        "fotos": [officialArtworkUrl(10237), shinyArtworkUrl(10237)],  
        "metodoEvo": "Usar Piedra Solar (en Hisui)",
        "minNivel": 1,
        "objetoRequerido": "Piedra Solar",
        "region": "hisui",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rufflet":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rufflet"),
        "nombreEvoApi": "rufflet",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(627), shinyArtworkUrl(627)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("braviary"),
        "nombreEvoApi": "braviary",
        "nombrePreEvo": toPokemonDisplayName("rufflet"),
        "fotos": [officialArtworkUrl(628), shinyArtworkUrl(628)],  
        "metodoEvo": "Subir al nivel 54 (fuera de Hisui)",
        "minNivel": 54,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("braviary-hisui"),
        "nombreEvoApi": "braviary-hisui",
        "nombrePreEvo": toPokemonDisplayName("rufflet"),
        "fotos": [officialArtworkUrl(10240), shinyArtworkUrl(10240)],  
        "metodoEvo": "Subir al nivel 54 (en Hisui)",
        "minNivel": 54,
        "objetoRequerido": "",
        "region": "hisui",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "goomy":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("goomy"),
        "nombreEvoApi": "goomy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(704), shinyArtworkUrl(704)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("sliggoo"),
        "nombreEvoApi": "sliggoo",
        "nombrePreEvo": toPokemonDisplayName("goomy"),
        "fotos": [officialArtworkUrl(705), shinyArtworkUrl(705)],  
        "metodoEvo": "Subir al nivel 40 (fuera de Hisui)",
        "minNivel": 40,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("sliggoo-hisui"),
        "nombreEvoApi": "sliggoo-hisui",
        "nombrePreEvo": toPokemonDisplayName("goomy"),
        "fotos": [officialArtworkUrl(10241), shinyArtworkUrl(10241)],  
        "metodoEvo": "Subir al nivel 40 (en Hisui)",
        "minNivel": 40,
        "objetoRequerido": "",
        "region": "hisui",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("goodra"),
        "nombreEvoApi": "goodra",
        "nombrePreEvo": toPokemonDisplayName("sliggoo"),
        "fotos": [officialArtworkUrl(706), shinyArtworkUrl(706)],  
        "metodoEvo": "Subir al nivel 50 + Lluvia",
        "minNivel": 50,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": true
      },
      {
        "nombreEvolucion": toPokemonDisplayName("goodra-hisui"),
        "nombreEvoApi": "goodra-hisui",
        "nombrePreEvo": toPokemonDisplayName("sliggoo-hisui"),
        "fotos": [officialArtworkUrl(10242), shinyArtworkUrl(10242)],  
        "metodoEvo": "Subir al nivel 50 + Lluvia",
        "minNivel": 50,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": true
      }
    ]
  },
  "bergmite":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("bergmite"),
        "nombreEvoApi": "bergmite",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(712), shinyArtworkUrl(712)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("avalugg"),
        "nombreEvoApi": "avalugg",
        "nombrePreEvo": toPokemonDisplayName("bergmite"),
        "fotos": [officialArtworkUrl(713), shinyArtworkUrl(713)],  
        "metodoEvo": "Subir al nivel 37 (fuera de Hisui)",
        "minNivel": 37,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("avalugg-hisui"),
        "nombreEvoApi": "avalugg-hisui",
        "nombrePreEvo": toPokemonDisplayName("bergmite"),
        "fotos": [officialArtworkUrl(10243), shinyArtworkUrl(10243)],  
        "metodoEvo": "Subir al nivel 37 (en Hisui)",
        "minNivel": 37,
        "objetoRequerido": "",
        "region": "hisui",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "cyndaquil":
  {
    "replace": false,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("typhlosion-hisui"),
        "nombreEvoApi": "typhlosion-hisui",
        "nombrePreEvo": toPokemonDisplayName("quilava"),
        "fotos": [officialArtworkUrl(10233), shinyArtworkUrl(10233)],  
        "metodoEvo": "Subir al nivel 36 (en Hisui)",
        "minNivel": 36,
        "objetoRequerido": "",
        "region": "hisui",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rowlet":
  {
    "replace": false,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("decidueye-hisui"),
        "nombreEvoApi": "decidueye-hisui",
        "nombrePreEvo": toPokemonDisplayName("dartrix"),
        "fotos": [officialArtworkUrl(10244), shinyArtworkUrl(10244)],  
        "metodoEvo": "Subir al nivel 34 (en Hisui)",
        "minNivel": 34,
        "objetoRequerido": "",
        "region": "hisui",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "oshawott":
  {
    "replace": false,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("samurott-hisui"),
        "nombreEvoApi": "samurott-hisui",
        "nombrePreEvo": toPokemonDisplayName("dewott"),
        "fotos": [officialArtworkUrl(10236), shinyArtworkUrl(10236)],  
        "metodoEvo": "Subir al nivel 36 (en Hisui)",
        "minNivel": 36,
        "objetoRequerido": "",
        "region": "hisui",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "wooper":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("wooper"),
        "nombreEvoApi": "wooper",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(194), shinyArtworkUrl(194)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("quagsire"),
        "nombreEvoApi": "quagsire",
        "nombrePreEvo": toPokemonDisplayName("wooper"),
        "fotos": [officialArtworkUrl(195), shinyArtworkUrl(195)],  
        "metodoEvo": "Subir al nivel 20",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "basculin-red-striped":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("basculin-red-striped"),
        "nombreEvoApi": "basculin-red-striped",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(550), shinyArtworkUrl(550)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "basculin-blue-striped":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("basculin-blue-striped"),
        "nombreEvoApi": "basculin-blue-striped",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10016), shinyArtworkUrl(10016)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "basculin-white-striped":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("basculin-white-striped"),
        "nombreEvoApi": "basculin-white-striped",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10247), shinyArtworkUrl(10247)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("basculegion-female"),
        "nombreEvoApi": "basculegion-female",
        "nombrePreEvo": toPokemonDisplayName("basculin-white-striped"),
        "fotos": [officialArtworkUrl(10248), shinyArtworkUrl(10248)],  
        "metodoEvo": "Perder 294 PS de daño de retroceso + nivel (Si es Hembra)",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("basculegion-male"),
        "nombreEvoApi": "basculegion-male",
        "nombrePreEvo": toPokemonDisplayName("basculin-white-striped"),
        "fotos": [officialArtworkUrl(902), shinyArtworkUrl(902)],  
        "metodoEvo": "Perder 294 PS de daño de retroceso + nivel (Si es Macho)",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "burmy":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("burmy"),
        "nombreEvoApi": "burmy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(412), shinyArtworkUrl(412)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("wormadam-plant"),
        "nombreEvoApi": "wormadam-plant",
        "nombrePreEvo": toPokemonDisplayName("burmy"),
        "fotos": [officialArtworkUrl(413), shinyArtworkUrl(413)],  
        "metodoEvo": "Subir al nivel 20 si es hembra",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("mothim"),
        "nombreEvoApi": "mothim",
        "nombrePreEvo": toPokemonDisplayName("burmy"),
        "fotos": [officialArtworkUrl(414), shinyArtworkUrl(414)],  
        "metodoEvo": "Subir al nivel 20 si es macho",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "wormadam-sandy":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("burmy"),
        "nombreEvoApi": "burmy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(412), shinyArtworkUrl(412)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("wormadam-sandy"),
        "nombreEvoApi": "wormadam-sandy",
        "nombrePreEvo": toPokemonDisplayName("burmy"),
        "fotos": [officialArtworkUrl(10004), shinyArtworkUrl(10004)],  
        "metodoEvo": "Subir al nivel 20 si es hembra",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("mothim"),
        "nombreEvoApi": "mothim",
        "nombrePreEvo": toPokemonDisplayName("burmy"),
        "fotos": [officialArtworkUrl(414), shinyArtworkUrl(414)],  
        "metodoEvo": "Subir al nivel 20 si es macho",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "wormadam-trash":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("burmy"),
        "nombreEvoApi": "burmy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(412), shinyArtworkUrl(412)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("wormadam-trash"),
        "nombreEvoApi": "wormadam-trash",
        "nombrePreEvo": toPokemonDisplayName("burmy"),
        "fotos": [officialArtworkUrl(10005), shinyArtworkUrl(10005)],  
        "metodoEvo": "Subir al nivel 20 si es hembra",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("mothim"),
        "nombreEvoApi": "mothim",
        "nombrePreEvo": toPokemonDisplayName("burmy"),
        "fotos": [officialArtworkUrl(414), shinyArtworkUrl(414)],  
        "metodoEvo": "Subir al nivel 20 si es macho",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "castform-sunny":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("castform-sunny"),
        "nombreEvoApi": "castform-sunny",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10013), shinyArtworkUrl(10013)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "castform-rainy":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("castform-rainy"),
        "nombreEvoApi": "castform-rainy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10014), shinyArtworkUrl(10014)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "castform-snowy":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("castform-snowy"),
        "nombreEvoApi": "castform-snowy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10015), shinyArtworkUrl(10015)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "kyogre-primal":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("kyogre-primal"),
        "nombreEvoApi": "kyogre-primal",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10077), shinyArtworkUrl(10077)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "groudon-primal":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("groudon-primal"),
        "nombreEvoApi": "groudon-primal",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10078), shinyArtworkUrl(10078)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "meloetta-aria":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("meloetta-aria"),
        "nombreEvoApi": "meloetta-aria",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(648), shinyArtworkUrl(648)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "meloetta-pirouette":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("meloetta-pirouette"),
        "nombreEvoApi": "meloetta-pirouette",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10018), shinyArtworkUrl(10018)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "aegislash-blade":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("honedge"),
        "nombreEvoApi": "honedge",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(679), shinyArtworkUrl(679)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("doublade"),
        "nombreEvoApi": "doublade",
        "nombrePreEvo": toPokemonDisplayName("honedge"),
        "fotos": [officialArtworkUrl(680), shinyArtworkUrl(680)],  
        "metodoEvo": "Subir al nivel 35",
        "minNivel": 35,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("aegislash-blade"),
        "nombreEvoApi": "aegislash-blade",
        "nombrePreEvo": toPokemonDisplayName("doublade"),
        "fotos": [officialArtworkUrl(10026), shinyArtworkUrl(10026)],  
        "metodoEvo": "Usar Pidra Noche",
        "minNivel": 35,
        "objetoRequerido": "Pidra Noche",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "aegislash-shield":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("honedge"),
        "nombreEvoApi": "honedge",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(679), shinyArtworkUrl(679)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("doublade"),
        "nombreEvoApi": "doublade",
        "nombrePreEvo": toPokemonDisplayName("honedge"),
        "fotos": [officialArtworkUrl(680), shinyArtworkUrl(680)],  
        "metodoEvo": "Subir al nivel 35",
        "minNivel": 35,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("aegislash-shield"),
        "nombreEvoApi": "aegislash-shield",
        "nombrePreEvo": toPokemonDisplayName("doublade"),
        "fotos": [officialArtworkUrl(681), shinyArtworkUrl(681)],  
        "metodoEvo": "Usar Pidra Noche",
        "minNivel": 35,
        "objetoRequerido": "Pidra Noche",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "wishiwashi-solo":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("wishiwashi-solo"),
        "nombreEvoApi": "wishiwashi-solo",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(746), shinyArtworkUrl(746)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "wishiwashi-school":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("wishiwashi-school"),
        "nombreEvoApi": "wishiwashi-school",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10127), shinyArtworkUrl(10127)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "eiscue-ice":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("eiscue-ice"),
        "nombreEvoApi": "eiscue-ice",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(875), shinyArtworkUrl(875)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "eiscue-noice":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("eiscue-noice"),
        "nombreEvoApi": "eiscue-noice",
        "nombrePreEvo": "",
        "fotos": [homeArtworkUrl(10185), homeShinyArtworkUrl(10185)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "zygarde-10":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("zygarde-10"),
        "nombreEvoApi": "zygarde-10",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10181), shinyArtworkUrl(10181)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "zygarde-50":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("zygarde-50"),
        "nombreEvoApi": "zygarde-50",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(718), shinyArtworkUrl(718)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "zygarde-complete":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("zygarde-complete"),
        "nombreEvoApi": "zygarde-complete",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10120), shinyArtworkUrl(10120)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-red-meteor":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-red-meteor"),
        "nombreEvoApi": "minior-red-meteor",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(774), shinyArtworkUrl(774)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-red":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-red"),
        "nombreEvoApi": "minior-red",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10136), shinyArtworkUrl(10136)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-orange":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-orange"),
        "nombreEvoApi": "minior-orange",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10137), shinyArtworkUrl(10137)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-yellow":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-yellow"),
        "nombreEvoApi": "minior-yellow",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10138), shinyArtworkUrl(10138)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-green":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-green"),
        "nombreEvoApi": "minior-green",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10139), shinyArtworkUrl(10139)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-blue":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-blue"),
        "nombreEvoApi": "minior-blue",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10140), shinyArtworkUrl(10140)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-indigo":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-indigo"),
        "nombreEvoApi": "minior-indigo",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10141), shinyArtworkUrl(10141)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "minior-violet":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("minior-violet"),
        "nombreEvoApi": "minior-violet",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10142), shinyArtworkUrl(10142)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "mimikyu-disguised":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("mimikyu-disguised"),
        "nombreEvoApi": "mimikyu-disguised",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(778), shinyArtworkUrl(778)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "necrozma-dusk":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("necrozma-dusk"),
        "nombreEvoApi": "necrozma-dusk",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10155), shinyArtworkUrl(10155)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "necrozma-dawn":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("necrozma-dawn"),
        "nombreEvoApi": "necrozma-dawn",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10156), shinyArtworkUrl(10156)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "necrozma-ultra":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("necrozma-ultra"),
        "nombreEvoApi": "necrozma-ultra",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10157), shinyArtworkUrl(10157)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "morpeko-full-belly":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("morpeko-full-belly"),
        "nombreEvoApi": "morpeko-full-belly",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(877), shinyArtworkUrl(877)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "zacian-crowned":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("zacian-crowned"),
        "nombreEvoApi": "zacian-crowned",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10188), shinyArtworkUrl(10188)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "zamazenta-crowned":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("zamazenta-crowned"),
        "nombreEvoApi": "zamazenta-crowned",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10189), shinyArtworkUrl(10189)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "palafin-zero":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("finizen"),
        "nombreEvoApi": "finizen",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(963), shinyArtworkUrl(963)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("palafin-zero"),
        "nombreEvoApi": "palafin-zero",
        "nombrePreEvo": toPokemonDisplayName("finizen"),
        "fotos": [officialArtworkUrl(964), shinyArtworkUrl(964)],  
        "metodoEvo": "Subir al nivel 38 + círculo unión",
        "minNivel": 38,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "palafin-hero":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("finizen"),
        "nombreEvoApi": "finizen",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(963), shinyArtworkUrl(963)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("palafin-hero"),
        "nombreEvoApi": "palafin-hero",
        "nombrePreEvo": toPokemonDisplayName("finizen"),
        "fotos": [officialArtworkUrl(10256), shinyArtworkUrl(10256)],  
        "metodoEvo": "Subir al nivel 38 + círculo unión",
        "minNivel": 38,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "terapagos-terastal":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("terapagos-terastal"),
        "nombreEvoApi": "terapagos-terastal",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10276), shinyArtworkUrl(10276)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "terapagos-terastal":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("terapagos-terastal"),
        "nombreEvoApi": "terapagos-terastal",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10277), shinyArtworkUrl(10277)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "deoxys-normal":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("deoxys-normal"),
        "nombreEvoApi": "deoxys-normal",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(386), shinyArtworkUrl(386)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "deoxys-attack":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("deoxys-attack"),
        "nombreEvoApi": "deoxys-attack",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10001), shinyArtworkUrl(10001)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "deoxys-defense":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("deoxys-defense"),
        "nombreEvoApi": "deoxys-defense",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10002), shinyArtworkUrl(10002)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "deoxys-speed":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("deoxys-speed"),
        "nombreEvoApi": "deoxys-speed",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10003), shinyArtworkUrl(10003)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rotom-heat":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rotom-heat"),
        "nombreEvoApi": "rotom-heat",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10008), shinyArtworkUrl(10008)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rotom-wash":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rotom-wash"),
        "nombreEvoApi": "rotom-wash",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10009), shinyArtworkUrl(10009)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rotom-frost":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rotom-frost"),
        "nombreEvoApi": "rotom-frost",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10010), shinyArtworkUrl(10010)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rotom-fan":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rotom-fan"),
        "nombreEvoApi": "rotom-fan",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10011), shinyArtworkUrl(10011)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rotom-mow":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rotom-mow"),
        "nombreEvoApi": "rotom-mow",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10012), shinyArtworkUrl(10012)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "dialga-origin":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("dialga-origin"),
        "nombreEvoApi": "dialga-origin",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10245), shinyArtworkUrl(10245)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "palkia-origin":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("palkia-origin"),
        "nombreEvoApi": "palkia-origin",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10246), shinyArtworkUrl(10246)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "giratina-altered":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("giratina-altered"),
        "nombreEvoApi": "giratina-altered",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(487), shinyArtworkUrl(487)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "giratina-origin":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("giratina-origin"),
        "nombreEvoApi": "giratina-origin",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10007), shinyArtworkUrl(10007)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "shaymin-land":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("shaymin-land"),
        "nombreEvoApi": "shaymin-land",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(492), shinyArtworkUrl(492)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "shaymin-sky":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("shaymin-sky"),
        "nombreEvoApi": "shaymin-sky",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10006), shinyArtworkUrl(10006)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tornadus-incarnate":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tornadus-incarnate"),
        "nombreEvoApi": "tornadus-incarnate",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(641), shinyArtworkUrl(641)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tornadus-therian":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tornadus-therian"),
        "nombreEvoApi": "tornadus-therian",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10019), shinyArtworkUrl(10019)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "thundurus-incarnate":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("thundurus-incarnate"),
        "nombreEvoApi": "thundurus-incarnate",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(642), shinyArtworkUrl(642)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "thundurus-therian":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("thundurus-therian"),
        "nombreEvoApi": "thundurus-therian",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10020), shinyArtworkUrl(10020)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "landorus-incarnate":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("landorus-incarnate"),
        "nombreEvoApi": "landorus-incarnate",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(645), shinyArtworkUrl(645)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "landorus-therian":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("landorus-therian"),
        "nombreEvoApi": "landorus-therian",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10021), shinyArtworkUrl(10021)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "enamorus-incarnate":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("enamorus-incarnate"),
        "nombreEvoApi": "enamorus-incarnate",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(905), shinyArtworkUrl(905)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "enamorus-therian":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("enamorus-therian"),
        "nombreEvoApi": "enamorus-therian",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10249), shinyArtworkUrl(10249)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "kyurem-white":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("kyurem-white"),
        "nombreEvoApi": "kyurem-white",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10023), shinyArtworkUrl(10023)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "kyurem-black":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("kyurem-black"),
        "nombreEvoApi": "kyurem-black",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10022), shinyArtworkUrl(10022)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "keldeo-ordinary":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("keldeo-ordinary"),
        "nombreEvoApi": "keldeo-ordinary",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(647), shinyArtworkUrl(647)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "hoopa-unbound":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("hoopa-unbound"),
        "nombreEvoApi": "hoopa-unbound",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10086), shinyArtworkUrl(10086)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "oricorio-baile":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("oricorio-baile"),
        "nombreEvoApi": "oricorio-baile",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(741), shinyArtworkUrl(741)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "oricorio-pom-pom":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("oricorio-pom-pom"),
        "nombreEvoApi": "oricorio-pom-pom",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10123), shinyArtworkUrl(10123)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "oricorio-pau":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("oricorio-pau"),
        "nombreEvoApi": "oricorio-pau",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10124), shinyArtworkUrl(10124)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "oricorio-sensu":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("oricorio-sensu"),
        "nombreEvoApi": "oricorio-sensu",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10125), shinyArtworkUrl(10125)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "calyrex-ice":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("calyrex-ice"),
        "nombreEvoApi": "calyrex-ice",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10193), shinyArtworkUrl(10193)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "calyrex-shadow":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("calyrex-shadow"),
        "nombreEvoApi": "calyrex-shadow",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10194), shinyArtworkUrl(10194)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "kubfu":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("kubfu"),
        "nombreEvoApi": "kubfu",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(891), shinyArtworkUrl(891)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("urshifu-single-strike"),
        "nombreEvoApi": "urshifu-single-strike",
        "nombrePreEvo": toPokemonDisplayName("kubfu"),
        "fotos": [officialArtworkUrl(892), shinyArtworkUrl(892)],  
        "metodoEvo": "Tras entrenar en la Torre de las Sombras o usar el Manuscrito sombras",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("urshifu-rapid-strike"),
        "nombreEvoApi": "urshifu-rapid-strike",
        "nombrePreEvo": toPokemonDisplayName("kubfu"),
        "fotos": [officialArtworkUrl(10191), shinyArtworkUrl(10191)],  
        "metodoEvo": "Tras entrenar en la Torre de las Aguas o usar el Manuscrito aguas",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "ogerpon-wellspring-mask":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("ogerpon-wellspring-mask"),
        "nombreEvoApi": "ogerpon-wellspring-mask",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10273), shinyArtworkUrl(10273)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "ogerpon-hearthflame-mask":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("ogerpon-hearthflame-mask"),
        "nombreEvoApi": "ogerpon-hearthflame-mask",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10274), shinyArtworkUrl(10274)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "ogerpon-cornerstone-mask":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("ogerpon-cornerstone-mask"),
        "nombreEvoApi": "ogerpon-cornerstone-mask",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10275), shinyArtworkUrl(10275)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rockruff":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rockruff"),
        "nombreEvoApi": "rockruff",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(744), shinyArtworkUrl(744)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("lycanroc-midday"),
        "nombreEvoApi": "lycanroc-midday",
        "nombrePreEvo": toPokemonDisplayName("rockruff"),
        "fotos": [officialArtworkUrl(745), shinyArtworkUrl(745)],  
        "metodoEvo": "Subir al nivel 25 de Día",
        "minNivel": 25,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "day",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("lycanroc-midnight"),
        "nombreEvoApi": "lycanroc-midnight",
        "nombrePreEvo": toPokemonDisplayName("rockruff"),
        "fotos": [officialArtworkUrl(10126), shinyArtworkUrl(10126)],  
        "metodoEvo": "Subir al nivel 25 de Noche",
        "minNivel": 25,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "night",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("lycanroc-dusk"),
        "nombreEvoApi": "lycanroc-dusk",
        "nombrePreEvo": toPokemonDisplayName("rockruff"),
        "fotos": [officialArtworkUrl(10152), shinyArtworkUrl(10152)],  
        "metodoEvo": "Subir al nivel 25 al Atardecer (teniendo la habilidad ritmo propio)",
        "minNivel": 25,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "dusk",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "toxel":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("toxel"),
        "nombreEvoApi": "toxel",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(848), shinyArtworkUrl(848)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("toxtricity-amped"),
        "nombreEvoApi": "toxtricity-amped",
        "nombrePreEvo": toPokemonDisplayName("toxel"),
        "fotos": [officialArtworkUrl(849), shinyArtworkUrl(849)],  
        "metodoEvo": "Subir al nivel 30 + poseer una naturaleza activa, agitada, alegre, alocada, audaz, dócil, firme, floja, fuerte, grosera, ingenua, pícara o rara",
        "minNivel": 30,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("toxtricity-low-key"),
        "nombreEvoApi": "toxtricity-low-key",
        "nombrePreEvo": toPokemonDisplayName("toxel"),
        "fotos": [officialArtworkUrl(10184), shinyArtworkUrl(10184)],  
        "metodoEvo": "Subir al nivel 30 + poseer una naturaleza afable, amable, cauta, huraña, mansa, miedosa, modesta, osada, plácida, serena, seria o tímida",
        "minNivel": 30,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tandemaus":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tandemaus"),
        "nombreEvoApi": "tandemaus",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(924), shinyArtworkUrl(924)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("maushold-family-of-four"),
        "nombreEvoApi": "maushold-family-of-four",
        "nombrePreEvo": toPokemonDisplayName("tandemaus"),
        "fotos": [officialArtworkUrl(925), shinyArtworkUrl(925)],  
        "metodoEvo": "Subir al nivel 25 en combate",
        "minNivel": 25,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "squawkabilly-green-plumage":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("squawkabilly-green-plumage"),
        "nombreEvoApi": "squawkabilly-green-plumage",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(931), shinyArtworkUrl(931)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "squawkabilly-blue-plumage":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("squawkabilly-blue-plumage"),
        "nombreEvoApi": "squawkabilly-blue-plumage",
        "nombrePreEvo": "",
        "fotos": [homeArtworkUrl(10260), homeShinyArtworkUrl(10260)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "squawkabilly-yellow-plumage":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("squawkabilly-yellow-plumage"),
        "nombreEvoApi": "squawkabilly-yellow-plumage",
        "nombrePreEvo": "",
        "fotos": [homeArtworkUrl(10261), homeShinyArtworkUrl(10261)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "squawkabilly-white-plumage":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("squawkabilly-white-plumage"),
        "nombreEvoApi": "squawkabilly-white-plumage",
        "nombrePreEvo": "",
        "fotos": [homeArtworkUrl(10262), homeShinyArtworkUrl(10262)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tatsugiri-curly":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tatsugiri-curly"),
        "nombreEvoApi": "tatsugiri-curly",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(978), shinyArtworkUrl(978)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "dunsparce":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("dunsparce"),
        "nombreEvoApi": "dunsparce",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(206), shinyArtworkUrl(206)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("dudunsparce-two-segment"),
        "nombreEvoApi": "dudunsparce-two-segment",
        "nombrePreEvo": toPokemonDisplayName("dunsparce"),
        "fotos": [officialArtworkUrl(982), shinyArtworkUrl(982)],  
        "metodoEvo": "Subir de nivel conociendo el movimiento Hipertaladro",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "Hipertaladro",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "gimmighoul":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("gimmighoul"),
        "nombreEvoApi": "gimmighoul",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(999), shinyArtworkUrl(999)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("gholdengo"),
        "nombreEvoApi": "gholdengo",
        "nombrePreEvo": toPokemonDisplayName("gimmighoul"),
        "fotos": [officialArtworkUrl(1000), shinyArtworkUrl(1000)],  
        "metodoEvo": "Subir de nivel + tener 999 monedas de Gimmighoul",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "gimmighoul-roaming":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("gimmighoul-roaming"),
        "nombreEvoApi": "gimmighoul-roaming",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10263), shinyArtworkUrl(10263)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("gholdengo"),
        "nombreEvoApi": "gholdengo",
        "nombrePreEvo": toPokemonDisplayName("gimmighoul-roaming"),
        "fotos": [officialArtworkUrl(1000), shinyArtworkUrl(1000)],  
        "metodoEvo": "Subir de nivel + tener 999 monedas de Gimmighoul",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rellor":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("rellor"),
        "nombreEvoApi": "rellor",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(953), shinyArtworkUrl(953)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("rabsca"),
        "nombreEvoApi": "rabsca",
        "nombrePreEvo": toPokemonDisplayName("rellor"),
        "fotos": [officialArtworkUrl(954), shinyArtworkUrl(954)],  
        "metodoEvo": "Subir de nivel + Dar 1000 pasos en el modo Enviar Pokémon",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "pawmi":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("pawmi"),
        "nombreEvoApi": "pawmi",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(921), shinyArtworkUrl(921)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("pawmo"),
        "nombreEvoApi": "pawmo",
        "nombrePreEvo": toPokemonDisplayName("pawmi"),
        "fotos": [officialArtworkUrl(922), shinyArtworkUrl(922)],  
        "metodoEvo": "Subir al nivel 18",
        "minNivel": 18,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("pawmot"),
        "nombreEvoApi": "pawmot",
        "nombrePreEvo": toPokemonDisplayName("pawmo"),
        "fotos": [officialArtworkUrl(923), shinyArtworkUrl(923)],  
        "metodoEvo": "Subir de nivel + Dar 1000 pasos en el modo Enviar Pokémon",
        "minNivel": 18,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "bramblin":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("bramblin"),
        "nombreEvoApi": "bramblin",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(946), shinyArtworkUrl(946)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("brambleghast"),
        "nombreEvoApi": "brambleghast",
        "nombrePreEvo": toPokemonDisplayName("bramblin"),
        "fotos": [officialArtworkUrl(947), shinyArtworkUrl(947)],  
        "metodoEvo": "Subir de nivel + Dar 1000 pasos en el modo Enviar Pokémon",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "mankey":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("mankey"),
        "nombreEvoApi": "mankey",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(56), shinyArtworkUrl(56)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("primeape"),
        "nombreEvoApi": "primeape",
        "nombrePreEvo": toPokemonDisplayName("mankey"),
        "fotos": [officialArtworkUrl(57), shinyArtworkUrl(57)],  
        "metodoEvo": "Subir al nivel 28",
        "minNivel": 28,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("annihilape"),
        "nombreEvoApi": "annihilape",
        "nombrePreEvo": toPokemonDisplayName("primeape"),
        "fotos": [officialArtworkUrl(979), shinyArtworkUrl(979)],  
        "metodoEvo": "Subir de nivel + Usar el movimiento Puño Furia 20 veces en un combate",
        "minNivel": 28,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "inkay":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("inkay"),
        "nombreEvoApi": "inkay",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(686), shinyArtworkUrl(686)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("malamar"),
        "nombreEvoApi": "malamar",
        "nombrePreEvo": toPokemonDisplayName("inkay"),
        "fotos": [officialArtworkUrl(687), shinyArtworkUrl(687)],  
        "metodoEvo": "Subir al nivel 30 con la consola al reves",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "espurr":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("espurr"),
        "nombreEvoApi": "espurr",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(677), shinyArtworkUrl(677)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("meowstic-male"),
        "nombreEvoApi": "meowstic-male",
        "nombrePreEvo": toPokemonDisplayName("espurr"),
        "fotos": [officialArtworkUrl(678), shinyArtworkUrl(678)],  
        "metodoEvo": "Subir al nivel 25 (si es macho)",
        "minNivel": 25,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("meowstic-female"),
        "nombreEvoApi": "meowstic-female",
        "nombrePreEvo": toPokemonDisplayName("espurr"),
        "fotos": [officialArtworkUrl(10025), shinyArtworkUrl(10025)],  
        "metodoEvo": "Subir al nivel 25 (si es hembra)",
        "minNivel": 25,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "pumpkaboo-average":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("pumpkaboo-average"),
        "nombreEvoApi": "pumpkaboo-average",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(710), shinyArtworkUrl(710)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("gourgeist-average"),
        "nombreEvoApi": "gourgeist-average",
        "nombrePreEvo": toPokemonDisplayName("pumpkaboo-average"),
        "fotos": [officialArtworkUrl(711), shinyArtworkUrl(711)],  
        "metodoEvo": "Intercambio",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "pumpkaboo-small":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("pumpkaboo-small"),
        "nombreEvoApi": "pumpkaboo-small",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10027), shinyArtworkUrl(10027)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("gourgeist-small"),
        "nombreEvoApi": "gourgeist-small",
        "nombrePreEvo": toPokemonDisplayName("pumpkaboo-small"),
        "fotos": [officialArtworkUrl(10030), shinyArtworkUrl(10030)],  
        "metodoEvo": "Intercambio",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "pumpkaboo-large":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("pumpkaboo-large"),
        "nombreEvoApi": "pumpkaboo-large",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10028), shinyArtworkUrl(10028)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("gourgeist-large"),
        "nombreEvoApi": "gourgeist-large",
        "nombrePreEvo": toPokemonDisplayName("pumpkaboo-large"),
        "fotos": [officialArtworkUrl(10031), shinyArtworkUrl(10031)],  
        "metodoEvo": "Intercambio",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "pumpkaboo-super":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("pumpkaboo-super"),
        "nombreEvoApi": "pumpkaboo-super",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10029), shinyArtworkUrl(10029)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("gourgeist-super"),
        "nombreEvoApi": "gourgeist-super",
        "nombrePreEvo": toPokemonDisplayName("pumpkaboo-super"),
        "fotos": [officialArtworkUrl(10032), shinyArtworkUrl(10032)],  
        "metodoEvo": "Intercambio",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tyrogue":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tyrogue"),
        "nombreEvoApi": "tyrogue",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(236), shinyArtworkUrl(236)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("hitmonlee"),
        "nombreEvoApi": "hitmonlee",
        "nombrePreEvo": toPokemonDisplayName("tyrogue"),
        "fotos": [officialArtworkUrl(106), shinyArtworkUrl(106)],  
        "metodoEvo": "Subir al nivel 20 si su ataque es mayor a su defensa",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("hitmonchan"),
        "nombreEvoApi": "hitmonchan",
        "nombrePreEvo": toPokemonDisplayName("tyrogue"),
        "fotos": [officialArtworkUrl(107), shinyArtworkUrl(107)],  
        "metodoEvo": "Subir al nivel 20 si su ataque es menor a su defensa",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("hitmontop"),
        "nombreEvoApi": "hitmontop",
        "nombrePreEvo": toPokemonDisplayName("tyrogue"),
        "fotos": [officialArtworkUrl(237), shinyArtworkUrl(237)],  
        "metodoEvo": "Subir al nivel 20 si su ataque es igual a su defensa",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "eevee":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("eevee"),
        "nombreEvoApi": "eevee",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(133), shinyArtworkUrl(133)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("vaporeon"),
        "nombreEvoApi": "vaporeon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(134), shinyArtworkUrl(134)],  
        "metodoEvo": "Usar Piedra Agua",
        "minNivel": 1,
        "objetoRequerido": "Piedra Agua",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("jolteon"),
        "nombreEvoApi": "jolteon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(135), shinyArtworkUrl(135)],  
        "metodoEvo": "Usar Piedra Trueno",
        "minNivel": 1,
        "objetoRequerido": "Piedra Trueno",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("flareon"),
        "nombreEvoApi": "flareon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(136), shinyArtworkUrl(136)],  
        "metodoEvo": "Usar Piedra Fuego",
        "minNivel": 1,
        "objetoRequerido": "Piedra Fuego",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("espeon"),
        "nombreEvoApi": "espeon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(196), shinyArtworkUrl(196)],  
        "metodoEvo": "Subir de nivel + Amistad de Día",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "day",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("umbreon"),
        "nombreEvoApi": "umbreon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(197), shinyArtworkUrl(197)],  
        "metodoEvo": "Subir de nivel + Amistad de Noche",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "night",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("leafeon"),
        "nombreEvoApi": "leafeon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(470), shinyArtworkUrl(470)],  
        "metodoEvo": "Subir de nivel cerca de la roca musgo o usar Piedra Hoja",
        "minNivel": 1,
        "objetoRequerido": "Piedra Hoja",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("glaceon"),
        "nombreEvoApi": "glaceon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(471), shinyArtworkUrl(471)],  
        "metodoEvo": "Subir de nivel cerca de la roca hielo o usar Piedra Hielo",
        "minNivel": 1,
        "objetoRequerido": "Piedra Hielo",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("sylveon"),
        "nombreEvoApi": "sylveon",
        "nombrePreEvo": toPokemonDisplayName("eevee"),
        "fotos": [officialArtworkUrl(700), shinyArtworkUrl(700)],  
        "metodoEvo": "Subir de nivel + Amistad conociendo un movimiento de tipo Hada",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "teddiursa":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("teddiursa"),
        "nombreEvoApi": "teddiursa",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(216), shinyArtworkUrl(216)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("ursaring"),
        "nombreEvoApi": "ursaring",
        "nombrePreEvo": toPokemonDisplayName("teddiursa"),
        "fotos": [officialArtworkUrl(217), shinyArtworkUrl(217)],  
        "metodoEvo": "Subir al nivel 30",
        "minNivel": 30,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("ursaluna"),
        "nombreEvoApi": "ursaluna",
        "nombrePreEvo": toPokemonDisplayName("ursaring"),
        "fotos": [officialArtworkUrl(901), shinyArtworkUrl(901)],  
        "metodoEvo": "Usar Bloque de Turba durante una Noche de Luna Llena",
        "minNivel": 30,
        "objetoRequerido": "Bloque de Turba",
        "region": "",
        "tiempoDelDia": "full-moon",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "ursaluna-bloodmoon":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("ursaluna-bloodmoon"),
        "nombreEvoApi": "ursaluna-bloodmoon",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10272), shinyArtworkUrl(10272)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "applin":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("applin"),
        "nombreEvoApi": "applin",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(840), shinyArtworkUrl(840)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("flapple"),
        "nombreEvoApi": "flapple",
        "nombrePreEvo": toPokemonDisplayName("applin"),
        "fotos": [officialArtworkUrl(841), shinyArtworkUrl(841)],  
        "metodoEvo": "Usar Manzana Ácida",
        "minNivel": 1,
        "objetoRequerido": "Manzana Ácida",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("appletun"),
        "nombreEvoApi": "appletun",
        "nombrePreEvo": toPokemonDisplayName("applin"),
        "fotos": [officialArtworkUrl(842), shinyArtworkUrl(842)],  
        "metodoEvo": "Usar Manzana Dulce",
        "minNivel": 1,
        "objetoRequerido": "Manzana Dulce",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("dipplin"),
        "nombreEvoApi": "dipplin",
        "nombrePreEvo": toPokemonDisplayName("applin"),
        "fotos": [officialArtworkUrl(1011), shinyArtworkUrl(1011)],  
        "metodoEvo": "Usar Manzana Melosa",
        "minNivel": 1,
        "objetoRequerido": "Manzana Melosa",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("hydrapple"),
        "nombreEvoApi": "hydrapple",
        "nombrePreEvo": toPokemonDisplayName("dipplin"),
        "fotos": [officialArtworkUrl(1019), shinyArtworkUrl(1019)],  
        "metodoEvo": "Subir de nivel conociendo el movimiento Bramido Dragón",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "Bramido Dragón",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "meltan":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("meltan"),
        "nombreEvoApi": "meltan",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(808), shinyArtworkUrl(808)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("melmetal"),
        "nombreEvoApi": "melmetal",
        "nombrePreEvo": toPokemonDisplayName("meltan"),
        "fotos": [officialArtworkUrl(809), shinyArtworkUrl(809)],  
        "metodoEvo": "Darle 400 caramelos Meltan en Pokémon GO",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "phione":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("manaphy"),
        "nombreEvoApi": "manaphy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(490), shinyArtworkUrl(490)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("phione"),
        "nombreEvoApi": "phione",
        "nombrePreEvo": toPokemonDisplayName("manaphy"),
        "fotos": [officialArtworkUrl(489), shinyArtworkUrl(489)],  
        "metodoEvo": "Criando de Manaphy junto con un Ditto",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "manaphy":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("manaphy"),
        "nombreEvoApi": "manaphy",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(490), shinyArtworkUrl(490)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "indeedee-male":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("indeedee-male"),
        "nombreEvoApi": "indeedee-male",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(876), shinyArtworkUrl(876)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "indeedee-female":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("indeedee-female"),
        "nombreEvoApi": "indeedee-female",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10186), shinyArtworkUrl(10186)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "milcery":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("milcery"),
        "nombreEvoApi": "milcery",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(868), shinyArtworkUrl(868)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("alcremie"),
        "nombreEvoApi": "alcremie",
        "nombrePreEvo": toPokemonDisplayName("milcery"),
        "fotos": [officialArtworkUrl(869), shinyArtworkUrl(869)],  
        "metodoEvo": "Equipado con un confite y girando",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "floette-eternal":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("floette-eternal"),
        "nombreEvoApi": "floette-eternal",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10061), shinyArtworkUrl(10061)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "lechonk":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("lechonk"),
        "nombreEvoApi": "lechonk",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(915), shinyArtworkUrl(915)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("oinkologne-male"),
        "nombreEvoApi": "oinkologne-male",
        "nombrePreEvo": toPokemonDisplayName("lechonk"),
        "fotos": [officialArtworkUrl(916), shinyArtworkUrl(916)],  
        "metodoEvo": "Subir al nivel 18 (si es macho)",
        "minNivel": 18,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("oinkologne-female"),
        "nombreEvoApi": "oinkologne-female",
        "nombrePreEvo": toPokemonDisplayName("lechonk"),
        "fotos": [officialArtworkUrl(10254), shinyArtworkUrl(10254)],  
        "metodoEvo": "Subir al nivel 18 (si es hembra)",
        "minNivel": 18,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "magnemite":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("magnemite"),
        "nombreEvoApi": "magnemite",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(81), shinyArtworkUrl(81)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("magneton"),
        "nombreEvoApi": "magneton",
        "nombrePreEvo": toPokemonDisplayName("magnemite"),
        "fotos": [officialArtworkUrl(82), shinyArtworkUrl(82)],  
        "metodoEvo": "Subir al nivel 30",
        "minNivel": 30,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("magnezone"),
        "nombreEvoApi": "magnezone",
        "nombrePreEvo": toPokemonDisplayName("magneton"),
        "fotos": [officialArtworkUrl(462), shinyArtworkUrl(462)],  
        "metodoEvo": "Subir un nivel en un campo magnético especial o usar Piedra Trueno",
        "minNivel": 30,
        "objetoRequerido": "Piedra Trueno",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "grubbin":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("grubbin"),
        "nombreEvoApi": "grubbin",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(736), shinyArtworkUrl(736)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("charjabug"),
        "nombreEvoApi": "charjabug",
        "nombrePreEvo": toPokemonDisplayName("grubbin"),
        "fotos": [officialArtworkUrl(737), shinyArtworkUrl(737)],  
        "metodoEvo": "Subir al nivel 20",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("vikavolt"),
        "nombreEvoApi": "vikavolt",
        "nombrePreEvo": toPokemonDisplayName("charjabug"),
        "fotos": [officialArtworkUrl(738), shinyArtworkUrl(738)],  
        "metodoEvo": "Subir un nivel en un campo magnético especial o usar Piedra Trueno",
        "minNivel": 20,
        "objetoRequerido": "Piedra Trueno",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "nosepass":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("nosepass"),
        "nombreEvoApi": "nosepass",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(299), shinyArtworkUrl(299)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("probopass"),
        "nombreEvoApi": "probopass",
        "nombrePreEvo": toPokemonDisplayName("nosepass"),
        "fotos": [officialArtworkUrl(476), shinyArtworkUrl(476)],  
        "metodoEvo": "Subir un nivel en un campo magnético especial o usar Piedra Trueno",
        "minNivel": 1,
        "objetoRequerido": "Piedra Trueno",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "nincada":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("nincada"),
        "nombreEvoApi": "nincada",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(290), shinyArtworkUrl(290)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("ninjask"),
        "nombreEvoApi": "ninjask",
        "nombrePreEvo": toPokemonDisplayName("nincada"),
        "fotos": [officialArtworkUrl(291), shinyArtworkUrl(291)],  
        "metodoEvo": "Subir al nivel 20",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("shedinja"),
        "nombreEvoApi": "shedinja",
        "nombrePreEvo": toPokemonDisplayName("nincada"),
        "fotos": [officialArtworkUrl(292), shinyArtworkUrl(292)],  
        "metodoEvo": "Se obtiene junto a Ninjask, solo si hay espacio en el equipo y teniendo una Poké Ball",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "pancham":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("pancham"),
        "nombreEvoApi": "pancham",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(674), shinyArtworkUrl(674)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("pangoro"),
        "nombreEvoApi": "pangoro",
        "nombrePreEvo": toPokemonDisplayName("pancham"),
        "fotos": [officialArtworkUrl(675), shinyArtworkUrl(675)],  
        "metodoEvo": "Subir al nivel 32 + tener un Pokémon de tipo Siniestro en el equipo",
        "minNivel": 32,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "pawniard":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("pawniard"),
        "nombreEvoApi": "pawniard",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(624), shinyArtworkUrl(624)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("bisharp"),
        "nombreEvoApi": "bisharp",
        "nombrePreEvo": toPokemonDisplayName("pawniard"),
        "fotos": [officialArtworkUrl(625), shinyArtworkUrl(625)],  
        "metodoEvo": "Subir al nivel 52",
        "minNivel": 52,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("kingambit"),
        "nombreEvoApi": "kingambit",
        "nombrePreEvo": toPokemonDisplayName("bisharp"),
        "fotos": [officialArtworkUrl(983), shinyArtworkUrl(983)],  
        "metodoEvo": "Derrotar a 3 Bisharp líderes con un distintivo de líder + nivel",
        "minNivel": 52,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "karrablast":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("karrablast"),
        "nombreEvoApi": "karrablast",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(588), shinyArtworkUrl(588)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("escavalier"),
        "nombreEvoApi": "escavalier",
        "nombrePreEvo": toPokemonDisplayName("karrablast"),
        "fotos": [officialArtworkUrl(589), shinyArtworkUrl(589)],  
        "metodoEvo": "Mediante intercambio por un Shelmet",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "shelmet":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("shelmet"),
        "nombreEvoApi": "shelmet",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(616), shinyArtworkUrl(616)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("accelgor"),
        "nombreEvoApi": "accelgor",
        "nombrePreEvo": toPokemonDisplayName("shelmet"),
        "fotos": [officialArtworkUrl(617), shinyArtworkUrl(617)],  
        "metodoEvo": "Mediante intercambio por un Karrablast",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "feebas":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("feebas"),
        "nombreEvoApi": "feebas",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(349), shinyArtworkUrl(349)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("milotic"),
        "nombreEvoApi": "milotic",
        "nombrePreEvo": toPokemonDisplayName("feebas"),
        "fotos": [officialArtworkUrl(350), shinyArtworkUrl(350)],  
        "metodoEvo": "Mediante intercambio equipado con Escama Bella",
        "minNivel": 1,
        "objetoRequerido": "Escama Bella",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "mantyke":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("mantyke"),
        "nombreEvoApi": "mantyke",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(458), shinyArtworkUrl(458)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("mantine"),
        "nombreEvoApi": "mantine",
        "nombrePreEvo": toPokemonDisplayName("mantyke"),
        "fotos": [officialArtworkUrl(226), shinyArtworkUrl(226)],  
        "metodoEvo": "Subir de nivel + tener un Remoraid en el equipo",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "crabrawler":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("crabrawler"),
        "nombreEvoApi": "crabrawler",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(739), shinyArtworkUrl(739)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("crabominable"),
        "nombreEvoApi": "crabominable",
        "nombrePreEvo": toPokemonDisplayName("crabrawler"),
        "fotos": [officialArtworkUrl(740), shinyArtworkUrl(740)],  
        "metodoEvo": "Subir de nivel en el Monte Lanakila (7ma Gen) o usar Piedra Hielo (a partir de 9na Gen)",
        "minNivel": 1,
        "objetoRequerido": "Piedra Hielo",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "corsola":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("corsola"),
        "nombreEvoApi": "corsola",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(222), shinyArtworkUrl(222)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },

  // Evos de Region Alola
  "raichu-alola":
  {
    "replace": false,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("raichu-alola"),
        "nombreEvoApi": "raichu-alola",
        "nombrePreEvo": toPokemonDisplayName("pikachu"),
        "fotos": [officialArtworkUrl(10100), shinyArtworkUrl(10100)],  
        "metodoEvo": "Usar Piedra Trueno en Alola",
        "minNivel": 0,
        "objetoRequerido": "Piedra Trueno",
        "region": "alola",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "rattata-alola":
  {
    "replace": false,
    "region": "alola",
    "evolutionChain": []
  },
  "sandshrew-alola":
  {
    "replace": false,
    "region": "alola",
    "evolutionChain": []
  },
  "vulpix-alola":
  {
    "replace": false,
    "region": "alola",
    "evolutionChain": []
  },
  "diglett-alola":
  {
    "replace": false,
    "region": "alola",
    "evolutionChain": []
  },
  "geodude-alola":
  {
    "replace": false,
    "region": "alola",
    "evolutionChain": []
  },
  "grimer-alola":
  {
    "replace": false,
    "region": "alola",
    "evolutionChain": []
  },
  "exeggutor-alola":
  {
    "replace": false,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("exeggutor-alola"),
        "nombreEvoApi": "exeggutor-alola",
        "nombrePreEvo": toPokemonDisplayName("exeggcute"),
        "fotos": [officialArtworkUrl(10114), shinyArtworkUrl(10114)],  
        "metodoEvo": "Usar Piedra Hoja en Alola",
        "minNivel": 0,
        "objetoRequerido": "Piedra Hoja",
        "region": "alola",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "marowak-alola":
  {
    "replace": false,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("marowak-alola"),
        "nombreEvoApi": "marowak-alola",
        "nombrePreEvo": toPokemonDisplayName("cubone"),
        "fotos": [officialArtworkUrl(10115), shinyArtworkUrl(10115)],  
        "metodoEvo": "Subir al nivel 28 de Noche en Alola",
        "minNivel": 28,
        "objetoRequerido": "",
        "region": "alola",
        "tiempoDelDia": "night",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "meowth-alola":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("meowth-alola"),
        "nombreEvoApi": "meowth-alola",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10107), shinyArtworkUrl(10107)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("persian-alola"),
        "nombreEvoApi": "persian-alola",
        "nombrePreEvo": toPokemonDisplayName("meowth-alola"),
        "fotos": [officialArtworkUrl(10108), shinyArtworkUrl(10108)],  
        "metodoEvo": "Subir al nivel 28 + Amistad",
        "minNivel": 28,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },

  // Evos de Region Galar
  "meowth-galar":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("meowth-galar"),
        "nombreEvoApi": "meowth-galar",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10161), shinyArtworkUrl(10161)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("perrserker"),
        "nombreEvoApi": "perrserker",
        "nombrePreEvo": toPokemonDisplayName("meowth-galar"),
        "fotos": [officialArtworkUrl(863), shinyArtworkUrl(863)],  
        "metodoEvo": "Subir al nivel 28",
        "minNivel": 28,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "weezing-galar":
  {
    "replace": false,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("weezing-galar"),
        "nombreEvoApi": "weezing-galar",
        "nombrePreEvo": toPokemonDisplayName("koffing"),
        "fotos": [officialArtworkUrl(10167), shinyArtworkUrl(10167)],  
        "metodoEvo": "Subir al nivel 35 en Galar",
        "minNivel": 35,
        "objetoRequerido": "",
        "region": "galar",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "corsola-galar":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("corsola-galar"),
        "nombreEvoApi": "corsola-galar",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10173), shinyArtworkUrl(10173)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("cursola"),
        "nombreEvoApi": "cursola",
        "nombrePreEvo": toPokemonDisplayName("corsola-galar"),
        "fotos": [officialArtworkUrl(864), shinyArtworkUrl(864)],  
        "metodoEvo": "Subir al nivel 38",
        "minNivel": 38,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "zigzagoon-galar":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("zigzagoon-galar"),
        "nombreEvoApi": "zigzagoon-galar",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10174), shinyArtworkUrl(10174)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("linoone-galar"),
        "nombreEvoApi": "linoone-galar",
        "nombrePreEvo": toPokemonDisplayName("zigzagoon-galar"),
        "fotos": [officialArtworkUrl(10175), shinyArtworkUrl(10175)],  
        "metodoEvo": "Subir al nivel 20",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("obstagoon"),
        "nombreEvoApi": "obstagoon",
        "nombrePreEvo": toPokemonDisplayName("linoone-galar"),
        "fotos": [officialArtworkUrl(862), shinyArtworkUrl(862)],  
        "metodoEvo": "Subir al nivel 35 de noche",
        "minNivel": 35,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "night",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "yamask-galar":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("yamask-galar"),
        "nombreEvoApi": "yamask-galar",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10179), shinyArtworkUrl(10179)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("runerigus"),
        "nombreEvoApi": "runerigus",
        "nombrePreEvo": toPokemonDisplayName("yamask-galar"),
        "fotos": [officialArtworkUrl(867), shinyArtworkUrl(867)],  
        "metodoEvo": "Perder mínimo 49 PS en combate + pasar bajo la formación rocosa de la Cuenca Polvorienta (Galar). Pasar bajo cualquiera de los dos puentes del Canal Affluer (Leyendas Pokémon: ZA)",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "farfetchd-galar":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("farfetchd-galar"),
        "nombreEvoApi": "farfetchd-galar",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10166), shinyArtworkUrl(10166)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("sirfetchd"),
        "nombreEvoApi": "sirfetchd",
        "nombrePreEvo": toPokemonDisplayName("farfetchd-galar"),
        "fotos": [officialArtworkUrl(865), shinyArtworkUrl(865)],  
        "metodoEvo": "Asestar 3 golpes críticos en un mismo combate",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "slowpoke-galar":
  {
    "replace": false,
    "region": "galar",
    "evolutionChain": []
  },
  "articuno-galar":
  {
    "replace": false,
    "region": "galar",
    "evolutionChain": []
  },
  "zapdos-galar":
  {
    "replace": false,
    "region": "galar",
    "evolutionChain": []
  },
  "moltres-galar":
  {
    "replace": false,
    "region": "galar",
    "evolutionChain": []
  },
  "stunfisk-galar":
  {
    "replace": false,
    "region": "galar",
    "evolutionChain": []
  },
  "ponyta-galar":
  {
    "replace": false,
    "region": "galar",
    "evolutionChain": []
  },
  "darumaka-galar":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("darumaka-galar"),
        "nombreEvoApi": "darumaka-galar",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10176), shinyArtworkUrl(10176)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("darmanitan-galar-standard"),
        "nombreEvoApi": "darmanitan-galar-standard",
        "nombrePreEvo": toPokemonDisplayName("darumaka-galar"),
        "fotos": [officialArtworkUrl(10177), shinyArtworkUrl(10177)],  
        "metodoEvo": "Usar Piedra Hielo",
        "minNivel": 1,
        "objetoRequerido": "Piedra Hielo",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },

  // Evos de Region Hisui
  "qwilfish-hisui":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("qwilfish-hisui"),
        "nombreEvoApi": "qwilfish-hisui",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10234), shinyArtworkUrl(10234)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("overqwil"),
        "nombreEvoApi": "overqwil",
        "nombrePreEvo": toPokemonDisplayName("qwilfish-hisui"),
        "fotos": [officialArtworkUrl(904), shinyArtworkUrl(904)],  
        "metodoEvo": "Subir de nivel conociendo el movimiento Mil Púas Tóxicas",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "barb-barrage",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "sneasel-hisui":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("sneasel-hisui"),
        "nombreEvoApi": "sneasel-hisui",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10235), shinyArtworkUrl(10235)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("sneasler"),
        "nombreEvoApi": "sneasler",
        "nombrePreEvo": toPokemonDisplayName("sneasel-hisui"),
        "fotos": [officialArtworkUrl(903), shinyArtworkUrl(903)],  
        "metodoEvo": "Subir de nivel equipado con Garra Afilada de Día",
        "minNivel": 1,
        "objetoRequerido": "Garra Afilada",
        "region": "",
        "tiempoDelDia": "day",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "voltorb-hisui":
  {
    "replace": false,
    "region": "hisui",
    "evolutionChain": []
  },
  "growlithe-hisui":
  {
    "replace": false,
    "region": "hisui",
    "evolutionChain": []
  },
  "zorua-hisui":
  {
    "replace": false,
    "region": "hisui",
    "evolutionChain": []
  },

  // Evos de Region Paldea
  "wooper-paldea":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("wooper-paldea"),
        "nombreEvoApi": "wooper-paldea",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10253), shinyArtworkUrl(10253)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      },
      {
        "nombreEvolucion": toPokemonDisplayName("clodsire"),
        "nombreEvoApi": "clodsire",
        "nombrePreEvo": toPokemonDisplayName("wooper-paldea"),
        "fotos": [officialArtworkUrl(980), shinyArtworkUrl(980)],  
        "metodoEvo": "Subir al nivel 20",
        "minNivel": 20,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tauros-paldea-aqua-breed":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tauros-paldea-aqua-breed"),
        "nombreEvoApi": "tauros-paldea-aqua-breed",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10252), shinyArtworkUrl(10252)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tauros-paldea-blaze-breed":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tauros-paldea-blaze-breed"),
        "nombreEvoApi": "tauros-paldea-blaze-breed",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10251), shinyArtworkUrl(10251)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  },
  "tauros-paldea-combat-breed":
  {
    "replace": true,
    "region": "",
    "evolutionChain": [
      {
        "nombreEvolucion": toPokemonDisplayName("tauros-paldea-combat-breed"),
        "nombreEvoApi": "tauros-paldea-combat-breed",
        "nombrePreEvo": "",
        "fotos": [officialArtworkUrl(10250), shinyArtworkUrl(10250)],  
        "metodoEvo": "",
        "minNivel": 1,
        "objetoRequerido": "",
        "region": "",
        "tiempoDelDia": "",
        "genero": "",
        "conocerMov": "",
        "necesitaLluviaOverworld": false
      }
    ]
  }
};

export const EVOLUTION_PATCH_PKM_ALIASES =
{
  // Evos Manuales
  "meowth": "meowth",
  "persian": "meowth",

  "yamask": "yamask",
  "cofagrigus": "yamask",

  "mime-jr": "mr-mime",
  "mr-mime": "mr-mime",
  "mr-mime-galar": "mr-mime",
  "mr-rime": "mr-mime",

  "farfetchd": "farfetchd",

  "zigzagoon": "zigzagoon",
  "linoone": "zigzagoon",

  "darumaka": "darumaka",
  "darmanitan-standard": "darumaka",
  "darmanitan-zen": "darumaka",

  "qwilfish": "qwilfish",

  "sneasel": "sneasel",
  "weavile": "sneasel",

  "petilil": "petilil",
  "lilligant": "petilil",
  "lilligant-hisui": "petilil",

  "rufflet": "rufflet",
  "braviary": "rufflet",
  "braviary-hisui": "rufflet",

  "goomy": "goomy",
  "sliggoo": "goomy",
  "sliggoo-hisui": "goomy",
  "goodra": "goomy",
  "goodra-hisui": "goomy",

  "bergmite": "bergmite",
  "avalugg": "bergmite",
  "avalugg-hisui": "bergmite",

  "cyndaquil": "cyndaquil",
  "quilava": "cyndaquil",
  "typhlosion": "cyndaquil",
  "typhlosion-hisui": "cyndaquil",

  "rowlet": "rowlet",
  "dartrix": "rowlet",
  "decidueye": "rowlet",
  "decidueye-hisui": "rowlet",

  "oshawott": "oshawott",
  "dewott": "oshawott",
  "samurott": "oshawott",
  "samurott-hisui": "oshawott",

  "wooper": "wooper",
  "quagsire": "wooper",

  "castform-sunny": "castform-sunny",
  "castform-rainy": "castform-rainy",
  "castform-snowy": "castform-snowy",

  "burmy": "burmy",
  "wormadam-plant": "burmy",
  "wormadam-sandy": "wormadam-sandy",
  "wormadam-trash": "wormadam-trash",
  "mothim": "burmy",

  "kyogre-primal": "kyogre-primal",
  "groudon-primal": "groudon-primal",

  "meloetta-aria": "meloetta-aria",
  "meloetta-pirouette": "meloetta-pirouette",

  "honedge": "aegislash-shield",
  "doublade": "aegislash-shield",
  "aegislash-blade": "aegislash-blade",
  "aegislash-shield": "aegislash-shield",

  "wishiwashi-solo": "wishiwashi-solo",
  "wishiwashi-school": "wishiwashi-school",

  "eiscue-ice": "eiscue-ice",
  "eiscue-noice": "eiscue-noice",

  "zygarde-10": "zygarde-10",
  "zygarde-50": "zygarde-50",
  "zygarde-complete": "zygarde-complete",

  "minior-red-meteor": "minior-red-meteor",
  "minior-red": "minior-red",
  "minior-orange": "minior-orange",
  "minior-yellow": "minior-yellow",
  "minior-green": "minior-green",
  "minior-blue": "minior-blue",
  "minior-indigo": "minior-indigo",
  "minior-violet": "minior-violet",

  "mimikyu-disguised": "mimikyu-disguised",

  "necrozma-dusk": "necrozma-dusk",
  "necrozma-dawn": "necrozma-dawn",
  "necrozma-ultra": "necrozma-ultra",

  "morpeko-full-belly": "morpeko-full-belly",

  "zacian-crowned": "zacian-crowned",
  "zamazenta-crowned": "zamazenta-crowned",

  "finizen": "palafin-zero",
  "palafin-zero": "palafin-zero",
  "palafin-hero": "palafin-hero",

  "terapagos-terastal": "terapagos-terastal",
  "terapagos-stellar": "terapagos-stellar",

  "deoxys-normal": "deoxys-normal",
  "deoxys-attack": "deoxys-attack",
  "deoxys-defense": "deoxys-defense",
  "deoxys-speed": "deoxys-speed",

  "rotom-heat": "rotom-heat",
  "rotom-wash": "rotom-wash",
  "rotom-frost": "rotom-frost",
  "rotom-fan": "rotom-fan",
  "rotom-mow": "rotom-mow",

  "dialga-origin": "dialga-origin",
  "palkia-origin": "palkia-origin",
  "giratina-altered": "giratina-altered",
  "giratina-origin": "giratina-origin",

  "shaymin-land": "shaymin-land",
  "shaymin-sky": "shaymin-sky",

  "tornadus-incarnate": "tornadus-incarnate",
  "tornadus-therian": "tornadus-therian",

  "thundurus-incarnate": "thundurus-incarnate",
  "thundurus-therian": "thundurus-therian",

  "landorus-incarnate": "landorus-incarnate",
  "landorus-therian": "landorus-therian",

  "enamorus-incarnate": "enamorus-incarnate",
  "enamorus-therian": "enamorus-therian",

  "kyurem-white": "kyurem-white",
  "kyurem-black": "kyurem-black",

  "keldeo-ordinary": "keldeo-ordinary",

  "hoopa-unbound": "hoopa-unbound",

  "oricorio-baile": "oricorio-baile",
  "oricorio-pom-pom": "oricorio-pom-pom",
  "oricorio-pau": "oricorio-pau",
  "oricorio-sensu": "oricorio-sensu",

  "calyrex-ice": "calyrex-ice",
  "calyrex-shadow": "calyrex-shadow",

  "kubfu": "kubfu",
  "urshifu-single-strike": "kubfu",
  "urshifu-rapid-strike": "kubfu",

  "ogerpon-wellspring-mask": "ogerpon-wellspring-mask",
  "ogerpon-hearthflame-mask": "ogerpon-hearthflame-mask",
  "ogerpon-cornerstone-mask": "ogerpon-cornerstone-mask",

  "rockruff": "rockruff",
  "lycanroc-midday": "rockruff",
  "lycanroc-midnight": "rockruff",
  "lycanroc-dusk": "rockruff",

  "toxel": "toxel",
  "toxtricity-amped": "toxel",
  "toxtricity-low-key": "toxel",

  "tandemaus": "tandemaus",
  "maushold-family-of-four": "tandemaus",

  "squawkabilly-green-plumage": "squawkabilly-green-plumage",
  "squawkabilly-blue-plumage": "squawkabilly-blue-plumage",
  "squawkabilly-yellow-plumage": "squawkabilly-yellow-plumage",
  "squawkabilly-white-plumage": "squawkabilly-white-plumage",

  "tatsugiri-curly": "tatsugiri-curly",

  "dunsparce": "dunsparce",
  "dudunsparce-two-segment": "dunsparce",

  "gimmighoul": "gimmighoul",
  "gimmighoul-roaming": "gimmighoul-roaming",
  "gholdengo": "gimmighoul",

  "rellor": "rellor",
  "rabsca": "rellor",

  "pawmi": "pawmi",
  "pawmo": "pawmi",
  "pawmot": "pawmi",

  "bramblin": "bramblin",
  "brambleghast": "bramblin",

  "mankey": "mankey",
  "primeape": "mankey",
  "annihilape": "mankey",

  "inkay": "inkay",
  "malamar": "inkay",

  "espurr": "espurr",
  "meowstic-male": "espurr",
  "meowstic-female": "espurr",

  "pumpkaboo-average": "pumpkaboo-average",
  "gourgeist-average": "pumpkaboo-average",

  "pumpkaboo-small": "pumpkaboo-small",
  "gourgeist-small": "pumpkaboo-small",

  "pumpkaboo-large": "pumpkaboo-large",
  "gourgeist-large": "pumpkaboo-large",
  
  "pumpkaboo-super": "pumpkaboo-super",
  "gourgeist-super": "pumpkaboo-super",

  "tyrogue": "tyrogue",
  "hitmonlee": "tyrogue",
  "hitmonchan": "tyrogue",
  "hitmontop": "tyrogue",

  "eevee": "eevee",
  "vaporeon": "eevee",
  "jolteon": "eevee",
  "flareon": "eevee",
  "espeon": "eevee",
  "umbreon": "eevee",
  "leafeon": "eevee",
  "glaceon": "eevee",
  "sylveon": "eevee",

  "teddiursa": "teddiursa",
  "ursaring": "teddiursa",
  "ursaluna": "teddiursa",

  "ursaluna-bloodmoon": "ursaluna-bloodmoon",

  "applin": "applin",
  "flapple": "applin",
  "appletun": "applin",
  "dipplin": "applin",
  "hydrapple": "applin",

  "meltan": "meltan",
  "melmetal": "meltan",

  "phione": "phione",
  "manaphy": "manaphy",

  "indeedee-male": "indeedee-male",
  "indeedee-female": "indeedee-female",

  "milcery": "milcery",
  "alcremie": "milcery",

  "floette-eternal": "floette-eternal",

  "lechonk": "lechonk",
  "oinkologne-male": "lechonk",
  "oinkologne-female": "lechonk",

  "magnemite": "magnemite",
  "magneton": "magnemite",
  "magnezone": "magnemite",

  "grubbin": "grubbin",
  "charjabug": "grubbin",
  "vikavolt": "grubbin",

  "nosepass": "nosepass",
  "probopass": "nosepass",

  "nincada": "nincada",
  "ninjask": "nincada",
  "shedinja": "nincada",

  "pancham": "pancham",
  "pangoro": "pancham",

  "pawniard": "pawniard",
  "bisharp": "pawniard",
  "kingambit": "pawniard",

  "karrablast": "karrablast",
  "escavalier": "karrablast",

  "shelmet": "shelmet",
  "accelgor": "shelmet",

  "feebas": "feebas",
  "milotic": "feebas",

  "mantyke": "mantyke",
  "mantine": "mantyke",

  "crabrawler": "crabrawler",
  "crabominable": "crabrawler",

  "basculin-red-striped": "basculin-red-striped",
  "basculin-blue-striped": "basculin-blue-striped",

  "basculin-white-striped": "basculin-white-striped",
  "basculegion-female": "basculin-white-striped",
  "basculegion-male": "basculin-white-striped",

  // Evos Alola
  "pichu": "raichu-alola",
  "pikachu": "raichu-alola",
  "raichu": "raichu-alola",
  "raichu-alola": "raichu-alola",

  "rattata-alola": "rattata-alola",
  "raticate-alola": "rattata-alola",

  "sandshrew-alola": "sandshrew-alola",
  "sandslash-alola": "sandshrew-alola",

  "vulpix-alola": "vulpix-alola",
  "ninetales-alola": "vulpix-alola",

  "diglett-alola": "diglett-alola",
  "dugtrio-alola": "diglett-alola",

  "geodude-alola": "geodude-alola",
  "graveler-alola": "geodude-alola",
  "golem-alola": "geodude-alola",

  "grimer-alola": "grimer-alola",
  "muk-alola": "grimer-alola",

  "exeggcute": "exeggutor-alola",
  "exeggutor": "exeggutor-alola",
  "exeggutor-alola": "exeggutor-alola",

  "cubone": "marowak-alola",
  "marowak": "marowak-alola",
  "marowak-alola": "marowak-alola",

  "meowth-alola": "meowth-alola",
  "persian-alola": "meowth-alola",

  "corsola": "corsola",

  // Evos Galar
  "meowth-galar": "meowth-galar",
  "perrserker": "meowth-galar",

  "koffing": "weezing-galar",
  "weezing": "weezing-galar",
  "weezing-galar": "weezing-galar",

  "corsola-galar": "corsola-galar",
  "cursola": "corsola-galar",

  "zigzagoon-galar": "zigzagoon-galar",
  "linoone-galar": "zigzagoon-galar",
  "obstagoon": "zigzagoon-galar",

  "yamask-galar": "yamask-galar",
  "runerigus": "yamask-galar",

  "farfetchd-galar": "farfetchd-galar",
  "sirfetchd": "farfetchd-galar",

  "slowpoke-galar": "slowpoke-galar",
  "slowbro-galar": "slowpoke-galar",
  "slowking-galar": "slowpoke-galar",

  "articuno-galar": "articuno-galar",
  "zapdos-galar": "zapdos-galar",
  "moltres-galar": "moltres-galar",

  "stunfisk-galar": "stunfisk-galar",

  "ponyta-galar": "ponyta-galar",
  "rapidash-galar": "ponyta-galar",

  "darumaka-galar": "darumaka-galar",
  "darmanitan-galar-standard": "darumaka-galar",
  "darmanitan-galar-zen": "darumaka-galar",

  // Evos Hisui
  "qwilfish-hisui": "qwilfish-hisui",
  "overqwil": "qwilfish-hisui",

  "sneasel-hisui": "sneasel-hisui",
  "sneasler": "sneasel-hisui",

  "voltorb-hisui": "voltorb-hisui",
  "electrode-hisui": "voltorb-hisui",

  "growlithe-hisui": "growlithe-hisui",
  "arcanine-hisui": "growlithe-hisui",

  "zorua-hisui": "zorua-hisui",
  "zoroark-hisui": "zorua-hisui",

  // Evos Paldea
  "wooper-paldea": "wooper-paldea",
  "clodsire": "wooper-paldea",

  "tauros-paldea-aqua-breed": "tauros-paldea-aqua-breed",
  "tauros-paldea-blaze-breed": "tauros-paldea-blaze-breed",
  "tauros-paldea-combat-breed": "tauros-paldea-combat-breed"
};

export function getPokemonEvolutionPatchKey(input)
{
  const key = String(input || "").trim().toLowerCase();
  if (!key) return null;

  return EVOLUTION_PATCH_PKM_ALIASES[key] || null;
}

export function getPokemonEvolutionPatch(input)
{
  const patchKey = getPokemonEvolutionPatchKey(input);
  return patchKey ? (EVOLUTION_PATCH_PKM_META[patchKey] || null) : null;
}

export function hasPokemonEvolutionPatch(input)
{
  return !!getPokemonEvolutionPatch(input);
}
// ---------------- DATOS META DE PARCHE EVOLUCIÓN POKÉMON - FIN ---------------- 


// ---------------- DATOS META POKÉMON CON HABILIDADES EXTRA - INICIO ---------------- 
//#region EXTRA HAB
export const EXTRA_ABILITIES_BY_KEY =
{
  "rockruff": {
    "extraVisibles": [],
    "replaceVisibles": null,
    "extraHidden": ["own-tempo"],
    "replaceHidden": false
  },
  "zygarde-10": {
    "extraVisibles":["power-construct"],
    "replaceVisibles": false,
    "extraHidden": [],
    "replaceHidden": null
  },
  "zygarde-50": {
    "extraVisibles":["power-construct"],
    "replaceVisibles": false,
    "extraHidden": [],
    "replaceHidden": null
  },
  "darmanitan-zen": {
    "extraVisibles":[],
    "replaceVisibles": true,
    "extraHidden": ["zen-mode"],
    "replaceHidden": true
  },
  "darmanitan-galar-zen": {
    "extraVisibles":[],
    "replaceVisibles": true,
    "extraHidden": ["zen-mode"],
    "replaceHidden": true
  }
};

export function getExtraAbilitiesMetaByKey(input)
{
  const key = String(input || "").trim().toLowerCase();
  if(!key) return null;

  return EXTRA_ABILITIES_BY_KEY[key] || null;
}

export function getExtraAbilityKeysByKey(input, type = null)
{
  const meta = getExtraAbilitiesMetaByKey(input);

  if(!meta)
  {
    return type
      ? []
      : {
          extraVisibles: [],
          extraHidden: [],
          replaceVisibles: null,
          replaceHidden: null
        };
  }

  const extraVisibles = Array.isArray(meta.extraVisibles)
    ? meta.extraVisibles.filter(Boolean)
    : [];

  const extraHidden = Array.isArray(meta.extraHidden)
    ? meta.extraHidden.filter(Boolean)
    : [];

  const replaceVisibles = typeof meta.replaceVisibles === "boolean"
    ? meta.replaceVisibles
    : null;

  const replaceHidden = typeof meta.replaceHidden === "boolean"
    ? meta.replaceHidden
    : null;

  if(type === "extraVisibles") return extraVisibles;
  if(type === "extraHidden") return extraHidden;

  return {
    extraVisibles,
    extraHidden,
    replaceVisibles,
    replaceHidden
  };
}

export function hasExtraAbilitiesByKey(input)
{
  return !!getExtraAbilitiesMetaByKey(input);
}
// ---------------- DATOS META POKÉMON CON HABILIDADES EXTRA - FIN ---------------- 
