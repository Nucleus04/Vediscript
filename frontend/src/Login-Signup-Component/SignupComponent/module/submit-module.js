const submitSignupData = async(formData) => {
    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                'Content-Type' : "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log("Successful api fetching", response);
        }
        else {
            console.log("Fail to connect to api");
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}
export default submitSignupData;