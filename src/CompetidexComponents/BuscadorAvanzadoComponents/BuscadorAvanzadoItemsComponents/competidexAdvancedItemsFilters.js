//** src\CompetidexComponents\BuscadorAvanzadoComponents\BuscadorAvanzadoItemsComponents\competidexAdvancedItemsFilters.js

export const ADVANCED_ITEMS_DEFAULT_SORT_FIELD = "id";
export const ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION = "asc";

export const ADVANCED_ITEMS_NUMBER_FILTER_OPERATORS = [
    { key: "eq", label: "Igual a", symbol: "=" },
    { key: "ne", label: "Distinto de", symbol: "!=" },
    { key: "lt", label: "Menor que", symbol: "<" },
    { key: "gt", label: "Mayor que", symbol: ">" },
    { key: "lte", label: "Menor o igual", symbol: "≤" },
    { key: "gte", label: "Mayor o igual", symbol: "≥" }
];

export const ADVANCED_ITEMS_TEXT_FILTER_OPERATORS = [
    { key: "contains", label: "Contiene", symbol: "⊃" },
    { key: "not_contains", label: "No contiene", symbol: "⊅" },
    { key: "eq", label: "Igual a", symbol: "=" },
    { key: "ne", label: "Distinto de", symbol: "!=" }
];

export const ADVANCED_ITEMS_BOUNDED_TEXT_FILTER_OPERATORS = [
    { key: "eq", label: "Igual a", symbol: "=" },
    { key: "ne", label: "Distinto de", symbol: "!=" }
];

export const ADVANCED_ITEMS_ARRAY_TEXT_FILTER_OPERATORS = [
    { key: "contains", label: "Contiene", symbol: "⊃" },
    { key: "not_contains", label: "No contiene", symbol: "⊅" },
    { key: "eq", label: "Igual a", symbol: "=" },
    { key: "ne", label: "Distinto de", symbol: "!=" }
];

export const ADVANCED_ITEMS_BOOLEAN_FILTER_OPERATORS = [
    { key: "eq", label: "Igual a", symbol: "=" }
];

export function getAdvancedItemsFieldSelectionId(field)
{
    if(!field) return "";

    return `${String(field.field || "")}__${String(field.description || "")}`;
}

export function normalizeAdvancedItemsText(input)
{
    return String(input || "")
        .toLowerCase()
        .normalize("NFD").replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

export function getAdvancedItemsValueByPath(source, path)
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

export function getAdvancedItemsOperatorData(operatorKey, fieldType = "", fieldKey = "")
{
    const type = String(fieldType || "");
    const operator = String(operatorKey || "");
    const field = String(fieldKey || "");
    const source = type === "number"
        ? ADVANCED_ITEMS_NUMBER_FILTER_OPERATORS
        : type === "text"
            ? ADVANCED_ITEMS_TEXT_FILTER_OPERATORS
            : type === "boolean"
                ? ADVANCED_ITEMS_BOOLEAN_FILTER_OPERATORS
                : field === "attributes"
                    ? ADVANCED_ITEMS_ARRAY_TEXT_FILTER_OPERATORS
                    : ADVANCED_ITEMS_BOUNDED_TEXT_FILTER_OPERATORS;

    return source.find(function(option)
    {
        return String(option?.key || "") === operator;
    }) || source[0] || null;
}

export function getAdvancedItemsOptionDescriptionByKey(options, key)
{
    const normalizedKey = normalizeAdvancedItemsEnumKey(key);
    const list = Array.isArray(options) ? options : [];
    const foundOption = list.find(function(option)
    {
        return normalizeAdvancedItemsEnumKey(option?.key) === normalizedKey;
    });

    if(foundOption)
    {
        return String(foundOption.description || foundOption.key || normalizedKey);
    }

    return normalizedKey;
}

function normalizeAdvancedItemsEnumKey(value)
{
    if(value === null || value === undefined || String(value).trim().toLowerCase() === "null")
    {
        return "null";
    }

    return String(value).trim();
}

function normalizeAdvancedItemsEnumFilterComparable(field, value)
{
    return normalizeAdvancedItemsEnumKey(value).toLowerCase();
}

export function getAdvancedItemsFilterValueLabel(fieldData, value)
{
    const fieldType = String(fieldData?.type || "");

    if(fieldType === "boolean")
    {
        return value === true || String(value).toLowerCase() === "true" ? "Sí" : "No";
    }

    if(Array.isArray(fieldData?.options) && fieldData.options.length > 0)
    {
        return getAdvancedItemsOptionDescriptionByKey(fieldData.options, value);
    }

    return String(value ?? "");
}

function parseAdvancedItemsNumberValue(rawValue)
{
    const normalizedValue = String(rawValue ?? "").trim().replace(",", ".");
    if(!normalizedValue) return NaN;

    return Number(normalizedValue);
}

function isValidAdvancedItemsNumberValue(fieldData, value)
{
    if(!Number.isFinite(value)) return false;

    const field = String(fieldData?.field || "");

    if(field === "id")
    {
        return Number.isInteger(value) && value >= 0;
    }

    return value >= 0;
}

function isValidAdvancedItemsBooleanValue(rawValue)
{
    const normalizedValue = String(rawValue).trim().toLowerCase();
    return normalizedValue === "true" || normalizedValue === "false";
}

function isValidAdvancedItemsOptionValue(fieldData, value)
{
    const options = Array.isArray(fieldData?.options) ? fieldData.options : [];
    if(!options.length) return true;

    const normalizedValue = normalizeAdvancedItemsEnumKey(value);
    if(!normalizedValue) return false;

    return options.some(function(option)
    {
        return normalizeAdvancedItemsEnumKey(option?.key) === normalizedValue;
    });
}

export function hydrateAdvancedItemsFilter(rawFilter, filtersSchema = [])
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
        ? parseAdvancedItemsNumberValue(rawValue)
        : fieldType === "boolean"
            ? String(rawValue).trim().toLowerCase() === "true"
            : normalizeAdvancedItemsEnumKey(rawValue);
    const operatorData = getAdvancedItemsOperatorData(rawFilter?.operator, fieldType, fieldKey);
    const requestedOperator = String(rawFilter?.operator || "");

    if(fieldType === "number" && !isValidAdvancedItemsNumberValue(fieldData, value)) return null;
    if(fieldType === "boolean" && !isValidAdvancedItemsBooleanValue(rawValue)) return null;
    if(fieldType === "enum" && !isValidAdvancedItemsOptionValue(fieldData, value)) return null;
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
        valueLabel: getAdvancedItemsFilterValueLabel(fieldData, value),
        slot: rawFilter?.slot ?? null
    };
}

export function hydrateAdvancedItemsFilters(rawFilters = [], filtersSchema = [])
{
    return (Array.isArray(rawFilters) ? rawFilters : [])
        .map(function(rawFilter, index)
        {
            return hydrateAdvancedItemsFilter({
                ...rawFilter,
                id: rawFilter?.id || `filter-chip-${index + 1}`
            }, filtersSchema);
        })
        .filter(Boolean);
}

export function getAdvancedItemsSortFieldData(filtersSchema = [], sortFieldValue = ADVANCED_ITEMS_DEFAULT_SORT_FIELD)
{
    const schema = Array.isArray(filtersSchema) ? filtersSchema : [];
    const target = String(sortFieldValue || ADVANCED_ITEMS_DEFAULT_SORT_FIELD);

    return schema.find(function(field)
    {
        return getAdvancedItemsFieldSelectionId(field) === target;
    }) || schema.find(function(field)
    {
        return String(field?.field || "") === target;
    }) || schema.find(function(field)
    {
        return String(field?.field || "") === ADVANCED_ITEMS_DEFAULT_SORT_FIELD;
    }) || null;
}

export function hydrateAdvancedItemsSort(rawSort = null, filtersSchema = [])
{
    const rawField = String(rawSort?.field || ADVANCED_ITEMS_DEFAULT_SORT_FIELD);
    const direction = String(rawSort?.direction || ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION).toLowerCase() === "desc"
        ? "desc"
        : "asc";
    const fieldData = getAdvancedItemsSortFieldData(filtersSchema, rawField);

    return {
        field: fieldData ? String(fieldData.field || ADVANCED_ITEMS_DEFAULT_SORT_FIELD) : ADVANCED_ITEMS_DEFAULT_SORT_FIELD,
        description: fieldData ? String(fieldData.description || "ID") : "ID",
        path: fieldData ? String(fieldData.path || fieldData.field || ADVANCED_ITEMS_DEFAULT_SORT_FIELD) : ADVANCED_ITEMS_DEFAULT_SORT_FIELD,
        direction: direction
    };
}

export function getAdvancedItemsSortFieldValue(item, fieldData)
{
    return getAdvancedItemsValueByPath(item, fieldData?.path || fieldData?.field) ?? "";
}

export function sortAdvancedItems(sourceItems, sortFieldValue, sortDirection, filtersSchema = [])
{
    const list = Array.isArray(sourceItems) ? sourceItems.slice() : [];
    const fieldData = getAdvancedItemsSortFieldData(filtersSchema, sortFieldValue);

    if(!fieldData)
    {
        return list;
    }

    const directionMultiplier = sortDirection === "desc" ? -1 : 1;

    return list.sort(function(a, b)
    {
        const valueA = getAdvancedItemsSortFieldValue(a, fieldData);
        const valueB = getAdvancedItemsSortFieldValue(b, fieldData);
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

export function filterAdvancedItemsByQuery(sourceItems, query)
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
        const needle = normalizeAdvancedItemsText(targetValue);
        if(!needle)
        {
            return list.slice();
        }

        return list.filter(function(item)
        {
            const rawCurrentValue = getAdvancedItemsValueByPath(item, fieldPath);
            const currentValue = normalizeAdvancedItemsText(rawCurrentValue);
            const includesValue = currentValue.includes(needle);
            const isExactMatch = currentValue === needle;

            switch(operatorKey)
            {
                case "eq": return isExactMatch;
                case "ne": return !isExactMatch;
                case "contains": return includesValue;
                case "not_contains": return !includesValue;
                default: return includesValue;
            }
        });
    }

    if(fieldType === "enum")
    {
        const fieldKey = String(query?.field || "");
        const needle = normalizeAdvancedItemsEnumFilterComparable(fieldKey, targetValue);
        if(!needle)
        {
            return list.slice();
        }

        return list.filter(function(item)
        {
            const rawCurrentValue = getAdvancedItemsValueByPath(item, fieldPath);

            if(fieldKey === "attributes")
            {
                const currentValues = Array.isArray(rawCurrentValue)
                    ? rawCurrentValue
                    : [rawCurrentValue];
                const hasValue = currentValues.some(function(currentValue)
                {
                    return normalizeAdvancedItemsEnumFilterComparable(fieldKey, currentValue) === needle;
                });

                switch(operatorKey)
                {
                    case "ne":
                    case "not_contains": return !hasValue;
                    case "eq":
                    case "contains":
                    default: return hasValue;
                }
            }

            const currentValue = normalizeAdvancedItemsEnumFilterComparable(fieldKey, rawCurrentValue);
            const isExactMatch = currentValue === needle;

            switch(operatorKey)
            {
                case "ne": return !isExactMatch;
                case "eq":
                default: return isExactMatch;
            }
        });
    }

    if(fieldType === "boolean")
    {
        const targetBooleanValue = targetValue === true || String(targetValue).toLowerCase() === "true";

        return list.filter(function(item)
        {
            const currentValue = getAdvancedItemsValueByPath(item, fieldPath) === true;

            switch(operatorKey)
            {
                case "ne": return currentValue !== targetBooleanValue;
                case "eq":
                default: return currentValue === targetBooleanValue;
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
        const rawCurrentValue = getAdvancedItemsValueByPath(item, fieldPath);
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

export function applyAdvancedItemsFiltersChain(sourceItems, filters)
{
    const list = Array.isArray(sourceItems) ? sourceItems.slice() : [];
    const chain = Array.isArray(filters) ? filters : [];

    return chain.reduce(function(accumulator, filter)
    {
        return filterAdvancedItemsByQuery(accumulator, filter);
    }, list);
}

export function applyAdvancedItemsSearchState(sourceItems, filters, sort, filtersSchema = [])
{
    const filteredItems = applyAdvancedItemsFiltersChain(sourceItems, filters);
    const hydratedSort = hydrateAdvancedItemsSort(sort, filtersSchema);

    return sortAdvancedItems(filteredItems, hydratedSort.field, hydratedSort.direction, filtersSchema);
}

export function encodeAdvancedItemsFilters(filters = [])
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

export function decodeAdvancedItemsFilters(encodedFilters = "")
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

export function encodeAdvancedItemsSort(sort = null)
{
    const field = encodeURIComponent(String(sort?.field || ADVANCED_ITEMS_DEFAULT_SORT_FIELD));
    const direction = encodeURIComponent(String(sort?.direction || ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION));

    return `${field}:${direction}`;
}

export function decodeAdvancedItemsSort(encodedSort = "")
{
    const raw = String(encodedSort || "").trim();
    if(!raw)
    {
        return {
            field: ADVANCED_ITEMS_DEFAULT_SORT_FIELD,
            direction: ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION
        };
    }

    const parts = raw.split(":").map(function(part)
    {
        return decodeURIComponent(part || "");
    });

    return {
        field: parts[0] || ADVANCED_ITEMS_DEFAULT_SORT_FIELD,
        direction: String(parts[1] || ADVANCED_ITEMS_DEFAULT_SORT_DIRECTION).toLowerCase() === "desc" ? "desc" : "asc"
    };
}

export function buildAdvancedItemsSearchParams({ filters = [], sort = null } = {})
{
    const params = new URLSearchParams();
    const encodedFilters = encodeAdvancedItemsFilters(filters);
    const encodedSort = encodeAdvancedItemsSort(sort);

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

export function parseAdvancedItemsSearchParams(searchParams, filtersSchema = [])
{
    const params = searchParams instanceof URLSearchParams
        ? searchParams
        : new URLSearchParams(String(searchParams || ""));
    const decodedFilters = decodeAdvancedItemsFilters(params.get("filters"));
    const filters = hydrateAdvancedItemsFilters(decodedFilters, filtersSchema);
    const sort = hydrateAdvancedItemsSort(decodeAdvancedItemsSort(params.get("sort")), filtersSchema);

    return {
        filters,
        sort,
        hasInvalidFilters: decodedFilters.length !== filters.length
    };
}

export function buildAdvancedItemsSearchUrl(basePath, { filters = [], sort = null } = {})
{
    const params = buildAdvancedItemsSearchParams({ filters, sort });
    const query = params.toString();

    return query ? `${basePath}?${query}` : basePath;
}
