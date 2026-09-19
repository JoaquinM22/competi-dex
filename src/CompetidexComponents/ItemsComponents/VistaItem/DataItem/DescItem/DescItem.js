//** src\CompetidexComponents\ItemsComponents\VistaItem\DataItem\DescItem\DescItem.js

import React, { useEffect, useMemo, useState } from "react";
import "./DescItem.css";

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
    return "No se encuentra disponible el efecto del Objeto en este momento";
  }

  return "No se encuentra disponible la descripción en " + langLabel + " en este momento";
}

export default function DescItem({ descItem, descItemEN, efectoItemEN, size = "normal" })
{
  const descES = useMemo(() => toDash(descItem), [descItem]);
  const descEN = useMemo(() => toDash(descItemEN), [descItemEN]);
  const efectoEN = useMemo(() => toDash(efectoItemEN), [efectoItemEN]);
  const defaultTab = (descES === "-" && descEN !== "-") ? "en" : "es";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(function()
  {
    setActiveTab(defaultTab);

  }, [defaultTab]);
  const sizeClass = `descitem-container-${size}`;
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
    <div className={`descitem-container ${sizeClass}`}>
      <div className="descitem-tabs-wrapper">
        <div className="descitem-tabs">
          {tabs.map(function(tab)
          {
            return (
              <button
                key={tab.key}
                type="button"
                className={"descitem-tab" + (activeTab === tab.key ? " active" : "")}
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

        <div className={"descitem-text" + (isUnavailable ? " descitem-text-unavailable" : " descitem-text-disponible")}>
          {displayDesc}
        </div>
      </div>
    </div>
  );

}