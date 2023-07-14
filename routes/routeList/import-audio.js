const express = require("express");
const router = express.Router();
const UploadController = require("../../controller/UploadController");
const ImportAudio = require("../../controller/ImportAudioController");


module.exports = () => {
    const uploadController = new UploadController();
    const upload = uploadController.handleAudioFileviaMulter();
    const uploadErrorChecker = uploadController.uploadErrorChecker();

    router.post("/",upload.single('audio'), uploadErrorChecker, async(req, res) => {
        const importaudio = new ImportAudio();
        const input = {
            projectId : req.body.projectId,
            filepath : req.file.path,
            filename : req.file.originalname,
        }
        try {
            importaudio.writeToLocal(input); 
            importaudio.uploadAudio(input);
        } catch (error) {
            
        }
        res.sendStatus(200);
    })
    return router;
}