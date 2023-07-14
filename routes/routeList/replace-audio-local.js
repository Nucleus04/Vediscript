const express = require("express")
const router = express.Router();
const UploadController = require("../../controller/UploadController");
const VideoManipulator = require("../../controller/VideoManipulator");
const fs = require("fs-extra");
const path = require("path")

module.exports = () => {
    
    router.post("/", async(req, res) => {
        const video = new VideoManipulator();
        const projectDetail = JSON.parse(req.body.projectDetails);
        const projectId = projectDetail._id;
        const filename = req.body.filename;
        console.log(req.body);
        try {
            req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Replacing Audio...`});
            const onResult = (script) => {
                console.log(script);
                req.io.to(req.body.socket).emit('replacing-audio', {state: "finish", message:`Replacing Audio...`});
                res.status(200).json({script: script});
            }
            const file = {
                path: path.join(__dirname, "..","..", "temp",`${projectId}-audio`,`${filename}`),
                local: true,
            }
            await video.replaceAudio(file, req.body, onResult, req);
        } catch (error) {
            res.status(400);
            req.io.to(req.body.socket).emit('replacing-audio', {state: "finish", message:`Replacing Audio...`});
        }
    })

    return router
}