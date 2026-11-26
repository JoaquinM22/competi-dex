//** src\CompetidexComponents\ConfiguracionComponents\RefrescarPokedex\RefrescarPokedex.js

import React, { useEffect, useState } from "react";
import { usePokedex } from "../../PokedexComponents/PokedexProvider";
import { PIKACHU_RUNING_GIF } from "../../../utils/competidexMeta";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import { showToastr } from "../../../services/ToastrService";
import { consumeSessionRefresh } from "../../../utils/sessionRefreshLimiter";
import "./RefrescarPokedex.css";

const POKEDEX_REFRESH_ALL_LIMIT_PER_DAY = 1;
const POKEDEX_REFRESH_ALL_WINDOW_MS = 1000 * 60 * 60 * 24;

function ConfirmModal({ open, title, message, confirmText, cancelText, tone, loading, onConfirm, onClose })
{
    if (!open) return null;

    return (
        <div className="rpd-modal-backdrop" onMouseDown={loading ? undefined : onClose} role="dialog" aria-modal="true">
            <div className="rpd-modal" onMouseDown={(e) => e.stopPropagation()}>

                <div className="rpd-modal-header">
                    <div className="rpd-modal-title">{title}</div>
                </div>

                <div className="rpd-modal-body">
                    <div className="rpd-modal-message">{message}</div>

                    {loading && (
                        <div className="rpd-loading-overlay" aria-hidden="true">
                            <div className="rpd-loading-card">
                                <span className="rpd-loading-text">Refrescando Pokédex, espere un momento...</span>
                                <img
                                    className="rpd-loading-gif"
                                    title="Pikachu corriendo"
                                    src={PIKACHU_RUNING_GIF}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="rpd-modal-actions">
                    <button
                        type="button"
                        className="rpd-btn rpd-btn-ghost"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText || "Cancelar"}
                    </button>

                    <button
                        type="button"
                        className={"rpd-btn " + (tone === "danger" ? "rpd-btn-danger" : "rpd-btn-primary")}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {confirmText || "Confirmar"}
                    </button>
                </div>

            </div>
        </div>
    );

}

export default function RefrescarPokedex()
{
    const { refreshAllPokedexCache, clearAllPokedexCache } = usePokedex();
    const [modal, setModal] = useState({ open: false });
    const [loading, setLoading] = useState(false);

    useEffect(() =>
    {
        preloadCachedImage(PIKACHU_RUNING_GIF);
    }, []);

    function askRefresh()
    {
        setModal({
            open: true,
            title: "Pokédex",
            message: "¿Refrescar todas las Pokédex del navegador?\nSe borrará la cache y se volverán a descargar actualizadas.",
            confirmText: "Refrescar",
            cancelText: "Cancelar",
            tone: "danger"
        });
    }

    async function handleConfirm()
    {
        setLoading(true);

        try
        {
            if(typeof refreshAllPokedexCache === "function")
            {
                const limitState = consumeSessionRefresh(
                    "pokedex:all",
                    POKEDEX_REFRESH_ALL_LIMIT_PER_DAY,
                    POKEDEX_REFRESH_ALL_WINDOW_MS,
                    { storage: "local" }
                );

                if(!limitState.allowed)
                {
                    setModal({ open: false });
                    showToastr({
                        title: "Aviso en Pokédex",
                        text: "Ya alcanzaste el límite de refresco global de Pokédex para hoy.",
                        variant: "warning"
                    });
                    return;
                }

                if(typeof clearAllPokedexCache === "function")
                {
                    clearAllPokedexCache();
                }

                const result = await refreshAllPokedexCache();

                setModal({ open: false });

                if(result?.anyRefreshed)
                {
                    showToastr({
                        title: "Pokédex",
                        text: "Todas las Pokédex se actualizaron correctamente.",
                        variant: "ok"
                    });

                }else
                {
                    showToastr({
                        title: "Aviso en Pokédex",
                        text: "Las Pokédex ya están actualizadas.",
                        variant: "warning"
                    });
                }

                return;
            }

            setModal({ open: false });
            showToastr({
                title: "Pokédex",
                text: "Todas las Pokédex se actualizaron correctamente.",
                variant: "ok"
            });

        }catch(error)
        {
            console.error("No se pudieron actualizar las Pokédex", error);
            setModal({ open: false });
            showToastr({
                title: "Error en Pokédex",
                text: "No se pudieron actualizar las Pokédex.",
                variant: "error"
            });

        }finally
        {
            setLoading(false);
        }
    }

    function closeModal()
    {
        if(loading) return;
        setModal({ open: false });
    }

    return (
        <>

            <div className="rpd-card">
                <div className="rpd-row">
                    <div className="rpd-left">
                        <div className="rpd-label">Refrescar todas las <span className="rpd-label-highlight">Pokédex</span> del navegador</div>
                    </div>

                    <div className="rpd-actions">
                        <button type="button" className="rpd-btn rpd-btn-danger" onClick={askRefresh}>
                            Refrescar
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={modal.open}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
                tone={modal.tone}
                loading={loading}
                onConfirm={handleConfirm}
                onClose={closeModal}
            />

        </>
    );

}