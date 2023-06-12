const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");


module.exports = () => {
    router.post("/", async(req, res) => {
        const bucket = GridFS((error) => {
            console.log("There is error in GridFs");
        });
        const cursor = await bucket.find({"metadata.projectId": req.body._id});
        let data = [];
        if(await cursor.hasNext()){
            for await(const element of cursor) {
                data.push(element);
            };

            res.status(200).json({message: "Your connected", data: data[data.length - 1]})
        } else {
            res.status(400).json({message: "No video found"})
        }
    })

    return router;
}