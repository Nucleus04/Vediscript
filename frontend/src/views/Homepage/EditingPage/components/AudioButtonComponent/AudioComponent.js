import "./style.css";
import ImportAudioComponent from "./components/ImportAudioComponent";
import ReplaceAudioComponent from "./components/Replace/ReplaceAudioComponent";
import RemoveAudioComponent from "./components/RemoveAudioComponent";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AudioComponent () {
    const globalOperationState = useSelector((state) => state.operation);
    const [showAudioModal, setShowAudioModal] = useState(false);
    useEffect(() => {
        if(globalOperationState.isRemovingAudio){
            setShowAudioModal(false);
        }
    },[globalOperationState])
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