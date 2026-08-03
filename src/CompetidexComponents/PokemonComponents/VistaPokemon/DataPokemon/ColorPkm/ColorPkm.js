//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\ColorPkm\ColorPkm.js

import React from "react";
import { getColorLabelEs, getColorColor } from "../../../../../utils/competidexMeta";
import "./ColorPkm.css";

export default function ColorPkm({ color, size = "normal" })
{
    const colorFondo = getColorColor(color) || null;
    const colorLabel = getColorLabelEs(color) || "Desconocido";

    // Si el color es blanco o amarillo, el texto será negro, de lo contrario será blanco
    const colorContorno = (colorFondo === "#FFFFFF" || colorFondo === "#FFD700") ? "#000000" : "#FFFFFF";

    // Definir clase de tamaño basado en la prop `size`
    const sizeClass = `color-pkm-${size}`;
    const sizeBoxClass = `color-box-${size}`;

    return (
        <div className={`color-pkm ${sizeClass}`}>
            <div className="color-pkm-info">
                <span className="color-label" aria-label="Color">
                    <span className="color-label-word">Color</span>:
                </span>
                <span style={{ color: colorFondo || "#FFFFFF" }}>
                    {colorFondo ? colorLabel : "Desconocido"}
                </span>

                {colorFondo && (
                    <span
                        className={`color-box ${sizeBoxClass}`}
                        style={{
                            backgroundColor: colorFondo,
                            border: `2px solid ${colorContorno}`
                        }}
                    ></span>
                )}
            </div>
        </div>
    );
    
}