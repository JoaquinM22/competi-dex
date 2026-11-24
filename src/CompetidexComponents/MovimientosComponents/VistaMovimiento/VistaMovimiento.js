//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\VistaMovimiento.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMoves } from "../MovesProvider";
import { createMoveMapper } from "../moveMapper";
import { CACHE_VERSION } from "../moveCache";
import { moveRoute } from "../../../utils/competidexRoutes";
import { SITE_URL } from "../../../utils/competidexMeta";
import BuscadorMovimientos from "./BuscadorMovimientos/BuscadorMovimientos";
import DataMovimiento from "./DataMovimiento/DataMovimiento";
import "./VistaMovimiento.css";

function toSlugApiKey(key = "")
{
    return encodeURIComponent(String(key || "").trim().toLowerCase());
}

const moveMapper = createMoveMapper();
const KEY_LAST_MOVE_KEY = `moves:lastKey:${CACHE_VERSION}`;
const KEY_LAST_MOVE_SLUG = `moves:lastSlug:${CACHE_VERSION}`;

export default function VistaMovimiento()
{
    const { nombreMovimiento: paramNombreMovimiento } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const {
        getMoveRaw,
        getMoveFlagsByKey,
        getMoveCompleteDataByApiName,
        resolveMoveInput,
        esMapReady
    } = useMoves();

    const [movABuscar, setMovABuscar] = useState("");
    const [unMovimiento, setUnMovimiento] = useState(null);
    const [loadingMov, setLoadingMov] = useState(false);
    const [errorMov, setErrorMov] = useState(null);

    // 1) Si NO hay param en URL, restaurar el último movimiento visto (slug ES si existe)
    useEffect(() =>
    {
        if (paramNombreMovimiento) return;

        let lastSlug = "";
        let lastKey = "";

        try { lastSlug = (sessionStorage.getItem(KEY_LAST_MOVE_SLUG) || "").trim(); } catch {}
        try { lastKey = (sessionStorage.getItem(KEY_LAST_MOVE_KEY) || "").trim(); } catch {}

        const go = (lastSlug || lastKey || "").toLowerCase();
        if (!go) return;

        navigate(moveRoute(toSlugApiKey(go)), { replace: true });

    }, [paramNombreMovimiento, navigate]);

    // Resolver a key API y canonizar URL
    useEffect(() =>
    {
        if (!paramNombreMovimiento) return;
        if (!esMapReady) return;

        const rawParam = decodeURIComponent(paramNombreMovimiento).trim();
        const resolved = resolveMoveInput(rawParam);

        if (resolved && resolved.key)
        {
            // 1) Buscar SIEMPRE por key API (inglés)
            setMovABuscar(resolved.key);

            try { sessionStorage.setItem(KEY_LAST_MOVE_KEY, String(resolved.key)); } catch {}
            try { sessionStorage.setItem(KEY_LAST_MOVE_SLUG, String(resolved.slug || "")); } catch {}

            // 3) Canonizar URL para mostrar slug ES (o fallback EN)
            const want = toSlugApiKey(resolved.slug || resolved.key);
            const cur = toSlugApiKey(rawParam);

            if(want && cur !== want)
            {
                navigate(moveRoute(want), { replace: true });
            }

        }else
        {
            // fallback: intento igual como key en ingles
            setMovABuscar(rawParam.toLowerCase().trim());
        }

    }, [paramNombreMovimiento, esMapReady, resolveMoveInput, navigate]);

    // 3) Buscar cuando cambia movABuscar
    useEffect(() =>
    {
        let alive = true;
        if (!movABuscar) return;

        (async () =>
        {

            try
            {
                setLoadingMov(true);
                setErrorMov(null);

                const rawMov = await getMoveRaw(movABuscar);
                const mov = moveMapper.obtenerMov(
                    rawMov,
                    movABuscar,
                    getMoveFlagsByKey,
                    getMoveCompleteDataByApiName
                );
                if (!alive) return;

                setUnMovimiento(mov);

                try { sessionStorage.setItem(KEY_LAST_MOVE_KEY, String(mov?.nombreApi || mov?.key || movABuscar)); } catch {}
                try { sessionStorage.setItem(KEY_LAST_MOVE_SLUG, String(toSlugApiKey(mov?.nombreMov || mov?.nombreApi || movABuscar))); } catch {}

            }catch(e)
            {
                if (!alive) return;
                setUnMovimiento(null);
                setErrorMov(e || new Error("Error al obtener movimiento"));

            }finally
            {
                if (alive) setLoadingMov(false);
            }

        })();

        return () => { alive = false; };

    }, [movABuscar, getMoveRaw, getMoveFlagsByKey, getMoveCompleteDataByApiName]);

    // SEO dinámico del movimiento actualmente abierto
    useEffect(() =>
    {
        const moveName = String(unMovimiento?.nombreMov || unMovimiento?.nombreApi || "").trim();

        if(!moveName || typeof document === "undefined") return;

        const normalizedPath = String(pathname || "/").replace(/\/+$/, "") || "/";
        const canonicalUrl = new URL(normalizedPath, SITE_URL).toString();
        const title = `${moveName} | Competidex`;
        const description = `Consulta información del movimiento ${moveName}, incluyendo su tipo, potencia, precisión, efectos y Pokémon que pueden aprenderlo.`;

        document.title = title;

        function updateMeta(selector, attributes)
        {
            let element = document.head.querySelector(selector);

            if(!element)
            {
                element = document.createElement("meta");
                document.head.appendChild(element);
            }

            Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
        }

        updateMeta('meta[name="description"]', { name: "description", content: description });
        updateMeta('meta[property="og:title"]', { property: "og:title", content: title });
        updateMeta('meta[property="og:description"]', { property: "og:description", content: description });
        updateMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });

        let canonicalLink = document.head.querySelector('link[rel="canonical"]');
        if(!canonicalLink)
        {
            canonicalLink = document.createElement("link");
            document.head.appendChild(canonicalLink);
        }

        canonicalLink.setAttribute("rel", "canonical");
        canonicalLink.setAttribute("href", canonicalUrl);

    }, [unMovimiento, pathname]);

    function handleSearch(resolved)
    {
        if(!resolved || !resolved.key)
        {
            setMovABuscar("");
            setUnMovimiento(null);
            setErrorMov(null);
            navigate(moveRoute(), { replace: false });

            return;
        }

        setMovABuscar(resolved.key);
        try { sessionStorage.setItem(KEY_LAST_MOVE_KEY, String(resolved.key)); } catch {}
        try { sessionStorage.setItem(KEY_LAST_MOVE_SLUG, String(resolved.slug || "")); } catch {}
        navigate(moveRoute(toSlugApiKey(resolved.slug || resolved.key)), { replace: false });
    }

    return (
        <div className="vista-wrapper-mov">
            <div className="componenteVistaMovimiento">
                
                {/* Buscador de Movimientos, se alimenta con el Provider */}
                <BuscadorMovimientos
                    onSearch={handleSearch}
                    titulo="Movimiento"
                />


                {/* Componente que muestra toda la Info del Movimiento */}
                <DataMovimiento
                    movimiento={unMovimiento}
                    loading={loadingMov}
                    error={errorMov}
                />

            </div>
        </div>
    );

}