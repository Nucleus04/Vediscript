import "./style.css";
import { useRef, useState, useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import socket from "../../../../../websocket/socket";
import getTranscription from "./module/getTranscription";
import { useVideoRetriever, useWordHighlighter, useUndoRedoTranscript } from "./module/hooks";
import { HanddleWordClickModule, HandleInputChangeModule, SocketListenerModule, handleMouseUpCrossOuter, removeCrossOutInScript } from "./module/handlerModule";
import { setIsVerifying } from "../../../../../redux/EditingAction";
import { setIsRemovingAudio, setIsThereCurrentOperation, setRemoveDetails } from "../../../../../redux/OperationAction";
import { setIsThereError } from "../../../../../redux/EditingAction";


function TranscriptionComponent () {
    const socketId = socket.id;
    const projectDetails = JSON.parse(localStorage.getItem("project-details"));
    const globalState = useSelector((state) => state.edit);
    const globalOperationState = useSelector((state) => state.operation);
    const [cursor, setCursor] = useState("auto");
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [script, setScript] = useState("");
    const currentWord = useRef(null);
    const [isSelectingWord, setIsSelectingWord] = useState(false);
    const [endTime, setEndTime] = useState("");
    const [startTime, setStartTime] =useState("");
    const history = useSelector((state) => state.history);

    useVideoRetriever(globalState, getTranscription, setScript);
    useWordHighlighter(globalState);
    SocketListenerModule(socket, dispatch);
    useUndoRedoTranscript(history, removeCrossOutInScript, handleMouseUpCrossOuter);
    let end = [], start = [];

    useEffect(() => {
       if(globalOperationState.isRemovingAudio) {
            setCursor("crosshair");
       } else {
            setCursor("auto");
       }
    }, [globalOperationState.isRemovingAudio])

    const handleUploadClick = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }

    const handleFileChange = (event) => {
        HandleInputChangeModule(event, dispatch)
    }

    const handleWordClick = async(event) => {
        HanddleWordClickModule(event, script, socketId, projectDetails, dispatch);
    }

    useEffect(() => {
        if(startTime === undefined || endTime === undefined) {
            const error = {
                state: true,
                status: "fail",
                message: "Oops!, I didnt catch that, please try again",
            }
            dispatch(setIsThereError(error));
        }
    }, [startTime, endTime])
    const handleMouseUp = () => {
        if(globalOperationState.isRemovingAudio) {
            setIsSelectingWord(false)
            dispatch(setRemoveDetails({start: startTime, end: endTime}));
            dispatch(setIsVerifying(true));
        }
    }

    const handleMouseDown = (event) => {
        if(globalOperationState.isRemovingAudio){
                setStartTime(event.target.getAttribute("data-start"));
                setEndTime(event.target.getAttribute("data-end"));
                setIsSelectingWord(true)
        }
    }
   
    const handleSelectedWord = (event) => {
        if(globalOperationState.isRemovingAudio) {
            if(isSelectingWord) { 
                if(parseFloat(event.target.getAttribute("data-start")) < parseFloat(startTime))
                    setStartTime(event.target.getAttribute("data-start"))

                if(parseFloat(event.target.getAttribute("data-end")) > parseFloat(endTime))
                    setEndTime(event.target.getAttribute("data-end"))
            }
        }
    }
    
    return (
        <div className="transcription-container" style={{cursor : cursor }} onMouseUp={handleMouseUp}>
            <div className={`transcription-container-inside ${globalState.isThereUploadedVideo? "" : "display-center-item" }`}>
                <input type="file" ref ={fileInputRef} onChange={handleFileChange} style={{ display:"none"}}/>
                {script ? script.data.map((item, index) => {
                    return <span 
                            className={`${globalState.isThereUploadedVideo? "transcription" : "display-none" }`} 
                            key={index}
                            data-start = {item.startTime}
                            data-end = {item.endTime}
                            onMouseDown={handleMouseDown} 
                            onClick={handleWordClick}
                            ref={currentWord}
                            style={globalOperationState.isRemovingAudio? {cursor: "crosshair"} : {cursor: "pointer"}}
                            onMouseOver={handleSelectedWord}
                            >{item.word}</span>
                }) : ""}
                <button className={`${globalState.isThereUploadedVideo? "display-none" : "uplaod-button" }`} type="submit" onClick={handleUploadClick}>Upload</button>
            </div>
        </div>
    )
}

export default TranscriptionComponent;