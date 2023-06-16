
import "./style.css";
import { useDispatch } from "react-redux";
import { resetOperation } from "../../../../../redux/OperationAction";

function CancelComponent () {
    const dispatch = useDispatch();
    const handleCancelClick = () => {
        dispatch(resetOperation());
    }
    return (
        <div className="editing-menu-button-cancel cancel-red" onClick={handleCancelClick}>
            <p>Cancel</p>
        </div>
    )
}

export default CancelComponent;