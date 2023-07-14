const speech = require("@google-cloud/text-to-speech");
const fs = require("fs-extra");
const path = require("path")
const util = require("util");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const videoManipulator = require("./VideoManipulator");
const GoogleApi = require("./TranscriptionController");
ffmpeg.setFfprobePath(ffprobePath.path);
ffmpeg.setFfmpegPath(ffmpegPath.path);

class insertText {
    constructor (){

    }
    async synthesize(text, projectId){
        try {
            const client = new speech.TextToSpeechClient({
                keyFilename: path.join(__dirname, "../GoogleAPI/key.json")
            })
            const request  = {
                input: {text: text},
                voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
                audioConfig:{ audioEncoding: 'MP3'},
            }
            const [response] = await client.synthesizeSpeech(request);
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(`uploads/audio/${projectId}.mp3`, response.audioContent, 'binary');

        } catch (error) {
            throw new Error(error);
        }
    }

    async generateBlackScreen(projectId) {
        try {
            await new Promise((resolve, reject) => {
                ffmpeg()
                .input('color=c=black:s=640x360:r=5')
                .inputFormat('lavfi')
                .input(`uploads/audio/${projectId}.mp3`)
                .outputOptions('-c:v libx264')
                .outputOption("-c:a copy")
                .outputOption("-shortest")
                .on("sdterr", (stderr) => {
                    console.log(stderr);
                })
                .save(`uploads/audio/${projectId}black.mp4`)
                .on("end", () => {
                    fs.unlink(`uploads/audio/${projectId}.mp3`, (err) => {
                        if(err) {
                            reject(new Error(err));
                        }
                    })
                    console.log("Black screen succefully created");
                    resolve();
                })
                .on("error", (error) => {
                    reject(new Error(error));
                })
                .on("stderr", (stderr) => {
                    console.log(stderr);
                })
            })
        } catch (error) {
            throw new Error(error);
        }
    }


    async insertBlackScreenVideo (projectId, historyIndex, endTime, numberOfChanges){
    
        const inputVideo1 = path.join(__dirname,"..", "temp",`${projectId}/${projectId}${historyIndex}.mp4`);
        const inputVideo2 = path.join(__dirname,"..", "uploads", "audio", `${projectId}black.mp4`);
        const inputVideo3 = path.join(__dirname,"..",  "temp",`${projectId}/${projectId}${historyIndex}.mp4`);
        const outputVideo = path.join(__dirname,"..", "temp",`${projectId}/${projectId}${parseInt(historyIndex)+1}.mp4`);
        try {
            await new Promise((resolve, reject) => {
                ffmpeg()
                .input(inputVideo1)
                .input(inputVideo2)
                .input(inputVideo3)
                .complexFilter([
                    `[0:a]atrim=0:${endTime},asetpts=PTS-STARTPTS[a0]`,
                    `[2:a]atrim=${endTime},asetpts=PTS-STARTPTS[a2]`,
                    '[a0][1:a][a2]concat=n=3:v=0:a=1[aout]',
                    `[0:v]trim=0:${endTime},setpts=PTS-STARTPTS[v0]`,
                    `[2:v]trim=${endTime},setpts=PTS-STARTPTS[v2]`,
                    '[v0][1:v][v2]concat=n=3:v=1:a=0[vout]',
                ])
                .outputOptions(['-map [vout]','-map [aout]', "-shortest"])
                .on("stderr", (stderr) => {
                    console.log(stderr);
                })
                .save(outputVideo)
                .on("end", () => {
                    console.log("Inserted video successfully");
                    fs.unlink(`uploads/audio/${projectId}black.mp4`, (err) => {
                        if(err) {
                            reject(new Error(err));
                        }
                    })
                    resolve();
                })
                .on("error", (error) => {
                    reject(new Error(error));
                })
            })
        } catch (error) {
            throw new Error(error);
        }
    }


    async transcribe(projectId, historyIndex, onResult, numberOfChanges) {
        try {
            console.log(historyIndex, numberOfChanges);
            const video = new videoManipulator();
            const speechToText = new GoogleApi();
            const outputVideo = path.join(__dirname,"..", "temp",`${projectId}/${projectId}${parseInt(historyIndex)+1}.mp4`);
            const transcript = speechToText.speechToText(onResult);
            video.extractAudio(outputVideo, transcript, (error) => {
                throw new Error(error);
            }, ()=>{})
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = insertText;