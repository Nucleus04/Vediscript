import "./style.css";
import ImportAudioComponent from "./components/ImportAudioComponent";
import ReplaceAudioComponent from "./components/ReplaceAudioComponent";
import RemoveAudioComponent from "./components/RemoveAudioComponent";
import { useState } from "react";

function AudioComponent () {

    const [showAudioModal, setShowAudioModal] = useState(false);
    const handleHoverEnter = () => {
        setShowAudioModal(true);
    }
    const handleHoverLeave = () => {
        setShowAudioModal(false);
    }

    return (
        <div className="editing-menu-button audio-button-relativity" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
            <div className="audio-button">
                <p>Audio</p>
                <div className={`audio-modal ${showAudioModal? "": "display-none"}`} onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
                    <div className="audio-modal-button-container">
                        <ImportAudioComponent/>
                        <ReplaceAudioComponent/>
                        <RemoveAudioComponent/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AudioComponent;