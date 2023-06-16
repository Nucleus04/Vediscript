

const RequestToRemoveAudio = async(start, end) => {
    const token = localStorage.getItem("authToken");
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));
    let data = {
        start: start,
        end: end,
    }
   try {
    const response = await fetch(`http://localhost:5000/remove-audio/${projectDetail._id}`, {
        method: "POST",
        headers:{
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    if (response.ok) {
        console.log("Request Successful");
    } else {
        console.log("There somthing wrong")
    }
   } catch (error) {
    console.log("There has been an error", error);
   }
}


export default RequestToRemoveAudio;