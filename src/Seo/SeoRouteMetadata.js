//** src\Seo\SeoRouteMetadata.js

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../utils/competidexRoutes";
import { getEnabledPokedexDataMetaEntries } from "../utils/competidexMeta";

const SITE_URL = "https://competidex.pages.dev";

const DEFAULT_SEO = {
  title: "Competidex | Información Pokémon en Español",
  description: "Consulta información de Pokémon, movimientos, habilidades, objetos, Pokédex y herramientas competitivas en español."
};

const ROUTE_SEO = {
  [`/${ROUTES.ITEM}`]: {
    title: "Objetos | Competidex",
    description: "Busca objetos Pokémon y consulta la información detallada de cada uno en español."
  },
  [`/${ROUTES.ABILITY}`]: {
    title: "Habilidades | Competidex",
    description: "Busca habilidades Pokémon y consulta la información detallada de cada una en español."
  },
  [`/${ROUTES.MOVE}`]: {
    title: "Movimientos | Competidex",
    description: "Busca movimientos Pokémon y consulta la información detallada de cada uno en español."
  },
  [`/${ROUTES.POKEMON}`]: {
    title: "Pokémon | Competidex",
    description: "Busca Pokémon y consulta sus tipos, habilidades, estadísticas, movimientos y datos competitivos en español."
  },
  [`/${ROUTES.POKEDEX}`]: {
    title: "Pokedex | Competidex",
    description: "Consulta las Pokédex de todos los juegos Pokémon y filtra las entradas por generación."
  },
  [`/${ROUTES.DYR_CALCULATOR}`]: {
    title: "Calculadora de Debilidades y Resistencias | Competidex",
    description: "Consulta las debilidades y resistencias combinando los tipos y seteando habilidades especiales."
  },
  [`/${ROUTES.STATS_PKM_CALCULATOR}`]: {
    title: "Calculadora de Caracteristicas | Competidex",
    description: "Calcula las características finales de un Pokémon en base al nivel, naturaleza, EVs e IVs o Puntos de Característica."
  },
  [`/${ROUTES.ADVANCED_SEARCH}`]: {
    title: "Buscador Avanzado | Competidex",
    description: "Explora de forma paginada Pokémon, objetos, habilidades y movimientos combinando filtros y ordenamientos."
  }
};

function addPokedexRoutesSeo()
{
  const pokedexEntries = getEnabledPokedexDataMetaEntries();

  for(const entry of pokedexEntries)
  {
    const path = String(entry?.path || "").trim();
    const labelEs = String(entry?.labelEs || "").trim();

    if(!path || !labelEs) continue;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const routePath = `/pokedex${normalizedPath}`;

    ROUTE_SEO[routePath] = {
      title: `${labelEs} | Competidex`,
      description: `Ver Pokémon de la ${labelEs}`
    };
  }
}

addPokedexRoutesSeo();

function upsertMeta(selector, attributes)
{
  let element = document.head.querySelector(selector);

  if(!element)
  {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) =>
  {
    element.setAttribute(name, value);
  });
}

function upsertLink(selector, attributes)
{
  let element = document.head.querySelector(selector);

  if(!element)
  {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) =>
  {
    element.setAttribute(name, value);
  });
}

export default function SeoRouteMetadata()
{
  const { pathname } = useLocation();

  useEffect(() =>
  {
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const seo = ROUTE_SEO[normalizedPath] || DEFAULT_SEO;
    const canonicalUrl = new URL(normalizedPath, `${SITE_URL}/`).toString();

    document.title = seo.title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: seo.description
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: seo.title
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: seo.description
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl
    });

    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl
    });

  }, [pathname]);

  return null;
}