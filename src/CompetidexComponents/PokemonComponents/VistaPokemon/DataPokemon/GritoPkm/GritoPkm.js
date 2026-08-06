//** src\CompetidexComponents\PokemonComponents\VistaPokemon\DataPokemon\GritoPkm\GritoPkm.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoMdPlay, IoMdPause, IoMdVolumeHigh } from "react-icons/io";
import "./GritoPkm.css";

export default function GritoPkm({ gritoUrl = null, size = "normal" })
{
    const url = typeof gritoUrl === "string" ? gritoUrl.trim() : "";
    const hasAudio = !!url;
    const audioRef = useRef(null);
    const volumeWrapRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [volumeOpen, setVolumeOpen] = useState(false);

    const normalizedSize = ["small", "medium", "normal", "large"].includes(String(size).trim().toLowerCase())
        ? String(size).trim().toLowerCase()
        : "normal";

    const sizeClass = `gritoPkm-contenedor-${normalizedSize}`;
    const titleClass = `gritoPkm-titleRow-${normalizedSize}`;
    const labelClass = `gritoPkm-label-${normalizedSize}`;

    const progress = useMemo(() =>
    {
        if(!duration || !Number.isFinite(duration) || duration <= 0)
        {
            return 0;
        }

        return Math.min(100, Math.max(0, (currentTime / duration) * 100));

    }, [currentTime, duration]);

    const progressDotLeft = useMemo(() =>
    {
        if(progress <= 0)
        {
            return "6px";
        }

        if(progress >= 100)
        {
            return "calc(100% - 6px)";
        }

        return `${progress}%`;

    }, [progress]);

    useEffect(() =>
    {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        const audio = audioRef.current;
        if(audio)
        {
            audio.pause();
            audio.currentTime = 0;
        }

    }, [url]);

    useEffect(() =>
    {
        const audio = audioRef.current;

        if(audio)
        {
            audio.volume = Math.min(1, Math.max(0, volume / 100));
        }

    }, [volume]);

    useEffect(() =>
    {
        if(!volumeOpen)
        {
            return undefined;
        }

        function handlePointerDown(event)
        {
            const wrap = volumeWrapRef.current;
            if(!wrap)
            {
                return;
            }

            if(!wrap.contains(event.target))
            {
                setVolumeOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);

        return () =>
        {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
        };

    }, [volumeOpen]);

    useEffect(() =>
    {
        const audio = audioRef.current;
        if(!audio || !hasAudio)
        {
            return undefined;
        }

        function syncPlaying()
        {
            setIsPlaying(!audio.paused && !audio.ended);
        }

        function syncTime()
        {
            setCurrentTime(audio.currentTime || 0);
            setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        }

        function syncLoaded()
        {
            setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        }

        function syncEnded()
        {
            setIsPlaying(false);
            setCurrentTime(0);
        }

        audio.addEventListener("play", syncPlaying);
        audio.addEventListener("pause", syncPlaying);
        audio.addEventListener("timeupdate", syncTime);
        audio.addEventListener("loadedmetadata", syncLoaded);
        audio.addEventListener("ended", syncEnded);

        return () =>
        {
            audio.removeEventListener("play", syncPlaying);
            audio.removeEventListener("pause", syncPlaying);
            audio.removeEventListener("timeupdate", syncTime);
            audio.removeEventListener("loadedmetadata", syncLoaded);
            audio.removeEventListener("ended", syncEnded);
        };

    }, [hasAudio, url]);

    function togglePlay()
    {
        const audio = audioRef.current;
        if(!audio || !hasAudio)
        {
            return;
        }

        if(audio.paused)
        {
            audio.play().catch(() => {});
            return;
        }

        audio.pause();
    }

    function handleVolumeChange(event)
    {
        const nextVolume = Number(event.target.value);
        setVolume(Number.isFinite(nextVolume) ? Math.min(100, Math.max(0, nextVolume)) : 100);
    }

    function toggleVolumeOpen()
    {
        setVolumeOpen((prev) => !prev);
    }

    const volumeLabel = volume === 0 ? "Silencio" : `${volume}%`;

    function formatTime(seconds)
    {
        if(!Number.isFinite(seconds) || seconds < 0)
        {
            return "00:00";
        }

        const total = Math.floor(seconds);
        const mins = Math.floor(total / 60);
        const secs = String(total % 60).padStart(2, "0");

        return `${String(mins).padStart(2, "0")}:${secs}`;
    }

    return (
        <div className={`gritoPkm-contenedor ${sizeClass}`}>
            
            {/* Titulo */}
            <div className={`gritoPkm-titleRow ${titleClass}`}>
                <span className={`gritoPkm-label ${labelClass}`} aria-label="Grito Pokémon">
                    <span className="gritoPkm-label-word">Grito</span>:
                </span>
            </div>

            {/* Controlador de Grito Pokémon */}
            {hasAudio ? (
                <>
                    <audio ref={audioRef} className="gritoPkm-audioHidden" preload="none" src={url}>
                        Tu navegador no soporta el reproductor de audio.
                    </audio>

                    <div className="gritoPkm-playerWrap">

                        {/* Boton Play/Pausa + Barra Progreso */}
                        <div className="gritoPkm-playerShell">

                            {/* Boton Play/Pausa */}
                            <button
                                type="button"
                                className="gritoPkm-ContainerBtn"
                                onClick={togglePlay}
                                aria-label={isPlaying ? "Pausar grito Pokémon" : "Reproducir grito Pokémon"}
                                title={isPlaying ? "Pausar" : "Reproducir"}
                            >
                                {isPlaying ? <IoMdPause className="gritoPkm-PauseBtn" /> : <IoMdPlay className="gritoPkm-PlayBtn" />}
                            </button>

                            {/* Barra Progreso */}
                            <div className="gritoPkm-meta">
                                <div
                                    className="gritoPkm-progress"
                                    role="progressbar"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={Math.round(progress)}
                                    aria-label="Progreso del grito Pokémon"
                                >
                                    <div
                                        className="gritoPkm-progressFill"
                                        style={{ width: `${progress}%` }}
                                    />
                                <div
                                    className="gritoPkm-progressDot"
                                    style={{ left: progressDotLeft }}
                                    aria-hidden="true"
                                />
                                </div>
                            </div>

                        </div>

                        {/* Control Volumen + Tiempo actual/Total */}
                        <div className="gritoPkm-timeRow">

                            {/* Control Volumen */}
                            <div className="gritoPkm-volumeWrap" ref={volumeWrapRef}>
                                
                                {/* Boton Volumen */}
                                <button
                                    type="button"
                                    className="gritoPkm-volumeBtn"
                                    onClick={toggleVolumeOpen}
                                    aria-label={`Volumen ${volumeLabel}`}
                                    title={`Volumen ${volumeLabel}`}
                                    aria-expanded={volumeOpen}
                                    aria-haspopup="true"
                                >
                                    <IoMdVolumeHigh className="gritoPkm-volumeIcon" />
                                </button>

                                {/* Barra Volumen PopUp */}
                                <div className={"gritoPkm-volumePopup" + (volumeOpen ? " open" : "")} aria-hidden={!volumeOpen}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="gritoPkm-volumeSlider"
                                        style={{ "--vol-progress": `${volume}%` }}
                                        aria-label="Control de volumen"
                                    />
                                </div>

                            </div>

                            {/* Tiempo actual/Total */}
                            <div className="gritoPkm-timeValues">
                                <span className="gritoPkm-time">{formatTime(currentTime)}</span>
                                <span className="gritoPkm-timeDivider">/</span>
                                <span className="gritoPkm-time">{formatTime(duration)}</span>
                            </div>

                        </div>

                    </div>

                </>
            ) : (
                <div className="gritoPkm-empty">
                    No hay grito Pokémon disponible
                </div>
            )}

        </div>
    );

}