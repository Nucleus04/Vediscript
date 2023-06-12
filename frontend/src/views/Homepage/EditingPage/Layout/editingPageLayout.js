import "./style.css";
import ProfileComponent from "../../CommonComponents/ProfileComponent/ProfileComponent";
import LogoDropDownMenuComponent from "../components/LogoDropDownMenu/LogoDropDownMenu";
import AudioComponent from "../components/AudioButtonComponent/AudioComponent";
import TextComponent from "../components/TextButtonComponent/TextComponent";
import TranscriptionComponent from "../components/TranscriptionComponent/TranscriptionComponent";
import VideoComponent from "../components/VideoComponent/VideoComponent";
import StatusMessageComponent from "../components/StatusMessageComponent/StatusMessageComponent";
import EditingLoadingComponent from "../../../LoadingComponent.js/EditingLoadingComponent";
import socket from "../../../../websocket/socket";
import getInitialInfo from "./module/getInitialInfo";
import { useEffect, useState } from "react";
import { setIsThereUploadedVideo } from "../../../../redux/EditingAction";
import { useDispatch } from "react-redux";

function EditingLayout () {
    const dispatch = useDispatch();
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    const [editingData, setEditingData] = useState(null);
    socket.on("message", (data) => {
        console.log(data);
    })
    const onResponse = (state, data) => {
        console.log(data);
        setEditingData(data);
        dispatch(setIsThereUploadedVideo(state));
    }
    useEffect(()=> {
        getInitialInfo(onResponse)
    }, [])
    return (
        <div className="main-editing-page-container">
            <StatusMessageComponent/>
            <EditingLoadingComponent/>
            <div className="project-preview-header">
                <LogoDropDownMenuComponent/>
                <div className="project-name-editpage">
                    
                    <span className="project-name-display">{projectDetail.projectName} in the middle of the night</span>
                    <div className="editing-menu-button-container">
                        <AudioComponent/>
                        <TextComponent/>
                        <div className="editing-menu-button">Undo</div>
                        <div className="editing-menu-button">Redo</div>
                    </div>
                </div>
                <ProfileComponent />
            </div>
            <div className="video-transcription-main-container">
                <div className="transcription-main-container">
                    <TranscriptionComponent data={editingData}/>
                </div>
                <div className="video-display-main-container">
                    <VideoComponent/>
                </div>
            </div>
        </div>
    )
}

export default EditingLayout;