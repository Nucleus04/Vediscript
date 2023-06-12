const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");

module.exports = () => {

    router.get("/:projectId", async(req, res) => {
        const projectId = req.params.projectId;
        const bucket = GridFS((error) => {
            console.log("Error in GridFs", error);
        })
        //console.log("video", req.body._id);
        const cursor = await bucket.find({"metadata.projectId": projectId});
        let data = [];
        if(await cursor.hasNext()){
            for await(const element of cursor) {
                data.push(element);
        };

        bucket.openDownloadStreamByName(data[data.length - 1].filename).pipe(res);
        }
        //console.log("videoid", data[data.length - 1]._id)
      
    });
    return router;
}