const express = require("express");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const UploadController = require("../../controller/UploadController");
const videoManipulator = require("../../controller/VideoManipulator");
const TranscriptionController = require("../../controller/TranscriptionController");
const fs = require("fs");
const GridFS = require("../../models/GridFS");
ffmpeg.setFfmpegPath(ffmpegPath.path);

const uploadController = new UploadController();
const video = new videoManipulator();
const GoogleAPI = new TranscriptionController();



module.exports = () => {

    const upload = uploadController.handleFileviaMulter();
    const uploadErrorChecker = uploadController.uploadErrorChecker();

    router.post("/",upload.single('video'),uploadErrorChecker, async(req, res) => {

        const videoFile = req.file.path;
        let socketId = req.body.socketId;
        const projectId = req.body.projectId;
        const bucket = GridFS((error) => {
            console.log("There is error initializing the Grid FS", error);
            res.status(400).json({status: "fail", message:"Failed to upload to database"});
            return;
        });

        req.io.to(socketId).emit('audio-extraction', 'start');

        // const transcribeCallbackDuring = (wordData) => {
        //     req.io.to(socketId).emit('transcription', wordData);
        // }
        const transcribeCallbackEnd = async(wordData)=> {
                res.status(200).json({status: "success", message: "Uploaded Successfully!"});

                const upload = fs.createReadStream(videoFile)
                    .pipe(bucket.openUploadStream(projectId, {
                        metadata: {
                            filename: req.file.originalname,
                            transcription: wordData,
                    }
                }));
                await new Promise((resolve, reject) => {
                    upload.on('finish', resolve);
                    upload.on('error', reject);
                })

                await fs.unlink(videoFile, (err) => {
                    if(err) 
                        console.log("There has been error on deleting the temporary file.");
                    else {
                        console.log("Deleted file temporary file successfully");
                    }
                });
                //bucket.openDownloadStreamByName(projectId).pipe(res);
                console.log("waiting to delete");
                console.log("transcription finish");
                return;
        }


        let transcribe;
        try {
            transcribe = GoogleAPI.speechToText(/*transcribeCallbackDuring,*/ transcribeCallbackEnd );
        } catch (error) {
            res.status(400).json({status: "fail", message: "Failed to transcript the file."});
            await fs.unlink(videoFile, (err) => {
                if(err) 
                    console.log("There has been error on deleting the temporary file.");
                else {
                    console.log("Deleted file temporary file successfully");
                }
            });
            console.log("Error in transcription: ", error);
            return;
        }

        video.extractAudio(videoFile, transcribe, (error) => {
            if(error){
                res.status(400).json({status: "fail", message: "Failed to extract the audio."})
                return;
            }else {
                req.io.to(socketId).emit('audio-extraction', 'finish');
            }
        });

    });

    return router;
}