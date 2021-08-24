const multer = require("multer");
const path = require('path')

const csvFilter = (req, file, cb) => {

    if (file.mimetype.includes("csv") || file.mimetype.includes("application/vnd.ms-excel")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(__baseDir, 'uploads'));
    },
    filename: (req, file, cb) => {

        cb(null, `${file.originalname}-${Date.now()}`);
    },
});

var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
module.exports = uploadFile;