import { useEffect, useRef, useState } from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setLoadingStatus, setCurrentVideoTimestamp, setIsNavigatingTroughScript } from "../../../../../redux/EditingAction";
import socket from "../../../../../websocket/socket";
import LoadingComponent from "../../../../LoadingComponent.js/LoadingComponent";

function VideoComponent () {
   
    const globalState = useSelector((state) => state.edit);
    const [videoURL, setVideoURL] = useState("");
    const [currentTimeStamp, setCurrentTime] = useState(0);
    const [videoLoading, setVideoLoading] = useState(true);
    const socketId = socket.id;
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const projectDetails = JSON.parse(localStorage.getItem("project-details"));
    const history = useSelector((state) => state.history);

    useEffect(() => {
        if (globalState.isThereUploadedVideo === true) {
            setVideoLoading(true);
            setVideoURL(`http://localhost:5000/video-display/${projectDetails._id}/${socketId}/${history.currentHistoryIndex}`);
        } else {
            setVideoLoading(false);
            setVideoURL("");
        }
    }, [globalState.isThereUploadedVideo, history.currentHistoryIndex]);

    const videoElement = videoRef.current;
    
    useEffect(() => {
        if(videoElement) {
            const timeTracker = () => {
                setCurrentTime(videoElement.currentTime);
                if(!globalState.isNavigatingThroughScript ){
                    dispatch(setCurrentVideoTimestamp(currentTimeStamp));

                } else {
                    dispatch(setIsNavigatingTroughScript(false));
                }
            }
            videoElement.addEventListener("timeupdate", timeTracker);
            videoElement.addEventListener("canplay", () => {
                setVideoLoading(false);
            })
            videoElement.addEventListener('waiting', function() {
                setVideoLoading(true);
              });
            return () => {
                videoElement.removeEventListener("timeupdate", timeTracker);
            }
        }
    })

    
    useEffect(() => {
        const videoElement = videoRef.current;
        if(globalState.currentPlayback !== 0) {
            const setTime  = () => {
                if(videoElement) {
                    videoElement.currentTime = globalState.currentPlayback;
                    videoElement.muted = false;
                    if(!videoElement.paused)
                        videoElement.play();
                }
            } 
            setTime();
        }
        
    }, [globalState.currentPlayback])

    return(
        <div className="video-main-container">
            {videoLoading? (<LoadingComponent/>) : ""}
            <video id="videoPlayer" className="video-controller-and-video-container" ref={videoRef} src={videoURL? videoURL : ""} type="video/webm" controls duration = {"30.000181"} autoPlay>
                <div className="video-controller-container">
                    video controller container
                </div>
            </video>
        </div>
    )
}

export default VideoComponent;