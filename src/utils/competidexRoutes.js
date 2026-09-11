//** src\utils\competidexRoutes.js

import { buildAdvancedPkmSearchUrl } from "../CompetidexComponents/BuscadorAvanzadoComponents/BuscadorAvanzadoPkmComponents/competidexAdvancedPkmFilters";
import { buildAdvancedMovsSearchUrl } from "../CompetidexComponents/BuscadorAvanzadoComponents/BuscadorAvanzadoMovsComponents/competidexAdvancedMovsFilters";
import { buildAdvancedHabsSearchUrl } from "../CompetidexComponents/BuscadorAvanzadoComponents/BuscadorAvanzadoHabsComponents/competidexAdvancedHabsFilters";
import { buildAdvancedItemsSearchUrl } from "../CompetidexComponents/BuscadorAvanzadoComponents/BuscadorAvanzadoItemsComponents/competidexAdvancedItemsFilters";

// -------------- RUTAS - INICIO -------------- 

export const ROUTES = {
    ITEM: "objeto",
    ABILITY: "habilidad",
    MOVE: "movimiento",
    POKEMON: "pokemon",
    POKEDEX: "pokedex",
    DYR_CALCULATOR: "calculadora-de-debilidades-y-resistencias",
    STATS_PKM_CALCULATOR: "calculadora-de-caracteristicas",
    ADVANCED_SEARCH: "buscador-avanzado"
};

export function itemRoute(slug = "")
{
    return slug ? `/${ROUTES.ITEM}/${slug}` : `/${ROUTES.ITEM}`;
}

export function abilityRoute(slug = "")
{
    return slug ? `/${ROUTES.ABILITY}/${slug}` : `/${ROUTES.ABILITY}`;
}

export function moveRoute(slug = "")
{
    return slug ? `/${ROUTES.MOVE}/${slug}` : `/${ROUTES.MOVE}`;
}

export function pokemonRoute(slug = "")
{
    return slug ? `/${ROUTES.POKEMON}/${slug}` : `/${ROUTES.POKEMON}`;
}

export function pokedexRoute(slug = "")
{
    return slug ? `/${ROUTES.POKEDEX}/${slug}` : `/${ROUTES.POKEDEX}`;
}

// -------------- RUTAS - FIN -------------- 


// -------------- BUSCADOR AVANZADO - INICIO -------------- 

export const ADVANCED_SEARCH_TAB_CONFIG = {
    pokemon: {
        key: "pokemon",
        description: "Pokémon",
        label: "Pokémon",
        routeSegment: ROUTES.POKEMON,
        typeFilterField: "types",
        typeFilterOperator: "contains",
        buildSearchUrl: buildAdvancedPkmSearchUrl
    },
    movimientos: {
        key: "movimientos",
        description: "Movimientos",
        label: "Movimientos",
        routeSegment: ROUTES.MOVE,
        typeFilterField: "type",
        typeFilterOperator: "eq",
        buildSearchUrl: buildAdvancedMovsSearchUrl
    },
    habilidades: {
        key: "habilidades",
        description: "Habilidades",
        label: "Habilidades",
        routeSegment: ROUTES.ABILITY,
        buildSearchUrl: buildAdvancedHabsSearchUrl
    },
    objetos: {
        key: "objetos",
        description: "Objetos",
        label: "Objetos",
        routeSegment: ROUTES.ITEM,
        buildSearchUrl: buildAdvancedItemsSearchUrl
    }
};

export function getAdvancedSearchTabConfig(tabKey = "pokemon")
{
    return ADVANCED_SEARCH_TAB_CONFIG[tabKey] || ADVANCED_SEARCH_TAB_CONFIG.pokemon;
}

export function getAdvancedSearchTabs()
{
    return Object.values(ADVANCED_SEARCH_TAB_CONFIG);
}

export function getAdvancedSearchTabByPath(pathname = "")
{
    const currentPath = String(pathname || "");

    return getAdvancedSearchTabs().find(function(tab)
    {
        return currentPath.includes(`/${ROUTES.ADVANCED_SEARCH}/${tab.routeSegment}`);
    }) || null;
}

export function advancedSearchRouteByTab(tabKey = "pokemon")
{
    const tab = getAdvancedSearchTabConfig(tabKey);

    return `/${ROUTES.ADVANCED_SEARCH}/${tab.routeSegment}`;
}

export function advancedSearchRouteWithFiltersByTab(tabKey = "pokemon", { filters = [], sort = null } = {})
{
    const tab = getAdvancedSearchTabConfig(tabKey);
    const buildSearchUrl = typeof tab.buildSearchUrl === "function" ? tab.buildSearchUrl : buildAdvancedPkmSearchUrl;

    return buildSearchUrl(advancedSearchRouteByTab(tab.key), { filters, sort });
}

// Navegacion de Filtros Pokemon
export function advancedPokemonSearchRoute()
{
    return advancedSearchRouteByTab("pokemon");
}

export function advancedPokemonSearchRouteWithFilters({ filters = [], sort = null } = {})
{
    return advancedSearchRouteWithFiltersByTab("pokemon", { filters, sort });
}

// Navegacion de Filtros Movimientos
export function advancedMovesSearchRoute()
{
    return advancedSearchRouteByTab("movimientos");
}

export function advancedMovesSearchRouteWithFilters({ filters = [], sort = null } = {})
{
    return advancedSearchRouteWithFiltersByTab("movimientos", { filters, sort });
}

// Navegacion de Filtros Habilidades
export function advancedAbilitiesSearchRoute()
{
    return advancedSearchRouteByTab("habilidades");
}

export function advancedAbilitiesSearchRouteWithFilters({ filters = [], sort = null } = {})
{
    return advancedSearchRouteWithFiltersByTab("habilidades", { filters, sort });
}

// Navegacion de Filtros Objetos/Items
export function advancedItemsSearchRoute()
{
    return advancedSearchRouteByTab("objetos");
}

export function advancedItemsSearchRouteWithFilters({ filters = [], sort = null } = {})
{
    return advancedSearchRouteWithFiltersByTab("objetos", { filters, sort });
}

// -------------- BUSCADOR AVANZADO - FIN --------------