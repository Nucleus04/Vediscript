
const submitInsertTextRequest = async(data, cb) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/insert-text", {
            method: "POST",
            headers:{
                "Content-Type" : "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if(response.ok) {
            console.log("Insert request send successfully");
            const data = await response.json();
            cb(true, data);
        } else {
            console.log("Insert text request unsuccessful")
            cb(false, "");
        }

    } catch (error) {
        console.log("Error");
    }
}



export default submitInsertTextRequest;