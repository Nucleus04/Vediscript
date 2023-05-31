export const submitData = async(formData, onResponse, onError, onLogin) => {
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
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.userData));
            console.log("I successfully wirte token", localStorage.getItem("authToken"));
            onLogin();
        } else {
            onError();
        }
    } catch (error) {
        console.log("Login Error: ", error);
    } finally {
        onResponse();
    }
}
