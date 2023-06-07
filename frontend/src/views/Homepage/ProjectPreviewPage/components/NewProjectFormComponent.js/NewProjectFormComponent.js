import "./style.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setShowCreateProjectModal, setRetrieveProjectList, setISEditingProjectDetail, setEditingProjectDetailState } from "../../../../../redux/action";
import { submitCreateProjectData } from "./module/submitCreateProjectData";
import { SubmitEditedDetails } from "./module/submitEditedDetails";


function NewProjectFormComponent () {

    const dispatch = useDispatch();


    const [hideTheForm, setHideTheForm] = useState(true);
    const [isEditingmode, setIsEditingMode] = useState(false);
    const [formData, setFormData] = useState({
        projectName: "",
        projectDescription: "",
    })

    const isCreateNewProject = useSelector((state) => state.projects);
    let projectId = "";
    useEffect(() => {
        if(isCreateNewProject.isCreatingNewProject === true) {
            setHideTheForm(false);
        }
        if(isCreateNewProject.isEditingProjectDetail.state === true) {
            setHideTheForm(false);
            setIsEditingMode(true);
            setFormData({
                projectName: isCreateNewProject.isEditingProjectDetail.projectDetail.projectName,
                projectDescription: isCreateNewProject.isEditingProjectDetail.projectDetail.projectDescription
            });
        } else {
            setIsEditingMode(false);
        }
    }, [isCreateNewProject]);

    const handleCancelCreateProject = () => {
        dispatch(setShowCreateProjectModal(false));
        dispatch(setEditingProjectDetailState(false));
        setHideTheForm(true);
    }
    const handleInputChange = (event) => {
        setFormData({...formData, [event.target.name] : event.target.value})
    }
    const onRetrieve = () => {
        setHideTheForm(true);
        dispatch(setShowCreateProjectModal(false));
        dispatch(setEditingProjectDetailState(false));
        setIsEditingMode(false);
        setFormData({
            projectName: "",
            projectDescription: "",
        });
       
        dispatch(setRetrieveProjectList(!isCreateNewProject.isRetrieveNeed));
    }

    const handleSubmitCreateProject = (event) => {
        event.preventDefault();
        submitCreateProjectData(formData, onRetrieve);
    }
    const handleEditSubmit = (event) => {
        event.preventDefault();
        projectId = isCreateNewProject.isEditingProjectDetail.projectDetail.projectId;
        SubmitEditedDetails(formData, projectId, onRetrieve);
    }
    return(
        <div className={`new-project-form-modal-main-container ${hideTheForm? "display-none" : ""}`}>
            <div className={`new-project-form-modal-container`}>
            <div className="new-project-form-container">
                <p className="create-new-project-label">{isEditingmode? "Edit Project Details" : "Create New Project"}</p>
                <form method="POST" onSubmit={isEditingmode? handleEditSubmit : handleSubmitCreateProject}>
                    <label htmlFor="project-name" className="new-project-form-labels">Name:</label>
                    <input type="text" onChange={handleInputChange} required value ={formData.projectName} name="projectName" id="projectName" className="new-project-form-input" placeholder="Project Name"/>
                    <label htmlFor="project-description" className="new-project-form-labels">Description:</label>
                    <input type="text" onChange={handleInputChange} required value ={formData.projectDescription} name="projectDescription" id="projectDescription" className="new-project-form-input" placeholder="Project Description"/>
                    <div className="create-project-form-button-container">
                        <button type="submit" className="create-project-button submit-color">{isEditingmode? "Edit" : "Create"}</button>
                        <button type="button" onClick={handleCancelCreateProject} className="create-project-button cancel-color">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
}

export default NewProjectFormComponent;