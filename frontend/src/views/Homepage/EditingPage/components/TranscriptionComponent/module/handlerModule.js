//import { useDispatch } from "react-redux";
import { setPlaybackTime, setIsNavigatingTroughScript, setCurrentVideoTimestamp,setLoadingStatus, setIsThereError, setIsThereUploadedVideo, setLoading } from "../../../../../../redux/EditingAction";
import UploadVideo from "./uploadVideo";
export const HanddleWordClickModule = async(event, script, socketId, projectDetails, dispatch, history) => {
    //const dispatch = useDispatch();
    let second = parseFloat(event.target.dataset.start);
        let bit_rate = script.data.metadata.bitrate;
        let range = Math.floor((bit_rate * second) / 8);
        console.log("bitrate",bit_rate);
        dispatch(setPlaybackTime(event.target.dataset.start));
        dispatch(setIsNavigatingTroughScript(true));
        dispatch(setCurrentVideoTimestamp(parseFloat(event.target.dataset.start)));
        try {
            await fetch(`http://localhost:5000/video-display/${projectDetails._id}/${socketId}/${history.currentHistoryIndex}`, {
                headers: {
                    Range: `bytes=${parseInt(range)}-`,
                }
            })
            return;
        } catch (error) {
            console.log("Error on jumping to the video")
            return;
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

export const removeCrossOutInScript = () => {
    const targetWord = Array.from(document.querySelectorAll(`.transcription-container-inside span`));
    for (let i = 0; i < targetWord.length; i++) {
        targetWord[i].classList.remove('cross-out');
        targetWord[i].classList.remove('red-color-text');
    }
}

