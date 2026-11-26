//** src\CompetidexComponents\ConfiguracionComponents\Configuracion.js

import React, { useState } from "react";
import { FaGear } from "react-icons/fa6";
import Modal from "../SharedComponents/Modal/Modal";
import PersistirMovimientos from "./PersistirMovimientos/PersistirMovimientos";
import LimpiarBuscadorMovimientos from "./LimpiarBuscadorMovimientos/LimpiarBuscadorMovimientos";
import LimpiarBuscadorHabilidades from "./LimpiarBuscadorHabilidades/LimpiarBuscadorHabilidades";
import LimpiarBuscadorPokemon from "./LimpiarBuscadorPokemon/LimpiarBuscadorPokemon";
import LimpiarBuscadorItems from "./LimpiarBuscadorItems/LimpiarBuscadorItems";
import RefrescarPokedex from "./RefrescarPokedex/RefrescarPokedex";
import "./Configuracion.css";

export default function Configuracion()
{
  const [open, setOpen] = useState(false);

  return (
    <>

      {/* Boton Engranaje que abre el Modal de Configuracion */}
      <button
        type="button"
        className="btnConfigHeader"
        onClick={() => setOpen(true)}
        aria-label="Abrir configuración"
        title="Configuración"
      >
        <FaGear />
      </button>

      {/* Modal que tiene dentro todos los Items de Configuracion */}
      <Modal
        open={open}
        title="Configuración"
        onClose={() => setOpen(false)}
      >
        <div className="cfg-page">
          <PersistirMovimientos />
          <LimpiarBuscadorMovimientos />
          <LimpiarBuscadorHabilidades />
          <LimpiarBuscadorPokemon />
          <LimpiarBuscadorItems />
          <RefrescarPokedex />
        </div>
      </Modal>
      
    </>
  );

}