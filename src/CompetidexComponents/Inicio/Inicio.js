//** src\CompetidexComponents\Inicio\Inicio.js

import React from "react";
import { FaLinkedin } from "react-icons/fa";
import "./Inicio.css";

export default function Inicio()
{
    return (
        <main className="inicioComponent-wrapper">
            <section className="inicioComponent-card" aria-labelledby="inicioComponent-title">
                
                {/* Bloque Superior */}
                <div className="inicioComponent-content">
                    
                    {/* Titulo */}
                    <h1 id="inicioComponent-title" className="inicioComponent-title">
                        ¡Bienvenido a Competidex!
                    </h1>

                    <br></br><br></br>

                    {/* Parrafo 1 */}
                    <p className="inicioComponent-description">
                        Un sitio web sin fines de lucro para consulta de información Pokémon en español.
                        <br></br><br></br>
                        Con información detallada de <strong>objetos</strong>, <strong>habilidades</strong>, <strong>movimientos</strong> y <strong>Pokémon</strong>, <strong>Pokédex</strong> de todos los juegos, <strong>calculadora de debilidades y resistencias</strong>, <strong>calculadora de características</strong> y un <strong>buscador avanzado</strong> para encontrar todo lo que necesitas.
                    </p>

                    <br></br><br></br>

                    {/* Parrafo 2 */}
                    <p className="inicioComponent-description">
                        Accede a los módulos desde la barra de navegación superior. Si utilizas un dispositivo móvil, abre el menú desde el botón ubicado arriba a la izquierda.
                    </p>

                    <br></br><br></br>

                    {/* Parrafo 3 */}
                    <p className="inicioComponent-description">
                        ¡Gracias por leer y por visitar <strong className="inicioComponent-title-description">Competidex</strong>!
                    </p>

                </div>

                {/* Creditos */}
                <div className="inicioComponent-credits">
                    <p className="inicioComponent-author">
                        Elaborado por{" "}
                        <a
                            className="inicioComponent-authorLink"
                            href="https://www.linkedin.com/in/joaquín-marcelo-albarracín-24a779231"
                            target="_blank"
                            rel="noreferrer"
                            title="LinkedIn de Joaquin Marcelo Albarracin"
                        >
                            <FaLinkedin className="inicioComponent-linkedInIcon" aria-hidden="true" />{" "}
                            <span>Joaquin Marcelo Albarracin</span>
                        </a>
                    </p>
                </div>

            </section>
        </main>
    );

}