
export const DeleteProject = async(projectId) => {
    const data = {
        projectId: projectId,
    }
    const authToken = localStorage.getItem("authToken");
    try {
        const response = await fetch("http://localhost:5000/delete-project", {
            method : "POST",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        });

        if(response.ok) {
            console.log("Success!");
        }
        else {
            console.log("There is something wrong...");
        }
    } catch (error) {
        console.log("There Has been an error", error);
    }
}