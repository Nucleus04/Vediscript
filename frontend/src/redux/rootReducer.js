import { projectPreviewReducer } from "./ProjectPreviewReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    projects: projectPreviewReducer,
});

export default rootReducer;