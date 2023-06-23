import socket from "../../../../../../websocket/socket";

const getInitialInfo = async(callback, historyIndex) => {
    console.log(historyIndex);
    const token = localStorage.getItem("authToken");
    const socketId = socket.id;
    
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    const data = {
        socketId: socketId,
        projectDetails: projectDetail,
        historyIndex: historyIndex,
    }
    try {
        const response = await fetch("http://localhost:5000/get-initial-info", {
            method: "POST",
            headers:{
                "Content-Type" : "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
        if(response.ok) {
            console.log("There is video");

            callback(true);

        } else {
            callback(false);
            console.log("There something wrong");
        }
    } catch (error) {
        console.log("error", error);
    }
    
}

export default getInitialInfo;