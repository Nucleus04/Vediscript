import { useEffect, useState } from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import { setVerified, setIsVerifying } from "../../../../../redux/EditingAction";
import { setAddHistory_RemoveAudio } from "../../../../../redux/HistoryTrackerAction";
import VerificationHandlerModule from "./HandlerModule.js/VerificationHandlerModule";

function VerificationPromptComponent () {
    const globalState = useSelector((state) => state.edit);
    const globalOperationState = useSelector((state) => state.operation);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const history = useSelector((state) => state.history);
    const dispatch = useDispatch();

    useEffect(() => {
        if(globalState.isVerifying) {
            if(!globalState.isThereError.state)
                setShowVerificationModal(true);
        } else {
            setShowVerificationModal(false);
        }
    }, [globalState.isVerifying]);
    console.log(history);
    const handleVerify = () => {
        VerificationHandlerModule(dispatch, globalOperationState).verify();
    }
    const handleCancel = () => {
        VerificationHandlerModule(dispatch, globalOperationState).cancel();
    }
    return (
        <div className={`verification-prompt-main-container ${showVerificationModal? "": "display-none"}`}>
            <div className="verification-modal">
                <span> Do you want to Remove the audio?</span>
                <div className="verification-button-container">
                    <button onClick={handleVerify}>Verify</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}


export default VerificationPromptComponent;