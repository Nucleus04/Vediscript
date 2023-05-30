const express = require("express");
const router = express.Router();
const UserController = require("../../controller/SignupController");

module.exports = () => {
    router.post("/", async(req, res) => {
        const { name, email, password } = req.body;
        try {
            const User = new UserController(name, email, password);
            await User.save();
            res.sendStatus(200);
        } catch (error) {
            console.log("There has been error saving a user");
            res.sendStatus(500);
        }
        
    });

    return router;
}


