
const initialState = {
    isThereError: {
        state: false,
        message: "",
    },
    isLoading: false,
    loadingStatus: "",
    isThereSuccessEvent: {
        state: false,
        message: "",
    },
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
        default:
            return state;
    }
};