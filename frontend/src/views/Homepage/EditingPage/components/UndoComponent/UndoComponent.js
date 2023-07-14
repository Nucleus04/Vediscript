import { useSelector, useDispatch } from "react-redux";
import { undoChanges } from "../../../../../redux/HistoryTrackerAction";

function UndoComponent () {
    const history = useSelector((state) => state.history);
    const dispatch = useDispatch();
    const handleUndo = () => {
        if(history.currentHistoryIndex > 0)
            dispatch(undoChanges());
    }
    return (
        <div className="editing-menu-button" onClick={handleUndo}>Undo</div>
    )
}

export default UndoComponent;