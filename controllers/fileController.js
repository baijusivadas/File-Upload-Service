const fileService = require("../services/fileService");
const logger = require("logger").createLogger("logs/controller.log");
logger.setLevel("debug");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");

exports.renderUploadAndGalleryPage = async (req, res) => {
  try {
    logger.info("Rendering upload and gallery page");

    const files = fs.readdirSync(uploadDir);
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp" , '.pdf', '.txt'];
    const images = files.filter((file) =>
      imageExtensions.includes(path.extname(file).toLowerCase())
    );

    res.render("upload_and_gallery", { images, success: null, error: null });
  } catch (error) {
    logger.error("Failed to render gallery page", { error: error.message });
    res.render("upload_and_gallery", {
      images: [],
      error: "Unable to scan image files!",
      success: null,
    });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    logger.info("File upload request received");

    if (!req.file) {
      const files = fs.readdirSync(uploadDir);
      return res.render("upload_and_gallery", {
        images: files,
        error: "No file uploaded.",
        success: null,
      });
    }

    const files = fs.readdirSync(uploadDir);
    res.render("upload_and_gallery", {
      images: files,
      success: "File uploaded successfully.",
      error: null,
    });
  } catch (error) {
    logger.error("Error uploading file", { error: error.message });
    return res.render("upload_and_gallery", {
      images: fs.readdirSync(uploadDir),
      success: null,
      error: error.message,
    });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    logger.info("File download request received");
    const { filename } = req.params;
    const fileStream = fileService.getFileStream(filename);

    if (!fileStream) {
      return res.status(404).json({ error: "File not found" });
    }

    // Get file info for headers
    const fileInfo = await fileService.getFileInfo(filename);

    res.setHeader("Content-Type", fileInfo.mimetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileInfo.originalname}"`
    );

    fileStream.pipe(res);
  } catch (error) {
    logger.error("Error downloading file", { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

exports.getFileInfo = async (req, res) => {
  try {
    logger.info("File info request received");
    const { filename } = req.params;
    const fileInfo = await fileService.getFileInfo(filename);

    if (!fileInfo) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({
      fileInfo,
      size: stats.size,
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
    });
  } catch (error) {
    logger.error("Error getting file info", { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
