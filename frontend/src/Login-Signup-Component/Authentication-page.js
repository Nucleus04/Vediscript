import "./styles/authentication-style.css";
import SignUp from "./SignupComponent/SignUp";
import SignIn from "./SigninComponent/SignIn";
import LoadingComponent from "../LoadingComponent.js/LoadingComponent";
import { useState } from "react";

function AuthenticationPage () {
    const [isLoading, setIsLoading] = useState(true);
    const [ isLogin, setisLogin ] = useState(false);

    const loginChecker = () => {
        isLogin? setisLogin(false) : setisLogin(true);
    }
    const handleLoadingChange = (isLoading) => {
        setIsLoading(isLoading);
    }

    return (
        <div className={`authentication-page `} >
            {isLoading?<LoadingComponent/> : ""}
                <div className={`signup-container `}>
                <div className="margin-inside">
                <h2 className="text-center">{isLogin? "Login" : "Sign Up"} </h2>
                
                {isLogin? <SignIn onLoadingChange = {handleLoadingChange}/> : <SignUp onLoadingChange = {handleLoadingChange}/>}
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