const express = require("express");
const router = express.Router();
const multer = require("multer");

module.exports = () => {

    const upload = multer({
        dest: 'uploads/',
        fileFilter: (req, file, cb) => {
        
            if (file.mimetype.startsWith('video/')) {
            cb(null, true);
            } else {
            cb(new Error('Only video files are allowed!'), false);
            }
        },

    });

    const UploadErrorChecker = (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            res.status(400).json({ status: "fail", message: "Error during file upload." });
        } else {
            res.status(400).json({ status: "fail", message: err.message });
        }
    }

    router.post("/",upload.single('video'),UploadErrorChecker, (req, res) => {

          console.log(req.body);
          console.log("This is the file:", req.file);
        res.sendStatus(200);
    });
    
    return router;
}