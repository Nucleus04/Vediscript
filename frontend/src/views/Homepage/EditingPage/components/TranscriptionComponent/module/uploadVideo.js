import socket from "../../../../../../websocket/socket";
const UploadVideo = async(file, onErrorResponse, onLoading, onSuccessResponse) => {
    const formdata = new FormData();
   
    let socketId = socket.id;
    formdata.append("video", file);
    formdata.append("socketId", socketId)
    const token = localStorage.getItem("authToken");
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    formdata.append("projectId", projectDetail._id);
  
    if(file.type === "video/mp4") {
        try {
            onLoading(true);
            const response  = await fetch("http://localhost:5000/upload-video", {
                method: "POST",
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                body: formdata,
            })
            if (response.ok) {
                const result = await response.json();
                onSuccessResponse(result.message);
                return;
            } else {
                const result = await response.json();
                onErrorResponse(result.message);
                return;
            }
        } catch (error) {
            console.log(error);
        } finally{
            onLoading(false);
        }
    
    } else {
        onErrorResponse("Only video files are accepted!");
    }

}
export default UploadVideo;