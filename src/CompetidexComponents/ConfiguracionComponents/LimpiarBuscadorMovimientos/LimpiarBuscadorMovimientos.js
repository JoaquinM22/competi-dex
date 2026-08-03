//** src\CompetidexComponents\ConfiguracionComponents\LimpiarBuscadorMovimientos\LimpiarBuscadorMovimientos.js

import React, { useState } from "react";
import { useMoves } from "../../MovimientosComponents/MovesProvider";
import { showToastr } from "../../../services/ToastrService";
import "./LimpiarBuscadorMovimientos.css";

function ConfirmModal({ open, title, message, confirmText, cancelText, tone, onConfirm, onClose })
{
  if (!open) return null;

  return (
    <div className="lbmmodal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="lbmmodal" onMouseDown={(e) => e.stopPropagation()}>

        <div className="lbmmodal-header">
          <div className="lbmmodal-title">{title}</div>
        </div>

        <div className="lbmmodal-body">
          <div className="lbmmodal-message">{message}</div>
        </div>

        <div className="lbmmodal-actions">
          <button type="button" className="lbm-btn lbm-btn-ghost" onClick={onClose}>
            {cancelText || "Cancelar"}
          </button>

          <button
            type="button"
            className={"lbm-btn " + (tone === "danger" ? "lbm-btn-danger" : "lbm-btn-primary")}
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

export default function LimpiarBuscadorMovimientos()
{
  const { refreshSuggestCache } = useMoves();
  const [modal, setModal] = useState({ open: false });

  function askClear()
  {
    setModal({
      open: true,
      title: "Movimientos",
      message: "¿Actualizar la lista de movimientos que alimenta el buscador?",
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
            result = await refreshSuggestCache();
          }

          if(result && result.anyRefreshed)
          {
            showToastr({
              title: "Movimientos",
              text: "La lista del buscador se actualizó correctamente.",
              variant: "ok"
            });

          }else
          {
            showToastr({
              title: "Aviso en Movimientos",
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
      <div className="lbm-card">
        <div className="lbm-row">
          <div className="lbm-left">
            <div className="lbm-label">Actualizar Lista de <span className="lbm-label-highlight">Movimientos</span> del Buscador</div>
          </div>

          <div className="lbm-actions">
            <button type="button" className="lbm-btn lbm-btn-danger" onClick={askClear}>
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
