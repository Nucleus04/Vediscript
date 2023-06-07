import "./style.css";
import { useRef, useState } from "react";
import UploadVideo from "./module/uploadVideo";

function TranscriptionComponent () {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const handleUploadClick = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = (event) => {
        const selectedfile = event.target.files[0];
        setFile(selectedfile);
        UploadVideo(selectedfile);
    }
    return (
        <div className="transcription-container">
            <div className="transcription-container-inside">
                <input type="file" ref ={fileInputRef} onChange={handleFileChange} style={{ display:"none"}}/>
                <button className="uplaod-button" onClick={handleUploadClick}>Upload</button>
            </div>
        </div>
    )
}


export default TranscriptionComponent;