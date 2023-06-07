const express = require("express");
const router = express.Router();
const projectController = require("../../controller/ProjectController");


module.exports = () => {
    router.post("/", async (req, res) => {
    
        const {userId, projectId, projectData} = req.body;
        const projectDetails = {
            id: userId,
            projectData: projectData,
        }
        const project = new projectController(projectDetails);
        try {
            const update = await project.edit(projectId);
            console.log(update);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(400);
        }
    });
    return router;
}