import socket from "../../../../../../websocket/socket";


const submitAudio = async(filename, start, end, historyIndex, callback, history) => {
    console.log("I will now submit the audio");
    const socketId = socket.id;
    const token = localStorage.getItem("authToken");
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    const time = {
        start: start,
        end: end,
    }
    const formdata = {
        filename: filename,
        time: JSON.stringify(time),
        projectDetails: JSON.stringify(projectDetail),
        socket: socketId,
        historyIndex: historyIndex,
        numberOfChanges: history.history.length,
    }
    console.log(formdata);
    try{
        const response = await fetch("http://localhost:5000/replace-audio-local", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formdata),

        });
        if(response.ok){
            const data = await response.json();
            console.log("Request for replacing audio successfully sent", data);
            callback(true, data)
        } else{
            console.log("The is error sending the replacing audio content")
            callback(false, "None")
        }
    } catch(error){
        console.log("Error", error);
    }


}

export default submitAudio;