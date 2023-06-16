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