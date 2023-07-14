import socket from "../../../../../../websocket/socket";


const submitAudio = async(audio, start, end, historyIndex, callback, history) => {
    console.log("I will now submit the audio");
    const socketId = socket.id;
    const formdata = new FormData();
    const token = localStorage.getItem("authToken");
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    formdata.append("record", audio[0]);
    const time = {
        start: start,
        end: end,
    }
    formdata.append("time",JSON.stringify(time));
    formdata.append("projectDetails",JSON.stringify(projectDetail));
    formdata.append("socket", socketId);
    formdata.append("historyIndex", historyIndex);
    formdata.append("numberOfChanges", history.history.length)

    try{
        const response = await fetch("http://localhost:5000/replace-audio", {
            method: "POST",
            headers:{
                Authorization: `Bearer ${token}`,
            },
            body: formdata,

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


export default submitAudio