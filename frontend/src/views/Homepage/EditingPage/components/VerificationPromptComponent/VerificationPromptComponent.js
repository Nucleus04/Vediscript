import { useEffect, useState } from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import { setVerified, setIsVerifying, setLoading, setLoadingStatus } from "../../../../../redux/EditingAction";
import { setAddHistory_RemoveAudio } from "../../../../../redux/HistoryTrackerAction";
import VerificationHandlerModule from "./HandlerModule.js/VerificationHandlerModule";
import socket from "../../../../../websocket/socket";
import useShowVerificationModal from "./Hooks/useShowVerificationModa;";
function VerificationPromptComponent () {
    const globalState = useSelector((state) => state.edit);
    const globalOperationState = useSelector((state) => state.operation);
    const history = useSelector((state) => state.history);
    const dispatch = useDispatch();
    const {showVerificationModal} = useShowVerificationModal(globalState);
    socket.on('removing-audio', (data) => {
        if(data.state === "start") {
            dispatch(setLoadingStatus(data.message));
            dispatch(setLoading(true));
        }
        else{
            dispatch(setLoading(false));
            dispatch(setLoadingStatus(""));
        }
    });
   
    const handleVerify = () => {
        VerificationHandlerModule(dispatch, globalOperationState).verify(history.currentHistoryIndex);
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