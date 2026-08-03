//** src\CompetidexComponents\AreaLocalizacionComponents\areaLocalizacionMapper.js

import {
  GAME_VERSIONS_META,
  GENERATIONS_META,
  getGameVersionMeta,
  getGameVersionLabelEs,
  getGameVersionVersionLabelEs,
  getGameVersionOrder,
  isGameVersionEnabled,
  getGenerationMeta,
  getGenerationLabelEs,
  getGenerationIcon
} from "../../utils/competidexMeta";

const UNKNOWN_GENERATION = "unknown";

function normalizeKey(input)
{
  return String(input || "").trim().toLowerCase();
}

function prettifyLocationName(rawName = "")
{
  const cleaned = String(rawName || "")
    .replace(/-area$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if(!cleaned) return "Sin nombre";

  return cleaned
    .split(/\s+/)
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function getGenerationKeyFromGameVersion(versionKey, opts)
{
  const generationByGameVersion = opts?.gameVersionGenerationByKey || null;
  const key = normalizeKey(versionKey);
  if(!key) return UNKNOWN_GENERATION;

  if(generationByGameVersion && typeof generationByGameVersion === "object" && generationByGameVersion[key])
  {
    return normalizeKey(generationByGameVersion[key]) || UNKNOWN_GENERATION;
  }

  const entries = Object.entries(GENERATIONS_META || {});
  for(const [generationKey, generationMeta] of entries)
  {
    const versions = Array.isArray(generationMeta?.gameVersions) ? generationMeta.gameVersions : [];
    if(versions.map(normalizeKey).includes(key))
    {
      return generationKey;
    }
  }

  return UNKNOWN_GENERATION;
}

function getVersionMeta(versionKey)
{
  const key = normalizeKey(versionKey);
  if(!key) return (GAME_VERSIONS_META && GAME_VERSIONS_META.unknown) || null;

  return getGameVersionMeta(key);
}

function getGenerationMetaByVersion(versionKey, opts)
{
  const generationKey = getGenerationKeyFromGameVersion(versionKey, opts);
  return getGenerationMeta(generationKey);
}

function getVersionOrder(versionKey)
{
  const order = getGameVersionOrder(versionKey);
  return Number.isFinite(order) ? order : 999;
}

export function buildAreaLocalizacionGroups(encounters, opts = {})
{
  const gameVersionLabelEsByKey = opts.gameVersionLabelEsByKey || null;
  const gameVersionGenerationByKey = opts.gameVersionGenerationByKey || null;

  const byGeneration = new Map();
  const list = Array.isArray(encounters) ? encounters : [];

  for(const areaEntry of list)
  {
    const locationLabel = prettifyLocationName(areaEntry?.location_area?.name || "");
    const versionDetails = Array.isArray(areaEntry?.version_details) ? areaEntry.version_details : [];

    for(const detail of versionDetails)
    {
      const versionKey = normalizeKey(detail?.version?.name);
      if(!versionKey) continue;

      const versionMeta = getVersionMeta(versionKey);
      if(!isGameVersionEnabled(versionKey) && versionMeta?.apiKey !== "unknown")
      {
        continue;
      }

      const generationKey = getGenerationKeyFromGameVersion(versionKey, { gameVersionGenerationByKey });
      const generationMeta = getGenerationMetaByVersion(versionKey, { gameVersionGenerationByKey });
      const generationLabel = getGenerationLabelEs(generationKey);
      const generationIcon = getGenerationIcon(generationKey);
      const rawChance = Number(detail?.max_chance);
      const chanceValue = Number.isFinite(rawChance)
        ? Math.max(0, Math.min(100, rawChance))
        : null;
      const chanceLabel = chanceValue !== null
        ? `${chanceValue}%`
        : "—";

      if(!byGeneration.has(generationKey))
      {
        byGeneration.set(generationKey, {
          generationKey,
          label: generationLabel,
          icon: generationIcon,
          order: Number(generationMeta?.order || 999),
          versions: new Map(),
        });
      }

      const generationBucket = byGeneration.get(generationKey);

      if(!generationBucket.versions.has(versionKey))
      {
        generationBucket.versions.set(versionKey, {
          versionKey,
          versionLabel:
            (gameVersionLabelEsByKey && gameVersionLabelEsByKey[versionKey]) ||
            getGameVersionVersionLabelEs(versionKey) ||
            getGameVersionLabelEs(versionKey) ||
            versionKey,
          versionOrder: getVersionOrder(versionKey),
          locations: [],
        });
      }

      const versionBucket = generationBucket.versions.get(versionKey);

      const alreadyAdded = versionBucket.locations.some(
        (loc) => loc.locationLabel === locationLabel && loc.chanceLabel === chanceLabel
      );

      if(!alreadyAdded)
      {
        versionBucket.locations.push({
          locationLabel,
          chanceLabel,
        });
      }
    }
  }

  const ordered = Array.from(byGeneration.values()).sort((a, b) =>
  {
    if(a.order !== b.order)
    {
      return b.order - a.order;
    }

    return String(a.label || a.generationKey || "").localeCompare(String(b.label || b.generationKey || ""), "es");
  }).map((genBucket) =>
  {
    const versions = Array.from(genBucket.versions.values()).sort((a, b) =>
    {
      if(a.versionOrder !== b.versionOrder)
      {
        return b.versionOrder - a.versionOrder;
      }

      return String(a.versionLabel || a.versionKey || "").localeCompare(String(b.versionLabel || b.versionKey || ""), "es");
    });

    versions.forEach((version) =>
    {
      version.locations.sort((a, b) => a.locationLabel.localeCompare(b.locationLabel, "es"));
    });

    return {
      label: genBucket.label,
      icon: genBucket.icon,
      generationKey: genBucket.generationKey,
      order: genBucket.order,
      versions,
      hasData: versions.length > 0,
    };
  });

  const unknownGeneration = byGeneration.get(UNKNOWN_GENERATION);
  if(unknownGeneration)
  {
    const versions = Array.from(unknownGeneration.versions.values()).sort((a, b) =>
    {
      if(a.versionOrder !== b.versionOrder)
      {
        return b.versionOrder - a.versionOrder;
      }

      return String(a.versionLabel || a.versionKey || "").localeCompare(String(b.versionLabel || b.versionKey || ""), "es");
    });

    versions.forEach((version) =>
    {
      version.locations.sort((a, b) => a.locationLabel.localeCompare(b.locationLabel, "es"));
    });

    ordered.push({
      label: getGenerationLabelEs(UNKNOWN_GENERATION),
      icon: getGenerationIcon(UNKNOWN_GENERATION),
      generationKey: UNKNOWN_GENERATION,
      versions,
      hasData: versions.length > 0,
    });
  }

  return ordered;
}

export function getAreaLocalizacionGenerationDefinitions()
{
  return Object.entries(GENERATIONS_META || {})
    .map(([generationKey, generationMeta]) => ({
      generationKey,
      label: generationMeta?.labelEs || generationKey,
      icon: generationMeta?.icon || null,
      order: Number(generationMeta?.order || 999),
      versions: Array.isArray(generationMeta?.gameVersions) ? generationMeta.gameVersions.slice() : []
    }))
    .sort((a, b) =>
    {
      if(a.order !== b.order)
      {
        return b.order - a.order;
      }

      return String(a.label || a.generationKey || "").localeCompare(String(b.label || b.generationKey || ""), "es");
    });
}

export function getGenerationLabelFromVersion(versionKey)
{
  return getGenerationLabelEs(getGenerationKeyFromGameVersion(versionKey));
}

export {
  UNKNOWN_GENERATION,
  prettifyLocationName,
  getGenerationKeyFromGameVersion,
  getGenerationMetaByVersion
};
