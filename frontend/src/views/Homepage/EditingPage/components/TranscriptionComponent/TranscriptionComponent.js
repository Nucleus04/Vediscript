import "./style.css";
import { useRef, useState, useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import socket from "../../../../../websocket/socket";
import getTranscription from "./module/getTranscription";
import { useVideoRetriever, useWordHighlighter, useUndoRedoTranscript, useModificationChecker, useCursorChanger } from "./module/hooks";
import { HanddleWordClickModule, HandleInputChangeModule, SocketListenerModule, handleMouseUpCrossOuter, removeCrossOutInScript,handleMouseUpHighlight, handleInsertSelect } from "./module/handlerModule";
import { setIsVerifying, setLoading, setLoadingStatus } from "../../../../../redux/EditingAction";
import { setIsRemovingAudio, setIsThereCurrentOperation, setRemoveDetails } from "../../../../../redux/OperationAction";
import { setIsThereError } from "../../../../../redux/EditingAction";
import { addHighlight } from "../../../../../redux/HistoryTrackerAction";
import { resetOperation } from "../../../../../redux/OperationAction";
import constants from "../../../../../constant/constant";
import LoadingComponent from "../../../../LoadingComponent.js/LoadingComponent";

function TranscriptionComponent () {
    const constant = constants();
    const socketId = socket.id;
    const projectDetails = JSON.parse(localStorage.getItem("project-details"));
    const globalState = useSelector((state) => state.edit);
    const globalOperationState = useSelector((state) => state.operation);
    const [cursor, setCursor] = useState("auto");
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [script, setScript] = useState("");
    const [transcript, setTranscript] = useState("");
    const currentWord = useRef(null);
    const [isSelectingWord, setIsSelectingWord] = useState(false);
    const [endTime, setEndTime] = useState("");
    const [startTime, setStartTime] =useState("");
    const [endTimeTemp, setEndTimeTemp] = useState("");
    const [startTimeTemp, setStartTimeTemp] =useState("");
    const history = useSelector((state) => state.history);
    const [isSaving, setIsSaving] = useState(false);
    const [savingPrompt, setSavingPrompt] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    socket.on("saving", (state) => {
        if(state.state === "start"){
            setIsSaving(true);
            setSavingPrompt("Saving...")
            console.log("Uploading")
        } else{
            setSavingPrompt("Saved Succesfully!");
            setTimeout(() => {
                setIsSaving(false);
            }, 3000)
            console.log("DOne Uploading")
        }
    })

    useModificationChecker(script, dispatch);
    useVideoRetriever(dispatch, globalState, getTranscription, setScript, setShowLoading);
    useWordHighlighter(globalState);
    SocketListenerModule(socket, dispatch);
    useUndoRedoTranscript(history, removeCrossOutInScript, handleMouseUpCrossOuter, handleMouseUpHighlight, transcript);
    useCursorChanger(globalOperationState, setCursor);
    useEffect(() => {
        setTranscript(history.currentState.transcription);
    }, [history.currentState])
    const handleUploadClick = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }
    const handleFileChange = (event) => {
        HandleInputChangeModule(event, dispatch)
    }

    const handleWordClick = async(event) => {
        if(globalOperationState.isThereCurrentOperation.operation === constant.operation.insert_text){
            handleInsertSelect(event, dispatch);
        } else {
            HanddleWordClickModule(event, script, socketId, projectDetails, dispatch, history);
        }
    }
    const handleMouseUp = () => {
        let start, end;
        if(parseFloat(startTime) > parseFloat(startTimeTemp)){
            start = startTimeTemp;
            end = endTime;
        } else{
            start = startTime;
            end = endTimeTemp;
        }
        window.getSelection().removeAllRanges();
        if(globalOperationState.isRemovingAudio || globalOperationState.isReplacingAudio ||  globalOperationState.isHighlighting.state) {
            setIsSelectingWord(false)
            if(globalOperationState.isRemovingAudio || globalOperationState.isReplacingAudio)
                dispatch(setRemoveDetails({start: start, end: end}));
            if(globalOperationState.isHighlighting.state){
                dispatch(addHighlight({color: globalOperationState.isHighlighting.color, start: start, end: end}))
                dispatch(resetOperation());
            }
            if(globalOperationState.isRemovingAudio || globalOperationState.isReplacingAudio)
            dispatch(setIsVerifying(true));
        }
    }

    const handleMouseDown = (event) => {
        if(globalOperationState.isRemovingAudio || globalOperationState.isReplacingAudio ||  globalOperationState.isHighlighting.state){
                setStartTime(event.target.getAttribute("data-start"));
                setEndTime(event.target.getAttribute("data-end"));
                setIsSelectingWord(true)
        }
    }

    const handleSelectedWord = (event) => {
        if(globalOperationState.isRemovingAudio || globalOperationState.isReplacingAudio ||  globalOperationState.isHighlighting.state) {
            if(isSelectingWord) { 
                //if(parseFloat(event.target.getAttribute("data-start")) < parseFloat(startTime))
                    setStartTimeTemp(event.target.getAttribute("data-start"))

                //if(parseFloat(event.target.getAttribute("data-end")) > parseFloat(endTime))
                    setEndTimeTemp(event.target.getAttribute("data-end"))
            }
        }
    }
    
    return (
        <div className="transcription-container"style={{cursor : cursor }} onMouseUp={handleMouseUp}>
            {showLoading? <LoadingComponent/> : ""}
            <div className={`saving-prompt ${isSaving? "" : "display-none"}`} >{savingPrompt}</div>
            <div className={`transcription-container-inside ${globalState.isThereUploadedVideo? "" : "display-center-item" }`}>
                <input type="file" ref ={fileInputRef} onChange={handleFileChange} style={{ display:"none"}}/>
                {script ? transcript.map((item, index) => {
                    return <span 
                            className={`${globalState.isThereUploadedVideo? "transcription" : "display-none" }`} 
                            key={index}
                            data-start = {item.startTime}
                            data-end = {item.endTime}
                            onMouseDown={handleMouseDown} 
                            onClick={handleWordClick}
                            ref={currentWord}
                            style={globalOperationState.isRemovingAudio || globalOperationState.isReplacingAudio || globalOperationState.isHighlighting.state? {cursor: "crosshair"} : {cursor: "pointer"}}
                            onMouseOver={handleSelectedWord}
                            >{item.word}</span>
                }) : ""}
                <button className={`${globalState.isThereUploadedVideo? "display-none" : "uplaod-button" }`} type="submit" onClick={handleUploadClick}>Upload</button>
            </div>
        </div>
    )
}

export default TranscriptionComponent;