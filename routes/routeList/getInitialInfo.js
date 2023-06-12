const express = require("express");
const router = express.Router();
const GridFS = require("../../models/GridFS");


module.exports = () => {
    router.post("/", async(req, res) => {
        console.log(req.body);
        const bucket = GridFS((error) => {
            console.log("There is error in GridFs");
        });
        const cursor = await bucket.find({filename: req.body._id});

        cursor.forEach(element => {
            console.log(element);
        });
        res.status(200).json({message: "Your connected"})
    })

    return router;
}