const getTranscription = async(callback) => {
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    try {
        const response = await fetch(`http://localhost:5000/get-transcription/${projectDetail._id}`);
        if(response.ok) {
            const data = await response.json();
            callback(data);
        } else {
            console.log("Error");
        }
    } catch (error) {
        
    }
}

export default getTranscription;