const express = require("express");
const router = express.Router();
const projectController = require("../../controller/ProjectController");

module.exports = () => {
    router.post("/", async(req, res) => {
        const {projectId} = req.body;
        const project = new projectController();
        try {
            await project.delete(projectId);
            res.sendStatus(200);
        } catch (error) {
            console.log("There is error in deleting the project: ", error);
            res.sendStatus(401);
        }
    });
    return router;
}