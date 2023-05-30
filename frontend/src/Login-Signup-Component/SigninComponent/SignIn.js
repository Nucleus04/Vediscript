import { useEffect, useState } from "react";
import { submitData } from "./module/signin-module";

function SignIn ({onLoadingChange, onErrorChange}) {
    const [formData, setformData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleInputChange = (e) => {
        setformData ({...formData, [e.target.name] : e.target.value});
    }
    useEffect(() => {
        onLoadingChange(isLoading);
    },[isLoading]);

    const onResponse = () => {
        setIsLoading(false);
    }

    const onErrorResponse = () => {
        setIsError(true);
    }
    const handleSubmit = async(event) => {
        event.preventDefault();
        setIsLoading(true);
        setIsError(false);
        submitData(formData, onResponse, onErrorResponse);
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <div className={`warning red ${isError? ``: `display-none`}`}>
                    <p>Your email or password is incorrect.</p>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input 
                className="input-field" 
                type="text" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input 
                className="input-field" 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                />
            </div>

            <div className="button-container">
                <button className="submit-button" type="submit">Login</button>
            </div>
        </form>
    );
}

export default SignIn;