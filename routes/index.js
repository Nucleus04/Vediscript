const express = require("express");
const signupRoute = require("./routeList/signup");
const signinRoute = require("./routeList/signin");

const router = express.Router();

module.exports = () => {
    router.use("/signin", signinRoute());
    router.use("/signup",signupRoute());
    return router;
}