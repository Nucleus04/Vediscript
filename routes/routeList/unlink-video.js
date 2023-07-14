const express = require("express")
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");

module.exports = () => {
    router.get("/:projectid/:historyIndex", (req, res) => {
        try {
            const projectid = req.params.projectid;
            let historyIndex = parseInt(req.params.historyIndex);
            const directory = path.join(__dirname, "..","..", "temp",`${projectid}`);
            console.log(projectid, historyIndex);
            const files = fs.readdirSync(directory);
        
            historyIndex = historyIndex + 1;
            const currentVideo = path.join(__dirname, "..","..", "temp",`${projectid}`, `${projectid}${historyIndex}.mp4`);
            historyIndex = historyIndex + 1;
            if(files.length === historyIndex){
                fs.unlinkSync(currentVideo)
                res.sendStatus(200);
            }
        } catch (error) {
            console.log("Error", error);
            res.sendStatus(500);
        }

    })
    return router;
}