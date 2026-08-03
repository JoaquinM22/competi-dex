//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\NombreIDPkm\NombreIDPkm.js

import React, { useMemo } from "react";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { spriteUrl, spriteShinyUrl } from "../../../../../config/endpoints";
import { getTypeColor } from "../../../../../utils/competidexMeta";
import SpriteModal from "../../../../SharedComponents/SpriteModal/SpriteModal";
import "./NombreIDPkm.css";

export default function NombreIDPkm({ id, nombre, tipos })
{
    const tiposArr = Array.isArray(tipos) ? tipos : [];

    const color1 = getTypeColor(tiposArr[0]) || getTypeColor("unknown") || "#68A090";
    const color2 = tiposArr[1] ? (getTypeColor(tiposArr[1]) || color1) : color1;

    const estiloFondo = {
        background: tiposArr.length > 1
            ? `linear-gradient(90deg, ${color1} 45%, ${color2} 55%)`
            : color1,
    };

    // --- Lógica para género ---
    let nombreBase = String(nombre || "").trim();
    let genero = null;

    // urls a partir del id
    const spriteNormal = useMemo(() => (id ? spriteUrl(id) : null), [id]);
    const spriteShiny = useMemo(() => (id ? spriteShinyUrl(id) : null), [id]);

    if(nombreBase.includes("♂"))
    {
        nombreBase = nombreBase.replace("♂", "").trim();
        genero = "male";

    }else if(nombreBase.includes("♀"))
    {
        nombreBase = nombreBase.replace("♀", "").trim();
        genero = "female";

    }else if(/\s+macho$/i.test(nombreBase))
    {
        nombreBase = nombreBase.replace(/\s+macho$/i, "").trim();
        genero = "male";

    }else if(/\s+hembra$/i.test(nombreBase))
    {
        nombreBase = nombreBase.replace(/\s+hembra$/i, "").trim();
        genero = "female";
    }

    return (
        <div className="contenedorID-Nombre">
            
            {/* ID Pokémon */}
            <div className="idPkm">
                <h3>#{id}</h3>
            </div>

            {/* Nombre Pokémon */}
            <div className="nombrePkm" style={estiloFondo}>
                {nombreBase}
                {genero === "male" && <IoMdMale className="genderNId maleNId" />}
                {genero === "female" && <IoMdFemale className="genderNId femaleNId" />}
            </div>

            {/* Sprite Pokémon */}
            <div className="spritePkmBox">
                <SpriteModal
                    normalUrl={spriteNormal}
                    shinyUrl={spriteShiny}
                    altText={nombreBase}
                    thumbSize={150}
                />
            </div>

        </div>
    );

}