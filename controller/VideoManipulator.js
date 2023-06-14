const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const ffprobePath = require("@ffprobe-installer/ffprobe");

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
}

module.exports = VideoManipulator;