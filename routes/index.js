const express = require("express");
const signupRoute = require("./routeList/signup");
const signinRoute = require("./routeList/signin");
const createNewProject = require("./routeList/createNewProject");
const authenticateToken = require("./middleware/authenticateToken");
const retrieveProject = require("./routeList/retrieveProject");
const editDetail = require("./routeList/editProjectDetail");
const deleteProject = require("./routeList/deleteProject");
const uploadVideo = require("./routeList/uploadVideo");
const videoDisplay = require("./routeList/video-display");
const getInitialInfo = require("./routeList/getInitialInfo");
const getTranscription = require("./routeList/getTranscription");
const removeAudio = require("./routeList/remove-audio");

const router = express.Router();

module.exports = () => {
    router.use("/signin", signinRoute());
    router.use("/signup",signupRoute());
    router.use("/create-project",authenticateToken(), createNewProject());
    router.use("/retrieve-projects", authenticateToken(), retrieveProject());
    router.use("/edit-project", authenticateToken(), editDetail());
    router.use("/delete-project", authenticateToken(), deleteProject());
    router.use("/upload-video", authenticateToken(), uploadVideo());
    router.use("/video-display", videoDisplay());
    router.use("/get-initial-info", authenticateToken(), getInitialInfo());
    router.use("/get-transcription", getTranscription());
    router.use("/remove-audio", authenticateToken(), removeAudio());
    return router;
}