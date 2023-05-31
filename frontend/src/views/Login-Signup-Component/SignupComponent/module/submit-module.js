const submitSignupData = async(formData, onResponse, onResponseStatus) => {
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
            onResponseStatus("success");
        }
        else {
            console.log("Fail to connect to api");
            onResponseStatus("failed");
        }
    } catch (error) {
        console.log("Error: ", error);
        onResponseStatus("failed");
    } finally {
        onResponse();
    }
}
export default submitSignupData;