import { useEffect, useState } from "react";
function useCursorSetter (globalOperationState) {
    const [cursor, setCursor] = useState("auto");
    useEffect(() => {
        if(globalOperationState.isRemovingAudio) {
            setCursor("not-allowed");
        } else {
            setCursor("auto");
        }
    }, [globalOperationState])

    return cursor; 
}


export default useCursorSetter;