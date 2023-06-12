
import "./style.css";
function VideoComponent () {
   
    const projectDetails = JSON.parse(localStorage.getItem("project-details"));
    return(
        <div className="video-main-container">
            <video id="videoPlayer" className="video-controller-and-video-container"src={`http://localhost:5000/video-display/${projectDetails._id}`} type="video/mp4" controls>
                <div className="video-controller-container">
                    video controller container
                </div>
            </video>
        </div>
    )
}

export default VideoComponent;