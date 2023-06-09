import "./style.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsThereError } from "../../../../../redux/EditingAction";

function StatusMessageComponent () {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const globalState = useSelector((state) => state.edit);
    const dispatch = useDispatch();
    useEffect(() => {
        if(globalState.isThereError.state === true)
            setShowErrorModal(true);
        else{
            setShowErrorModal(false);
        }
    },[globalState.isThereError]);
    const handleOkayButton = () => {
        const error = {
            state: false,
            message: "",
        }
        dispatch(setIsThereError(error));
    }
    return(
        <div className={`status-message-main-container ${showErrorModal? "" : `display-none`}`}>
            <div className="status-message-modal-container">
                <div className="status-message-modal">
                    <div className="status-message-img-message-container">
                        <img src="/piffle-error.gif" alt="gif" width={85} height={100}/>
                        <p>{globalState.isThereError.message}</p>
                    </div>
                    <button className="status-message-okay-button" onClick={handleOkayButton}>Okay</button>
                </div>
            </div>
        </div>
    );
}

export default StatusMessageComponent;