const mongoose = require("mongoose");


const watchProject = (projectId, req) => {
    const collection = mongoose.model("Project");
    console.log("Porject id in change stream:", projectId);
    const changeStream = collection.watch({_id : projectId});

    changeStream.on("change", (change) => {
        console.log("Change Event", change);
        req.io.emit('video-update', 'There is a new video');
    });

    changeStream.on("error", (error) => {
        console.log("There is something wrong in change stream", error);
    })
}


module.exports = watchProject;