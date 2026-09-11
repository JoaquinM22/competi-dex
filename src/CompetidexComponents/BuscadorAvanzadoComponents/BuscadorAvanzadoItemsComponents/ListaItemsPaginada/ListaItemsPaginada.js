//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoItemsComponents\ListaItemsPaginada\ListaItemsPaginada.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowDownSFill } from "react-icons/ri";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { ERROR_404_SPRITE_IMG, formatNumberWithDots } from "../../../../utils/competidexMeta";
import { useFiltroPkm } from "../../FiltroPkmProvider";
import {
  ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION,
  ADVANCED_ITEMS_DEFAULT_SORT_FIELD,
  applyAdvancedItemsSearchState,
  parseAdvancedItemsSearchParams
} from "../competidexAdvancedItemsFilters";
import { advancedItemsSearchRoute, advancedItemsSearchRouteWithFilters } from "../../../../utils/competidexRoutes";
import { hasCachedImage, preloadCachedImage } from "../../../../utils/competidexImgCache";
import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import FiltroAvanzadoItems from "../FiltroAvanzadoItems/FiltroAvanzadoItems";
import TarjetaItemAvanzado from "./TarjetaItemAvanzado/TarjetaItemAvanzado";
import "./ListaItemsPaginada.css";

function compareItemsForGrid(a, b)
{
  const idA = Number(a?.id);
  const idB = Number(b?.id);

  if(Number.isFinite(idA) && Number.isFinite(idB) && idA !== idB)
  {
    return idA - idB;
  }

  if(Number.isFinite(idA) && !Number.isFinite(idB)) return -1;
  if(!Number.isFinite(idA) && Number.isFinite(idB)) return 1;

  const nameA = String(a?.display || a?.apiName || "").toLowerCase();
  const nameB = String(b?.display || b?.apiName || "").toLowerCase();

  return nameA.localeCompare(nameB);
}

export default function ListaItemsPaginada({
  items = [],
  loading = false,
  emptyText = "No se encontraron Objetos para mostrar."
})
{
  const { itemsFiltersSchema = [], itemsReady: filtersReady } = useFiltroPkm();
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
      .filter(function(item)
      {
        const key = String(item?.apiName || item?.display || "").trim().toLowerCase();
        return !!key;
      })
      .sort(compareItemsForGrid);

  }, [items]);

  const urlSearchState = useMemo(function()
  {
    if(!filtersReady)
    {
      return {
        filters: [],
        sort: {
          field: ADVANCED_ITEMS_DEFAULT_SORT_FIELD,
          direction: ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION
        }
      };
    }

    return parseAdvancedItemsSearchParams(searchParams, itemsFiltersSchema);

  }, [filtersReady, itemsFiltersSchema, searchParams]);

  const hasUrlAdvancedState = useMemo(function()
  {
    return searchParams.has("filters") || searchParams.has("sort");

  }, [searchParams]);

  const displayedItems = useMemo(function()
  {
    if(hasUrlAdvancedState && filtersReady)
    {
      return applyAdvancedItemsSearchState(visibleItems, urlSearchState.filters, urlSearchState.sort, itemsFiltersSchema);
    }

    if(advancedFilteredItems === null)
    {
      return visibleItems;
    }

    return Array.isArray(advancedFilteredItems) ? advancedFilteredItems : [];

  }, [visibleItems, advancedFilteredItems, filtersReady, itemsFiltersSchema, hasUrlAdvancedState, urlSearchState]);

  useEffect(function()
  {
    if(!filtersReady) return;

    if(urlSearchState.hasInvalidFilters)
    {
      const nextSearchParams = new URLSearchParams();
      nextSearchParams.set("sort", `${ADVANCED_ITEMS_DEFAULT_SORT_FIELD}:${ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION}`);

      setSearchParams(nextSearchParams, { replace: true });
      return;
    }

    if(searchParams.has("sort")) return;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", `${ADVANCED_ITEMS_DEFAULT_SORT_FIELD}:${ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION}`);

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
    <section id="contenedorFiltroItemsAvanzado" className="listaItemsPaginadaComponent">

      {/* Acciones: Cantidad por pagina + Total filtrado + Filtro */}
      <div className="listaItemsPaginadaComponent-toolbar">

        {/* Bloque Izquierdo */}
        <div className="listaItemsPaginadaComponent-toolbarInner">

          {/* Paginacion */}
          <div className="listaItemsPaginadaComponent-footer listaItemsPaginadaComponent-footer-arriba">

            {/* Boton Anterior */}
            <button
              type="button"
              className="listaItemsPaginadaComponent-btn listaItemsPaginadaComponent-btnIcon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Anterior"
              title="Anterior"
            >
              <MdOutlineNavigateBefore aria-hidden="true" className="listaItemsPaginadaComponent-icon" />
            </button>

            {/* Texto */}
            <div className="listaItemsPaginadaComponent-pageInfo">
              <span className="listaItemsPaginadaComponent-pageInfoLabel">Página</span>
              <span className="listaItemsPaginadaComponent-pageCountNumber">{formatNumberWithDots(page)}</span>
              <span className="listaItemsPaginadaComponent-pageInfoLabel">de</span>
              <span className="listaItemsPaginadaComponent-pageCountNumber">{formatNumberWithDots(totalPages)}</span>
            </div>

            {/* Boton Siguiente */}
            <button
              type="button"
              className="listaItemsPaginadaComponent-btn listaItemsPaginadaComponent-btnIcon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Siguiente"
              title="Siguiente"
            >
              <MdOutlineNavigateNext aria-hidden="true" className="listaItemsPaginadaComponent-icon" />
            </button>

          </div>

          {/* Salto directo */}
          <div className="listaItemsPaginadaComponent-jumpRow listaItemsPaginadaComponent-jumpRow-arriba">

            {/* Texto */}
            <span className="listaItemsPaginadaComponent-jumpLabel">Ir a página</span>

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
              className="listaItemsPaginadaComponent-numberInput listaItemsPaginadaComponent-jumpInput"
              value={jumpPageInput}
              onChange={handleJumpInputChange}
              onKeyDown={handleJumpKeyDown}
              aria-label={`Ir a una página entre 1 y ${totalPages}`}
              title={`Ir a una página entre 1 y ${totalPages}`}
            />

            {/* Boton Ir a Pagina ingresada */}
            <button
              type="button"
              className="listaItemsPaginadaComponent-btn listaItemsPaginadaComponent-jumpBtn"
              onClick={handleJumpConfirm}
              disabled={!jumpPageInput || Number(jumpPageInput) < 1 || Number(jumpPageInput) > totalPages}
              aria-label="Confirmar salto de página"
              title="Confirmar salto de página"
            >
              Ir
            </button>

          </div>

          {/* Cambiar la cant por pagina */}
          <div className="listaItemsPaginadaComponent-pageSizeSelectWrap" ref={pageSizeDropdownRef}>

            {/* Texto 1 */}
            <span className="listaItemsPaginadaComponent-pageSizeLabel">Mostrar</span>

            {/* Desplegable de Opciones de Paginacion */}
            <div className="listaItemsPaginadaComponent-pageSizePickWrap">

              {/* Paginacion Actual */}
              <button
                type="button"
                className={"listaItemsPaginadaComponent-pageSizePick" + (openPageSize ? " isOpen" : "")}
                onClick={() => setOpenPageSize(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openPageSize}
                aria-label="Cantidad de objetos por página"
                title="Cantidad de objetos por página"
              >
                <span className="listaItemsPaginadaComponent-pageSizePickText">{currentPageSize}</span>
                <span className={"listaItemsPaginadaComponent-pageSizePickCaret" + (openPageSize ? " isOpen" : "")} aria-hidden="true">
                  <RiArrowDownSFill />
                </span>
              </button>

              {/* Opciones */}
              {openPageSize && (
                <div className="listaItemsPaginadaComponent-pageSizeList" role="listbox" aria-label="Cantidad de objetos por página">
                  {[25, 50, 100].map(function(size)
                  {
                    const selected = size === currentPageSize;

                    return (
                      <button
                        key={size}
                        type="button"
                        className={"listaItemsPaginadaComponent-pageSizeOption" + (selected ? " selected" : "")}
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
            <span className="listaItemsPaginadaComponent-pageSizeLabel">objetos por página</span>

          </div>

          {/* Total de objetos mostrados */}
          <div className="listaItemsPaginadaComponent-count">
            <span className="listaItemsPaginadaComponent-pageCountNumber">
              {formatNumberWithDots(displayedItems.length)}
            </span>{" "}
            {displayedItems.length === 1 ? "objeto encontrado" : "objetos encontrados"}
          </div>

        </div>

        {/* Bloque Derecho */}
        <div className="listaItemsPaginadaComponent-toolbarActions">
          <FiltroAvanzadoItems
            items={visibleItems}
            totalItems={displayedItems.length}
            initialFilters={urlSearchState.filters}
            initialSort={urlSearchState.sort}
            onApplyFilters={function(payload)
            {
              const nextFilters = Array.isArray(payload?.filters) ? payload.filters : [];
              const nextSort = payload?.sort || {
                field: ADVANCED_ITEMS_DEFAULT_SORT_FIELD,
                direction: ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION
              };

              navigate(advancedItemsSearchRouteWithFilters({
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
              navigate(advancedItemsSearchRoute(), { replace: false });
              setAdvancedFilteredItems(null);
              setPage(1);
              setJumpPageInput("1");
              scrollToTop();
            }}
          />
        </div>

      </div>

      {/* Lista de Tarjetas Objetos */}
      <div className="listaItemsPaginadaComponent-mainContent">
        <div className="listaItemsPaginadaComponent-gridWrap">
          <div className="listaItemsPaginadaComponent-grid">

            {/* Tarjetas Objetos */}
            {pageItems.length > 0 ? pageItems.map(function(item)
            {
              const key = String(item?.apiName || item?.display || item?.id || "item");

              return (
                <TarjetaItemAvanzado
                  key={key}
                  item={item}
                />
              );

            }) : (
              <>
                {/* Ningun objeto encontrado */}
                <div className="listaItemsPaginadaComponent-emptyState">

                  <img
                    className="listaItemsPaginadaComponent-emptyStateSprite"
                    src={ERROR_404_SPRITE_IMG}
                    alt="No se encontraron objetos para mostrar"
                  />

                  <div className="listaItemsPaginadaComponent-emptyStateText-NOTFOUND">
                    NOT FOUND
                  </div>

                  <br></br>

                  <div className="listaItemsPaginadaComponent-emptyStateText">
                    {emptyText}
                  </div>

                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Paginacion y Salto de Pagina */}
      <div className="listaItemsPaginadaComponent-paginationDock">
        <div className="listaItemsPaginadaComponent-paginationBlock">

          {/* Paginacion */}
          <div className="listaItemsPaginadaComponent-footer">

            {/* Boton Anterior */}
            <button
              type="button"
              className="listaItemsPaginadaComponent-btn listaItemsPaginadaComponent-btnIcon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Anterior"
              title="Anterior"
            >
              <MdOutlineNavigateBefore aria-hidden="true" className="listaItemsPaginadaComponent-icon" />
            </button>

            {/* Texto */}
            <div className="listaItemsPaginadaComponent-pageInfo">
              <span className="listaItemsPaginadaComponent-pageInfoLabel">Página</span>
              <span className="listaItemsPaginadaComponent-pageCountNumber">{formatNumberWithDots(page)}</span>
              <span className="listaItemsPaginadaComponent-pageInfoLabel">de</span>
              <span className="listaItemsPaginadaComponent-pageCountNumber">{formatNumberWithDots(totalPages)}</span>
            </div>

            {/* Boton Siguiente */}
            <button
              type="button"
              className="listaItemsPaginadaComponent-btn listaItemsPaginadaComponent-btnIcon"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Siguiente"
              title="Siguiente"
            >
              <MdOutlineNavigateNext aria-hidden="true" className="listaItemsPaginadaComponent-icon" />
            </button>

          </div>

          {/* Salto directo */}
          <div className="listaItemsPaginadaComponent-jumpRow">

            {/* Texto */}
            <span className="listaItemsPaginadaComponent-jumpLabel">Ir a página</span>

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
              className="listaItemsPaginadaComponent-numberInput listaItemsPaginadaComponent-jumpInput"
              value={jumpPageInput}
              onChange={handleJumpInputChange}
              onKeyDown={handleJumpKeyDown}
              aria-label={`Ir a una página entre 1 y ${totalPages}`}
              title={`Ir a una página entre 1 y ${totalPages}`}
            />

            {/* Boton Ir a Pagina ingresada */}
            <button
              type="button"
              className="listaItemsPaginadaComponent-btn listaItemsPaginadaComponent-jumpBtn"
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

