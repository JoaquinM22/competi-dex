//** src\CompetidexComponents\AreaLocalizacionComponents\AreaLocalizacion\AreaLocalizacion.js

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { preloadCachedImage } from "../../../utils/competidexImgCache";
import "./AreaLocalizacion.css";

export default function AreaLocalizacion({ areasLocalizacion = [] })
{
    const groupedGenerations = useMemo(() =>
    {
        return Array.isArray(areasLocalizacion) ? areasLocalizacion : [];

    }, [areasLocalizacion]);

    const [activeGeneration, setActiveGeneration] = useState("");
    const [activeVersionKey, setActiveVersionKey] = useState(null);
    const [sortConfig, setSortConfig] = useState([]);
    const [findText, setFindText] = useState("");
    const [findPos, setFindPos] = useState(0);

    const railRef = useRef(null);
    const tableScrollRef = useRef(null);
    const findInputRef = useRef(null);
    const rowRefs = useRef({});
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const firstAvailableGeneration = useMemo(() =>
    {
        const found = groupedGenerations.find((gen) => gen?.hasData);
        return found?.label || groupedGenerations[0]?.label || "";

    }, [groupedGenerations]);

    const areaLocalizacionSignature = useMemo(() =>
    {
        return groupedGenerations
            .map((gen) =>
            {
                const versionSignature = Array.isArray(gen?.versions)
                    ? gen.versions.map((version) => String(version?.versionKey || version?.versionLabel || "")).join(",")
                    : "";

                return [
                    String(gen?.generationKey || gen?.label || ""),
                    String(gen?.label || ""),
                    String(gen?.order ?? ""),
                    String(gen?.hasData ? "1" : "0"),
                    versionSignature
                ].join("|");
            })
            .join("||");

    }, [groupedGenerations]);

    useEffect(() =>
    {
        for(const gen of groupedGenerations)
        {
            if(gen?.icon) preloadCachedImage(gen.icon);
        }

    }, [groupedGenerations]);

    useEffect(() =>
    {
        if(!groupedGenerations.length) return;

        setActiveGeneration(firstAvailableGeneration);
        setActiveVersionKey(null);
        setSortConfig([]);
        setFindText("");
        setFindPos(0);
        rowRefs.current = {};

        const el = tableScrollRef.current;
        if(el) el.scrollTop = 0;

    }, [areaLocalizacionSignature, firstAvailableGeneration]);

    const activeGenerationData = useMemo(() =>
    {
        return (
            groupedGenerations.find((gen) => gen.label === activeGeneration) ||
            groupedGenerations[0] ||
            null
        );

    }, [groupedGenerations, activeGeneration]);

    useEffect(() =>
    {
        const firstVersionKey = activeGenerationData?.versions?.[0]?.versionKey || null;
        const hasCurrent = !!activeGenerationData?.versions?.some((v) => v.versionKey === activeVersionKey);

        if(firstVersionKey && (!activeVersionKey || !hasCurrent))
        {
            setActiveVersionKey(firstVersionKey);
            setSortConfig([]);
            setFindText("");
            setFindPos(0);
            rowRefs.current = {};
        }

    }, [activeGenerationData, activeVersionKey]);

    useEffect(() =>
    {
        const el = railRef.current;
        if(!el) return;

        const activeBtn = el.querySelector(".al-generationTab.active");
        if(activeBtn && activeBtn.scrollIntoView)
        {
            activeBtn.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
        }

    }, [activeGeneration, groupedGenerations.length]);

    const activeVersionData = useMemo(() =>
    {
        if(!activeGenerationData?.versions?.length) return null;

        return (
            activeGenerationData.versions.find((version) => version.versionKey === activeVersionKey) ||
            activeGenerationData.versions[0] ||
            null
        );

    }, [activeGenerationData, activeVersionKey]);

    const resetLocationFilters = useCallback(() =>
    {
        setFindText("");
        setFindPos(0);
        setSortConfig([]);
        if(findInputRef.current)
        {
            findInputRef.current.value = "";
        }

    }, []);

    const locationRows = useMemo(() =>
    {
        const bucket = Array.isArray(activeVersionData?.locations) ? activeVersionData.locations : [];

        let sorted = bucket.slice();

        if(sortConfig.length > 0)
        {
            sorted.sort((a, b) =>
            {
                for(let i = 0; i < sortConfig.length; i += 1)
                {
                    const rule = sortConfig[i];
                    let valA = a?.[rule.key];
                    let valB = b?.[rule.key];

                    if(rule.key === "chanceValue")
                    {
                        valA = Number.parseInt(String(a?.chanceLabel || "").replace("%", ""), 10);
                        valB = Number.parseInt(String(b?.chanceLabel || "").replace("%", ""), 10);
                        if(Number.isNaN(valA)) valA = null;
                        if(Number.isNaN(valB)) valB = null;
                    }

                    if(valA === null || valA === undefined) return 1;
                    if(valB === null || valB === undefined) return -1;

                    if(typeof valA === "number" && typeof valB === "number")
                    {
                        if(valA !== valB)
                        {
                            return rule.direction === "asc" ? valA - valB : valB - valA;
                        }

                        continue;
                    }

                    valA = String(valA);
                    valB = String(valB);

                    if(valA !== valB)
                    {
                        return rule.direction === "asc"
                            ? valA.localeCompare(valB, "es")
                            : valB.localeCompare(valA, "es");
                    }
                }

                return 0;
            });

        }else
        {
            sorted.sort((a, b) =>
                String(a?.locationLabel || "").localeCompare(String(b?.locationLabel || ""), "es")
            );
        }

        const query = String(findText || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        if(!query) return sorted;

        return sorted.filter((row) =>
            String(row?.locationLabel || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(query)
            );

    }, [activeVersionData, sortConfig, findText]);

    const handleSort = useCallback((key, shiftPressed) =>
    {
        setSortConfig((prev) =>
        {
            const existing = prev.find((rule) => rule.key === key);

            if(existing)
            {
                const nextDirection = existing.direction === "asc" ? "desc" : "asc";
                if(shiftPressed)
                {
                    return prev.map((rule) =>
                        rule.key === key ? { ...rule, direction: nextDirection } : rule
                    );
                }

                return [{ key, direction: nextDirection }];
            }

            if(shiftPressed)
            {
                return prev.concat([{ key, direction: "asc" }]);
            }

            return [{ key, direction: "asc" }];
        });

    }, []);

    const renderSortIcon = useCallback((key) =>
    {
        const s = sortConfig.find((rule) => rule.key === key);
        if(!s) return <span className="al-sortIcon"><FaLocationArrow className="competidexArrowIcon" aria-hidden="true" /></span>;

        return (
            <span className={`al-sortIcon ${s.direction === "asc" ? "up" : "down"}`}>
                <FaLocationArrow className="competidexArrowIcon" aria-hidden="true" />
            </span>
        );

    }, [sortConfig]);

    const findMatches = useMemo(() =>
    {
        const q = String(findText || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        if(!q) return [];

        const hits = [];
        for(let i = 0; i < locationRows.length; i += 1)
        {
            const row = locationRows[i];
            const name = String(row?.locationLabel || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

            if(name.includes(q))
            {
                hits.push(String(i));
            }
        }

        return hits;

    }, [findText, locationRows]);

    const findMatchSet = useMemo(() =>
    {
        const s = {};
        for(let i = 0; i < findMatches.length; i += 1) s[findMatches[i]] = true;
        return s;

    }, [findMatches]);

    useEffect(() =>
    {
        setFindPos(0);

    }, [findText, findMatches.length]);

    useEffect(() =>
    {
        setFindPos(0);
        rowRefs.current = {};
        const el = tableScrollRef.current;
        if(el) el.scrollTop = 0;

    }, [activeGeneration, activeVersionKey]);

    const goFind = useCallback((delta) =>
    {
        if(!findMatches.length) return;

        setFindPos((prev) =>
        {
            let next = prev + delta;
            if(next < 0) next = findMatches.length - 1;
            if(next >= findMatches.length) next = 0;

            return next;
        });

    }, [findMatches.length]);

    const clearFind = useCallback(() =>
    {
        setFindText("");
        setFindPos(0);
        if(findInputRef.current) findInputRef.current.focus();

    }, []);

    useEffect(() =>
    {
        if(!findMatches.length) return;

        const activeKey = findMatches[Math.min(findPos, findMatches.length - 1)];
        const el = rowRefs.current[activeKey];
        if(!el || !el.scrollIntoView) return;

        el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });

    }, [findPos, findMatches]);

    const activeFindKey = findMatches.length && findMatches[Math.min(findPos, findMatches.length - 1)]
        ? findMatches[Math.min(findPos, findMatches.length - 1)]
        : null;

    const updateArrows = useCallback(() =>
    {
        const el = railRef.current;
        if(!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanLeft(scrollLeft > 0);
        setCanRight(scrollLeft + clientWidth < scrollWidth - 1);

    }, []);

    const scrollByDir = useCallback((dir) =>
    {
        const el = railRef.current;
        if(!el) return;

        const delta = Math.round(el.clientWidth * 0.75) * (dir === "left" ? -1 : 1);
        el.scrollBy({ left: delta, behavior: "smooth" });

    }, []);

    useEffect(() =>
    {
        const el = railRef.current;
        if(!el) return;

        updateArrows();

        const onScroll = () => updateArrows();
        el.addEventListener("scroll", onScroll, { passive: true });

        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateArrows) : null;
        if(ro) ro.observe(el);

        window.addEventListener("resize", updateArrows);

        return () =>
        {
            el.removeEventListener("scroll", onScroll);
            if(ro) ro.disconnect();
            window.removeEventListener("resize", updateArrows);
        };

    }, [updateArrows]);

    useEffect(() =>
    {
        const el = railRef.current;
        if(!el)
        {
            setCanLeft(false);
            setCanRight(false);
            return;
        }

        setCanLeft(false);
        setCanRight(false);

        const rafId = window.requestAnimationFrame
            ? window.requestAnimationFrame(() => updateArrows())
            : window.setTimeout(() => updateArrows(), 0);

        return () =>
        {
            if(window.cancelAnimationFrame && typeof rafId === "number")
            {
                window.cancelAnimationFrame(rafId);
            }
            else
            {
                window.clearTimeout(rafId);
            }
        };

    }, [areaLocalizacionSignature, activeGeneration, activeGenerationData?.versions?.length, updateArrows]);

    useEffect(() =>
    {
        const el = railRef.current;
        if(!el) return;

        const activeBtn = el.querySelector(".al-generationTab.active");
        if(activeBtn && activeBtn.scrollIntoView)
        {
            activeBtn.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
        }

    }, [activeGeneration, groupedGenerations.length]);

    if(!groupedGenerations.length)
    {
        return (
            <div className="al-wrapper">
                <div className="al-emptyState">
                    Este Pokémon no tiene áreas de localización registradas.
                </div>
            </div>
        );
    }

    return (
        <div className="al-wrapper">
            <div className="al-card">
                
                {/* Carrusel de Generaciones */}
                <div className="al-tabsShell" role="tablist" aria-label="Generaciones">
                    <button
                        type="button"
                        className={`al-tabArrow left ${canLeft ? "" : "disabled"}`}
                        onClick={() => canLeft && scrollByDir("left")}
                        disabled={!canLeft}
                        aria-label="Generación anterior"
                    >
                        ‹
                    </button>

                    <div className="al-tabsRail" ref={railRef}>
                        {groupedGenerations.map((gen) =>
                        {
                            const isActive = gen.label === activeGeneration;

                            return (
                                <button
                                    key={gen.generationKey || gen.label}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    title={gen.label}
                                    className={`al-generationTab ${isActive ? "active" : ""} ${gen.hasData ? "" : "noData"}`}
                                    onClick={() =>
                                    {
                                        setActiveGeneration(gen.label);
                                        setActiveVersionKey(null);
                                        resetLocationFilters();
                                    }}
                                >
                                    <span className="al-generationContent">
                                        {
                                            gen.icon ?
                                            (
                                                <img src={gen.icon} alt="" aria-hidden="true" className="al-generationIcon" />
                                            ) :
                                            (
                                                <span className="al-generationFallback">GEN</span>
                                            )
                                        }
                                        <span className="al-generationLabel">{gen.label}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        className={`al-tabArrow right ${canRight ? "" : "disabled"}`}
                        onClick={() => canRight && scrollByDir("right")}
                        disabled={!canRight}
                        aria-label="Generación siguiente"
                    >
                        ›
                    </button>
                </div>

                {/* Tabla + Buscador */}
                <div className="al-gamesPanel">
                    <div className="al-gamesList" role="list" aria-label="Juegos disponibles">
                        {
                            activeGenerationData?.versions?.length ?
                            (
                                activeGenerationData.versions.map((versionRow) =>
                                {
                                    const isActive = versionRow.versionKey === activeVersionData?.versionKey;

                                    return (
                                        <button
                                            key={versionRow.versionKey}
                                            type="button"
                                            className={`al-gameButton ${isActive ? "active" : ""}`}
                                            onClick={() =>
                                            {
                                                setActiveVersionKey(versionRow.versionKey);
                                                resetLocationFilters();
                                            }}
                                        >
                                            {versionRow.versionLabel}
                                        </button>
                                    );
                                })
                            ) :
                            (
                                <div className="al-emptyState al-gamesEmpty">
                                    No hay encuentros disponibles para esta generación.
                                </div>
                            )
                        }
                    </div>

                    {activeVersionData && (
                        <>
                            {sortConfig.length > 0 && (
                                <div className="al-ordenInfo">
                                    <div>
                                        Orden actual:{" "}
                                        {sortConfig.map((s, i) => (
                                            <span key={s.key} className="al-ordenItem">
                                                {s.key === "locationLabel" ? "localización" : "probabilidad"} {s.direction === "asc" ? "↑" : "↓"}
                                                {i < sortConfig.length - 1 ? ", " : ""}
                                            </span>
                                        ))}
                                        <span className="al-ordenHint"> Mantenga Shift + Click para combinar ordenamientos.</span>
                                    </div>

                                    <div className="al-ordenActions">
                                        <button
                                            type="button"
                                            className="al-clearSortBtn"
                                            onClick={resetLocationFilters}
                                        >
                                            Limpiar filtros
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="al-findBar">
                                <div className="al-findLeft">
                                    <span className="al-findLabel">Buscar localización</span>

                                    <input
                                        inputMode="text"
                                        enterKeyHint="search"
                                        autoComplete="new-password"
                                        autoCorrect="off"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        name="competidex-buscar-localizacion"
                                        ref={findInputRef}
                                        className="al-findInput"
                                        value={findText}
                                        onChange={(e) => setFindText(e.target.value)}
                                        placeholder="Escribí un nombre... (Enter = siguiente)"
                                        onKeyDown={(e) =>
                                        {
                                            if(e.key === "Enter")
                                            {
                                                e.preventDefault();
                                                goFind(e.shiftKey ? -1 : 1);
                                            }

                                            if(e.key === "Escape")
                                            {
                                                e.preventDefault();
                                                clearFind();
                                            }
                                        }}
                                    />
                                </div>

                                <div className="al-findRight">
                                    <span className={`al-findCount ${findMatches.length ? "has" : ""}`}>
                                        {findMatches.length ? `${findPos + 1}/${findMatches.length}` : "0/0"}
                                    </span>

                                    <button type="button" className="al-findBtn" onClick={() => goFind(-1)} disabled={!findMatches.length}>
                                        ↑
                                    </button>

                                    <button type="button" className="al-findBtn" onClick={() => goFind(1)} disabled={!findMatches.length}>
                                        ↓
                                    </button>

                                    <button type="button" className="al-findBtn clear" onClick={clearFind} disabled={!findText}>
                                        Limpiar
                                    </button>
                                </div>
                            </div>

                            <div className="al-tableScroll" ref={tableScrollRef}>
                                <table className="al-table">
                                    <thead>
                                        <tr>
                                            <th onClick={(e) => handleSort("locationLabel", e.shiftKey)}>
                                                Localización {renderSortIcon("locationLabel")}
                                            </th>
                                            <th onClick={(e) => handleSort("chanceValue", e.shiftKey)}>
                                                Probabilidad de Encuentro {renderSortIcon("chanceValue")}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            locationRows.length ?
                                            (
                                                locationRows.map((loc, idx) =>
                                                {
                                                    const rowKey = String(idx);
                                                    const isHit = !!findMatchSet[rowKey];
                                                    const isActive = activeFindKey ? rowKey === activeFindKey : false;
                                                    const findClass = (isHit ? " al-findHit" : "") + (isActive ? " al-findActive" : "");

                                                    return (
                                                        <tr
                                                            key={`${loc.locationLabel}-${idx}`}
                                                            className={findClass}
                                                            ref={(el) =>
                                                            {
                                                                if(el) rowRefs.current[rowKey] = el;
                                                                else delete rowRefs.current[rowKey];
                                                            }}
                                                        >
                                                            <td className="al-locationNameCell">
                                                                {loc.locationLabel}
                                                            </td>
                                                            <td className="al-chanceCell">
                                                                {loc.chanceLabel}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) :
                                            (
                                                <tr>
                                                    <td colSpan={2} className="al-emptyRow">
                                                        No hay localizaciones para este juego.
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

}