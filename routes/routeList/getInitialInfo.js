const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");
const fs = require("fs-extra");
const path = require("path");


module.exports = () => {
    router.post("/", async(req, res) => {
        try {
            req.io.to(req.body.socketId).emit('retrieving-project', {state: true, message: 'Retriving project...'});
            const historyIndex = req.body.historyIndex;
            const bucket = GridFS((error) => {
                console.log("There is error in GridFs");
            });
            const cursor = await bucket.find({"metadata.projectId": req.body.projectDetails._id});
            let data = [];
            const downloadvideo =  bucket.openDownloadStreamByName(`${req.body.projectDetails._id}.mp4`);
            if(await cursor.hasNext()){
                for await(const element of cursor) {
                    data.push(element);
                };
                if(fs.existsSync(path.join(__dirname, "..","..", "temp",`${req.body.projectDetails._id}`, `${req.body.projectDetails._id}${historyIndex}.mp4`))){
                    console.log("GetInitial Information: Video is available on the server")
                    req.io.to(req.body.socketId).emit('retrieving-project', {state: false, message: 'Retriving project...'});
                    res.status(200).json({message: "Your connected", data: data[data.length - 1]})
                } else {
                    console.log("GetInitial Information: Video is not available on the server")
                    let percentage = 0;
                    let currentChunkSize = 0;
                    let folder = path.join(__dirname, "..","..", "temp",`${req.body.projectDetails._id}`);
                    if(!fs.existsSync(folder)) {
                        fs.mkdirSync(folder)
                    }
                    const writeStream = fs.createWriteStream(path.join(folder, `${req.body.projectDetails._id}${historyIndex}.mp4`));
                    downloadvideo.pipe(writeStream);
                    
                    writeStream.on('finish', () => {
                        req.io.to(req.body.socketId).emit('retrieving-project', {state: false, message: 'Retriving project...'});
                        res.status(200).json({message: "Your connected", data: data[data.length - 1]})
                    })
                    writeStream.on("end", () => {
                        writeStream.close();
                    })
                    downloadvideo.on("data", (chunk) => {
                        currentChunkSize = chunk.length + currentChunkSize;
                        percentage = ((currentChunkSize/ data[data.length - 1].length) * 100)
                        console.log(percentage)
                        req.io.to(req.body.socketId).emit('retrieving-project', {state: true, message: `Retriving project : ${percentage.toFixed(1)}%`});
                    })
                }
            } else {
                req.io.to(req.body.socketId).emit('retrieving-project', {state: false, message: 'Retriving project...'});
                res.status(400).json({message: "No video found"})
                
            }

            const getAudios = async() => {
                console.log("Getting audios");
                const audio = await bucket.find({ filename : `${req.body.projectDetails._id}.mp3`});
                let audiofiles = [];
                if(await audio.hasNext()){
                    for await(const element of audio) {
                        audiofiles.push(element);
                    };

                    for(let i = 0; i<audiofiles.length; i++){
                        const output = fs.createWriteStream(path.join(__dirname, "..","..", "temp",`${req.body.projectDetails._id}-audio`, `${audiofiles[i].metadata.name}`));
                        const input = bucket.openDownloadStream(audiofiles[i]._id);
                        let folder = path.join(__dirname, "..","..", "temp",`${req.body.projectDetails._id}-audio`);
                        if(!fs.existsSync(folder)) {
                            fs.mkdirSync(folder)
                        }
                        input.pipe(output);
                        output.on("end", () => {
                            output.close();
                        })
                    }
                }
            }

            getAudios();
        } catch (error) {
            req.io.to(req.body.socketId).emit('retrieving-project', {state: false, message: 'Retriving project...'});
            res.status(400).json({message: "No video found"})
        }
    })

    return router;
}