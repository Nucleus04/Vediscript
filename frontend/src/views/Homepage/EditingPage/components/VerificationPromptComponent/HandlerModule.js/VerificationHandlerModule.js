import { setVerified,  setIsVerifying, setIsThereError } from "../../../../../../redux/EditingAction";
import { setIsRemovingAudio, setIsThereCurrentOperation , resetOperation, setShowRecordComponent} from "../../../../../../redux/OperationAction";
import { setAddHistory_RemoveAudio } from "../../../../../../redux/HistoryTrackerAction";
import RequestToRemoveAudio from "./module/sendRequestRemoveAudio";


function VerificationHandlerModule (dispatch, globalOperationState) {

    const callback = (status) => {
        if(status){
            dispatch(setAddHistory_RemoveAudio(globalOperationState.initialRemovingData));
            const error = {
                state: true,
                status: "success",
                message: "Removing audio successfully!"
            }
            dispatch(setIsThereError(error));
        } else {
            const error = {
                state: true,
                status: "fail",
                message: "Removing audio failed..."
            }
            dispatch(setIsThereError(error));
        }
    }
    const verify = (historyIndex) => {
        dispatch(setVerified(true));
        dispatch(setIsVerifying(false));

        if(globalOperationState.isReplacingAudio){
            dispatch(setShowRecordComponent(true));
        } else {
            dispatch(resetOperation());
        }
        
        if(globalOperationState.isRemovingAudio){
            const data = globalOperationState.initialRemovingData;
            const start = data.start;
            const end = data.end;
            RequestToRemoveAudio(start, end, historyIndex, callback);
        }

    }

    const cancel = () => {
        dispatch(setVerified(false));
        dispatch(setIsVerifying(false));
        dispatch(resetOperation());
       
    }

    return {
        verify, cancel,
    }
}

export default VerificationHandlerModule;