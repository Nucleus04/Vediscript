import { setVerified,  setIsVerifying } from "../../../../../../redux/EditingAction";
import { setIsRemovingAudio, setIsThereCurrentOperation } from "../../../../../../redux/OperationAction";
import { setAddHistory_RemoveAudio } from "../../../../../../redux/HistoryTrackerAction";
import RequestToRemoveAudio from "./module/sendRequestRemoveAudio";

function VerificationHandlerModule (dispatch, globalOperationState) {
    const verify = () => {
        dispatch(setVerified(true));
        dispatch(setAddHistory_RemoveAudio(globalOperationState.initialRemovingData));
        dispatch(setIsVerifying(false));

        if(globalOperationState.isRemovingAudio){
            const data = globalOperationState.initialRemovingData;
            const start = data.start;
            const end = data.end;
            RequestToRemoveAudio(start, end);
        }

    }

    const cancel = () => {
        dispatch(setVerified(false));
        dispatch(setIsVerifying(false));
        dispatch(setIsRemovingAudio(false));
        dispatch(setIsThereCurrentOperation({state: false, operation: ""}));
    }

    return {
        verify, cancel,
    }
}

export default VerificationHandlerModule;