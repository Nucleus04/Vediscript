import "./style.css";

function VideoComponent () {
    return(
        <div className="video-main-container">
            <div className="video-controller-and-video-container">
                <video src="http://localhost:5000/video-display" className="video-container">
                
                </video>
                <div className="video-controller-container">
                    video controller container
                </div>
            </div>
        </div>
    )
}

export default VideoComponent;