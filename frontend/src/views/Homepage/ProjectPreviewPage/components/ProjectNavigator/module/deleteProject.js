
export const DeleteProject = async(projectId, onResponse) => {
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
            onResponse();
        }
        else {
            console.log("There is something wrong...");
            onResponse();
        }
    } catch (error) {
        console.log("There Has been an error", error);
    }
}