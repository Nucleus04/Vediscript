const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");
const fs = require("fs-extra");
const path = require("path");
module.exports = () => {

    let activeReadStream = null;
    router.get("/:projectId/:sokcetId/:historyIndex/:numberOfChanges", async(req, res, next) => {
        try {
            if (activeReadStream) {
                activeReadStream.destroy();
            }
            const socketId = req.params.sokcetId;
            const projectId = req.params.projectId;
            let historyIndex = req.params.historyIndex;
            const numberOfChanges = req.params.numberOfChanges; 
            req.io.to(socketId).emit('retrieve-start', 'Retriving project...');
            const range = req.headers.range;
            const countFiles = async() => {
                const files = fs.readdirSync(path.join(__dirname, "..","..", "temp",`${projectId}`));
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
            }
            await countFiles();
            if(range) {
                let videoSize;
                if(fs.existsSync(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`))){
                    const stat = fs.statSync(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`))
                    videoSize = stat.size;
                }else{
                    res.sendStatus(500);
                }

                const [start, end] = range.replace(/bytes=/, '').split('-');
                const parsedStart = parseInt(start, 10);
                const parsedEnd = end ? parseInt(end, 10) : videoSize -1;
                const contentLength = (parsedEnd - parsedStart) + 1;
               
                res.writeHead(206, {
                    'Content-Range': `bytes ${parsedStart}-${parsedEnd}/${videoSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': contentLength,
                    'Content-Type': 'video/mp4',
                    'Cache-Control': 'public, max-age=3600',
                });
                const stream = fs.createReadStream(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.mp4`), {start: Number(parsedStart), end: Number(parsedEnd)});
                activeReadStream = stream;
                stream.pipe(res);
                stream.on("error", () => {
                    stream.destroy();
                    res.sendStatus(500);
                })
                stream.on("end", () => {
                    stream.destroy();
                });
                stream.on("close", () => {
                    console.log("Closed");
                    stream.unpipe(res);
                    stream.destroy();
                });
    
            } 
        } catch (error) {
            next(error);
        }
    });
    return router;
}