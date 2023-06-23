const express = require("express");
const router = express.Router();
const VideoManipulator = require("../../controller/VideoManipulator");


module.exports = () => {
    router.post("/:projectId", async(req, res) => {
        try {
            const projectId = req.params.projectId;
            const video = new VideoManipulator();
            
            console.log(req.body);
            const input = {
                start: req.body.start,
                end: req.body.end,
                projectId: projectId,
            }
            req.io.to(req.body.socketId).emit('removing-audio', {state: "start", message:"Removing Audio..."});
        await video.removeAudio(input, req, res);
        } catch (error) {
            res.sendStatus(500);
        }
    })
    return router;
}