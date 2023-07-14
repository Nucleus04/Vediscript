import { setVerified,  setIsVerifying, setIsThereError, setShowAssests } from "../../../../../../redux/EditingAction";
import { setIsRemovingAudio, setIsThereCurrentOperation , resetOperation, setShowRecordComponent} from "../../../../../../redux/OperationAction";
import RequestToRemoveAudio from "./module/sendRequestRemoveAudio";
import { addReplaceAudioHistory } from "../../../../../../redux/HistoryTrackerAction";
import { setLoading, setLoadingStatus } from "../../../../../../redux/EditingAction";

function VerificationHandlerModule (dispatch, globalOperationState) {

    const callback = (status, data) => {
        if(status){
            //dispatch(setAddHistory_RemoveAudio(globalOperationState.initialRemovingData));
            dispatch(addReplaceAudioHistory(data.script))
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
            dispatch(setLoading(false));
            dispatch(setLoadingStatus(""));
            
        }
    }
    const verify = (history) => {
        dispatch(setVerified(true));
        dispatch(setIsVerifying(false));

        if(globalOperationState.isReplacingAudio){
            if(globalOperationState.isReplacingViaLocal){
                dispatch(setShowAssests(true));
            } else {
                dispatch(setShowRecordComponent(true));
            }
        } else {
            dispatch(resetOperation());
        }
        
        if(globalOperationState.isRemovingAudio){
            const data = globalOperationState.initialRemovingData;
            const start = data.start;
            const end = data.end;
            RequestToRemoveAudio(start, end, history, callback);
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