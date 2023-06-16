const initialState = {
    currentState:{
        remove_audio:[],
    },
    history: [{
        remove_audio:[],
    }],
    currentHistoryIndex: 0,
  
}

export const HistoryTrackerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_HISTORY_REMOVE_AUDIO": 
            const newState = {
                ...state.currentState,
                remove_audio: [...state.currentState.remove_audio, action.payload],
            }
            return {
                ...state,
                currentState: newState,
                history: [...state.history.slice(0, state.currentHistoryIndex + 1), newState],
                currentHistoryIndex: state.currentHistoryIndex + 1,
            }
        case "UNDO":
            return {
                ...state,
                currentState:{
                    ...state.history[state.currentHistoryIndex - 1],
                },
                currentHistoryIndex: state.currentHistoryIndex - 1,
            }
        case "REDO":
            return {
                ...state,
                currentState:{
                    ...state.history[state.currentHistoryIndex + 1],
                },       
                currentHistoryIndex: state.currentHistoryIndex + 1,
            }
        default:
            return state;
    }
};