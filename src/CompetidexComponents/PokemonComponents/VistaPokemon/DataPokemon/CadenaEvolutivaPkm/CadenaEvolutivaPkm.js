//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\CadenaEvolutivaPkm\CadenaEvolutivaPkm.js

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { MdDownload } from "react-icons/md";
import { ERROR_404_IMG, SHINY_ICON_IMG } from "../../../../../utils/competidexMeta";
import { pokemonRoute } from "../../../../../utils/competidexRoutes";
import { preloadCachedImage, probeCachedImage } from "../../../../../utils/competidexImgCache";
import "./CadenaEvolutivaPkm.css";

export default function CadenaEvolutivaPkm({ cadenaEvolutiva })
{
  const navigate = useNavigate();
  const [imagenAmpliadaEvo, setImagenAmpliadaEvo] = useState({ normal: "", shiny: "" });
  const [okAmpliadaEvo, setOkAmpliadaEvo] = useState({ normal: true, shiny: true });
  const [nombreAmpliadoEvo, setNombreAmpliadoEvo] = useState("");
  const [esShinyEvo, setEsShinyEvo] = useState(false);
  const [isDownloadingEvo, setIsDownloadingEvo] = useState(false);

  // Helpers de formato para nombres y géneros

  // Detecta género por API key:
  // - termina en -m / -f  (nidoran-m / nidoran-f)
  // - termina en -male / -female (meowstic-male / meowstic-female, indeedee-male, etc.)
  const getGenderFromApiKey = (apiKey) =>
  {
    const k = String(apiKey || "").toLowerCase().trim();
    
    if (!k) return "";

    if (/-m$/.test(k) || /-male$/.test(k)) return "male";
    if (/-f$/.test(k) || /-female$/.test(k)) return "female";
    
    return "";

  };

  // Quita sufijos -m/-f/-male/-female (solo de display, NO del apiKey)
  const stripGenderSuffix = (name) =>
  {
    let s = String(name || "").trim();

    s = s.replace(/-male$/i, "").replace(/-female$/i, "");
    s = s.replace(/-m$/i, "").replace(/-f$/i, "");
    
    return s.trim();

  };

  // Quita símbolos ♂/♀ del texto
  const stripGenderSymbols = (name) => String(name || "").replace(/[♂♀]/g, "").trim();

  // Formatea bonito (por si viene con guiones)
  const prettyName = (raw) =>
  {
    let s = stripGenderSymbols(stripGenderSuffix(raw));
    
    // si viene como "nidoran-f" o "mr-mime"
    s = s.replace(/-/g, " ").replace(/\s{2,}/g, " ").trim();
    
    // capitaliza solo la primera letra de cada palabra
    s = s
      .split(" ")
      .map((part) =>
      {
        if(!part) return part;

        const first = part.charAt(0).toLocaleUpperCase("es-ES");
        return first + part.slice(1);
      })
      .join(" ");

    return s;

  };

  const slugifyName = (name, shinyFlag) =>
  {
    let s = String(name || "pokemon").toLowerCase();
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    s = s
      .replace(/♂/g, " macho ")
      .replace(/♀/g, " hembra ")
      .replace(/&/g, " y ")
      .replace(/’|‘|,|‛|'/g, "");
    s = s.replace(/[^a-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
    
    if (shinyFlag) s += "_shiny";

    return s || (shinyFlag ? "pokemon_shiny" : "pokemon");

  };

  // Precarga/verificación para toda la cadena
  useEffect(() =>
  {
    const urls = new Set();
    (cadenaEvolutiva || []).forEach((e) =>
    {
      const n = e?.fotos?.[0];
      const s = e?.fotos?.[1] || n;
      if (n) urls.add(n);
      if (s) urls.add(s);
    });

    urls.forEach((u) =>
    {
      if(!u) return;
      preloadCachedImage(u);
    });

    preloadCachedImage(SHINY_ICON_IMG);

  }, [cadenaEvolutiva]);

  // Bloqueo scroll al abrir modal
  useEffect(() =>
  {
    const modalAbierto = Boolean(imagenAmpliadaEvo.normal);

    if(modalAbierto)
    {
      if(document.body.dataset.prevOverflowEvo == null)
      {
        document.body.dataset.prevOverflowEvo = document.body.style.overflow || "";
      }

      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");

    }else
    {
      document.body.style.overflow = document.body.dataset.prevOverflowEvo || "";
      delete document.body.dataset.prevOverflowEvo;
      document.body.classList.remove("modal-open");
    }

    return () =>
    {
      document.body.style.overflow = document.body.dataset.prevOverflowEvo || "";
      delete document.body.dataset.prevOverflowEvo;
      document.body.classList.remove("modal-open");
    };

  }, [imagenAmpliadaEvo.normal]);

  // Niveles de evolución
  const nivelesEvolucion = useMemo(() =>
  {
    if (!cadenaEvolutiva || cadenaEvolutiva.length === 0) return [];

    const niveles = [];
    const procesados = new Set();
    const primerNivel = [cadenaEvolutiva[0]];

    niveles.push(primerNivel);
    procesados.add(cadenaEvolutiva[0].nombreEvolucion);

    while(true)
    {
      const nivelAnterior = niveles[niveles.length - 1];
      const siguienteNivel = new Array(nivelAnterior.length).fill(null);

      nivelAnterior.forEach((poke, index) =>
      {
        const evos = cadenaEvolutiva.filter(
          (evo) =>
            !procesados.has(evo.nombreEvolucion) && evo.nombrePreEvo === poke.nombreEvolucion
        );

        if(evos.length > 0)
        {

          evos.forEach((evo, evoIndex) =>
          {
            const pos = index + evoIndex;
            if (!siguienteNivel[pos]) siguienteNivel[pos] = evo;
            else siguienteNivel.splice(pos, 0, evo);
            procesados.add(evo.nombreEvolucion);
          });

        }

      });

      if (siguienteNivel.every((e) => e === null)) break;

      niveles.push(siguienteNivel);

    }

    return niveles;

  }, [cadenaEvolutiva]);

  if (nivelesEvolucion.length === 0) return <div>No hay evolución disponible</div>;

  // Descargar (solo si la imagen actual es válida)
  const handleDownloadEvo = async () =>
  {
    const esOk = esShinyEvo ? okAmpliadaEvo.shiny : okAmpliadaEvo.normal;
    if (isDownloadingEvo || !esOk) return;
    setIsDownloadingEvo(true);

    try
    {
      const url = esShinyEvo ? imagenAmpliadaEvo.shiny : imagenAmpliadaEvo.normal;
      const resp = await fetch(url);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);

      const safe = slugifyName(nombreAmpliadoEvo, esShinyEvo);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${safe}.png`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

    }catch(err)
    {
      console.error("Error descargando imagen:", err);
    
    }finally
    {
      setIsDownloadingEvo(false);
    }

  };

  // Abrir modal y verificar URLs
  const abrirModal = async (poke) =>
  {
    const normal = poke.fotos?.[0] || "";
    const shiny = poke.fotos?.[1] || poke.fotos?.[0] || "";
    setImagenAmpliadaEvo({ normal, shiny });
    setNombreAmpliadoEvo(poke.nombreEvolucion);
    setEsShinyEvo(false);

    const [okN, okS] = await Promise.all([probeCachedImage(normal), probeCachedImage(shiny)]);
    setOkAmpliadaEvo({ normal: !!okN, shiny: !!okS });
  };

  // Estado actual (modal)
  const urlActual = esShinyEvo ? imagenAmpliadaEvo.shiny : imagenAmpliadaEvo.normal;
  const okActual = esShinyEvo ? okAmpliadaEvo.shiny : okAmpliadaEvo.normal;

  const handleClickNombre = (poke) =>
  {
    const destino = poke?.nombreEvoApi || "";
    if (!destino) return;

    navigate(pokemonRoute(encodeURIComponent(destino)));
  };

  // Render del nombre con símbolo (si corresponde)
  const renderNombreConGenero = (poke) =>
  {
    if (!poke) return null;

    // 1) Si el display ya trae símbolos, respetamos
    const rawName = String(poke.nombreEvolucion || "");
    const hasMaleSymbol = rawName.indexOf("♂") !== -1;
    const hasFemaleSymbol = rawName.indexOf("♀") !== -1;

    let gender = "";
    if(hasMaleSymbol)
    {
      gender = "male";

    }else if(hasFemaleSymbol)
    {
      gender = "female";

    }else
    {
      // 2) Si NO trae símbolo, inferimos por nombreEvoApi (nidoran-f / -m)
      gender = getGenderFromApiKey(poke.nombreEvoApi);
    }

    // Base name bonito: "Nidoran" (en vez de "Nidoran-f")
    const baseName = prettyName(rawName || poke.nombreEvoApi || "");

    if(gender === "male")
    {

      return (
        <div title={`Ver datos de Pokémon: ${baseName} Macho`} className="nombrePkmP nombreEvoClickable" onClick={() => handleClickNombre(poke)}>
          {baseName} <IoMdMale className="gender male" />
        </div>
      );

    }

    if(gender === "female")
    {

      return (
        <div title={`Ver datos de Pokémon: ${baseName} Hembra`} className="nombrePkmP nombreEvoClickable" onClick={() => handleClickNombre(poke)}>
          {baseName} <IoMdFemale className="gender female" />
        </div>
      );

    }

    return (
      <p title={`Ver datos de Pokémon: ${baseName}`} className="nombrePkmP nombreEvoClickable" onClick={() => handleClickNombre(poke)}>
        {baseName}
      </p>
    );

  };

  return (
    <div className="contenedorCadenaEvolutiva">
      
      {/* Arbol de Cadena Evolutiva del Pokémon */}
      {nivelesEvolucion.map((nivel, index) => (
        <div key={index} className="etapaEvo">
          <div className="evo-grid">
            {nivel.map((poke, idx) => (
              <div className="contPokemonYFlecha" key={idx}>
                {poke ? (
                  <>
                    {poke.nombrePreEvo && (
                      <div className="contenedorFlechayTexto">
                        <div className="flecha">&#8594;</div>
                        <p className="metodo-evo">{poke.metodoEvo}</p>
                      </div>
                    )}

                    <div className="pokemon">
                      <img
                        src={poke.fotos?.[0] || ERROR_404_IMG}
                        alt={`Imagen de ${poke.nombreEvolucion}`}
                        className="imagen-forma"
                        onClick={() => abrirModal(poke)}
                        onError={(e) => (e.currentTarget.src = ERROR_404_IMG)}
                        loading="lazy"
                        decoding="async"
                      />

                      {renderNombreConGenero(poke)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="arrow-container empty"></div>
                    <div className="pokemon empty"></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {imagenAmpliadaEvo.normal && (
        <div
          className="modal-overlayEvo"
          onClick={() => {
            setImagenAmpliadaEvo({ normal: "", shiny: "" });
            setOkAmpliadaEvo({ normal: true, shiny: true });
            setEsShinyEvo(false);
          }}
        >
          <div className="modal-contentEvo" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modalImgWrapEvo">
              
              {/* Botones */}
              <div className="botonesWrapperEvo modalButtonsEvo">
                <button
                  className="botonDescargarEvo"
                  onClick={handleDownloadEvo}
                  disabled={isDownloadingEvo || !okActual}
                  aria-label={okActual ? "Descargar imagen" : "Sin imagen disponible"}
                  title={okActual ? "Descargar" : "Sin imagen disponible"}
                >
                  {isDownloadingEvo ? "..." : <MdDownload color="white" size={22} />}
                </button>

                <button
                  className={`botonShinyEvo ${esShinyEvo ? "activo" : ""}`}
                  onClick={() => setEsShinyEvo(!esShinyEvo)}
                  title="Alternar shiny"
                  aria-pressed={esShinyEvo}
                >
                  <img src={SHINY_ICON_IMG} alt="Shiny" className="iconoBotonEvo" />
                </button>
              </div>

              {/* Contenido del modal */}
              {okActual ? (
                <img
                  src={urlActual}
                  alt={`Imagen de ${nombreAmpliadoEvo}`}
                  className="imagen-ampliadaEvo"
                  onError={() => {
                    if (esShinyEvo) setOkAmpliadaEvo((p) => ({ ...p, shiny: false }));
                    else setOkAmpliadaEvo((p) => ({ ...p, normal: false }));
                  }}
                />
              ) : (
                <div className="fallbackCardEvo">
                  <img src={ERROR_404_IMG} alt="Imagen no disponible" className="fallbackImageEvo" />
                  <div className="fallbackTextEvoNotFound">NOT FOUND</div>
                  <div className="fallbackTextEvo">No se encontró la foto</div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );

}