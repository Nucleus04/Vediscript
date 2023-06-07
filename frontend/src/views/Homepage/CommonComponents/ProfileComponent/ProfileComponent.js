import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile-style.css";
function ProfileComponent () {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userData"));
    const firstLetter = user.name.charAt(0).toUpperCase();

    const [isProfileShowing, setIsProfileShowing] = useState(false);
    const showProfileModal = () => {
        setIsProfileShowing(!isProfileShowing);
    }

    const logout = () => {
        localStorage.clear();
        navigate("/authentication");
    }

    return (
        <div className="profile-component">
            <button onClick = {showProfileModal} className="profile">
                <p>{firstLetter}</p>
            </button>

            <div className={`profile-modal ${isProfileShowing? "": "display-none"}`}>
                <div className="userinfo-container">
                    <p className="account-name">{user.name}</p>
                    <p className="account-email">{user.email}</p>
                    
                </div>
                <div className="logout-button-container">
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileComponent;