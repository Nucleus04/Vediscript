const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const GridFS = require("../models/GridFS");
const fs = require("fs-extra");
const ProjectModel = require("../models/Project");
const path = require("path");
ffmpeg.setFfprobePath(ffprobePath.path);
ffmpeg.setFfmpegPath(ffmpegPath.path);
const TranscriptionController = require("./TranscriptionController");
const GoogleAPI = new TranscriptionController();


class VideoManipulator{
    constructor () {

    }
    async extractAudio (video, transcribe,  callback, callbackMetadata) {
        console.log("ffmpeg", video);
        const metaData = {
            bitrate: "",
            duration: "",
        }
        try {
            ffmpeg.ffprobe(video, (err, metadata) => {
                if (err) {
                    console.log(err);
                  } else {
                    metaData.bitrate =  metadata.format.bit_rate;
                    metaData.duration = metadata.format.duration; 
                    callbackMetadata(metaData);
                  }
            })
        } catch (error) {
            console.log("Tere is error in ffprobe", error);
        }

        try {
            console.log("trying audio extract");
            ffmpeg(video)
            .outputFormat('wav') 
            .outputOptions('-acodec pcm_s16le') 
            .outputOptions('-ac 1')
            .pipe(transcribe)
            .on('end', () => {
                console.log('Audio extraction complete.');
            })
            .on('error',(err) => {
                console.error('Error extracting audio:', err);
                callback(err);
            })
            .on("stderr", (stderr) => {
                console.log(stderr)
            })
        } catch (error) {
            callback(error);
        }
    }


    async removeAudio (params, req, res, onResult, numberOfChanges) {
        const bucket = GridFS((error) => {
            console.log("Error in GridFs", error);
        })
        const transcribe = GoogleAPI.speechToText(onResult); 
        let historyIndex = req.body.historyIndex;
        const files = fs.readdirSync(path.join(__dirname,"..", "temp",`${params.projectId}`));
        if(numberOfChanges > files.length){    
            historyIndex = files.length - 1;
        }
        // if(numberOfChanges > files.length){
        //     if(parseInt(historyIndex) !== parseInt(numberOfChanges)){
        //         let difference = (parseInt(numberOfChanges) - parseInt(historyIndex))
        //         historyIndex = files.length - difference;
        //         if(historyIndex < 0){
        //             historyIndex = 0;
        //         }
        //     }
        // }
        console.log("historyIndex", historyIndex);

        let inputVideo;
        if(fs.existsSync(path.join(__dirname, "..", "temp",`${params.projectId}`, `${params.projectId}${parseInt(historyIndex)}.mp4`))){
            inputVideo = path.join(__dirname, "..", "temp",`${params.projectId}`, `${params.projectId}${parseInt(historyIndex)}.mp4`);
        } else {
            inputVideo = bucket.openDownloadStreamByName(`${params.projectId}.mp4`);
        }
        const output = path.join(__dirname, "..", "temp",`${params.projectId}`, `${params.projectId}${parseInt(historyIndex) + 1}.mp4`);
        const start = params.start;
        const end = params.end;
        try{
            ffmpeg(inputVideo)
            .on("start", () => {
                console.log("removing audio start")
                console.time("start");
            })
            .on("end", () => {
                console.log("Removing audio successfully")
                console.timeEnd("start");

                this.extractAudio(output, transcribe, () =>{}, ()=>{});
    
                
            })
            .on("error", (error) => {
                console.log("Error", error);
                req.io.to(req.body.socketId).emit('removing-audio', {state: "finish", message:""});
                res.sendStatus(500);
            }) 
            .on("stderr", (stderr) => {
                console.log(stderr);
            })
            .outputFormat('mp4')
            .outputOption('-c:v copy')
            .audioFilters(`volume=enable='between(t,${start},${end})':volume=0`)
            .save(output) 
                
        } catch (error) {
            console.log("Error while removing audio: ", error);
            req.io.to(req.body.socketId).emit('removing-audio', {state: "finish", message:""});
            res.sendStatus(500);
        }

    }


    async replaceAudio (inputAudio, data, onResult, req) {
        try {
            const time = JSON.parse(data.time);
            const projectDetails = JSON.parse(data.projectDetails);
            const startTime = time.start;
            let endTime = time.end;
            const projectId = projectDetails._id;
            let historyIndex = data.historyIndex;
            const numberOfChanges = data.numberOfChanges;
            endTime = parseFloat(endTime).toFixed(1)

            let inputVideo;
            const files = fs.readdirSync(path.join(__dirname,"..", "temp",`${projectId}`));
    
            if(numberOfChanges > files.length){    
                historyIndex = files.length - 1;
            }
            const bucket = GridFS((error) => {
                console.log("Error in GridFs", error);
            })
                if(fs.existsSync(path.join(__dirname, "..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`))){
                    console.log("I get the inout in locals");
                    inputVideo = path.join(__dirname, "..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`);
                } else {
                    console.log("I get the inout in localsssssssssss");
                    inputVideo = bucket.openDownloadStreamByName(`${projectId}.mp4`);
                }
        
            const transcribe = GoogleAPI.speechToText(onResult);   
            let outputVideo = path.join(__dirname, "..", "temp",`${projectId}`, `${projectId}${parseInt(historyIndex)+1}.mp4`)
            

            const applyAudio = () =>{

                req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Inserting the audio...`});
                ffmpeg(inputVideo)
                .input(`${inputAudio.path}1.aac`)
                .complexFilter([
                    `[0:a]atrim=0:${startTime},asetpts=PTS-STARTPTS[a0]`,
                    `[0:a]atrim=${endTime },asetpts=PTS-STARTPTS[a1]`,
                    '[a0][1:a][a1]concat=n=3:v=0:a=1[aout]'
                ])
                .outputOptions(['-map 0:v', '-map [aout]','-c:v copy', '-shortest'])
                .format("mp4")
                .save(outputVideo)
                .on('end', () => {
                    if(outputVideo){
                        req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Transcribing new audio...`});
                        this.extractAudio(outputVideo, transcribe, (error) =>{
                            console.log(error);
                        }, ()=>{});
                    }
                    fs.unlink(`${inputAudio.path}1.aac`, (err) => {
                        if(err) {
                            console.log("Error on deleting temp audio", err)
                        } else {
                            console.log("Deleted Successfully");
                        }
                    })
                    console.log('Audio replaced successfully');
                })
                .on('error', (err) => {
                    console.log(err);
                })

            }

           
            try {
                req.io.to(req.body.socket).emit('replacing-audio', {state: "start", message:`Replacing audio format...`});
                await new Promise((resolve, reject) => {
                    console.log("Starting replacing format");
                    ffmpeg(inputAudio.path)
                    .complexFilter([
                        `[0:a]atrim=0:${endTime },asetpts=PTS-STARTPTS[a2]`,
                    ])
                    .outputOption(['-map [a2]'])
                    .audioCodec('aac')
                    .on("stderr", (stderr) => {
                        console.log(stderr);
                    })
                    .save(`${inputAudio.path}1.aac`)
                    .on('end', () => {
                        console.log('Audio format changed successfully');
                        if(!inputAudio.local){
                            console.log("I will delete the audio")
                            fs.unlink(inputAudio.path, (err) => {
                                if(err) {
                                    console.log("Error on deleting temp audio", err)
                                } else {
                                    console.log("Deleted Successfully");
                                }
                            })
                        }
                        applyAudio();
                    })
                    .on('error', (err) => {
                        reject(new Error(err));
                    })
                })
            } catch (error) {
                throw new Error(error);
            }

        } catch (error) {
            console.log("Error in replacing audio:" , error);
            throw new Error(error)
        }
    }
}

module.exports = VideoManipulator;