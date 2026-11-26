//** src\CompetidexComponents\ConfiguracionComponents\PersistirMovimientos\PersistirMovimientos.js

import React, { useState } from "react";
import { useMoves } from "../../MovimientosComponents/MovesProvider";
import { showToastr } from "../../../services/ToastrService";
import "./PersistirMovimientos.css";

function ConfirmModal({ open, title, message, confirmText, cancelText, tone, onConfirm, onClose })
{
  if (!open) return null;

  return (
    <div className="pmcfg-modal-backdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="pmcfg-modal" onMouseDown={(e) => e.stopPropagation()}>
        
        <div className="pmcfg-modal-header">
          <div className="pmcfg-modal-title">{title}</div>
        </div>

        <div className="pmcfg-modal-body">
          <div className="pmcfg-modal-message">{message}</div>
        </div>

        <div className="pmcfg-modal-actions">
          <button type="button" className="pmcfg-btn pmcfg-btn-ghost" onClick={onClose}>
            {cancelText || "Cancelar"}
          </button>

          <button
            type="button"
            className={"pmcfg-btn " + (tone === "danger" ? "pmcfg-btn-danger" : "pmcfg-btn-primary")}
            onClick={() =>
            {
              if(onConfirm) onConfirm();
              if(onClose) onClose();
            }}
          >
            {confirmText || "Confirmar"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function PersistirMovimientos()
{
  const {
    persistEnabled,
    enablePersistence,
    disablePersistence,
    clearPersistent
  } = useMoves();

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    tone: "primary",
    onConfirm: null
  });

  function notifyPersistenceState(enabled)
  {
    showToastr({
      title: "Configuración",
      text: enabled
        ? "La persistencia quedó activada correctamente."
        : "La persistencia quedó desactivada correctamente.",
      variant: "ok"
    });
  }

  function notifyClear()
  {
    showToastr({
      title: "Configuración",
      text: "La cache de los movimientos se borró correctamente.",
      variant: "ok"
    });
  }

  function askToggle()
  {
    if(persistEnabled)
    {
      setModal({
        open: true,
        title: "Cache de movimientos",
        message: "¿Desactivar la cache de movimientos?",
        confirmText: "Desactivar",
        cancelText: "Cancelar",
        tone: "danger",
        onConfirm: function()
        {
          if(disablePersistence) disablePersistence();
          setTimeout(() => notifyPersistenceState(false), 0);
        }
      });

    }else
    {
      setModal({
        open: true,
        title: "Cache de movimientos",
        message: "¿Activar la cache de movimientos que alimenta?",
        confirmText: "Activar",
        cancelText: "Cancelar",
        tone: "primary",
        onConfirm: function()
        {
          if(enablePersistence) enablePersistence();
          setTimeout(() => notifyPersistenceState(true), 0);
        }
      });
    }
  }

  function askClear()
  {
    setModal({
      open: true,
      title: "Cache de movimientos",
      message: "¿Borrar la cache de movimientos?",
      confirmText: "Borrar",
      cancelText: "Cancelar",
      tone: "danger",
      onConfirm: function()
      {
        if(clearPersistent) clearPersistent();
        setTimeout(() => notifyClear(), 0);
      }
    });
  }

  return (
    <>
      <div className="pmcfg-card">
        <div className="pmcfg-row">
          <div className="pmcfg-left">
            <div className="pmcfg-label">
              Persistir <span className="pmcfg-label-highlight">Movimientos</span> en cache
            </div>

            <div className={"pmcfg-status " + (persistEnabled ? "is-on" : "is-off")}>
              {persistEnabled ? "ACTIVADA" : "DESACTIVADA"}
            </div>

            <div className="pmcfg-hint">
              {persistEnabled ? "La cache está activada." : "La cache está desactivada."}
            </div>
          </div>

          <div className="pmcfg-actions">
            <button
              type="button"
              className={"pmcfg-btn " + (persistEnabled ? "pmcfg-btn-warn" : "pmcfg-btn-on")}
              onClick={askToggle}
            >
              {persistEnabled ? "Desactivar" : "Activar"}
            </button>

            <button type="button" className="pmcfg-btn pmcfg-btn-danger" onClick={askClear}>
              Borrar
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
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
    </>
  );
}
