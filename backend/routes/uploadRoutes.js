const express = require("express");
const { handleFileUpload } = require("../controllers/uploadController.js");
const multer = require("multer");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
});

const router = express.Router();

// route --> /api/upload
router.post("/", upload.single("files"), handleFileUpload);

module.exports = router;
