//** src\CompetidexComponents\ConfiguracionComponents\LimpiarBuscadorItems\LimpiarBuscadorItems.js

import React, { useState } from "react";
import { useItems } from "../../ItemsComponents/ItemsProvider";
import { showToastr } from "../../../services/ToastrService";
import { consumeSessionRefresh } from "../../../utils/sessionRefreshLimiter";
import "./LimpiarBuscadorItems.css";

const SESSION_REFRESH_LIMIT = 3;

function ConfirmModal({ open, title, message, confirmText, cancelText, tone, onConfirm, onClose })
{
  if (!open) return null;

  return (
    <div className="lbi-modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="lbi-modal" onMouseDown={(e) => e.stopPropagation()}>

        <div className="lbi-modal-header">
          <div className="lbi-modal-title">{title}</div>
        </div>

        <div className="lbi-modal-body">
          <div className="lbi-modal-message">{message}</div>
        </div>

        <div className="lbi-modal-actions">
          <button type="button" className="lbi-btn lbi-btn-ghost" onClick={onClose}>
            {cancelText || "Cancelar"}
          </button>

          <button
            type="button"
            className={"lbi-btn " + (tone === "danger" ? "lbi-btn-danger" : "lbi-btn-primary")}
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

export default function LimpiarBuscadorItems()
{
  const { refreshSuggestCache } = useItems();
  const [modal, setModal] = useState({ open: false });

  function askClear()
  {
    setModal({
      open: true,
      title: "Objetos",
      message: "¿Actualizar la lista de objetos que alimenta el buscador?",
      confirmText: "Actualizar",
      cancelText: "Cancelar",
      tone: "danger",
      onConfirm: async function()
      {
        try
        {
          let result = null;
          if(typeof refreshSuggestCache === "function")
          {
            const limitState = consumeSessionRefresh("items", SESSION_REFRESH_LIMIT);
            if(!limitState.allowed)
            {
              showToastr({
                title: "Objetos",
                text: "Ya alcanzaste el límite de actualizaciones para esta sesión.",
                variant: "warning"
              });
              return;
            }

            result = await refreshSuggestCache();
          }

          if(result && result.manifestChanged)
          {
            showToastr({
              title: "Objetos",
              text: "La lista del buscador se actualizó correctamente.",
              variant: "ok"
            });

          }else
          {
            showToastr({
              title: "Aviso en Objetos",
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
      <div className="lbi-card">
        <div className="lbi-row">
          <div className="lbi-left">
            <div className="lbi-label">Actualizar Lista de <span className="lbi-label-highlight">Objetos</span> del Buscador</div>
          </div>

          <div className="lbi-actions">
            <button type="button" className="lbi-btn lbi-btn-danger" onClick={askClear}>
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
