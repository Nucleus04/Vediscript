export const setIsRemovingAudio = (value) => {
    return {
        type: "SET_IS_REMOVING_AUDIO",
        payload: value,
    }
}
export const setIsThereCurrentOperation = (value) => {
    return {
        type: "SET_IS_THERE_CURRENT_OPERATION",
        payload: value,
    }
}
export const setRemoveDetails = (value) => {
    return {
        type: "SET_REMOVE_DETAILS",
        payload: value,
    }
}
export const setIsReplacingAudio = (value) => {
    return {
        type: "SET_IS_REPLACING_AUDIO",
        payload: value,
    }
}
export const setShowRecordComponent = (value) => {
    return {
        type: "SET_SHOW_RECORD_COMPONENT",
        payload: value,
    }
}
export const setIsHighlighting = (value) => {
    return {
        type: "SET_IS_HIGHLIGHTING",
        payload: value,
    }
}
export const setIsInserting = (value) => {
    return {
        type: "SET_IS_INSERTING",
        payload: value,
    }
}
export const setIsReplacingViaLocal = (value) => {
    return {
        type: "SET_IS_REPLACING_VIA_LOCAL",
        payload: value,
    }
}
export const resetOperation = () => {
    return {
        type: "RESET_STATE_OPERATION",
    }
}
