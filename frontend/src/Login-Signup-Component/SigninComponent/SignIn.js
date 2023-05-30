import { useState } from "react";
import { submitData } from "./module/signin-module";

function SignIn () {
    const [formData, setformData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setformData ({...formData, [e.target.name] : e.target.value});
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        submitData(formData);
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
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