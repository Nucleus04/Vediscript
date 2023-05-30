import "./styles/authentication-style.css";
import SignUp from "./SignupComponent/SignUp";
import SignIn from "./SigninComponent/SignIn";
import { useState } from "react";

function AuthenticationPage () {
    const [ isLogin, setisLogin ] = useState(false);

    const loginChecker = () => {
        isLogin? setisLogin(false) : setisLogin(true);
    }

    return (
        <div className="authentication-page">
            <div className="signup-container">
                <div className="margin-inside">
                <h2 className="text-center">{isLogin? "Login" : "Sign Up"} </h2>
            
                {isLogin? <SignIn/> : <SignUp/>}
                <p className="text-center">{isLogin? "Do not have an account? " : "Already have an account? "} 
                    <button 
                    className="eliminate-button-style" 
                    onClick={loginChecker} 
                    type="button"
                    >{isLogin? "Sign Up" : "Login" }</button></p>
                </div>
            </div>
        </div>
    );
}
export default AuthenticationPage;