
export const SubmitEditedDetails = async(formData, projectId, onRetrieve) => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const data = {
        userId: userData._id,
        projectId: projectId,
        projectData: formData,
    }
    try {
        const response = await fetch("http://localhost:5000/edit-project", {
            method : "POST",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        });

        if(response.ok) {
            onRetrieve();
        }
        else {
            console.log("There is something wrong...");
        }
    } catch (error) {
        console.log("There Has been an error", error);
    }
}