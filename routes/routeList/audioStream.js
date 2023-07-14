const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");

module.exports = () => {
    router.get("/:projectId/:filename", (req, res) => {
        try {
            const projectId = req.params.projectId;
            const filename = req.params.filename;
            const filepath = path.join(__dirname, "..","..", "temp",`${projectId}-audio`,`${filename}`)
            if(fs.existsSync(filepath)){
                console.log("File exist");
                const input = fs.createReadStream(path.join(__dirname, "..","..", "temp",`${projectId}-audio`,`${filename}`));
                input.on("end", () => {
                    input.close();
                })
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