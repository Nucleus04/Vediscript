const express = require("express")
const router = express.Router();
const UploadController = require("../../controller/UploadController");
const VideoManipulator = require("../../controller/VideoManipulator");
const fs = require("fs-extra");

module.exports = () => {
    const uploadController = new UploadController();
    const upload = uploadController.handleAudioFileviaMulter();
    const uploadErrorChecker = uploadController.uploadErrorChecker();
 

    router.post("/",upload.single('record'), uploadErrorChecker, async(req, res) => {
        const video = new VideoManipulator();
        
        try {
            req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Replacing Audio...`});
            const onResult = (script) => {
                console.log(script);
                req.io.to(req.body.socket).emit('replacing-audio', {state: "finish", message:`Replacing Audio...`});
                res.status(200).json({script: script});
            }
            await video.replaceAudio(req.file, req.body, onResult, req);
        } catch (error) {
            res.status(400);
            req.io.to(req.body.socket).emit('replacing-audio', {state: "finish", message:`Replacing Audio...`});
        }
    })

    return router
}