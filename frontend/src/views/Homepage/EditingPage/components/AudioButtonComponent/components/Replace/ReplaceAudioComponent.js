import { useState } from "react";
import "./style.css";
import { useDispatch } from "react-redux";
import { setIsReplacingAudio, setIsThereCurrentOperation } from "../../../../../../../redux/OperationAction";
import constants from "../../../../../../../constant/constant";

function ReplaceAudioComponent () {
    const dispatch = useDispatch();
    const [showReplaceMenu, setShowReplaceMenu] = useState(false);
    const constant = constants();
    const handleMouseEnter =  () => {
        setShowReplaceMenu(true);
    }
    const handleMouseLeave = () => {
        setShowReplaceMenu(false);
    }
    const handleRecordClick = () => {
        console.log("Replacing Audio...");
        dispatch(setIsReplacingAudio(true));
        dispatch(setIsThereCurrentOperation({state: true, operation: constant.operation.replace_audio}));
        setShowReplaceMenu(false);
    }
    return (
        <div className="replace-button">
            <div className={`replace-button-menu ${showReplaceMenu? "" : "display-none"}`} onMouseEnter={handleMouseEnter} >
                <div className="replace-button-menu-modal">
                    <button className="audio-child-button display-block" onClick={handleRecordClick}>Record</button>
                    <button className="audio-child-button display-block">Local</button>
                </div>
            </div>
            <button className="audio-child-button red" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Replace</button>
        </div>
    )
}
export default ReplaceAudioComponent;