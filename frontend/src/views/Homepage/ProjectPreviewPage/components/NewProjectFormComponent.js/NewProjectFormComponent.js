import "./style.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setShowCreateProjectModal, setRetrieveProjectList } from "../../../../../redux/action";
import { submitCreateProjectData } from "./module/submitCreateProjectData";


function NewProjectFormComponent () {

    const dispatch = useDispatch();


    const [hideTheForm, setHideTheForm] = useState(true);
    const [formData, setFormData] = useState({
        projectName: "",
        projectDescription: "",
    })

    const isCreateNewProject = useSelector((state) => state.projects);
 
    useEffect(() => {
        if(isCreateNewProject.isCreatingNewProject === true) {
            setHideTheForm(false);
        }
    }, [isCreateNewProject.isRetrieveNeed]);

    const handleCancelCreateProject = () => {
        dispatch(setShowCreateProjectModal(false));
        setHideTheForm(true);
    }
    const handleInputChange = (event) => {
        setFormData({...formData, [event.target.name] : [event.target.value]})
    }
    const onRetrieve = () => {
        setHideTheForm(true);
        setFormData({
            projectName: "",
            projectDescription: "",
        });
        dispatch(setRetrieveProjectList(true));
    }
    const handleSubmitCreateProject = (event) => {
        event.preventDefault();
        submitCreateProjectData(formData, onRetrieve);
    }
    return(
        <div className={`new-project-form-modal-container ${hideTheForm? "display-none" : ""}`}>
            <div className="new-project-form-container">
                <p className="create-new-project-label">Create New Project</p>
                <form method="POST" onSubmit={handleSubmitCreateProject}>
                    <label htmlFor="project-name" className="new-project-form-labels">Name:</label>
                    <input type="text" onChange={handleInputChange} value ={formData.projectName} name="projectName" id="projectName" className="new-project-form-input" placeholder="Project Name"/>
                    <label htmlFor="project-description" className="new-project-form-labels">Description:</label>
                    <input type="text" onChange={handleInputChange} value ={formData.projectDescription} name="projectDescription" id="projectDescription" className="new-project-form-input" placeholder="Project Description"/>
                    <div className="create-project-form-button-container">
                    <button type="submit" className="create-project-button submit-color">Create</button>
                    <button type="button" onClick={handleCancelCreateProject} className="create-project-button cancel-color">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewProjectFormComponent;