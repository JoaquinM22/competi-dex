//** src\CompetidexComponents\SharedComponents\Modal\Modal.js

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import "./Modal.css";

export default function Modal({ open, title, onClose, children })
{
    useEffect(() =>
    {
        if (!open) return;

        function onKey(e)
        {
            if (e.key === "Escape") onClose && onClose();
        }

        document.addEventListener("keydown", onKey);

        const prev = document.body.style.overflow;
        const prevHtml = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.classList.add("modal-open");

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
            document.documentElement.style.overflow = prevHtml;
            document.body.classList.remove("modal-open");
        };

    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="appModalBackdrop" onMouseDown={onClose} role="dialog" aria-modal="true">
            <div className="appModal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="appModalHeader">
                    <div className="appModalTitle">{title || "Modal"}</div>
                    <button type="button" className="appModalClose" onClick={onClose} aria-label="Cerrar">
                        <IoMdClose />
                    </button>
                </div>

                <div className="appModalBody">  
                    <div className="appModalScroll">{children}</div>
                </div>

            </div>
        </div>,
        document.body
    );
  
}