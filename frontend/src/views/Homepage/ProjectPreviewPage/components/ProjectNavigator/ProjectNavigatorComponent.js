import { useState, useEffect, useRef } from "react";
import "./style.css";
function ProjectNavigatorComponent ({ project }) {
  
    const menuRef = useRef(null);

    const [ showMenuButton, setShowMenuButton ] =useState (false);

    const handleMenuClick = () => {
        setShowMenuButton(!showMenuButton);
    }
    
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenuButton(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="project-container">
            <div className="project-button" >
                <img className="menu-button-projects" onClick={handleMenuClick} src="more.png" alt="menu" width={25} height={25}/>
                <div className={`more-menu-project ${showMenuButton? "" : "display-none"}`} ref={menuRef}>
                    <button className="menu-button submit-color">Edit</button>
                    <button className="menu-button cancel-color">Delete</button>
                </div>
                <p className="project-description-display">Description: {project.projectDescription}</p>
            </div>
            <p className="project-label">{project.projectName}</p>
        </div>
    );
}

export default ProjectNavigatorComponent;