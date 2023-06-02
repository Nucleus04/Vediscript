
export const retrieveProject =  async()  => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const id = JSON.stringify({id: userData._id});
    try {
        const response = await fetch ("http://localhost:5000/retrieve-projects", {
            method : "POST",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: id,
        });

        if(response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.log("There is something wrong");
        }
    } catch (error) {
        console.log(error);
    }
}