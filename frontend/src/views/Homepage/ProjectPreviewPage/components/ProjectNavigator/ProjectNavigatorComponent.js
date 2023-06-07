import { useState, useEffect, useRef } from "react";
import "./style.css";
import { useDispatch } from "react-redux";
import { setISEditingProjectDetail, setRetrieveProjectList } from "../../../../../redux/action";
import { DeleteProject } from "./module/deleteProject";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function ProjectNavigatorComponent ({ project }) {
  
    const menuRef = useRef(null);
    const dispatch = useDispatch();
    const [ showMenuButton, setShowMenuButton ] =useState (false);
    const globalProjectState = useSelector((state) => state.projects);
    const navigate = useNavigate();

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

    const handleEditButton = () => {
        const editingData = {
            state: true,
            projectDetail: {
                projectId: project._id,
                projectName: project.projectName,
                projectDescription: project.projectDescription,
            }
        }
        dispatch(setISEditingProjectDetail(editingData));
    }
    const handleDeleteButton = () => {
        DeleteProject(project._id);
        setShowMenuButton(false);
        dispatch(setRetrieveProjectList(!globalProjectState.isRetrieveNeed));
    }
    const handleProjectSelect = () => {
        localStorage.setItem("project-details", JSON.stringify(project));
        navigate(`/editing-page/${project._id}`);
    }
    const handleSelectAppropriateButton = (event) => {
        if(event.target.classList.contains("project-button") || event.target.classList.contains("bookmark-menu") || event.target.classList.contains("bookmark-design")) {
            handleProjectSelect();
        } else if(event.target.classList.contains("more-menu-projects")) {
            handleEditButton();
        }
           
    }
    return (
        <div className="project-container">
            <div className="project-button" onClick={handleSelectAppropriateButton} >
                <div className="bookmark-menu">
                    <div className="bookmark-design"></div>
                    <img className="menu-button-projects" onClick={handleMenuClick} src="more.png" alt="menu" width={25} height={25} />
                    <div className={`more-menu-project ${showMenuButton? "" : "display-none"}`} ref={menuRef}>
                        <button className="menu-button submit-color edit-button" onClick={handleEditButton}>Edit</button>
                        <button className="menu-button cancel-color delete-button" onClick={handleDeleteButton}>Delete</button>
                    </div>
                </div>
                <div className="project-description-display">Description: {project.projectDescription}</div>
            </div>
            <p className="project-label">{project.projectName}</p>
        </div>
    );
}

export default ProjectNavigatorComponent;