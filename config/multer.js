const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const petPostStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/petImages");
  },
  filename: function (req, file, cb) {
    const fn = crypto.randomBytes(10, (err, bytes) => {
      const fn = bytes.toString("hex") + path.extname(file.originalname);

      cb(null, fn);
    });
  },
});
const userPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/userImages");
  },
  filename: function (req, file, cb) {
    const fn = crypto.randomBytes(10, (err, bytes) => {
      const fn = bytes.toString("hex") + path.extname(file.originalname);

      cb(null, fn);
    });
  },
});

const petUpload = multer({ storage: petPostStorage });
const userUpload = multer({ storage: userPicStorage });
module.exports = { petUpload, userUpload };
