import { useEffect } from "react";
function useHistorySaver (history) {
    useEffect(() => {
        let historyData = {
            state: history.currentState,
            index: history.currentHistoryIndex,
            numberOfChanges: history.history.length,
        }
        historyData = JSON.stringify(historyData);
        localStorage.setItem("history", historyData);
    }, [history.currentState])
}

export default useHistorySaver;