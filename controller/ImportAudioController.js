const fs = require("fs-extra")
const path = require("path");
const GridFS = require("../models/GridFS");

class ImportAudio {
    constructor() {

    }

    async writeToLocal(params){
        try {
            const outputdir =fs.createWriteStream(path.join(__dirname, "..", "temp", `${params.projectId}-audio`, `${params.filename}`)) 
            const input = fs.createReadStream(params.filepath);
            outputdir.on("end", () => {
                outputdir.close();
            })
            if(!fs.existsSync(path.join(__dirname, "..", "temp", `${params.projectId}-audio`))){
                fs.mkdirSync(path.join(__dirname, "..", "temp", `${params.projectId}-audio`));
            }
            return new Promise((resolve, reject) => {
                outputdir.on("finish", ()=> {
                    resolve();
                });
                input.on("error", (error) => {
                    reject(new Error(error));
                });
                input.on("end", () => {
                    input.close();
                })
                input.on("close", () => {
                    fs.unlink(params.filepath, (err) => {
                        if(err){
                            console.log("Error on deleting temp multer audio")
                        } 
                    })
                })
                input.pipe(outputdir);
            })
        } catch (error) {
            throw new Error(error);
        }
    }


    async uploadAudio(params){
        try {
            console.log("Uploading file...");
            const input = fs.createReadStream(params.filepath);
            const bucket = GridFS((error) => {
                throw new Error(error);
            });

            const upload = bucket.openUploadStream(`${params.projectId}.mp3`, {
                metadata: {
                    name: params.filename,
                }    
            })
            input.on("end", () => {
                input.close();
            })
            input.pipe(upload);

            return new Promise((resolve, reject) => {
                upload.on("finish", ()=> {
                    console.log("Audio File Successfully uploaded");
                    resolve();
                })
                upload.on("error", (error) => {
                    reject(new Error(error));
                })
            })
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = ImportAudio;