const ProjectModel = require("../models/Project");

class Project {
    constructor (projectDetails) {
        this.projectDetails = projectDetails;
    }
    projectDetailsGetter () {
        return this.projectDetails;
    }
    add () {
        const data = {
            userId : this.projectDetails.id,
            projectName : this.projectDetails.projectData.projectName[0],
            projectDescription: this.projectDetails.projectData.projectDescription[0],
        }
        const project = new ProjectModel(data);
        try {
            const save = project.save();
            console.log("New Project Created Successfully");
            return save;
        } catch (error) {
            throw(error);
        }
    }
     
    async get (id) {
        try {
            const projects = await ProjectModel.find({userId: id});
            return projects;
        } catch (error) {
            throw(error);
        }
    }
}
module.exports = Project;