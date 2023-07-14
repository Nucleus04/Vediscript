const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");

module.exports = () => {
    let activeReadStream = null;
    router.get("/:projectId/:filename", (req, res) => {
        try {
            if (activeReadStream) {
                activeReadStream.destroy();
            }
            const projectId = req.params.projectId;
            const filename = req.params.filename;
            const filepath = path.join(__dirname, "..","..", "temp",`${projectId}-audio`,`${filename}`)
            if(fs.existsSync(filepath)){
                console.log("File exist");
                const input = fs.createReadStream(path.join(__dirname, "..","..", "temp",`${projectId}-audio`,`${filename}`));
                input.on("end", () => {
                    console.log("Audio close")
                    input.close();
                })
                activeReadStream = input;
                input.pipe(res);
            } else {
                res.sendStatus(402);
            }
        } catch (error) {
            console.log(error);
        }
    })

    return router;
}