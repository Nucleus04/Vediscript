import "./style.css";
import EditTextComponent from "./components/EditTextComponent";
import HighlightTextComponent from "./components/HighlightTextComponent";
import { useState } from "react";

function TextComponent () {
    const [showTextModal , setShowTextModal] = useState(false);
    const handleHoverEnter = () => {
        setShowTextModal(true);
    }
    const handleHoverLeave = () => {
        setShowTextModal(false);
    }
    return (
        <div className={`editing-menu-button`} onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
            <div className="relative">
                <p>Text</p>
                <div className={`absolute text-modal ${showTextModal? "" : "display-none"}`}>
                    <div className="text-modal-button-container">
                        <EditTextComponent/>
                        <HighlightTextComponent/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TextComponent;