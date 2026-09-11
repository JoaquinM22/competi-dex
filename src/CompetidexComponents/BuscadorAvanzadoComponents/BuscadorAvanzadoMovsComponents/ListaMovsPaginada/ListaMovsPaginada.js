//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoMovsComponents\ListaMovsPaginada\ListaMovsPaginada.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowDownSFill } from "react-icons/ri";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { ERROR_404_SPRITE_IMG, formatNumberWithDots } from "../../../../utils/competidexMeta";
import { useFiltroPkm } from "../../FiltroPkmProvider";
import {
  ADVANCED_MOVS_DEFAULT_SORT_DIRECTION,
  ADVANCED_MOVS_DEFAULT_SORT_FIELD,
  applyAdvancedMovsSearchState,
  parseAdvancedMovsSearchParams
} from "../competidexAdvancedMovsFilters";
import { hasCachedImage, preloadCachedImage } from "../../../../utils/competidexImgCache";
import { advancedMovesSearchRoute, advancedMovesSearchRouteWithFilters } from "../../../../utils/competidexRoutes";
import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import FiltroAvanzadoMovs from "../FiltroAvanzadoMovs/FiltroAvanzadoMovs";
import TarjetaMovAvanzado from "./TarjetaMovAvanzado/TarjetaMovAvanzado";
import "./ListaMovsPaginada.css";

function compareMovesForGrid(a, b)
{
  const idA = Number(a?.id);
  const idB = Number(b?.id);

  if(Number.isFinite(idA) && Number.isFinite(idB) && idA !== idB)
  {
    return idA - idB;
  }

  if(Number.isFinite(idA) && !Number.isFinite(idB)) return -1;
  if(!Number.isFinite(idA) && Number.isFinite(idB)) return 1;

  const nameA = String(a?.display || a?.display_es || a?.apiName || a?.name || "").toLowerCase();
  const nameB = String(b?.display || b?.display_es || b?.apiName || b?.name || "").toLowerCase();

  return nameA.localeCompare(nameB);
}

export default function ListaMovsPaginada({
  items = [],
  loading = false,
  emptyText = "No se encontraron movimientos para mostrar."
})
{
  const { movsFiltersSchema = [], movsReady: filtersReady } = useFiltroPkm();
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
      .filter(function(move)
      {
        const key = String(move?.apiName || move?.key || move?.name || move?.display || move?.display_es || "").trim().toLowerCase();
        return !!key;
      })
      .sort(compareMovesForGrid);

  }, [items]);

  const urlSearchState = useMemo(function()
  {
    if(!filtersReady)
    {
      return {
        filters: [],
        sort: {
          field: ADVANCED_MOVS_DEFAULT_SORT_FIELD,
          direction: ADVANCED_MOVS_DEFAULT_SORT_DIRECTION
        }
      };
    }

    return parseAdvancedMovsSearchParams(searchParams, movsFiltersSchema);

  }, [filtersReady, movsFiltersSchema, searchParams]);

  const hasUrlAdvancedState = useMemo(function()
  {
    return searchParams.has("filters") || searchParams.has("sort");

  }, [searchParams]);

  const displayedItems = useMemo(function()
  {
    if(hasUrlAdvancedState && filtersReady)
    {
      return applyAdvancedMovsSearchState(visibleItems, urlSearchState.filters, urlSearchState.sort, movsFiltersSchema);
    }

    if(advancedFilteredItems === null)
    {
      return visibleItems;
    }

    return Array.isArray(advancedFilteredItems) ? advancedFilteredItems : [];

  }, [visibleItems, advancedFilteredItems, filtersReady, movsFiltersSchema, hasUrlAdvancedState, urlSearchState]);

  useEffect(function()
  {
    if(!filtersReady) return;

    if(urlSearchState.hasInvalidFilters)
    {
      const nextSearchParams = new URLSearchParams();
      nextSearchParams.set("sort", `${ADVANCED_MOVS_DEFAULT_SORT_FIELD}:${ADVANCED_MOVS_DEFAULT_SORT_DIRECTION}`);

      setSearchParams(nextSearchParams, { replace: true });
      return;
    }

    if(searchParams.has("sort")) return;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", `${ADVANCED_MOVS_DEFAULT_SORT_FIELD}:${ADVANCED_MOVS_DEFAULT_SORT_DIRECTION}`);

    setSearchParams(nextSearchParams, { replace: true });

  }, [filtersReady, searchParams, setSearchParams, urlSearchState.hasInvalidFilters]);

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
    <section id="contenedorFiltroMovsAvanzado" className="listaPaginadaMovsComponent">

      {/* Acciones: Cantidad por pagina + Total filtrado + Filtro */}
      <div className="listaPaginadaMovsComponent-toolbar">

        {/* Bloque Izquierdo */}
        <div className="listaPaginadaMovsComponent-toolbarInner">

          {/* Paginacion */}
          <div className="listaPaginadaMovsComponent-footer listaPaginadaMovsComponent-footer-arriba">

            {/* Boton Anterior */}
            <button
              type="button"
              className="listaPaginadaMovsComponent-btn listaPaginadaMovsComponent-btnIcon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Anterior"
              title="Anterior"
            >
              <MdOutlineNavigateBefore aria-hidden="true" className="listaPaginadaMovsComponent-icon" />
            </button>

            {/* Texto */}
            <div className="listaPaginadaMovsComponent-pageInfo">
              <span className="listaPaginadaMovsComponent-pageInfoLabel">Página</span>
              <span className="listaPaginadaMovsComponent-pageCountNumber">{formatNumberWithDots(page)}</span>
              <span className="listaPaginadaMovsComponent-pageInfoLabel">de</span>
              <span className="listaPaginadaMovsComponent-pageCountNumber">{formatNumberWithDots(totalPages)}</span>
            </div>

            {/* Boton Siguiente */}
            <button
              type="button"
              className="listaPaginadaMovsComponent-btn listaPaginadaMovsComponent-btnIcon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Siguiente"
              title="Siguiente"
            >
              <MdOutlineNavigateNext aria-hidden="true" className="listaPaginadaMovsComponent-icon" />
            </button>

          </div>

          {/* Salto directo */}
          <div className="listaPaginadaMovsComponent-jumpRow listaPaginadaMovsComponent-jumpRow-arriba">

            {/* Texto */}
            <span className="listaPaginadaMovsComponent-jumpLabel">Ir a página</span>

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
              className="listaPaginadaMovsComponent-numberInput listaPaginadaMovsComponent-jumpInput"
              value={jumpPageInput}
              onChange={handleJumpInputChange}
              onKeyDown={handleJumpKeyDown}
              aria-label={`Ir a una página entre 1 y ${totalPages}`}
              title={`Ir a una página entre 1 y ${totalPages}`}
            />

            {/* Boton Ir a Pagina ingresada */}
            <button
              type="button"
              className="listaPaginadaMovsComponent-btn listaPaginadaMovsComponent-jumpBtn"
              onClick={handleJumpConfirm}
              disabled={!jumpPageInput || Number(jumpPageInput) < 1 || Number(jumpPageInput) > totalPages}
              aria-label="Confirmar salto de página"
              title="Confirmar salto de página"
            >
              Ir
            </button>

          </div>

          {/* Cambiar la cant por pagina */}
          <div className="listaPaginadaMovsComponent-pageSizeSelectWrap" ref={pageSizeDropdownRef}>

            {/* Texto 1 */}
            <span className="listaPaginadaMovsComponent-pageSizeLabel">Mostrar</span>

            {/* Desplegable de Opciones de Paginacion */}
            <div className="listaPaginadaMovsComponent-pageSizePickWrap">

              {/* Paginacion Actual */}
              <button
                type="button"
                className={"listaPaginadaMovsComponent-pageSizePick" + (openPageSize ? " isOpen" : "")}
                onClick={() => setOpenPageSize(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openPageSize}
                aria-label="Cantidad de movimientos por página"
                title="Cantidad de movimientos por página"
              >
                <span className="listaPaginadaMovsComponent-pageSizePickText">{currentPageSize}</span>
                <span className={"listaPaginadaMovsComponent-pageSizePickCaret" + (openPageSize ? " isOpen" : "")} aria-hidden="true">
                  <RiArrowDownSFill />
                </span>
              </button>

              {/* Opciones */}
              {openPageSize && (
                <div className="listaPaginadaMovsComponent-pageSizeList" role="listbox" aria-label="Cantidad de movimientos por página">
                  {[25, 50, 100].map(function(size)
                  {
                    const selected = size === currentPageSize;

                    return (
                      <button
                        key={size}
                        type="button"
                        className={"listaPaginadaMovsComponent-pageSizeOption" + (selected ? " selected" : "")}
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
            <span className="listaPaginadaMovsComponent-pageSizeLabel">movimientos por página</span>

          </div>

          {/* Total de movimientos mostrados */}
          <div className="listaPaginadaMovsComponent-count">
            <span className="listaPaginadaMovsComponent-pageCountNumber">
              {formatNumberWithDots(displayedItems.length)}
            </span>{" "}
            {displayedItems.length === 1 ? "movimiento encontrado" : "movimientos encontrados"}
          </div>

        </div>

        {/* Bloque Derecho */}
        <div className="listaPaginadaMovsComponent-toolbarActions">
          <FiltroAvanzadoMovs
            items={visibleItems}
            totalItems={displayedItems.length}
            initialFilters={urlSearchState.filters}
            initialSort={urlSearchState.sort}
            onApplyFilters={function(payload)
            {
              const nextFilters = Array.isArray(payload?.filters) ? payload.filters : [];
              const nextSort = payload?.sort || {
                field: ADVANCED_MOVS_DEFAULT_SORT_FIELD,
                direction: ADVANCED_MOVS_DEFAULT_SORT_DIRECTION
              };

              navigate(advancedMovesSearchRouteWithFilters({
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
              navigate(advancedMovesSearchRoute(), { replace: false });
              setAdvancedFilteredItems(null);
              setPage(1);
              setJumpPageInput("1");
              scrollToTop();
            }}
          />
        </div>

      </div>

      {/* Lista de Tarjetas Movimientos */}
      <div className="listaPaginadaMovsComponent-mainContent">
        <div className="listaPaginadaMovsComponent-gridWrap">
          <div className="listaPaginadaMovsComponent-grid">

            {/* Tarjetas Movimientos */}
            {pageItems.length > 0 ? pageItems.map(function(move)
            {
              const key = String(move?.apiName || move?.name || move?.display || move?.display_es || move?.id || "move");

              return (
                <TarjetaMovAvanzado
                  key={key}
                  move={move}
                />
              );

            }) : (
              <>
                {/* Ningun movimiento encontrado */}
                <div className="listaPaginadaMovsComponent-emptyState">

                  <img
                    className="listaPaginadaMovsComponent-emptyStateSprite"
                    src={ERROR_404_SPRITE_IMG}
                    alt="No se encontraron movimientos para mostrar"
                  />

                  <div className="listaPaginadaMovsComponent-emptyStateText-NOTFOUND">
                    NOT FOUND
                  </div>

                  <br></br>

                  <div className="listaPaginadaMovsComponent-emptyStateText">
                    {emptyText}
                  </div>

                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Paginacion y Salto de Pagina */}
      <div className="listaPaginadaMovsComponent-paginationDock">
        <div className="listaPaginadaMovsComponent-paginationBlock">

          {/* Paginacion */}
          <div className="listaPaginadaMovsComponent-footer">

            {/* Boton Anterior */}
            <button
              type="button"
              className="listaPaginadaMovsComponent-btn listaPaginadaMovsComponent-btnIcon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Anterior"
              title="Anterior"
            >
              <MdOutlineNavigateBefore aria-hidden="true" className="listaPaginadaMovsComponent-icon" />
            </button>

            {/* Texto */}
            <div className="listaPaginadaMovsComponent-pageInfo">
              <span className="listaPaginadaMovsComponent-pageInfoLabel">Página</span>
              <span className="listaPaginadaMovsComponent-pageCountNumber">{formatNumberWithDots(page)}</span>
              <span className="listaPaginadaMovsComponent-pageInfoLabel">de</span>
              <span className="listaPaginadaMovsComponent-pageCountNumber">{formatNumberWithDots(totalPages)}</span>
            </div>

            {/* Boton Siguiente */}
            <button
              type="button"
              className="listaPaginadaMovsComponent-btn listaPaginadaMovsComponent-btnIcon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Siguiente"
              title="Siguiente"
            >
              <MdOutlineNavigateNext aria-hidden="true" className="listaPaginadaMovsComponent-icon" />
            </button>

          </div>

          {/* Salto directo */}
          <div className="listaPaginadaMovsComponent-jumpRow">

            {/* Texto */}
            <span className="listaPaginadaMovsComponent-jumpLabel">Ir a página</span>

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
              className="listaPaginadaMovsComponent-numberInput listaPaginadaMovsComponent-jumpInput"
              value={jumpPageInput}
              onChange={handleJumpInputChange}
              onKeyDown={handleJumpKeyDown}
              aria-label={`Ir a una página entre 1 y ${totalPages}`}
              title={`Ir a una página entre 1 y ${totalPages}`}
            />

            {/* Boton Ir a Pagina ingresada */}
            <button
              type="button"
              className="listaPaginadaMovsComponent-btn listaPaginadaMovsComponent-jumpBtn"
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