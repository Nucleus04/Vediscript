import "../styles/signup-signin-style.css";
import { useState, useEffect } from "react";
import validateInputData from "./module/sanitizeData-module";
import submitSignupData from "./module/submit-module";


function SignUp () {
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

    const [confirmpassword, setconfirmpassword] = useState("");
   
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

    const handleSubmit = async(event) => {
        event.preventDefault();
        submitSignupData(formData);
    }
      
    return (
        
        <form method="post" onSubmit={handleSubmit}>
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