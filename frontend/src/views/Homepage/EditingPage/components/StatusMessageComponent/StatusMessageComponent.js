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
            status:"",
            message: "",
        }
        dispatch(setIsThereError(error));
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