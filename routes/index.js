const express = require("express");
const signupRoute = require("./routeList/signup");
const signinRoute = require("./routeList/signin");
const createNewProject = require("./routeList/createNewProject");
const authenticateToken = require("./middleware/authenticateToken");
const retrieveProject = require("./routeList/retrieveProject");

const router = express.Router();

module.exports = () => {
    router.use("/signin", signinRoute());
    router.use("/signup",signupRoute());
    router.use("/create-project",authenticateToken(), createNewProject());
    router.use("/retrieve-projects", authenticateToken(), retrieveProject());
    return router;
}