const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");


module.exports = () => {
    router.get("/:projectId", async(req,res) => {
        const projectId = req.params.projectId;
        const bucket = GridFS((error) => {
            console.log("There is error in GridFs");
        });
        const cursor = await bucket.find({"metadata.projectId": projectId});
        let data = [];
        if(await cursor.hasNext()){
            for await(const element of cursor) {
                data.push(element);
            };

            res.status(200).json({message: "Your connected", data: data[data.length - 1].metadata.transcription})
        } else {
            res.status(400).json({message: "Transcription not found"})
        }
    });
    return router;
}