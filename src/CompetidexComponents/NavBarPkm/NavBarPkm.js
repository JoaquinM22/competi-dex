//** src\CompetidexComponents\NavBarPkm\NavBarPkm.js

import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  ROUTES,
  pokemonRoute,
  itemRoute,
  abilityRoute,
  moveRoute
} from "../../utils/competidexRoutes";
import { useItems } from "../ItemsComponents/ItemsProvider";
import { useAbilities } from "../HabilidadesComponents/AbilitiesProvider";
import { useMoves } from "../MovimientosComponents/MovesProvider";
import { usePokemon } from "../PokemonComponents/PokemonProvider";
import { CACHE_VERSION as ITEMS_CACHE_VERSION } from "../ItemsComponents/itemCache";
import { CACHE_VERSION as ABILITIES_CACHE_VERSION } from "../HabilidadesComponents/abilityCache";
import { CACHE_VERSION as MOVES_CACHE_VERSION } from "../MovimientosComponents/moveCache";
import { CACHE_VERSION as POKEMON_CACHE_VERSION } from "../PokemonComponents/pokemonCache";
import Titulo from "../Titulo/Titulo";
import Configuracion from "../ConfiguracionComponents/Configuracion";
import PokedexSelector from "../PokedexComponents/PokedexSelector/PokedexSelector";
import "./NavBarPkm.css";

export default function NavBarPkm()
{
    // Fuerza re-render del navbar cuando cambia la ruta
    const location = useLocation();
    const pathname = String(location.pathname || "");
    const [mobileOpen, setMobileOpen] = useState(false);


    useEffect(() =>
    {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() =>
    {
        const prevOverflow = document.body.style.overflow;
        if(mobileOpen)
        {
            document.body.style.overflow = "hidden";
        }

        return () =>
        {
            document.body.style.overflow = prevOverflow;
        };
    }, [mobileOpen]);

    useEffect(() =>
    {
        function onResize()
        {
            if(window.innerWidth > 1180)
            {
                setMobileOpen(false);
            }
        }

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);


    const { getItemSlug } = useItems();
    const { getAbilitySlug } = useAbilities();
    const { getMoveSlug } = useMoves();
    const { getPokemonSlug } = usePokemon();


    // ------------- ITEMS/OBJETOS - INICIO ------------- 
    let lastItemSlug = "";
    let lastItemKey = "";
    try { lastItemSlug = (sessionStorage.getItem(`items:lastSlug:${ITEMS_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}
    try { lastItemKey = (sessionStorage.getItem(`items:lastKey:${ITEMS_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}

    const safeItemSlug = lastItemKey
        ? (getItemSlug(lastItemKey) || lastItemSlug || lastItemKey)
        : lastItemSlug;

    const toItem = safeItemSlug
        ? itemRoute(encodeURIComponent(safeItemSlug))
        : itemRoute();
    // ------------- ITEMS/OBJETOS - FIN ------------- 


    // ------------- HABILIDADES - INICIO ------------- 
    let lastHabSlug = "";
    let lastHabKey = "";
    try { lastHabSlug = (sessionStorage.getItem(`abilities:lastSlug:${ABILITIES_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}
    try { lastHabKey = (sessionStorage.getItem(`abilities:lastKey:${ABILITIES_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}

    const safeHabSlug = lastHabKey
        ? (getAbilitySlug(lastHabKey) || lastHabSlug || lastHabKey)
        : lastHabSlug;

    const toHab = safeHabSlug
        ? abilityRoute(encodeURIComponent(safeHabSlug))
        : abilityRoute();
    // ------------- HABILIDADES - FIN ------------- 


    // ------------- MOVIMIENTOS - INICIO ------------- 
    let lastMovSlug = "";
    let lastMovKey = "";
    try { lastMovSlug = (sessionStorage.getItem(`moves:lastSlug:${MOVES_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}
    try { lastMovKey = (sessionStorage.getItem(`moves:lastKey:${MOVES_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}

    const safeMovSlug = lastMovKey
        ? (getMoveSlug(lastMovKey) || lastMovSlug || lastMovKey)
        : lastMovSlug;

    const toMov = safeMovSlug
        ? moveRoute(encodeURIComponent(safeMovSlug))
        : moveRoute();
    // ------------- MOVIMIENTOS - FIN ------------- 


    // ------------- POKÉMON - INICIO ------------- 
    let lastPokeSlug = "";
    let lastPokeKey = "";
    try { lastPokeSlug = (sessionStorage.getItem(`pokemon:lastSlug:${POKEMON_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}
    try { lastPokeKey = (sessionStorage.getItem(`pokemon:lastKey:${POKEMON_CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}

    const safePokeSlug = lastPokeKey
        ? (getPokemonSlug(lastPokeKey) || lastPokeSlug || lastPokeKey)
        : lastPokeSlug;

    const toPokemon = safePokeSlug
        ? pokemonRoute(encodeURIComponent(safePokeSlug))
        : pokemonRoute();
    // ------------- POKÉMON - FIN ------------- 


    // Agrega estilo focus dependiendo en que Componente estoy parado
    const isItemSection = (pathname === `/${ROUTES.ITEM}`) || (pathname.startsWith(`/${ROUTES.ITEM}/`));
    const isAbilitySection = (pathname === `/${ROUTES.ABILITY}`) || (pathname.startsWith(`/${ROUTES.ABILITY}/`));
    const isMoveSection = (pathname === `/${ROUTES.MOVE}`) || (pathname.startsWith(`/${ROUTES.MOVE}/`));
    const isPokemonSection = (pathname === `/${ROUTES.POKEMON}`) || (pathname.startsWith(`/${ROUTES.POKEMON}/`));
    const isPokedexSection = (pathname === `/${ROUTES.POKEDEX}`) || (pathname.startsWith(`/${ROUTES.POKEDEX}/`));
    const isCalculatorSection = (pathname === `/${ROUTES.DYR_CALCULATOR}`);

    const closeMobileMenu = () => setMobileOpen(false);

    return (
        <div className="navBarRoot">

            {/* Parte Superior: Menu - Titulo - Configuracion */}
            <div className="navBarTop">
                <div className="navBarTopLeft">
                    <button
                        type="button"
                        title="Abrir menú"
                        className="navMobileToggle navMobileToggleInline"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Abrir menú"
                        aria-expanded={mobileOpen}
                    >
                        <FiMenu className="navMobileToggleIcon" />
                    </button>
                </div>

                <div className="navBarTopBrand">
                    <Titulo />
                </div>

                <div className="navBarTopRight">
                    <Configuracion />
                </div>
            </div>

            <div
                className={"navMobileOverlay" + (mobileOpen ? " open" : "")}
                onClick={closeMobileMenu}
                aria-hidden="true"
            />

            {/* Barra de Navegacon lateral para Pantallas Angostas */}
            <aside className={"navMobileDrawer" + (mobileOpen ? " open" : "")} aria-label="Navegación principal">
                
                {/* Boton Cerrar Menu Lateral */}
                <div className="navMobileDrawerHeader">
                    <span className="navMobileDrawerTitle">Menú</span>
                    <button
                        type="button"
                        title="Cerrar menú"
                        className="navMobileClose"
                        onClick={closeMobileMenu}
                        aria-label="Cerrar menú"
                    >
                        <FiX className="navMobileToggleIcon" />
                    </button>
                </div>

                {/* Botones Vista Componentes (En Pantallas Angostas)  */}
                <div className="navMobileLinks">
                    
                    <NavLink
                        to={toItem}
                        end={false}
                        className={"navBtn" + (isItemSection ? " active" : "")}
                        onClick={closeMobileMenu}
                    >
                        Objetos
                    </NavLink>

                    <NavLink
                        to={toHab}
                        end={false}
                        className={"navBtn" + (isAbilitySection ? " active" : "")}
                        onClick={closeMobileMenu}
                    >
                        Habilidades
                    </NavLink>

                    <NavLink
                        to={toMov}
                        end={false}
                        className={"navBtn" + (isMoveSection ? " active" : "")}
                        onClick={closeMobileMenu}
                    >
                        Movimientos
                    </NavLink>

                    <NavLink
                        to={toPokemon}
                        className={"navBtn" + (isPokemonSection ? " active" : "")}
                        onClick={closeMobileMenu}
                    >
                        Pokémon
                    </NavLink>

                    <PokedexSelector
                        className={"navBtn" + (isPokedexSection ? " active" : "")}
                        mobileFlyout={true}
                    />

                    <NavLink
                        to={ROUTES.DYR_CALCULATOR}
                        className={"navBtn ultimoNavBtn" + (isCalculatorSection ? " active" : "")}
                        onClick={closeMobileMenu}
                    >
                        Calculadora de Debilidades y Resistencias
                    </NavLink>
                    
                </div>

            </aside>

            {/* Bootones Vista Componentes (En Pantallas grandes) */}
            <div className="navBarDesktop">
                
                <NavLink
                    to={toItem}
                    end={false}
                    className={"navBtn" + (isItemSection ? " active" : "")}
                >
                    Objetos
                </NavLink>

                <NavLink
                    to={toHab}
                    end={false}
                    className={"navBtn" + (isAbilitySection ? " active" : "")}
                >
                    Habilidades
                </NavLink>

                <NavLink
                    to={toMov}
                    end={false}
                    className={"navBtn" + (isMoveSection ? " active" : "")}
                >
                    Movimientos
                </NavLink>

                <NavLink
                    to={toPokemon}
                    className={"navBtn" + (isPokemonSection ? " active" : "")}
                >
                    Pokémon
                </NavLink>

                <PokedexSelector className={"navBtn" + (isPokedexSection ? " active" : "")} />

                <NavLink
                    to={ROUTES.DYR_CALCULATOR}
                    className={"navBtn ultimoNavBtn" + (isCalculatorSection ? " active" : "")}
                >
                    Calculadora de Debilidades y Resistencias
                </NavLink>

            </div>

        </div>
    );

}