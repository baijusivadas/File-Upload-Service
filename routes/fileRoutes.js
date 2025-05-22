const express = require("express");
const router = express.Router();

// Import the file controller
const fileController = require("../controllers/fileController");
// Import the file upload middleware
const fileUpload = require("../middlewares/fileUpload");
//import helmet for security
const helmet = require("helmet");

// Apply security middleware
router.use(helmet());
router.use(express.json());

//get all files route
router.get("/", fileController.renderUploadAndGalleryPage);

//file upload route
router.post("/upload", fileUpload.handleUpload, fileController.uploadFile);

//file download route
router.get("/download/:filename", fileController.downloadFile);

//file info route
router.get("/info/:filename", fileController.getFileInfo);

module.exports = router;
