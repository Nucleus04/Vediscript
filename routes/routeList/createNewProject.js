const express = require("express");
const router = express.Router();
const projectController = require("../../controller/ProjectController");

module.exports = () => {
    router.post("/", async(req, res) => {
        const project = new projectController(req.body);
        const data = await project.add()
        .then((projectDetails) => {
            res.sendStatus(200)
        }).catch((error) => {
            res.sendStatus(200)
            console.log("there has been error", error)
        });
    });
    return router;
}