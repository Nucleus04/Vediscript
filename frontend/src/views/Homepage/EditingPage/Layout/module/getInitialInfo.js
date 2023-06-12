

const getInitialInfo = async() => {

    const token = localStorage.getItem("authToken");
    const projectDetail = JSON.parse(localStorage.getItem("project-details"));

    try {
        const response = await fetch("http://localhost:5000/get-initial-info", {
            method: "POST",
            headers:{
                "Content-Type" : "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(projectDetail),
        })
        if(response.ok) {
            
            console.log(await response.json());
        } else {
            console.log("There something wrong");
        }
    } catch (error) {
        console.log("error", error);
    }
    
}

export default getInitialInfo;