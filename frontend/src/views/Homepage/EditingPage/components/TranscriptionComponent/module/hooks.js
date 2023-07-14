import { useEffect } from "react";
import { addInitialRemoveAudio } from "../../../../../../redux/HistoryTrackerAction";
import { trusted } from "mongoose";


export const useVideoRetriever = (dispatch, globalState, getTranscription, setScript, setShowLoading) => {
    useEffect(() => {
        if(globalState.isThereUploadedVideo === true) {
            setShowLoading(true);
            getTranscription((data) => {
                setShowLoading(false);
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

export const useModificationChecker = (script, dispatch) => {
    useEffect(() => {
        if(script)
            if(script.data.metadata.hasOwnProperty("modification")) {
                let remove_audio = script.data.metadata.modification.remove_audio;
                let transcription = script.data.metadata.transcription;
                let bitrate = script.data.metadata.bitrate;
                let duration = script.data.metadata.duration;
                let highlight = script.data.metadata.modification.highlight;

                dispatch(addInitialRemoveAudio({
                    remove_audio,
                    transcription,
                    highlight,
                    bitrate,
                    duration,
                }));
                //dispatch(resetHistoryIndex());

            } else {
                console.log("There is no current modification");
            }
    }, [script]);
}

export const useUndoRedoTranscript = (history, removeCrossOutInScript, handleMouseUpCrossOuter, handleMouseUpHighlight, transcript) => {
    useEffect(() => {
        if(history.currentState.remove_audio !== undefined) {
            if(history.currentState.remove_audio.length !== 0) {
                removeCrossOutInScript();
                for(let i = 0; i < history.currentState.remove_audio.length; i++)
                    handleMouseUpCrossOuter(history.currentState.remove_audio[i].start, history.currentState.remove_audio[i].end);
            } else {
                removeCrossOutInScript();
            }
        }
        if(history.currentState.highlight !== undefined) {
            if(history.currentState.highlight.length !== 0) {
                removeCrossOutInScript();
                for(let i = 0; i < history.currentState.highlight.length; i++)
                    handleMouseUpHighlight(history.currentState.highlight[i].start, history.currentState.highlight[i].end, history.currentState.highlight[i].color);
            } else {
                removeCrossOutInScript();
            }
        } 
        else {
            removeCrossOutInScript();
        }
    }, [history.currentState, transcript]);
}


export const useCursorChanger = (globalOperationState, setCursor) => {
    useEffect(() => {
        if(globalOperationState.isRemovingAudio || globalOperationState.isReplacingAudio || globalOperationState.isHighlighting.state) {
             setCursor("crosshair");
        } else {
             setCursor("auto");
        }
     }, [globalOperationState])
}