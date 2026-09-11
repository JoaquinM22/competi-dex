//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoPkmComponents\competidexAdvancedPkmFilters.js

export const ADVANCED_PKM_DEFAULT_SORT_FIELD = "id";
export const ADVANCED_PKM_DEFAULT_SORT_DIRECTION = "asc";

export const ADVANCED_PKM_NUMBER_FILTER_OPERATORS = [
    { key: "eq", label: "Igual a", symbol: "=" },
    { key: "ne", label: "Distinto de", symbol: "!=" },
    { key: "lt", label: "Menor que", symbol: "<" },
    { key: "gt", label: "Mayor que", symbol: ">" },
    { key: "lte", label: "Menor o igual", symbol: "≤" },
    { key: "gte", label: "Mayor o igual", symbol: "≥" }
];

export const ADVANCED_PKM_TEXT_FILTER_OPERATORS = [
    { key: "contains", label: "Contiene", symbol: "⊃" },
    { key: "not_contains", label: "No contiene", symbol: "⊅" },
    { key: "eq", label: "Igual a", symbol: "=" },
    { key: "ne", label: "Distinto de", symbol: "!=" }
];

export const ADVANCED_PKM_BOUNDED_TEXT_FILTER_OPERATORS = [
    { key: "eq", label: "Igual a", symbol: "=" },
    { key: "ne", label: "Distinto de", symbol: "!=" }
];

const ADVANCED_PKM_ENUM_CONTAINS_FIELDS = new Set([
    "types",
    "abilities",
    "eggGroups"
]);

export function getAdvancedPkmFieldSelectionId(field)
{
    if(!field) return "";

    return `${String(field.field || "")}__${String(field.description || "")}`;
}

export function normalizeAdvancedPkmText(input)
{
    return String(input || "")
        .toLowerCase()
        .replace(/♀/g, " hembra ")
        .replace(/♂/g, " macho ")
        .replace(/\bfemale\b/g, " hembra ")
        .replace(/\bmale\b/g, " macho ")
        .normalize("NFD").replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

export function getAdvancedPkmValueByPath(source, path)
{
    if(!source || !path) return undefined;

    return String(path)
        .split(".")
        .reduce(function(acc, key)
        {
            if(acc === null || acc === undefined) return undefined;
            return acc[key];
        }, source);
}

export function getAdvancedPkmOperatorData(operatorKey, fieldType = "", fieldKey = "")
{
    const type = String(fieldType || "");
    const operator = String(operatorKey || "");
    const field = String(fieldKey || "");
    const source = type === "number"
        ? ADVANCED_PKM_NUMBER_FILTER_OPERATORS
        : type === "text" || (type === "enum" && ADVANCED_PKM_ENUM_CONTAINS_FIELDS.has(field))
            ? ADVANCED_PKM_TEXT_FILTER_OPERATORS
            : ADVANCED_PKM_BOUNDED_TEXT_FILTER_OPERATORS;

    return source.find(function(option)
    {
        return String(option?.key || "") === operator;
    }) || source[0] || null;
}

export function getAdvancedPkmOptionDescriptionByKey(options, key)
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

export function getAdvancedPkmFilterValueLabel(fieldData, value)
{
    const fieldType = String(fieldData?.type || "");

    if(fieldType === "boolean")
    {
        return value === true || String(value).toLowerCase() === "true" ? "Sí" : "No";
    }

    if(Array.isArray(fieldData?.options) && fieldData.options.length > 0)
    {
        return getAdvancedPkmOptionDescriptionByKey(fieldData.options, value);
    }

    return String(value ?? "");
}

function parseAdvancedPkmNumberValue(rawValue)
{
    const normalizedValue = String(rawValue ?? "").trim().replace(",", ".");
    if(!normalizedValue) return NaN;

    return Number(normalizedValue);
}

function isValidAdvancedPkmNumberValue(fieldData, value)
{
    if(!Number.isFinite(value)) return false;

    const field = String(fieldData?.field || "");

    if(field === "id")
    {
        return Number.isInteger(value) && value >= 0;
    }

    if(field === "captureRate")
    {
        return Number.isInteger(value) && value >= 0;
    }

    return value >= 0;
}

function isValidAdvancedPkmBooleanValue(rawValue)
{
    const normalizedValue = String(rawValue).trim().toLowerCase();
    return normalizedValue === "true" || normalizedValue === "false";
}

function isValidAdvancedPkmOptionValue(fieldData, value)
{
    const options = Array.isArray(fieldData?.options) ? fieldData.options : [];
    if(!options.length) return true;

    const normalizedValue = String(value || "").trim();
    if(!normalizedValue) return false;

    return options.some(function(option)
    {
        return String(option?.key || "").trim() === normalizedValue;
    });
}

export function hydrateAdvancedPkmFilter(rawFilter, filtersSchema = [])
{
    const schema = Array.isArray(filtersSchema) ? filtersSchema : [];
    const fieldKey = String(rawFilter?.field || "");
    const fieldData = schema.find(function(field)
    {
        return String(field?.field || "") === fieldKey;
    });

    if(!fieldData) return null;

    const fieldType = String(fieldData.type || "");
    const rawValue = rawFilter?.value;
    const value = fieldType === "number"
        ? parseAdvancedPkmNumberValue(rawValue)
        : fieldType === "boolean"
            ? String(rawValue).trim().toLowerCase() === "true"
            : String(rawValue ?? "");
    const operatorData = getAdvancedPkmOperatorData(rawFilter?.operator, fieldType, fieldKey);
    const requestedOperator = String(rawFilter?.operator || "");

    if(fieldType === "number" && !isValidAdvancedPkmNumberValue(fieldData, value)) return null;
    if(fieldType === "boolean" && !isValidAdvancedPkmBooleanValue(rawValue)) return null;
    if(fieldType === "enum" && !isValidAdvancedPkmOptionValue(fieldData, value)) return null;
    if(!operatorData) return null;
    if(String(operatorData.key || "") !== requestedOperator) return null;

    return {
        id: String(rawFilter?.id || ""),
        field: String(fieldData.field || ""),
        description: String(fieldData.description || ""),
        fieldLabel: String(rawFilter?.fieldLabel || fieldData.description || fieldData.field || ""),
        path: String(fieldData.path || fieldData.field || ""),
        type: fieldType,
        operator: String(operatorData.key || ""),
        operatorLabel: String(operatorData.label || ""),
        operatorSymbol: String(operatorData.symbol || ""),
        value: value,
        valueLabel: getAdvancedPkmFilterValueLabel(fieldData, value),
        slot: rawFilter?.slot ?? null
    };
}

export function hydrateAdvancedPkmFilters(rawFilters = [], filtersSchema = [])
{
    return (Array.isArray(rawFilters) ? rawFilters : [])
        .map(function(rawFilter, index)
        {
            return hydrateAdvancedPkmFilter({
                ...rawFilter,
                id: rawFilter?.id || `filter-chip-${index + 1}`
            }, filtersSchema);
        })
        .filter(Boolean);
}

export function getAdvancedPkmSortFieldData(filtersSchema = [], sortFieldValue = ADVANCED_PKM_DEFAULT_SORT_FIELD)
{
    const schema = Array.isArray(filtersSchema) ? filtersSchema : [];
    const target = String(sortFieldValue || ADVANCED_PKM_DEFAULT_SORT_FIELD);

    return schema.find(function(field)
    {
        return getAdvancedPkmFieldSelectionId(field) === target;
    }) || schema.find(function(field)
    {
        return String(field?.field || "") === target;
    }) || schema.find(function(field)
    {
        return String(field?.field || "") === ADVANCED_PKM_DEFAULT_SORT_FIELD;
    }) || null;
}

export function hydrateAdvancedPkmSort(rawSort = null, filtersSchema = [])
{
    const rawField = String(rawSort?.field || ADVANCED_PKM_DEFAULT_SORT_FIELD);
    const direction = String(rawSort?.direction || ADVANCED_PKM_DEFAULT_SORT_DIRECTION).toLowerCase() === "desc"
        ? "desc"
        : "asc";
    const fieldData = getAdvancedPkmSortFieldData(filtersSchema, rawField);

    return {
        field: fieldData ? String(fieldData.field || ADVANCED_PKM_DEFAULT_SORT_FIELD) : ADVANCED_PKM_DEFAULT_SORT_FIELD,
        description: fieldData ? String(fieldData.description || "ID") : "ID",
        path: fieldData ? String(fieldData.path || fieldData.field || ADVANCED_PKM_DEFAULT_SORT_FIELD) : ADVANCED_PKM_DEFAULT_SORT_FIELD,
        direction: direction
    };
}

export function getAdvancedPkmSortFieldValue(item, fieldData)
{
    const rawValue = getAdvancedPkmValueByPath(item, fieldData?.path || fieldData?.field);

    if(Array.isArray(rawValue))
    {
        const firstValue = rawValue[0];

        if(firstValue && typeof firstValue === "object")
        {
            return firstValue.name || firstValue.key || firstValue.value || "";
        }

        return firstValue ?? "";
    }

    return rawValue ?? "";
}

export function sortAdvancedPkmItems(sourceItems, sortFieldValue, sortDirection, filtersSchema = [])
{
    const list = Array.isArray(sourceItems) ? sourceItems.slice() : [];
    const fieldData = getAdvancedPkmSortFieldData(filtersSchema, sortFieldValue);

    if(!fieldData)
    {
        return list;
    }

    const directionMultiplier = sortDirection === "desc" ? -1 : 1;

    return list.sort(function(a, b)
    {
        const valueA = getAdvancedPkmSortFieldValue(a, fieldData);
        const valueB = getAdvancedPkmSortFieldValue(b, fieldData);
        const numberA = Number(valueA);
        const numberB = Number(valueB);

        if(Number.isFinite(numberA) && Number.isFinite(numberB))
        {
            return (numberA - numberB) * directionMultiplier;
        }

        return String(valueA).localeCompare(String(valueB), "es", {
            numeric: true,
            sensitivity: "base"
        }) * directionMultiplier;
    });
}

export function filterAdvancedPkmItemsByQuery(sourceItems, query)
{
    const list = Array.isArray(sourceItems) ? sourceItems : [];
    const fieldPath = String(query?.path || query?.field || "");
    const operatorKey = String(query?.operator || "");
    const fieldType = String(query?.type || "");
    const targetValue = query?.value;

    if(!fieldPath)
    {
        return list.slice();
    }

    if(fieldType === "text")
    {
        const needle = normalizeAdvancedPkmText(targetValue);
        if(!needle)
        {
            return list.slice();
        }

        return list.filter(function(item)
        {
            const rawCurrentValue = getAdvancedPkmValueByPath(item, fieldPath);
            const currentValue = normalizeAdvancedPkmText(rawCurrentValue);
            const includesValue = currentValue.includes(needle);
            const isExactMatch = currentValue === needle;

            switch(operatorKey)
            {
                case "eq":
                    return isExactMatch;
                case "ne":
                    return !isExactMatch;
                case "contains":
                    return includesValue;
                case "not_contains":
                    return !includesValue;
                default:
                    return includesValue;
            }
        });
    }

    if(fieldType === "enum")
    {
        if(fieldPath === "abilities")
        {
            const needle = normalizeAdvancedPkmText(targetValue);
            const targetSlot = Number(query?.slot || 0);
            if(!needle)
            {
                return list.slice();
            }

            return list.filter(function(item)
            {
                const rawCurrentValue = getAdvancedPkmValueByPath(item, fieldPath);
                const currentAbilities = Array.isArray(rawCurrentValue) ? rawCurrentValue : [];
                const currentValues = currentAbilities
                    .filter(function(value)
                    {
                        if(!targetSlot) return true;
                        return Number(value?.slot || 0) === targetSlot;
                    })
                    .map(function(value)
                    {
                        if(value && typeof value === "object")
                        {
                            return normalizeAdvancedPkmText(value.name);
                        }

                        return normalizeAdvancedPkmText(value);
                    })
                    .filter(Boolean);

                const includesValue = currentValues.includes(needle);
                const isStrictSingleMatch = currentValues.length === 1 && currentValues[0] === needle;

                switch(operatorKey)
                {
                    case "eq":
                        return isStrictSingleMatch;
                    case "ne":
                        return !isStrictSingleMatch;
                    case "contains":
                        return includesValue;
                    case "not_contains":
                        return !includesValue;
                    default:
                        return includesValue;
                }
            });
        }

        const needle = String(targetValue || "").trim().toLowerCase();
        if(!needle)
        {
            return list.slice();
        }

        return list.filter(function(item)
        {
            const rawCurrentValue = getAdvancedPkmValueByPath(item, fieldPath);
            const currentValues = Array.isArray(rawCurrentValue)
                ? rawCurrentValue.map(function(value)
                {
                    return String(value || "").trim().toLowerCase();
                }).filter(Boolean)
                : [String(rawCurrentValue || "").trim().toLowerCase()].filter(Boolean);

            const includesValue = currentValues.includes(needle);
            const isStrictSingleMatch = currentValues.length === 1 && currentValues[0] === needle;
            const isDifferentFromStrictSingleMatch = Array.isArray(rawCurrentValue)
                ? !isStrictSingleMatch
                : !includesValue;

            switch(operatorKey)
            {
                case "eq":
                    return isStrictSingleMatch;
                case "ne":
                    return isDifferentFromStrictSingleMatch;
                case "contains":
                    return includesValue;
                case "not_contains":
                    return !includesValue;
                default:
                    return includesValue;
            }
        });
    }

    if(fieldType === "boolean")
    {
        const targetBooleanValue = targetValue === true || String(targetValue).toLowerCase() === "true";

        return list.filter(function(item)
        {
            const rawCurrentValue = getAdvancedPkmValueByPath(item, fieldPath);
            const currentValue = Boolean(rawCurrentValue);

            switch(operatorKey)
            {
                case "ne":
                    return currentValue !== targetBooleanValue;
                case "eq":
                default:
                    return currentValue === targetBooleanValue;
            }
        });
    }

    const numericTargetValue = Number(targetValue);

    if(!Number.isFinite(numericTargetValue))
    {
        return list.slice();
    }

    return list.filter(function(item)
    {
        const rawCurrentValue = getAdvancedPkmValueByPath(item, fieldPath);
        const currentValue = Number(rawCurrentValue);
        if(!Number.isFinite(currentValue)) return false;

        switch(operatorKey)
        {
            case "lt": return currentValue < numericTargetValue;
            case "gt": return currentValue > numericTargetValue;
            case "eq": return currentValue === numericTargetValue;
            case "ne": return currentValue !== numericTargetValue;
            case "lte": return currentValue <= numericTargetValue;
            case "gte": return currentValue >= numericTargetValue;
            default: return true;
        }
    });
}

export function applyAdvancedPkmFiltersChain(sourceItems, filters)
{
    const list = Array.isArray(sourceItems) ? sourceItems.slice() : [];
    const chain = Array.isArray(filters) ? filters : [];

    return chain.reduce(function(accumulator, filter)
    {
        return filterAdvancedPkmItemsByQuery(accumulator, filter);
    }, list);
}

export function applyAdvancedPkmSearchState(sourceItems, filters, sort, filtersSchema = [])
{
    const filteredItems = applyAdvancedPkmFiltersChain(sourceItems, filters);
    const hydratedSort = hydrateAdvancedPkmSort(sort, filtersSchema);

    return sortAdvancedPkmItems(filteredItems, hydratedSort.field, hydratedSort.direction, filtersSchema);
}

export function encodeAdvancedPkmFilters(filters = [])
{
    return (Array.isArray(filters) ? filters : [])
        .map(function(filter)
        {
            return [
                filter?.field,
                filter?.operator,
                String(filter?.value ?? ""),
                filter?.slot ?? ""
            ].map(function(part)
            {
                return encodeURIComponent(String(part ?? ""));
            }).join(":");
        })
        .join("|");
}

export function decodeAdvancedPkmFilters(encodedFilters = "")
{
    const raw = String(encodedFilters || "").trim();
    if(!raw) return [];

    return raw
        .split("|")
        .map(function(entry)
        {
            const parts = String(entry || "").split(":").map(function(part)
            {
                return decodeURIComponent(part || "");
            });

            return {
                field: parts[0] || "",
                operator: parts[1] || "",
                value: parts[2] || "",
                slot: parts[3] === "" || parts[3] === undefined ? null : Number(parts[3])
            };
        })
        .filter(function(filter)
        {
            return !!filter.field && !!filter.operator;
        });
}

export function encodeAdvancedPkmSort(sort = null)
{
    const field = encodeURIComponent(String(sort?.field || ADVANCED_PKM_DEFAULT_SORT_FIELD));
    const direction = encodeURIComponent(String(sort?.direction || ADVANCED_PKM_DEFAULT_SORT_DIRECTION));

    return `${field}:${direction}`;
}

export function decodeAdvancedPkmSort(encodedSort = "")
{
    const raw = String(encodedSort || "").trim();
    if(!raw)
    {
        return {
            field: ADVANCED_PKM_DEFAULT_SORT_FIELD,
            direction: ADVANCED_PKM_DEFAULT_SORT_DIRECTION
        };
    }

    const parts = raw.split(":").map(function(part)
    {
        return decodeURIComponent(part || "");
    });

    return {
        field: parts[0] || ADVANCED_PKM_DEFAULT_SORT_FIELD,
        direction: String(parts[1] || ADVANCED_PKM_DEFAULT_SORT_DIRECTION).toLowerCase() === "desc" ? "desc" : "asc"
    };
}

export function buildAdvancedPkmSearchParams({ filters = [], sort = null } = {})
{
    const params = new URLSearchParams();
    const encodedFilters = encodeAdvancedPkmFilters(filters);
    const encodedSort = encodeAdvancedPkmSort(sort);

    if(encodedFilters)
    {
        params.set("filters", encodedFilters);
    }

    if(encodedSort)
    {
        params.set("sort", encodedSort);
    }

    return params;
}

export function parseAdvancedPkmSearchParams(searchParams, filtersSchema = [])
{
    const params = searchParams instanceof URLSearchParams
        ? searchParams
        : new URLSearchParams(String(searchParams || ""));
    const decodedFilters = decodeAdvancedPkmFilters(params.get("filters"));
    const filters = hydrateAdvancedPkmFilters(decodedFilters, filtersSchema);
    const sort = hydrateAdvancedPkmSort(decodeAdvancedPkmSort(params.get("sort")), filtersSchema);

    return {
        filters,
        sort,
        hasInvalidFilters: decodedFilters.length !== filters.length
    };
}

export function buildAdvancedPkmSearchUrl(basePath, { filters = [], sort = null } = {})
{
    const params = buildAdvancedPkmSearchParams({ filters, sort });
    const query = params.toString();

    return query ? `${basePath}?${query}` : basePath;
}
