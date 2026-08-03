//** src\services\ToastrService\ToastrService.js

const DEFAULT_TOAST_STATE = {
    id: "",
    open: false,
    title: "",
    text: "",
    variant: "default",
    duration: 1500,
    barColor: "",
    className: ""
};

const MAX_VISIBLE_TOASTS = 2;

let nextToastId = 1;
let currentToastState = {
    items: []
};

const listeners = new Set();

function notify()
{
    const nextState = {
        items: Array.isArray(currentToastState.items)
            ? currentToastState.items.map((item) => ({ ...DEFAULT_TOAST_STATE, ...item }))
            : []
    };

    currentToastState = nextState;

    listeners.forEach((listener) =>
    {
        try
        {
            listener(getToastrState());
        }catch(error)
        {
            console.error("Error notificando toastr listener", error);
        }
    });
}

function normalizeToast(payload = {})
{
    const id = `toastr_${Date.now()}_${nextToastId++}`;

    return {
        ...DEFAULT_TOAST_STATE,
        ...payload,
        id,
        open: true,
        title: String(payload.title || "").trim(),
        text: String(payload.text || "").trim(),
        variant: String(payload.variant || "default").trim().toLowerCase() || "default",
        duration: payload.duration
    };
}

function setItems(items)
{
    currentToastState = {
        items: Array.isArray(items) ? items.slice(-MAX_VISIBLE_TOASTS) : []
    };

    notify();
}

export function getToastrState()
{
    return {
        items: Array.isArray(currentToastState.items)
            ? currentToastState.items.map((item) => ({ ...DEFAULT_TOAST_STATE, ...item }))
            : []
    };
}

export function subscribeToastr(listener)
{
    if(typeof listener !== "function")
    {
        return () => {};
    }

    listeners.add(listener);
    listener(getToastrState());

    return function unsubscribe()
    {
        listeners.delete(listener);
    };
}

export function showToastr({
    title = "",
    text = "",
    variant = "default",
    duration = 1500,
    barColor = "",
    className = ""
} = {})
{
    const toast = normalizeToast({
        title,
        text,
        variant,
        duration,
        barColor,
        className
    });

    const nextItems = Array.isArray(currentToastState.items)
        ? currentToastState.items.concat(toast)
        : [toast];

    setItems(nextItems);

    return toast.id;
}

export function hideToastr(id = null)
{
    if(id)
    {
        const nextItems = (Array.isArray(currentToastState.items) ? currentToastState.items : [])
            .filter((item) => item && item.id !== id);

        setItems(nextItems);

        return;
    }

    clearToastr();
}

export function clearToastr()
{
    setItems([]);
}