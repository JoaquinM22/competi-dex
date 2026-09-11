//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoHabsComponents\FiltroAvanzadoHabs\FiltroAvanzadoHabs.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { RiArrowDownSFill } from "react-icons/ri";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi";
import { formatNumberWithDots } from "../../../../utils/competidexMeta";
import { useFiltroPkm } from "../../FiltroPkmProvider";
import {
    ADVANCED_HABS_BOOLEAN_FILTER_OPERATORS,
    ADVANCED_HABS_BOUNDED_TEXT_FILTER_OPERATORS,
    ADVANCED_HABS_DEFAULT_SORT_DIRECTION,
    ADVANCED_HABS_DEFAULT_SORT_FIELD,
    ADVANCED_HABS_NUMBER_FILTER_OPERATORS,
    ADVANCED_HABS_TEXT_FILTER_OPERATORS,
    applyAdvancedHabsSearchState,
    getAdvancedHabsFieldSelectionId,
    getAdvancedHabsFilterValueLabel,
    getAdvancedHabsOperatorData,
    getAdvancedHabsSortFieldData,
    hydrateAdvancedHabsFilters,
    normalizeAdvancedHabsText
} from "../competidexAdvancedHabsFilters";
import { hasCachedImage, preloadCachedImage } from "../../../../utils/competidexImgCache";
import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import "./FiltroAvanzadoHabs.css";

function getDefaultOperatorForField(fieldData)
{
    const type = String(fieldData?.type || "");

    if(type === "text") return "contains";

    return "eq";
}

function sortOptionsByOrder(options)
{
    const list = Array.isArray(options) ? [...options] : [];

    return list.sort(function(a, b)
    {
        const orderA = Number(a?.order ?? 0);
        const orderB = Number(b?.order ?? 0);

        if(orderA !== orderB)
        {
            return orderA - orderB;
        }

        return String(a?.description || a?.key || "").localeCompare(String(b?.description || b?.key || ""));
    });
}

function getFirstOptionKey(options)
{
    const orderedOptions = sortOptionsByOrder(options);
    const firstOption = orderedOptions[0] || null;

    if(!firstOption) return "";
    if(firstOption.key === null || firstOption.key === undefined) return "null";

    return String(firstOption.key);
}

function normalizeFieldValueForFilter(fieldData, rawValue)
{
    const type = String(fieldData?.type || "");

    if(type === "number")
    {
        const normalizedValue = String(rawValue ?? "").trim().replace(",", ".");
        if(!normalizedValue) return null;

        const numberValue = Number(normalizedValue);
        return Number.isFinite(numberValue) ? numberValue : null;
    }

    if(type === "boolean")
    {
        return String(rawValue).trim().toLowerCase() === "true";
    }

    const textValue = String(rawValue ?? "").trim();

    return textValue || null;
}

function getOptionValueKey(option)
{
    if(option?.key === null || option?.key === undefined) return "null";

    return String(option.key);
}

const DESC_BY_GROUP_KEY = {
    all: "Todos",
    principalData: "Datos Principales"
};

const FIELD_GROUP_OPTIONS = Object.keys(DESC_BY_GROUP_KEY).map(function(groupKey)
{
    return {
        key: groupKey,
        description: DESC_BY_GROUP_KEY[groupKey]
    };
});

export default function FiltroAvanzadoHabs({
    items = [],
    totalItems = null,
    initialFilters = [],
    initialSort = null,
    onApplyFilters = null,
    onClearFilters = null
})
{
    const { habsFiltersSchema = [], habsReady } = useFiltroPkm();
    const filtersSchema = useMemo(function()
    {
        return Array.isArray(habsFiltersSchema) ? habsFiltersSchema : [];

    }, [habsFiltersSchema]);
    const ready = !!habsReady;

    const [open, setOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [selectedFieldValue, setSelectedFieldValue] = useState(ADVANCED_HABS_DEFAULT_SORT_FIELD);
    const [selectedOperator, setSelectedOperator] = useState("eq");
    const [inputValue, setInputValue] = useState("");
    const [selectedSortFieldValue, setSelectedSortFieldValue] = useState(ADVANCED_HABS_DEFAULT_SORT_FIELD);
    const [selectedSortDirection, setSelectedSortDirection] = useState(ADVANCED_HABS_DEFAULT_SORT_DIRECTION);
    const [openFieldValue, setOpenFieldValue] = useState(false);
    const [openFieldGroupKey, setOpenFieldGroupKey] = useState(false);
    const [selectedFieldGroupKey, setSelectedFieldGroupKey] = useState("all");
    const [openOperator, setOpenOperator] = useState(false);
    const [openEnumValue, setOpenEnumValue] = useState(false);
    const [openSortFieldValue, setOpenSortFieldValue] = useState(false);
    const [openSortFieldGroupKey, setOpenSortFieldGroupKey] = useState(false);
    const [selectedSortFieldGroupKey, setSelectedSortFieldGroupKey] = useState("all");
    const [optionSearchValues, setOptionSearchValues] = useState({
        field: "",
        sortField: "",
        enumValue: ""
    });

    const filterChipIdRef = useRef(0);
    const fieldSelectRef = useRef(null);
    const fieldGroupSelectRef = useRef(null);
    const operatorSelectRef = useRef(null);
    const enumValueSelectRef = useRef(null);
    const sortFieldSelectRef = useRef(null);
    const sortFieldGroupSelectRef = useRef(null);

    const portalTarget = useMemo(function()
    {
        if(typeof document === "undefined") return null;

        return document.getElementById("contenedorFiltroHabsAvanzado");

    }, [open]);

    const itemsCount = useMemo(function()
    {
        return Array.isArray(items) ? items.length : 0;

    }, [items]);

    const displayTotalItems = useMemo(function()
    {
        const rawTotalItems = Number(totalItems);
        return Number.isFinite(rawTotalItems) ? rawTotalItems : itemsCount;

    }, [totalItems, itemsCount]);

    useEffect(function()
    {
        if(!Array.isArray(habsFiltersSchema) || habsFiltersSchema.length === 0) return;

        const iconRoutes = new Set();

        habsFiltersSchema.forEach(function(field)
        {
            const options = Array.isArray(field?.options) ? field.options : [];

            options.forEach(function(option)
            {
                const iconRoute = String(option?.iconRoute || "").trim();

                if(iconRoute)
                {
                    iconRoutes.add(iconRoute);
                }
            });
        });

        iconRoutes.forEach(function(iconRoute)
        {
            if(!hasCachedImage(iconRoute))
            {
                preloadCachedImage(iconRoute);
            }
        });

    }, [habsFiltersSchema]);

    const selectedFieldData = useMemo(function()
    {
        return filtersSchema.find(function(field)
        {
            return getAdvancedHabsFieldSelectionId(field) === selectedFieldValue || String(field?.field || "") === selectedFieldValue;
        }) || null;

    }, [filtersSchema, selectedFieldValue]);

    const selectedSortFieldData = useMemo(function()
    {
        return getAdvancedHabsSortFieldData(filtersSchema, selectedSortFieldValue);

    }, [filtersSchema, selectedSortFieldValue]);

    const selectedFieldType = String(selectedFieldData?.type || "");
    const hasSortChanged = useMemo(function()
    {
        const initialSortField = String(initialSort?.field || ADVANCED_HABS_DEFAULT_SORT_FIELD);
        const initialSortDirection = String(initialSort?.direction || ADVANCED_HABS_DEFAULT_SORT_DIRECTION).toLowerCase() === "desc"
            ? "desc"
            : "asc";
        const currentSortField = selectedSortFieldData ? String(selectedSortFieldData.field || ADVANCED_HABS_DEFAULT_SORT_FIELD) : ADVANCED_HABS_DEFAULT_SORT_FIELD;

        return currentSortField !== initialSortField || selectedSortDirection !== initialSortDirection;

    }, [initialSort, selectedSortDirection, selectedSortFieldData]);

    useEffect(function()
    {
        if(!Array.isArray(filtersSchema) || filtersSchema.length === 0) return;

        const hydratedFilters = hydrateAdvancedHabsFilters(initialFilters, filtersSchema);

        filterChipIdRef.current = hydratedFilters.length;
        setAppliedFilters(hydratedFilters.map(function(filter, index)
        {
            return {
                ...filter,
                id: filter.id || `filter-chip-${index + 1}`
            };
        }));

        const nextSortField = String(initialSort?.field || ADVANCED_HABS_DEFAULT_SORT_FIELD);
        const nextSortDirection = String(initialSort?.direction || ADVANCED_HABS_DEFAULT_SORT_DIRECTION).toLowerCase() === "desc"
            ? "desc"
            : "asc";
        const nextSortFieldData = getAdvancedHabsSortFieldData(filtersSchema, nextSortField);
        const nextSortFieldValue = nextSortFieldData
            ? getAdvancedHabsFieldSelectionId(nextSortFieldData)
            : ADVANCED_HABS_DEFAULT_SORT_FIELD;

        setSelectedSortFieldValue(nextSortFieldValue);
        setSelectedSortDirection(nextSortDirection);

    }, [filtersSchema, initialFilters, initialSort]);

    useEffect(function()
    {
        function onKeyDown(e)
        {
            if(e.key === "Escape")
            {
                setOpen(false);
                closeAllSelects();
            }
        }

        if(open)
        {
            window.addEventListener("keydown", onKeyDown);
        }

        return function()
        {
            window.removeEventListener("keydown", onKeyDown);
        };

    }, [open]);

    useEffect(function()
    {
        function handleGlobalPointerDown(event)
        {
            const target = event.target;

            if(openFieldValue && fieldSelectRef.current && !fieldSelectRef.current.contains(target)) setOpenFieldValue(false);
            if(openFieldGroupKey && fieldGroupSelectRef.current && !fieldGroupSelectRef.current.contains(target)) setOpenFieldGroupKey(false);
            if(openOperator && operatorSelectRef.current && !operatorSelectRef.current.contains(target)) setOpenOperator(false);
            if(openEnumValue && enumValueSelectRef.current && !enumValueSelectRef.current.contains(target)) setOpenEnumValue(false);
            if(openSortFieldValue && sortFieldSelectRef.current && !sortFieldSelectRef.current.contains(target)) setOpenSortFieldValue(false);
            if(openSortFieldGroupKey && sortFieldGroupSelectRef.current && !sortFieldGroupSelectRef.current.contains(target)) setOpenSortFieldGroupKey(false);
        }

        document.addEventListener("mousedown", handleGlobalPointerDown);
        document.addEventListener("touchstart", handleGlobalPointerDown);

        return function()
        {
            document.removeEventListener("mousedown", handleGlobalPointerDown);
            document.removeEventListener("touchstart", handleGlobalPointerDown);
        };

    }, [openFieldValue, openFieldGroupKey, openOperator, openEnumValue, openSortFieldValue, openSortFieldGroupKey]);

    useEffect(function()
    {
        if(typeof window === "undefined" || typeof document === "undefined") return;

        const hasOpenSelect =
            openFieldValue ||
            openFieldGroupKey ||
            openOperator ||
            openEnumValue ||
            openSortFieldValue ||
            openSortFieldGroupKey;

        if(!hasOpenSelect) return;

        const animationFrameId = window.requestAnimationFrame(function()
        {
            const menuBodies = document.querySelectorAll(
                ".filtroAvanzadoHabsComponent-fieldSelectMenuBody, .filtroAvanzadoHabsComponent-numberSelectMenu"
            );

            menuBodies.forEach(function(menuBody)
            {
                const selectedOption = menuBody.querySelector(
                    ".filtroAvanzadoHabsComponent-fieldSelectOption.selected, .filtroAvanzadoHabsComponent-numberSelectOption.selected"
                );

                if(!selectedOption) return;

                menuBody.scrollTop = selectedOption.offsetTop - menuBody.offsetTop;
            });
        });

        return function()
        {
            window.cancelAnimationFrame(animationFrameId);
        };

    }, [openFieldValue, openFieldGroupKey, openOperator, openEnumValue, openSortFieldValue, openSortFieldGroupKey]);

    function closeAllSelects()
    {
        setOpenFieldValue(false);
        setOpenFieldGroupKey(false);
        setOpenOperator(false);
        setOpenEnumValue(false);
        setOpenSortFieldValue(false);
        setOpenSortFieldGroupKey(false);
    }

    function openDrawer()
    {
        setOpen(true);
    }

    function closeDrawer()
    {
        setOpen(false);
        closeAllSelects();
    }

    function getOptionSearchValue(searchKey)
    {
        return String(optionSearchValues?.[searchKey] || "");
    }

    function setOptionSearchValue(searchKey, value)
    {
        setOptionSearchValues(function(prev)
        {
            const nextValue = String(value || "");

            if(String(prev?.[searchKey] || "") === nextValue)
            {
                return prev;
            }

            return {
                ...prev,
                [searchKey]: nextValue
            };
        });
    }

    function openOptionDropdownForSearchKey(searchKey)
    {
        switch(searchKey)
        {
            case "field":
                setOpenFieldValue(true);
                break;
            case "sortField":
                setOpenSortFieldValue(true);
                break;
            case "enumValue":
                setOpenEnumValue(true);
                break;
            default:
                break;
        }
    }

    function clearOptionSearchValue(searchKey)
    {
        setOptionSearchValue(searchKey, "");
    }

    function filterOptionsByDescription(options, searchValue)
    {
        const list = Array.isArray(options) ? options : [];
        const needle = normalizeAdvancedHabsText(searchValue);

        if(!needle) return list;

        return list.filter(function(option)
        {
            return normalizeAdvancedHabsText(option?.description || option?.field || option?.key || "").includes(needle);
        });
    }

    function filterFieldOptionsByGroup(options, groupKey)
    {
        const selectedGroupKey = String(groupKey || "all");
        const list = Array.isArray(options) ? options : [];

        if(selectedGroupKey === "all") return list;

        return list.filter(function(option)
        {
            return String(option?.groupKey || "") === selectedGroupKey;
        });
    }

    function getFilteredFieldOptions()
    {
        return getFilteredFieldOptionsByGroup(selectedFieldGroupKey);
    }

    function getFilteredFieldOptionsByGroup(groupKey)
    {
        const filteredByDescription = filterOptionsByDescription(filtersSchema, getOptionSearchValue("field"));

        return filterFieldOptionsByGroup(filteredByDescription, groupKey);
    }

    function getFilteredSortFieldOptions()
    {
        return getFilteredSortFieldOptionsByGroup(selectedSortFieldGroupKey);
    }

    function getFilteredSortFieldOptionsByGroup(groupKey)
    {
        const filteredByDescription = filterOptionsByDescription(filtersSchema, getOptionSearchValue("sortField"));

        return filterFieldOptionsByGroup(filteredByDescription, groupKey);
    }

    function handleSelectField(fieldId)
    {
        const fieldData = filtersSchema.find(function(field)
        {
            return getAdvancedHabsFieldSelectionId(field) === fieldId;
        }) || null;

        setSelectedFieldValue(fieldId);
        setSelectedOperator(getDefaultOperatorForField(fieldData));
        setInputValue(function()
        {
            const fieldType = String(fieldData?.type || "");

            if(fieldType === "boolean") return "true";
            if(fieldType === "enum") return getFirstOptionKey(fieldData?.options);

            return "";
        });
        setOptionSearchValue("enumValue", "");
        setOpenFieldValue(false);
        setOpenOperator(false);
        setOpenEnumValue(false);
    }

    function handleSelectSortField(fieldId)
    {
        setSelectedSortFieldValue(fieldId);
        setOpenSortFieldValue(false);
    }

    function handleToggleSortDirection()
    {
        setSelectedSortDirection(function(prev)
        {
            return prev === "asc" ? "desc" : "asc";
        });
    }

    function handleSelectOperator(operatorKey)
    {
        setSelectedOperator(String(operatorKey || "eq"));
        setOpenOperator(false);
    }

    function handleSelectEnumValue(value)
    {
        setInputValue(String(value ?? ""));
        setOpenEnumValue(false);
    }

    //** ------------- Funciones Botones Filtros (Aplicar/Limpiar/Añadir) - INICIO -------------

    function removeAppliedFilter(filterId)
    {
        setAppliedFilters(function(prev)
        {
            return prev.filter(function(filter)
            {
                return String(filter.id || "") !== String(filterId || "");
            });
        });
    }

    function clearDraftFilter()
    {
        if(selectedFieldType === "boolean")
        {
            setInputValue("true");
        
        }else if(selectedFieldType === "enum")
        {
            setInputValue(getFirstOptionKey(selectedFieldData?.options));
        
        }else
        {
            setInputValue("");
        }

        setOpenOperator(false);
        setOpenEnumValue(false);
    }

    function buildCurrentFilterQuery()
    {
        if(!selectedFieldData) return null;

        const value = normalizeFieldValueForFilter(selectedFieldData, inputValue);
        if(value === null) return null;

        const operatorData = getAdvancedHabsOperatorData(selectedOperator, selectedFieldType);
        if(!operatorData) return null;

        return {
            field: String(selectedFieldData.field || ""),
            description: String(selectedFieldData.description || selectedFieldData.field || ""),
            fieldLabel: String(selectedFieldData.description || selectedFieldData.field || ""),
            path: String(selectedFieldData.path || selectedFieldData.field || ""),
            type: selectedFieldType,
            operator: String(operatorData.key || ""),
            operatorLabel: String(operatorData.label || ""),
            operatorSymbol: String(operatorData.symbol || ""),
            value: value,
            valueLabel: getAdvancedHabsFilterValueLabel(selectedFieldData, value),
            slot: null
        };
    }

    function isFilterAlreadyApplied(query, filters = appliedFilters)
    {
        if(!query) return false;

        const list = Array.isArray(filters) ? filters : [];

        return list.some(function(filter)
        {
            return (
                String(filter?.field || "") === String(query.field || "") &&
                String(filter?.path || "") === String(query.path || "") &&
                String(filter?.operator || "") === String(query.operator || "") &&
                String(filter?.value ?? "") === String(query.value ?? "") &&
                (filter?.slot ?? null) === (query.slot ?? null)
            );
        });
    }

    function addCurrentFilter()
    {
        const currentQuery = buildCurrentFilterQuery();

        if(!currentQuery || isFilterAlreadyApplied(currentQuery)) return;

        const nextIdNumber = filterChipIdRef.current + 1;
        filterChipIdRef.current = nextIdNumber;

        setAppliedFilters(function(prev)
        {
            return [
                ...prev,
                {
                    id: `filter-chip-${nextIdNumber}`,
                    ...currentQuery
                }
            ];
        });

        clearDraftFilter();
    }

    function handleApplyFilters()
    {
        const sort = {
            field: selectedSortFieldData ? String(selectedSortFieldData.field || ADVANCED_HABS_DEFAULT_SORT_FIELD) : ADVANCED_HABS_DEFAULT_SORT_FIELD,
            direction: selectedSortDirection
        };
        const filteredItems = applyAdvancedHabsSearchState(items, appliedFilters, sort, filtersSchema);

        if(typeof onApplyFilters === "function")
        {
            onApplyFilters({
                filters: appliedFilters,
                sort: sort,
                items: filteredItems
            });
        }

        closeDrawer();
    }

    function handleClearFilters()
    {
        setAppliedFilters([]);
        setSelectedFieldValue(ADVANCED_HABS_DEFAULT_SORT_FIELD);
        setSelectedOperator("eq");
        setInputValue("");
        setSelectedSortFieldValue(ADVANCED_HABS_DEFAULT_SORT_FIELD);
        setSelectedSortDirection(ADVANCED_HABS_DEFAULT_SORT_DIRECTION);
        setOptionSearchValues({
            field: "",
            sortField: "",
            enumValue: ""
        });
        setSelectedFieldGroupKey("all");
        setSelectedSortFieldGroupKey("all");

        if(typeof onClearFilters === "function")
        {
            onClearFilters();
        }

        closeDrawer();
    }

    function handleSelectFieldGroupKey(groupKey)
    {
        const nextGroupKey = String(groupKey || "all");
        const firstFilteredField = getFilteredFieldOptionsByGroup(nextGroupKey)[0] || null;

        setSelectedFieldGroupKey(nextGroupKey);
        setOpenFieldGroupKey(false);
        setOpenFieldValue(false);

        if(firstFilteredField)
        {
            handleSelectField(getAdvancedHabsFieldSelectionId(firstFilteredField));
        }
    }

    function handleSelectSortFieldGroupKey(groupKey)
    {
        const nextGroupKey = String(groupKey || "all");
        const firstFilteredField = getFilteredSortFieldOptionsByGroup(nextGroupKey)[0] || null;

        setSelectedSortFieldGroupKey(nextGroupKey);
        setOpenSortFieldGroupKey(false);
        setOpenSortFieldValue(false);

        if(firstFilteredField)
        {
            handleSelectSortField(getAdvancedHabsFieldSelectionId(firstFilteredField));
        }
    }

    //** ------------- Funciones Botones Filtros (Aplicar/Limpiar/Añadir) - FIN -------------


    //** ------------- Funciones Auxiliares Input - INICIO -------------

    // Funcion Input para filtrar Opciones de Atributos con desplegables (Ej: Tipo, Generacion, etc)
    function renderOptionSearchInput({ searchKey, placeholder })
    {
        const searchValue = getOptionSearchValue(searchKey);

        return (
            <div className="filtroAvanzadoHabsComponent-optionSearchRow">
                <div className="filtroAvanzadoHabsComponent-textInputPopper filtroAvanzadoHabsComponent-optionSearchPopper">
                    <div className="filtroAvanzadoHabsComponent-numberInputWrap">
                        <input
                            type="search"
                            inputMode="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={searchValue}
                            onChange={(event) =>
                            {
                                const nextValue = event.target.value;
                                setOptionSearchValue(searchKey, nextValue);

                                if(String(nextValue || "").trim() !== "")
                                {
                                    openOptionDropdownForSearchKey(searchKey);
                                }
                            }}
                            onFocus={() =>
                            {
                                if(String(searchValue || "").trim() !== "")
                                {
                                    openOptionDropdownForSearchKey(searchKey);
                                }
                            }}
                            className={
                                "filtroAvanzadoHabsComponent-numberInput filtroAvanzadoHabsComponent-textInput filtroAvanzadoHabsComponent-optionSearchInput" +
                                (String(searchValue || "").trim() === "" ? " filtroAvanzadoHabsComponent-numberInputPlaceholderVisible" : "")
                            }
                            aria-label={placeholder}
                            placeholder={placeholder}
                            title={placeholder}
                        />

                        {searchValue ? (
                            <button
                                type="button"
                                className="filtroAvanzadoHabsComponent-numberInputClear"
                                onClick={() => clearOptionSearchValue(searchKey)}
                                aria-label="Limpiar búsqueda"
                                title="Limpiar búsqueda"
                            >
                                <FiX className="filtroAvanzadoHabsComponent-numberInputClearIcon" aria-hidden="true" />
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    // Funcion que arma opcion no clickeable de "No se encontraron coincidencias" al usar el input de filtrado
    function renderEmptySearchResults()
    {
        return (
            <div className="filtroAvanzadoHabsComponent-emptySearchResults">
                No se encontraron coincidencias
            </div>
        );
    }

    function renderFieldOptionNode(field)
    {
        return String(field?.description || field?.field || "");
    }

    function getFieldOptions(fieldData = selectedFieldData)
    {
        return sortOptionsByOrder(fieldData?.options);
    }

    function renderGenerationOptionNode(option)
    {
        const iconRoute = String(option?.iconRoute || "");
        const description = String(option?.description || getOptionValueKey(option));

        return (
            <span className="filtroAvanzadoHabsComponent-fieldSelectOptionNode">
                
                {iconRoute ? (
                    <img
                        className="filtroAvanzadoHabsComponent-fieldSelectOptionIcon"
                        src={iconRoute}
                        alt={description || "Generación"}
                        title={description || "Generación"}
                    />
                ) : null}
                
                <span className="filtroAvanzadoHabsComponent-fieldSelectOptionText">
                    {description}
                </span>

            </span>
        );
    }

    function renderTextEnumOptionNode(option)
    {
        const iconRoute = String(option?.iconRoute || "");
        const description = String(option?.description || getOptionValueKey(option));

        return (
            <span className="filtroAvanzadoHabsComponent-fieldSelectOptionNode">
                {iconRoute ? (
                    <img
                        className="filtroAvanzadoHabsComponent-fieldSelectOptionIcon"
                        src={iconRoute}
                        alt=""
                        aria-hidden="true"
                    />
                ) : null}

                <span className="filtroAvanzadoHabsComponent-fieldSelectOptionText">
                    {description}
                </span>
            </span>
        );
    }

    //** ------------- Funciones Auxiliares Input - FIN -------------


    //** --------------- Funciones Operadores - INICIO --------------- 

    // Funcion Principal Orquestadora
    function renderOperatorSelect(operatorList, fieldType)
    {
        const options = Array.isArray(operatorList) ? operatorList : [];
        const operatorData = getAdvancedHabsOperatorData(selectedOperator, fieldType);

        return (
            <div className="filtroAvanzadoHabsComponent-numberSelectPopper" ref={operatorSelectRef}>
                <div className="filtroAvanzadoHabsComponent-numberSelectTitle">
                    Operador
                </div>

                <button
                    type="button"
                    className={"filtroAvanzadoHabsComponent-numberSelectButton" + (openOperator ? " isOpen" : "")}
                    onClick={() => setOpenOperator(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openOperator}
                >
                    <span className="filtroAvanzadoHabsComponent-numberSelectButtonText">
                        {operatorData?.symbol || "="}
                    </span>
                    <span className={"filtroAvanzadoHabsComponent-numberSelectCaret" + (openOperator ? " isOpen" : "")} aria-hidden="true">
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openOperator && (
                    <div className="filtroAvanzadoHabsComponent-numberSelectMenu" role="listbox" aria-label="Operadores">
                        {options.map(function(option)
                        {
                            const selected = String(option.key || "") === selectedOperator;

                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    className={"filtroAvanzadoHabsComponent-numberSelectOption" + (selected ? " selected" : "")}
                                    onClick={() => handleSelectOperator(option.key)}
                                    role="option"
                                    aria-selected={selected}
                                    title={option.label}
                                >
                                    <span className="filtroAvanzadoHabsComponent-numberSelectOptionLabel">
                                        {option.symbol}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // Operadores Numericos (=, !=, <, >, <=, y >=)
    function renderNumberOperators()
    {
        return renderOperatorSelect(ADVANCED_HABS_NUMBER_FILTER_OPERATORS, "number");
    }

    // Operadores de Texto (=, !=, Contiene y No Contiene)
    function renderTextOperators()
    {
        return renderOperatorSelect(ADVANCED_HABS_TEXT_FILTER_OPERATORS, "text");
    }

    // Operadores de Texto Acotado (Solo = y 1=)
    function renderBoundedTextOperators()
    {
        return renderOperatorSelect(ADVANCED_HABS_BOUNDED_TEXT_FILTER_OPERATORS, "enum");
    }

    // Operadores para Booleanos (Selector de Si/No)
    function renderBooleanOperators()
    {
        return renderOperatorSelect(ADVANCED_HABS_BOOLEAN_FILTER_OPERATORS, "boolean");
    }

    //** --------------- Funciones Operadores - FIN --------------- 


    //** --------------- Funciones Inputs Reutilizables - INICIO ---------------

    // Funcion reutilizable, para diferentes campos Numericos (Solo Positivos, con coma, etc)
    function renderIntegerInput({
        allowNegative = false,
        placeholder = "Escriba un número entero..."
    } = {})
    {
        function handleIntegerInputChange(event)
        {
            const rawValue = String(event.target.value || "");
            const normalizedValue = allowNegative
                ? rawValue.replace(/[^\d-]/g, "").replace(/(?!^)-/g, "")
                : rawValue.replace(/\D/g, "");

            setInputValue(normalizedValue);
        }

        return (
            <div className="filtroAvanzadoHabsComponent-numberInputPopper">
                <div className="filtroAvanzadoHabsComponent-numberInputTitle">
                    Valor
                </div>

                <div className="filtroAvanzadoHabsComponent-numberInputWrap">
                    <input
                        type="search"
                        className={
                            "filtroAvanzadoHabsComponent-numberInput" +
                            (!String(inputValue || "").trim() ? " filtroAvanzadoHabsComponent-numberInputPlaceholderVisible" : "")
                        }
                        value={inputValue}
                        onChange={handleIntegerInputChange}
                        inputMode={allowNegative ? "text" : "numeric"}
                        placeholder={placeholder}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                    />

                    {inputValue ? (
                        <button
                            type="button"
                            className="filtroAvanzadoHabsComponent-numberInputClear"
                            onClick={() => setInputValue("")}
                            aria-label="Limpiar valor"
                            title="Limpiar valor"
                        >
                            <FiX className="filtroAvanzadoHabsComponent-numberInputClearIcon" aria-hidden="true" />
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }

    // Input de Campo Numerico Entero Positivo
    function renderPositiveIntegerInput()
    {
        return renderIntegerInput({
            allowNegative: false,
            placeholder: "Escriba un número entero..."
        });
    }

    // Input de Campo Numerico Entero con Negativos
    function renderSignedIntegerInput()
    {
        return renderIntegerInput({
            allowNegative: true,
            placeholder: "Escriba un número entero..."
        });
    }

    // Input de Campo de Texto
    function renderTextInput()
    {
        return (
            <div className="filtroAvanzadoHabsComponent-numberInputPopper filtroAvanzadoHabsComponent-textInputPopper">
                <div className="filtroAvanzadoHabsComponent-numberInputTitle">
                    Valor
                </div>

                <div className="filtroAvanzadoHabsComponent-numberInputWrap">
                    <input
                        type="search"
                        className={
                            "filtroAvanzadoHabsComponent-numberInput filtroAvanzadoHabsComponent-textInput" +
                            (!String(inputValue || "").trim() ? " filtroAvanzadoHabsComponent-numberInputPlaceholderVisible" : "")
                        }
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        inputMode="text"
                        placeholder="Escriba texto..."
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                    />

                    {inputValue ? (
                        <button
                            type="button"
                            className="filtroAvanzadoHabsComponent-numberInputClear"
                            onClick={() => setInputValue("")}
                            aria-label="Limpiar valor"
                            title="Limpiar valor"
                        >
                            <FiX className="filtroAvanzadoHabsComponent-numberInputClearIcon" aria-hidden="true" />
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }

    // Input de Campo Booleano
    function renderBooleanValueSelect()
    {
        const booleanOptions = [
            { key: "true", description: "Sí" },
            { key: "false", description: "No" }
        ];

        return (
            <div className="filtroAvanzadoHabsComponent-fieldSelectPopper" ref={enumValueSelectRef}>
                <div className="filtroAvanzadoHabsComponent-ValueSelectTitle">
                    Valor
                </div>

                <button
                    type="button"
                    className={"filtroAvanzadoHabsComponent-fieldSelectButton" + (openEnumValue ? " isOpen" : "")}
                    onClick={() => setOpenEnumValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openEnumValue}
                >
                    <span className="filtroAvanzadoHabsComponent-fieldSelectButtonText">
                        {String(inputValue).toLowerCase() === "false" ? "No" : "Sí"}
                    </span>
                    <span className={"filtroAvanzadoHabsComponent-fieldSelectCaret" + (openEnumValue ? " isOpen" : "")} aria-hidden="true">
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openEnumValue && (
                    <div className="filtroAvanzadoHabsComponent-fieldSelectMenu" role="listbox" aria-label="Valor booleano">
                        <div className="filtroAvanzadoHabsComponent-fieldSelectMenuBody">
                            {booleanOptions.map(function(option)
                            {
                                const selected = String(inputValue || "true") === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={"filtroAvanzadoHabsComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                        onClick={() => handleSelectEnumValue(option.key)}
                                        role="option"
                                        aria-selected={selected}
                                    >
                                        <span className="filtroAvanzadoHabsComponent-fieldSelectOptionText">
                                            {option.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Selector de Opciones
    function renderEnumValueSelect({
        fieldData = selectedFieldData,
        popperClassName = "filtroAvanzadoHabsComponent-fieldSelectPopper",
        placeholder = "Filtrar opciones...",
        ariaLabel = "Opciones",
        renderOptionNode = renderTextEnumOptionNode
    } = {})
    {
        const options = getFieldOptions(fieldData);
        const selectedOption = options.find(function(option)
        {
            return getOptionValueKey(option) === String(inputValue ?? "");

        }) || options[0] || null;
        const selectedOptionValue = selectedOption ? getOptionValueKey(selectedOption) : "";
        const selectedOptionDescription = selectedOption
            ? getAdvancedHabsFilterValueLabel(fieldData, selectedOptionValue)
            : "";
        const filteredOptions = filterOptionsByDescription(options, getOptionSearchValue("enumValue"));

        return (
            <div className={popperClassName} ref={enumValueSelectRef}>
                <div className="filtroAvanzadoHabsComponent-ValueSelectTitle">
                    Valor
                </div>

                {renderOptionSearchInput({
                    searchKey: "enumValue",
                    placeholder: placeholder
                })}

                <button
                    type="button"
                    className={"filtroAvanzadoHabsComponent-fieldSelectButton filtroAvanzadoHabsComponent-fieldSelectButtonTypeCentered" + (openEnumValue ? " isOpen" : "")}
                    onClick={() => setOpenEnumValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openEnumValue}
                    title={selectedOptionDescription || "Valor"}
                >
                    <span className="filtroAvanzadoHabsComponent-fieldSelectButtonNode">
                        {selectedOption ? renderOptionNode(selectedOption) : (
                            <span className="filtroAvanzadoHabsComponent-fieldSelectButtonText">
                                Valor
                            </span>
                        )}
                    </span>
                    <span className={"filtroAvanzadoHabsComponent-fieldSelectCaret" + (openEnumValue ? " isOpen" : "")} aria-hidden="true">
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openEnumValue && (
                    <div className="filtroAvanzadoHabsComponent-fieldSelectMenu" role="listbox" aria-label={ariaLabel}>
                        <div className="filtroAvanzadoHabsComponent-fieldSelectMenuBody">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(function(option)
                                {
                                    const optionKey = getOptionValueKey(option);
                                    const selected = optionKey === selectedOptionValue;

                                    return (
                                        <button
                                            key={optionKey}
                                            type="button"
                                            className={"filtroAvanzadoHabsComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => handleSelectEnumValue(optionKey)}
                                            role="option"
                                            aria-selected={selected}
                                            title={option.description}
                                        >
                                            {renderOptionNode(option)}
                                        </button>
                                    );
                                })
                            ) : renderEmptySearchResults()}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    //** --------------- Funciones Inputs Reutilizables - FIN ---------------


    //** --------------- Funciones Render Filtros - INICIO ---------------

    // Funcion Boton Añadir Filtro
    function renderAddFilterAction()
    {
        const currentQuery = buildCurrentFilterQuery();
        const isDuplicateFilter = isFilterAlreadyApplied(currentQuery);
        const addButtonTitle = isDuplicateFilter ? "Este filtro ya fue añadido" : "Añadir filtro";

        return (
            <div className="filtroAvanzadoHabsComponent-FilterActions">
                <button
                    type="button"
                    className="filtroAvanzadoHabsComponent-ActionFilterAdd filtroAvanzadoHabsComponent-ActionFilterAddFullWidth"
                    onClick={addCurrentFilter}
                    disabled={!currentQuery || isDuplicateFilter}
                    title={addButtonTitle}
                    aria-label={addButtonTitle}
                >
                    Añadir filtro
                </button>
            </div>
        );
    }

    // Funcion reutilizable para armar bloque render: Operador, Input/Desplegable y Acciones
    function renderFilterBlock({ operatorNode, valueNode })
    {
        return (
            <div className="filtroAvanzadoHabsComponent-idFilterBlock">
                <div className="filtroAvanzadoHabsComponent-idFilterRow filtroAvanzadoHabsComponent-idFilterRowOperator">
                    {operatorNode}
                </div>

                <div className="filtroAvanzadoHabsComponent-idFilterRow filtroAvanzadoHabsComponent-idFilterRowValue">
                    {valueNode}
                </div>

                <div className="filtroAvanzadoHabsComponent-idFilterRow filtroAvanzadoHabsComponent-idFilterActionsRow">
                    {renderAddFilterAction()}
                </div>
            </div>
        );
    }

    // Filtro Reutilizable de Campo Numerico Entero Positivo
    function renderPositiveIntegerFieldFilter()
    {
        return renderFilterBlock({
            operatorNode: renderNumberOperators(),
            valueNode: renderPositiveIntegerInput()
        });
    }

    // Filtro Reutilizable de Campo Numerico Entero con Negativos
    function renderSignedIntegerFieldFilter()
    {
        return renderFilterBlock({
            operatorNode: renderNumberOperators(),
            valueNode: renderSignedIntegerInput()
        });
    }

    // Filtro Reutilizable de Campo de Texto
    function renderTextFieldFilter()
    {
        return renderFilterBlock({
            operatorNode: renderTextOperators(),
            valueNode: renderTextInput()
        });
    }

    // Filtro Reutilizable de Campo de Opciones
    function renderEnumFieldFilter({
        popperClassName,
        placeholder,
        ariaLabel,
        renderOptionNode
    })
    {
        return renderFilterBlock({
            operatorNode: renderBoundedTextOperators(),
            valueNode: renderEnumValueSelect({
                popperClassName: popperClassName,
                placeholder: placeholder,
                ariaLabel: ariaLabel,
                renderOptionNode: renderOptionNode
            })
        });
    }

    // Filtro Reutilizable de Campo Booleano
    function renderBooleanFieldFilter()
    {
        return renderFilterBlock({
            operatorNode: renderBooleanOperators(),
            valueNode: renderBooleanValueSelect()
        });
    }


    // Filtro de Atributo "ID"
    function renderIdFilter()
    {
        return renderPositiveIntegerFieldFilter();
    }

    // Filtro de Atributo "Generacion"
    function renderGenerationFilter()
    {
        return renderEnumFieldFilter({
            popperClassName: "filtroAvanzadoHabsComponent-fieldSelectPopper-GenerationPkm",
            placeholder: "Filtrar generaciones...",
            ariaLabel: "Opciones de generación",
            renderOptionNode: renderGenerationOptionNode
        });
    }

    // Filtro de Atributo "Nombre"
    function renderDisplayFilter()
    {
        return renderTextFieldFilter();
    }

    //** --------------- Funciones Render Filtros - FIN ---------------

    // Funcion que renderiza un testo informativo, cuando no se eligio ningun atributo
    function renderFieldNotReady()
    {
        return (
            <div className="filtroAvanzadoHabsComponent-fieldNotReady">
                <div className="filtroAvanzadoHabsComponent-fieldNotReadyTitle">
                    Seleccioná un atributo
                </div>
                <div className="filtroAvanzadoHabsComponent-fieldNotReadyText">
                    Elegí el dato del habilidad que querés filtrar.
                </div>
            </div>
        );
    }

    // Funcion principal que renderiza un Input de Filtro en base al Atributo seleccionado
    function renderFieldFilter()
    {
        if(!selectedFieldData)
        {
            return renderFieldNotReady();
        }

        const fieldKey = String(selectedFieldData?.field || "");

        switch(fieldKey)
        {
            // Datos Principales
            case "id":
                return renderIdFilter(); // ID
            case "generation":
                return renderGenerationFilter(); // Generacion
            case "display":
                return renderDisplayFilter(); // Nombre
            default:

                if(selectedFieldType === "boolean")
                {
                    return renderBooleanFieldFilter();
                }

                if(selectedFieldType === "text")
                {
                    return renderTextFieldFilter();
                }

                if(selectedFieldType === "enum")
                {
                    return renderEnumFieldFilter({
                        popperClassName: "filtroAvanzadoHabsComponent-fieldSelectPopper",
                        placeholder: "Filtrar opciones...",
                        ariaLabel: "Opciones",
                        renderOptionNode: renderTextEnumOptionNode
                    });
                }

                return renderPositiveIntegerFieldFilter();
        }
    }

    // Selecotr de Grupo para filtrar las Opciones de "Atributo"
    function renderFieldGroupKeyOptions({
        selectedGroupKey,
        openGroupKey,
        selectRef,
        onToggleOpen,
        onSelectGroupKey
    })
    {
        const currentGroupKey = String(selectedGroupKey || "all");
        const selectedGroupDescription = DESC_BY_GROUP_KEY[currentGroupKey] || DESC_BY_GROUP_KEY.all;

        return (
            <div
                className={"filtroAvanzadoHabsComponent-fieldGroupSelectPopper" + (openGroupKey ? " isOpen" : "")}
                ref={selectRef}
            >
                <button
                    type="button"
                    className={"filtroAvanzadoHabsComponent-fieldSelectButton filtroAvanzadoHabsComponent-fieldGroupSelectButton" + (openGroupKey ? " isOpen" : "")}
                    onClick={onToggleOpen}
                    aria-haspopup="listbox"
                    aria-expanded={openGroupKey}
                    aria-label={"Grupo de atributos: " + selectedGroupDescription}
                    title={selectedGroupDescription}
                >
                    <span className="filtroAvanzadoHabsComponent-fieldGroupSelectButtonText">
                        {selectedGroupDescription}
                    </span>
                    <span className={"filtroAvanzadoHabsComponent-fieldSelectCaret" + (openGroupKey ? " isOpen" : "")} aria-hidden="true">
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openGroupKey && (
                    <div className="filtroAvanzadoHabsComponent-fieldGroupSelectMenu" role="listbox" aria-label="Grupos de atributos">
                        <div className="filtroAvanzadoHabsComponent-fieldSelectMenuBody">
                            {FIELD_GROUP_OPTIONS.map(function(option)
                            {
                                const selected = option.key === currentGroupKey;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={"filtroAvanzadoHabsComponent-fieldSelectOption filtroAvanzadoHabsComponent-fieldGroupSelectOption" + (selected ? " selected" : "")}
                                        onClick={() => onSelectGroupKey(option.key)}
                                        role="option"
                                        aria-selected={selected}
                                        title={option.description}
                                    >
                                        <span className="filtroAvanzadoHabsComponent-fieldSelectOptionText">
                                            {option.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Selector de Campo a filtrar (Id, Nombre, Tipo, Clase, etc.)
    function renderFieldOptions()
    {
        const filteredFieldOptions = getFilteredFieldOptions();

        return (
            <div className="filtroAvanzadoHabsComponent-fieldSelectPopper filtroAvanzadoHabsComponent-fieldContainer" ref={fieldSelectRef}>
                <div className="filtroAvanzadoHabsComponent-fieldSelectTitle">
                    Atributo
                </div>

                {renderFieldGroupKeyOptions({
                    selectedGroupKey: selectedFieldGroupKey,
                    openGroupKey: openFieldGroupKey,
                    selectRef: fieldGroupSelectRef,
                    onToggleOpen: function()
                    {
                        setOpenFieldValue(false);
                        setOpenSortFieldValue(false);
                        setOpenSortFieldGroupKey(false);
                        setOpenFieldGroupKey(function(prev) { return !prev; });
                    },
                    onSelectGroupKey: handleSelectFieldGroupKey
                })}

                {renderOptionSearchInput({
                    searchKey: "field",
                    placeholder: "Filtrar atributos..."
                })}            

                <button
                    type="button"
                    className={"filtroAvanzadoHabsComponent-fieldSelectButton" + (openFieldValue ? " isOpen" : "")}
                    onClick={() =>
                    {
                        setOpenFieldGroupKey(false);
                        setOpenSortFieldGroupKey(false);
                        setOpenFieldValue(function(prev) { return !prev; });
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={openFieldValue}
                    title={selectedFieldData?.description || "Campo"}
                >
                    <span className="filtroAvanzadoHabsComponent-fieldSelectButtonText">
                        {selectedFieldData ? renderFieldOptionNode(selectedFieldData) : "Campo"}
                    </span>
                    <span className={"filtroAvanzadoHabsComponent-fieldSelectCaret" + (openFieldValue ? " isOpen" : "")} aria-hidden="true">
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openFieldValue && (
                    <div className="filtroAvanzadoHabsComponent-fieldSelectMenu" role="listbox" aria-label="Campos para filtrar">
                        <div className="filtroAvanzadoHabsComponent-fieldSelectMenuBody">
                            {filteredFieldOptions.length > 0 ? (
                                filteredFieldOptions.map(function(field)
                                {
                                    const fieldId = getAdvancedHabsFieldSelectionId(field);
                                    const selected = fieldId === selectedFieldValue;

                                    return (
                                        <button
                                            key={fieldId}
                                            type="button"
                                            className={"filtroAvanzadoHabsComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => handleSelectField(fieldId)}
                                            role="option"
                                            aria-selected={selected}
                                            title={field.description}
                                        >
                                            <span className="filtroAvanzadoHabsComponent-fieldSelectOptionText">
                                                {renderFieldOptionNode(field)}
                                            </span>
                                        </button>
                                    );
                                })
                            ) : renderEmptySearchResults()}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Filtro de Orden: Atributo + Asc o Dsc
    function renderSortFilter()
    {
        const sortDirectionLabel = selectedSortDirection === "asc" ? "Ascendente (De menor a mayor)" : "Descendente (De mayor a menor)";
        const SortDirectionIcon = selectedSortDirection === "asc" ? HiOutlineSortAscending : HiOutlineSortDescending;
        const filteredSortFieldOptions = getFilteredSortFieldOptions();
        const sortFieldLabel = String(selectedSortFieldData?.description || "ID");
        const sortDirectionKey = selectedSortDirection === "desc" ? "DESC" : "ASC";
        const sortDirectionText = selectedSortDirection === "desc" ? "De Mayor a Menor" : "De Menor a Mayor";
        const sortChipLabel = `${sortFieldLabel} ${sortDirectionKey} (${sortDirectionText})`;
        const sortChipLabelDirection = `${sortDirectionKey} (${sortDirectionText})`;

        return (
            <div className="filtroAvanzadoHabsComponent-sortFilterBlock">
                <div className="filtroAvanzadoHabsComponent-fieldSelectTitle">
                    Ordenar por
                </div>

                <div className="filtroAvanzadoHabsComponent-sortFilterSearchRow">
                  
                    {renderFieldGroupKeyOptions({
                        selectedGroupKey: selectedSortFieldGroupKey,
                        openGroupKey: openSortFieldGroupKey,
                        selectRef: sortFieldGroupSelectRef,
                        onToggleOpen: function()
                        {
                            setOpenSortFieldValue(false);
                            setOpenFieldValue(false);
                            setOpenFieldGroupKey(false);
                            setOpenSortFieldGroupKey(function(prev) { return !prev; });
                        },
                        onSelectGroupKey: handleSelectSortFieldGroupKey
                    })}

                    <button
                        type="button"
                        className="filtroAvanzadoHabsComponent-sortDirectionButton"
                        onClick={handleToggleSortDirection}
                        title={sortDirectionLabel}
                        aria-label={"Orden: " + sortDirectionLabel.toLowerCase()}
                    >
                        <SortDirectionIcon className="filtroAvanzadoHabsComponent-sortDirectionIcon" aria-hidden="true" />
                    </button>
                    
                </div>

                <div className="filtroAvanzadoHabsComponent-sortFilterControlsRow">

                    {renderOptionSearchInput({
                        searchKey: "sortField",
                        placeholder: "Filtrar atributos..."
                    })}        

                </div>

                <div className="filtroAvanzadoHabsComponent-sortFilterControlsRow">
                    <div className="filtroAvanzadoHabsComponent-fieldSelectPopper filtroAvanzadoHabsComponent-sortFieldSelectPopper" ref={sortFieldSelectRef}>
                        <button
                            type="button"
                            className={"filtroAvanzadoHabsComponent-fieldSelectButton filtroAvanzadoHabsComponent-sortFieldSelectButton" + (openSortFieldValue ? " isOpen" : "")}
                            onClick={() =>
                            {
                                setOpenSortFieldGroupKey(false);
                                setOpenFieldValue(false);
                                setOpenFieldGroupKey(false);
                                setOpenSortFieldValue(function(prev) { return !prev; });
                            }}
                            aria-haspopup="listbox"
                            aria-expanded={openSortFieldValue}
                            title={selectedSortFieldData?.description || "ID"}
                        >
                            <span className="filtroAvanzadoHabsComponent-fieldSelectButtonText">
                                {selectedSortFieldData ? renderFieldOptionNode(selectedSortFieldData) : "ID"}
                            </span>
                            <span className={"filtroAvanzadoHabsComponent-fieldSelectCaret" + (openSortFieldValue ? " isOpen" : "")} aria-hidden="true">
                                <RiArrowDownSFill />
                            </span>
                        </button>

                        {openSortFieldValue && (
                            <div className="filtroAvanzadoHabsComponent-fieldSelectMenu" role="listbox" aria-label="Campos para ordenar">
                                <div className="filtroAvanzadoHabsComponent-fieldSelectMenuBody">
                                    {filteredSortFieldOptions.length > 0 ? (
                                        filteredSortFieldOptions.map(function(field)
                                        {
                                            const fieldId = getAdvancedHabsFieldSelectionId(field);
                                            const selected = fieldId === selectedSortFieldValue;

                                            return (
                                                <button
                                                    key={fieldId}
                                                    type="button"
                                                    className={"filtroAvanzadoHabsComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                                    onClick={() => handleSelectSortField(fieldId)}
                                                    role="option"
                                                    aria-selected={selected}
                                                    title={field.description}
                                                >
                                                    <span className="filtroAvanzadoHabsComponent-fieldSelectOptionText">
                                                        {renderFieldOptionNode(field)}
                                                    </span>
                                                </button>
                                            );
                                        })
                                    ) : renderEmptySearchResults()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className="filtroAvanzadoHabsComponent-sortInfoChip filtroAvanzadoHabsComponent-sortInfoChipDirection filtroAvanzadoHabsComponent-sortInfoChipHasTooltip"
                    tabIndex={0}
                    aria-label={"Ordenamiento: " + sortChipLabel}
                >
                    {sortChipLabelDirection}

                    <div className="filtroAvanzadoHabsComponent-sortInfoChipTooltip" role="tooltip">
                        {"Ordenamiento: " + sortChipLabel}
                    </div>
                </div>
            </div>
        );
    }

    // Funcion que renderiza los chips de filtros aplicados
    function renderAppliedFiltersChips()
    {
        const hasAppliedFilters = Array.isArray(appliedFilters) && appliedFilters.length > 0;

        return (
            <div className="filtroAvanzadoHabsComponent-appliedFiltersBlock">
                <div className="filtroAvanzadoHabsComponent-appliedFiltersHeader">
                    <span>Filtros añadidos</span>

                    <button
                        type="button"
                        className="filtroAvanzadoHabsComponent-clearChipsButton"
                        onClick={() => setAppliedFilters([])}
                        disabled={!hasAppliedFilters}
                        title={hasAppliedFilters ? "Limpiar todos los chips" : "No hay chips para limpiar"}
                        aria-label={hasAppliedFilters ? "Limpiar todos los chips" : "No hay chips para limpiar"}
                    >
                        Limpiar todos
                    </button>
                </div>

                {hasAppliedFilters ? (
                    <div className="filtroAvanzadoHabsComponent-appliedFiltersList">
                        {appliedFilters.map(function(filter)
                        {
                            const filterId = String(filter?.id || "");
                            const filterFieldLabel = String(filter?.fieldLabel || filter?.description || filter?.field || "");
                            const filterOperatorLabel = String(filter?.operatorSymbol || filter?.operatorLabel || filter?.operator || "");
                            const filterOperatorTitleLabel = String(filter?.operatorLabel || filter?.operatorSymbol || filter?.operator || "");
                            const filterValueLabel = String(filter?.valueLabel || filter?.value || "");
                            const filterField = String(filter?.field || "");
                            const isGenerationFilter = filterField === "generation";
                            const filterSchemaData = filtersSchema.find(function(field)
                            {
                                return String(field?.field || "") === filterField;
                            }) || null;
                            const filterOptions = Array.isArray(filterSchemaData?.options) ? filterSchemaData.options : [];
                            const selectedFilterOption = filterOptions.find(function(option)
                            {
                                return getOptionValueKey(option) === String(filter?.value ?? "");
                            });
                            const generationIconRoute = isGenerationFilter ? String(selectedFilterOption?.iconRoute || "") : "";

                            return (
                                <div
                                    key={filterId}
                                    className="filtroAvanzadoHabsComponent-filterChip"
                                    title={
                                        `${filterFieldLabel} ` +
                                        `${filterOperatorTitleLabel} ` +
                                        `${filterValueLabel}`
                                    }
                                >
                                    <span className="filtroAvanzadoHabsComponent-filterChipContent">
                                        <span className="filtroAvanzadoHabsComponent-filterChipField">
                                            {filterFieldLabel}
                                        </span>

                                        <span className="filtroAvanzadoHabsComponent-filterChipOperator">
                                            {filterOperatorLabel}
                                        </span>

                                        <span
                                            className={
                                                "filtroAvanzadoHabsComponent-filterChipValue" +
                                                (isGenerationFilter ? " filtroAvanzadoHabsComponent-filterChipValueGeneration" : "")
                                            }
                                        >
                                            {isGenerationFilter ? (
                                                <span className="filtroAvanzadoHabsComponent-filterChipGenerationNode">
                                                    
                                                    {generationIconRoute ? (
                                                        <img
                                                            src={generationIconRoute}
                                                            alt={filterValueLabel || "Generación"}
                                                            className="filtroAvanzadoHabsComponent-filterChipGenerationIcon"
                                                        />
                                                    ) : null}
                                                    
                                                    <span className="filtroAvanzadoHabsComponent-filterChipGenerationText">
                                                        {filterValueLabel}
                                                    </span>

                                                </span>
                                            ) : (
                                                filterValueLabel
                                            )}
                                        </span>
                                    </span>

                                    <button
                                        type="button"
                                        className="filtroAvanzadoHabsComponent-filterChipRemove"
                                        onClick={() => removeAppliedFilter(filterId)}
                                        aria-label={"Quitar filtro " + filterFieldLabel}
                                        title="Quitar filtro"
                                    >
                                        <FiX className="filtroAvanzadoHabsComponent-filterChipRemoveIcon" aria-hidden="true" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="filtroAvanzadoHabsComponent-appliedFiltersList filtroAvanzadoHabsComponent-NoChips">
                        <span>Ninguno</span>
                    </div>
                )}
            </div>
        );
    }

    // Funcion Reutilizable que retorna los botones finales de aplicar y limpiar filtros
    function renderApplyClearFilterActions()
    {
        return (
            <div className="filtroAvanzadoHabsComponent-FilterActions filtroAvanzadoHabsComponent-ApplyClearActions">
                <button
                    type="button"
                    className="filtroAvanzadoHabsComponent-ActionFilterApply"
                    onClick={handleApplyFilters}
                    disabled={(!Array.isArray(appliedFilters) || appliedFilters.length === 0) && !hasSortChanged}
                    title="Aplicar filtros"
                    aria-label="Aplicar filtros"
                >
                    Aplicar filtros
                </button>

                <button
                    type="button"
                    className="filtroAvanzadoHabsComponent-ActionFilterClear"
                    onClick={handleClearFilters}
                    title="Limpiar filtros"
                    aria-label="Limpiar filtros"
                >
                    Limpiar filtros
                </button>
            </div>
        );
    }

    // Filtro Lateral 
    const drawerContent = (
        <div
            className="filtroAvanzadoHabsComponent-backdrop"
            onClick={closeDrawer}
            role="presentation"
        >

            {/* Overlay */}
            <div
                className={"filtroAvanzadoHabsComponent-overlay" + (open ? " open" : "")}
                aria-hidden="true"
            />

            {/* Panel lateral */}
            <aside
                className={"filtroAvanzadoHabsComponent-drawer" + (open ? " open" : "")}
                aria-label="Filtros avanzados de habilidades"
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* Parte Arriba: Titulo + Total Filtrados + Boton cerrar Filtro */}
                <div className="filtroAvanzadoHabsComponent-drawerHeader">
                    
                    {/* Titulo + Total Filtrados */}
                    <div className="filtroAvanzadoHabsComponent-drawerHeaderText">
                        <span className="filtroAvanzadoHabsComponent-drawerTitle">Filtro Avanzado Habilidades</span>
                        <span className="filtroAvanzadoHabsComponent-drawerSubtitle">
                            {formatNumberWithDots(displayTotalItems)} {Number(displayTotalItems) === 1 ? "habilidad encontrada" : "habilidades encontradas"}
                        </span>
                    </div>

                    {/* Boton cerrar Filtro */}
                    <button
                        type="button"
                        className="filtroAvanzadoHabsComponent-close"
                        onClick={closeDrawer}
                        aria-label="Cerrar filtros"
                        title="Cerrar filtros"
                    >
                        <FiX className="filtroAvanzadoHabsComponent-closeIcon" aria-hidden="true" />
                    </button>

                </div>

                {/* Parte Abajo */}
                <div className="filtroAvanzadoHabsComponent-drawerBody">
                    
                    {!ready ? (
                        <LoadingPkm
                            inline={true}
                            classNameLoadingConatainer={"filtroAvanzadoHabsComponent-loadingContainer"}
                            classNameLoadingText={"filtroAvanzadoHabsComponent-loadingText"}
                            classNameLoadingIcon={"filtroAvanzadoHabsComponent-loadingIcon"}
                            text={"Cargando Filtros..."}
                        />
                    ) : (
                        <div className="filtroAvanzadoHabsComponent-filtersContent">
                            <div className="filtroAvanzadoHabsComponent-schemaList">
                                
                                {/* Filtro de Orden */}
                                {renderSortFilter()}
                                
                                {/* Atributo a Filtrar */}
                                {renderFieldOptions()}
                                
                                {/* Bloque de Filtro Dinamico */}
                                {renderFieldFilter()}
                                
                                {/* Filtros Aplicados */}
                                {renderAppliedFiltersChips()}
                                
                                {/* Acciones Finales */}
                                {renderApplyClearFilterActions()}

                            </div>
                        </div>
                    )}

                </div>
                
            </aside>

        </div>
    );

    return (
        <div className="filtroAvanzadoHabsComponent">
            
            {/* Boton abrir filtro */}
            <button
                type="button"
                className="filtroAvanzadoHabsComponent-toggle"
                onClick={openDrawer}
                aria-label="Abrir filtros avanzados"
                aria-expanded={open}
                title="Abrir filtros avanzados"
            >
                <span className="filtroAvanzadoHabsComponent-toggleText">Filtros</span>
                <FaFilter className="filtroAvanzadoHabsComponent-toggleIcon" aria-hidden="true" />
            </button>

            {/* Filtro Lateral */}
            {open && portalTarget ? createPortal(drawerContent, portalTarget) : null}

        </div>
    );
    
}