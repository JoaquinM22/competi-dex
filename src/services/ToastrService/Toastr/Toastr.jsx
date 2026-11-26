//** src\services\ToastrService\Toastr\Toastr.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Toastr.css";

const DEFAULT_DURATION = 1500;

const VARIANT_STYLES = {
    "default": {
        "shellBg": "rgba(31,34,39,0.96)",
        "shellBorder": "rgba(255,255,255,0.16)",
        "progress": "linear-gradient(90deg, #ff4d4f, #ff9a9e)"
    },
    "ok": {
        "shellBg": "rgba(18, 40, 28, 0.96)",
        "shellBorder": "rgba(76, 175, 80, 0.30)",
        "progress": "linear-gradient(90deg, #43a047, #81c784)"
    },
    "warning": {
        "shellBg": "rgba(59, 44, 12, 0.96)",
        "shellBorder": "rgba(255, 193, 7, 0.28)",
        "progress": "linear-gradient(90deg, #ffb000, #ffd166)"
    },
    "error": {
        "shellBg": "rgba(58, 18, 18, 0.96)",
        "shellBorder": "rgba(255, 96, 96, 0.28)",
        "progress": "linear-gradient(90deg, #ff4d4f, #ff7875)"
    }
};

export default function Toastr({
    text,
    title,
    open = true,
    duration = DEFAULT_DURATION,
    barColor,
    variant = "default",
    onClose,
    className = "",
    stackIndex = 0
})
{
    const resolvedTitle = String(title || "").trim();
    const resolvedText = String(text || "").trim();
    const hasTitle = !!resolvedTitle;
    const hasText = !!resolvedText;
    const hasContent = hasTitle || hasText;
    const [visible, setVisible] = useState(!!open && hasContent);
    const timerRef = useRef(null);
    const onCloseRef = useRef(onClose);

    const resolvedDuration = useMemo(() =>
    {
        const n = Number(duration);
        return (Number.isFinite(n) && (n > 0)) ? n : DEFAULT_DURATION;
    }, [duration]);

    const resolvedVariant = useMemo(() =>
    {
        const v = String(variant || "default").trim().toLowerCase();
        return VARIANT_STYLES[v] ? v : "default";
    }, [variant]);

    const variantStyles = VARIANT_STYLES[resolvedVariant];

    useEffect(() =>
    {
        onCloseRef.current = onClose;

    }, [onClose]);

    useEffect(() =>
    {
        setVisible(!!open && hasContent);
    }, [open, hasContent]);

    useEffect(() =>
    {
        if(!visible || !hasContent)
        {
            return undefined;
        }

        if(timerRef.current)
        {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() =>
        {
            setVisible(false);
            if(typeof onCloseRef.current === "function")
            {
                onCloseRef.current();
            }

        }, resolvedDuration);

        return function()
        {
            if(timerRef.current)
            {
                clearTimeout(timerRef.current);
            }
        };

    }, [visible, hasContent, resolvedDuration]);

    if(!visible || !hasContent)
    {
        return null;
    }

    const shellStyle = {
        "--toast-ms": `${resolvedDuration}ms`,
        "--toast-shell-bg": variantStyles.shellBg,
        "--toast-shell-border": variantStyles.shellBorder,
        "--toast-bar-color": barColor || variantStyles.progress,
        "--toast-stack-index": String(stackIndex || 0)
    };

    const shellClassName = ["toastr-shell", `variant-${resolvedVariant}`, className, visible ? "is-open" : ""].filter(Boolean).join(" ");
    const cardClassName = ["toastr-card", hasTitle ? "has-title" : "text-only"].filter(Boolean).join(" ");

    function handleManualClose()
    {
        if(timerRef.current)
        {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setVisible(false);
        if(typeof onCloseRef.current === "function")
        {
            onCloseRef.current();
        }
    }

    return (
        <div className={shellClassName} style={shellStyle} role="status" aria-live="polite">
            <div className={cardClassName}>
                <button
                    type="button"
                    className="toastr-close-btn"
                    aria-label="Cerrar notificación"
                    onClick={handleManualClose}
                >
                    ×
                </button>

                {/* Titulo Opcional */}
                {hasTitle && <div className="toastr-title">{resolvedTitle}</div>}

                {/* Linea Separadora (Solo si hay Titulo) */}
                {hasTitle && <div className="toastr-separator" aria-hidden="true" />}
                
                {/* Texto */}
                {hasText && (
                    <div className={hasTitle ? "toastr-text" : "toastr-text toastr-text-alone"}>
                        {resolvedText}
                    </div>
                )}

                {/* Barra de Progreso */}
                <div className="toastr-progress" />
                
            </div>
        </div>
    );

}