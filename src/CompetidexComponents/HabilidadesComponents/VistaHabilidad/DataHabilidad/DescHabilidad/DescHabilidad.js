//** src\CompetidexComponents\HabilidadesComponents\VistaHabilidad\DataHabilidad\DescHabilidad\DescHabilidad.js

import React, { useEffect, useMemo, useState } from "react";
import "./DescHabilidad.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
}

function getUnavailableText(langLabel)
{
  return "No se encuentra disponible la descripción en " + langLabel + " en este momento";
}

export default function DescHabilidad({ descHab, descHabEN, size = "normal" })
{
  const descES = useMemo(() => toDash(descHab), [descHab]);
  const descEN = useMemo(() => toDash(descHabEN), [descHabEN]);
  const defaultTab = (descES === "-" && descEN !== "-") ? "en" : "es";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(function()
  {
    setActiveTab(defaultTab);

  }, [defaultTab]);

  const sizeClass = "deschab-container-" + size;
  const tabs = useMemo(function()
  {
    return [
      { key: "es", label: "Español", desc: descES },
      { key: "en", label: "Inglés", desc: descEN }
    ];

  }, [descES, descEN]);

  const activeTabData = tabs.find(function(tab)
  {
    return tab.key === activeTab;
  }) || tabs[0];

  const activeDesc = activeTabData.desc;
  const isUnavailable = activeDesc === "-";
  const displayDesc = isUnavailable
    ? getUnavailableText(activeTabData.label)
    : activeDesc;

  return (
    <div className={`deschab-container ${sizeClass}`}>
      <div className="deschab-tabs-wrapper">
        <div className="deschab-tabs">
          {tabs.map(function(tab)
          {
            return (
              <button
                key={tab.key}
                type="button"
                className={"deschab-tab" + (activeTab === tab.key ? " active" : "")}
                title={`Ver descripción en ${tab.label}`}
                onClick={function()
                {
                  setActiveTab(tab.key);
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={"deschab-text" + (isUnavailable ? " deschab-text-unavailable" : " deschab-text-disponible")}>
          {displayDesc}
        </div>
      </div>
    </div>
  );
  
}