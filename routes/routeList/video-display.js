const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");

module.exports = () => {

    router.get("/:projectId/:sokcetId", async(req, res) => {
        const socketId = req.params.sokcetId;
        const projectId = req.params.projectId;
        req.io.to(socketId).emit('retrieve-start', 'Retriving project...');


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
                'Content-Type': 'video/mp4'
            });

            bucket.openDownloadStreamByName(data[data.length - 1].filename, {start : Number(parsedStart), end : Number(data[data.length - 1].length)}).pipe(res);
        } 
        else {
            res.writeHead(200, {
                'Content-Length': data[data.length - 1].length,
                'Content-Type': 'video/mp4'
            });
            bucket.openDownloadStreamByName(data[data.length - 1].filename).pipe(res);
        }
        req.io.to(socketId).emit('retrieve-end');
        }      
    });
    return router;
}