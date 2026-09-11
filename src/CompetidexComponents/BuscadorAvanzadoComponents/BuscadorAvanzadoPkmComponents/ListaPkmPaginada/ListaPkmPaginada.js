//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoPkmComponents\ListaPkmPaginada\ListaPkmPaginada.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowDownSFill } from "react-icons/ri";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { isPokemonBlockedFiltroAvanzadoPkm, ERROR_404_SPRITE_IMG, formatNumberWithDots } from "../../../../utils/competidexMeta";
import { useFiltroPkm } from "../../FiltroPkmProvider";
import {
  ADVANCED_PKM_DEFAULT_SORT_DIRECTION,
  ADVANCED_PKM_DEFAULT_SORT_FIELD,
  applyAdvancedPkmSearchState,
  parseAdvancedPkmSearchParams
} from "../competidexAdvancedPkmFilters";
import { hasCachedImage, preloadCachedImage } from "../../../../utils/competidexImgCache";
import { advancedPokemonSearchRoute, advancedPokemonSearchRouteWithFilters } from "../../../../utils/competidexRoutes";
import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import FiltroAvanzadoPkm from "../FiltroAvanzadoPkm/FiltroAvanzadoPkm";
import TarjetaPkmAvanzado from "./TarjetaPkmAvanzado/TarjetaPkmAvanzado";
import "./ListaPkmPaginada.css";

function comparePokemonForGrid(a, b)
{
  const idA = Number(a?.id);
  const idB = Number(b?.id);

  if(Number.isFinite(idA) && Number.isFinite(idB) && idA !== idB)
  {
    return idA - idB;
  }

  if(Number.isFinite(idA) && !Number.isFinite(idB)) return -1;
  if(!Number.isFinite(idA) && Number.isFinite(idB)) return 1;

  const nameA = String(a?.displayES || a?.display || a?.apiName || "").toLowerCase();
  const nameB = String(b?.displayES || b?.display || b?.apiName || "").toLowerCase();

  return nameA.localeCompare(nameB);
}

export default function ListaPkmPaginada({
  items = [],
  loading = false,
  emptyText = "No se encontraron Pokémon para mostrar."
})
{
  const { filtersSchema = [], ready: filtersReady } = useFiltroPkm();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("1");
  const [currentPageSize, setCurrentPageSize] = useState(25);
  const [openPageSize, setOpenPageSize] = useState(false);
  const [advancedFilteredItems, setAdvancedFilteredItems] = useState(null);
  const pageSizeDropdownRef = useRef(null);

  useEffect(function()
  {
    if(!hasCachedImage(ERROR_404_SPRITE_IMG))
    {
      preloadCachedImage(ERROR_404_SPRITE_IMG);
    }

  }, []);

  const visibleItems = useMemo(function()
  {
    return (Array.isArray(items) ? items.slice() : [])
      .filter(function(pokemon)
      {
        const key = String(pokemon?.apiName || pokemon?.key || pokemon?.displayES || pokemon?.display || "").trim().toLowerCase();
        if(!key) return false;

        return !isPokemonBlockedFiltroAvanzadoPkm(key);
      })
      .sort(comparePokemonForGrid);

  }, [items]);

  const baseVisibleItems = useMemo(function()
  {
    return visibleItems;

  }, [visibleItems]);

  const urlSearchState = useMemo(function()
  {
    if(!filtersReady)
    {
      return {
        filters: [],
        sort: {
          field: ADVANCED_PKM_DEFAULT_SORT_FIELD,
          direction: ADVANCED_PKM_DEFAULT_SORT_DIRECTION
        }
      };
    }

    return parseAdvancedPkmSearchParams(searchParams, filtersSchema);

  }, [filtersReady, filtersSchema, searchParams]);

  const hasUrlAdvancedState = useMemo(function()
  {
    return searchParams.has("filters") || searchParams.has("sort");

  }, [searchParams]);

  useEffect(function()
  {
    if(!filtersReady) return;

    if(urlSearchState.hasInvalidFilters)
    {
      const nextSearchParams = new URLSearchParams();
      nextSearchParams.set("sort", `${ADVANCED_PKM_DEFAULT_SORT_FIELD}:${ADVANCED_PKM_DEFAULT_SORT_DIRECTION}`);

      setSearchParams(nextSearchParams, { replace: true });
      return;
    }

    if(searchParams.has("sort")) return;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", `${ADVANCED_PKM_DEFAULT_SORT_FIELD}:${ADVANCED_PKM_DEFAULT_SORT_DIRECTION}`);

    setSearchParams(nextSearchParams, { replace: true });

  }, [filtersReady, searchParams, setSearchParams, urlSearchState.hasInvalidFilters]);

  const displayedItems = useMemo(function()
  {
    if(hasUrlAdvancedState && filtersReady)
    {
      return applyAdvancedPkmSearchState(baseVisibleItems, urlSearchState.filters, urlSearchState.sort, filtersSchema);
    }

    if(advancedFilteredItems === null)
    {
      return baseVisibleItems;
    }

    return Array.isArray(advancedFilteredItems) ? advancedFilteredItems : [];

  }, [baseVisibleItems, advancedFilteredItems, filtersReady, filtersSchema, hasUrlAdvancedState, urlSearchState]);

  const totalPages = Math.max(1, Math.ceil(displayedItems.length / Math.max(1, currentPageSize)));

  useEffect(function()
  {
    setPage(function(prev)
    {
      return Math.min(Math.max(1, prev), totalPages);
    });

  }, [totalPages]);

  useEffect(function()
  {
    if(!hasUrlAdvancedState)
    {
      setAdvancedFilteredItems(null);
    }

    setPage(1);
    setJumpPageInput("1");

  }, [items, hasUrlAdvancedState]);

  useEffect(function()
  {
    setAdvancedFilteredItems(null);
    setPage(1);
    setJumpPageInput("1");

  }, [searchParams]);

  useEffect(function()
  {
    setJumpPageInput(String(page));

  }, [page, totalPages]);

  function scrollToTop()
  {
    if(typeof window === "undefined") return;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  useEffect(function()
  {
    function handlePointerDown(event)
    {
      if(!pageSizeDropdownRef.current) return;
      if(pageSizeDropdownRef.current.contains(event.target)) return;
      setOpenPageSize(false);
    }

    function handleKeyDown(event)
    {
      if(event.key === "Escape")
      {
        setOpenPageSize(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return function()
    {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, []);

  const pageItems = useMemo(function()
  {
    const size = Math.max(1, currentPageSize);
    const start = (page - 1) * size;
    return displayedItems.slice(start, start + size);

  }, [displayedItems, page, currentPageSize]);

  function goToPage(nextPage)
  {
    setPage(function(prev)
    {
      const raw = Number(nextPage);
      if(!Number.isFinite(raw)) return prev;

      return Math.min(totalPages, Math.max(1, raw));
    });

    scrollToTop();
  }

  function handleJumpInputChange(event)
  {
    const raw = String(event?.target?.value || "");
    if(raw === "")
    {
      setJumpPageInput("");
      return;
    }

    const digits = raw.replace(/[^\d]/g, "");
    if(!digits)
    {
      setJumpPageInput("");
      return;
    }

    const numeric = Number(digits);
    const clamped = Math.min(totalPages, Math.max(1, numeric));
    setJumpPageInput(String(clamped));
  }

  function handleJumpConfirm()
  {
    goToPage(jumpPageInput);
  }

  function handleJumpKeyDown(event)
  {
    if(event.key === "Enter")
    {
      event.preventDefault();
      handleJumpConfirm();
    }
  }

  function setPageSizeValue(nextSize)
  {
    const nextSizeNumber = Number(nextSize || 25);
    if(![25, 50, 100].includes(nextSizeNumber)) return;

    setCurrentPageSize(nextSizeNumber);
    setPage(1);
    setJumpPageInput("1");
    setOpenPageSize(false);
    scrollToTop();
  }

  if(loading)
  {
    return (
      <LoadingPkm />
    );
  }

  return (
    <section id="contenedorFiltroPkmAvanzado" className="listaPokemonPaginada">
      
      {/* Acciones: Cantidad por pagina + Total filtrado + Filtro */}
      <div className="listaPokemonPaginada-toolbar">
        
        {/* Bloque Izquierdo */}
        <div className="listaPokemonPaginada-toolbarInner">

          {/* Paginacion */}
          <div className="listaPokemonPaginada-footer listaPokemonPaginada-footer-arriba">
            
            {/* Boton Anterior */}
            <button
              type="button"
              className="listaPokemonPaginada-btn listaPokemonPaginada-btnIcon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Anterior"
              title="Anterior"
            >
              <MdOutlineNavigateBefore aria-hidden="true" className="listaPokemonPaginada-icon" />
            </button>

            {/* Texto */}
            <div className="listaPokemonPaginada-pageInfo">
              <span className="listaPokemonPaginada-pageInfoLabel">Página</span>
              <span className="listaPokemonPaginada-pageCountNumber">{formatNumberWithDots(page)}</span>
              <span className="listaPokemonPaginada-pageInfoLabel">de</span>
              <span className="listaPokemonPaginada-pageCountNumber">{formatNumberWithDots(totalPages)}</span>
            </div>

            {/* Boton Siguiente */}
            <button
              type="button"
              className="listaPokemonPaginada-btn listaPokemonPaginada-btnIcon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Siguiente"
              title="Siguiente"
            >
              <MdOutlineNavigateNext aria-hidden="true" className="listaPokemonPaginada-icon" />
            </button>

          </div>

          {/* Salto directo */}
          <div className="listaPokemonPaginada-jumpRow listaPokemonPaginada-jumpRow-arriba">
              
            {/* Texto */}
            <span className="listaPokemonPaginada-jumpLabel">Ir a página</span>

            {/* Input Numerico de Nro de Pagina */}
            <input
              type="search"
              max={totalPages}
              min="1"
              step={1}
              inputMode="numeric"
              pattern="[0-9]*"
              enterKeyHint="done"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="listaPokemonPaginada-numberInput listaPokemonPaginada-jumpInput"
              value={jumpPageInput}
              onChange={handleJumpInputChange}
              onKeyDown={handleJumpKeyDown}
              aria-label={`Ir a una página entre 1 y ${totalPages}`}
              title={`Ir a una página entre 1 y ${totalPages}`}
            />

            {/* Boton Ir a Pagina ingresada */}
            <button
              type="button"
              className="listaPokemonPaginada-btn listaPokemonPaginada-jumpBtn"
              onClick={handleJumpConfirm}
              disabled={!jumpPageInput || Number(jumpPageInput) < 1 || Number(jumpPageInput) > totalPages}
              aria-label="Confirmar salto de página"
              title="Confirmar salto de página"
            >
              Ir
            </button>

          </div>

          {/* Cambiar la cant por pagina */}
          <div className="listaPokemonPaginada-pageSizeSelectWrap" ref={pageSizeDropdownRef}>
            
            {/* Texto 1 */}
            <span className="listaPokemonPaginada-pageSizeLabel">Mostrar</span>

            {/* Desplegable de Opciones de Paginacion */}
            <div className="listaPokemonPaginada-pageSizePickWrap">
              
              {/* Paginacion Actual */}
              <button
                type="button"
                className={"listaPokemonPaginada-pageSizePick" + (openPageSize ? " isOpen" : "")}
                onClick={() => setOpenPageSize(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openPageSize}
                aria-label="Cantidad de Pokémon por página"
                title="Cantidad de Pokémon por página"
              >
                <span className="listaPokemonPaginada-pageSizePickText">{currentPageSize}</span>
                <span className={"listaPokemonPaginada-pageSizePickCaret" + (openPageSize ? " isOpen" : "")} aria-hidden="true">
                  <RiArrowDownSFill />
                </span>
              </button>

              {/* Opciones */}
              {openPageSize && (
                <div className="listaPokemonPaginada-pageSizeList" role="listbox" aria-label="Cantidad de Pokémon por página">
                  {[25, 50, 100].map(function(size)
                  {
                    const selected = size === currentPageSize;

                    return (
                      <button
                        key={size}
                        type="button"
                        className={"listaPokemonPaginada-pageSizeOption" + (selected ? " selected" : "")}
                        onClick={() => setPageSizeValue(size)}
                        role="option"
                        aria-selected={selected}
                        data-selected={selected ? "1" : "0"}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Texto 2 */}
            <span className="listaPokemonPaginada-pageSizeLabel">Pokémon por página</span>

          </div>

          {/* Total de Pokemon mostrados */}
          <div className="listaPokemonPaginada-count">
            <span className="listaPokemonPaginada-pageCountNumber">
              {formatNumberWithDots(displayedItems.length)}
            </span>{" "}
            Pokémon {displayedItems.length === 1 ? "encontrado" : "encontrados"}
          </div>

        </div>

        {/* Bloque Derecho */}
        <div className="listaPokemonPaginada-toolbarActions">
          <FiltroAvanzadoPkm
            items={baseVisibleItems}
            totalItems={displayedItems.length}
            initialFilters={urlSearchState.filters}
            initialSort={urlSearchState.sort}
            onApplyFilters={function(payload)
            {
              const nextFilters = Array.isArray(payload?.filters) ? payload.filters : [];
              const nextSort = payload?.sort || {
                field: ADVANCED_PKM_DEFAULT_SORT_FIELD,
                direction: ADVANCED_PKM_DEFAULT_SORT_DIRECTION
              };

              navigate(advancedPokemonSearchRouteWithFilters({
                filters: nextFilters,
                sort: nextSort
              }), { replace: false });

              setAdvancedFilteredItems(Array.isArray(payload?.items) ? payload.items : []);
              setPage(1);
              setJumpPageInput("1");
              scrollToTop();
            }}
            onClearFilters={function()
            {
              navigate(advancedPokemonSearchRoute(), { replace: false });
              setAdvancedFilteredItems(null);
              setPage(1);
              setJumpPageInput("1");
              scrollToTop();
            }}
          />
        </div>

      </div>

      {/* Lista de Tarjetas Pokemon */}
      <div className="listaPokemonPaginada-mainContent">
        <div className="listaPokemonPaginada-gridWrap">
          <div className="listaPokemonPaginada-grid">

            {/* Tarjetas Pokemon */}
            {pageItems.length > 0 ? pageItems.map(function(pokemon)
            {
              const key = String(pokemon?.apiName || pokemon?.displayES || pokemon?.display || pokemon?.id || "pokemon");

              return (
                <TarjetaPkmAvanzado
                  key={key}
                  pokemon={pokemon}
                />
              );

            }) : (
              <>
                {/* Ningun Pokemon encontrado */}
                <div className="listaPokemonPaginada-emptyState">
              
                  <img
                    className="listaPokemonPaginada-emptyStateSprite"
                    src={ERROR_404_SPRITE_IMG}
                    alt="No se encontraron Pokémon para mostrar"
                  />

                  <div className="listaPokemonPaginada-emptyStateText-NOTFOUND">
                    NOT FOUND
                  </div>

                  <br></br>

                  <div className="listaPokemonPaginada-emptyStateText">
                    {emptyText}
                  </div>

                </div>
              </>
            )}
            
          </div>
        </div>
      </div>

      {/* Paginacion y Salto de Pagina */}
      <div className="listaPokemonPaginada-paginationDock">
        <div className="listaPokemonPaginada-paginationBlock">
        
          {/* Paginacion */}
          <div className="listaPokemonPaginada-footer">
            
            {/* Boton Anterior */}
            <button
              type="button"
              className="listaPokemonPaginada-btn listaPokemonPaginada-btnIcon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Anterior"
              title="Anterior"
            >
              <MdOutlineNavigateBefore aria-hidden="true" className="listaPokemonPaginada-icon" />
            </button>

            {/* Texto */}
            <div className="listaPokemonPaginada-pageInfo">
              <span className="listaPokemonPaginada-pageInfoLabel">Página</span>
              <span className="listaPokemonPaginada-pageCountNumber">{formatNumberWithDots(page)}</span>
              <span className="listaPokemonPaginada-pageInfoLabel">de</span>
              <span className="listaPokemonPaginada-pageCountNumber">{formatNumberWithDots(totalPages)}</span>
            </div>

            {/* Boton Siguiente */}
            <button
              type="button"
              className="listaPokemonPaginada-btn listaPokemonPaginada-btnIcon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Siguiente"
              title="Siguiente"
            >
              <MdOutlineNavigateNext aria-hidden="true" className="listaPokemonPaginada-icon" />
            </button>

          </div>

          {/* Salto directo */}
          <div className="listaPokemonPaginada-jumpRow">
            
            {/* Texto */}
            <span className="listaPokemonPaginada-jumpLabel">Ir a página</span>

            {/* Input Numerico de Nro de Pagina */}
            <input
              type="search"
              max={totalPages}
              min="1"
              step={1}
              inputMode="numeric"
              pattern="[0-9]*"
              enterKeyHint="done"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className="listaPokemonPaginada-numberInput listaPokemonPaginada-jumpInput"
              value={jumpPageInput}
              onChange={handleJumpInputChange}
              onKeyDown={handleJumpKeyDown}
              aria-label={`Ir a una página entre 1 y ${totalPages}`}
              title={`Ir a una página entre 1 y ${totalPages}`}
            />

            {/* Boton Ir a Pagina ingresada */}
            <button
              type="button"
              className="listaPokemonPaginada-btn listaPokemonPaginada-jumpBtn"
              onClick={handleJumpConfirm}
              disabled={!jumpPageInput || Number(jumpPageInput) < 1 || Number(jumpPageInput) > totalPages}
              aria-label="Confirmar salto de página"
              title="Confirmar salto de página"
            >
              Ir
            </button>
            
          </div>

        </div>
      </div>

    </section>
  );

}