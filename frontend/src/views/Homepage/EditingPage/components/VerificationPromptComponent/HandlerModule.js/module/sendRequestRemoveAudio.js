import socket from "../../../../../../../websocket/socket";

const RequestToRemoveAudio = async(start, end, history, callback) => {
    const token = localStorage.getItem("authToken");
    const socketId  = socket.id;
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    console.log(history);
    let historyIndex = history.currentHistoryIndex;
    let numberOfChanges = history.history.length;
    console.log("History index and no changes",historyIndex, numberOfChanges);
    let data = {
        start: start,
        end: end,
        socketId: socketId,
        historyIndex: historyIndex,
    }
   try {
    const response = await fetch(`http://localhost:5000/remove-audio/${projectDetail._id}/${numberOfChanges}`, {
        method: "POST",
        headers:{
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        console.log("Request Successful");
        const script = await response.json();
        callback(true, script);
    } else {
        console.log("There somthing wrong");
        callback(false);
    }
   } catch (error) {
        callback(false)
    console.log("There has been an error", error);
   }
}


export default RequestToRemoveAudio;