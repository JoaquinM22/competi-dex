//** src\CompetidexComponents\Footer\Footer.js

import React, { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import Modal from "../SharedComponents/Modal/Modal";
import "./Footer.css";

export default function Footer()
{
  const [aboutOpen, setAboutOpen] = useState(false);

  const detalle = 
  (", una página web orientada tanto a los fanáticos del competitivo Pokémon como a los " +
  "jugadores casuales de la saga. En esta web podrán consultar de forma rápida y precisa, gracias " +
  "a sus buscadores dedicados, datos esenciales de Pokémon, como estadísticas de combate, debilidades " +
  "y resistencias, formas, cadenas evolutivas, movimientos, habilidades, entre otros, así como también " +
  "información específica de movimientos, habilidades y objetos, entre otras cosas. Cualquier feedback es bienvenido si me escriben a mi ");

  return (
    <>

      {/* Footer */}
      <footer className="competidexFooter">
        <div className="competidexFooterInner">
          <span className="competidexFooterText">

            <span>© 2026 Competidex </span>

            <span>· Elaborado por</span>

            <a
              className="competidexFooterExternalLink"
              href="https://www.linkedin.com/in/joaquín-marcelo-albarracín-24a779231"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin className="competidexFooterLinkedInIcon" aria-hidden="true" />{" "}
              <span className="competidexFooterBold">Joaquin Marcelo Albarracin </span>
            </a>

            <span>· Datos vía </span>

            <a
              className="competidexFooterExternalLink"
              href="https://pokeapi.co/"
              target="_blank"
              rel="noreferrer"
              title="PokéAPI"
            >
              <span className="competidexFooterBold">PokéAPI</span>
            </a>

            <span> ·</span>

            <button
              type="button"
              className="competidexFooterAboutBtn competidexFooterBold"
              onClick={() => setAboutOpen(true)}
            >
              Acerca de
            </button>

            <span>· Proyecto sin fines de lucro</span>

          </span>
        </div>
      </footer>

      {/* Modal Acerca de */}
      <Modal
        open={aboutOpen}
        title="Acerca de Competidex"
        onClose={() => setAboutOpen(false)}
      >
        <div className="competidexFooterAboutModalText">
          <p>

            Bienvenidos a{" "}

            <span className="competidexFooterBold-about">Competidex</span>

            {detalle}

            <a
              className="competidexFooterExternalLink-about"
              href="https://www.linkedin.com/in/joaquín-marcelo-albarracín-24a779231"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
            >
              LinkedIn
            </a>

            . Gracias por leer y por usar Competidex. Saludos!
            
          </p>
        </div>
      </Modal>

    </>
  );

}