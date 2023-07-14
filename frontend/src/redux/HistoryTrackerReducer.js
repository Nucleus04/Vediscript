const initialState = {
    currentState:{
        remove_audio:[],
        transcription: [],
        highlight: [],
    },
    history: [],
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
        case "ADD_REPLACE_AUDIO_HISTORY":
            const replaceState = {
                ...state.currentState,
                transcription: action.payload,
            }
            return {
                ...state,
                currentState: replaceState,
                history: [...state.history.slice(0, state.currentHistoryIndex + 1), replaceState],
                currentHistoryIndex: state.currentHistoryIndex + 1,
            }
        
        case "ADD_HIGHLIGHT_HISTORY":
            const highlightState = {
                ...state.currentState,
                highlight: [...(state.currentState.highlight || []) ,action.payload],
            }
            return {
                ...state,
                currentState: highlightState,
                history: [...state.history.slice(0, state.currentHistoryIndex + 1), highlightState],
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
        case "RESET_HISTORY_INDEX":
            return {
                ...state,
                currentHistoryIndex: 0,
            }
        case "ADD_INITIAL_REMOVE_AUDIO":
            return {
                ...state,
                currentState: action.payload,
                history: [action.payload],
                }
        default:
            return state;
    }
};