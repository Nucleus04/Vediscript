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
const ProjectModel = require("../../models/Project");
const path = require("path");
const uploadController = new UploadController();
const video = new videoManipulator();
const GoogleAPI = new TranscriptionController();



module.exports = () => {

    const upload = uploadController.handleFileviaMulter();
    const uploadErrorChecker = uploadController.uploadErrorChecker();


    router.post("/",upload.single('video'),uploadErrorChecker, async(req, res) => {

        const videoFile = req.file.path;
        let socketId = req.body.socketId;
        let bitrate, duration;
        const projectId = req.body.projectId;
        const bucket = GridFS((error) => {
            console.log("There is error initializing the Grid FS", error);
            res.status(400).json({status: "fail", message:"Failed to upload to database"});
            return;
        });

        req.io.to(socketId).emit('audio-extraction', {state: 'start', message: 'Transcribing...'});
        const transcribeCallbackEnd = async(wordData)=> {
                
                console.log("metadata", duration, bitrate);
                const videoInput = fs.createReadStream(videoFile);
                let currentChunkSizeA = 0;
                let percentageA = 0;
                videoInput.on("data", (chunk) => {
                    currentChunkSizeA = chunk.length + currentChunkSizeA;
                    percentageA = ((currentChunkSizeA/ req.file.size) * 100)
                    req.io.to(socketId).emit('audio-extraction', {state: 'start', message: `Converting to WebM : ${percentageA.toFixed(2)}%`});
                })
                const upload = bucket.openUploadStream(`${projectId}.webm`, {
                        chunkSizeBytes: 40000,
                        metadata: {
                            projectId: projectId,
                            transcription: wordData,
                            bitrate: bitrate,
                            duration: duration,
                            modification:{
                                remove_audio:[],
                            }
                    }
                })
                upload.on("finish", () => {
                    console.log("Uplaoding finish");
                    res.status(200).json({status: "success", message: "Uploaded Successfully!"});
                    req.io.to(socketId).emit('audio-extraction', {state: 'finish', message: ``});
                })
                req.io.to(socketId).emit('audio-extraction', {state: 'start', message: 'Uploading...'});
                let folder = path.join(__dirname, "..","..", "temp",`${projectId}`);
                if(!fs.existsSync(folder)) {
                    fs.mkdirSync(folder)
                }
                ffmpeg(videoInput)
                    .outputFormat('webm')
                    .on("end", () => {
                        let currentChunkSize = 0;
                        let percentage = 0;
                        const videoupload = fs.createReadStream(path.join(folder, `${projectId}0.webm`));
                        videoupload.on("data", (chunk) => {
                            currentChunkSize = chunk.length + currentChunkSize;
                            percentage = ((currentChunkSize/ req.file.size) * 100)
                            console.log(percentage);
                            req.io.to(socketId).emit('audio-extraction', {state: 'start', message: `Uploading  :  ${percentage.toFixed(2)}%`});
                        })
                        videoupload.pipe(upload);
                    })
                    .save(`temp/${projectId}/${projectId}0.webm`);
                
                
                await new Promise((resolve, reject) => {
                    upload.on('finish', resolve);
                    upload.on('error', reject);
                })
                
                const cursor = await bucket.find({"metadata.projectId": projectId});
                let data = [];
                if(await cursor.hasNext()){
                    for await(const element of cursor) {
                        data.push(element);
                    };
                }

                console.log("updating videoId:", data[data.length - 1]._id);
                await ProjectModel.findByIdAndUpdate(projectId, {videoId : data[data.length - 1]._id});
                console.log("Finish updating the vidoe id");
                
                await fs.unlink(videoFile, (err) => {
                    if(err) 
                        console.log("There has been error on deleting the temporary file.");
                    else {
                        console.log("Deleted file temporary file successfully");
                    }
                });
                console.log("waiting to delete");
                console.log("transcription finish");
            
        }


        let transcribe;
        try {
            transcribe = GoogleAPI.speechToText(transcribeCallbackEnd );
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
        },(metadata) => {
            if(metadata) {
                console.log(metadata);
                bitrate = metadata.bitrate;
                duration = metadata.duration;
            }
        });

    });

    return router;
}