import { useRef, useState, useEffect } from "react";
import submitAudio from "./module/sumbmitAudio";
import { useDispatch } from "react-redux";
import { setIsThereError } from "../../../../../../../redux/EditingAction";

function ImportAudioComponent () {
    const fileRef = useRef(null);
    const dispatch = useDispatch();
    const handleChoosefile = () => {
            fileRef.current.value = null;
            fileRef.current.click();
    }
    const onResponse = (status) => {
        if(status){
            const error = {
                state: true,
                status: "success",
                message: "Imported audio successfully!"
            }
            dispatch(setIsThereError(error));
            
        } else{
            const error = {
                state: true,
                status: "fail",
                message: "Importing audio fail",
            }
            dispatch(setIsThereError(error));
        }
    }
    const handleInputChange = (event) => {
        event.preventDefault();
        let selectedfile = event.target.files[0];
        submitAudio(selectedfile, onResponse);
    }
    return (
        <div>
            <input type="file" ref ={fileRef} onChange={handleInputChange} style={{ display:"none"}}/>
            <button className="audio-child-button" onClick={handleChoosefile}>Import</button>
        </div>
    );
}
export default ImportAudioComponent;