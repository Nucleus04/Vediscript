const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath.path);

class VideoManipulator{
    constructor () {

    }
    async extractAudio (video, transcribe,  callback) {
        try {
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