import { useEffect, useState } from "react";

function useShowStatusModal (globalState) {
    const [showErrorModal, setShowErrorModal] = useState(false);
    useEffect(() => {
        if(globalState.isThereError.state === true)
            setShowErrorModal(true);
        else{
            setShowErrorModal(false);
        }
    },[globalState.isThereError]);

    return showErrorModal;
}

export default useShowStatusModal;