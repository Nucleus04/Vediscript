import "./style.css";
import {useEffect, useRef, useState } from "react";
import UploadVideo from "./module/uploadVideo";
import { setIsThereError, setLoading, setLoadingStatus} from "../../../../../redux/EditingAction";
import { useDispatch , useSelector} from "react-redux";
import socket from "../../../../../websocket/socket";
import getTranscription from "./module/getTranscription";

function TranscriptionComponent (transcript) {
    const globalState = useSelector((state) => state.edit);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [script, setScript] = useState("");
    const getTranscriptionCallback = (data) => {
        console.log("callback", data.data[0]);
        setScript(data);
    }
    useEffect(() => {
        if(globalState.isThereUploadedVideo === true) {
            getTranscription(getTranscriptionCallback);
        }
    }, [globalState.isThereUploadedVideo])

    socket.on('audio-extraction', (data) => {
        if(data === "start") {
            dispatch(setLoadingStatus("Uploading..."));
        }
        else{
            dispatch(setLoadingStatus(""));
        }
    });
    const handleUploadClick = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }
    const onLoading = (state) => {
        dispatch(setLoading(state));
    }
    const onSuccessResponse = (successMessage) => {
        const error = {
            state: true,
            status: "success",
            message: successMessage,
        }
        dispatch(setIsThereError(error));
    }
    const handleFileChange = (event) => {
        event.preventDefault();
        let selectedfile = event.target.files[0];
        UploadVideo(selectedfile, onErrorResponse, onLoading, onSuccessResponse);
        selectedfile = null;
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
    return (
        <div className="transcription-container">
            <div className={`transcription-container-inside ${globalState.isThereUploadedVideo? "" : "display-center-item" }`}>
                <input type="file" ref ={fileInputRef} onChange={handleFileChange} style={{ display:"none"}}/>
                {script ? script.data.map((item, index) => {
                    return <span className={`${globalState.isThereUploadedVideo? "transcription" : "display-none" }`} key={index}>{item.word}</span>
                }) : ""}
                <button className={`${globalState.isThereUploadedVideo? "display-none" : "uplaod-button" }`} type="submit" onClick={handleUploadClick}>Upload</button>
            </div>
        </div>
    )
}

export default TranscriptionComponent;