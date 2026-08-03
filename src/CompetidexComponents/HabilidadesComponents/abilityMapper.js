//** src\CompetidexComponents\HabilidadesComponents\abilityMapper.js

function norm(s)
{
  return String(s || "")
    .replace(/[\f\n\r]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function pickDesc(json)
{
  const entries = (json && json.flavor_text_entries) ? json.flavor_text_entries : [];

  function esTextoValido(txt)
  {
    const s = norm(txt);
    return !!s && /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(s);
  }

  function findLastFlavor(lang)
  {
    let ultimo = "";

    for(let i = 0; i < entries.length; i++)
    {
      const it = entries[i];
      if (!it || !it.language || it.language.name !== lang) continue;

      const txt = norm(it.flavor_text || "");
      if (!esTextoValido(txt)) continue;

      ultimo = txt;
    }

    return ultimo;
  }

  function findLastEffect(lang)
  {
    const effectEntries = (json && json.effect_entries) ? json.effect_entries : [];
    let ultimo = "";

    for(let i = 0; i < effectEntries.length; i++)
    {
      const e = effectEntries[i];
      if (!e || !e.language || e.language.name !== lang) continue;

      const txt = norm(e.effect || "");
      if (!esTextoValido(txt)) continue;

      ultimo = txt;
    }

    return ultimo;
  }

  const flavorEs = findLastFlavor("es");
  if (flavorEs) return flavorEs;

  const effectEs = findLastEffect("es");
  if (effectEs) return effectEs;

  const effectEn = findLastEffect("en");
  if (effectEn) return effectEn;

  const flavorEn = findLastFlavor("en");
  return flavorEn || "";
}

function pickNameEs(json)
{
  const names = (json && json.names) ? json.names : [];
  for(let i = 0; i < names.length; i++)
  {
    const n = names[i];
    if (n && n.language && n.language.name === "es" && n.name) return n.name;
  }

  for(let j = 0; j < names.length; j++)
  {
    const n2 = names[j];
    if (n2 && n2.language && n2.language.name === "en" && n2.name) return n2.name;
  }

  return (json && (json.name || "")) || "";
}

function pickGenKey(json)
{
  return (json && json.generation && json.generation.name)
    ? String(json.generation.name).trim()
    : "";
}

function mapPokemonList(json, limit)
{
  limit = (limit === 0) ? 0 : (limit || 200);
  const arr = (json && json.pokemon) ? json.pokemon : [];
  const out = [];

  for(let i = 0; i < arr.length; i++)
  {
    const it = arr[i];
    const apiName = it && it.pokemon && it.pokemon.name;
    if (!apiName) continue;

    out.push({
      key: apiName,
      is_hidden: !!it.is_hidden,
      slot: it.slot || 0
    });

    if (limit && out.length >= limit) break;
  }

  return out;
}

export function createAbilityMapper(opts)
{
  opts = opts || {};
  const getAbilityRaw = opts.getAbilityRaw;

  async function obtenerHabilidad(nameOrId)
  {
    const raw = await getAbilityRaw(nameOrId);

    let apiName = (raw && raw.name) ? String(raw.name) : String(nameOrId || "");
    apiName = apiName.trim().toLowerCase();

    const nameEs = pickNameEs(raw);
    const desc = pickDesc(raw);
    const genKey = pickGenKey(raw);
    const gen = genKey || "";
    const pokes = mapPokemonList(raw, 0);

    return {
      id: raw && raw.id,
      key: apiName,
      nombreApi: apiName,
      nombreHab: nameEs || apiName,
      genHab: gen,
      descHab: desc,
      pokesTienen: pokes
    };
  }

  return { obtenerHabilidad };
}
