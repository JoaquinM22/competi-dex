//** src\utils\competidexRoutes.js

export const ROUTES = {  
    ITEM: "objeto",
    ABILITY: "habilidad",
    MOVE: "movimiento",
    POKEMON: "pokemon",
    POKEDEX: "pokedex",
    DYR_CALCULATOR: "calculadora-de-debilidades-y-resistencias",  
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