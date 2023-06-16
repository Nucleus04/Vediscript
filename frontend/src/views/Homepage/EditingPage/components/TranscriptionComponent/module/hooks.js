import { useEffect } from "react";

export const useVideoRetriever = (globalState, getTranscription, setScript) => {
    useEffect(() => {
        if(globalState.isThereUploadedVideo === true) {
            getTranscription((data) => {
                setScript(data);
            });
        }
    }, [globalState.isThereUploadedVideo])
}


export const useWordHighlighter = (globalState) => {
    useEffect(() => {
        const time = globalState.currentVideoTimeStamp.toFixed(1);
        const targetWord = Array.from(document.querySelectorAll(`.transcription-container-inside span`));

        for(let i=0; i<targetWord.length; i++) {
            if(parseFloat(targetWord[i].getAttribute("data-start")) <= time &&  parseFloat(targetWord[i].getAttribute("data-end")) > time ){
                targetWord[i].style.backgroundColor = "#a0eda3";
                targetWord[i].scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                })
            } else{
                targetWord[i].style.backgroundColor = "transparent";
            }
        }
    }, [globalState.currentVideoTimeStamp]);
}

export const useUndoRedoTranscript = (history, removeCrossOutInScript, handleMouseUpCrossOuter) => {
    useEffect(() => {
        if(history.currentState.remove_audio !== undefined) {
            if(history.currentState.remove_audio.length !== 0) {
                removeCrossOutInScript();
                for(let i = 0; i < history.currentState.remove_audio.length; i++)
                    handleMouseUpCrossOuter(history.currentState.remove_audio[i].start, history.currentState.remove_audio[i].end);
            } else {
                removeCrossOutInScript();
            }
        } else {
            removeCrossOutInScript();
        }
    }, [history.currentState]);
}