
const initialState = {
    isThereError: {
        state: false,
        status: "",
        message: "",
    },
    isLoading: false,
    loadingStatus: "",
    isThereSuccessEvent: {
        state: false,
        message: "",
    },
    isThereUploadedVideo: "false",
}

export const EditingPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_IS_THERE_ERROR':
            return {
                ...state,
                isThereError: action.payload,
            }
        case 'SET_IS_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            }
        case "SET_LOADING_STATUS":
            return {
                ...state,
                loadingStatus: action.payload,
            }
        case "SET_SUCCESS_EVENT_STATE":
            return {
                ...state,
                isThereSuccessEvent: action.payload,
            }
        case "SET_IS_THERE_UPLOADED_VIDEO":
            return {
                ...state,
                isThereUploadedVideo: action.payload,
            }
        default:
            return state;
    }
};