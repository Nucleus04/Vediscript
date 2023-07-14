//import { useDispatch } from "react-redux";
import { setPlaybackTime, setIsNavigatingTroughScript, setCurrentVideoTimestamp,setLoadingStatus, setIsThereError, setIsThereUploadedVideo, setLoading } from "../../../../../../redux/EditingAction";
import UploadVideo from "./uploadVideo";
import { setIsInserting } from "../../../../../../redux/OperationAction";


export const HanddleWordClickModule = async(event, script, socketId, projectDetails, dispatch, history) => {
    let second = parseFloat(event.target.dataset.start);
    let bit_rate = script.data.metadata.bitrate;
    let range = Math.floor((bit_rate * second) / 8);
    dispatch(setPlaybackTime(event.target.dataset.start));
    dispatch(setIsNavigatingTroughScript(true));
    dispatch(setCurrentVideoTimestamp(parseFloat(event.target.dataset.start)));
    try {
        console.log("I will request video - handler")
        await fetch(`http://localhost:5000/video-display/${projectDetails._id}/${socketId}/${history.currentHistoryIndex}/${history.history.length}`, {
            headers: {
                Range: `bytes=${parseInt(range)}-`,
            }
        })
    } catch (error) {
        console.log("Error on jumping to the video")
    }
}

export const HandleInputChangeModule = (event, dispatch) => {
    const onSuccessResponse = (successMessage) => {
        const error = {
            state: true,
            status: "success",
            message: successMessage,
        }
        dispatch(setIsThereUploadedVideo(true));
        dispatch(setIsThereError(error));
    }

    const onLoading = (state) => {
        dispatch(setLoading(state));
    }    

    const onErrorResponse = (errorMessage) => {
        console.log("There has been error");
        const error = {
            state: true,
            status: "fail",
            message: errorMessage,
        }
        dispatch(setIsThereError(error));
    }
    

    event.preventDefault();
    let selectedfile = event.target.files[0];
    UploadVideo(selectedfile, onErrorResponse, onLoading, onSuccessResponse);
    selectedfile = null;

}

export const SocketListenerModule = (socket, dispatch) => {
    socket.on('audio-extraction', (data) => {
        if(data.state === "start") {
            dispatch(setLoadingStatus(data.message));
        }
        else{
            dispatch(setLoadingStatus(""));
        }
    });
}

export const handleMouseUpCrossOuter = (startTime, endTime) => {
    const targetWord = Array.from(document.querySelectorAll(`.transcription-container-inside span`));
    let foundTheFirstWord = false;
    
    for (let i = 0; i < targetWord.length; i++) {
        if (targetWord[i].getAttribute("data-start") === startTime) {
            targetWord[i].classList.add('cross-out');
            targetWord[i].classList.add('red-color-text');
            foundTheFirstWord = true;
        } 
        if (foundTheFirstWord === true) {
            targetWord[i].classList.add('cross-out');
            targetWord[i].classList.add('red-color-text');
            if (targetWord[i].getAttribute("data-end") === endTime) {
            break;
            }
        }
    }
}

export const handleMouseUpHighlight = (startTime, endTime, color) => {
    const targetWord = Array.from(document.querySelectorAll(`.transcription-container-inside span`));
    let foundTheFirstWord = false;
    const start = parseFloat(startTime);
    const end = parseFloat(endTime);
   

    for (let i = 0; i < targetWord.length; i++) {
        let targetStart = parseFloat(targetWord[i].getAttribute("data-start"));
        let targetEnd = parseFloat(targetWord[i].getAttribute("data-end"))
        if ( targetStart >= start && targetEnd <= end) {
            targetWord[i].classList.add(color);
        } 
        if (foundTheFirstWord === true) {
            targetWord[i].classList.add(color);
            if (targetWord[i].getAttribute("data-end") === endTime) {
            break;
            }
        }
    }
}

export const removeCrossOutInScript = () => {
    const targetWord = Array.from(document.querySelectorAll(`.transcription-container-inside span`));
    for (let i = 0; i < targetWord.length; i++) {
        targetWord[i].classList.remove(targetWord[i].classList.item(1));
    }
}

export const handleInsertSelect = (event, dispatch) => {
    console.log("Selectning target word for insert")
    const endTime = event.target.dataset.end;
    console.log("The text will insert after :", endTime);
    dispatch(setIsInserting({state: true, endTime: endTime}));
}