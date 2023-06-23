const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
    },
    projectName: {
        type: String,
        required: true,
        trim: true,
    },
    projectDescription: {
        type: String, 
        required: true,
        trim: true,
    },
    videoId: {
        type: String,
    }
}, {timestamps : true});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;