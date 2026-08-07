//** src\CompetidexComponents\ConfiguracionComponents\LimpiarBuscadorHabilidades\LimpiarBuscadorHabilidades.js

import React, { useState } from "react";
import { useAbilities } from "../../HabilidadesComponents/AbilitiesProvider";
import { showToastr } from "../../../services/ToastrService";
import { consumeSessionRefresh } from "../../../utils/sessionRefreshLimiter";
import "./LimpiarBuscadorHabilidades.css";

const SESSION_REFRESH_LIMIT = 3;

function ConfirmModal({ open, title, message, confirmText, cancelText, tone, onConfirm, onClose })
{
  if (!open) return null;

  return (
    <div className="lbh-modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="lbh-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="lbh-modal-header">
          <div className="lbh-modal-title">{title}</div>
        </div>

        <div className="lbh-modal-body">
          <div className="lbh-modal-message">{message}</div>
        </div>

        <div className="lbh-modal-actions">
          <button type="button" className="lbh-btn lbh-btn-ghost" onClick={onClose}>
            {cancelText || "Cancelar"}
          </button>

          <button
            type="button"
            className={"lbh-btn " + (tone === "danger" ? "lbh-btn-danger" : "lbh-btn-primary")}
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

export default function LimpiarBuscadorHabilidades()
{
  const { refreshSuggestCacheAbilities } = useAbilities();
  const [modal, setModal] = useState({ open: false });

  function askClear()
  {
    setModal({
      open: true,
      title: "Habilidades",
      message: "¿Actualizar la lista de habilidades que alimenta el buscador?",
      confirmText: "Actualizar",
      cancelText: "Cancelar",
      tone: "danger",
      onConfirm: async function()
      {
        try
        {
          let result = null;
          if(typeof refreshSuggestCacheAbilities === "function")
          {
            const limitState = consumeSessionRefresh("abilities", SESSION_REFRESH_LIMIT);
            if(!limitState.allowed)
            {
              showToastr({
                title: "Habilidades",
                text: "Ya alcanzaste el límite de actualizaciones para esta sesión.",
                variant: "warning"
              });
              return;
            }

            result = await refreshSuggestCacheAbilities();
          }

          if(result && result.manifestChanged)
          {
            showToastr({
              title: "Habilidades",
              text: "La lista del buscador se actualizó correctamente.",
              variant: "ok"
            });
          }else
          {
            showToastr({
              title: "Aviso en Habilidades",
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
      <div className="lbh-card">
        <div className="lbh-row">
          <div className="lbh-left">
            <div className="lbh-label">
              Actualizar Lista de <span className="lbh-label-highlight">Habilidades</span> del Buscador
            </div>
          </div>

          <div className="lbh-actions">
            <button type="button" className="lbh-btn lbh-btn-danger" onClick={askClear}>
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
