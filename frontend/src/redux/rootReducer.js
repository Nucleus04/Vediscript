import { projectPreviewReducer } from "./ProjectPreviewReducer";
import { combineReducers } from "redux";
import { EditingPageReducer } from "./EditingPageReducer";

const rootReducer = combineReducers({
    projects: projectPreviewReducer,
    edit: EditingPageReducer,
});

export default rootReducer;