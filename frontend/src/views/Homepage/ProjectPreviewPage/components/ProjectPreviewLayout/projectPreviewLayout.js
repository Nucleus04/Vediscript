import "./style.css";
import ProfileComponent from "../../../CommonComponents/ProfileComponent/ProfileComponent";
import CreateNewProjectComponent from "../CreateNewProject/CreateNewProjectComponent";
import ProjectNavigatorComponent from "../ProjectNavigator/ProjectNavigatorComponent";
import NewProjectFormComponent from "../NewProjectFormComponent.js/NewProjectFormComponent";
import { retrieveProject } from "./module/retrieveProjectList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ProjectPreviewLayout () {
    const [projectList, setProjectList] = useState("");
    const isRetrievedNeed = useSelector((state) => state.projects);

    useEffect(() => {
        retrieveProject()
        .then ((data) => {
            setProjectList(data);
        }).catch((error) => {
            console.log(error);
        })
    }, [isRetrievedNeed]);

    return (
        <div className="project-preview-container">
            <NewProjectFormComponent/>
            <div className="project-preview-header">
                <div className="logo-appname">
                    <img className="logo logo-container" src="Vediscript-logo.png" alt="Logo"/>
                    <div className="appname">
                        <p className="appname-font-projects">Vediscript</p>
                    </div>
                </div>
                <ProfileComponent />
            </div>

            <div className="project-list-container">
                <div className="project-list-button-container">
                    <h3 className="your-projects-label"> Your projects...</h3>
                    <div className="project-list">
                        <CreateNewProjectComponent/>
                        {Array.isArray(projectList) && projectList.map((project) => (
                                <ProjectNavigatorComponent key={project._id} project={project}/>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default ProjectPreviewLayout;