const express = require("express");
const router = express.Router();
const UnloadController = require("../../controller/UnloadController");


const GridFS = require("../../models/GridFS");
const path = require("path");
const fs = require("fs-extra");


module.exports = () => {
    router.post("/", async(req, res) => {
        console.log("Socketid", req.body.socketId);
        try {
            const bucket = GridFS((error) => {
                console.log("There is error initializing the Grid FS", error);
                res.status(400).json({status: "fail", message:"Failed to upload to database"});
                return;
            });
            const projectId = req.body.projectDetail._id;
            let modification, historyIndex, numberOfChanges;

            if(req.body.history) {
                modification = req.body.history.state;
                historyIndex = req.body.history.index;
                numberOfChanges = req.body.history.numberOfChanges;
            }
            const upload = bucket.openUploadStream(`${projectId}.mp4`, {
                metadata: {
                    projectId: projectId,
                    transcription: modification.transcription,
                    bitrate: modification.bitrate,
                    duration: modification.duration,
                    modification: modification,
                }    
            })
            let directory = path.join(__dirname, "..","..", "temp",`${projectId}`);
            if(req.body.operation === "DOWNLOAD"){
                res.status(200).download(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`))
            }
            if(historyIndex !== 0 || numberOfChanges !== 1) {
            
                const files = fs.readdirSync(directory);
                console.log("Files in the dir", files);

                if(numberOfChanges > files.length){    
                    historyIndex = files.length - 1;
                }
                let currentVideo = path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`);
                
                const inputVideo = fs.createReadStream(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`))
                if(req.body.operation !== "SAVE" && req.body.operation !== "DOWNLOAD"){
                    files.forEach(file => {
                        console.log(file);
                        const filePath = path.join(directory, file);
                    
                        if (filePath !== currentVideo) {
                            fs.removeSync(filePath);
                            console.log('File deleted: ', filePath)
                        }
                    });
                }
                try {
                    if(numberOfChanges > 1){
                        try {
                            if(req.body.operation === "RELOAD"){
                                fs.renameSync(currentVideo, path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}0.mp4`))
                            }
                            else if(req.body.operation === "EXIT" || req.body.operation === "SAVE"){
                                console.log(`I will upload ${projectId}${historyIndex}.mp4`);
                                req.io.to(req.body.socketId).emit('saving', {state: "start"});
                                inputVideo.on("end", () => {
                                    inputVideo.destroy();
                                })
                                inputVideo.pipe(upload);
                            }
                        } catch (error) {
                            throw new Error(error);
                        }
                    }
                } catch (error) {
                    throw new Error(error);
                }
                upload.on("finish", () => {
                    console.log("Uplaoding finish");
                    req.io.to(req.body.socketId).emit('saving', {state: "finish"});
                    if(req.body.operation === "EXIT"){
                        fs.remove(directory, err => {
                            if(err){
                                console.log("Error in deleting temp video",err);
                            }
                        }); 
                        fs.remove(`${directory}-audio`, (err) => {
                            if(err) {
                                console.log("Error on deleting temp audio",err);
                            }
                        })

                    }
                })

            }
        } catch (error) {
            console.log("Error in unloading", error)
        }
        
    });

    return router;
}