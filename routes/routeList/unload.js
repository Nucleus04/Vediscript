const express = require("express");
const router = express.Router();
const UnloadController = require("../../controller/UnloadController");


const GridFS = require("../../models/GridFS");
const path = require("path");
const fs = require("fs");


module.exports = () => {
    router.post("/", async(req, res) => {
        const bucket = GridFS((error) => {
            console.log("There is error initializing the Grid FS", error);
            res.status(400).json({status: "fail", message:"Failed to upload to database"});
            return;
        });
        console.log("unload---------------------------------------------------",req.body);
        console.log("remove_audio------------------------------------------------", req.body.history.remove_audio);
        const projectId = req.body.projectDetail._id;
        const modification = req.body.history.state;
        const historyIndex = req.body.history.index;
        const numberOfChanges = req.body.history.numberOfChanges;
    
        const upload = bucket.openUploadStream(`${projectId}.webm`, {
            chunkSizeBytes: 40000,
            metadata: {
                projectId: projectId,
                transcription: modification.transcription,
                bitrate: modification.bitrate,
                duration: modification.duration,
                modification: modification,
            }    
        })
        let currentVideo = path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.webm`);
        let directory = path.join(__dirname, "..","..", "temp",`${projectId}`);

        if(historyIndex !== 0 || numberOfChanges !== 1) {
            if(fs.existsSync(currentVideo)){

                fs.readdir(directory, (err, files) => {
                    console.log("I will now remove")
                    if (err) {
                        console.error(err);
                        return;
                    }
                
                    files.forEach(file => {
                        console.log(file);
                        const filePath = path.join(directory, file);
                
                        if (filePath !== currentVideo) {
                            fs.unlink(filePath, err => {
                                if (err) {
                                console.error(`Error deleting file: ${filePath}`, err);
                                } else {
                                console.log(`Deleted file: ${filePath}`);
                                }
                            });
                        }
                    });
                });

                if(historyIndex !== 0){
                    fs.renameSync(currentVideo, path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}0.webm`));
                }
                if(historyIndex !== 0  && numberOfChanges !== 1)
                    fs.createReadStream(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}0.webm`)).pipe(upload);

                upload.on("finish", () => {
                    console.log("Uplaoding finish");
                    
                })
            }
    
        }



        
    });

    return router;
}