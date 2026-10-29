import { createContext, useContext, useState } from "react";

const ToolContext = createContext();

export function ToolProvider({ children }) {
    const [savedIds, setSavedIds] = useState([]);
    const [compareIds, setCompareIds] = useState([]);

    const MAX_COMPARE = 3;

    function toggleSave(id) {
    setSavedIds((previous) =>
        previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
    }

    function toggleCompare(id) {
    setCompareIds((previous) => {
        if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
        }

        if (previous.length < MAX_COMPARE) {
        return [...previous, id];
        }

        return previous;
    });
    }

    function removeFromCompare(id) {
    setCompareIds((previous) =>
        previous.filter((item) => item !== id)
    );
    }

    return (
    <ToolContext.Provider
        value={{
        savedIds,
        compareIds,
        toggleSave,
        toggleCompare,
        removeFromCompare,
        MAX_COMPARE,
        }}
    >
        {children}
    </ToolContext.Provider>
    );
}

export function useTools() {
    const context = useContext(ToolContext);

    if (!context) {
    throw new Error("useTools must be used inside ToolProvider");
    }

    return context;
}