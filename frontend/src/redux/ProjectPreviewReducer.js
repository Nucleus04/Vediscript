import { createStore } from "redux";

const initialState = {
     isCreatingNewProject : false,
     isRetrieveNeed: false,
};

export const projectPreviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SHOW_CREATE_PROJECT_FORM':
            return {
                isCreatingNewProject: action.payload,
            }
        case "SET_RETRIEVE_PROJECT_LIST":
            return {
                isRetrieveNeed: action.payload,
            }
            default:
                return state;
    }
};

