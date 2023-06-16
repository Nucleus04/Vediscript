import "./style.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { resetEditingGlobalState } from "../../../../../redux/EditingAction";
import { resetState } from "../../../../../redux/action";
import { useDispatch } from "react-redux";

function LogoDropDownMenuComponent () {
    const [showDropDown, setShowDropDown] = useState(false);
    const [showFileDropdown, setShowFileDropDown] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDropDownMenu = () => {
        setShowDropDown(!showDropDown);
        setShowFileDropDown(false);
    }

    const handleHoverEnter = () => {
        setShowFileDropDown(true);
    }
    const handleHoverLeave = () => {
        setShowFileDropDown(false);
    }
    const handleBeckToProject = () => {
        dispatch(resetEditingGlobalState());
        dispatch(resetState());
        navigate("/project-preview");
    }

    return (
       <div className="logo-menu-container">
            <div className="logo-dropdown" onClick={handleDropDownMenu}>
                <img className="edit-logo-container" src="/Vediscript-logo.png" width={40} height={40} alt="Logo"/>
                <img className="dropdown-icon-logo" src="/dropdown.png" width={12} height={20}/>
            </div>
            <div className={`logo-dropdown-modal ${showDropDown? "": "display-none"}`} ref={menuRef}>
                <div className="logo-dropdown-button-container">
                    <div className="logo-dropdown-button-center">
                        <button className="back-to-project" onClick={handleBeckToProject}>Back to Projects...</button>
                        <button className="file-menu-button" onMouseEnter={handleHoverEnter}>File</button>
                        <div className={`file-menu-button-dropdown-container  ${showFileDropdown? "": `display-none`}`} onMouseLeave={handleHoverLeave}>
                            <div className="logo-dropdown-button-center">
                                <button className="save-button">Save</button>
                                <button className="download-button">Download</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    )
}


export default LogoDropDownMenuComponent;