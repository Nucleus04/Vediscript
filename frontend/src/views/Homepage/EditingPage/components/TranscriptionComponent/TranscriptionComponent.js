import "./style.css";
import {useEffect, useRef, useState } from "react";
import UploadVideo from "./module/uploadVideo";
import { setIsThereError, setLoading, setLoadingStatus, setIsThereUploadedVideo, setCurrentVideoTimestamp, setPlaybackTime, setIsNavigatingTroughScript} from "../../../../../redux/EditingAction";
import { useDispatch , useSelector} from "react-redux";
import socket from "../../../../../websocket/socket";
import getTranscription from "./module/getTranscription";


function TranscriptionComponent () {
    const socketId = socket.id;
    const projectDetails = JSON.parse(localStorage.getItem("project-details"));
    const globalState = useSelector((state) => state.edit);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [script, setScript] = useState("");
    const currentWord = useRef(null);

    useEffect(() => {
        if(globalState.isThereUploadedVideo === true) {
            getTranscription((data) => {
                console.log("callback", data);
                setScript(data);
            });
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
    const handleFileChange = (event) => {

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
    
    const handleWordClick = async(event) => {
        dispatch(setPlaybackTime(event.target.dataset.start));
        dispatch(setIsNavigatingTroughScript(true));
        dispatch(setCurrentVideoTimestamp(parseFloat(event.target.dataset.start)));
        let second = parseFloat(event.target.dataset.start);
        console.log(second);
        let bit_rate = script.bitrate;
        console.log(bit_rate);
        let range = Math.floor((bit_rate * second) / 8);
        console.log(range);
        try {
            await fetch(`http://localhost:5000/video-display/${projectDetails._id}/${socketId}`, {
                headers: {
                    Range: `bytes=${parseInt(range)}-`,
                }
            })
        } catch (error) {
            console.log("Error on jumping to the video")
        }
    }

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

    return (
        <div className="transcription-container">
            <div className={`transcription-container-inside ${globalState.isThereUploadedVideo? "" : "display-center-item" }`}>
                <input type="file" ref ={fileInputRef} onChange={handleFileChange} style={{ display:"none"}}/>
                {script ? script.data.map((item, index) => {
                    return <span 
                            className={`${globalState.isThereUploadedVideo? "transcription" : "display-none" }`} 
                            key={index}
                            data-start = {item.startTime}
                            data-end = {item.endTime}
                            onClick={handleWordClick}
                            ref={currentWord}
                            >{item.word}</span>
                }) : ""}
                <button className={`${globalState.isThereUploadedVideo? "display-none" : "uplaod-button" }`} type="submit" onClick={handleUploadClick}>Upload</button>
            </div>
        </div>
    )
}

export default TranscriptionComponent;