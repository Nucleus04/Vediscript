import "./style.css";
import ProfileComponent from "../../ProfileComponent/ProfileComponent";
import LogoDropDownMenuComponent from "../components/LogoDropDownMenu/LogoDropDownMenu";
import AudioComponent from "../components/AudioButtonComponent/AudioComponent";
import TextComponent from "../components/TextButtonComponent/TextComponent";
import TranscriptionComponent from "../components/TranscriptionComponent/TranscriptionComponent";
import VideoComponent from "../components/VideoComponent/VideoComponent";
import StatusMessageComponent from "../components/StatusMessageComponent/StatusMessageComponent";
import EditingLoadingComponent from "../../../LoadingComponent.js/EditingLoadingComponent";
import socket from "../../../../websocket/socket";
import getInitialInfo from "./module/getInitialInfo";
import CancelComponent from "../components/CancelComponent/CancelComponent";
import InstructionComponent from "../components/InstructionComponent/InstructionComponent";
import VerificationPromptComponent from "../components/VerificationPromptComponent/VerificationPromptComponent";
import { useEffect, useState} from "react";
import { setIsThereUploadedVideo, setShowAssests, setLoading, setLoadingStatus } from "../../../../redux/EditingAction";
import { useDispatch, useSelector} from "react-redux";
import { redoChanges } from "../../../../redux/HistoryTrackerAction";
import useUnload from "./hooks/useUnload";
import useHistorySaver from "./hooks/useHistorySaver";
import useCursorSetter from "./hooks/useCursorSetter";
import RecordAudioComponent from "../components/RecordAudioComponent/RecordAudioComponent";
import UndoComponent from "../components/UndoComponent/UndoComponent";
import InsertText from "../components/InsertTextComponent/InsertTextComponent";
import AssetsComponent from "../components/AssetsComponent/AssetsComponent";

function EditingLayout () {
    const dispatch = useDispatch();
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    const globalOperationState = useSelector((state) => state.operation);
    const history = useSelector((state) => state.history)
    const socketId = socket.id;
    
    const cursor = useCursorSetter(globalOperationState);
    useUnload(projectDetail);
    useHistorySaver(history);  
    

    socket.on("message", (data) => {
        console.log(data);
    })

    const onResponse = async(state) => {
        dispatch(setLoadingStatus(""));
        dispatch(setLoading(false));
        if(state){
            dispatch(setIsThereUploadedVideo(state));
        } 
    }

    useEffect(()=> {
        dispatch(setLoadingStatus("Retrieving project information..."));
        dispatch(setLoading(true));
        getInitialInfo(onResponse, history.currentHistoryIndex);
    }, [])

    const handleRedo = () => {
        if(history.history.length !== history.currentHistoryIndex + 1)
            dispatch(redoChanges());
    }
    const showAssetsdModal = () => {
        dispatch(setShowAssests(true));
    }
    return (
        <div className="main-editing-page-container" style={{cursor: cursor}}>
            <RecordAudioComponent/>
            <InsertText/>
            <StatusMessageComponent/>
            <EditingLoadingComponent/>
            <VerificationPromptComponent/>
            <AssetsComponent/>
            <div className="project-preview-header">
                <LogoDropDownMenuComponent/>
                <div className="project-name-editpage">
                    
                    <span className="project-name-display">{projectDetail.projectName}</span>
                    <div className="editing-menu-button-container">
                        <AudioComponent/>
                        <TextComponent/>
                        <div className="editing-menu-button" onClick={showAssetsdModal}>Assets</div>
                        <UndoComponent/>
                        <div className="editing-menu-button" onClick={handleRedo}>Redo</div>
                        {globalOperationState.isThereCurrentOperation.state? ( <CancelComponent/>) : ""}
                    </div>
                </div>
                <InstructionComponent/>
                <ProfileComponent />
            </div>
            <div className="video-transcription-main-container">
                <div className="transcription-main-container">
                    <TranscriptionComponent/>
                </div>
                <div className="video-display-main-container">
                    <VideoComponent/>
                </div>
            </div>
        </div>
    )
}

export default EditingLayout;