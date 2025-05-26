const multer = require("multer");
const path = require("path");
const os = require("os");

// Use OS temp directory for uploads (since files are immediately uploaded to Cloudinary)
const petUpload = multer({ dest: os.tmpdir() });
const userUpload = multer({ dest: os.tmpdir() });

module.exports = { petUpload, userUpload };
