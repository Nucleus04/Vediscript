export const submitCreateProjectData = async(formData, onRetrieve) => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const data = {
        id: userData._id,
        projectData: formData,
    }
    try {
        const response = await fetch("http://localhost:5000/create-project", {
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