import "./style.css";
import { useState } from "react";
import { setIsHighlighting, setIsThereCurrentOperation } from "../../../../../../../redux/OperationAction";
import { useDispatch } from "react-redux";
import constants from "../../../../../../../constant/constant";
import { useSelector } from "react-redux";
import socket from "../../../../../../../websocket/socket";

function HighlightTextComponent () {
    const constant = constants();
    const dispatch = useDispatch();
    const [showColors, setShowColors] = useState(false);
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    const history = useSelector((state) => state.history);
    const socketId = socket.id;

    const handleChosenColor = async(color) => {
        console.log(color)
        dispatch(setIsHighlighting({color: color, state: true}))
        dispatch(setIsThereCurrentOperation({state: true, operation: constant.operation.highligting}))
        try {
            const response = await fetch(`http://localhost:5000/unlink-video/${projectDetail._id}/${history.currentHistoryIndex}`);
            if(response.ok) {
                console.log("Unlink video Successfully")
                //await fetch(`http://localhost:5000/video-display/${projectDetail._id}/${socketId}/${history.currentHistoryIndex}/${history.history.length}`)
            } else {
                console.log("Error in unlinking a video");
            }
        } catch (error) {
            console.log("There is an error in unlink video request", error);
        }
    }
    return (
        <div className="text-edit-button highlight-button" onMouseEnter={() => {setShowColors(true)}} onMouseLeave={() => {setShowColors(false)}}>
            <div className="highlight-button-label">
                Highlight
            </div>
            <div className={`color-picker-container ${showColors? "" : "display-none"}`} onMouseLeave={() => {setShowColors(false)}}>
                <div className="color redd" onClick={() => {handleChosenColor("red-highlight")}}>

                </div>
                <div className="color bluee" onClick={() => {handleChosenColor("blue-highlight")}}>

                </div>
                <div className="color yelloww" onClick={() => {handleChosenColor("yellow-highlight")}}>

                </div>
            </div>
            
        </div>
    )
}
export default HighlightTextComponent;