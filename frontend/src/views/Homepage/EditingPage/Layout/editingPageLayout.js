import "./style.css";
import ProfileComponent from "../../CommonComponents/ProfileComponent/ProfileComponent";
import LogoDropDownMenuComponent from "../components/LogoDropDownMenu/LogoDropDownMenu";
import AudioComponent from "../components/AudioButtonComponent/AudioComponent";
import TextComponent from "../components/TextButtonComponent/TextComponent";
import TranscriptionComponent from "../components/TranscriptionComponent/TranscriptionComponent";
import VideoComponent from "../components/VideoComponent/VideoComponent";

function EditingLayout () {
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    return (
        <div className="main-editing-page-container max-width-editing-container">
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