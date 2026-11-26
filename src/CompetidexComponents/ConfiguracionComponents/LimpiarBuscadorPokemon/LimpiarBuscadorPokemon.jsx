//** src\CompetidexComponents\ConfiguracionComponents\LimpiarBuscadorPokemon\LimpiarBuscadorPokemon.js

import React, { useState } from "react";
import { usePokemon } from "../../PokemonComponents/PokemonProvider";
import { showToastr } from "../../../services/ToastrService";
import { consumeSessionRefresh } from "../../../utils/sessionRefreshLimiter";
import "./LimpiarBuscadorPokemon.css";

const SESSION_REFRESH_LIMIT = 3;

function ConfirmModal({ open, title, message, confirmText, cancelText, tone, onConfirm, onClose })
{
  if (!open) return null;

  return (
    <div className="lbp-modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="lbp-modal" onMouseDown={(e) => e.stopPropagation()}>

        <div className="lbp-modal-header">
          <div className="lbp-modal-title">{title}</div>
        </div>

        <div className="lbp-modal-body">
          <div className="lbp-modal-message">{message}</div>
        </div>

        <div className="lbp-modal-actions">
          <button type="button" className="lbp-btn lbp-btn-ghost" onClick={onClose}>
            {cancelText || "Cancelar"}
          </button>

          <button
            type="button"
            className={"lbp-btn " + (tone === "danger" ? "lbp-btn-danger" : "lbp-btn-primary")}
            onClick={async () =>
            {
              if(onConfirm) await onConfirm();
              onClose && onClose();
            }}
          >
            {confirmText || "Confirmar"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function LimpiarBuscadorPokemon()
{
  const { refreshSuggestCachePokemon } = usePokemon();
  const [modal, setModal] = useState({ open: false });

  function askClear()
  {
    setModal({
      open: true,
      title: "Pokémon",
      message: "¿Actualizar la lista de Pokémon que alimenta el buscador?",
      confirmText: "Actualizar",
      cancelText: "Cancelar",
      tone: "danger",
      onConfirm: async function()
      {
        try
        {
          let result = null;
          if(typeof refreshSuggestCachePokemon === "function")
          {
            const limitState = consumeSessionRefresh("pokemon", SESSION_REFRESH_LIMIT);
            if(!limitState.allowed)
            {
              showToastr({
                title: "Pokémon",
                text: "Ya alcanzaste el límite de actualizaciones para esta sesión.",
                variant: "warning"
              });
              return;
            }

            result = await refreshSuggestCachePokemon();
          }

          if(result && result.manifestChanged)
          {
            showToastr({
              title: "Pokémon",
              text: "La lista del buscador se actualizó correctamente.",
              variant: "ok"
            });

          }else
          {
            showToastr({
              title: "Pokémon",
              text: "La lista del buscador ya está actualizada.",
              variant: "warning"
            });
          }
        }catch(e) {}
      }
    });
  }

  return (
    <>
      <div className="lbp-card">
        <div className="lbp-row">
          <div className="lbp-left">
            <div className="lbp-label">Actualizar Lista de <span className="lbp-label-highlight">Pokémon</span> del Buscador</div>
          </div>

          <div className="lbp-actions">
            <button type="button" className="lbp-btn lbp-btn-danger" onClick={askClear}>
              Actualizar
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
        onConfirm={modal.onConfirm}
        onClose={() => setModal({ open: false })}
      />
    </>
  );
}
