const express = require("express");
const router = express.Router();
const projectController = require("../../controller/ProjectController");

module.exports = () => {
    router.post("/", async(req, res) => {
        const project = new projectController(req.body);
        const data = project.add()
        .then((projectDetails) => {
            console.log("Add project successful:", projectDetails)
        }).catch((error) => {
            console.log("there has been error", error)
        });
        console.log("this is the data", data);
        res.json({message: "Nice you access this route."});
    });
    return router;
}