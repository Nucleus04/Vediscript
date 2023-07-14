import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowAssests, setIsThereError } from "../../../../../redux/EditingAction";
import LoadingComponent from "../../../../LoadingComponent.js/LoadingComponent";
import getAssets from "./module/getAssets";
import { resetOperation } from "../../../../../redux/OperationAction";
import submitAudio from "./module/submitReplaceAudioRequest";
import { addReplaceAudioHistory } from "../../../../../redux/HistoryTrackerAction";
import "./style.css";
import { setLoading, setLoadingStatus } from "../../../../../redux/EditingAction";
import socket from "../../../../../websocket/socket";

function AssetsComponent () {
    const editingState = useSelector((state) => state.edit);
    const history = useSelector((state) => state.history);
    const operationState = useSelector((state) => state.operation);
    const dispatch = useDispatch();
    const [audioFiles, setAudioFiles] = useState("");
    const [isShowingAssetModal, setShowAssetModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isPicking, setIsPicking] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const projectDetails = JSON.parse(localStorage.getItem("project-details"));
    const myRef = useRef(null);

    const token = localStorage.getItem("authToken");
    socket.on('replacing-audio', (data) => {
        if(data.state === "start") {
            dispatch(setLoadingStatus(data.message));
            dispatch(setLoading(true));
        }
        else{
            dispatch(setLoading(false));
            dispatch(setLoadingStatus(""));
        }
    });

    useEffect(() => {
        if(editingState.isShowAssets) {
            setShowAssetModal(true);
        }
    }, [editingState.isShowAssets])

    const handlwMouseLeave = () => {
        setShowAssetModal(false)
        dispatch(setShowAssests(false))
        dispatch(resetOperation());
    }
    
    useEffect(() =>{
        const projectId = projectDetails._id;
        getAssets(projectId, setAudioFiles, token);
    }, []);

    useEffect(() => {
        if(operationState.isReplacingViaLocal) {
            setIsPicking(true);
            console.log("Is Picking");
        }
    }, [operationState.isReplacingViaLocal]);

    const onResponse = (state, data) => {
        if(state){
            dispatch(addReplaceAudioHistory(data.script))
            const error = {
                state: true,
                status: "success",
                message: "Replacing audio successfully!"
            }
            dispatch(setIsThereError(error));
        } else{
            const error = {
                state: false,
                status: "fail",
                message: "Removing audio failed..."
            }
            dispatch(setIsThereError(error));
        }  
    }
    const handlePlayAudio = async(item) => {
        if(isPicking){
            
            submitAudio(
                item,
                operationState.initialRemovingData.start,
                operationState.initialRemovingData.end,
                history.currentHistoryIndex,
                onResponse,
                history,
                );
        } else {
            try {
                const response  = await fetch(`http://localhost:5000/get-audio/${projectDetails._id}/${item}`);
                if(response.ok){
                    console.log("get the audio successfully");
                    setAudioURL(`http://localhost:5000/get-audio/${projectDetails._id}/${item}`);
                } else {
                    console.log("There is some error");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    const handleRefresh = () => {
        const projectId = projectDetails._id;
        getAssets(projectId, setAudioFiles, token);
    }
    const handleClick = (event) => {
        if(myRef.current && !myRef.current.contains(event.target)){
                dispatch(setShowAssests(false))
                dispatch(resetOperation());
                setShowAssetModal(false);
        }
    }
    useEffect(() => {
        if(isShowingAssetModal){
            document.addEventListener("click", handleClick);
        }
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [isShowingAssetModal])
    return(
        <div className={`assets-maincontainer ${isShowingAssetModal? "" : "display-none"}`} >
            <div className="assets-modal" onMouseLeave={handlwMouseLeave} ref={myRef}>
                <p className="assets-tittle">Assets</p>
                <div className="assets-audio-player">
                    <audio src={audioURL} controls autoPlay className="asset-audio-controls"></audio>
                </div>
                <div className="assets-audio-video-button-continer">
                    <button>Audio</button>
                    <button onClick={handleRefresh}>r</button>
                </div>
                <div className="assests-item-maincontainer">
                    {audioFiles? (
                        <div className="assets-item-container">

                            {audioFiles? audioFiles.map((item, index) => {
                                return (
                                    <div className="assets-item" key={index} data-filename={item} onClick={() => handlePlayAudio(item)}>
                                        <div className="assets-item-logo">

                                        </div>
                                        <div className="assets-item-filename">
                                            <div className="assets-filename">{item}</div>
                                        </div>
                                    </div>
                                )
                            }): ""}

                        </div>) : "No Assets"}
                    
                    {isLoading? <LoadingComponent/> : ""}
                </div>
            </div>
        </div>
    )
}

export default AssetsComponent;