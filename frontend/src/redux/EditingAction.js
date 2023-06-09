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