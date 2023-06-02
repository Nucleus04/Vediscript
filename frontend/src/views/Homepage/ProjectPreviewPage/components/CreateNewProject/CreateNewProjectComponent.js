import { useState } from "react";
import "./style.css";
import { setShowCreateProjectModal } from "../../../../../redux/action";
import { useDispatch } from "react-redux";

function CreateNewProjectComponent () {
    const dispatch = useDispatch();

    const showCreateNewProjectModal = () => {
        dispatch(setShowCreateProjectModal(true));
    }
    return (
        <div className="create-new-project-container">
            <button type="button" onClick={showCreateNewProjectModal} className="create-new-project-button">
                 +
            </button>
            <p className="new-project-label">New Project</p>
        </div>
    )
}
export default CreateNewProjectComponent;