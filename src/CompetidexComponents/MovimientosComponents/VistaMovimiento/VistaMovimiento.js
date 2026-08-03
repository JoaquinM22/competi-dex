//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\VistaMovimiento.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMoves } from "../MovesProvider";
import { createMoveMapper } from "../moveMapper";
import { CACHE_VERSION } from "../moveCache";
import { moveRoute } from "../../../utils/competidexRoutes";
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
    const { getMoveRaw, getMoveContactByKey, resolveMoveInput, esMapReady } = useMoves();

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
                const mov = moveMapper.obtenerMov(rawMov, movABuscar, getMoveContactByKey);
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

    }, [movABuscar, getMoveContactByKey]);

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