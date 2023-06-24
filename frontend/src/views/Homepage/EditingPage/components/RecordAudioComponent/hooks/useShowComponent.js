import { useEffect, useState } from "react";


function useShowComponent (globalOperationState) {
    const [showRecordComponent, setShowRecordComponent] = useState(false);

    useEffect(() => {
        if(globalOperationState.isShowRecordComponent) {
            setShowRecordComponent(true);
        } else {
            setShowRecordComponent(false);
        }
    }, [globalOperationState.isShowRecordComponent])

    return showRecordComponent;
}

export default useShowComponent;