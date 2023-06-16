const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const GridFS = require("../models/GridFS");
const fs = require("fs");

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


    async removeAudio (params) {
        const bucket = GridFS((error) => {
            console.log("Error in GridFs", error);
        })
        const cursor = await bucket.find({"metadata.projectId": params.projectId});
        let data = [];
        if(await cursor.hasNext()){
            for await(const element of cursor) {
                data.push(element);
            };
        console.log(data);
        //bucket.openDownloadStreamByName(data[data.length - 1].filename).pipe(res);
        const inputVideo  = bucket.openDownloadStreamByName(data[data.length - 1].filename);
        //const inputVideo = fs.createReadStream(__dirname+"/c.mp4");
      const output = fs.createWriteStream(__dirname + "/b.mp4");
      ffmpeg.ffprobe((inputVideo), (err, metadata) => {
        if(err){
            console.log("ERROR", err);
        } else {
            console.log(metadata);
        }
    })

        const filter = ffmpeg(inputVideo)
            .seekInput("00:00:01")
            .setDuration("00:00:10")
            .noAudio()
            .pipe(output)
            .on('end', () => console.log('Audio removal complete'))
            .on('error', (err) => console.error('Error removing audio:', err))

            inputVideo.pipe(filter);
        
        }
    }
}

module.exports = VideoManipulator;