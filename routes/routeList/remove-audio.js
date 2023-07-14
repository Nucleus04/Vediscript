const express = require("express");
const router = express.Router();
const VideoManipulator = require("../../controller/VideoManipulator");


module.exports = () => {
    router.post("/:projectId/:numberOfChanges", async(req, res) => {
        try {
            const projectId = req.params.projectId;
            const video = new VideoManipulator();
            const numberOfChanges = parseInt(req.params.numberOfChanges);
            
            console.log(req.body);
            const input = {
                start: req.body.start,
                end: req.body.end,
                projectId: projectId,
            }
            req.io.to(req.body.socketId).emit('removing-audio', {state: "start", message:"Removing Audio..."});
            const onResult = (script) => {
                console.log(script);
                req.io.to(req.body.socketId).emit('removing-audio', {state: "finish", message:""});
                res.status(200).json({script: script});
            }
            await video.removeAudio(input, req, res, onResult, numberOfChanges);
        } catch (error) {
            console.log("error in remove audio", error)
            req.io.to(req.body.socketId).emit('removing-audio', {state: "finish", message:""});
            res.sendStatus(500);
        }
    })
    return router;
}