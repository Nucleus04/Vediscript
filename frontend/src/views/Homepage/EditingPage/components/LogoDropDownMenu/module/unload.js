const unload = async(operation, socketId) => {
    try {
        const history = JSON.parse(localStorage.getItem("history"));
        const projectDetail = JSON.parse(localStorage.getItem("project-details"));
        let socket = "";
        if(socketId){
            socket = socketId;
        }
        const body = {
            history: history,
            projectDetail: projectDetail,
            operation: operation,
            socketId: socket
        }
        const response = await fetch("http://localhost:5000/unload", {
        method: "POST",
        headers:{
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(body),
        })
        if(operation !== "SAVE"){
            localStorage.removeItem("history");
        }
        if(operation === "DOWNLOAD") {
            if(response.ok){
                // const contentDispositionHeader = response.headers.get('Content-Disposition');
                // console.log(contentDispositionHeader);
                // const filename = contentDispositionHeader.split('filename=')[1];

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = "example.mp4";
                link.click();
                URL.revokeObjectURL(url);
            } else {
                console.log("Downlaoding failed");
            }
        }
    } catch (error) {
        console.log(error);
    }
}


export default unload;