const multer = require("multer");
const path = require("path");

const tempDirection = path.join(__dirname, "../temp");

const multerConfig = multer.diskStorage({
  destination: tempDirection,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: multerConfig,
});

module.exports = { uploadFile };
