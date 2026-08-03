//** src\CompetidexComponents\ScrollToTopButton\ScrollToTopButton.js

import React, { useEffect, useState } from "react";
import { BsArrowUpSquareFill } from "react-icons/bs";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import "./ScrollToTopButton.css";

export default function ScrollToTopButton()
{
    const [visible, setVisible] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);

    useEffect(function()
    {
        function onScroll()
        {
            const y = window.pageYOffset || document.documentElement.scrollTop || 0;
            const show = y > 350;
            setVisible(show);

            // si deja de ser visible, lo cerramos
            if (!show) setOpenMobile(false);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return function() {
            window.removeEventListener("scroll", onScroll);
        };

    }, []);

    function goTop()
    {
        try
        {
            window.scrollTo({ top: 0, behavior: "smooth" });

        }catch(e)
        {
            window.scrollTo(0, 0);
        }
    }

    return (
        <div className={"scrollTopWrap" + (visible ? " show" : "")}>
        
            {/* Handle (En celulares) */}
            <button
                type="button"
                className="scrollTopHandle"
                onClick={function () { setOpenMobile(!openMobile); }}
                aria-label={openMobile ? "Ocultar botón volver arriba" : "Mostrar botón volver arriba"}
                title={openMobile ? "Ocultar" : "Mostrar"}
            >
                {openMobile ? (
                    <BsChevronRight className="scrollTopHandleIcon" aria-hidden="true" />
                ) : (
                    <BsChevronLeft className="scrollTopHandleIcon" aria-hidden="true" />
                )}
            </button>

            {/* Botón de subir */}
            <button
                type="button"
                className={"scrollTopBtn" + (openMobile ? " mobileOpen" : "")}
                onClick={goTop}
                aria-label="Volver arriba"
                title="Volver arriba"
            >
                <BsArrowUpSquareFill className="scrollTopBtnIcon" aria-hidden="true" />
            </button>

        </div>
    );

}