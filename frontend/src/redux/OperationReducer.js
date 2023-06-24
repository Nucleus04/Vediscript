
const initialState = {
    isRemovingAudio: false,
    isReplacingAudio: false,
    isShowRecordComponent: false,
    isThereCurrentOperation: {
        state: false,
        operation: "",
    },
    initialRemovingData:{
        start:"",
        end:"",
    }
}

export const OperationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_IS_REMOVING_AUDIO": 
            return {
                ...state,
                isRemovingAudio: action.payload,
            }
        case "SET_IS_THERE_CURRENT_OPERATION":
            return {
                ...state,
                isThereCurrentOperation: action.payload,
            }
        case "SET_REMOVE_DETAILS":
            return {
                ...state,
                initialRemovingData: action.payload,
            }
        case "SET_IS_REPLACING_AUDIO":
            return {
                ...state,
                isReplacingAudio: action.payload,
            }
        case "SET_SHOW_RECORD_COMPONENT":
            return {
                ...state,
                isShowRecordComponent: action.payload,
            }
        case "RESET_STATE_OPERATION":
            return initialState;
        default:
            return state;
    }
};