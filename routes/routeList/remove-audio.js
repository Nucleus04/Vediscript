const express = require("express");
const router = express.Router();
const VideoManipulator = require("../../controller/VideoManipulator");


module.exports = () => {
    router.post("/:projectId", (req, res) => {
        const projectId = req.params.projectId;
        const video = new VideoManipulator();
        
        console.log(req.body);
        const input = {
            start: req.body.start,
            end: req.body.end,
            projectId: projectId,
        }

        video.removeAudio(input);
        res.sendStatus(200);
    })
    return router;
}