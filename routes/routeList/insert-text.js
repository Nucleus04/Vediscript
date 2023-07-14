const express = require("express");
const router = express.Router();
const insertController = require("../../controller/InsertTextController")
const fs = require("fs-extra");
const path = require("path");


module.exports = () => {
    router.post("/", async(req, res) => {
        console.log(req.body);
        
        const projectId = req.body.projectId;
        let historyIndex = req.body.historyIndex;
        const text = req.body.text;
        const endTime = req.body.endTime;
        const numberOfChanges = req.body.numberOfChanges;
        req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Synthesizing text input...`});
        try {

            const files = fs.readdirSync(path.join(__dirname,"..","..", "temp",`${projectId}`));
            if(numberOfChanges > files.length){    
                historyIndex = files.length - 1;
            }
            const insert = new insertController();
            await insert.synthesize(text, projectId);
            req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Generating black screen...`});
            await insert.generateBlackScreen(projectId);
            req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Inserting the video...`});
            await insert.insertBlackScreenVideo(projectId, historyIndex, endTime, numberOfChanges);
            const onResult = (script) => {
                req.io.to(req.body.socket).emit('replacing-audio', {state: "finish", message:`Replacing Audio...`});
                res.status(200).json({script: script});
            }
            req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Transcribing the video...`});
            await insert.transcribe(projectId, historyIndex, onResult, numberOfChanges);
            
        } catch (error) {
            res.sendStatus(500)
            req.io.to(req.body.socket).emit('replacing-audio', {state: "finish", message:`Replacing Audio...`});
            console.log(error)
;        }
      
    })

    return router;
}