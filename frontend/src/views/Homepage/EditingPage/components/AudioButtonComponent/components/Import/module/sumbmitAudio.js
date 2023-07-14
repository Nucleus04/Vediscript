import socket from "../../../../../../../../websocket/socket";

const submitAudio = async(file, onResponse) => {
    console.log(file);
    const socketId = socket.id;
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    console.log(projectDetail);
    const formData = new FormData();
    const token = localStorage.getItem("authToken");

    formData.append("audio", file);
    formData.append("socketId", socketId);
    formData.append("projectId", projectDetail._id);


    if(file.type === "audio/mpeg") {
        try {
            console.log(formData);
            const response = await fetch("http://localhost:5000/import-audio", {
                method: "POST",
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if(response.ok) {
                onResponse(true);
            } else {
                onResponse(false);
            }
        } catch (error) {
            onResponse(false);
        }
    } else {
        onResponse(false)
    }
}

export default submitAudio;