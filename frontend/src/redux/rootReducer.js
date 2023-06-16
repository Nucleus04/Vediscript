import { projectPreviewReducer } from "./ProjectPreviewReducer";
import { combineReducers } from "redux";
import { EditingPageReducer } from "./EditingPageReducer";
import { OperationReducer } from "./OperationReducer";
import { HistoryTrackerReducer } from "./HistoryTrackerReducer";


const rootReducer = combineReducers({
    projects: projectPreviewReducer,
    edit: EditingPageReducer,
    operation: OperationReducer,
    history: HistoryTrackerReducer,
});

export default rootReducer;