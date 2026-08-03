//** src\CompetidexComponents\HabilidadesComponents\VistaHabilidad\VistaHabilidad.js

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAbilities } from "../AbilitiesProvider";
import { CACHE_VERSION } from "../abilityCache";
import { createAbilityMapper } from "../abilityMapper";
import { abilityRoute } from "../../../utils/competidexRoutes";
import BuscadorHabilidad from "./BuscadorHabilidad/BuscadorHabilidad";
import DataHabilidad from "./DataHabilidad/DataHabilidad";
import "./VistaHabilidad.css";

function normText(s)
{
  return String(s || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function slugifyForUrl(s)
{
  let t = normText(s);
  t = t.replace(/[\s\-]+/g, "_");   // espacios y '-' -> '_'
  t = t.replace(/[^a-z0-9_]/g, ""); // limpio todo lo raro
  t = t.replace(/_+/g, "_");
  t = t.replace(/^_+|_+$/g, "");

  return t;
}

export default function VistaHabilidad()
{
  const { nombreHabilidad: param } = useParams();
  const navigate = useNavigate();

  const { getAbilityRaw, resolveAbilityInput, getAbilitySlug, esMapReadyAbilities } = useAbilities();

  const [habABuscar, setHabABuscar] = useState(""); // SIEMPRE key REAL (EN)
  const [unaHabilidad, setUnaHabilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mapper = useMemo(() =>
  {
    return createAbilityMapper({
      getAbilityRaw: getAbilityRaw,
      DEBUG_ABILITY: false
    });

  }, [getAbilityRaw]);

  const obtenerHab = useCallback(async (nameOrId) =>
  {
    return mapper.obtenerHabilidad(nameOrId);

  }, [mapper]);

  // Si entro a /habilidad sin param, redirigir a la última habilidad guardada (slug preferido)
  useEffect(() =>
  {
    if (param) return;

    let lastSlug = "";
    let lastKey = "";
    try { lastSlug = (sessionStorage.getItem(`abilities:lastSlug:${CACHE_VERSION}`) || "").trim().toLowerCase(); } catch (e) {}
    try { lastKey  = (sessionStorage.getItem(`abilities:lastKey:${CACHE_VERSION}`)  || "").trim().toLowerCase(); } catch (e) {}

    if(lastKey)
    {
      const canonicalSlug = getAbilitySlug(lastKey) || slugifyForUrl(lastKey);
      navigate(abilityRoute(encodeURIComponent(canonicalSlug)), { replace: true });
      
      return;
    }

    if(lastSlug)
    {
      navigate(abilityRoute(encodeURIComponent(lastSlug)), { replace: true });
      
      return;
    }

  }, [param, navigate, getAbilitySlug]);

  // URL -> resolver a { key EN real, slug ES lindo } y canonizar URL
  useEffect(() =>
  {
    if (!param) return;
    if (!esMapReadyAbilities) return;

    let rawParam = "";
    try { rawParam = decodeURIComponent(param); } catch (e) { rawParam = String(param || ""); }
    rawParam = String(rawParam || "").trim();

    const resolved = resolveAbilityInput(rawParam); // { key: "water-absorb", slug: "absorbe_agua" }

    if(resolved && resolved.key)
    {
      setHabABuscar(resolved.key);

      // Guardar última habilidad (key real + slug lindo)
      try { sessionStorage.setItem(`abilities:lastKey:${CACHE_VERSION}`, resolved.key); } catch (e) {}
      try { sessionStorage.setItem(`abilities:lastSlug:${CACHE_VERSION}`, resolved.slug || slugifyForUrl(resolved.key)); } catch (e) {}

      // canonizar URL: siempre /habilidad/{slug}
      const wantSlug = String(resolved.slug || slugifyForUrl(resolved.key)).trim().toLowerCase();
      const curSlug = slugifyForUrl(rawParam);
      if(wantSlug && curSlug !== wantSlug)
      {
        navigate(abilityRoute(encodeURIComponent(wantSlug)), { replace: true });
      }

    }else
    {
      // fallback: no pude resolver, intento como si fuese key EN (conversión básica)
      setHabABuscar(String(rawParam || "").trim().toLowerCase().replace(/_/g, "-"));
    }

  }, [param, esMapReadyAbilities, resolveAbilityInput, navigate]);

  // Buscar cuando cambia habABuscar (SOLO UNA VEZ)
  useEffect(() =>
  {
    let alive = true;
    if (!habABuscar) return;

    (async () =>
    {

      try
      {
        setLoading(true);
        setError(null);

        // habABuscar es key EN real => fetch OK
        const hab = await obtenerHab(habABuscar);
        if (!alive) return;
        setUnaHabilidad(hab);

      }catch(e)
      {
        if (!alive) return;
        setUnaHabilidad(null);
        setError(e || new Error("Error al obtener habilidad"));

      }finally
      {
        if (alive) setLoading(false);
      }

    })();

    return function () { alive = false; };

  }, [habABuscar, obtenerHab]);

  // EXTRA: cuando ya tengo la habilidad real, re-guardar lastKey/lastSlug "bien"
  // (key SIEMPRE nombreApi; slug preferir nombreHab si existe, sino key)
  useEffect(() =>
  {
    if (!unaHabilidad) return;

    const key = String(unaHabilidad.nombreApi || "").trim().toLowerCase(); // EN real
    if (!key) return;

    const disp = String(unaHabilidad.nombreHab || "").trim(); // ES si existe
    const slug = getAbilitySlug(key) || slugifyForUrl(disp || key);

    try { sessionStorage.setItem(`abilities:lastKey:${CACHE_VERSION}`, key); } catch (e) {}
    try { sessionStorage.setItem(`abilities:lastSlug:${CACHE_VERSION}`, slug); } catch (e) {}

  }, [unaHabilidad]);

  function handleSearch(resolved)
  {
    if(!resolved || !resolved.key)
    {
      setHabABuscar("");
      setUnaHabilidad(null);
      setError(null);
      navigate(abilityRoute(), { replace: false });

      return;
    }

    // resolved.key: EN real
    // resolved.slug: ES lindo
    setHabABuscar(resolved.key);

    try { sessionStorage.setItem(`abilities:lastKey:${CACHE_VERSION}`, resolved.key); } catch (e) {}
    try { sessionStorage.setItem(`abilities:lastSlug:${CACHE_VERSION}`, resolved.slug || slugifyForUrl(resolved.key)); } catch (e) {}

    // navegación "linda" por slug
    const slug = String(resolved.slug || slugifyForUrl(resolved.key)).trim().toLowerCase();
    navigate(abilityRoute(encodeURIComponent(slug)), { replace: false });
  }

  return (
    <div className="vista-wrapper-hab">
      <div className="componenteVistaHabilidad">

        {/* Componente Buscador de Habilidades, alimentado por el Provider */}
        <BuscadorHabilidad
          onSearch={handleSearch}
          titulo="Habilidad"
        />

        {/* Componente que muestra toda la Info de una Habilidad */}
        <DataHabilidad
          habilidad={unaHabilidad}
          loading={loading}
          error={error}
        />

      </div>
    </div>
  );

}