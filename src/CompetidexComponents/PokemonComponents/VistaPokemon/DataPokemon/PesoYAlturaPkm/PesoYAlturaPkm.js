//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\PesoYAlturaPkm\PesoYAlturaPkm.js

import React from "react";
import "./PesoYAlturaPkm.css";
import { GiWeight } from "react-icons/gi";
import { CiLineHeight } from "react-icons/ci";

export default function PesoYAlturaPkm({ altura, peso, size = "normal", mostrarTexto = true })
{
    // Clases dinámicas para el tamaño
    const sizeClass = `info-contenedor-${size}`;

    return (
        <div className={`info-contenedor ${sizeClass}`}>
            
            {/* Altura (solo si hay valor) */}
            {altura !== null && altura !== undefined && altura !== "" && (
                <div className="info-item">
                    {/* Si mostrarTexto es true, muestra "Altura: X"; si no, solo el valor */}
                    <span className="info-nombre">
                        {mostrarTexto ? (
                            <>
                                <span className="info-label-word">Altura</span>: {altura}
                            </>
                        ) : (
                            altura
                        )}
                    </span>
                    <CiLineHeight className="info-icon" />
                </div>
            )}

            {/* Peso (solo si hay valor) */}
            {peso !== null && peso !== undefined && peso !== "" && (
                <div className="info-item">
                    {/* Si mostrarTexto es true, muestra "Peso: X"; si no, solo el valor */}
                    <span className="info-nombre">
                        {mostrarTexto ? (
                            <>
                                <span className="info-label-word">Peso</span>: {peso}
                            </>
                        ) : (
                            peso
                        )}
                    </span>
                    <GiWeight className="info-icon" />
                </div>
            )}
            
        </div>
    );

}
