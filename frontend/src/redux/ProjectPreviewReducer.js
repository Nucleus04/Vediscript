
const initialState = {
     isCreatingNewProject : false,
     isRetrieveNeed: false,
     isEditingProjectDetail: {
        state: false,
        projectDetail: {
            projectId: "",
            projectName: "",
            projectDescription: "",
        },
     },
};

export const projectPreviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SHOW_CREATE_PROJECT_FORM':
            return {
                ...state,
                isCreatingNewProject: action.payload,
            }
        case "SET_RETRIEVE_PROJECT_LIST":
            return {
                ...state,
                isRetrieveNeed: action.payload,
            }
        case "SET_IS_EDITING_PROJECT_DETAIL":
            return {
                ...state,
                isEditingProjectDetail: action.payload,
            }
        case "SET_EDITING_DETAIL_STATE":
            return {
                ...state,
                isEditingProjectDetail: {
                    ...state.isEditingProjectDetail,
                    state: action.payload,
                }
            }
        case  "RESET_STATE":
            return initialState;
        default:
            return state;
    }
};

