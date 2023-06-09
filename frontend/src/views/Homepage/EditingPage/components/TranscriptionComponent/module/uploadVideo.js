import socket from "../../../../../../websocket/socket";
const UploadVideo = async(file, onErrorResponse, onLoading, onSuccessResponse) => {
    let socketId = socket.id;
    const formdata = new FormData();
    formdata.append("video", file);
    formdata.append("socketId", socketId)
    const token = localStorage.getItem("authToken");
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    formdata.append("projectId", projectDetail._id);
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
            onSuccessResponse();
        } else {
            const result = await response.json();
            console.log("Theres a problem on uploading the file", result);
            onErrorResponse(result.message);
        }
    } catch (error) {
        console.log(error);
    } finally{
        onLoading(false);
    }


}
export default UploadVideo;