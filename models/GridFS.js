const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const GridFS = (callback) => {
    try {
        const connection = mongoose.connection;
        const db = connection.db;
        const bucket = new GridFSBucket(db, {bucketName: "Video"})
        return bucket;

    } catch (error) {
        callback(error);
    }
}

module.exports = GridFS;