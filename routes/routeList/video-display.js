const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");
const ChangeStream = require("../../models/ChangeStream");
const fs = require("fs");
const path = require("path");
module.exports = () => {

    router.get("/:projectId/:sokcetId/:historyIndex", async(req, res, next) => {
        try {
            const socketId = req.params.sokcetId;
            const projectId = req.params.projectId;
            const historyIndex = req.params.historyIndex;
       
            req.io.to(socketId).emit('retrieve-start', 'Retriving project...');

            //ChangeStream(projectId, req);
            const bucket = GridFS((error) => {
                console.log("Error in GridFs", error);
            })
        
        const cursor = await bucket.find({"metadata.projectId": projectId});
        let data = [];

        if(await cursor.hasNext()){
            for await(const element of cursor) {
                data.push(element);
        };
        
            const range = req.headers.range;

            if(range) {
               
                const [start, end] = range.replace(/bytes=/, '').split('-');
                const parsedStart = parseInt(start, 10);
                const parsedEnd = end ? parseInt(end, 10) : data[data.length - 1].length  - 1;
                const contentLength = (parsedEnd - parsedStart) + 1;

                
                res.writeHead(206, {
                    'Content-Range': `bytes ${parsedStart}-${parsedEnd}/${data[data.length - 1].length}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': contentLength,
                    'Content-Type': 'video/webm',
                    'Cache-Control': 'public, max-age=3600',
                });
        
                if(fs.existsSync(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.webm`))){
                    const stream = fs.createReadStream(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.webm`), {start : Number(parsedStart), end : Number(data[data.length - 1].length)}).pipe(res);
                    stream.on("error", () => {
                        res.sendStatus(500);
                    })
                } else {
                    const stream = bucket.openDownloadStreamByName(`${projectId}.webm`, {start : Number(parsedStart), end : Number(data[data.length - 1].length)}).pipe(res);
                    stream.on("error", () => {
                        res.sendStatus(500);
                    })
                }
            } 
            else {
                console.log("Non - Range");
                res.writeHead(200, {
                    'Content-Length': data[data.length - 1].length,
                    'Content-Type': 'video/webm',
                    'Cache-Control': 'public, max-age=3600',
                });
            
                if(fs.existsSync(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.webm`))){
                    console.log("It exist");
                    fs.createReadStream(path.join(__dirname, "..","..", "temp",`${projectId}`, `${projectId}${historyIndex}.webm`), {start : Number(parsedStart), end : Number(data[data.length - 1].length)}).pipe(res);
                } else {
                    console.log('It doesnt exist');
                    bucket.openDownloadStreamByName(`${projectId}.webm`, {start : Number(parsedStart), end : Number(data[data.length - 1].length)}).pipe(res);
                }
            }
        }      
        } catch (error) {
            next(error);
        }
    });
    return router;
}