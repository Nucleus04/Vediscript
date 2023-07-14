import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import { setIsThereError } from "../../../../../redux/EditingAction";
import useShowStatusModal from "./hooks/useShowStatusModal";
import { resetOperation } from "../../../../../redux/OperationAction";

function StatusMessageComponent () {
    
    const globalState = useSelector((state) => state.edit);
    const dispatch = useDispatch();
    const showErrorModal = useShowStatusModal(globalState);

    const handleOkayButton = () => {
        const error = {
            state: false,
            status:"",
            message: "",
        }
        dispatch(setIsThereError(error));
        dispatch(resetOperation());
    }
    return(
        <div className={`status-message-main-container ${showErrorModal? "" : `display-none`}`}>
            <div className="status-message-modal-container">
                <div className="status-message-modal">
                    <div className="status-message-img-message-container">
                        <img src={`${globalState.isThereError.status === "success" ? "/success.png":"/piffle-error.gif" }`} alt="gif" width={`${globalState.isThereError.status === "success" ? 100:70 }`} height={100}/>
                        <p className="statusMessage">{globalState.isThereError.message}</p>
                    </div>
                    <button className="status-message-okay-button" onClick={handleOkayButton}>Okay</button>
                </div>
            </div>
        </div>
    );
}

export default StatusMessageComponent;