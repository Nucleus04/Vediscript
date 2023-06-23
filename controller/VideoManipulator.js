const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const GridFS = require("../models/GridFS");
const fs = require("fs");
const ProjectModel = require("../models/Project");
const path = require("path");
ffmpeg.setFfprobePath(ffprobePath.path);
ffmpeg.setFfmpegPath(ffmpegPath.path);

class VideoManipulator{
    constructor () {

    }
    async extractAudio (video, transcribe,  callback, callbackMetadata) {
        console.log("ffmpeg");
        const metaData = {
            bitrate: "",
            duration: "",
        }
        try {
            ffmpeg.ffprobe(video, (err, metadata) => {
                if (err) {
                    res.status(500).send('Error retrieving video bitrate');
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
            });
        } catch (error) {
            callback(error);
        }
    }


    async removeAudio (params, req, res) {
        const bucket = GridFS((error) => {
            console.log("Error in GridFs", error);
        })
        let percentage = 0;
        const cursor = await bucket.find({"metadata.projectId": params.projectId});
        let data = [];
        let formerVideo = parseInt(req.body.historyIndex)-1;
        console.log("formervideoooo",formerVideo);
        console.log("HistoryIndexxx");
        if(await cursor.hasNext()){
            for await(const element of cursor) {
                data.push(element);
            };
            let inputVideo;
            if(fs.existsSync(path.join(__dirname, "..", "temp",`${params.projectId}`, `${params.projectId}${parseInt(req.body.historyIndex)}.webm`))){
                console.log("I get the inout in locals");
                inputVideo = fs.createReadStream(path.join(__dirname, "..", "temp",`${params.projectId}`, `${params.projectId}${parseInt(req.body.historyIndex)}.webm`), {highWaterMark: 40000});
            } else {
                console.log("I get the inout in localsssssssssss");
                inputVideo = bucket.openDownloadStreamByName(`${params.projectId}.webm`);
            }

            inputVideo.on('data', (chunk) => {
                percentage = (((chunk.length)/data[data.length -1].length) * 100) + percentage;
                req.io.to(req.body.socketId).emit('removing-audio', {state: "start", message:`Removing Audio... ${percentage.toFixed(2)}%`});
            })
            const outputVideo = bucket.openUploadStream(`${params.projectId}.webm`, {
                chunkSizeBytes: 40000,
                metadata: {
                    ...data[data.length - 1].metadata,
                    modification: {
                    remove_audio: [
                        ...data[data.length - 1].metadata.modification.remove_audio,
                            {
                                start: params.start,
                                end: params.end,
                            }
                        ]
                    }
                }
            })

    
            outputVideo.on('finish', () => {
                console.log("Uploading finish");
                req.io.to(req.body.socketId).emit('removing-audio', {state: "finish", message:""});
                res.sendStatus(200);
            })

        const start = params.start;
        const end = params.end;
            try{
                ffmpeg(inputVideo)
                .on("start", () => {
                    console.log("removing audio start")
                    console.time("start");
                })
                .on("end", async() => {
                    console.log("Removing audio successfully")
                    console.timeEnd("start");
                    ProjectModel.findByIdAndUpdate(params.projectId, {videoId : data[data.length - 1]._id});
                    let currentChunkSize = 0;
                    let percentage = 0;
                    let folder = path.join(__dirname, "..", "temp",`${params.projectId}`);
                    const videoupload = fs.createReadStream(path.join(folder, `${params.projectId}${parseInt(req.body.historyIndex)+1}.webm`));
                    videoupload.on("data", (chunk) => {
                            currentChunkSize = chunk.length + currentChunkSize;
                            percentage = ((currentChunkSize/ data[data.length - 1].length) * 100)
                            console.log(percentage);
                            req.io.to(req.body.socketId).emit('removing-audio', {state: 'start', message: `Uploading : ${percentage.toFixed(2)}%`});
                        })
                    videoupload.pipe(outputVideo);
                    
                })
                .on("error", (error) => {
                    console.log("Error", error);
                }) 
                .on("stderr", (stderr) => {
                    console.log(stderr);
                })
                .outputFormat('webm')
                .audioFilters(`volume=enable='between(t,${start},${end})':volume=0`)
                .save(`temp/${params.projectId}/${params.projectId}${parseInt(req.body.historyIndex)+1}.webm`) 
                
            } catch (error) {
                console.log("Error while removing audio: ", error);
            }
        }
    }
}

module.exports = VideoManipulator;