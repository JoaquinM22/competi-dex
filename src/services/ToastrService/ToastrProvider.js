//** src\services\ToastrService\ToastrProvider.js

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getToastrState, hideToastr, subscribeToastr } from "./ToastrService";
import Toastr from "./Toastr/Toastr";

export default function ToastrProvider({ children })
{
    const [toastState, setToastState] = useState(getToastrState());

    useEffect(() =>
    {
        const unsubscribe = subscribeToastr(setToastState);
        return unsubscribe;
    }, []);

    function handleClose(id)
    {
        hideToastr(id);
    }

    const toasts = Array.isArray(toastState.items) ? toastState.items : [];

    return (
        <>
            {children}
            {typeof document !== "undefined" && createPortal(
                <div className="toastr-stack" aria-live="polite" aria-relevant="additions removals">
                    {toasts.map((toast, index) => (
                        <Toastr
                            key={toast.id || `${toast.title}-${index}`}
                            open={toast.open}
                            title={toast.title}
                            text={toast.text}
                            variant={toast.variant}
                            duration={toast.duration}
                            barColor={toast.barColor}
                            className={toast.className}
                            stackIndex={index}
                            onClose={() => handleClose(toast.id)}
                        />
                    ))}
                </div>,
                document.body
            )}
        </>
    );

}