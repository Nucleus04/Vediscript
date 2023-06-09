const express = require("express");
const router = express.Router();
const ProjectController = require("../../controller/ProjectController");

module.exports = () => {
    router.post("/", async(req,res) => {
        //req.io.emit('message', 'Hello from the route');
        const project = new ProjectController();
        const projectList = await project.get(req.body.id);
        res.json(projectList);
    });
    return router;
}