const express = require("express");
const router = express.Router();
const projectController = require("../../controller/ProjectController");

module.exports = () => {
    router.post("/", async(req, res) => {
        console.log(req.body);
        const project = new projectController(req.body);
        console.log("This is th data", req.body);
        const data = project.add()
        .then((projectDetails) => {
            console.log("Add project successful");
        }).catch((error) => {
            console.log("there has been error", error)
        });
        res.json({message: "Nice you access this route."});
    });
    return router;
}