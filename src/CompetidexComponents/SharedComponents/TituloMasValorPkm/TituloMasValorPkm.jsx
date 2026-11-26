//** src\CompetidexComponents\SharedComponents\TituloMasValorPkm\TituloMasValorPkm.js

import React, { useMemo } from "react";
import "./TituloMasValorPkm.css";

function normalizeValue(value)
{
    if(value === null || value === undefined || value === "") return "-";

    return String(value);
}

function renderLabelSubrayado(texto)
{
    const parts = String(texto || "").match(/[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+|[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+/g) || [];

    if(!parts.length)
    {
        return null;
    }

    return parts.map(function(part, index)
    {
        const isWord = /[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]/.test(part);

        return (
            <React.Fragment key={`${part}-${index}`}>
                {isWord ? (
                    <span className="tituloMasValorPkmComponent-underline">{part}</span>
                ) : (
                    part
                )}
            </React.Fragment>
        );
    });

}

export default function TituloMasValorPkm({
    value = null,
    label = "",
    size = "normal",
    tooltip = "",
    valueTextAlign = "right",
    allowWrap = false
})
{
    const txt = useMemo(function()
    {
        return normalizeValue(value);

    }, [value]);

    const sizeClass = `tituloMasValorPkmComponent-${size}`;
    const tooltipText = String(tooltip || "").trim();
    const resolvedValueTextAlign = ["left", "center", "right"].includes(String(valueTextAlign || "").toLowerCase())
        ? String(valueTextAlign).toLowerCase()
        : "right";

    return (
        <div className={`tituloMasValorPkmComponent ${sizeClass}`}>
            <div
                className={`tituloMasValorPkmComponent-row ${tooltipText ? "has-tooltip" : ""} ${allowWrap ? "allow-wrap" : ""}`}
                tabIndex={tooltipText ? 0 : undefined}
                aria-label={tooltipText || label || "Valor"}
            >

                {/* Titulo */}
                <div className="tituloMasValorPkmComponent-label">
                    {renderLabelSubrayado(label)}
                    <span>:</span>
                </div>

                {/* Valor */}
                <div
                    className="tituloMasValorPkmComponent-valueWrap"
                    style={{ textAlign: resolvedValueTextAlign }}
                >
                    <div
                        className="tituloMasValorPkmComponent-value"
                        style={{ textAlign: resolvedValueTextAlign }}
                    >
                        {txt}
                    </div>
                </div>

                {/* Tooltip */}
                {tooltipText && (
                    <div className="tituloMasValorPkmComponent-tooltip" role="tooltip">
                        {tooltipText}
                    </div>
                )}

            </div>
        </div>
    );

}