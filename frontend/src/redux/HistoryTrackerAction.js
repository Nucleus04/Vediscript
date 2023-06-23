export const setAddHistory_RemoveAudio = (value) => {
    return {
        type: "ADD_HISTORY_REMOVE_AUDIO",
        payload: value,
    }
}
export const undoChanges = () => {
    return {
        type: "UNDO",
    }
}
export const redoChanges = () => {
    return {
        type: "REDO",
    }
}
export const resetHistoryIndex = () => {
    return {
        type: "RESET_HISTORY_INDEX"
    }
}

export const addInitialRemoveAudio = (value) => {
    return {
        type: "ADD_INITIAL_REMOVE_AUDIO",
        payload: value,
    }
}