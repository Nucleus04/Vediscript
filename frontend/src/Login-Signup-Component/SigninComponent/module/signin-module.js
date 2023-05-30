export const submitData = async(formData, onResponse, onError) => {
    try {
        const response = await fetch ("http://localhost:5000/signin", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData),
        });

        if(response.ok) {
            const data = await response.json();
        } else {
            onError();
        }
    } catch (error) {
        console.log("Login Error: ", error);
    } finally {
        onResponse();
    }
}
