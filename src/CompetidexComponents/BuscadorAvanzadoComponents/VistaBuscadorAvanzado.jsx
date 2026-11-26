//** src\CompetidexComponents\BuscadorAvanzadoComponents\VistaBuscadorAvanzado.js

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePokemon } from "../PokemonComponents/PokemonProvider";
import { useMoves } from "../MovimientosComponents/MovesProvider";
import { useAbilities } from "../HabilidadesComponents/AbilitiesProvider";
import { useItems } from "../ItemsComponents/ItemsProvider";
import ListaPkmPaginada from "./BuscadorAvanzadoPkmComponents/ListaPkmPaginada/ListaPkmPaginada";
import ListaMovsPaginada from "./BuscadorAvanzadoMovsComponents/ListaMovsPaginada/ListaMovsPaginada";
import ListaHabsPaginada from "./BuscadorAvanzadoHabsComponents/ListaHabsPaginada/ListaHabsPaginada";
import ListaItemsPaginada from "./BuscadorAvanzadoItemsComponents/ListaItemsPaginada/ListaItemsPaginada";
import {
    advancedSearchRouteByTab,
    advancedPokemonSearchRoute,
    getAdvancedSearchTabByPath,
    getAdvancedSearchTabs
} from "../../utils/competidexRoutes";
import { ADVANCED_SEARCH_SESSION_STORAGE_KEY } from "../../utils/competidexMeta";
import "./VistaBuscadorAvanzado.css";

function readAdvancedSearchSessionState()
{
    if(typeof window === "undefined" || !window.sessionStorage)
    {
        return {};
    }

    try
    {
        const rawValue = window.sessionStorage.getItem(ADVANCED_SEARCH_SESSION_STORAGE_KEY);
        const parsedValue = rawValue ? JSON.parse(rawValue) : {};

        return parsedValue && typeof parsedValue === "object" ? parsedValue : {};

    }catch(e)
    {
        return {};
    }
}

function writeAdvancedSearchSessionState(nextState)
{
    if(typeof window === "undefined" || !window.sessionStorage)
    {
        return;
    }

    try
    {
        window.sessionStorage.setItem(ADVANCED_SEARCH_SESSION_STORAGE_KEY, JSON.stringify(nextState || {}));
    
    }catch(e){}
}

function getStoredAdvancedSearchUrlForTab(state, tabKey)
{
    const storedUrl = String(state?.[tabKey] || "");
    const expectedPath = advancedSearchRouteByTab(tabKey);

    return storedUrl.startsWith(expectedPath) ? storedUrl : "";
}

export default function VistaBuscadorAvanzado()
{
    const location = useLocation();
    const navigate = useNavigate();
    const initialRestoreCheckedRef = useRef(false);
    const skipPersistOnceRef = useRef(false);
    const [advancedSearchByTab, setAdvancedSearchByTab] = useState(readAdvancedSearchSessionState);

    // Pokemon
    const {
        pokemonMap,
        loadingIndex,
        pokemonMapReady
    } = usePokemon();

    // Movimientos
    const {
        advancedMovesItems = [],
        loadingIndex: loadingMovesIndex,
        esMapReady
    } = useMoves();

    // Habilidades
    const {
        advancedAbilitiesItems = [],
        loadingIndex: loadingAbilitiesIndex,
        esMapReadyAbilities
    } = useAbilities();

    // Objetos
    const {
        advancedItemsItems = [],
        loadingIndex: loadingItemsIndex,
        itemMapReady
    } = useItems();

    const activeTabData = useMemo(function()
    {
        return getAdvancedSearchTabByPath(location.pathname) || getAdvancedSearchTabs()[0];

    }, [location.pathname]);

    const activeTab = activeTabData?.key || "pokemon";

    useEffect(function()
    {
        const currentPath = String(location.pathname || "");
        const hasAdvancedTabPath = !!getAdvancedSearchTabByPath(currentPath);

        if(hasAdvancedTabPath) return;

        const storedPokemonUrl = getStoredAdvancedSearchUrlForTab(advancedSearchByTab, "pokemon");
        const fallbackPokemonUrl = advancedPokemonSearchRoute() + String(location.search || "");
        const nextUrl = String(location.search || "") ? fallbackPokemonUrl : (storedPokemonUrl || fallbackPokemonUrl);

        navigate(nextUrl, { replace: true });

    }, [advancedSearchByTab, location.pathname, location.search, navigate]);

    useLayoutEffect(function()
    {
        const hasAdvancedTabPath = !!getAdvancedSearchTabByPath(location.pathname);
        if(!hasAdvancedTabPath) return;

        if(initialRestoreCheckedRef.current) return;

        initialRestoreCheckedRef.current = true;

        if(!String(location.search || ""))
        {
            const storedUrl = getStoredAdvancedSearchUrlForTab(advancedSearchByTab, activeTab);

            if(storedUrl)
            {
                skipPersistOnceRef.current = true;
                navigate(storedUrl, { replace: true });
            }
        }

    }, [activeTab, advancedSearchByTab, location.pathname, location.search, navigate]);

    useEffect(function()
    {
        const hasAdvancedTabPath = !!getAdvancedSearchTabByPath(location.pathname);
        if(!hasAdvancedTabPath) return;
        if(!initialRestoreCheckedRef.current) return;

        if(skipPersistOnceRef.current)
        {
            skipPersistOnceRef.current = false;
            return;
        }

        setAdvancedSearchByTab(function(prev)
        {
            const currentUrl = String(location.pathname || "") + String(location.search || "");

            if(prev[activeTab] === currentUrl) return prev;

            const nextState = {
                ...prev,
                [activeTab]: currentUrl
            };

            writeAdvancedSearchSessionState(nextState);

            return nextState;
        });

    }, [activeTab, location.pathname, location.search]);

    // Tabs
    const tabs = useMemo(function()
    {
        return getAdvancedSearchTabs();

    }, []);

    // Cada que entra al componente la vista se mueve arriba del todo
    useEffect(function()
    {
        if(typeof window === "undefined") return;

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        if(document.documentElement)
        {
            document.documentElement.scrollTop = 0;
        }

        if(document.body)
        {
            document.body.scrollTop = 0;
        }

    }, []);

    // Arreglo de tarjetas Pokemon
    const pokemonCards = useMemo(function()
    {
        const map = pokemonMap && typeof pokemonMap === "object" ? pokemonMap : {};
        const keys = Object.keys(map);

        keys.sort(function(a, b)
        {
            return a.localeCompare(b);

        });

        return keys.map(function(apiName)
        {
            const entry = map[apiName] || {};

            return {
                apiName: apiName,
                ...entry
            };

        });

    }, [pokemonMap]);

    // Arreglo de tarjetas de Movimientos
    const moveCards = useMemo(function()
    {
        const items = Array.isArray(advancedMovesItems) ? advancedMovesItems : [];

        return items.map(function(move)
        {
            return {
                ...move
            };

        });

    }, [advancedMovesItems]);

    // Arreglo de tarjetas de Habilidades
    const abilityCards = useMemo(function()
    {
        const items = Array.isArray(advancedAbilitiesItems) ? advancedAbilitiesItems : [];

        return items.map(function(ability)
        {
            return {
                ...ability
            };

        });

    }, [advancedAbilitiesItems]);

    // Arreglo de tarjetas de Objetos
    const itemCards = useMemo(function()
    {
        const items = Array.isArray(advancedItemsItems) ? advancedItemsItems : [];

        return items.map(function(item)
        {
            return {
                ...item
            };

        });

    }, [advancedItemsItems]);

    const renderActiveTabContent = () =>
    {
        switch(activeTab)
        {
            case "objetos":
                return (
                    <div className="vistaBuscadorAvanzadoPkm-data">
                        <ListaItemsPaginada
                            items={itemCards}
                            loading={!itemMapReady || loadingItemsIndex}
                            emptyText="No se encontraron Objetos para mostrar."
                        />
                    </div>
                );

            case "habilidades":
                return (
                    <div className="vistaBuscadorAvanzadoPkm-data">
                        <ListaHabsPaginada
                            items={abilityCards}
                            loading={!esMapReadyAbilities || loadingAbilitiesIndex}
                            emptyText="No se encontraron Habilidades para mostrar."
                        />
                    </div>
                );

            case "movimientos":
                return (
                    <div className="vistaBuscadorAvanzadoPkm-data">       
                        <ListaMovsPaginada
                            items={moveCards}
                            loading={!esMapReady || loadingMovesIndex}
                            emptyText="No se encontraron Movimientos para mostrar."
                        />     
                    </div>
                );

            case "pokemon":
            default:
                return (
                    <div className="vistaBuscadorAvanzadoPkm-data">
                        <ListaPkmPaginada
                            items={pokemonCards}
                            loading={!pokemonMapReady || loadingIndex}
                            emptyText="No se encontraron Pokémon para mostrar."
                        />
                    </div>
                );
        }
    };

    return (
        <div className="vistaBuscadorAvanzadoPkm-page">
            <div className="vistaBuscadorAvanzadoPkm-container">

                {/* Titulo */}
                <div className="vistaBuscadorAvanzadoPkm-titulo-wrapper">
                    <h1 className="vistaBuscadorAvanzadoPkm-title">
                        Buscador Avanzado
                    </h1>
                </div>

                {/* Data Paginada */}      
                <div className="vistaBuscadorAvanzadoPkm-tabs-wrapper">

                    {/* Tabs para elegir Buscador */}
                    <div className="vistaBuscadorAvanzadoPkm-tabs">
                        {tabs.map(function(tab)
                        {
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className={"vistaBuscadorAvanzadoPkm-tab" + (activeTab === tab.key ? " active" : "")}
                                    title={`Ver ${tab.label}`}
                                    onClick=
                                    {function()
                                    {
                                        const nextPath = advancedSearchRouteByTab(tab.key);
                                        const storedUrl = getStoredAdvancedSearchUrlForTab(advancedSearchByTab, tab.key);
                                        const nextUrl = storedUrl || nextPath;

                                        navigate(nextUrl, { replace: false });
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Contenido del Tab Activo */}
                    {renderActiveTabContent()}

                </div>

            </div>
        </div>
    );

}