export const setIsThereError = (value) => {
    return{
        type: 'SET_IS_THERE_ERROR',
        payload: value,
    }
}
export const setLoading = (value) => {
    return{
        type: 'SET_IS_LOADING',
        payload: value,
    }
}
export const setLoadingStatus = (value) => {
    return {
        type: "SET_LOADING_STATUS",
        payload: value,
    }
}
export const setSuccessEvent = (value) => {
    return {
        type: "SET_SUCCESS_EVENT_STATE",
        payload: value,
    }
}
export const setIsThereUploadedVideo = (value) => {
    return {
        type: "SET_IS_THERE_UPLOADED_VIDEO",
        payload: value,
    }
}
export const setCurrentVideoTimestamp = (value) => {
    return {
        type: "SET_CURRENT_VIDEO_TIMESTAMP",
        payload: value,
    }
}
export const setPlaybackTime = (value) => {
    return {
        type: "SET_PLAYBACK_TIME",
        payload: value,
    }
}
export const setIsNavigatingTroughScript = (value) => {
    return {
        type: "SET_IS_NAVIGATING_THROUGH_SCRIPT",
        payload: value,
    }
}
export const setIsVerifying = (value) => {
    return {
        type: "SET_IS_VERIFYING",
        payload: value,
    }
}
export const setVerified = (value) => {
    return {
        type: "SET_VERIFIED",
        payload: value,
    }
}
export const resetEditingGlobalState = () => {
    return {
        type: "RESET_STATE",
    }
}

