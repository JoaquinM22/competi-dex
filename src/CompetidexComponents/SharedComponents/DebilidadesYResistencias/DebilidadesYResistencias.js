//** src\CompetidexComponents\SharedComponents\DebilidadesYResistencias\DebilidadesYResistencias.js

import React, { useMemo, useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import {
  DAMAGE_MATRIX,
  LEVEL_OF_WEAKNESS,
  normalizeTypeKey,
  getTypeLabelEs,
  getStatLabelEs,
  getStatConector,
  getLevelOfWeaknessLabelEs,
  getLevelOfWeaknessColor,
  getAbilityEffectMeta,
  getAbilityLabelEs,
  getAbilityDamageImmunities,
  getAbilityHealsOnHit,
  getAbilityRedirects,
  getAbilityDamageWeaknesses,
  getAbilityDamageResistances,
  getAbilityStatBoosts,
  getAbilityMoveBoosts,
  getAbilityStatusImmunities,
  getAbilityStatusEffectOverrides,
  getStatusesAltereNameEs,
  getStatusesAltereConector,
  getAbilitySuperEffectiveModifier,
  getAbilityOnlySuperEffectiveDamage,
  getAbilityDamageToHalfAtFullHP,
  getAbilitySuperEffectiveModifierAtFullHP,
  getAbilityWeaknessToHalfForTypes,
  getAbilityContactHalfDamage,
} from "../../../utils/competidexMeta";
import Tipo from "../Tipo/Tipo";
import "./DebilidadesYResistencias.css";

function baseMultipliers(defenderTypesIds)
{
  const attackerTypes = Object.keys(DAMAGE_MATRIX);
  const mult = Object.fromEntries(attackerTypes.map((t) => [t, 1]));

  defenderTypesIds.forEach((defId) =>
  {
    attackerTypes.forEach((atk) =>
    {
      const m = DAMAGE_MATRIX[atk]?.[defId] ?? 1;
      mult[atk] *= m;
    });

  });

  return mult;
}

function formatPercent(value)
{
  const pct = Number(value) * 100;
  if (!Number.isFinite(pct)) return "0%";

  const rounded = Number(pct.toFixed(1));
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
}

function formatBoostPercent(mult)
{
  const pct = (Number(mult) - 1) * 100;
  if (!Number.isFinite(pct)) return "0%";

  const rounded = Number(pct.toFixed(1));
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
}

function getNivelLabel(stages)
{
  return Number(stages) === 1 ? "nivel" : "niveles";
}

function formatDamageDelta(mult)
{
  const value = Number(mult);
  if (!Number.isFinite(value) || value === 1) return null;

  const pct = Math.abs(value - 1) * 100;
  const rounded = Number(pct.toFixed(1));
  const percentText = Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;

  return {
    verb: value < 1 ? "Reduce" : "Aumenta",
    percentText,
  };
}

function normalizeEffectKey(value)
{
  const num = Number(value);
  if (Number.isFinite(num)) return num.toFixed(3);

  return String(value ?? "").trim().toLowerCase();
}

function approx(a, b, eps = 0.01)
{
  return Math.abs(a - b) <= eps;
}

function resolveAbilityInput(input)
{
  if(!input) return { apiName: "", display: "" };

  if(typeof input === "string")
  {
    const key = String(input || "").trim();
    return { apiName: key, display: key };
  }

  if(typeof input === "object")
  {
    return {
      apiName: String(input.apiName || input.nombreApi || input.key || "").trim(),
      display: String(input.display || input.nombreHab || input.labelEs || "").trim()
    };
  }

  return { apiName: String(input || "").trim(), display: String(input || "").trim() };
}

// Funcion que arma la descripcion de los efectos de la habilidad
function describeAbility(name)
{
  const meta = getAbilityEffectMeta(name);
  if (!meta?.apiKey) return "";

  const parts = [];

  // Primero obtengo los 8 Items que poseen "Tipo" (Agua, Fuego, etc)

  // Obtiene el arreglo: "damageImmunities": [ "type1", ... ]
  const damageImmunities = getAbilityDamageImmunities(name);

  // Obtiene el arreglo: "healsOnHit": [ { "type1": value }, ... ]
  const healsOnHit = getAbilityHealsOnHit(name).flatMap((entry) =>
    Object.entries(entry || {}).map(([triggerType, factor]) => ({ triggerType, factor }))
  );

  // Obtiene el arreglo: "redirects": [ "type1", "type2", ... ]
  const redirects = getAbilityRedirects(name);

  // Obtiene el arreglo: "statBoosts": [ { "triggerType": "type1", "stat": "statName", "stages": value }, ... ]
  const statBoosts = getAbilityStatBoosts(name);
  
  // Obtiene el arreglo: "moveBoosts": [ { "type1": value }, ... ]
  const moveBoosts = getAbilityMoveBoosts(name).flatMap((entry) =>
  {
    if(!entry) return [];
    return Object.entries(entry).map(([triggerType, mult]) => ({ triggerType, mult }));
  });

  // Obtiene el arreglo: "damageResistances": [ { "triggerType": "type1", "mult": value }, ... ]
  const damageResistances = getAbilityDamageResistances(name);

  // Obtiene el arreglo: "damageWeaknesses": [ { "triggerType": "type1", "mult": value }, ... ]
  const damageWeaknesses = getAbilityDamageWeaknesses(name);

  // Obtiene el arreglo: "weaknessToHalfForTypes": [ "type1", ... ]
  const weaknessToHalfForTypes = getAbilityWeaknessToHalfForTypes(name);

  // Los separo en n grupos por tipo repetido y armo las sub descripciones de cada grupo
  const typeOrder = [];
  const seenTypeKeys = new Set();
  const addTypeToOrder = (type) =>
  {
    const key = normalizeTypeKey(type) || String(type || "").trim().toLowerCase();
    if(!key || seenTypeKeys.has(key)) return;
    seenTypeKeys.add(key);
    typeOrder.push(key);
  };

  damageImmunities.forEach(addTypeToOrder);
  healsOnHit.forEach(({ triggerType }) => addTypeToOrder(triggerType));
  redirects.forEach(addTypeToOrder);
  statBoosts.forEach(({ triggerType }) => addTypeToOrder(triggerType));
  moveBoosts.forEach(({ triggerType }) => addTypeToOrder(triggerType));
  damageResistances.forEach(({ triggerType }) => addTypeToOrder(triggerType));
  damageWeaknesses.forEach(({ triggerType }) => addTypeToOrder(triggerType));
  weaknessToHalfForTypes.forEach(addTypeToOrder);

  const typeIndex = new Map(typeOrder.map((typeId, index) => [typeId, index]));
  const sortTypes = (types) =>
  {
    const unique = [];
    const seen = new Set();

    (types || []).forEach((type) =>
    {
      const key = normalizeTypeKey(type) || String(type || "").trim().toLowerCase();
      if(!key || seen.has(key)) return;
      seen.add(key);
      unique.push(key);
    });

    unique.sort((a, b) =>
    {
      const orderA = typeIndex.get(a) ?? Number.MAX_SAFE_INTEGER;
      const orderB = typeIndex.get(b) ?? Number.MAX_SAFE_INTEGER;
      if(orderA !== orderB) return orderA - orderB;

      return String(getTypeLabelEs(a) || a).localeCompare(String(getTypeLabelEs(b) || b), "es");
    });

    return unique;
  };

  const formatTypeListWithY = (types) =>
  {
    const sortedTypes = sortTypes(types);
    if(!sortedTypes.length) return "";

    const labels = sortedTypes.map((typeId) => getTypeLabelEs(typeId));
    if(labels.length === 1) return labels[0];
    if(labels.length === 2) return `${labels[0]} y ${labels[1]}`;

    return `${labels.slice(0, -1).join(", ")} y ${labels[labels.length - 1]}`;
  };

  const clauseItems = [];
  let clauseIndex = 0;
  const addClause = (kind, types, signature, data = {}) =>
  {
    const normalizedTypes = sortTypes(types);
    if(!normalizedTypes.length) return;

    clauseItems.push({
      index: clauseIndex++,
      kind,
      signature: String(signature ?? ""),
      types: normalizedTypes,
      data,
    });

  };

  damageImmunities.forEach((typeId) => addClause("damageImmunities", [typeId], "all"));
  healsOnHit.forEach(({ triggerType, factor }) => addClause("healsOnHit", [triggerType], normalizeEffectKey(factor), { factor }));
  redirects.forEach((typeId) => addClause("redirects", [typeId], "all"));
  statBoosts.forEach(({ triggerType, stat, stages }) => addClause("statBoosts", [triggerType], `${stat}:${Number(stages ?? 1)}`, { stat, stages }));
  moveBoosts.forEach(({ triggerType, mult }) => addClause("moveBoosts", [triggerType], normalizeEffectKey(mult), { mult }));
  damageResistances.forEach(({ triggerType, mult }) => addClause("damageResistances", [triggerType], normalizeEffectKey(mult), { mult }));
  damageWeaknesses.forEach(({ triggerType, mult }) => addClause("damageWeaknesses", [triggerType], normalizeEffectKey(mult), { mult }));
  weaknessToHalfForTypes.forEach((typeId) => addClause("weaknessToHalfForTypes", [typeId], "all"));

  const typeCounts = new Map();
  clauseItems.forEach((clause) =>
  {
    clause.types.forEach((typeId) =>
    {
      typeCounts.set(typeId, (typeCounts.get(typeId) || 0) + 1);
    });

  });

  const repeatedTypes = new Set();
  typeCounts.forEach((count, typeId) =>
  {
    if(count > 1) repeatedTypes.add(typeId);
  });

  const repeatedGroups = new Map();
  const residualGroups = new Map();

  const addRepeatedClause = (typeId, clause, sourceTypes) =>
  {
    let group = repeatedGroups.get(typeId);
    if(!group)
    {
      group = { typeId, clauses: [], firstIndex: clause.index, sourceTypes: new Set() };
      repeatedGroups.set(typeId, group);
    }

    group.firstIndex = Math.min(group.firstIndex, clause.index);
    sourceTypes.forEach((sourceType) => group.sourceTypes.add(sourceType));
    group.clauses.push({ ...clause, types: [typeId] });
  };

  const addResidualClause = (clause, types) =>
  {
    if(!types.length) return;

    const key = `${clause.kind}:${clause.signature}`;
    let group = residualGroups.get(key);
    if(!group)
    {
      group = { kind: clause.kind, signature: clause.signature, clauses: [], types: [], data: clause.data, firstIndex: clause.index };
      residualGroups.set(key, group);
    }

    group.firstIndex = Math.min(group.firstIndex, clause.index);
    group.clauses.push({ ...clause, types: [...types] });
    group.types.push(...types);
    if(!group.data || !Object.keys(group.data).length) group.data = clause.data;
  };

  clauseItems.forEach((clause) =>
  {
    const repeatedClauseTypes = clause.types.filter((typeId) => repeatedTypes.has(typeId));
    const residualClauseTypes = clause.types.filter((typeId) => !repeatedTypes.has(typeId));

    repeatedClauseTypes.forEach((typeId) => addRepeatedClause(typeId, clause, clause.types));
    addResidualClause(clause, residualClauseTypes);
  });

  const renderClauseByType = (kind, typeId, data, isFirst) =>
  {
    const typeLabel = getTypeLabelEs(typeId);
    switch(kind)
    {
      case "damageImmunities":
        return isFirst
          ? `Hace al poseedor de la habilidad inmune a movimientos de tipo ${typeLabel}`
          : "Hace al poseedor de la habilidad inmune a movimientos de dicho tipo";

      case "healsOnHit":
        return isFirst
          ? `Recupera un ${formatPercent(data?.factor)} de sus PS máximos al recibir movimientos de tipo ${typeLabel}`
          : `Recupera un ${formatPercent(data?.factor)} de sus PS máximos al recibir movimientos de dicho tipo`;

      case "redirects":
        return isFirst
          ? `Atrae los movimientos de tipo ${typeLabel} hacia el poseedor de la habilidad`
          : "Atrae los movimientos de dicho tipo hacia el poseedor de la habilidad";

      case "statBoosts":
      {
        const { stat: statKey, stages: stageCount } = data || {};
        const statLabel = String(getStatLabelEs(statKey) || "").trim();
        const conector = getStatConector(statKey);
        const nivelCount = Number(stageCount ?? 1);
        const nivelLabel = getNivelLabel(nivelCount);
        const statText = [conector, statLabel ? statLabel.toLowerCase() : ""].filter(Boolean).join(" ");
        return isFirst
          ? `Sube ${statText} en ${nivelCount} ${nivelLabel} cuando recibe movimientos de tipo ${typeLabel}`
          : `Sube ${statText} en ${nivelCount} ${nivelLabel} cuando recibe movimientos de dicho tipo`;
      }

      case "moveBoosts":
        return isFirst
          ? `Potencia movimientos de tipo ${typeLabel} en un ${formatBoostPercent(data?.mult)}`
          : `Potencia movimientos de dicho tipo en un ${formatBoostPercent(data?.mult)}`;

      case "damageResistances":
      {
        const delta = formatDamageDelta(data?.mult);
        if(!delta) return "";
        return isFirst
          ? `${delta.verb} en un ${delta.percentText} el daño producido por movimientos de tipo ${typeLabel}`
          : `${delta.verb} en un ${delta.percentText} el daño producido por movimientos de dicho tipo`;
      }

      case "damageWeaknesses":
      {
        const delta = formatDamageDelta(data?.mult);
        if(!delta) return "";
        const directionText = delta.verb === "Aumenta" ? "más" : "menos";
        return isFirst
          ? `Los movimientos de tipo ${typeLabel} hacen un ${delta.percentText} ${directionText} de daño contra el poseedor de la habilidad`
          : `Los movimientos de dicho tipo hacen un ${delta.percentText} ${directionText} de daño contra el poseedor de la habilidad`;
      }

      case "weaknessToHalfForTypes":
        return isFirst
          ? `Reduce a la mitad las debilidades del tipo ${typeLabel}. Este cambio aplica a todos los Pokémon de dicho tipo que estén presentes en el combate, no solo al poseedor de la habilidad`
          : `Reduce a la mitad las debilidades de ese tipo. Este cambio aplica a todos los Pokémon de dicho tipo que estén presentes en el combate, no solo al poseedor de la habilidad`;

      default:
        return "";
    }
  };

  const renderResidualGroup = (group) =>
  {
    const typesText = formatTypeListWithY(group.types);
    if(!typesText) return "";

    switch(group.kind)
    {
      case "damageImmunities":
        return `Hace al poseedor de la habilidad inmune a movimientos de tipo ${typesText}`;

      case "healsOnHit":
        return `Recupera un ${formatPercent(group.data?.factor)} de sus PS máximos al recibir movimientos de tipo ${typesText}`;

      case "redirects":
        return `Atrae los movimientos de tipo ${typesText} hacia el poseedor de la habilidad`;

      case "statBoosts":
      {
        const { stat: statKey, stages: stageCount } = group.data || {};
        const statLabel = String(getStatLabelEs(statKey) || "").trim();
        const conector = getStatConector(statKey);
        const nivelCount = Number(stageCount ?? 1);
        const nivelLabel = getNivelLabel(nivelCount);
        const statText = [conector, statLabel ? statLabel.toLowerCase() : ""].filter(Boolean).join(" ");
        return `Sube ${statText} en ${nivelCount} ${nivelLabel} cuando recibe movimientos de tipo ${typesText}`;
      }

      case "moveBoosts":
        return `Potencia movimientos de tipo ${typesText} en un ${formatBoostPercent(group.data?.mult)}`;

      case "damageResistances":
      {
        const delta = formatDamageDelta(group.data?.mult);
        if(!delta) return "";
        return `${delta.verb} en un ${delta.percentText} el daño producido por movimientos de tipo ${typesText}`;
      }

      case "damageWeaknesses":
      {
        const delta = formatDamageDelta(group.data?.mult);
        if(!delta) return "";
        const directionText = delta.verb === "Aumenta" ? "más" : "menos";
        return `Los movimientos de tipo ${typesText} hacen un ${delta.percentText} ${directionText} de daño contra el poseedor de la habilidad`;
      }

      case "weaknessToHalfForTypes":
      {
        const typeWord = group.types.length === 1 ? "tipo" : "tipos";
        const pronoun = group.types.length === 1 ? "dicho tipo" : "dichos tipos";
        return `Reduce a la mitad las debilidades de los ${typeWord} ${typesText}. Este cambio aplica a todos los Pokémon de ${pronoun} que estén presentes en el combate, no solo al poseedor de la habilidad`;
      }

      default:
        return "";
    }
  };

  const repeatedTypeOrder = sortTypes(Array.from(repeatedTypes));
  repeatedTypeOrder.forEach((typeId) =>
  {
    const group = repeatedGroups.get(typeId);
    if(!group?.clauses?.length) return;

    const renderedParts = group.clauses
      .sort((a, b) => a.index - b.index)
      .map((clause, index) => renderClauseByType(clause.kind, typeId, clause.data, index === 0, true))
      .filter(Boolean);

    if(renderedParts.length)
    {
      parts.push(renderedParts.join("; "));
    }

  });

  const residualGroupsList = Array.from(residualGroups.values()).sort((a, b) =>
  {
    if(a.firstIndex !== b.firstIndex) return a.firstIndex - b.firstIndex;
    return String(a.kind).localeCompare(String(b.kind), "es");
  });

  residualGroupsList.forEach((group) =>
  {
    const rendered = renderResidualGroup(group);
    if(rendered) parts.push(rendered);
  });

  // Descripciones de efectos que siempre se describen de forma independiente (No se agrupan por Tipo)

  // Inmunidad de Estados Alterados
  const statusImmunities = getAbilityStatusImmunities(name);
  if(statusImmunities.length)
  {
    if(statusImmunities.length === 1 && statusImmunities[0] === "all")
    {
      parts.push("Un Pokémon con esta habilidad es inmune a todos los problemas de estado");

    }else if(statusImmunities.length === 1)
    {
      const status = statusImmunities[0];
      const statusName = getStatusesAltereNameEs(status);
      const conector = getStatusesAltereConector(status);
      const connectorText = conector ? ` ${conector}` : "";

      parts.push(`Un Pokémon con esta habilidad es inmune al estado alterado${connectorText} ${statusName}`);
    
    }else
    {
      const statusesText = statusImmunities.map((status) => getStatusesAltereNameEs(status)).join(", ");

      parts.push(`Un Pokémon con esta habilidad es inmune a los siguientes estados alterados: ${statusesText}`);
    }
  }

  // Cambios de efectos de estados alterados
  getAbilityStatusEffectOverrides(name).forEach((entry) =>
  {
    Object.entries(entry || {}).forEach(([status, desc]) =>
    {
      const statusLabel = getStatusesAltereNameEs(status);
      const conector = getStatusesAltereConector(status);
      const connectorText = conector ? ` ${conector}` : "";

      parts.push(`Un Pokémon con el estado alterado${connectorText} ${statusLabel} con esta habilidad ${desc}`);
    
    });

  });

  // Modificador de daño supereficaz
  const superEffectiveModifier = getAbilitySuperEffectiveModifier(name);
  if(superEffectiveModifier != null)
  {
    const pct = (1 - Number(superEffectiveModifier)) * 100;
    const rounded = Number.isFinite(pct) ? Number(pct.toFixed(1)) : 0;
    const percentText = Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;

    parts.push(`Reduce en un ${percentText} el daño recibido de los movimientos supereficaces e hipereficaces usados contra el Pokémon poseedor de la habilidad`);
  }

  // Reduce a la mitad con PS al 100%
  const superEffectiveModifierAtFullHP = getAbilitySuperEffectiveModifierAtFullHP(name);
  if(superEffectiveModifierAtFullHP)
  {
    parts.push("Reduce a la mitad el daño recibido de los movimientos supereficaces e hipereficaces cuando el poseedor de la habilidad tiene los PS al máximo");
  }

  // Solo debil a movimientos supereficaces e hipereficaces
  if(getAbilityOnlySuperEffectiveDamage(name))
  {
    parts.push("Solo es débil a movimientos supereficaces e hipereficaces");
  }

  // Movimientos Poco eficaces con PS al 100% 
  if(getAbilityDamageToHalfAtFullHP(name))
  {
    parts.push("Los movimientos que dañan al Pokémon poseedor de la habilidad pasan a ser poco eficaces si tiene los PS al máximo, excepto las inmunidades y los daños que ya sean muy poco eficaces");
  }

  // Reduce a la mitad el daño de movs de contacto
  if(getAbilityContactHalfDamage(name))
  {
    parts.push("Reduce a la mitad el daño producido por movimientos de contacto");
  }

  return parts.join("; ");
}

function applyAbilityToMultipliers(mult, abilityName, defenderTypesIds, { enPlenosPS = true } = {})
{
  const ability = getAbilityEffectMeta(abilityName);
  if (!ability?.apiKey) return { ...mult, _changed: false, _notes: [] };

  const result = { ...mult };
  const notes = [];

  if(ability.superEffectiveModifierAtFullHP && enPlenosPS)
  {
    Object.keys(result).forEach((t) =>
    {
      if (result[t] > 1) result[t] *= 0.5;
    });
  }

  if(ability.onlySuperEffectiveDamage)
  {
    Object.keys(result).forEach((t) =>
    {
      if (result[t] < 2) result[t] = 0;
    });
  }

  if(ability.damageResistances)
  {
    ability.damageResistances.forEach(({ triggerType, type, mult: factor }) =>
    {
      const key = triggerType || type;
      if (key && factor != null && result[key] !== undefined) result[key] *= factor;
    });
  }

  if(ability.damageWeaknesses)
  {
    ability.damageWeaknesses.forEach(({ triggerType, type, mult: factor }) =>
    {
      const key = triggerType || type;
      if (key && factor != null && result[key] !== undefined) result[key] *= factor;
    });
  }

  if(ability.superEffectiveModifier != null)
  {
    Object.keys(result).forEach((t) =>
    {
      if (result[t] > 1) result[t] *= ability.superEffectiveModifier;
    });
  }

  if(ability.damageToHalfAtFullHP && enPlenosPS)
  {
    Object.keys(result).forEach((t) =>
    {
      if (result[t] >= 1) result[t] = 0.5;
    });
    notes.push("Efecto de daño convertido a poco eficaz aplicado (PS completos).");
  }

  if(ability.weaknessToHalfForTypes?.some((typeId) => defenderTypesIds.includes(typeId)))
  {
    Object.keys(result).forEach((t) =>
    {
      if (result[t] > 1) result[t] *= 0.5;
    });
  }

  if(ability.contactHalfDamage)
  {
    notes.push("Reduce a la mitad el daño de movimientos con contacto.");
  }
  
  if(ability.damageImmunities)
  {
    ability.damageImmunities.forEach((t) =>
    {
      if (t && result[t] !== undefined) result[t] = 0;
    });
  }

  const changed = Object.keys(result).some((t) => result[t] !== mult[t]);
  return { ...result, _changed: changed, _notes: notes };
}

function toBuckets(mult)
{
  const buckets = { "x4": [], "x3": [], "x2": [], "x1.5": [], "x1": [], "x0.5": [], "x0.25": [], "x0": [] };

  Object.entries(mult).forEach(([typeId, m]) =>
  {
    const rounded = Number(m.toFixed(2));
    let key = "x1";

    if (rounded === 0) key = "x0";
    else if (rounded >= 3.75) key = "x4";
    else if (rounded >= 2.75) key = "x3";
    else if (rounded > 1.25) key = "x2";
    else if (rounded < 0.26) key = "x0.25";
    else if (rounded < 0.76) key = "x0.5";

    buckets[key].push(typeId);
  });

  Object.keys(buckets).forEach((k) => buckets[k].sort());
  return buckets;
}

const DIFF_KEYS = Object.keys(LEVEL_OF_WEAKNESS);

function withSeQuarterBuckets(buckets, rawMult)
{
  const copy = JSON.parse(JSON.stringify(buckets));
  const x3 = [];
  const x15 = [];

  Object.entries(rawMult || {}).forEach(([typeId, m]) =>
  {
    if (Number.isFinite(m) && approx(m, 3)) x3.push(typeId);
    if (Number.isFinite(m) && approx(m, 1.5)) x15.push(typeId);
  });

  x3.sort();
  x15.sort();

  if(copy["x2"])
  {
    copy["x2"] = copy["x2"].filter((t) => !x3.includes(t) && !x15.includes(t));
  }

  copy["x3"] = (copy["x3"] || []).filter((t) => !x3.includes(t));
  copy["x1.5"] = (copy["x1.5"] || []).filter((t) => !x15.includes(t));
  copy["x3"].push(...x3);
  copy["x1.5"].push(...x15);

  return copy;
}

function diffBuckets(base, alt, keys = DIFF_KEYS)
{
  const d = {};

  keys.forEach((k) =>
  {
    const baseArr = base[k] || [];
    const altArr = alt[k] || [];
    const add = altArr.filter((x) => !baseArr.includes(x));
    const rem = baseArr.filter((x) => !altArr.includes(x));
    if (add.length || rem.length) d[k] = { agrega: add, quita: rem };
  });

  return d;
}

export default function DebilidadesYResistencias({
  tipos = [],
  habilidades = [],
  enPlenosPS = true
})
{
  const tiposIds = useMemo(() =>
  {
    return Array.from(
      new Set(
        (tipos || [])
          .map((t) => normalizeTypeKey(t))
          .filter((t) => t && DAMAGE_MATRIX[t])
      )
    );

  }, [tipos]);

  const perfilBase = useMemo(() =>
  {
    const base = baseMultipliers(tiposIds);
    return { mult: base, buckets: toBuckets(base) };

  }, [tiposIds]);

  const grupos = useMemo(() =>
  {
    const apps = [];

    (habilidades || []).forEach((h) =>
    {
      const resolved = resolveAbilityInput(h);
      const rawName = String(resolved.apiName || "").trim();
      const meta = getAbilityEffectMeta(rawName);
      const pretty = String(resolved.display || getAbilityLabelEs(rawName) || rawName).trim();
      const isHpDep = meta?.apiKey && (meta.superEffectiveModifierAtFullHP || meta.damageToHalfAtFullHP);

      if(!meta?.apiKey)
      {
        apps.push({
          h: rawName,
          pretty: pretty || rawName,
          changed: false,
          buckets: perfilBase.buckets,
          rawMult: perfilBase.mult,
          seQuarter: false,
          diferencias: {},
          signature: JSON.stringify(perfilBase.buckets),
          notes: [],
          desc: "",
        });

        return;
      }

      const variantes = isHpDep
        ? [
            { pretty: `${pretty} (100% PS)`, full: true },
            { pretty: `${pretty} (<100% PS)`, full: false },
          ]
        : [
            { pretty, full: enPlenosPS },
          ];

      variantes.forEach(({ pretty: variantPretty, full }) =>
      {
        const applied = applyAbilityToMultipliers(perfilBase.mult, rawName, tiposIds, { enPlenosPS: full });
        const { _changed, _notes, ...onlyNums } = applied;

        const bucketsRaw = toBuckets(onlyNums);
        const seQuarter = meta.superEffectiveModifier === 0.75;
        const bucketsDisplay = seQuarter ? withSeQuarterBuckets(bucketsRaw, onlyNums) : bucketsRaw;
        const diferencias = diffBuckets(perfilBase.buckets, bucketsDisplay);
        const signature = JSON.stringify(bucketsDisplay);

        apps.push({
          h: rawName,
          pretty: variantPretty,
          changed: _changed,
          buckets: bucketsDisplay,
          rawMult: onlyNums,
          seQuarter,
          diferencias,
          signature,
          notes: applied._notes || [],
          desc: describeAbility(rawName),
        });

      });

    });

    const out = [];
    const noChange = apps.filter((a) => !a.changed);

    if(noChange.length > 0)
    {
      out.push({
        key: "g0",
        label: noChange.map((a) => a.pretty || a.h).join(" / "),
        buckets: perfilBase.buckets,
        diferencias: {},
        notes: [],
        abilityDescs: noChange
          .filter((a) => !!a.desc)
          .map((a) => ({
            name: a.pretty,
            text: a.desc,
          })),
        isBaseLike: true,
      });

    }else if((habilidades || []).length === 0)
    {
      out.push({
        key: "g0",
        label: "Base",
        buckets: perfilBase.buckets,
        diferencias: {},
        notes: [],
        abilityDescs: [],
        isBaseLike: true,
      });
    }

    const map = new Map();
    apps.filter((a) => a.changed).forEach((a) =>
    {
      if(!map.has(a.signature))
      {
        map.set(a.signature, {
          labelParts: [a.pretty],
          buckets: a.buckets,
          rawMult: a.rawMult,
          seQuarter: !!a.seQuarter,
          diferencias: a.diferencias,
          notes: [...a.notes],
          abilityDescs: a.desc ? [{ name: a.pretty, text: a.desc }] : [],
        });

      }else
      {
        const g = map.get(a.signature);
        g.labelParts.push(a.pretty);
        g.notes.push(...a.notes);
        if (a.desc) g.abilityDescs.push({ name: a.pretty, text: a.desc });
        g.seQuarter = g.seQuarter || !!a.seQuarter;
      }

    });

    let i = out.length;
    for(const g of map.values())
    {
      out.push({
        key: `g${i++}`,
        label: g.labelParts.join(" / "),
        buckets: g.buckets,
        rawMult: g.rawMult,
        seQuarter: g.seQuarter,
        diferencias: g.diferencias,
        notes: g.notes,
        abilityDescs: g.abilityDescs,
        isBaseLike: false,
      });
    }

    return out;

  }, [habilidades, perfilBase, tiposIds, enPlenosPS]);

  const [tab, setTab] = useState(null);
  const tabs = useMemo(() => grupos.map((g) => ({ key: g.key, label: g.label })), [grupos]);
  useEffect(() =>
  {
    if(tabs.length > 0)
    {
      setTab(tabs[0].key);
      return;
    }

    setTab(null);

  }, [tabs]);
  const currentGroup = grupos.find((g) => g.key === tab);

  const hideDiffForSingleAbility = useMemo(() =>
  {
    const changedGroups = grupos.filter((g) => !g.isBaseLike);
    return (habilidades?.length === 1) && (changedGroups.length === 1);

  }, [grupos, habilidades]);

  const Badge = ({ multKey }) =>
  {
    const color = getLevelOfWeaknessColor(multKey);
    const isZero = multKey === "x0";

    return (
      <span className="ri-badge">
        <FaCircle className="ri-badge-circle" color={color} size={52} />
        <span className="ri-badge-text" style={{ color: isZero ? "#111111" : "#ffffff" }}>
          {multKey}
        </span>
      </span>
    );
    
  };

  const BadgeCell = ({ multKey }) => (
    <div className="dyr-badge-grid">
      <span className="dyr-badge-left"><Badge multKey={multKey} /></span>
      <span className="dyr-badge-right">{getLevelOfWeaknessLabelEs(multKey) || ""}</span>
    </div>
  );

  const renderGrupo = (multKey, tiposIdsList, key) => (
    <tr className="dyr-tr" key={key || multKey}>
      <th className="dyr-th-badge"><BadgeCell multKey={multKey} /></th>
      <td className="dyr-td">
        <div className="dyr-td-types">
          {tiposIdsList?.length === 0 || !tiposIdsList ? (
            <span className="dyr-empty">Ninguno</span>
          ) : (
            tiposIdsList.map((t) => <Tipo key={t} tipo={t} size="medium" />)
          )}
        </div>
      </td>
    </tr>
  );

  const TablaGrupo = ({ group }) =>
  {
    const B = group.buckets || {};
    const visibleKeys = group.seQuarter
      ? Object.keys(LEVEL_OF_WEAKNESS)
      : Object.keys(LEVEL_OF_WEAKNESS).filter((k) => k !== "x3" && k !== "x1.5");

    return (
      <>
        <div className="dyr-table-wrap">
          <table className="dyr-table">
            <thead className="dyr-thead">
              <tr>
                <th className="dyr-head-left">Debilidad</th>
                <th className="dyr-head-right">Tipos</th>
              </tr>
            </thead>
            <tbody>
              {visibleKeys.map((multKey) => renderGrupo(multKey, B[multKey] || [], multKey))}
            </tbody>
          </table>
        </div>

        {!group.isBaseLike && !hideDiffForSingleAbility && (
          <div className="dyr-diff">
            <h4>Diferencias</h4>
            {Object.keys(group.diferencias).length === 0 && <div className="dyr-empty">Sin cambios</div>}
            {Object.entries(group.diferencias).map(([gk, { agrega, quita }]) =>
              (agrega.length || quita.length) && (
                <div key={gk} className="dyr-diff-row">
                  <div className="dyr-diff-grupo">{gk}</div>
                  <div className="dyr-diff-changes">
                    {agrega.length > 0 && (
                      <div className="dyr-badge add">
                        + {agrega.map((t) => <Tipo key={t} tipo={t} size="tiny" />)}
                      </div>
                    )}
                    {quita.length > 0 && (
                      <div className="dyr-badge rem">
                        - {quita.map((t) => <Tipo key={t} tipo={t} size="tiny" />)}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {group.abilityDescs?.length > 0 && (
          <div className="dyr-notes" style={{ marginTop: 12 }}>
            {group.abilityDescs.map(({ name, text }) => (
              <div key={name}>• <strong>{name}</strong>{text ? ` - ${text}` : ""}</div>
            ))}
          </div>
        )}
      </>
    );

  };

  return (
    <div className="dyr-wrapper">
      <div className="dyr-tabs">
        {tabs.map((ti) => (
          <button
            key={ti.key}
            className={`dyr-tab ${tab === ti.key ? "active" : ""}`}
            onClick={() => setTab(ti.key)}
            title={ti.label}
          >
            {ti.label}
          </button>
        ))}
      </div>

      <div className="dyr-content">
        <div className="dyr-responsive">
          {currentGroup ? <TablaGrupo group={currentGroup} /> : null}
        </div>
      </div>
    </div>
  );

}