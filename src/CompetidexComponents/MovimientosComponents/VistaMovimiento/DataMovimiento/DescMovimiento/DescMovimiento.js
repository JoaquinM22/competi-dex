//** src\CompetidexComponents\MovimientosComponents\VistaMovimiento\DataMovimiento\DescMovimiento\DescMovimiento.js

import React, { useEffect, useMemo, useState } from "react";
import "./DescMovimiento.css";

function toDash(v)
{
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s === "" ? "-" : s;
}

function getUnavailableText(langLabel)
{
  if(langLabel === "Efecto (EN)")
  {
    return "No se encuentra disponible el efecto del Movimiento en este momento";
  }

  return "No se encuentra disponible la descripción en " + langLabel + " en este momento";
}

export default function DescMovimiento({ descMov, descMovEN, efectoMovEN, size = "normal" })
{
  const descES = useMemo(() => toDash(descMov), [descMov]);
  const descEN = useMemo(() => toDash(descMovEN), [descMovEN]);
  const efectoEN = useMemo(() => toDash(efectoMovEN), [efectoMovEN]);
  const defaultTab = (descES === "-" && descEN !== "-") ? "en" : "es";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(function()
  {
    setActiveTab(defaultTab);

  }, [defaultTab]);
  const sizeClass = `descmov-container-${size}`;
  const tabs = useMemo(function()
  {
    return [
      { key: "es", label: "Español", desc: descES },
      { key: "en", label: "Inglés", desc: descEN },
      { key: "effect-en", label: "Efecto (EN)", desc: efectoEN }
    ];

  }, [descES, descEN, efectoEN]);

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
    <div className={`descmov-container ${sizeClass}`}>
      <div className="descmov-tabs-wrapper">
        <div className="descmov-tabs">
          {tabs.map(function(tab)
          {
            return (
              <button
                key={tab.key}
                type="button"
                className={"descmov-tab" + (activeTab === tab.key ? " active" : "")}
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

        <div className={"descmov-text" + (isUnavailable ? " descmov-text-unavailable" : " descmov-text-disponible")}>
          {displayDesc}
        </div>
      </div>
    </div>
  );

}