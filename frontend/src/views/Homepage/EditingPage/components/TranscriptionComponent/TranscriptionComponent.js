import "./style.css";
import { useEffect, useRef, useState } from "react";
import UploadVideo from "./module/uploadVideo";
import { setIsThereError, setLoading, setLoadingStatus, setSuccessEvent } from "../../../../../redux/EditingAction";
import { useDispatch } from "react-redux";
import socket from "../../../../../websocket/socket";

function TranscriptionComponent () {
    const fileInputRef = useRef(null);
    const [transcription, SetTranscription] = useState([]);
    const dispatch = useDispatch();


    socket.on('audio-extraction', (data) => {
        if(data === "start") {
            dispatch(setLoadingStatus("Extracting audio..."));
        }
        else{
            dispatch(setLoadingStatus(""));
        }
    });
    socket.on('transcription', (data) => {
        console.log("Script", data);
        SetTranscription([...transcription, data]);
    })
    const handleUploadClick = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }
    // dispatch(setLoading(true));
    // dispatch(setLoadingStatus("Extracting audio..."));
    const onLoading = (state) => {
        dispatch(setLoading(state));
    }
    const onSuccessResponse = () => {
        let data = {
            state: true,
            message: "Uploaded Successfully!",
        }
        dispatch(setSuccessEvent(data));
    }
    const handleFileChange = (event) => {
        event.preventDefault();
        const selectedfile = event.target.files[0];
        UploadVideo(selectedfile, onErrorResponse, onLoading, onSuccessResponse);
    }
    const onErrorResponse = (errorMessage) => {
        const error = {
            state: true,
            message: errorMessage,
        }
        dispatch(setIsThereError(error));
    }
    return (
        <div className="transcription-container">
            <div className="transcription-container-inside">
                <input type="file" ref ={fileInputRef} onChange={handleFileChange} style={{ display:"none"}}/>
                <button className="uplaod-button" type="submit" onClick={handleUploadClick}>Upload</button>
            </div>
        </div>
    )
}


export default TranscriptionComponent;