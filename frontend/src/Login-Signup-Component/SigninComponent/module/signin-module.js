export const submitData = async(formData) => {
    try {
        const response = await fetch ("http://localhost:5000/signin", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData),
        });

        if(response.ok) {
            console.log("Yes I connect to the back end");
        } else {
            console.log("Something went wrong");
        }
    } catch (error) {
        console.log("Login Error: ", error);
    }
}
