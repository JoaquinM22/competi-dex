//** src\App.js

import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ADVANCED_SEARCH_SESSION_STORAGE_KEY, getDefaultPokedexDataMetaPath, POKEBALL_BACKGROUND } from "./utils/competidexMeta";
import {
  ROUTES,
  
  pokemonRoute,
  moveRoute,
  abilityRoute,
  itemRoute,
  pokedexRoute,

  advancedPokemonSearchRoute,
  advancedMovesSearchRoute,
  advancedAbilitiesSearchRoute,
  advancedItemsSearchRoute
} from "./utils/competidexRoutes";

import { PokedexProvider } from "./CompetidexComponents/PokedexComponents/PokedexProvider";
import { PokemonProvider } from "./CompetidexComponents/PokemonComponents/PokemonProvider";
import { AreaLocalizacionProvider } from "./CompetidexComponents/AreaLocalizacionComponents/AreaLocalizacionProvider";
import { AbilitiesProvider } from "./CompetidexComponents/HabilidadesComponents/AbilitiesProvider";
import { MovesProvider } from "./CompetidexComponents/MovimientosComponents/MovesProvider";
import { ItemsProvider } from "./CompetidexComponents/ItemsComponents/ItemsProvider";
import { ToastrProvider } from "./services/ToastrService";
import { FiltroPkmProvider } from "./CompetidexComponents/BuscadorAvanzadoComponents/FiltroPkmProvider";

import VistaItem from "./CompetidexComponents/ItemsComponents/VistaItem/VistaItem";
import VistaHabilidad from "./CompetidexComponents/HabilidadesComponents/VistaHabilidad/VistaHabilidad";
import VistaMovimiento from "./CompetidexComponents/MovimientosComponents/VistaMovimiento/VistaMovimiento";
import VistaPokemon from "./CompetidexComponents/PokemonComponents/VistaPokemon/VistaPokemon";
import VistaPokedex from "./CompetidexComponents/PokedexComponents/VistaPokedex/VistaPokedex";
import CalculadoraDebilidades from "./CompetidexComponents/CalculadoraDebilidadesComponent/CalculadoraDebilidades";
import VistaCalculadoraCaracteristicas from "./CompetidexComponents/CalculadoraDeCaracteristicasComponents/VistaCalculadoraCaracteristicas";
import VistaBuscadorAvanzado from "./CompetidexComponents/BuscadorAvanzadoComponents/VistaBuscadorAvanzado";

import NavBarPkm from "./CompetidexComponents/NavBarPkm/NavBarPkm";
import ScrollToTopButton from "./CompetidexComponents/ScrollToTopButton/ScrollToTopButton";
import Footer from "./CompetidexComponents/Footer/Footer";
import "./App.css";

const DEFAULT_POKEDEX_PATH = getDefaultPokedexDataMetaPath();

function getInitialAdvancedSearchRoute()
{
  const fallbackRoute = advancedPokemonSearchRoute();

  if(typeof window === "undefined" || !window.sessionStorage)
  {
    return fallbackRoute;
  }

  try
  {
    const rawValue = window.sessionStorage.getItem(ADVANCED_SEARCH_SESSION_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : {};
    const storedPokemonRoute = String(parsedValue?.pokemon || "");

    return storedPokemonRoute.startsWith(fallbackRoute) ? storedPokemonRoute : fallbackRoute;

  }catch(e)
  {
    return fallbackRoute;
  }
}

export default function App()
{
  const appRootRef = useRef(null);

  useEffect(() =>
  {
    const rootEl = appRootRef.current;
    const headerEl = rootEl ? rootEl.querySelector(".headerWrapper") : null;
    const footerEl = rootEl ? rootEl.querySelector(".competidexFooter") : null;

    if(!rootEl || (!headerEl && !footerEl) || typeof ResizeObserver === "undefined")
    {
      return undefined;
    }

    const syncLayoutHeights = () =>
    {
      if(headerEl)
      {
        const headerHeight = Math.ceil(headerEl.getBoundingClientRect().height || 0);
        rootEl.style.setProperty("--app-header-height", headerHeight + "px");
      }

      if(footerEl)
      {
        const footerHeight = Math.ceil(footerEl.getBoundingClientRect().height || 0);
        rootEl.style.setProperty("--app-footer-height", footerHeight + "px");
      }
    };

    syncLayoutHeights();

    const observer = new ResizeObserver(syncLayoutHeights);
    if(headerEl) observer.observe(headerEl);
    if(footerEl) observer.observe(footerEl);

    window.addEventListener("resize", syncLayoutHeights, { passive: true });

    return () =>
    {
      observer.disconnect();
      window.removeEventListener("resize", syncLayoutHeights);
    };

  }, []);

  return (
    <div
      ref={appRootRef}
      className="App"
      style={{
        "--app-bg-image": `url(${POKEBALL_BACKGROUND})`
      }}
    >

      <ToastrProvider>
        <PokedexProvider preloadAll={true} preloadConcurrency={5}>
          <PokemonProvider>
            <AreaLocalizacionProvider>
              <AbilitiesProvider>
                <MovesProvider preloadCount={0} warmConcurrency={5}>
                  <ItemsProvider preloadCount={0} warmConcurrency={5}>
                    <FiltroPkmProvider>

                      {/* Header */}
                      <div className="headerWrapper">
                        <NavBarPkm />
                      </div>

                      {/* App */}
                      <div className="contenidoApp">
                        
                        <Routes>

                          {/* Cualquier Ruta rara -> Cae en Pokemon por default */}
                          <Route path="/" element={<Navigate to={pokemonRoute()} replace />} />
                          <Route path="*" element={<Navigate to={pokemonRoute()} replace />} />

                          {/* Item/Objeto */}
                          <Route path={itemRoute()} element={<VistaItem />} />
                          <Route path={itemRoute(":nombreItem")} element={<VistaItem />} />

                          {/* Habilidad */}
                          <Route path={abilityRoute()} element={<VistaHabilidad />} />
                          <Route path={abilityRoute(":nombreHabilidad")} element={<VistaHabilidad />} />

                          {/* Movimiento */}
                          <Route path={moveRoute()} element={<VistaMovimiento />} />
                          <Route path={moveRoute(":nombreMovimiento")} element={<VistaMovimiento />} />

                          {/* Pokémon */}
                          <Route path={pokemonRoute()} element={<VistaPokemon />} />
                          <Route path={pokemonRoute(":nombre")} element={<VistaPokemon />} />

                          {/* Pokedex */}
                          <Route path={pokedexRoute()} element={<Navigate to={pokedexRoute(DEFAULT_POKEDEX_PATH)} replace />} />
                          <Route path={pokedexRoute(":gameSlug?")} element={<VistaPokedex />} />

                          {/* Calculadora de Debilidades */}
                          <Route path={ROUTES.DYR_CALCULATOR} element={<CalculadoraDebilidades />} />

                          {/* Calculadora de Caracteristicas */}
                          <Route path={ROUTES.STATS_PKM_CALCULATOR} element={<VistaCalculadoraCaracteristicas />} />

                          {/* Buscador Avanzado */}
                          <Route path={ROUTES.ADVANCED_SEARCH} element={<Navigate to={getInitialAdvancedSearchRoute()} replace />} />
                          <Route path={advancedPokemonSearchRoute()} element={<VistaBuscadorAvanzado />} />
                          <Route path={advancedMovesSearchRoute()} element={<VistaBuscadorAvanzado />} />
                          <Route path={advancedAbilitiesSearchRoute()} element={<VistaBuscadorAvanzado />} />
                          <Route path={advancedItemsSearchRoute()} element={<VistaBuscadorAvanzado />} />

                        </Routes>

                      </div>

                      {/* Pie de Pagina */}
                      <Footer />

                      {/* Volver arriba */}
                      <ScrollToTopButton />

                    </FiltroPkmProvider>
                  </ItemsProvider>
                </MovesProvider>
              </AbilitiesProvider>
            </AreaLocalizacionProvider>
          </PokemonProvider>
        </PokedexProvider>
      </ToastrProvider>

    </div>
  );

}