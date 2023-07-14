const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");


module.exports = () => {
    router.get("/:projectId", (req, res) => {
        const projectId = req.params.projectId;
        let folder = path.join(__dirname, "..","..", "temp",`${projectId}-audio`);
        if(fs.existsSync(folder)){
            const files = fs.readdirSync(folder);
            res.status(200).json({files: files});
        } else {
            res.sendStatus(400);
        }
    })

    return router;
}