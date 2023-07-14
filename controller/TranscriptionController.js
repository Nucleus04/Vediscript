const config = require("../config");
const speech = require("@google-cloud/speech");
const path = require("path");


class TranscriptionController {
    constructor () {

    }
    speechToText (/*duringCallback,*/ endcallback) {
    
        const wordData = [];
        try {
            const client = new speech.SpeechClient({
                keyFilename: path.join(__dirname, "../GoogleAPI/key.json")
            });
            let recognizeStream = null;
            const configuration = config.transcription.speech_to_text.config;
            const request = {
                config: configuration,
            };
    
            recognizeStream = client
            .streamingRecognize(request)
            .on('error', (error) => {
                throw new Error(error);
            })
            .on('data', data => {   
                data.results.forEach((result) => {
                    result.alternatives.forEach((alternative) => {
                        alternative.words.forEach((item) => {
                        
                        const start = parseInt(item.startTime.seconds) + item.startTime.nanos/1000000000;
                        const end = parseInt(item.endTime.seconds) + item.endTime.nanos/1000000000;
                        
                        const wordObject = {
                            word: item.word,
                            startTime: start,
                            endTime: end,
                        };
                        wordData.push(wordObject);
                        //duringCallback(wordObject);
                        });
                    });
                });
            })
            .on("end", () => {
                endcallback(wordData);
            })
            return recognizeStream;
        } catch (error) {
            throw new Error(error)
        }
    }
}
module.exports = TranscriptionController;
