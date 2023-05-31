import "../styles/signup-signin-style.css";
import { useState, useEffect } from "react";
import validateInputData from "./module/sanitizeData-module";
import submitSignupData from "./module/submit-module";


function SignUp ({onLoadingChange}) {
    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
        
    });
    const [isLoading, setIsLoading] = useState(false);
    const [confirmpassword, setconfirmpassword] = useState("");
    const [isThereResponse, setIsThereResponse] = useState(false);
    const [isResponseOk, setIsResponseOk] = useState(true);
   const [isError, setIsError] = useState(true);

    useEffect(() => {
        onLoadingChange(isLoading);
    },[isLoading]);

    useEffect (() => {
        const errors = validateInputData(formData, confirmpassword);
        setErrors(errors);
    }, [formData.name, formData.email, formData.password, confirmpassword]);

    const handleInputChange = (e) => {
        if(e.target.name == "confirmpassword"){
            setconfirmpassword(e.target.value);
        }
        else{
            setformData ({...formData, [e.target.name] : e.target.value});
        }
    }
    const onResponse = () => {
        setIsLoading(false);
    }
    const onResponseStatus = (status) => {
        setIsThereResponse(true);
        if (status === "failed") {
            setIsResponseOk(false);
        } else {
            setIsResponseOk(true);
        }

    }

    const handleSubmit = async(event) => {

        event.preventDefault();
        setIsThereResponse(false);
        setIsResponseOk(true);
        setIsLoading(true);
        submitSignupData(formData, onResponse, onResponseStatus);
    }
      
    return (
        
        <form method="post" onSubmit={handleSubmit}>
            <div className={`warning ${isThereResponse && !isResponseOk? `red`: `display-none`}`}>
                    <p>Something went wrong</p>
            </div>
            <div className={`warning ${isThereResponse && isResponseOk? `green`: `display-none`}`}>
                    <p>Account successfully created</p>
            </div>
            <div className="form-group">
                <label htmlFor="name">Name: <span className="text-red">{errors.name? "Please enter a valid name." : ""}</span></label>
                <input 
                className="input-field" 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                required
                onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email: <span className="text-red">{errors.email? "Please enter a valid email." : ""}</span></label>
                <input 
                className="input-field" 
                type="text" 
                id="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password: <span className="text-red">{errors.password? errors.password : ""}</span></label>
                <p className="small-letters">Note: It should contain 1 Uppercase, 1 lowercase, 1 number and 8 characters long.</p>
                <input 
                className="input-field" 
                type="password" 
                id="password" 
                required
                value={formData.password}
                name="password"
                onChange={handleInputChange}
                />
                
            </div>
            <div className="form-group">
                <label htmlFor="confirmpassword">Confirm Password: <span className="text-red">{errors.confirmpassword? errors.confirmpassword : ""}</span></label>
                <input 
                className="input-field" 
                type="password" 
                id="confirmpassword" 
                value={confirmpassword}
                name="confirmpassword"
                required
                
                onChange={handleInputChange}
                />
            </div>

            <div className="button-container">
                <button className="submit-button" disabled={Object.values(errors).some((error) => error !== '')} type="submit">Sign Up</button>
            </div>
        </form>
    );
}

export default SignUp;