const multer = require("multer");

class UploadController {
    constructor () {

    }

    handleFileviaMulter = () => {
        console.log("I am in multer");
        const upload = multer({
            dest:"uploads/",
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('video/')) {
                cb(null, true);
                } else {
                cb(new Error('Only video files are allowed!'), false);
                }
            },
    
        });
        return upload;
    }
    uploadErrorChecker = () => {

        const UploadErrorChecker = (err, req, res, next) => {
            console.log("File checking");
            if (res.headersSent) {
                return;
            }
            if (err instanceof multer.MulterError) {
                res.status(400).json({ status: "fail", message: "Error during file upload." });
                return;
            } else {
                res.status(400).json({ status: "fail", message: err.message });
                return;
            }
        }

        return UploadErrorChecker;
    }
}

module.exports = UploadController;