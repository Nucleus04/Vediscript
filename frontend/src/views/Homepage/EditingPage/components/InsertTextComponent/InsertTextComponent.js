import "./style.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetOperation } from "../../../../../redux/OperationAction";
import submitInsertTextRequest from "./module/submitInsertTextRequest";
import { setIsThereError } from "../../../../../redux/EditingAction";
import { addReplaceAudioHistory } from "../../../../../redux/HistoryTrackerAction";
import socket from "../../../../../websocket/socket";
import { setLoading, setLoadingStatus } from "../../../../../redux/EditingAction";

function InsertText () {
    const [formData, setFormData] = useState("");
    const dispatch = useDispatch();
    const [showInsertTextModal, setShowInsertTextModal] = useState(false)
    const globalOperationState = useSelector((state) => state.operation);
    const history = useSelector((state) => state.history);
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
    const handleInputChange = (event) => {
        setFormData( event.target.value)
    }

    useEffect(() => {
        if(globalOperationState.isInserting.state){
            setShowInsertTextModal(true);
        }
    }, [globalOperationState.isInserting])

    const onResponse = (state, script) =>{
        if(state){
            dispatch(addReplaceAudioHistory(script.script))
            const error = {
                state: true,
                status: "success",
                message: "Inserted text successfully!"
            }
            dispatch(setIsThereError(error));
        } else {
            const error = {
                state: true,
                status: "fail",
                message: "Text insertion failed!"
            }
            dispatch(setIsThereError(error));
        }
        dispatch(resetOperation());
        setShowInsertTextModal(false);
        setFormData("");
        console.log("Updated Script",script);
    }

    const handleSubmission = () => {
        const endTime = globalOperationState.isInserting.endTime;
        const projectDetail = JSON.parse(localStorage.getItem('project-details'))
        const data = {
            projectId: projectDetail._id,
            historyIndex: history.currentHistoryIndex,
            numberOfChanges: history.history.length,
            endTime: endTime,
            text: formData,
            socket: socket.id,
        }
        submitInsertTextRequest(data, onResponse);
    }

    const handleCancel = () => {
        dispatch(resetOperation());
        setShowInsertTextModal(false);
        setFormData("");
    }
    return (
        <div className={`insert-text-main-container ${showInsertTextModal? "" : "display-none"}`}>
            <div className="insert-text-input-container">
                <div className="insert-text-contain-center">
                    <textarea id="insert-text" name="textinput" value={formData} className="insert-text-textarea" onChange={handleInputChange}></textarea>
                    <div className="insert-text-button-container">
                        <button className="insert-text-button" onClick={handleSubmission}>Insert</button>
                        <button className="insert-text-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InsertText;