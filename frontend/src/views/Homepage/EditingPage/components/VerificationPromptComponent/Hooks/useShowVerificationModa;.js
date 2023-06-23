import { useEffect, useState } from "react";


function useShowVerificationModal (globalState) {
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    useEffect(() => {
        if(globalState.isVerifying) {
            if(!globalState.isThereError.state)
                setShowVerificationModal(true);
        } else {
            setShowVerificationModal(false);
        }
    }, [globalState.isVerifying]);

    return { showVerificationModal }

}

export default useShowVerificationModal;