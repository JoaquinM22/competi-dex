//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoPkmComponents\FiltroAvanzadoPkm\FiltroAvanzadoPkm.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { RiArrowDownSFill } from "react-icons/ri";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { formatNumberWithDots } from "../../../../utils/competidexMeta";
import { useFiltroPkm } from "../../FiltroPkmProvider";
import {
    ADVANCED_PKM_BOUNDED_TEXT_FILTER_OPERATORS,
    ADVANCED_PKM_DEFAULT_SORT_DIRECTION,
    ADVANCED_PKM_DEFAULT_SORT_FIELD,
    ADVANCED_PKM_NUMBER_FILTER_OPERATORS,
    ADVANCED_PKM_TEXT_FILTER_OPERATORS,
    applyAdvancedPkmFiltersChain,
    getAdvancedPkmFieldSelectionId,
    getAdvancedPkmSortFieldData,
    getAdvancedPkmSortFieldValue,
    getAdvancedPkmValueByPath,
    hydrateAdvancedPkmFilters,
    normalizeAdvancedPkmText,
    sortAdvancedPkmItems
} from "../competidexAdvancedPkmFilters";
import { hasCachedImage, preloadCachedImage } from "../../../../utils/competidexImgCache";
import LoadingPkm from "../../../SharedComponents/LoadingPkm/LoadingPkm";
import Tipo from "../../../SharedComponents/Tipo/Tipo";
import "./FiltroAvanzadoPkm.css";

// Funcion Auxiliar para opciones de "Color"
function getColorDotBorder(color)
{
    const normalized = String(color || "").trim().toUpperCase();

    // Si es color blanco o amarillo, el borde es negro
    if(normalized === "#FFFFFF" || normalized === "#FFD700")
    {
        return "#000000";
    }

    // Por default blanco para todos
    return "#ffffff";
}

// Opciones de Operadores Numericos
const NUMBER_FILTER_OPERATORS = ADVANCED_PKM_NUMBER_FILTER_OPERATORS;

// Opciones de Operadores de Texto
const TEXT_FILTER_OPERATORS = ADVANCED_PKM_TEXT_FILTER_OPERATORS;

// Opciones de Operadores de Texto acotado
const BOUNDED_TEXT_FILTER_OPERATORS = ADVANCED_PKM_BOUNDED_TEXT_FILTER_OPERATORS;

const DEFAULT_SORT_FIELD = ADVANCED_PKM_DEFAULT_SORT_FIELD;
const DEFAULT_SORT_DIRECTION = ADVANCED_PKM_DEFAULT_SORT_DIRECTION;

const DESC_BY_GROUP_KEY = {
    all: "Todos",
    principalData: "Datos Principales",
    secondaryData: "Datos Secundarios",
    statsData: "Características",
    crianzaData: "Crianza"
};

const FIELD_GROUP_OPTIONS = Object.keys(DESC_BY_GROUP_KEY).map(function(groupKey)
{
    return {
        key: groupKey,
        description: DESC_BY_GROUP_KEY[groupKey]
    };
});

export default function FiltroAvanzadoPkm({
    items = [],
    totalItems = null,
    initialFilters = [],
    initialSort = null,
    onApplyFilters = null,
    onClearFilters = null
})
{
    const { filtersSchema = [], ready } = useFiltroPkm();

    // Tarjeta de Filtros
    const [open, setOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([]);

    // Operador Numerico
    const [openNumberOperator, setOpenNumberOperator] = useState(false);
    const [selectedNumberOperator, setSelectedNumberOperator] = useState("eq");
    const [numberInputValue, setNumberInputValue] = useState("");
    const [numberFloatInputValue, setNumberFloatInputValue] = useState("");

    // Operador de Texto
    const [openTextOperator, setOpenTextOperator] = useState(false);
    const [selectedTextOperator, setSelectedTextOperator] = useState("contains");

    // Campo "Atributo" a Filtrar (ID, Tipos, Etc)
    const [openFieldValue, setOpenFieldValue] = useState(false);
    const [openFieldGroupKey, setOpenFieldGroupKey] = useState(false);
    const [selectedFieldGroupKey, setSelectedFieldGroupKey] = useState("all");
    const [selectedFieldValue, setSelectedFieldValue] = useState("");

    // Campo para ordenar Pokemon
    const [openSortFieldValue, setOpenSortFieldValue] = useState(false);
    const [openSortFieldGroupKey, setOpenSortFieldGroupKey] = useState(false);
    const [selectedSortFieldGroupKey, setSelectedSortFieldGroupKey] = useState("all");
    const [selectedSortFieldValue, setSelectedSortFieldValue] = useState(DEFAULT_SORT_FIELD);
    const [selectedSortDirection, setSelectedSortDirection] = useState(DEFAULT_SORT_DIRECTION);
    const [appliedSortFieldValue, setAppliedSortFieldValue] = useState(DEFAULT_SORT_FIELD);
    const [appliedSortDirection, setAppliedSortDirection] = useState(DEFAULT_SORT_DIRECTION);

    // Atributo "Nombre"
    const [openDisplayOperator, setOpenDisplayOperator] = useState(false);
    const [selectedDisplayOperator, setSelectedDisplayOperator] = useState("contains");
    const [displayTextInputValue, setDisplayTextInputValue] = useState("");

    // Atributo "Generacion"
    const [openGenerationOperator, setOpenGenerationOperator] = useState(false);
    const [openGenerationValue, setOpenGenerationValue] = useState(false);
    const [selectedGenerationOperator, setSelectedGenerationOperator] = useState("eq");
    const [selectedGenerationValue, setSelectedGenerationValue] = useState("");

    // Atributo  "Tipo"
    const [openTypeValue, setOpenTypeValue] = useState(false);
    const [selectedTypeValue, setSelectedTypeValue] = useState("");

    // Atributo "Grupo Huevo"
    const [openEggGroupsValue, setOpenEggGroupsValue] = useState(false);
    const [selectedEggGroupsValue, setSelectedEggGroupsValue] = useState("");

    // Atributo "Color"
    const [openColorOperator, setOpenColorOperator] = useState(false);
    const [openColorValue, setOpenColorValue] = useState(false);
    const [selectedColorOperator, setSelectedColorOperator] = useState("eq");
    const [selectedColorValue, setSelectedColorValue] = useState("");

    // Atributo "Categoria"
    const [openCategoryOperator, setOpenCategoryOperator] = useState(false);
    const [openCategoryValue, setOpenCategoryValue] = useState(false);
    const [selectedCategoryOperator, setSelectedCategoryOperator] = useState("eq");
    const [selectedCategoryValue, setSelectedCategoryValue] = useState("");

    // Atributo "Sin Sexo"
    const [openSinSexoOperator, setOpenSinSexoOperator] = useState(false);
    const [openSinSexoValue, setOpenSinSexoValue] = useState(false);
    const [selectedSinSexoOperator, setSelectedSinSexoOperator] = useState("eq");
    const [selectedSinSexoValue, setSelectedSinSexoValue] = useState("true");

    // Atributo "Puede Criar"
    const [openPuedeCriarOperator, setOpenPuedeCriarOperator] = useState(false);
    const [openPuedeCriarValue, setOpenPuedeCriarValue] = useState(false);
    const [selectedPuedeCriarOperator, setSelectedPuedeCriarOperator] = useState("eq");
    const [selectedPuedeCriarValue, setSelectedPuedeCriarValue] = useState("true");

    // Atributo "Posee Megas"
    const [openHasMegaFormsOperator, setOpenHasMegaFormsOperator] = useState(false);
    const [openHasMegaFormsValue, setOpenHasMegaFormsValue] = useState(false);
    const [selectedHasMegaFormsOperator, setSelectedHasMegaFormsOperator] = useState("eq");
    const [selectedHasMegaFormsValue, setSelectedHasMegaFormsValue] = useState("true");

    // Atributo "Posee Gigamax"
    const [openHasGigaFormOperator, setOpenHasGigaFormOperator] = useState(false);
    const [openHasGigaFormValue, setOpenHasGigaFormValue] = useState(false);
    const [selectedHasGigaFormOperator, setSelectedHasGigaFormOperator] = useState("eq");
    const [selectedHasGigaFormValue, setSelectedHasGigaFormValue] = useState("true");

    // Atributo "Es Pokemon bebe"
    const [openIsBabyPkmOperator, setOpenIsBabyPkmOperator] = useState(false);
    const [openIsBabyPkmValue, setOpenIsBabyPkmValue] = useState(false);
    const [selectedIsBabyPkmOperator, setSelectedIsBabyPkmOperator] = useState("eq");
    const [selectedIsBabyPkmValue, setSelectedIsBabyPkmValue] = useState("true");

    // Atributo "Es Pokemon mitico/singular"
    const [openIsMythicalPkmOperator, setOpenIsMythicalPkmOperator] = useState(false);
    const [openIsMythicalPkmValue, setOpenIsMythicalPkmValue] = useState(false);
    const [selectedIsMythicalPkmOperator, setSelectedIsMythicalPkmOperator] = useState("eq");
    const [selectedIsMythicalPkmValue, setSelectedIsMythicalPkmValue] = useState("true");

    // Atributo "Es Pokemon legendario"
    const [openIsLegendaryPkmOperator, setOpenIsLegendaryPkmOperator] = useState(false);
    const [openIsLegendaryPkmValue, setOpenIsLegendaryPkmValue] = useState(false);
    const [selectedIsLegendaryPkmOperator, setSelectedIsLegendaryPkmOperator] = useState("eq");
    const [selectedIsLegendaryPkmValue, setSelectedIsLegendaryPkmValue] = useState("true");

    // Atributo "Es Mega Evolucion"
    const [openIsMegaFormOperator, setOpenIsMegaFormOperator] = useState(false);
    const [openIsMegaFormValue, setOpenIsMegaFormValue] = useState(false);
    const [selectedIsMegaFormOperator, setSelectedIsMegaFormOperator] = useState("eq");
    const [selectedIsMegaFormValue, setSelectedIsMegaFormValue] = useState("true");

    // Atributo "Es Forma Gigamax"
    const [openIsGigaFormOperator, setOpenIsGigaFormOperator] = useState(false);
    const [openIsGigaFormValue, setOpenIsGigaFormValue] = useState(false);
    const [selectedIsGigaFormOperator, setSelectedIsGigaFormOperator] = useState("eq");
    const [selectedIsGigaFormValue, setSelectedIsGigaFormValue] = useState("true");

    const filterChipIdRef = useRef(0);

    // Tipo de Habilidad Seleccionada (Por default: Todas) y Valor Seleccionado
    const [openAbilityScope, setOpenAbilityScope] = useState(false);
    const [openAbilityValue, setOpenAbilityValue] = useState(false);
    const [selectedAbilityScope, setSelectedAbilityScope] = useState("all");
    const [selectedAbilityValue, setSelectedAbilityValue] = useState("");

    // Keys de Campos con Input para filtrar
    const [optionSearchValues, setOptionSearchValues] = useState({
        field: "",
        sortField: "",
        generation: "",
        types: "",
        color: "",
        abilities: "",
        eggGroups: "",
        category: ""
    });

    // Campo Numerico elegido
    const numberSelectRef = useRef(null); 
    
    // Campo de Texto elegido
    const textSelectRef = useRef(null);

    // Campo "Atributo" elegido
    const fieldSelectRef = useRef(null);
    const fieldGroupSelectRef = useRef(null);

    // Campo "Ordenar por" elegido
    const sortFieldSelectRef = useRef(null);
    const sortFieldGroupSelectRef = useRef(null);
    
    // Campo "Nombre" elegido
    const displaySelectRef = useRef(null);
    
    // Campo "Generacion" elegido
    const generationSelectRef = useRef(null); 
    const generationValueSelectRef = useRef(null); 

    // Campo "Tipo" elegido
    const typeValueSelectRef = useRef(null);

    // Campo "Grupo Huevo" elegido
    const eggGroupsValueSelectRef = useRef(null);
    
    // Campo "Color" elegido
    const colorSelectRef = useRef(null); 
    const colorValueSelectRef = useRef(null); 
    
    // Campo "Categoria" elegido
    const categorySelectRef = useRef(null);
    const categoryValueSelectRef = useRef(null);
    
    // Campo "Sin Sexo" elegido
    const sinSexoSelectRef = useRef(null);
    const sinSexoValueSelectRef = useRef(null);
    
    // Campo "Puede Criar" elegido
    const puedeCriarSelectRef = useRef(null);
    const puedeCriarValueSelectRef = useRef(null);
    
    // Campo "Posee Megas" elegido
    const hasMegaFormsSelectRef = useRef(null);
    const hasMegaFormsValueSelectRef = useRef(null);

    // Campo "Posee Gigamax" elegido
    const hasGigaFormSelectRef = useRef(null);
    const hasGigaFormValueSelectRef = useRef(null);

    // Campos booleanos especiales elegidos
    const isBabyPkmSelectRef = useRef(null);
    const isBabyPkmValueSelectRef = useRef(null);
    const isMythicalPkmSelectRef = useRef(null);
    const isMythicalPkmValueSelectRef = useRef(null);
    const isLegendaryPkmSelectRef = useRef(null);
    const isLegendaryPkmValueSelectRef = useRef(null);
    const isMegaFormSelectRef = useRef(null);
    const isMegaFormValueSelectRef = useRef(null);
    const isGigaFormSelectRef = useRef(null);
    const isGigaFormValueSelectRef = useRef(null);

    // Campo "Habilidad" elegido
    const abilityScopeSelectRef = useRef(null);
    const abilityValueSelectRef = useRef(null);

    // El Filtro pegado al Lista Paginada
    const portalTarget = useMemo(() =>
    {
        if(typeof document === "undefined") return null;

        return document.getElementById("contenedorFiltroPkmAvanzado");

    }, [open]);

    // Total de Pokemon de items
    const itemsCount = useMemo(() =>
    {
        return Array.isArray(items) ? items.length : 0;

    }, [items]);

    // Total de Pokemon filtrados
    const displayTotalItems = useMemo(() =>
    {
        const rawTotalItems = Number(totalItems);
        if(Number.isFinite(rawTotalItems))
        {
            return rawTotalItems;
        }

        return itemsCount;

    }, [totalItems, itemsCount]);

    useEffect(() =>
    {
        if(!Array.isArray(filtersSchema) || filtersSchema.length === 0) return;

        const iconRoutes = new Set();

        filtersSchema.forEach(function(field)
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

    }, [filtersSchema]);

    useEffect(() =>
    {
        function onKeyDown(e)
        {
            if(e.key === "Escape")
            {
                setOpen(false);
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

    useEffect(() =>
    {
        if(typeof window === "undefined" || typeof document === "undefined") return;

        const hasOpenSelect =
            openNumberOperator ||
            openTextOperator ||
            openFieldValue ||
            openFieldGroupKey ||
            openSortFieldValue ||
            openSortFieldGroupKey ||
            openDisplayOperator ||
            openGenerationOperator ||
            openGenerationValue ||
            openTypeValue ||
            openEggGroupsValue ||
            openColorOperator ||
            openColorValue ||
            openCategoryOperator ||
            openCategoryValue ||
            openSinSexoOperator ||
            openSinSexoValue ||
            openPuedeCriarOperator ||
            openPuedeCriarValue ||
            openHasMegaFormsOperator ||
            openHasMegaFormsValue ||
            openHasGigaFormOperator ||
            openHasGigaFormValue ||
            openIsBabyPkmOperator ||
            openIsBabyPkmValue ||
            openIsMythicalPkmOperator ||
            openIsMythicalPkmValue ||
            openIsLegendaryPkmOperator ||
            openIsLegendaryPkmValue ||
            openIsMegaFormOperator ||
            openIsMegaFormValue ||
            openIsGigaFormOperator ||
            openIsGigaFormValue ||
            openAbilityScope ||
            openAbilityValue;

        if(!hasOpenSelect) return;

        const animationFrameId = window.requestAnimationFrame(function()
        {
            const menuBodies = document.querySelectorAll(
                ".filtroAvanzadoPkmComponent-fieldSelectMenuBody, .filtroAvanzadoPkmComponent-numberSelectMenu"
            );

            menuBodies.forEach(function(menuBody)
            {
                const selectedOption = menuBody.querySelector(
                    ".filtroAvanzadoPkmComponent-fieldSelectOption.selected, .filtroAvanzadoPkmComponent-numberSelectOption.selected"
                );

                if(!selectedOption) return;

                menuBody.scrollTop = selectedOption.offsetTop - menuBody.offsetTop;
            });
        });

        return function()
        {
            window.cancelAnimationFrame(animationFrameId);
        };

    }, [
        openNumberOperator,
        openTextOperator,
        openFieldValue,
        openFieldGroupKey,
        openSortFieldValue,
        openSortFieldGroupKey,
        openDisplayOperator,
        openGenerationOperator,
        openGenerationValue,
        openTypeValue,
        openEggGroupsValue,
        openColorOperator,
        openColorValue,
        openCategoryOperator,
        openCategoryValue,
        openSinSexoOperator,
        openSinSexoValue,
        openPuedeCriarOperator,
        openPuedeCriarValue,
        openHasMegaFormsOperator,
        openHasMegaFormsValue,
        openHasGigaFormOperator,
        openHasGigaFormValue,
        openIsBabyPkmOperator,
        openIsBabyPkmValue,
        openIsMythicalPkmOperator,
        openIsMythicalPkmValue,
        openIsLegendaryPkmOperator,
        openIsLegendaryPkmValue,
        openIsMegaFormOperator,
        openIsMegaFormValue,
        openIsGigaFormOperator,
        openIsGigaFormValue,
        openAbilityScope,
        openAbilityValue
    ]);

    useEffect(() =>
    {
        if(!Array.isArray(filtersSchema) || filtersSchema.length === 0) return;

        const hydratedFilters = hydrateAdvancedPkmFilters(initialFilters, filtersSchema);

        filterChipIdRef.current = hydratedFilters.length;
        setAppliedFilters(hydratedFilters.map(function(filter, index)
        {
            return {
                ...filter,
                id: filter.id || `filter-chip-${index + 1}`
            };
        }));

        const nextSortField = String(initialSort?.field || DEFAULT_SORT_FIELD);
        const nextSortDirection = String(initialSort?.direction || DEFAULT_SORT_DIRECTION).toLowerCase() === "desc"
            ? "desc"
            : "asc";
        const nextSortFieldData = getAdvancedPkmSortFieldData(filtersSchema, nextSortField);
        const nextSortFieldValue = nextSortFieldData
            ? getFieldSelectionId(nextSortFieldData)
            : DEFAULT_SORT_FIELD;

        setSelectedSortFieldValue(nextSortFieldValue);
        setSelectedSortDirection(nextSortDirection);
        setAppliedSortFieldValue(nextSortFieldValue);
        setAppliedSortDirection(nextSortDirection);

    }, [filtersSchema, initialFilters, initialSort]);

    useEffect(() =>
    {
        // Funcion auxiliar para cerrar todos los desplegables al sacar el foco
        function handleGlobalPointerDown(event)
        {
            const target = event.target;

            // Operador "Numerico"
            if(openNumberOperator && numberSelectRef.current && !numberSelectRef.current.contains(target))
            {
                setOpenNumberOperator(false);
            }


            // Operador de "Texto"
            if(openTextOperator && textSelectRef.current && !textSelectRef.current.contains(target))
            {
                setOpenTextOperator(false);
            }


            // Opcion de "Atributo"
            if(openFieldValue && fieldSelectRef.current && !fieldSelectRef.current.contains(target))
            {
                setOpenFieldValue(false);
            }

            // Grupo de "Atributo"
            if(openFieldGroupKey && fieldGroupSelectRef.current && !fieldGroupSelectRef.current.contains(target))
            {
                setOpenFieldGroupKey(false);
            }

            // Opcion de "Ordenar por"
            if(openSortFieldValue && sortFieldSelectRef.current && !sortFieldSelectRef.current.contains(target))
            {
                setOpenSortFieldValue(false);
            }

            // Grupo de "Ordenar por"
            if(openSortFieldGroupKey && sortFieldGroupSelectRef.current && !sortFieldGroupSelectRef.current.contains(target))
            {
                setOpenSortFieldGroupKey(false);
            }


            // Operador de "Nombre"
            if(openDisplayOperator && displaySelectRef.current && !displaySelectRef.current.contains(target))
            {
                setOpenDisplayOperator(false);
            }


            // Operador y Valor de "Generacion"
            if(openGenerationOperator && generationSelectRef.current && !generationSelectRef.current.contains(target))
            {
                setOpenGenerationOperator(false);
            }

            if(openGenerationValue && generationValueSelectRef.current && !generationValueSelectRef.current.contains(target))
            {
                setOpenGenerationValue(false);
            }


            // Opcion de "Tipo"
            if(openTypeValue && typeValueSelectRef.current && !typeValueSelectRef.current.contains(target))
            {
                setOpenTypeValue(false);
            }


            // Valor de "Grupo Huevo"
            if(openEggGroupsValue && eggGroupsValueSelectRef.current && !eggGroupsValueSelectRef.current.contains(target))
            {
                setOpenEggGroupsValue(false);
            }


            // Operador y Valor de "Color"
            if(openColorOperator && colorSelectRef.current && !colorSelectRef.current.contains(target))
            {
                setOpenColorOperator(false);
            }

            if(openColorValue && colorValueSelectRef.current && !colorValueSelectRef.current.contains(target))
            {
                setOpenColorValue(false);
            }


            // Operador y Valor de "Categoria"
            if(openCategoryOperator && categorySelectRef.current && !categorySelectRef.current.contains(target))
            {
                setOpenCategoryOperator(false);
            }

            if(openCategoryValue && categoryValueSelectRef.current && !categoryValueSelectRef.current.contains(target))
            {
                setOpenCategoryValue(false);
            }

            
            // Operador y Valor de "Sin Sexo"
            if(openSinSexoOperator && sinSexoSelectRef.current && !sinSexoSelectRef.current.contains(target))
            {
                setOpenSinSexoOperator(false);
            }

            if(openSinSexoValue && sinSexoValueSelectRef.current && !sinSexoValueSelectRef.current.contains(target))
            {
                setOpenSinSexoValue(false);
            }


            // Operador y Valor de "Puede Criar"
            if(openPuedeCriarOperator && puedeCriarSelectRef.current && !puedeCriarSelectRef.current.contains(target))
            {
                setOpenPuedeCriarOperator(false);
            }

            if(openPuedeCriarValue && puedeCriarValueSelectRef.current && !puedeCriarValueSelectRef.current.contains(target))
            {
                setOpenPuedeCriarValue(false);
            }


            // Operador y Valor de "Posee Megas"
            if(openHasMegaFormsOperator && hasMegaFormsSelectRef.current && !hasMegaFormsSelectRef.current.contains(target))
            {
                setOpenHasMegaFormsOperator(false);
            }

            if(openHasMegaFormsValue && hasMegaFormsValueSelectRef.current && !hasMegaFormsValueSelectRef.current.contains(target))
            {
                setOpenHasMegaFormsValue(false);
            }


            // Operador y Valor de "Posee Gigamax"
            if(openHasGigaFormOperator && hasGigaFormSelectRef.current && !hasGigaFormSelectRef.current.contains(target))
            {
                setOpenHasGigaFormOperator(false);
            }

            if(openHasGigaFormValue && hasGigaFormValueSelectRef.current && !hasGigaFormValueSelectRef.current.contains(target))
            {
                setOpenHasGigaFormValue(false);
            }


            // Operador y Valor de "Es Pokemon Bebe"
            if(openIsBabyPkmOperator && isBabyPkmSelectRef.current && !isBabyPkmSelectRef.current.contains(target))
            {
                setOpenIsBabyPkmOperator(false);
            }

            if(openIsBabyPkmValue && isBabyPkmValueSelectRef.current && !isBabyPkmValueSelectRef.current.contains(target))
            {
                setOpenIsBabyPkmValue(false);
            }


            // Operador y Valor de "Es Pokemon Mitico/Singular"
            if(openIsMythicalPkmOperator && isMythicalPkmSelectRef.current && !isMythicalPkmSelectRef.current.contains(target))
            {
                setOpenIsMythicalPkmOperator(false);
            }

            if(openIsMythicalPkmValue && isMythicalPkmValueSelectRef.current && !isMythicalPkmValueSelectRef.current.contains(target))
            {
                setOpenIsMythicalPkmValue(false);
            }


            // Operador y Valor de "Es Pokemon Legendario"
            if(openIsLegendaryPkmOperator && isLegendaryPkmSelectRef.current && !isLegendaryPkmSelectRef.current.contains(target))
            {
                setOpenIsLegendaryPkmOperator(false);
            }

            if(openIsLegendaryPkmValue && isLegendaryPkmValueSelectRef.current && !isLegendaryPkmValueSelectRef.current.contains(target))
            {
                setOpenIsLegendaryPkmValue(false);
            }


            // Operador y Valor de "Es Mega Evolucion"
            if(openIsMegaFormOperator && isMegaFormSelectRef.current && !isMegaFormSelectRef.current.contains(target))
            {
                setOpenIsMegaFormOperator(false);
            }

            if(openIsMegaFormValue && isMegaFormValueSelectRef.current && !isMegaFormValueSelectRef.current.contains(target))
            {
                setOpenIsMegaFormValue(false);
            }


            // Operador y Valor de "Es Forma Gigamax"
            if(openIsGigaFormOperator && isGigaFormSelectRef.current && !isGigaFormSelectRef.current.contains(target))
            {
                setOpenIsGigaFormOperator(false);
            }

            if(openIsGigaFormValue && isGigaFormValueSelectRef.current && !isGigaFormValueSelectRef.current.contains(target))
            {
                setOpenIsGigaFormValue(false);
            }


            // "Habilidad"
            if(openAbilityScope && abilityScopeSelectRef.current && !abilityScopeSelectRef.current.contains(target))
            {
                setOpenAbilityScope(false);
            }

            if(openAbilityValue && abilityValueSelectRef.current && !abilityValueSelectRef.current.contains(target))
            {
                setOpenAbilityValue(false);
            }

        }

        if(
            openNumberOperator || // Opciones Operadores "Numericos"
            openTextOperator || // Opciones Operadores de "Texto"
            openFieldValue || // Opcion de "Atributo"
            openFieldGroupKey || // Grupo de "Atributo"
            openSortFieldValue || // Opcion de "Ordenar por"
            openSortFieldGroupKey || // Grupo de "Ordenar por"
            openDisplayOperator || // Opciones Operadores de "Nombre"
            openGenerationOperator || openGenerationValue || // Operador y Valor de "Generacion"
            openTypeValue || // Opcion de "Tipo"
            openEggGroupsValue || // Opcion de "Grupo Huevo"
            openColorOperator || openColorValue || // Operador y Valor de "Color"
            openCategoryOperator || openCategoryValue || // Operador y Valor de "Categoria"
            openSinSexoOperator || openSinSexoValue || // Operador y Valor de "Sin Sexo"
            openPuedeCriarOperator || openPuedeCriarValue || // Operador y Valor de "Puede Criar"
            openHasMegaFormsOperator || openHasMegaFormsValue || // Operador y Valor de "Posee Megas"
            openHasGigaFormOperator || openHasGigaFormValue || // Operador y Valor de "Posee Gigamax"
            openIsBabyPkmOperator || openIsBabyPkmValue || // Operador y Valor de "Es Pokemon bebe"
            openIsMythicalPkmOperator || openIsMythicalPkmValue || // Operador y Valor de "Es Pokemon mitico/singular"
            openIsLegendaryPkmOperator || openIsLegendaryPkmValue || // Operador y Valor de "Es Pokemon legendario"
            openIsMegaFormOperator || openIsMegaFormValue || // Operador y Valor de "Es Mega Evolucion"
            openIsGigaFormOperator || openIsGigaFormValue || // Operador y Valor de "Es Forma Gigamax"
            openAbilityScope || openAbilityValue // Operador y Valor de "Habilidad"
        )
        {
            document.addEventListener("mousedown", handleGlobalPointerDown);
            document.addEventListener("touchstart", handleGlobalPointerDown);
        }

        return function()
        {
            document.removeEventListener("mousedown", handleGlobalPointerDown);
            document.removeEventListener("touchstart", handleGlobalPointerDown);
        };

    }, [

        openNumberOperator,
        openTextOperator,
        openFieldValue,
        openFieldGroupKey,
        openSortFieldValue,
        openSortFieldGroupKey,
        openDisplayOperator,
        openGenerationOperator, openGenerationValue,
        openTypeValue,
        openEggGroupsValue,
        openColorOperator, openColorValue,
        openCategoryOperator, openCategoryValue,
        openSinSexoOperator, openSinSexoValue,
        openPuedeCriarOperator, openPuedeCriarValue,
        openHasMegaFormsOperator, openHasMegaFormsValue,
        openHasGigaFormOperator, openHasGigaFormValue,
        openIsBabyPkmOperator, openIsBabyPkmValue,
        openIsMythicalPkmOperator, openIsMythicalPkmValue,
        openIsLegendaryPkmOperator, openIsLegendaryPkmValue,
        openIsMegaFormOperator, openIsMegaFormValue,
        openIsGigaFormOperator, openIsGigaFormValue,
        openAbilityScope, openAbilityValue 
    ]);

    const closeDrawer = () =>
    {
        // Operador Numerico
        setOpenNumberOperator(false);

        // Atributo
        setOpenFieldValue(false);
        setOpenFieldGroupKey(false);

        // Ordenar por
        setOpenSortFieldValue(false);
        setOpenSortFieldGroupKey(false);

        // Operador "Nombre"
        setOpenDisplayOperator(false);

        // Operador y Valor "Generacion"
        setOpenGenerationOperator(false);
        setOpenGenerationValue(false);

        // Operador y Valor "Color"
        setOpenColorOperator(false);
        setOpenColorValue(false);

        // Operador y Valor "Categoria"
        setOpenCategoryOperator(false);
        setOpenCategoryValue(false);

        // Operador y Valor "Sin Sexo"
        setOpenSinSexoOperator(false);
        setOpenSinSexoValue(false);

        // Operador y Valor "Puede Criar"
        setOpenPuedeCriarOperator(false);
        setOpenPuedeCriarValue(false);

        // Operador y Valor "Posee Megas"
        setOpenHasMegaFormsOperator(false);
        setOpenHasMegaFormsValue(false);

        // Operador y Valor "Posee Gigamax"
        setOpenHasGigaFormOperator(false);
        setOpenHasGigaFormValue(false);

        // Operador y Valor "Es Pokemon bebe"
        setOpenIsBabyPkmOperator(false);
        setOpenIsBabyPkmValue(false);

        // Operador y Valor "Es Pokemon mitico/singular"
        setOpenIsMythicalPkmOperator(false);
        setOpenIsMythicalPkmValue(false);

        // Operador y Valor "Es Pokemon legendario"
        setOpenIsLegendaryPkmOperator(false);
        setOpenIsLegendaryPkmValue(false);

        // Scope y Valor "Habilidad"
        setOpenAbilityScope(false);
        setOpenAbilityValue(false);

        // Tarjeta de Filtros
        setOpen(false);
    };

    const openDrawer = () => setOpen(true);

    // Operador "Numerico" seleccionado
    const selectedNumberOperatorData = useMemo(() =>
    {
        return NUMBER_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedNumberOperator;

        }) || NUMBER_FILTER_OPERATORS[0];

    }, [selectedNumberOperator]);

    // Operador de "Texto" seleccionado
    const selectedTextOperatorData = useMemo(() =>
    {
        return TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedTextOperator;

        }) || TEXT_FILTER_OPERATORS[0];

    }, [selectedTextOperator]);

    // Operador "Nombre" seleccionado
    const selectedDisplayOperatorData = useMemo(() =>
    {
        return TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedDisplayOperator;

        }) || TEXT_FILTER_OPERATORS[0];

    }, [selectedDisplayOperator]);

    // Operador "Generacion" seleccionado
    const selectedGenerationOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedGenerationOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedGenerationOperator]);

    // Operador "Color" seleccionado
    const selectedColorOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedColorOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedColorOperator]);

    // Operador "Categoria" seleccionado
    const selectedCategoryOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedCategoryOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedCategoryOperator]);

    // Operador "Sin Sexo" seleccionado
    const selectedSinSexoOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedSinSexoOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedSinSexoOperator]);

    // Operador "Puede Criar" seleccionado
    const selectedPuedeCriarOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedPuedeCriarOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedPuedeCriarOperator]);

    // Operador "Posee Megas" seleccionado
    const selectedHasMegaFormsOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedHasMegaFormsOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedHasMegaFormsOperator]);

    // Operador "Posee Gigamax" seleccionado
    const selectedHasGigaFormOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedHasGigaFormOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedHasGigaFormOperator]);

    // Operador "Es Pokemon bebe" seleccionado
    const selectedIsBabyPkmOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedIsBabyPkmOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedIsBabyPkmOperator]);

    // Operador "Es Pokemon mitico/singular" seleccionado
    const selectedIsMythicalPkmOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedIsMythicalPkmOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedIsMythicalPkmOperator]);

    // Operador "Es Pokemon legendario" seleccionado
    const selectedIsLegendaryPkmOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedIsLegendaryPkmOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedIsLegendaryPkmOperator]);

    // Operador "Es Mega Evolucion" seleccionado
    const selectedIsMegaFormOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedIsMegaFormOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedIsMegaFormOperator]);

    // Operador "Es Forma Gigamax" seleccionado
    const selectedIsGigaFormOperatorData = useMemo(() =>
    {
        return BOUNDED_TEXT_FILTER_OPERATORS.find(function(option)
        {
            return option.key === selectedIsGigaFormOperator;

        }) || BOUNDED_TEXT_FILTER_OPERATORS[0];

    }, [selectedIsGigaFormOperator]);

    function getFieldSelectionId(field)
    {
        return getAdvancedPkmFieldSelectionId(field);
    }

    function getAbilityScopeLabelFromSlot(slot)
    {
        switch(Number(slot || 0))
        {
            case 1:
                return "Principal";
            case 2:
                return "Secundaria";
            case 3:
                return "Oculta";
            default:
                return "";
        }
    }

    function getOptionDescriptionByKey(options, key)
    {
        const normalizedKey = String(key || "");
        const list = Array.isArray(options) ? options : [];
        const foundOption = list.find(function(option)
        {
            return String(option?.key || "") === normalizedKey;
        });

        if(foundOption)
        {
            return String(foundOption.description || foundOption.key || normalizedKey);
        }

        return normalizedKey;
    }

    function formatFilterChipNumericValue(value)
    {
        const rawValue = String(value ?? "").trim();

        if(rawValue === "")
        {
            return "";
        }

        if(rawValue.includes(","))
        {
            return rawValue;
        }

        if(rawValue.includes("."))
        {
            return rawValue.replace(".", ",");
        }

        const numericValue = Number(rawValue);

        if(Number.isFinite(numericValue))
        {
            return formatNumberWithDots(numericValue);
        }

        return rawValue;
    }

    function isCurrentFilterQueryValid(query)
    {
        if(!query) return false;

        const fieldType = String(query.type || "");
        const fieldKey = String(query.field || "");
        const operatorKey = String(query.operator || "");
        const value = query.value;

        if(!fieldType || !fieldKey || !operatorKey)
        {
            return false;
        }

        if(fieldType === "number")
        {
            return Number.isFinite(Number(value));
        }

        if(fieldType === "boolean")
        {
            return value === true || value === false;
        }

        return String(value || "").trim() !== "";
    }

    function buildFilterChipFromQuery(query)
    {
        if(!isCurrentFilterQueryValid(query))
        {
            return null;
        }

        const nextChipId = `filter-chip-${++filterChipIdRef.current}`;

        return {
            id: nextChipId,
            field: String(query.field || ""),
            description: String(query.description || ""),
            fieldLabel: String(query.fieldLabel || query.description || query.field || ""),
            path: String(query.path || ""),
            type: String(query.type || ""),
            operator: String(query.operator || ""),
            operatorLabel: String(query.operatorLabel || ""),
            operatorSymbol: String(query.operatorSymbol || ""),
            value: query.value,
            valueLabel: String(query.valueLabel || ""),
            slot: query.slot ?? null
        };
    }

    function isFilterAlreadyApplied(query, filters = appliedFilters)
    {
        if(!isCurrentFilterQueryValid(query))
        {
            return false;
        }

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

    function applyFiltersChain(sourceItems, filters)
    {
        return applyAdvancedPkmFiltersChain(sourceItems, filters);
    }

    function handleAddCurrentFilter()
    {
        const currentQuery = buildCurrentFilterQuery();

        if(isFilterAlreadyApplied(currentQuery))
        {
            return null;
        }

        const nextChip = buildFilterChipFromQuery(currentQuery);

        if(!nextChip)
        {
            return null;
        }

        setAppliedFilters(function(previousFilters)
        {
            if(isFilterAlreadyApplied(currentQuery, previousFilters))
            {
                return previousFilters;
            }

            return [...previousFilters, nextChip];
        });

        closeAllFilterDropdowns();

        return nextChip;
    }

    function handleRemoveAppliedFilter(filterId)
    {
        const targetId = String(filterId || "");

        if(!targetId)
        {
            return;
        }

        setAppliedFilters(function(previousFilters)
        {
            return previousFilters.filter(function(filter)
            {
                return String(filter?.id || "") !== targetId;
            });
        });
    }

    function handleClearAppliedFilters()
    {
        setAppliedFilters([]);
        filterChipIdRef.current = 0;
    }

    // -------- Funciones auxiliares para Filtro de "Habilidad" - INICIO --------
    
    function getAbilitiesSlotFromDescription(description)
    {
        const normalized = String(description || "").toLowerCase();

        if(normalized.includes("primaria"))
        {
            return 1;
        }

        if(normalized.includes("secundaria"))
        {
            return 2;
        }

        if(normalized.includes("oculta"))
        {
            return 3;
        }

        return 0;
    }

    function getAbilityScopeFromDescription(description)
    {
        const slot = getAbilitiesSlotFromDescription(description);

        if(slot === 1) return "primary";
        if(slot === 2) return "secondary";
        if(slot === 3) return "hidden";

        return "all";
    }

    // -------- Funciones auxiliares para Filtro de "Habilidad" - FIN --------

    // Atributo elegido
    const selectedFieldData = useMemo(() =>
    {
        if(!Array.isArray(filtersSchema) || filtersSchema.length === 0)
        {
            return null;
        }

        return filtersSchema.find(function(field)
        {
            return getFieldSelectionId(field) === selectedFieldValue;

        }) || filtersSchema[0];

    }, [filtersSchema, selectedFieldValue]);

    useEffect(() =>
    {
        if(Array.isArray(filtersSchema) && filtersSchema.length > 0)
        {
            const exists = filtersSchema.some(function(field)
            {
                return getFieldSelectionId(field) === selectedFieldValue;
            });

            if(!exists)
            {
                setSelectedFieldValue(getFieldSelectionId(filtersSchema[0]));
            }
        }

    }, [filtersSchema, selectedFieldValue]);

    const selectedSortFieldData = useMemo(() =>
    {
        if(!Array.isArray(filtersSchema) || filtersSchema.length === 0)
        {
            return null;
        }

        return filtersSchema.find(function(field)
        {
            return getFieldSelectionId(field) === selectedSortFieldValue;

        }) || filtersSchema.find(function(field)
        {
            return String(field?.field || "") === DEFAULT_SORT_FIELD;

        }) || filtersSchema[0];

    }, [filtersSchema, selectedSortFieldValue]);

    const hasSortChanged = selectedSortFieldValue !== appliedSortFieldValue || selectedSortDirection !== appliedSortDirection;

    useEffect(() =>
    {
        if(!Array.isArray(filtersSchema) || filtersSchema.length === 0)
        {
            return;
        }

        const defaultSortField = filtersSchema.find(function(field)
        {
            return String(field?.field || "") === DEFAULT_SORT_FIELD;
        }) || filtersSchema[0];
        const defaultSortFieldId = getFieldSelectionId(defaultSortField);
        const selectedExists = filtersSchema.some(function(field)
        {
            return getFieldSelectionId(field) === selectedSortFieldValue;
        });
        const appliedExists = filtersSchema.some(function(field)
        {
            return getFieldSelectionId(field) === appliedSortFieldValue;
        });

        if(!selectedExists)
        {
            setSelectedSortFieldValue(defaultSortFieldId);
        }

        if(!appliedExists)
        {
            setAppliedSortFieldValue(defaultSortFieldId);
        }

    }, [filtersSchema, selectedSortFieldValue, appliedSortFieldValue]);

    function getSortedEnumOptions(field)
    {
        const options = Array.isArray(field?.options) ? [...field.options] : [];

        return options.sort(function(a, b)
        {
            const orderA = Number(a?.order ?? 0);
            const orderB = Number(b?.order ?? 0);

            return orderA - orderB;
        });
    }

    function getFirstSortedEnumOption(field)
    {
        const sortedOptions = getSortedEnumOptions(field);

        return sortedOptions.length > 0 ? sortedOptions[0] : null;
    }

    function resetFieldSelectionState()
    {
        setSelectedNumberOperator("eq");
        setSelectedTextOperator("contains");
        setSelectedDisplayOperator("contains");
        setSelectedGenerationOperator("eq");
        setSelectedColorOperator("eq");
        setSelectedCategoryOperator("eq");
        setSelectedSinSexoOperator("eq");
        setSelectedPuedeCriarOperator("eq");
        setSelectedHasMegaFormsOperator("eq");
        setSelectedHasGigaFormOperator("eq");
        setSelectedIsBabyPkmOperator("eq");
        setSelectedIsMythicalPkmOperator("eq");
        setSelectedIsLegendaryPkmOperator("eq");

        setNumberInputValue("");
        setNumberFloatInputValue("");
        setDisplayTextInputValue("");

        setSelectedGenerationValue("");
        setSelectedTypeValue("");
        setSelectedEggGroupsValue("");
        setSelectedColorValue("");
        setSelectedCategoryValue("");
        setSelectedSinSexoValue("true");
        setSelectedPuedeCriarValue("true");
        setSelectedHasMegaFormsValue("true");
        setSelectedHasGigaFormValue("true");
        setSelectedIsBabyPkmValue("true");
        setSelectedIsMythicalPkmValue("true");
        setSelectedIsLegendaryPkmValue("true");
        setSelectedAbilityScope("all");
        setSelectedAbilityValue("");
    }

    function closeAllFilterDropdowns()
    {
        setOpenSortFieldValue(false);
        setOpenSortFieldGroupKey(false);
        setOpenFieldValue(false);
        setOpenFieldGroupKey(false);
        setOpenNumberOperator(false);
        setOpenTextOperator(false);
        setOpenDisplayOperator(false);
        setOpenGenerationOperator(false);
        setOpenGenerationValue(false);
        setOpenTypeValue(false);
        setOpenEggGroupsValue(false);
        setOpenColorOperator(false);
        setOpenColorValue(false);
        setOpenCategoryOperator(false);
        setOpenCategoryValue(false);
        setOpenSinSexoOperator(false);
        setOpenSinSexoValue(false);
        setOpenPuedeCriarOperator(false);
        setOpenPuedeCriarValue(false);
        setOpenHasMegaFormsOperator(false);
        setOpenHasMegaFormsValue(false);
        setOpenHasGigaFormOperator(false);
        setOpenHasGigaFormValue(false);
        setOpenIsBabyPkmOperator(false);
        setOpenIsBabyPkmValue(false);
        setOpenIsMythicalPkmOperator(false);
        setOpenIsMythicalPkmValue(false);
        setOpenIsLegendaryPkmOperator(false);
        setOpenIsLegendaryPkmValue(false);
        setOpenAbilityScope(false);
        setOpenAbilityValue(false);
    }

    const FIELD_SELECTION_PRESETS = {
        generation: function(nextField, firstOption)
        {
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue(firstOption ? String(firstOption.key || "") : "");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
        },
        color: function(nextField, firstOption)
        {
            setSelectedColorOperator("eq");
            setSelectedColorValue(firstOption ? String(firstOption.key || "") : "");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
        },
        categoryPkm: function(nextField, firstOption)
        {
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue(firstOption ? String(firstOption.key || "") : "");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
        },
        types: function(nextField, firstOption)
        {
            setSelectedTextOperator("contains");
            setSelectedTypeValue(firstOption ? String(firstOption.key || "") : "");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedPuedeCriarOperator("eq");
            setSelectedPuedeCriarValue("true");
            setSelectedHasMegaFormsOperator("eq");
            setSelectedHasMegaFormsValue("true");
            setSelectedHasGigaFormOperator("eq");
            setSelectedHasGigaFormValue("true");
            setSelectedEggGroupsValue("");
            setNumberInputValue("");
            setNumberFloatInputValue("");
            setDisplayTextInputValue("");
        },
        eggGroups: function(nextField, firstOption)
        {
            setSelectedTextOperator("contains");
            setSelectedEggGroupsValue(firstOption ? String(firstOption.key || "") : "");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedPuedeCriarOperator("eq");
            setSelectedPuedeCriarValue("true");
            setSelectedHasMegaFormsOperator("eq");
            setSelectedHasMegaFormsValue("true");
            setSelectedHasGigaFormOperator("eq");
            setSelectedHasGigaFormValue("true");
            setSelectedTypeValue("");
            setNumberInputValue("");
            setNumberFloatInputValue("");
            setDisplayTextInputValue("");
        },
        abilities: function(nextField, firstOption)
        {
            const nextAbilityValue = firstOption ? String(firstOption.key || "") : "";
            const nextAbilityScope = getAbilityScopeFromDescription(nextField?.description);

            setSelectedTextOperator("contains");
            setSelectedAbilityScope(nextAbilityScope);
            setSelectedAbilityValue(nextAbilityValue);

            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedPuedeCriarOperator("eq");
            setSelectedPuedeCriarValue("true");
            setSelectedHasMegaFormsOperator("eq");
            setSelectedHasMegaFormsValue("true");
            setSelectedHasGigaFormOperator("eq");
            setSelectedHasGigaFormValue("true");
            setSelectedTypeValue("");
            setNumberInputValue("");
            setNumberFloatInputValue("");
            setDisplayTextInputValue("");
        },
        sinSexo: function()
        {
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
        },
        puedeCriar: function()
        {
            setSelectedPuedeCriarOperator("eq");
            setSelectedPuedeCriarValue("true");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
        },
        hasMegaForms: function()
        {
            setSelectedHasMegaFormsOperator("eq");
            setSelectedHasMegaFormsValue("true");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
        },
        hasGigaForm: function()
        {
            setSelectedHasGigaFormOperator("eq");
            setSelectedHasGigaFormValue("true");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
        },
        display: function()
        {
            setSelectedDisplayOperator("contains");
            setDisplayTextInputValue("");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedPuedeCriarOperator("eq");
            setSelectedPuedeCriarValue("true");
            setSelectedHasMegaFormsOperator("eq");
            setSelectedHasMegaFormsValue("true");
            setSelectedHasGigaFormOperator("eq");
            setSelectedHasGigaFormValue("true");
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
            setNumberInputValue("");
            setNumberFloatInputValue("");
            setDisplayTextInputValue("");
        },
        number: function()
        {
            setSelectedNumberOperator("eq");
            setNumberInputValue("");
            setNumberFloatInputValue("");
        },
        boolean: function()
        {
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedPuedeCriarOperator("eq");
            setSelectedPuedeCriarValue("true");
            setSelectedHasMegaFormsOperator("eq");
            setSelectedHasMegaFormsValue("true");
            setSelectedHasGigaFormOperator("eq");
            setSelectedHasGigaFormValue("true");
        },
        defaultEnum: function()
        {
            setSelectedTextOperator("contains");
            setSelectedTypeValue("");
            setSelectedGenerationOperator("eq");
            setSelectedGenerationValue("");
            setSelectedColorOperator("eq");
            setSelectedColorValue("");
            setSelectedCategoryOperator("eq");
            setSelectedCategoryValue("");
            setSelectedSinSexoOperator("eq");
            setSelectedSinSexoValue("true");
            setSelectedPuedeCriarOperator("eq");
            setSelectedPuedeCriarValue("true");
        }
    };

    function handleSelectField(fieldKey)
    {
        setSelectedFieldValue(fieldKey);
        setOpenFieldValue(false);

        const nextField = Array.isArray(filtersSchema) ? filtersSchema.find(function(field)
        {
            return getFieldSelectionId(field) === fieldKey;

        }) : null;

        if(nextField && nextField.type === "enum")
        {
            const firstOption = getFirstSortedEnumOption(nextField);
            const preset = FIELD_SELECTION_PRESETS[nextField.field] || FIELD_SELECTION_PRESETS.defaultEnum;

            resetFieldSelectionState();
            preset(nextField, firstOption);
            closeAllFilterDropdowns();
            return;
        }

        if(nextField && nextField.field === "display")
        {
            resetFieldSelectionState();
            FIELD_SELECTION_PRESETS.display(nextField);
            closeAllFilterDropdowns();
            return;
        }

        if(nextField && nextField.type === "number")
        {
            resetFieldSelectionState();
            FIELD_SELECTION_PRESETS.number(nextField);
            closeAllFilterDropdowns();
            return;
        }

        if(nextField && nextField.type === "boolean")
        {
            resetFieldSelectionState();
            FIELD_SELECTION_PRESETS.boolean(nextField);
            closeAllFilterDropdowns();
            return;
        }

        resetFieldSelectionState();
        closeAllFilterDropdowns();
    }

    function handleSelectSortField(fieldKey)
    {
        setSelectedSortFieldValue(fieldKey);
        setOpenSortFieldValue(false);
    }

    function handleSelectFieldGroupKey(groupKey)
    {
        const nextGroupKey = String(groupKey || "all");
        const filteredOptions = getFilteredFieldOptionsByGroup(nextGroupKey);
        const hasCurrentField = filteredOptions.some(function(field)
        {
            return getFieldSelectionId(field) === selectedFieldValue;
        });

        setSelectedFieldGroupKey(nextGroupKey);
        setOpenFieldGroupKey(false);

        if(!hasCurrentField && filteredOptions.length > 0)
        {
            handleSelectField(getFieldSelectionId(filteredOptions[0]));
        }
    }

    function handleSelectSortFieldGroupKey(groupKey)
    {
        const nextGroupKey = String(groupKey || "all");
        const filteredOptions = getFilteredSortFieldOptionsByGroup(nextGroupKey);
        const hasCurrentField = filteredOptions.some(function(field)
        {
            return getFieldSelectionId(field) === selectedSortFieldValue;
        });

        setSelectedSortFieldGroupKey(nextGroupKey);
        setOpenSortFieldGroupKey(false);

        if(!hasCurrentField && filteredOptions.length > 0)
        {
            handleSelectSortField(getFieldSelectionId(filteredOptions[0]));
        }
    }

    function handleToggleSortDirection()
    {
        setSelectedSortDirection(function(prev)
        {
            return prev === "asc" ? "desc" : "asc";
        });
    }

    //** ------------- Funciones Handle - INICIO -------------

    // Operador "Numerico"
    function handleSelectNumberOperator(operatorKey)
    {
        setSelectedNumberOperator(operatorKey);
        setOpenNumberOperator(false);
    }


    // Operador de "Texto"
    function handleSelectTextOperator(operatorKey)
    {
        setSelectedTextOperator(operatorKey);
        setOpenTextOperator(false);
    }


    // Operador de "Nombre"
    function handleSelectDisplayOperator(operatorKey)
    {
        setSelectedDisplayOperator(operatorKey);
        setOpenDisplayOperator(false);
    }


    // Operador y Valor de "Generacion"
    function handleSelectGenerationOperator(operatorKey)
    {
        setSelectedGenerationOperator(operatorKey);
        setOpenGenerationOperator(false);
    }

    function handleSelectGenerationValue(generationKey)
    {
        setSelectedGenerationValue(generationKey);
        setOpenGenerationValue(false);
    }


    // Valor de "Tipo"
    function handleSelectTypeValue(typeKey)
    {
        setSelectedTypeValue(typeKey);
        setOpenTypeValue(false);
    }


    // Valor de "Grupo Huevo"
    function handleSelectEggGroupsValue(eggGroupKey)
    {
        setSelectedEggGroupsValue(eggGroupKey);
        setOpenEggGroupsValue(false);
    }


    // Operador y Valor de "Color"
    function handleSelectColorOperator(operatorKey)
    {
        setSelectedColorOperator(operatorKey);
        setOpenColorOperator(false);
    }

    function handleSelectColorValue(colorKey)
    {
        setSelectedColorValue(colorKey);
        setOpenColorValue(false);
    }


    // Operador y Valor de "Categoria"
    function handleSelectCategoryOperator(operatorKey)
    {
        setSelectedCategoryOperator(operatorKey);
        setOpenCategoryOperator(false);
    }

    function handleSelectCategoryValue(categoryKey)
    {
        setSelectedCategoryValue(categoryKey);
        setOpenCategoryValue(false);
    }


    // Operador y Valor de "Sin Sexo"
    function handleSelectSinSexoOperator(operatorKey)
    {
        setSelectedSinSexoOperator(operatorKey);
        setOpenSinSexoOperator(false);
    }

    function handleSelectSinSexoValue(valueKey)
    {
        setSelectedSinSexoValue(valueKey);
        setOpenSinSexoValue(false);
    }


    // Operador y Valor de "Puede Criar"
    function handleSelectPuedeCriarOperator(operatorKey)
    {
        setSelectedPuedeCriarOperator(operatorKey);
        setOpenPuedeCriarOperator(false);
    }

    function handleSelectPuedeCriarValue(valueKey)
    {
        setSelectedPuedeCriarValue(valueKey);
        setOpenPuedeCriarValue(false);
    }


    // Operador y Valor de "Posee Megas"
    function handleSelectHasMegaFormsOperator(operatorKey)
    {
        setSelectedHasMegaFormsOperator(operatorKey);
        setOpenHasMegaFormsOperator(false);
    }

    function handleSelectHasMegaFormsValue(valueKey)
    {
        setSelectedHasMegaFormsValue(valueKey);
        setOpenHasMegaFormsValue(false);
    }


    // Operador y Valor de "Posee Gigamax"
    function handleSelectHasGigaFormOperator(operatorKey)
    {
        setSelectedHasGigaFormOperator(operatorKey);
        setOpenHasGigaFormOperator(false);
    }

    function handleSelectHasGigaFormValue(valueKey)
    {
        setSelectedHasGigaFormValue(valueKey);
        setOpenHasGigaFormValue(false);
    }


    // Operador y Valor de "Es Pokemon bebe"
    function handleSelectIsBabyPkmOperator(operatorKey)
    {
        setSelectedIsBabyPkmOperator(operatorKey);
        setOpenIsBabyPkmOperator(false);
    }

    function handleSelectIsBabyPkmValue(valueKey)
    {
        setSelectedIsBabyPkmValue(valueKey);
        setOpenIsBabyPkmValue(false);
    }


    // Operador y Valor de "Es Pokemon mitico/singular"
    function handleSelectIsMythicalPkmOperator(operatorKey)
    {
        setSelectedIsMythicalPkmOperator(operatorKey);
        setOpenIsMythicalPkmOperator(false);
    }

    function handleSelectIsMythicalPkmValue(valueKey)
    {
        setSelectedIsMythicalPkmValue(valueKey);
        setOpenIsMythicalPkmValue(false);
    }


    // Operador y Valor de "Es Pokemon legendario"
    function handleSelectIsLegendaryPkmOperator(operatorKey)
    {
        setSelectedIsLegendaryPkmOperator(operatorKey);
        setOpenIsLegendaryPkmOperator(false);
    }

    function handleSelectIsLegendaryPkmValue(valueKey)
    {
        setSelectedIsLegendaryPkmValue(valueKey);
        setOpenIsLegendaryPkmValue(false);
    }


    // Operador y Valor de "Es Mega Evolucion"
    function handleSelectIsMegaFormOperator(operatorKey)
    {
        setSelectedIsMegaFormOperator(operatorKey);
        setOpenIsMegaFormOperator(false);
    }

    function handleSelectIsMegaFormValue(valueKey)
    {
        setSelectedIsMegaFormValue(valueKey);
        setOpenIsMegaFormValue(false);
    }


    // Operador y Valor de "Es Forma Gigamax"
    function handleSelectIsGigaFormOperator(operatorKey)
    {
        setSelectedIsGigaFormOperator(operatorKey);
        setOpenIsGigaFormOperator(false);
    }

    function handleSelectIsGigaFormValue(valueKey)
    {
        setSelectedIsGigaFormValue(valueKey);
        setOpenIsGigaFormValue(false);
    }


    // Scope y Valor de "Habilidad"
    function handleSelectAbilityScope(valueKey)
    {
        setSelectedAbilityScope(valueKey);
        setOpenAbilityScope(false);
    }

    function handleSelectAbilityValue(valueKey)
    {
        setSelectedAbilityValue(valueKey);
        setOpenAbilityValue(false);
    }


    // Cambios de Inputs: Numerico, Numerico con decimal y Texto
    function handleNumberInputChange(e)
    {
        const nextValue = String(e.target.value || "").replace(/[^\d]/g, "");
        setNumberInputValue(nextValue);
    }

    function handleNumberFloatInputChange(e)
    {
        const normalized = String(e.target.value || "").replace(/,/g, ".");
        const filtered = normalized.replace(/[^\d.]/g, "");
        const parts = filtered.split(".");
        const nextValue = parts.length > 1
            ? `${parts[0]}.${parts.slice(1).join("")}`
            : filtered;

        setNumberFloatInputValue(nextValue);
    }

    function handleDisplayTextInputChange(e)
    {
        setDisplayTextInputValue(String(e.target.value || ""));
    }

    //** ------------- Funciones Handle - FIN -------------

    
    function normalizePokemonText(input)
    {
        return normalizeAdvancedPkmText(input);
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
            case "generation":
                setOpenGenerationValue(true);
                break;
            case "field":
                setOpenFieldValue(true);
                break;
            case "sortField":
                setOpenSortFieldValue(true);
                break;
            case "types":
                setOpenTypeValue(true);
                break;
            case "eggGroups":
                setOpenEggGroupsValue(true);
                break;
            case "color":
                setOpenColorValue(true);
                break;
            case "abilities":
                setOpenAbilityValue(true);
                break;
            case "category":
                setOpenCategoryValue(true);
                break;
            default:
                break;
        }
    }

    function clearOptionSearchValue(searchKey)
    {
        setOptionSearchValue(searchKey, "");
    }

    function filterOptionsByDescription(options, searchText)
    {
        const list = Array.isArray(options) ? options : [];
        const needle = normalizePokemonText(searchText);

        if(!needle)
        {
            return list;
        }

        return list.filter(function(option)
        {
            return normalizePokemonText(option?.description || "").includes(needle);
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

    function getFilteredFieldOptionsByGroup(groupKey)
    {
        const filteredByDescription = filterOptionsByDescription(filtersSchema, getOptionSearchValue("field"));

        return filterFieldOptionsByGroup(filteredByDescription, groupKey);
    }

    function getFilteredSortFieldOptionsByGroup(groupKey)
    {
        const filteredByDescription = filterOptionsByDescription(filtersSchema, getOptionSearchValue("sortField"));

        return filterFieldOptionsByGroup(filteredByDescription, groupKey);
    }

    function isFloatNumericField(fieldKey)
    {
        return (
            fieldKey === "weight" ||
            fieldKey === "height" ||
            fieldKey === "malePercentage" ||
            fieldKey === "femalePercentage"
        );
    }

    function buildCurrentFilterQuery()
    {
        const fieldType = selectedFieldData ? String(selectedFieldData.type || "") : "";
        const fieldKey = selectedFieldData ? String(selectedFieldData.field || "") : "";
        const fieldLabel = selectedFieldData ? String(selectedFieldData.description || selectedFieldData.field || "") : "";
        const useFloatInput = isFloatNumericField(fieldKey);
        const rawNumberValue = useFloatInput
            ? String(numberFloatInputValue || "").trim().replace(",", ".")
            : String(numberInputValue || "").trim();
        const parsedNumericValue = rawNumberValue === "" ? null : Number(rawNumberValue);
        const isEnumField = fieldType === "enum";
        const isBooleanField = fieldType === "boolean";
        const isGenerationField = fieldKey === "generation";
        const isColorField = fieldKey === "color";
        const isCategoryField = fieldKey === "categoryPkm";
        const isDisplayField = fieldKey === "display";
        const isAbilitiesField = fieldKey === "abilities";
        const isEggGroupsField = fieldKey === "eggGroups";
        const abilitiesSlot = (() =>
        {
            switch(String(selectedAbilityScope || "all"))
            {
                case "primary":
                    return 1;
                case "secondary":
                    return 2;
                case "hidden":
                    return 3;
                default:
                    return null;
            }
        })();
        const isSinSexoField = fieldKey === "sinSexo";
        const isPuedeCriarField = fieldKey === "puedeCriar";
        const isHasMegaFormsField = fieldKey === "hasMegaForms";
        const isHasGigaFormField = fieldKey === "hasGigaForm";
        const isIsBabyPkmField = fieldKey === "isBabyPkm";
        const isIsMythicalPkmField = fieldKey === "isMythicalPkm";
        const isIsLegendaryPkmField = fieldKey === "isLegendaryPkm";
        const isIsMegaFormField = fieldKey === "isMegaForm";
        const isIsGigaFormField = fieldKey === "isGigaForm";
        let valueLabel = "";

        let operatorKey = selectedNumberOperatorData ? selectedNumberOperatorData.key : "";
        let operatorLabel = selectedNumberOperatorData ? selectedNumberOperatorData.label : "";
        let operatorSymbol = selectedNumberOperatorData ? selectedNumberOperatorData.symbol : "";
        let value = parsedNumericValue;

        if(isEnumField)
        {
            if(isGenerationField)
            {
                operatorKey = selectedGenerationOperatorData ? selectedGenerationOperatorData.key : "";
                operatorLabel = selectedGenerationOperatorData ? selectedGenerationOperatorData.label : "";
                operatorSymbol = selectedGenerationOperatorData ? selectedGenerationOperatorData.symbol : "";
                value = selectedGenerationValue;
                valueLabel = getOptionDescriptionByKey(selectedFieldData?.options, selectedGenerationValue);
            
            }else if(isColorField)
            {
                operatorKey = selectedColorOperatorData ? selectedColorOperatorData.key : "";
                operatorLabel = selectedColorOperatorData ? selectedColorOperatorData.label : "";
                operatorSymbol = selectedColorOperatorData ? selectedColorOperatorData.symbol : "";
                value = selectedColorValue;
                valueLabel = getOptionDescriptionByKey(selectedFieldData?.options, selectedColorValue);
            
            }else if(isCategoryField)
            {
                operatorKey = selectedCategoryOperatorData ? selectedCategoryOperatorData.key : "";
                operatorLabel = selectedCategoryOperatorData ? selectedCategoryOperatorData.label : "";
                operatorSymbol = selectedCategoryOperatorData ? selectedCategoryOperatorData.symbol : "";
                value = selectedCategoryValue;
                valueLabel = getOptionDescriptionByKey(selectedFieldData?.options, selectedCategoryValue);
            
            }else if(isAbilitiesField)
            {
                operatorKey = selectedTextOperatorData ? selectedTextOperatorData.key : "";
                operatorLabel = selectedTextOperatorData ? selectedTextOperatorData.label : "";
                operatorSymbol = selectedTextOperatorData ? selectedTextOperatorData.symbol : "";
                value = selectedAbilityValue;
                valueLabel = getOptionDescriptionByKey(selectedFieldData?.options, selectedAbilityValue);
            
            }else if(isEggGroupsField)
            {
                operatorKey = selectedTextOperatorData ? selectedTextOperatorData.key : "";
                operatorLabel = selectedTextOperatorData ? selectedTextOperatorData.label : "";
                operatorSymbol = selectedTextOperatorData ? selectedTextOperatorData.symbol : "";
                value = selectedEggGroupsValue;
                valueLabel = getOptionDescriptionByKey(selectedFieldData?.options, selectedEggGroupsValue);
            
            }else if(isSinSexoField)
            {
                operatorKey = selectedSinSexoOperatorData ? selectedSinSexoOperatorData.key : "";
                operatorLabel = selectedSinSexoOperatorData ? selectedSinSexoOperatorData.label : "";
                operatorSymbol = selectedSinSexoOperatorData ? selectedSinSexoOperatorData.symbol : "";
                value = String(selectedSinSexoValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isPuedeCriarField)
            {
                operatorKey = selectedPuedeCriarOperatorData ? selectedPuedeCriarOperatorData.key : "";
                operatorLabel = selectedPuedeCriarOperatorData ? selectedPuedeCriarOperatorData.label : "";
                operatorSymbol = selectedPuedeCriarOperatorData ? selectedPuedeCriarOperatorData.symbol : "";
                value = String(selectedPuedeCriarValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isHasMegaFormsField)
            {
                operatorKey = selectedHasMegaFormsOperatorData ? selectedHasMegaFormsOperatorData.key : "";
                operatorLabel = selectedHasMegaFormsOperatorData ? selectedHasMegaFormsOperatorData.label : "";
                operatorSymbol = selectedHasMegaFormsOperatorData ? selectedHasMegaFormsOperatorData.symbol : "";
                value = String(selectedHasMegaFormsValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isHasGigaFormField)
            {
                operatorKey = selectedHasGigaFormOperatorData ? selectedHasGigaFormOperatorData.key : "";
                operatorLabel = selectedHasGigaFormOperatorData ? selectedHasGigaFormOperatorData.label : "";
                operatorSymbol = selectedHasGigaFormOperatorData ? selectedHasGigaFormOperatorData.symbol : "";
                value = String(selectedHasGigaFormValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsBabyPkmField)
            {
                operatorKey = selectedIsBabyPkmOperatorData ? selectedIsBabyPkmOperatorData.key : "";
                operatorLabel = selectedIsBabyPkmOperatorData ? selectedIsBabyPkmOperatorData.label : "";
                operatorSymbol = selectedIsBabyPkmOperatorData ? selectedIsBabyPkmOperatorData.symbol : "";
                value = String(selectedIsBabyPkmValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsMythicalPkmField)
            {
                operatorKey = selectedIsMythicalPkmOperatorData ? selectedIsMythicalPkmOperatorData.key : "";
                operatorLabel = selectedIsMythicalPkmOperatorData ? selectedIsMythicalPkmOperatorData.label : "";
                operatorSymbol = selectedIsMythicalPkmOperatorData ? selectedIsMythicalPkmOperatorData.symbol : "";
                value = String(selectedIsMythicalPkmValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsLegendaryPkmField)
            {
                operatorKey = selectedIsLegendaryPkmOperatorData ? selectedIsLegendaryPkmOperatorData.key : "";
                operatorLabel = selectedIsLegendaryPkmOperatorData ? selectedIsLegendaryPkmOperatorData.label : "";
                operatorSymbol = selectedIsLegendaryPkmOperatorData ? selectedIsLegendaryPkmOperatorData.symbol : "";
                value = String(selectedIsLegendaryPkmValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsMegaFormField)
            {
                operatorKey = selectedIsMegaFormOperatorData ? selectedIsMegaFormOperatorData.key : "";
                operatorLabel = selectedIsMegaFormOperatorData ? selectedIsMegaFormOperatorData.label : "";
                operatorSymbol = selectedIsMegaFormOperatorData ? selectedIsMegaFormOperatorData.symbol : "";
                value = String(selectedIsMegaFormValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsGigaFormField)
            {
                operatorKey = selectedIsGigaFormOperatorData ? selectedIsGigaFormOperatorData.key : "";
                operatorLabel = selectedIsGigaFormOperatorData ? selectedIsGigaFormOperatorData.label : "";
                operatorSymbol = selectedIsGigaFormOperatorData ? selectedIsGigaFormOperatorData.symbol : "";
                value = String(selectedIsGigaFormValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else
            {
                operatorKey = selectedTextOperatorData ? selectedTextOperatorData.key : "";
                operatorLabel = selectedTextOperatorData ? selectedTextOperatorData.label : "";
                operatorSymbol = selectedTextOperatorData ? selectedTextOperatorData.symbol : "";
                value = selectedTypeValue;
                valueLabel = getOptionDescriptionByKey(selectedFieldData?.options, selectedTypeValue);
            }
        
        }else if(isDisplayField)
        {
            operatorKey = selectedDisplayOperatorData ? selectedDisplayOperatorData.key : "";
            operatorLabel = selectedDisplayOperatorData ? selectedDisplayOperatorData.label : "";
            operatorSymbol = selectedDisplayOperatorData ? selectedDisplayOperatorData.symbol : "";
            value = displayTextInputValue;
            valueLabel = displayTextInputValue;
        
        }else if(isBooleanField)
        {
            if(isSinSexoField)
            {
                operatorKey = selectedSinSexoOperatorData ? selectedSinSexoOperatorData.key : "";
                operatorLabel = selectedSinSexoOperatorData ? selectedSinSexoOperatorData.label : "";
                operatorSymbol = selectedSinSexoOperatorData ? selectedSinSexoOperatorData.symbol : "";
                value = String(selectedSinSexoValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isPuedeCriarField)
            {
                operatorKey = selectedPuedeCriarOperatorData ? selectedPuedeCriarOperatorData.key : "";
                operatorLabel = selectedPuedeCriarOperatorData ? selectedPuedeCriarOperatorData.label : "";
                operatorSymbol = selectedPuedeCriarOperatorData ? selectedPuedeCriarOperatorData.symbol : "";
                value = String(selectedPuedeCriarValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isHasMegaFormsField)
            {
                operatorKey = selectedHasMegaFormsOperatorData ? selectedHasMegaFormsOperatorData.key : "";
                operatorLabel = selectedHasMegaFormsOperatorData ? selectedHasMegaFormsOperatorData.label : "";
                operatorSymbol = selectedHasMegaFormsOperatorData ? selectedHasMegaFormsOperatorData.symbol : "";
                value = String(selectedHasMegaFormsValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isHasGigaFormField)
            {
                operatorKey = selectedHasGigaFormOperatorData ? selectedHasGigaFormOperatorData.key : "";
                operatorLabel = selectedHasGigaFormOperatorData ? selectedHasGigaFormOperatorData.label : "";
                operatorSymbol = selectedHasGigaFormOperatorData ? selectedHasGigaFormOperatorData.symbol : "";
                value = String(selectedHasGigaFormValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsBabyPkmField)
            {
                operatorKey = selectedIsBabyPkmOperatorData ? selectedIsBabyPkmOperatorData.key : "";
                operatorLabel = selectedIsBabyPkmOperatorData ? selectedIsBabyPkmOperatorData.label : "";
                operatorSymbol = selectedIsBabyPkmOperatorData ? selectedIsBabyPkmOperatorData.symbol : "";
                value = String(selectedIsBabyPkmValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsMythicalPkmField)
            {
                operatorKey = selectedIsMythicalPkmOperatorData ? selectedIsMythicalPkmOperatorData.key : "";
                operatorLabel = selectedIsMythicalPkmOperatorData ? selectedIsMythicalPkmOperatorData.label : "";
                operatorSymbol = selectedIsMythicalPkmOperatorData ? selectedIsMythicalPkmOperatorData.symbol : "";
                value = String(selectedIsMythicalPkmValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsLegendaryPkmField)
            {
                operatorKey = selectedIsLegendaryPkmOperatorData ? selectedIsLegendaryPkmOperatorData.key : "";
                operatorLabel = selectedIsLegendaryPkmOperatorData ? selectedIsLegendaryPkmOperatorData.label : "";
                operatorSymbol = selectedIsLegendaryPkmOperatorData ? selectedIsLegendaryPkmOperatorData.symbol : "";
                value = String(selectedIsLegendaryPkmValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsMegaFormField)
            {
                operatorKey = selectedIsMegaFormOperatorData ? selectedIsMegaFormOperatorData.key : "";
                operatorLabel = selectedIsMegaFormOperatorData ? selectedIsMegaFormOperatorData.label : "";
                operatorSymbol = selectedIsMegaFormOperatorData ? selectedIsMegaFormOperatorData.symbol : "";
                value = String(selectedIsMegaFormValue) === "true";
                valueLabel = value ? "Sí" : "No";
            
            }else if(isIsGigaFormField)
            {
                operatorKey = selectedIsGigaFormOperatorData ? selectedIsGigaFormOperatorData.key : "";
                operatorLabel = selectedIsGigaFormOperatorData ? selectedIsGigaFormOperatorData.label : "";
                operatorSymbol = selectedIsGigaFormOperatorData ? selectedIsGigaFormOperatorData.symbol : "";
                value = String(selectedIsGigaFormValue) === "true";
                valueLabel = value ? "Sí" : "No";
            }
        }

        if(fieldType === "number")
        {
            valueLabel = formatFilterChipNumericValue(value);
        }

        return {
            field: selectedFieldData ? selectedFieldData.field : "",
            description: selectedFieldData ? selectedFieldData.description : "",
            fieldLabel: fieldKey === "abilities" && abilitiesSlot
                ? `${fieldLabel} (${getAbilityScopeLabelFromSlot(abilitiesSlot)})`
                : fieldLabel,
            path: selectedFieldData ? selectedFieldData.path : "",
            type: fieldType,
            operator: operatorKey,
            operatorLabel: operatorLabel,
            operatorSymbol: operatorSymbol,
            value: value,
            valueLabel: valueLabel,
            slot: isAbilitiesField ? abilitiesSlot : null
        };
    }

    function getValueByPath(source, path)
    {
        return getAdvancedPkmValueByPath(source, path);
    }

    function getSortFieldValue(item, fieldData)
    {
        return getAdvancedPkmSortFieldValue(item, fieldData);
    }

    function sortPokemonItems(sourceItems, sortFieldValue, sortDirection)
    {
        return sortAdvancedPkmItems(sourceItems, sortFieldValue, sortDirection, filtersSchema);
    }

    function filterItemsByCurrentQuery(sourceItems, query)
    {
        return applyAdvancedPkmFiltersChain(sourceItems, [query]);
    }

    function handleApplyFieldFilter()
    {
        const query = buildCurrentFilterQuery();
        const filtersToApply = Array.isArray(appliedFilters) ? appliedFilters.slice() : [];
        const filteredItems = applyFiltersChain(items, filtersToApply);
        const sortedItems = sortPokemonItems(filteredItems, selectedSortFieldValue, selectedSortDirection);
        const nextSort = {
            field: selectedSortFieldData ? selectedSortFieldData.field : DEFAULT_SORT_FIELD,
            description: selectedSortFieldData ? selectedSortFieldData.description : "ID",
            path: selectedSortFieldData ? selectedSortFieldData.path : DEFAULT_SORT_FIELD,
            direction: selectedSortDirection
        };

        if(typeof onApplyFilters === "function")
        {
            onApplyFilters({
                query,
                filters: filtersToApply,
                sort: nextSort,
                items: sortedItems
            });
        }

        setAppliedSortFieldValue(selectedSortFieldValue);
        setAppliedSortDirection(selectedSortDirection);
        setOpen(false);

        return {
            query,
            filters: filtersToApply,
            sort: nextSort,
            items: sortedItems
        };
    }

    function handleClearFilters()
    {
        const defaultSortFieldData = getAdvancedPkmSortFieldData(filtersSchema, DEFAULT_SORT_FIELD);
        const defaultSortFieldValue = defaultSortFieldData ? getFieldSelectionId(defaultSortFieldData) : DEFAULT_SORT_FIELD;

        setSelectedFieldValue(Array.isArray(filtersSchema) && filtersSchema.length > 0 ? getFieldSelectionId(filtersSchema[0]) : "");
        setSelectedNumberOperator("eq");
        setSelectedTextOperator("contains");
        setSelectedDisplayOperator("contains");
        setSelectedGenerationOperator("eq");
        setSelectedGenerationValue("");
        setSelectedColorOperator("eq");
        setSelectedColorValue("");
        setSelectedCategoryOperator("eq");
        setSelectedCategoryValue("");
        setSelectedSinSexoOperator("eq");
        setSelectedSinSexoValue("true");
        setSelectedPuedeCriarOperator("eq");
        setSelectedPuedeCriarValue("true");
        setSelectedHasMegaFormsOperator("eq");
        setSelectedHasMegaFormsValue("true");

        setSelectedHasGigaFormOperator("eq");
        setSelectedHasGigaFormValue("true");

        setSelectedIsBabyPkmOperator("eq");
        setSelectedIsBabyPkmValue("true");
        setSelectedIsMythicalPkmOperator("eq");
        setSelectedIsMythicalPkmValue("true");
        setSelectedIsLegendaryPkmOperator("eq");
        setSelectedIsLegendaryPkmValue("true");

        setSelectedAbilityScope("all");
        setSelectedAbilityValue("");

        setSelectedTypeValue("");
        setSelectedEggGroupsValue("");
        setSelectedSortFieldValue(defaultSortFieldValue);
        setSelectedSortDirection(DEFAULT_SORT_DIRECTION);
        setAppliedSortFieldValue(defaultSortFieldValue);
        setAppliedSortDirection(DEFAULT_SORT_DIRECTION);
        setNumberInputValue("");
        setNumberFloatInputValue("");
        setDisplayTextInputValue("");
        setAppliedFilters([]);
        filterChipIdRef.current = 0;
        setOptionSearchValues({
            generation: "",
            sortField: "",
            types: "",
            color: "",
            abilities: "",
            eggGroups: "",
            category: ""
        });
        setOpenFieldValue(false);
        setOpenNumberOperator(false);
        setOpenTextOperator(false);
        setOpenDisplayOperator(false);
        setOpenGenerationOperator(false);
        setOpenGenerationValue(false);
        setOpenColorOperator(false);
        setOpenColorValue(false);
        setOpenCategoryOperator(false);
        setOpenCategoryValue(false);
        setOpenSinSexoOperator(false);
        setOpenSinSexoValue(false);
        setOpenPuedeCriarOperator(false);
        setOpenPuedeCriarValue(false);
        setOpenHasMegaFormsOperator(false);
        setOpenHasMegaFormsValue(false);

        setOpenHasGigaFormOperator(false);
        setOpenHasGigaFormValue(false);
        setOpenIsBabyPkmOperator(false);
        setOpenIsBabyPkmValue(false);
        setOpenIsMythicalPkmOperator(false);
        setOpenIsMythicalPkmValue(false);
        setOpenIsLegendaryPkmOperator(false);
        setOpenIsLegendaryPkmValue(false);

        setOpenAbilityScope(false);
        setOpenAbilityValue(false);

        setOpenTypeValue(false);
        setOpenEggGroupsValue(false);

        if(typeof onClearFilters === "function")
        {
            onClearFilters({
                query: null,
                filters: [],
                sort: {
                    field: DEFAULT_SORT_FIELD,
                    description: "ID",
                    path: DEFAULT_SORT_FIELD,
                    direction: DEFAULT_SORT_DIRECTION
                },
                items: sortPokemonItems(items, DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION)
            });
        }

        setOpen(false);
    }

    // Funcion Reutilizable que retorna el boton de anadir filtro
    const renderAddFilterAction = ({
        applyDisabled = false,
        addDisabled = applyDisabled,
        addLabel = "Añadir filtro",
        onAdd = handleAddCurrentFilter
    } = {}) =>
    {
        const currentQuery = buildCurrentFilterQuery();
        const isDuplicateFilter = isFilterAlreadyApplied(currentQuery);
        const addButtonTitle = isDuplicateFilter ? "Este filtro ya fue añadido" : "Añadir filtro";

        return (
            <button
                type="button"
                className="filtroAvanzadoPkmComponent-ActionFilterAdd"
                onClick={onAdd}
                disabled={addDisabled || isDuplicateFilter}
                title={addButtonTitle}
                aria-label={addButtonTitle}
            >
                {addLabel}
            </button>
        );
    };

    // Funcion Reutilizable que retorna los botones finales de aplicar y limpiar filtros
    const renderApplyClearFilterActions = ({
        applyLabel = "Aplicar filtros",
        clearLabel = "Limpiar filtros",
        onApply = handleApplyFieldFilter,
        onClear = handleClearFilters
    } = {}) =>
    (
        <div className="filtroAvanzadoPkmComponent-FilterActions filtroAvanzadoPkmComponent-ApplyClearActions">
            <button
                type="button"
                className="filtroAvanzadoPkmComponent-ActionFilterApply"
                onClick={onApply}
                disabled={(!Array.isArray(appliedFilters) || appliedFilters.length === 0) && !hasSortChanged}
                title="Aplicar filtros"
                aria-label="Aplicar filtros"
            >
                {applyLabel}
            </button>

            <button
                type="button"
                className="filtroAvanzadoPkmComponent-ActionFilterClear"
                onClick={onClear}
                title="Limpiar filtros"
                aria-label="Limpiar filtros"
            >
                {clearLabel}
            </button>

        </div>
    );

    // Funcion que renderiza los chips de filtros aplicados
    const renderAppliedFiltersChips = () =>
    {
        const hasAppliedFilters = Array.isArray(appliedFilters) && appliedFilters.length > 0;

        return (
            <div className="filtroAvanzadoPkmComponent-appliedFiltersBlock">
                <div className="filtroAvanzadoPkmComponent-appliedFiltersHeader">
                    <span>Filtros añadidos</span>

                    <button
                        type="button"
                        className="filtroAvanzadoPkmComponent-clearChipsButton"
                        onClick={handleClearAppliedFilters}
                        disabled={!hasAppliedFilters}
                        title={hasAppliedFilters ? "Limpiar todos los chips" : "No hay chips para limpiar"}
                        aria-label={hasAppliedFilters ? "Limpiar todos los chips" : "No hay chips para limpiar"}
                    >
                        Limpiar todos
                    </button>
                </div>

                {hasAppliedFilters ? (      
                    <div className="filtroAvanzadoPkmComponent-appliedFiltersList">
                        {appliedFilters.map(function(filter)
                        {
                            const filterId = String(filter?.id || "");
                            const filterFieldLabel = String(filter?.fieldLabel || filter?.description || filter?.field || "");
                            const filterOperatorLabel = String(filter?.operatorSymbol || filter?.operatorLabel || filter?.operator || "");
                            const filterOperatorTitleLabel = String(filter?.operatorLabel || filter?.operatorSymbol || filter?.operator || "");
                            const filterValueLabel = String(filter?.valueLabel || filter?.value || "");
                            const filterField = String(filter?.field || "");
                            const isTypeFilter = String(filter?.field || "") === "types";
                            const isColorFilter = String(filter?.field || "") === "color";
                            const isGenerationFilter = String(filter?.field || "") === "generation";
                            const isMalePercentageFilter = filterField === "malePercentage";
                            const isFemalePercentageFilter = filterField === "femalePercentage";
                            const isGenderPercentageFilter = isMalePercentageFilter || isFemalePercentageFilter;
                            const GenderPercentageIcon = isMalePercentageFilter ? IoMdMale : IoMdFemale;
                            const typeKey = String(filter?.value || "");
                            const filterSchemaData = filtersSchema.find(function(field)
                            {
                                return String(field?.field || "") === String(filter?.field || "");
                            }) || null;
                            const colorOptions = Array.isArray(filterSchemaData?.options) ? filterSchemaData.options : [];
                            const colorOption = colorOptions.find(function(option)
                                {
                                    return String(option?.key || "") === String(filter?.value || "");
                                });
                            const colorHex = colorOption?.color || "";
                            const generationOptions = Array.isArray(filterSchemaData?.options) ? filterSchemaData.options : [];
                            const generationOption = generationOptions.find(function(option)
                            {
                                return String(option?.key || "") === String(filter?.value || "");
                            });
                            const generationIconRoute = generationOption?.iconRoute || "";

                            return (
                                <div
                                    key={filterId}
                                    className="filtroAvanzadoPkmComponent-filterChip"
                                    title={
                                        `${filterFieldLabel} ` +
                                        `${filterOperatorTitleLabel} ` +
                                        `${filterValueLabel}`
                                    }
                                >
                                    <span className="filtroAvanzadoPkmComponent-filterChipContent">
                                        <span className="filtroAvanzadoPkmComponent-filterChipField">
                                            {isGenderPercentageFilter ? (
                                                <span className="filtroAvanzadoPkmComponent-filterChipGenderPercentField">
                                                    <span>%</span>
                                                    <GenderPercentageIcon
                                                        className={
                                                            "filtroAvanzadoPkmComponent-filterChipGenderPercentIcon" +
                                                            (isMalePercentageFilter ? " isMale" : " isFemale")
                                                        }
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : (
                                                filterFieldLabel
                                            )}
                                        </span>

                                        <span className="filtroAvanzadoPkmComponent-filterChipOperator">
                                            {filterOperatorLabel}
                                        </span>

                                        <span
                                            className={
                                                "filtroAvanzadoPkmComponent-filterChipValue" +
                                                (isTypeFilter ? " filtroAvanzadoPkmComponent-filterChipValueType" : "") +
                                                (isColorFilter ? " filtroAvanzadoPkmComponent-filterChipValueColor" : "") +
                                                (isGenerationFilter ? " filtroAvanzadoPkmComponent-filterChipValueGeneration" : "")
                                            }
                                        >
                                            {isTypeFilter ? (
                                                <Tipo tipo={typeKey || "Ninguno"} size="small" />
                                            ) : isColorFilter ? (
                                                <span className="filtroAvanzadoPkmComponent-filterChipColorNode">
                                                    <span
                                                        className="filtroAvanzadoPkmComponent-filterChipColorText"
                                                        style={{ color: colorHex || "#ffffff" }}
                                                    >
                                                        {filterValueLabel}
                                                    </span>

                                                    {colorHex ? (
                                                        <span
                                                            className="filtroAvanzadoPkmComponent-filterChipColorDot"
                                                            style={{
                                                                backgroundColor: colorHex,
                                                                borderColor: getColorDotBorder(colorHex)
                                                            }}
                                                            aria-hidden="true"
                                                        />
                                                    ) : null}
                                                </span>
                                            ) : isGenerationFilter ? (
                                                <span className="filtroAvanzadoPkmComponent-filterChipGenerationNode">
                                                   
                                                    {generationIconRoute ? (
                                                        <img
                                                            src={generationIconRoute}
                                                            alt={filterValueLabel || "Generación"}
                                                            className="filtroAvanzadoPkmComponent-filterChipGenerationIcon"
                                                        />
                                                    ) : null}
                                                    
                                                    <span className="filtroAvanzadoPkmComponent-filterChipGenerationText">
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
                                        className="filtroAvanzadoPkmComponent-filterChipRemove"
                                        onClick={() => handleRemoveAppliedFilter(filterId)}
                                        aria-label={"Quitar filtro " + filterFieldLabel}
                                        title="Quitar filtro"
                                    >
                                        <FiX className="filtroAvanzadoPkmComponent-filterChipRemoveIcon" aria-hidden="true" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="filtroAvanzadoPkmComponent-appliedFiltersList filtroAvanzadoPkmComponent-NoChips">
                        <span>Ninguno</span>
                    </div>
                )}

            </div>
        );
    };

    // Funcion Reutilizable que crea un input que filtra las opciones de los desplegables
    const renderOptionSearchInput = ({
        searchKey,
        placeholder = "Filtrar opciones..."
    } = {}) =>
    {
        const searchValue = getOptionSearchValue(searchKey);

        return (
            <div className="filtroAvanzadoPkmComponent-optionSearchRow">
                <div className="filtroAvanzadoPkmComponent-textInputPopper filtroAvanzadoPkmComponent-optionSearchPopper">
                    <div className="filtroAvanzadoPkmComponent-numberInputWrap">
                        <input
                            type="search"
                            inputMode="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={searchValue}
                            onChange={(e) =>
                            {
                                const nextValue = e.target.value;
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
                                "filtroAvanzadoPkmComponent-numberInput filtroAvanzadoPkmComponent-textInput filtroAvanzadoPkmComponent-optionSearchInput" +
                                (String(searchValue || "").trim() === "" ? " filtroAvanzadoPkmComponent-numberInputPlaceholderVisible" : "")
                            }
                            aria-label={placeholder}
                            placeholder={placeholder}
                            title={placeholder}
                        />

                        {searchValue ? (
                            <button
                                type="button"
                                className="filtroAvanzadoPkmComponent-numberInputClear"
                                onClick={() => clearOptionSearchValue(searchKey)}
                                aria-label="Limpiar búsqueda"
                                title="Limpiar búsqueda"
                            >
                                <FiX className="filtroAvanzadoPkmComponent-numberInputClearIcon" aria-hidden="true" />
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    };

    // Funcion que arma opcion no clickeable de "No se encontraron coincidencias" al usar el input de filtrado
    function renderEmptySearchResults()
    {
        return (
            <div className="filtroAvanzadoPkmComponent-emptySearchResults">
                No se encontraron coincidencias
            </div>
        );
    }


    //** --------------- Funciones Operadores Reutilizables - INICIO --------------- 

    // Operadores para campos numericos
    const renderNumberOperators = () => (

        <div className="filtroAvanzadoPkmComponent-numberSelectPopper" ref={numberSelectRef}>
            <div className="filtroAvanzadoPkmComponent-numberSelectTitle">
                Operador
            </div>

            <button
                type="button"
                className={"filtroAvanzadoPkmComponent-numberSelectButton" + (openNumberOperator ? " isOpen" : "")}
                onClick={() => setOpenNumberOperator(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openNumberOperator}
                aria-label={"Operador para filtros numéricos: " + selectedNumberOperatorData.label}
                title={selectedNumberOperatorData.label}
            >
                <span className="filtroAvanzadoPkmComponent-numberSelectButtonText">
                    {selectedNumberOperatorData.symbol}
                </span>
                <span
                    className={"filtroAvanzadoPkmComponent-numberSelectCaret" + (openNumberOperator ? " isOpen" : "")}
                    aria-hidden="true"
                >
                    <RiArrowDownSFill />
                </span>
            </button>

            {openNumberOperator && (
                <div className="filtroAvanzadoPkmComponent-numberSelectMenu" role="listbox" aria-label="Operadores numéricos">
                    {NUMBER_FILTER_OPERATORS.map(function(option)
                    {
                        const selected = option.key === selectedNumberOperator;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                className={"filtroAvanzadoPkmComponent-numberSelectOption" + (selected ? " selected" : "")}
                                onClick={() => handleSelectNumberOperator(option.key)}
                                role="option"
                                aria-selected={selected}
                                aria-label={option.label}
                                title={option.label}
                            >
                                <span className="filtroAvanzadoPkmComponent-numberSelectOptionSymbol">
                                    {option.symbol}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

    );

    // Operadores para campos de texto / enum
    const renderTextOperators = () => (

        <div className="filtroAvanzadoPkmComponent-numberSelectPopper" ref={textSelectRef}>
            <div className="filtroAvanzadoPkmComponent-TextSelectTitle">
                Operador
            </div>

            <button
                type="button"
                className={"filtroAvanzadoPkmComponent-numberSelectButton" + (openTextOperator ? " isOpen" : "")}
                onClick={() => setOpenTextOperator(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openTextOperator}
                aria-label={"Operador para filtros de texto: " + selectedTextOperatorData.label}
                title={selectedTextOperatorData.label}
            >
                <span className="filtroAvanzadoPkmComponent-numberSelectButtonText">
                    {selectedTextOperatorData.symbol}
                </span>
                <span
                    className={"filtroAvanzadoPkmComponent-numberSelectCaret" + (openTextOperator ? " isOpen" : "")}
                    aria-hidden="true"
                >
                    <RiArrowDownSFill />
                </span>
            </button>

            {openTextOperator && (
                <div className="filtroAvanzadoPkmComponent-numberSelectMenu" role="listbox" aria-label="Operadores de texto">
                    {TEXT_FILTER_OPERATORS.map(function(option)
                    {
                        const selected = option.key === selectedTextOperator;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                className={"filtroAvanzadoPkmComponent-numberSelectOption" + (selected ? " selected" : "")}
                                onClick={() => handleSelectTextOperator(option.key)}
                                role="option"
                                aria-selected={selected}
                                aria-label={option.label}
                                title={option.label}
                            >
                                <span className="filtroAvanzadoPkmComponent-numberSelectOptionSymbol">
                                    {option.symbol}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

    );

    //** --------------- Funciones Operadores Reutilizables - FIN --------------- 


    //** --------------- Funciones Inputs Reutilizables - INICIO --------------- 

    // Input para campos numericos
    const renderNumberInput = () => (
        
        <div className="filtroAvanzadoPkmComponent-numberInputPopper">
            <div className="filtroAvanzadoPkmComponent-numberInputTitle">
                Valor
            </div>

            <div className="filtroAvanzadoPkmComponent-numberInputWrap">
                <input
                    id="filtroAvanzadoPkm-numberInput"
                    type="search"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="done"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    min="0"
                    step={1}
                    placeholder="Escriba un número..."
                    value={numberInputValue}
                    onChange={handleNumberInputChange}
                    className={
                        "filtroAvanzadoPkmComponent-numberInput" +
                        (!String(numberInputValue || "").trim() ? " filtroAvanzadoPkmComponent-numberInputPlaceholderVisible" : "")
                    }
                    aria-label="Valor numérico del filtro"
                />

                {numberInputValue ? (
                    <button
                        type="button"
                        className="filtroAvanzadoPkmComponent-numberInputClear"
                        onClick={() => setNumberInputValue("")}
                        aria-label="Limpiar valor numérico"
                        title="Limpiar valor numérico"
                    >
                        <FiX className="filtroAvanzadoPkmComponent-numberInputClearIcon" aria-hidden="true" />
                    </button>
                ) : null}
            </div>
        </div>

    );

    // Input flotante para campos numericos con decimales
    const renderNumberFloatInput = () => (
        
        <div className="filtroAvanzadoPkmComponent-numberInputPopper">
            <div className="filtroAvanzadoPkmComponent-numberInputTitle">
                Valor
            </div>

            <div className="filtroAvanzadoPkmComponent-numberInputWrap">
                <input
                    id="filtroAvanzadoPkm-numberFloatInput"
                    type="search"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    enterKeyHint="done"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    min="0"
                    step="any"
                    placeholder="Escriba un número..."
                    value={numberFloatInputValue}
                    onChange={handleNumberFloatInputChange}
                    className={
                        "filtroAvanzadoPkmComponent-numberInput" +
                        (!String(numberFloatInputValue || "").trim() ? " filtroAvanzadoPkmComponent-numberInputPlaceholderVisible" : "")
                    }
                    aria-label="Valor numérico decimal del filtro"
                />

                {numberFloatInputValue ? (
                    <button
                        type="button"
                        className="filtroAvanzadoPkmComponent-numberInputClear"
                        onClick={() => setNumberFloatInputValue("")}
                        aria-label="Limpiar valor numérico decimal"
                        title="Limpiar valor numérico decimal"
                    >
                        <FiX className="filtroAvanzadoPkmComponent-numberInputClearIcon" aria-hidden="true" />
                    </button>
                ) : null}
            </div>
        </div>

    );

    // Input de texto
    const renderTextInput = () => (
        
        <div className="filtroAvanzadoPkmComponent-textInputPopper">
            <div className="filtroAvanzadoPkmComponent-numberInputTitle">
                Valor
            </div>

            <div className="filtroAvanzadoPkmComponent-numberInputWrap">
                <input
                    id="filtroAvanzadoPkm-textInput"
                    type="search"
                    inputMode="text"
                    enterKeyHint="done"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="Escriba un texto..."
                    value={displayTextInputValue}
                    onChange={handleDisplayTextInputChange}
                    className={
                        "filtroAvanzadoPkmComponent-numberInput filtroAvanzadoPkmComponent-textInput" +
                        (!String(displayTextInputValue || "").trim() ? " filtroAvanzadoPkmComponent-numberInputPlaceholderVisible" : "")
                    }
                    aria-label="Valor de texto del filtro"
                />

                {displayTextInputValue ? (
                    <button
                        type="button"
                        className="filtroAvanzadoPkmComponent-numberInputClear"
                        onClick={() => setDisplayTextInputValue("")}
                        aria-label="Limpiar valor de texto"
                        title="Limpiar valor de texto"
                    >
                        <FiX className="filtroAvanzadoPkmComponent-numberInputClearIcon" aria-hidden="true" />
                    </button>
                ) : null}
            </div>
        </div>

    );

    // Selector de valor enum reutilizable (Ej: Grupo Huevo)
    const renderEnumValueOptions = ({
        value = selectedEggGroupsValue,
        openValue = openEggGroupsValue,
        setOpenValue = setOpenEggGroupsValue,
        onSelect = handleSelectEggGroupsValue,
        valueRef = eggGroupsValueSelectRef,
        showSearchInput = false,
        searchKey = "eggGroups",
        searchPlaceholder = "Filtrar opciones..."
    } = {}) =>
    {
        const options = Array.isArray(selectedFieldData?.options) ? selectedFieldData.options : [];
        const filteredOptions = filterOptionsByDescription(options, getOptionSearchValue(searchKey));
        const selectedOption = options.find(function(option)
        {
            return String(option?.key || "") === String(value || "");

        }) || options[0] || null;

        return (
            <div className="filtroAvanzadoPkmComponent-fieldSelectPopper" ref={valueRef}>
                <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                    Valor
                </div>

                {showSearchInput ? renderOptionSearchInput({
                    searchKey,
                    placeholder: searchPlaceholder
                }) : null}

                <button
                    type="button"
                    className={
                        "filtroAvanzadoPkmComponent-fieldSelectButton " +
                        (openValue ? " isOpen" : "")
                    }
                    onClick={() => setOpenValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openValue}
                    aria-label={"Valor para filtrar: " + (selectedOption?.description || "Sin valor")}
                    title={selectedOption?.description || "Sin valor"}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldSelectButtonText">
                        {selectedOption ? selectedOption.description : "Valor"}
                    </span>
                    <span
                        className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openValue ? " isOpen" : "")}
                        aria-hidden="true"
                    >
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openValue && (
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Opciones de valor">
                        <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(function(option)
                                {
                                    const optionKey = String(option?.key || "");
                                    const selected = optionKey === String(value || "");

                                    return (
                                        <button
                                            key={optionKey}
                                            type="button"
                                            className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => onSelect(optionKey)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-label={option.description}
                                            title={option.description}
                                        >
                                            <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                                {option.description}
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
    };


    //** --------------- Funciones Inputs Reutilizables - FIN --------------- 


    //** --------------- Funciones Inputs por Atributo - INICIO --------------- 

    // Filtro de campo "ID"
    const renderIdFilter = () => (
        <div className="filtroAvanzadoPkmComponent-idFilterBlock">
            <div className="filtroAvanzadoPkmComponent-idFilterRow filtroAvanzadoPkmComponent-idFilterRowOperator">
                {renderNumberOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-idFilterRow filtroAvanzadoPkmComponent-idFilterRowValue">
                {renderNumberInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-idFilterRow filtroAvanzadoPkmComponent-idFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(numberInputValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Operadores para el campo "Nombre"
    const renderDisplayOperators = () => (

        <div className="filtroAvanzadoPkmComponent-numberSelectPopper" ref={displaySelectRef}>
            <div className="filtroAvanzadoPkmComponent-TextSelectTitle">
                Operador
            </div>

            <button
                type="button"
                className={"filtroAvanzadoPkmComponent-numberSelectButton" + (openDisplayOperator ? " isOpen" : "")}
                onClick={() => setOpenDisplayOperator(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openDisplayOperator}
                aria-label={"Operador para nombre: " + selectedDisplayOperatorData.label}
                title={selectedDisplayOperatorData.label}
            >
                <span className="filtroAvanzadoPkmComponent-numberSelectButtonText">
                    {selectedDisplayOperatorData.symbol}
                </span>
                <span
                    className={"filtroAvanzadoPkmComponent-numberSelectCaret" + (openDisplayOperator ? " isOpen" : "")}
                    aria-hidden="true"
                >
                    <RiArrowDownSFill />
                </span>
            </button>

            {openDisplayOperator && (
                <div className="filtroAvanzadoPkmComponent-numberSelectMenu" role="listbox" aria-label="Operadores de nombre">
                    {TEXT_FILTER_OPERATORS.map(function(option)
                    {
                        const selected = option.key === selectedDisplayOperator;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                className={"filtroAvanzadoPkmComponent-numberSelectOption" + (selected ? " selected" : "")}
                                onClick={() => handleSelectDisplayOperator(option.key)}
                                role="option"
                                aria-selected={selected}
                                aria-label={option.label}
                                title={option.label}
                            >
                                <span className="filtroAvanzadoPkmComponent-numberSelectOptionSymbol">
                                    {option.symbol}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

    );

    // Filtro de campo "Nombre"
    const renderDisplayFilter = () => (
        <div className="filtroAvanzadoPkmComponent-DisplayFilterBlock">
            <div className="filtroAvanzadoPkmComponent-DisplayFilterRow filtroAvanzadoPkmComponent-DisplayFilterRowOperator">
                {renderDisplayOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-DisplayFilterRow filtroAvanzadoPkmComponent-DisplayFilterRowValue">
                {renderTextInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-DisplayFilterRow filtroAvanzadoPkmComponent-DisplayFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(displayTextInputValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Operadores para el campo "Generación"
    const renderGenerationOperators = () => (

        <div className="filtroAvanzadoPkmComponent-numberSelectPopper" ref={generationSelectRef}>
            <div className="filtroAvanzadoPkmComponent-TextSelectTitle">
                Operador
            </div>

            <button
                type="button"
                className={"filtroAvanzadoPkmComponent-numberSelectButton" + (openGenerationOperator ? " isOpen" : "")}
                onClick={() => setOpenGenerationOperator(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openGenerationOperator}
                aria-label={"Operador para filtros de generación: " + selectedGenerationOperatorData.label}
                title={selectedGenerationOperatorData.label}
            >
                <span className="filtroAvanzadoPkmComponent-numberSelectButtonText">
                    {selectedGenerationOperatorData.symbol}
                </span>
                <span
                    className={"filtroAvanzadoPkmComponent-numberSelectCaret" + (openGenerationOperator ? " isOpen" : "")}
                    aria-hidden="true"
                >
                    <RiArrowDownSFill />
                </span>
            </button>

            {openGenerationOperator && (
                <div className="filtroAvanzadoPkmComponent-numberSelectMenu" role="listbox" aria-label="Operadores de generación">
                    {BOUNDED_TEXT_FILTER_OPERATORS.map(function(option)
                    {
                        const selected = option.key === selectedGenerationOperator;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                className={"filtroAvanzadoPkmComponent-numberSelectOption" + (selected ? " selected" : "")}
                                onClick={() => handleSelectGenerationOperator(option.key)}
                                role="option"
                                aria-selected={selected}
                                aria-label={option.label}
                                title={option.label}
                            >
                                <span className="filtroAvanzadoPkmComponent-numberSelectOptionSymbol">
                                    {option.symbol}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

    );

    // Selector de opciones para el campo "Generación"
    const renderGenerationEnumValueOptions = () =>
    {
        const options = Array.isArray(selectedFieldData?.options)
            ? [...selectedFieldData.options].sort(function(a, b)
            {
                const orderA = Number(a?.order ?? 0);
                const orderB = Number(b?.order ?? 0);

                return orderA - orderB;
            })
            : [];
        const filteredOptions = filterOptionsByDescription(options, getOptionSearchValue("generation"));
        const selectedOption = options.find(function(option)
        {
            return String(option?.key || "") === String(selectedGenerationValue || "");

        }) || options[0] || null;

        return (
            <div className="filtroAvanzadoPkmComponent-fieldSelectPopper-GenerationPkm" ref={generationValueSelectRef}>
                <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                    Valor
                </div>

                <button
                    type="button"
                    className={
                        "filtroAvanzadoPkmComponent-fieldSelectButton filtroAvanzadoPkmComponent-fieldSelectButtonTypeCentered" +
                        (openGenerationValue ? " isOpen" : "")
                    }
                    onClick={() => setOpenGenerationValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openGenerationValue}
                    aria-label={"Valor para filtrar: " + (selectedOption?.description || "Sin valor")}
                    title={selectedOption?.description || "Sin valor"}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldSelectButtonNode">
                        
                        {selectedOption?.iconRoute ? (
                            <img
                                src={selectedOption.iconRoute}
                                alt={selectedOption?.description || "Generación"}
                                className="filtroAvanzadoPkmComponent-fieldSelectOptionIcon"
                                title={selectedOption?.description || "Generación"}
                            />
                        ) : null}

                        <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                            {selectedOption?.description || "Sin valor"}
                        </span>

                    </span>
                    <span
                        className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openGenerationValue ? " isOpen" : "")}
                        aria-hidden="true"
                    >
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openGenerationValue && (
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Opciones de generación">
                        <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(function(option)
                                {
                                    const optionKey = String(option?.key || "");
                                    const selected = optionKey === String(selectedGenerationValue || "");

                                    return (
                                        <button
                                            key={optionKey}
                                            type="button"
                                            className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => handleSelectGenerationValue(optionKey)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-label={option.description}
                                            title={option.description}
                                        >
                                            <span className="filtroAvanzadoPkmComponent-fieldSelectOptionNode">

                                                {option?.iconRoute ? (
                                                    <img
                                                        src={option.iconRoute}
                                                        alt={option.description || "Generación"}
                                                        className="filtroAvanzadoPkmComponent-fieldSelectOptionIcon"
                                                    />
                                                ) : null}

                                                <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                                    {option.description}
                                                </span>
    
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
    };

    // Filtro de campo "Generación"
    const renderGenerationFilter = () => (
        <div className="filtroAvanzadoPkmComponent-GenerationFilterBlock">
            <div className="filtroAvanzadoPkmComponent-GenerationFilterRow filtroAvanzadoPkmComponent-GenerationFilterRowOperator">
                {renderGenerationOperators()}
            </div>

            {renderOptionSearchInput({
                searchKey: "generation",
                placeholder: "Filtrar generaciones..."
            })}

            <div className="filtroAvanzadoPkmComponent-GenerationFilterRow filtroAvanzadoPkmComponent-GenerationFilterRowValue">
                {renderGenerationEnumValueOptions()}
            </div>

            <div className="filtroAvanzadoPkmComponent-GenerationFilterRow filtroAvanzadoPkmComponent-GenerationFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(selectedGenerationValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Selector de opciones para el campo "Tipo"
    const renderTypeEnumValueOptions = () =>
    {
        const options = Array.isArray(selectedFieldData?.options)
            ? [...selectedFieldData.options].sort(function(a, b)
            {
                const orderA = Number(a?.order ?? 0);
                const orderB = Number(b?.order ?? 0);

                return orderA - orderB;
            })
            : [];
        const filteredOptions = filterOptionsByDescription(options, getOptionSearchValue("types"));
        const selectedOption = options.find(function(option)
        {
            return String(option?.key || "") === String(selectedTypeValue || "");

        }) || options[0] || null;

        return (
            <div className="filtroAvanzadoPkmComponent-fieldSelectPopper-TypesPkm" ref={typeValueSelectRef}>
                <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                    Valor
                </div>

                {renderOptionSearchInput({
                    searchKey: "types",
                    placeholder: "Filtrar tipos..."
                })}

                <button
                    type="button"
                    className={
                        "filtroAvanzadoPkmComponent-fieldSelectButton filtroAvanzadoPkmComponent-fieldSelectButtonTypeCentered" +
                        (openTypeValue ? " isOpen" : "")
                    }
                    onClick={() => setOpenTypeValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openTypeValue}
                    aria-label={"Valor para filtrar: " + (selectedOption?.description || "Sin valor")}
                    title={selectedOption?.description || "Sin valor"}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldSelectButtonNode">
                        <Tipo tipo={selectedOption?.key || "Ninguno"} size="small" />
                    </span>
                    <span
                        className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openTypeValue ? " isOpen" : "")}
                        aria-hidden="true"
                    >
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openTypeValue && (
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Opciones de valor">
                        <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(function(option)
                                {
                                    const optionKey = String(option?.key || "");
                                    const selected = optionKey === String(selectedTypeValue || "");

                                    return (
                                        <button
                                            key={optionKey}
                                            type="button"
                                            className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => handleSelectTypeValue(optionKey)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-label={option.description}
                                            title={option.description}
                                        >
                                            <Tipo tipo={optionKey} size="small" />
                                        </button>
                                    );
                                })
                            ) : renderEmptySearchResults()}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Filtro de campo "Tipo"
    const renderTypesFilter = () => (
        <div className="filtroAvanzadoPkmComponent-TypesFilterBlock">
            <div className="filtroAvanzadoPkmComponent-TypesFilterRow filtroAvanzadoPkmComponent-TypesFilterRowOperator">
                {renderTextOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-TypesFilterRow filtroAvanzadoPkmComponent-TypesFilterRowValue">
                {renderTypeEnumValueOptions()}
            </div>

            <div className="filtroAvanzadoPkmComponent-TypesFilterRow filtroAvanzadoPkmComponent-TypesFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(selectedTypeValue || "").trim() === ""
                })}
            </div>

        </div>
    );

    
    // Filtro de campo "Peso"
    const renderWeightFilter = () => (
        <div className="filtroAvanzadoPkmComponent-WeightFilterBlock">
            <div className="filtroAvanzadoPkmComponent-WeightFilterRow filtroAvanzadoPkmComponent-WeightFilterRowOperator">
                {renderNumberOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-WeightFilterRow filtroAvanzadoPkmComponent-WeightFilterRowValue">
                {renderNumberFloatInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-WeightFilterRow filtroAvanzadoPkmComponent-WeightFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(numberFloatInputValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Filtro de campo "Altura"
    const renderHeightFilter = () => (
        <div className="filtroAvanzadoPkmComponent-HeightFilterBlock">
            <div className="filtroAvanzadoPkmComponent-HeightFilterRow filtroAvanzadoPkmComponent-HeightFilterRowOperator">
                {renderNumberOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-HeightFilterRow filtroAvanzadoPkmComponent-HeightFilterRowValue">
                {renderNumberFloatInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-HeightFilterRow filtroAvanzadoPkmComponent-HeightFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(numberFloatInputValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Operadores para el campo "Color"
    const renderColorOperators = () => (

        <div className="filtroAvanzadoPkmComponent-numberSelectPopper" ref={colorSelectRef}>
            <div className="filtroAvanzadoPkmComponent-TextSelectTitle">
                Operador
            </div>

            <button
                type="button"
                className={"filtroAvanzadoPkmComponent-numberSelectButton" + (openColorOperator ? " isOpen" : "")}
                onClick={() => setOpenColorOperator(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openColorOperator}
                aria-label={"Operador para filtros de color: " + selectedColorOperatorData.label}
                title={selectedColorOperatorData.label}
            >
                <span className="filtroAvanzadoPkmComponent-numberSelectButtonText">
                    {selectedColorOperatorData.symbol}
                </span>
                <span
                    className={"filtroAvanzadoPkmComponent-numberSelectCaret" + (openColorOperator ? " isOpen" : "")}
                    aria-hidden="true"
                >
                    <RiArrowDownSFill />
                </span>
            </button>

            {openColorOperator && (
                <div className="filtroAvanzadoPkmComponent-numberSelectMenu" role="listbox" aria-label="Operadores de color">
                    {BOUNDED_TEXT_FILTER_OPERATORS.map(function(option)
                    {
                        const selected = option.key === selectedColorOperator;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                className={"filtroAvanzadoPkmComponent-numberSelectOption" + (selected ? " selected" : "")}
                                onClick={() => handleSelectColorOperator(option.key)}
                                role="option"
                                aria-selected={selected}
                                aria-label={option.label}
                                title={option.label}
                            >
                                <span className="filtroAvanzadoPkmComponent-numberSelectOptionSymbol">
                                    {option.symbol}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

    );

    // Selector de opciones para el campo "Color"
    const renderColorEnumValueOptions = () =>
    {
        const options = Array.isArray(selectedFieldData?.options) ? selectedFieldData.options : [];
        const filteredOptions = filterOptionsByDescription(options, getOptionSearchValue("color"));
        const selectedOption = options.find(function(option)
        {
            return String(option?.key || "") === String(selectedColorValue || "");

        }) || options[0] || null;

        return (
            <div className="filtroAvanzadoPkmComponent-fieldSelectPopper-ColorPkm" ref={colorValueSelectRef}>
                <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                    Valor
                </div>

                {renderOptionSearchInput({
                    searchKey: "color",
                    placeholder: "Filtrar colores..."
                })}

                <button
                    type="button"
                    className={
                        "filtroAvanzadoPkmComponent-fieldSelectButton filtroAvanzadoPkmComponent-fieldSelectButtonTypeCentered" +
                        (openColorValue ? " isOpen" : "")
                    }
                    onClick={() => setOpenColorValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openColorValue}
                    aria-label={"Valor para filtrar: " + (selectedOption?.description || "Sin valor")}
                    title={selectedOption?.description || "Sin valor"}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldSelectButtonNode">
                        <span
                            className="filtroAvanzadoPkmComponent-fieldSelectColorText"
                            style={{ color: selectedOption?.color || "#ffffff" }}
                        >
                            {selectedOption?.description || "Sin valor"}
                        </span>

                        {selectedOption?.color ? (
                            <span
                                className="filtroAvanzadoPkmComponent-fieldSelectColorDot"
                                style={{
                                    backgroundColor: selectedOption.color,
                                    borderColor: getColorDotBorder(selectedOption.color)
                                }}
                                aria-hidden="true"
                            />
                        ) : null}
                    </span>

                    <span
                        className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openColorValue ? " isOpen" : "")}
                        aria-hidden="true"
                    >
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openColorValue && (
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Opciones de color">
                        <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(function(option)
                                {
                                    const optionKey = String(option?.key || "");
                                    const selected = optionKey === String(selectedColorValue || "");

                                    return (
                                        <button
                                            key={optionKey}
                                            type="button"
                                            className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => handleSelectColorValue(optionKey)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-label={option.description}
                                            title={option.description}
                                        >
                                            <span className="filtroAvanzadoPkmComponent-fieldSelectColorNode">
                                                <span
                                                    className="filtroAvanzadoPkmComponent-fieldSelectColorText"
                                                    style={{ color: option?.color || "#ffffff" }}
                                                >
                                                    {option.description}
                                                </span>

                                                {option?.color ? (
                                                    <span
                                                        className="filtroAvanzadoPkmComponent-fieldSelectColorDot"
                                                        style={{
                                                            backgroundColor: option.color,
                                                            borderColor: getColorDotBorder(option.color)
                                                        }}
                                                        aria-hidden="true"
                                                    />
                                                ) : null}
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
    };

    // Filtro de campo "Color"
    const renderColorFilter = () => (
        <div className="filtroAvanzadoPkmComponent-GenerationFilterBlock">
            <div className="filtroAvanzadoPkmComponent-GenerationFilterRow filtroAvanzadoPkmComponent-GenerationFilterRowOperator">
                {renderColorOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-GenerationFilterRow filtroAvanzadoPkmComponent-GenerationFilterRowValue">
                {renderColorEnumValueOptions()}
            </div>

            <div className="filtroAvanzadoPkmComponent-GenerationFilterRow filtroAvanzadoPkmComponent-GenerationFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(selectedColorValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Selector de filtrado de campo "Habilidad": Todas, Principal, Secundaria u Oculta
    const renderAbilityScopeOptions = () =>
    {
        const options = [
            { key: "all", label: "Todas" },
            { key: "primary", label: "Principal" },
            { key: "secondary", label: "Secundaria" },
            { key: "hidden", label: "Oculta" }
        ];

        const selectedOption = options.find(function(option)
        {
            return option.key === selectedAbilityScope;

        }) || options[0];

        return (
            <div className="filtroAvanzadoPkmComponent-fieldSelectPopper-AbilityScopePkm" ref={abilityScopeSelectRef}>
                <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                    Tipo de Habilidad
                </div>

                <button
                    type="button"
                    className={"filtroAvanzadoPkmComponent-fieldSelectButton " + (openAbilityScope ? " isOpen" : "")}
                    onClick={() => setOpenAbilityScope(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openAbilityScope}
                    aria-label={"Ámbito de habilidad: " + (selectedOption?.label || "Todas")}
                    title={selectedOption?.label || "Todas"}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldSelectButtonNode">
                        <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                            {selectedOption?.label || "Todas"}
                        </span>
                    </span>
                    <span
                        className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openAbilityScope ? " isOpen" : "")}
                        aria-hidden="true"
                    >
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openAbilityScope && (
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Ámbitos de habilidad">
                        <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                            {options.map(function(option)
                            {
                                const selected = option.key === selectedAbilityScope;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                        onClick={() => handleSelectAbilityScope(option.key)}
                                        role="option"
                                        aria-selected={selected}
                                        aria-label={option.label}
                                        title={option.label}
                                    >
                                        <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Selector de opciones para el campo "Habilidad"
    const renderAbilitiesEnumValueOptions = ({
        value,
        openValue,
        setOpenValue,
        onSelect,
        valueRef
    }) =>
    {
        const options = Array.isArray(selectedFieldData?.options) ? selectedFieldData.options : [];
        const filteredOptions = filterOptionsByDescription(options, getOptionSearchValue("abilities"));
        const selectedOption = options.find(function(option)
        {
            return String(option?.key || "") === String(value || "");

        }) || options[0] || null;

        return (
            <div className="filtroAvanzadoPkmComponent-fieldSelectPopper-AbilityValuePkm" ref={valueRef}>
                <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                    Valor
                </div>

                {renderOptionSearchInput({
                    searchKey: "abilities",
                    placeholder: "Filtrar habilidades..."
                })}

                <button
                    type="button"
                    className={"filtroAvanzadoPkmComponent-fieldSelectButton " + (openValue ? " isOpen" : "")}
                    onClick={() => setOpenValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openValue}
                    aria-label={"Valor para habilidades: " + (selectedOption?.description || "Sin valor")}
                    title={selectedOption?.description || "Sin valor"}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldSelectButtonNode">
                        <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                            {selectedOption ? selectedOption.description : "Valor"}
                        </span>
                    </span>

                    <span
                        className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openValue ? " isOpen" : "")}
                        aria-hidden="true"
                    >
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openValue && (
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Opciones de habilidades">
                        <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(function(option)
                                {
                                    const optionKey = String(option?.key || "");
                                    const selected = optionKey === String(value || "");

                                    return (
                                        <button
                                            key={optionKey}
                                            type="button"
                                            className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => onSelect(optionKey)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-label={option.description}
                                            title={option.description}
                                        >
                                            <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                                {option.description}
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
    };

    // Filtro de campo "Habilidad"
    const renderAbilitiesFilter = () => (
        <div className="filtroAvanzadoPkmComponent-AbilitiesFilterBlock">
            <div className="filtroAvanzadoPkmComponent-AbilitiesFilterRow filtroAvanzadoPkmComponent-AbilitiesFilterRowOperator">
                {renderTextOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-AbilitiesFilterRow filtroAvanzadoPkmComponent-AbilitiesFilterRowScope">
                {renderAbilityScopeOptions()}
            </div>

            <div className="filtroAvanzadoPkmComponent-AbilitiesFilterRow filtroAvanzadoPkmComponent-AbilitiesFilterRowValue">
                {renderAbilitiesEnumValueOptions({
                    value: selectedAbilityValue,
                    openValue: openAbilityValue,
                    setOpenValue: setOpenAbilityValue,
                    onSelect: handleSelectAbilityValue,
                    valueRef: abilityValueSelectRef
                })}
            </div>

            <div className="filtroAvanzadoPkmComponent-AbilitiesFilterRow filtroAvanzadoPkmComponent-AbilitiesFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(selectedAbilityValue || "").trim() === ""
                })}
            </div>
        </div>
    );

    
    // Funcion Auxiliar base para filtros numericos de campos "Stats"
    const renderStatNumberFilter = (blockClass) => (
        <div className={`filtroAvanzadoPkmComponent-statsNumericFilterBlock ${blockClass}`}>
            <div className="filtroAvanzadoPkmComponent-statsNumericFilterRow filtroAvanzadoPkmComponent-statsNumericFilterRowOperator">
                {renderNumberOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-statsNumericFilterRow filtroAvanzadoPkmComponent-statsNumericFilterRowValue">
                {renderNumberInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-statsNumericFilterRow filtroAvanzadoPkmComponent-statsNumericFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(numberInputValue || "").trim() === ""
                })}
            </div>
        </div>
    );

    // Filtro de campo "PS Base"
    const renderHpFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-HpFilterBlock");
    // Filtro de campo "PE PS"
    const renderEffortHpFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-EffortHpFilterBlock");
    

    // Filtro de campo "Ataque Base"
    const renderAtkFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-AtkFilterBlock");
    // Filtro de campo "PE Ataque"
    const renderEffortAtkFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-EffortAtkFilterBlock");
    

    // Filtro de campo "Defensa Base"
    const renderDefFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-DefFilterBlock");
    // Filtro de campo "PE Defensa"
    const renderEffortDefFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-EffortDefFilterBlock");
    

    // Filtro de campo "At. Esp. Base"
    const renderSpeAtkFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-SpeAtkFilterBlock");
    // Filtro de campo "PE At. Esp."
    const renderEffortSpeAtkFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-EffortSpeAtkFilterBlock");
    

    // Filtro de campo "Def. Esp. Base"
    const renderSpeDefFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-SpeDefFilterBlock");
    // Filtro de campo "PE Def. Esp."
    const renderEffortSpeDefFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-EffortSpeDefFilterBlock");


    // Filtro de campo "Velocidad Base"
    const renderSpeedFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-SpeedFilterBlock");
    // Filtro de campo PE "Velocidad"
    const renderEffortSpeedFilter = () => renderStatNumberFilter("filtroAvanzadoPkmComponent-EffortSpeedFilterBlock");

    
    // Filtro de campo "Porcentaje Macho"
    const renderMalePercentageFilter = () => (
        <div className="filtroAvanzadoPkmComponent-MalePercentageFilterBlock">
            <div className="filtroAvanzadoPkmComponent-MalePercentageFilterRow filtroAvanzadoPkmComponent-MalePercentageFilterRowOperator">
                {renderNumberOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-MalePercentageFilterRow filtroAvanzadoPkmComponent-MalePercentageFilterRowValue">
                {renderNumberFloatInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-MalePercentageFilterRow filtroAvanzadoPkmComponent-MalePercentageFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(numberFloatInputValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Filtro de campo "Porcentaje Hembra"
    const renderFemalePercentageFilter = () => (
        <div className="filtroAvanzadoPkmComponent-FemalePercentageFilterBlock">
            <div className="filtroAvanzadoPkmComponent-FemalePercentageFilterRow filtroAvanzadoPkmComponent-FemalePercentageFilterRowOperator">
                {renderNumberOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-FemalePercentageFilterRow filtroAvanzadoPkmComponent-FemalePercentageFilterRowValue">
                {renderNumberFloatInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-FemalePercentageFilterRow filtroAvanzadoPkmComponent-FemalePercentageFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(numberFloatInputValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Filtro de campo "Indice de Captura"
    const renderCaptureRateFilter = () => (
        <div className="filtroAvanzadoPkmComponent-captureRateFilterBlock">
            <div className="filtroAvanzadoPkmComponent-captureRateFilterRow filtroAvanzadoPkmComponent-captureRateFilterRowOperator">
                {renderNumberOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-captureRateFilterRow filtroAvanzadoPkmComponent-captureRateFilterRowValue">
                {renderNumberInput()}
            </div>

            <div className="filtroAvanzadoPkmComponent-captureRateFilterRow filtroAvanzadoPkmComponent-captureRateFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(numberInputValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Funcion Reutilizable para Atributos Booleanos (Si/No)
    const renderBooleanPkmFilter = ({
        classPrefix,
        popperClassSuffix = classPrefix,
        label,
        openOperator,
        setOpenOperator,
        selectedOperator,
        selectedOperatorData,
        onSelectOperator,
        operatorRef,
        openValue,
        setOpenValue,
        selectedValue,
        onSelectValue,
        valueRef
    }) =>
    {
        const options = [
            { key: "true", description: "Sí" },
            { key: "false", description: "No" }
        ];
        const selectedOption = options.find(function(option)
        {
            return String(option?.key || "") === String(selectedValue || "");

        }) || options[0] || null;

        return (
            <div className={`filtroAvanzadoPkmComponent-${classPrefix}FilterBlock`}>
                <div className={`filtroAvanzadoPkmComponent-${classPrefix}FilterRow filtroAvanzadoPkmComponent-${classPrefix}FilterRowOperator`}>
                    <div className="filtroAvanzadoPkmComponent-numberSelectPopper" ref={operatorRef}>
                        <div className="filtroAvanzadoPkmComponent-TextSelectTitle">
                            Operador
                        </div>

                        <button
                            type="button"
                            className={"filtroAvanzadoPkmComponent-numberSelectButton" + (openOperator ? " isOpen" : "")}
                            onClick={() => setOpenOperator(function(prev) { return !prev; })}
                            aria-haspopup="listbox"
                            aria-expanded={openOperator}
                            aria-label={"Operador para " + label + ": " + selectedOperatorData.label}
                            title={selectedOperatorData.label}
                        >
                            <span className="filtroAvanzadoPkmComponent-numberSelectButtonText">
                                {selectedOperatorData.symbol}
                            </span>
                            <span
                                className={"filtroAvanzadoPkmComponent-numberSelectCaret" + (openOperator ? " isOpen" : "")}
                                aria-hidden="true"
                            >
                                <RiArrowDownSFill />
                            </span>
                        </button>

                        {openOperator && (
                            <div className="filtroAvanzadoPkmComponent-numberSelectMenu" role="listbox" aria-label={"Operadores de " + label}>
                                {[{ key: "eq", label: "=", symbol: "=" }].map(function(option)
                                {
                                    const selected = option.key === selectedOperator;

                                    return (
                                        <button
                                            key={option.key}
                                            type="button"
                                            className={"filtroAvanzadoPkmComponent-numberSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => onSelectOperator(option.key)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-label={option.label}
                                            title={option.label}
                                        >
                                            <span className="filtroAvanzadoPkmComponent-numberSelectOptionSymbol">
                                                =
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className={`filtroAvanzadoPkmComponent-${classPrefix}FilterRow filtroAvanzadoPkmComponent-${classPrefix}FilterRowValue`}>
                    <div className={`filtroAvanzadoPkmComponent-fieldSelectPopper-${popperClassSuffix}`} ref={valueRef}>
                        <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                            Valor
                        </div>

                        <button
                            type="button"
                            className={"filtroAvanzadoPkmComponent-fieldSelectButton filtroAvanzadoPkmComponent-fieldSelectButtonTypeCentered" + (openValue ? " isOpen" : "")}
                            onClick={() => setOpenValue(function(prev) { return !prev; })}
                            aria-haspopup="listbox"
                            aria-expanded={openValue}
                            aria-label={"Valor para " + label + ": " + (selectedOption?.description || "Sin valor")}
                            title={selectedOption?.description || "Sin valor"}
                        >
                            <span className="filtroAvanzadoPkmComponent-fieldSelectButtonNode">
                                <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                    {selectedOption ? selectedOption.description : "Valor"}
                                </span>
                            </span>

                            <span
                                className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openValue ? " isOpen" : "")}
                                aria-hidden="true"
                            >
                                <RiArrowDownSFill />
                            </span>
                        </button>

                        {openValue && (
                            <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label={"Opciones de " + label}>
                                <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                                    {options.map(function(option)
                                    {
                                        const optionKey = String(option?.key || "");
                                        const selected = optionKey === String(selectedValue || "");

                                        return (
                                            <button
                                                key={optionKey}
                                                type="button"
                                                className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                                onClick={() => onSelectValue(optionKey)}
                                                role="option"
                                                aria-selected={selected}
                                                aria-label={option.description}
                                                title={option.description}
                                            >
                                                <span className="filtroAvanzadoPkmComponent-fieldSelectOptionNode">
                                                    <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                                        {option.description}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`filtroAvanzadoPkmComponent-${classPrefix}FilterRow filtroAvanzadoPkmComponent-${classPrefix}FilterActionsRow`}>
                    {renderAddFilterAction({
                        applyDisabled: !selectedFieldData || String(selectedValue || "").trim() === ""
                    })}
                </div>
            </div>
        );
    };

    // Filtro de campo "Sin Sexo"
    const renderSinSexoFilter = () => renderBooleanPkmFilter({
        classPrefix: "SinSexo",
        popperClassSuffix: "SinSexoPkm",
        label: "sin sexo",
        openOperator: openSinSexoOperator,
        setOpenOperator: setOpenSinSexoOperator,
        selectedOperator: selectedSinSexoOperator,
        selectedOperatorData: selectedSinSexoOperatorData,
        onSelectOperator: handleSelectSinSexoOperator,
        operatorRef: sinSexoSelectRef,
        openValue: openSinSexoValue,
        setOpenValue: setOpenSinSexoValue,
        selectedValue: selectedSinSexoValue,
        onSelectValue: handleSelectSinSexoValue,
        valueRef: sinSexoValueSelectRef
    });
    
    // Filtro de campo "Puede Criar"
    const renderPuedeCriarFilter = () => renderBooleanPkmFilter({
        classPrefix: "PuedeCriar",
        popperClassSuffix: "PuedeCriarPkm",
        label: "puede criar",
        openOperator: openPuedeCriarOperator,
        setOpenOperator: setOpenPuedeCriarOperator,
        selectedOperator: selectedPuedeCriarOperator,
        selectedOperatorData: selectedPuedeCriarOperatorData,
        onSelectOperator: handleSelectPuedeCriarOperator,
        operatorRef: puedeCriarSelectRef,
        openValue: openPuedeCriarValue,
        setOpenValue: setOpenPuedeCriarValue,
        selectedValue: selectedPuedeCriarValue,
        onSelectValue: handleSelectPuedeCriarValue,
        valueRef: puedeCriarValueSelectRef
    });

    // Filtro de campo "Posee Megas"
    const renderHasMegaFormsFilter = () => renderBooleanPkmFilter({
        classPrefix: "HasMegaForms",
        popperClassSuffix: "HasMegaFormsPkm",
        label: "posee mega-evoluciones",
        openOperator: openHasMegaFormsOperator,
        setOpenOperator: setOpenHasMegaFormsOperator,
        selectedOperator: selectedHasMegaFormsOperator,
        selectedOperatorData: selectedHasMegaFormsOperatorData,
        onSelectOperator: handleSelectHasMegaFormsOperator,
        operatorRef: hasMegaFormsSelectRef,
        openValue: openHasMegaFormsValue,
        setOpenValue: setOpenHasMegaFormsValue,
        selectedValue: selectedHasMegaFormsValue,
        onSelectValue: handleSelectHasMegaFormsValue,
        valueRef: hasMegaFormsValueSelectRef
    });

    // Filtro de campo "Posee Gigamax"
    const renderHasGigaFormFilter = () => renderBooleanPkmFilter({
        classPrefix: "HasGigaForm",
        popperClassSuffix: "HasGigaFormPkm",
        label: "posee Gigamax",
        openOperator: openHasGigaFormOperator,
        setOpenOperator: setOpenHasGigaFormOperator,
        selectedOperator: selectedHasGigaFormOperator,
        selectedOperatorData: selectedHasGigaFormOperatorData,
        onSelectOperator: handleSelectHasGigaFormOperator,
        operatorRef: hasGigaFormSelectRef,
        openValue: openHasGigaFormValue,
        setOpenValue: setOpenHasGigaFormValue,
        selectedValue: selectedHasGigaFormValue,
        onSelectValue: handleSelectHasGigaFormValue,
        valueRef: hasGigaFormValueSelectRef
    });

    // Filtro de campo "Es Pokemon Bebe"
    const renderIsBabyPkmFilter = () => renderBooleanPkmFilter({
        classPrefix: "IsBabyPkm",
        label: "es un Pokémon bebé",
        openOperator: openIsBabyPkmOperator,
        setOpenOperator: setOpenIsBabyPkmOperator,
        selectedOperator: selectedIsBabyPkmOperator,
        selectedOperatorData: selectedIsBabyPkmOperatorData,
        onSelectOperator: handleSelectIsBabyPkmOperator,
        operatorRef: isBabyPkmSelectRef,
        openValue: openIsBabyPkmValue,
        setOpenValue: setOpenIsBabyPkmValue,
        selectedValue: selectedIsBabyPkmValue,
        onSelectValue: handleSelectIsBabyPkmValue,
        valueRef: isBabyPkmValueSelectRef
    });

    // Filtro de campo "Es Pokémon Mítico/Singular"
    const renderIsMythicalPkmFilter = () => renderBooleanPkmFilter({
        classPrefix: "IsMythicalPkm",
        label: "es un Pokémon mítico/singular",
        openOperator: openIsMythicalPkmOperator,
        setOpenOperator: setOpenIsMythicalPkmOperator,
        selectedOperator: selectedIsMythicalPkmOperator,
        selectedOperatorData: selectedIsMythicalPkmOperatorData,
        onSelectOperator: handleSelectIsMythicalPkmOperator,
        operatorRef: isMythicalPkmSelectRef,
        openValue: openIsMythicalPkmValue,
        setOpenValue: setOpenIsMythicalPkmValue,
        selectedValue: selectedIsMythicalPkmValue,
        onSelectValue: handleSelectIsMythicalPkmValue,
        valueRef: isMythicalPkmValueSelectRef
    });

    // Filtro de campo "Es Pokémon Legendario"
    const renderIsLegendaryPkmFilter = () => renderBooleanPkmFilter({
        classPrefix: "IsLegendaryPkm",
        label: "es un Pokémon legendario",
        openOperator: openIsLegendaryPkmOperator,
        setOpenOperator: setOpenIsLegendaryPkmOperator,
        selectedOperator: selectedIsLegendaryPkmOperator,
        selectedOperatorData: selectedIsLegendaryPkmOperatorData,
        onSelectOperator: handleSelectIsLegendaryPkmOperator,
        operatorRef: isLegendaryPkmSelectRef,
        openValue: openIsLegendaryPkmValue,
        setOpenValue: setOpenIsLegendaryPkmValue,
        selectedValue: selectedIsLegendaryPkmValue,
        onSelectValue: handleSelectIsLegendaryPkmValue,
        valueRef: isLegendaryPkmValueSelectRef
    });

    // Filtro de campo "Es Mega Evolucion"
    const renderIsMegaFormFilter = () => renderBooleanPkmFilter({
        classPrefix: "IsMegaForm",
        label: "es Mega Evolución",
        openOperator: openIsMegaFormOperator,
        setOpenOperator: setOpenIsMegaFormOperator,
        selectedOperator: selectedIsMegaFormOperator,
        selectedOperatorData: selectedIsMegaFormOperatorData,
        onSelectOperator: handleSelectIsMegaFormOperator,
        operatorRef: isMegaFormSelectRef,
        openValue: openIsMegaFormValue,
        setOpenValue: setOpenIsMegaFormValue,
        selectedValue: selectedIsMegaFormValue,
        onSelectValue: handleSelectIsMegaFormValue,
        valueRef: isMegaFormValueSelectRef
    });

    // Filtro de campo "Es Forma Gigamax"
    const renderIsGigaFormFilter = () => renderBooleanPkmFilter({
        classPrefix: "IsGigaForm",
        label: "es Forma Gigamax",
        openOperator: openIsGigaFormOperator,
        setOpenOperator: setOpenIsGigaFormOperator,
        selectedOperator: selectedIsGigaFormOperator,
        selectedOperatorData: selectedIsGigaFormOperatorData,
        onSelectOperator: handleSelectIsGigaFormOperator,
        operatorRef: isGigaFormSelectRef,
        openValue: openIsGigaFormValue,
        setOpenValue: setOpenIsGigaFormValue,
        selectedValue: selectedIsGigaFormValue,
        onSelectValue: handleSelectIsGigaFormValue,
        valueRef: isGigaFormValueSelectRef
    });


    // Filtro de campo "Grupos Huevo"
    const renderEggGroupsFilter = () => (
        <div className="filtroAvanzadoPkmComponent-EggGroupsFilterBlock">
            <div className="filtroAvanzadoPkmComponent-EggGroupsFilterRow filtroAvanzadoPkmComponent-EggGroupsFilterRowOperator">
                {renderTextOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-EggGroupsFilterRow filtroAvanzadoPkmComponent-EggGroupsFilterRowValue">
                {renderEnumValueOptions({
                    showSearchInput: true,
                    searchKey: "eggGroups",
                    searchPlaceholder: "Filtrar grupos huevo..."
                })}
            </div>

            <div className="filtroAvanzadoPkmComponent-EggGroupsFilterRow filtroAvanzadoPkmComponent-EggGroupsFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(selectedEggGroupsValue || "").trim() === ""
                })}
            </div>

        </div>
    );

    
    // Operadores para el campo "Categoría"
    const renderCategoryOperators = () => (

        <div className="filtroAvanzadoPkmComponent-numberSelectPopper" ref={categorySelectRef}>
            <div className="filtroAvanzadoPkmComponent-TextSelectTitle">
                Operador
            </div>

            <button
                type="button"
                className={"filtroAvanzadoPkmComponent-numberSelectButton" + (openCategoryOperator ? " isOpen" : "")}
                onClick={() => setOpenCategoryOperator(function(prev) { return !prev; })}
                aria-haspopup="listbox"
                aria-expanded={openCategoryOperator}
                aria-label={"Operador para categoría: " + selectedCategoryOperatorData.label}
                title={selectedCategoryOperatorData.label}
            >
                <span className="filtroAvanzadoPkmComponent-numberSelectButtonText">
                    {selectedCategoryOperatorData.symbol}
                </span>
                <span
                    className={"filtroAvanzadoPkmComponent-numberSelectCaret" + (openCategoryOperator ? " isOpen" : "")}
                    aria-hidden="true"
                >
                    <RiArrowDownSFill />
                </span>
            </button>

            {openCategoryOperator && (
                <div className="filtroAvanzadoPkmComponent-numberSelectMenu" role="listbox" aria-label="Operadores de categoría">
                    {BOUNDED_TEXT_FILTER_OPERATORS.map(function(option)
                    {
                        const selected = option.key === selectedCategoryOperator;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                className={"filtroAvanzadoPkmComponent-numberSelectOption" + (selected ? " selected" : "")}
                                onClick={() => handleSelectCategoryOperator(option.key)}
                                role="option"
                                aria-selected={selected}
                                aria-label={option.label}
                                title={option.label}
                            >
                                <span className="filtroAvanzadoPkmComponent-numberSelectOptionSymbol">
                                    {option.symbol}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

    );

    // Selector de opciones para el campo "Categoría"
    const renderCategoryEnumValueOptions = () =>
    {
        const options = Array.isArray(selectedFieldData?.options) ? [...selectedFieldData.options] : [];
        const filteredOptions = filterOptionsByDescription(options, getOptionSearchValue("category"));
        const selectedOption = options.find(function(option)
        {
            return String(option?.key || "") === String(selectedCategoryValue || "");

        }) || options[0] || null;

        return (
            <div className="filtroAvanzadoPkmComponent-fieldSelectPopper-CategoryPkm" ref={categoryValueSelectRef}>
                <div className="filtroAvanzadoPkmComponent-ValueSelectTitle">
                    Valor
                </div>

                {renderOptionSearchInput({
                    searchKey: "category",
                    placeholder: "Filtrar categorías..."
                })}

                <button
                    type="button"
                    className={"filtroAvanzadoPkmComponent-fieldSelectButton filtroAvanzadoPkmComponent-fieldSelectButtonTypeCentered" + (openCategoryValue ? " isOpen" : "")}
                    onClick={() => setOpenCategoryValue(function(prev) { return !prev; })}
                    aria-haspopup="listbox"
                    aria-expanded={openCategoryValue}
                    aria-label={"Valor para categoría: " + (selectedOption?.description || "Sin valor")}
                    title={selectedOption?.description || "Sin valor"}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldSelectButtonNode">
                        <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                            {selectedOption ? selectedOption.description : "Valor"}
                        </span>
                    </span>

                    <span
                        className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openCategoryValue ? " isOpen" : "")}
                        aria-hidden="true"
                    >
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openCategoryValue && (
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Opciones de categoría">
                        <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(function(option)
                                {
                                    const optionKey = String(option?.key || "");
                                    const selected = optionKey === String(selectedCategoryValue || "");

                                    return (
                                        <button
                                            key={optionKey}
                                            type="button"
                                            className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                            onClick={() => handleSelectCategoryValue(optionKey)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-label={option.description}
                                            title={option.description}
                                        >
                                            <span className="filtroAvanzadoPkmComponent-fieldSelectOptionNode">
                                                <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                                    {option.description}
                                                </span>
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
    };

    // Filtro de campo "Categoría"
    const renderCategoryFilter = () => (
        <div className="filtroAvanzadoPkmComponent-CategoryFilterBlock">
            <div className="filtroAvanzadoPkmComponent-CategoryFilterRow filtroAvanzadoPkmComponent-CategoryFilterRowOperator">
                {renderCategoryOperators()}
            </div>

            <div className="filtroAvanzadoPkmComponent-CategoryFilterRow filtroAvanzadoPkmComponent-CategoryFilterRowValue">
                {renderCategoryEnumValueOptions()}
            </div>

            <div className="filtroAvanzadoPkmComponent-CategoryFilterRow filtroAvanzadoPkmComponent-CategoryFilterActionsRow">
                {renderAddFilterAction({
                    applyDisabled: !selectedFieldData || String(selectedCategoryValue || "").trim() === ""
                })}
            </div>

        </div>
    );


    // Funcion auxiliar para renderizar label + icono para "Porcentaje Macho" y "Porcentaje Hembra"
    function renderFieldOptionLabelWithIcon(field)
    {
        const fieldKey = String(field?.field || "");
        const fieldDescription = String(field?.description || "");
        const isMalePercentageField = fieldKey === "malePercentage";
        const isFemalePercentageField = fieldKey === "femalePercentage";

        if(!isMalePercentageField && !isFemalePercentageField)
        {
            return fieldDescription;
        }

        const GenderPercentageIcon = isMalePercentageField ? IoMdMale : IoMdFemale;

        return (
            <span className="filtroAvanzadoPkmComponent-fieldSelectGenderOptionNode">
                <span className="filtroAvanzadoPkmComponent-fieldSelectGenderOptionText">
                    {fieldDescription}
                </span>

                <GenderPercentageIcon
                    className={
                        "filtroAvanzadoPkmComponent-fieldSelectGenderOptionIcon" +
                        (isMalePercentageField ? " isMale" : " isFemale")
                    }
                    aria-hidden="true"
                />
            </span>
        );
    }

    // Selector de grupo para filtrar las opciones de atributo
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
                className={"filtroAvanzadoPkmComponent-fieldGroupSelectPopper" + (openGroupKey ? " isOpen" : "")}
                ref={selectRef}
            >
                <button
                    type="button"
                    className={"filtroAvanzadoPkmComponent-fieldSelectButton filtroAvanzadoPkmComponent-fieldGroupSelectButton" + (openGroupKey ? " isOpen" : "")}
                    onClick={onToggleOpen}
                    aria-haspopup="listbox"
                    aria-expanded={openGroupKey}
                    title={selectedGroupDescription}
                >
                    <span className="filtroAvanzadoPkmComponent-fieldGroupSelectButtonText">
                        {selectedGroupDescription}
                    </span>
                    <span className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openGroupKey ? " isOpen" : "")} aria-hidden="true">
                        <RiArrowDownSFill />
                    </span>
                </button>

                {openGroupKey && (
                    <div className="filtroAvanzadoPkmComponent-fieldGroupSelectMenu" role="listbox" aria-label="Grupos de atributos">
                        {FIELD_GROUP_OPTIONS.map(function(groupOption)
                        {
                            const groupKey = String(groupOption?.key || "");
                            const selected = groupKey === currentGroupKey;

                            return (
                                <button
                                    key={groupKey}
                                    type="button"
                                    className={"filtroAvanzadoPkmComponent-fieldSelectOption filtroAvanzadoPkmComponent-fieldGroupSelectOption" + (selected ? " selected" : "")}
                                    onClick={() => onSelectGroupKey(groupKey)}
                                    role="option"
                                    aria-selected={selected}
                                    title={groupOption.description}
                                >
                                    <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                        {groupOption.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }


    // Filtro de Orden: Atributo + Asc o Dsc
    const renderSortFilter = () =>
    {
        const sortDirectionLabel = selectedSortDirection === "asc" ? "Ascendente (De menor a mayor)" : "Descendente (De mayor a menor)";
        const SortDirectionIcon = selectedSortDirection === "asc" ? HiOutlineSortAscending : HiOutlineSortDescending;
        const filteredSortFieldOptions = getFilteredSortFieldOptionsByGroup(selectedSortFieldGroupKey);

        const sortFieldLabel = String(selectedSortFieldData?.description || "ID");
        const sortDirectionKey = selectedSortDirection === "desc" ? "DESC" : "ASC";
        const sortDirectionText = selectedSortDirection === "desc" ? "De Mayor a Menor" : "De Menor a Mayor";
        const sortChipLabel = `${sortFieldLabel} ${sortDirectionKey} (${sortDirectionText})`;
        const sortChipLabelDirection = `${sortDirectionKey} (${sortDirectionText})`;


        return (
            <div className="filtroAvanzadoPkmComponent-sortFilterBlock">
                <div className="filtroAvanzadoPkmComponent-fieldSelectTitle">
                    Ordenar por
                </div>

                <div className="filtroAvanzadoPkmComponent-sortFilterSearchRow">
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

                    {/* Boton Ascendente / Descendente */}
                    <button
                        type="button"
                        className="filtroAvanzadoPkmComponent-sortDirectionButton"
                        onClick={handleToggleSortDirection}
                        title={sortDirectionLabel}
                        aria-label={"Orden: " + sortDirectionLabel.toLowerCase()}
                    >
                        <SortDirectionIcon className="filtroAvanzadoPkmComponent-sortDirectionIcon" aria-hidden="true" />
                    </button>
                </div>

                <div className="filtroAvanzadoPkmComponent-sortFilterControlsRow">
                    {renderOptionSearchInput({
                        searchKey: "sortField",
                        placeholder: "Filtrar atributos..."
                    })}
                </div>

                <div className="filtroAvanzadoPkmComponent-sortFilterControlsRow">
                    
                    {/* Atributo a Ordenar */}
                    <div className="filtroAvanzadoPkmComponent-fieldSelectPopper filtroAvanzadoPkmComponent-sortFieldSelectPopper" ref={sortFieldSelectRef}>
                        <button
                            type="button"
                            className={"filtroAvanzadoPkmComponent-fieldSelectButton filtroAvanzadoPkmComponent-sortFieldSelectButton" + (openSortFieldValue ? " isOpen" : "")}
                            onClick={() =>
                            {
                                setOpenSortFieldGroupKey(false);
                                setOpenFieldValue(false);
                                setOpenFieldGroupKey(false);
                                setOpenSortFieldValue(function(prev) { return !prev; });
                            }}
                            aria-haspopup="listbox"
                            aria-expanded={openSortFieldValue}
                            aria-label={"Campo para ordenar: " + (selectedSortFieldData?.description || "ID")}
                            title={selectedSortFieldData?.description || "ID"}
                        >
                            <span className="filtroAvanzadoPkmComponent-fieldSelectButtonText">
                                {selectedSortFieldData ? renderFieldOptionLabelWithIcon(selectedSortFieldData) : "ID"}
                            </span>
                            <span
                                className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openSortFieldValue ? " isOpen" : "")}
                                aria-hidden="true"
                            >
                                <RiArrowDownSFill />
                            </span>
                        </button>

                        {openSortFieldValue && (
                            <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Campos para ordenar">
                                <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                                    {filteredSortFieldOptions.length > 0 ? (
                                        filteredSortFieldOptions.map(function(field)
                                        {
                                            const fieldId = getFieldSelectionId(field);
                                            const selected = fieldId === (selectedSortFieldValue || "");

                                            return (
                                                <button
                                                    key={fieldId}
                                                    type="button"
                                                    className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                                    onClick={() => handleSelectSortField(fieldId)}
                                                    role="option"
                                                    aria-selected={selected}
                                                    aria-label={field.description}
                                                    title={field.description}
                                                >
                                                    <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                                        {renderFieldOptionLabelWithIcon(field)}
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
                    className="filtroAvanzadoPkmComponent-sortInfoChip filtroAvanzadoPkmComponent-sortInfoChipDirection filtroAvanzadoPkmComponent-sortInfoChipHasTooltip"
                    tabIndex={0}
                    aria-label={"Ordenamiento: " + sortChipLabel}
                >           
                    {sortChipLabelDirection}

                    <div className="filtroAvanzadoPkmComponent-sortInfoChipTooltip" role="tooltip">
                        {"Ordenamiento: " + sortChipLabel}
                    </div>
                </div> 

            </div>
        );
    };

    // Selector de Campo a filtrar (Id, Peso, Altura, etc)
    const renderFieldOptions = () =>
    {
        const filteredFieldOptions = getFilteredFieldOptionsByGroup(selectedFieldGroupKey);

        return (

        <div className="filtroAvanzadoPkmComponent-fieldSelectPopper filtroAvanzadoPkmComponent-fieldContainer" ref={fieldSelectRef}>
            <div className="filtroAvanzadoPkmComponent-fieldSelectTitle">
                Atributo
            </div>

            {renderFieldGroupKeyOptions({
                selectedGroupKey: selectedFieldGroupKey,
                openGroupKey: openFieldGroupKey,
                selectRef: fieldGroupSelectRef,
                onToggleOpen: function()
                {
                    setOpenSortFieldGroupKey(false);
                    setOpenSortFieldValue(false);
                    setOpenFieldValue(false);
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
                className={"filtroAvanzadoPkmComponent-fieldSelectButton" + (openFieldValue ? " isOpen" : "")}
                onClick={() =>
                {
                    setOpenFieldGroupKey(false);
                    setOpenSortFieldGroupKey(false);
                    setOpenSortFieldValue(false);
                    setOpenFieldValue(function(prev) { return !prev; });
                }}
                aria-haspopup="listbox"
                aria-expanded={openFieldValue}
                aria-label={"Campo para filtrar: " + (selectedFieldData?.description || "Sin campo")}
                title={selectedFieldData?.description || "Sin campo"}
            >
                <span className="filtroAvanzadoPkmComponent-fieldSelectButtonText">
                    {selectedFieldData ? renderFieldOptionLabelWithIcon(selectedFieldData) : "Campo"}
                </span>
                <span
                    className={"filtroAvanzadoPkmComponent-fieldSelectCaret" + (openFieldValue ? " isOpen" : "")}
                    aria-hidden="true"
                >
                    <RiArrowDownSFill />
                </span>
            </button>

            {openFieldValue && (
                <div className="filtroAvanzadoPkmComponent-fieldSelectMenu" role="listbox" aria-label="Campos para filtrar">
                    <div className="filtroAvanzadoPkmComponent-fieldSelectMenuBody">
                        {filteredFieldOptions.length > 0 ? (
                            filteredFieldOptions.map(function(field)
                            {
                                const fieldId = getFieldSelectionId(field);
                                const selected = fieldId === (selectedFieldValue || "");

                                return (
                                    <button
                                        key={fieldId}
                                        type="button"
                                        className={"filtroAvanzadoPkmComponent-fieldSelectOption" + (selected ? " selected" : "")}
                                        onClick={() => handleSelectField(fieldId)}
                                        role="option"
                                        aria-selected={selected}
                                        aria-label={field.description}
                                        title={field.description}
                                    >
                                        <span className="filtroAvanzadoPkmComponent-fieldSelectOptionText">
                                            {renderFieldOptionLabelWithIcon(field)}
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
    };

    // Funcion principal que renderiza un Input de Filtro en base al Atributo seleccionado
    const renderFieldFilter = () =>
    {
        const fieldKey = selectedFieldData?.field || "";

        switch(fieldKey)
        {
            case "id":
                return renderIdFilter();
            case "weight":
                return renderWeightFilter();
            case "height":
                return renderHeightFilter();
            case "captureRate":
                return renderCaptureRateFilter();
            case "malePercentage":
                return renderMalePercentageFilter();
            case "femalePercentage":
                return renderFemalePercentageFilter();
            case "generation":
                return renderGenerationFilter();
            case "categoryPkm":
                return renderCategoryFilter();
            case "sinSexo":
                return renderSinSexoFilter();
            case "puedeCriar":
                return renderPuedeCriarFilter();
            case "hasMegaForms":
                return renderHasMegaFormsFilter();       
            case "hasGigaForm":
                return renderHasGigaFormFilter();
            case "isBabyPkm":
                return renderIsBabyPkmFilter();
            case "isMythicalPkm":
                return renderIsMythicalPkmFilter();
            case "isLegendaryPkm":
                return renderIsLegendaryPkmFilter();
            case "isMegaForm":
                return renderIsMegaFormFilter();
            case "isGigaForm":
                return renderIsGigaFormFilter();
            case "color":
                return renderColorFilter();
            case "types":
                return renderTypesFilter();
            case "eggGroups":
                return renderEggGroupsFilter();
            case "display":
                return renderDisplayFilter();
            case "hp":
                return renderHpFilter();
            case "effort_hp":
                return renderEffortHpFilter();
            case "atk":
                return renderAtkFilter();
            case "effort_atk":
                return renderEffortAtkFilter();
            case "def":
                return renderDefFilter();
            case "effort_def":
                return renderEffortDefFilter();
            case "spe_atk":
                return renderSpeAtkFilter();
            case "effort_spe_atk":
                return renderEffortSpeAtkFilter();
            case "spe_def":
                return renderSpeDefFilter();
            case "effort_spe_def":
                return renderEffortSpeDefFilter();
            case "speed":
                return renderSpeedFilter();
            case "effort_speed":
                return renderEffortSpeedFilter();
            case "abilities":
                return renderAbilitiesFilter();

            default:
                return renderIdFilter();
        }
    };

    //** --------------- Funciones Inputs por Atributo - FIN --------------- 

    // Filtro Lateral 
    const drawerContent = (
        <div
            className="filtroAvanzadoPkmComponent-backdrop"
            onClick={closeDrawer}
            role="presentation"
        >

            {/* Overlay */}
            <div
                className={"filtroAvanzadoPkmComponent-overlay" + (open ? " open" : "")}
                aria-hidden="true"
            />

            {/* Panel lateral */}
            <aside
                className={"filtroAvanzadoPkmComponent-drawer" + (open ? " open" : "")}
                aria-label="Filtros avanzados de Pokémon"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Parte Arriba: Titulo + Total Filtrados + Boton cerrar Filtro */}
                <div className="filtroAvanzadoPkmComponent-drawerHeader">
                    
                    {/* Titulo + Total Filtrados */}
                    <div className="filtroAvanzadoPkmComponent-drawerHeaderText">
                        <span className="filtroAvanzadoPkmComponent-drawerTitle">Filtro Avanzado Pokémon</span>
                        <span className="filtroAvanzadoPkmComponent-drawerSubtitle">
                            {formatNumberWithDots(displayTotalItems)} Pokémon {Number(displayTotalItems) === 1 ? "encontrado" : "encontrados"}
                        </span>
                    </div>

                    {/* Boton cerrar Filtro */}
                    <button
                        type="button"
                        className="filtroAvanzadoPkmComponent-close"
                        onClick={closeDrawer}
                        aria-label="Cerrar filtros"
                        title="Cerrar filtros"
                    >
                        <FiX className="filtroAvanzadoPkmComponent-closeIcon" aria-hidden="true" />
                    </button>

                </div>

                {/* Parte Abajo */}
                <div className="filtroAvanzadoPkmComponent-drawerBody">
                    
                    {!ready ? (
                        <LoadingPkm
                            inline={true}
                            classNameLoadingConatainer={"filtroAvanzadoPkmComponent-loadingContainer"}
                            classNameLoadingText={"filtroAvanzadoPkmComponent-loadingText"}
                            classNameLoadingIcon={"filtroAvanzadoPkmComponent-loadingIcon"}
                            text={"Cargando Filtros..."}
                        />
                    ) : (
                        <div className="filtroAvanzadoPkmComponent-filtersContent">

                            <div className="filtroAvanzadoPkmComponent-schemaList">

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
        <div className="filtroAvanzadoPkmComponent">

            {/* Boton abrir filtro */}
            <button
                type="button"
                className="filtroAvanzadoPkmComponent-toggle"
                onClick={openDrawer}
                aria-label="Abrir filtros avanzados"
                aria-expanded={open}
                title="Abrir filtros avanzados"
            >
                <span className="filtroAvanzadoPkmComponent-toggleText">Filtros</span>
                <FaFilter className="filtroAvanzadoPkmComponent-toggleIcon" aria-hidden="true" />
            </button>

            {/* Filtro Lateral */}
            {open && portalTarget ? createPortal(drawerContent, portalTarget) : null}

        </div>
    );

}