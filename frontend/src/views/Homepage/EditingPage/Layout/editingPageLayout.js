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
import { initialInformation, setIsThereUploadedVideo } from "../../../../redux/EditingAction";
import { useDispatch, useSelector} from "react-redux";
import { undoChanges, redoChanges } from "../../../../redux/HistoryTrackerAction";
import useUnload from "./hooks/useUnload";
import useHistorySaver from "./hooks/useHistorySaver";
import useCursorSetter from "./hooks/useCursorSetter";
import RecordAudioComponent from "../components/RecordAudioComponent/RecordAudioComponent";



function EditingLayout () {
    const dispatch = useDispatch();
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    const globalOperationState = useSelector((state) => state.operation);
    const history = useSelector((state) => state.history)

    
    const cursor = useCursorSetter(globalOperationState);
    useUnload(projectDetail);
    useHistorySaver(history);  
    

    socket.on("message", (data) => {
        console.log(data);
    })

    const onResponse = (state) => {
        dispatch(setIsThereUploadedVideo(state));
    }

    useEffect(()=> {
        getInitialInfo(onResponse, history.currentHistoryIndex);
    }, [])

    const handleUndo = () => {
        if(history.currentHistoryIndex > 0)
            dispatch(undoChanges());
    }

    const handleRedo = () => {
        if(history.history.length !== history.currentHistoryIndex + 1)
            dispatch(redoChanges());
    }
    return (
        <div className="main-editing-page-container" style={{cursor: cursor}}>
            <RecordAudioComponent/>
            <StatusMessageComponent/>
            <EditingLoadingComponent/>
            <VerificationPromptComponent/>
            <div className="project-preview-header">
                <LogoDropDownMenuComponent/>
                <div className="project-name-editpage">
                    
                    <span className="project-name-display">{projectDetail.projectName}</span>
                    <div className="editing-menu-button-container">
                        <AudioComponent/>
                        <TextComponent/>
                        <div className="editing-menu-button" onClick={handleUndo}>Undo</div>
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