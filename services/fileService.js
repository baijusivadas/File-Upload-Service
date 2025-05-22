const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const logger = require('logger').createLogger('logs/service.log');
logger.setLevel('debug');

const uploadDir = path.join(__dirname, "../uploads");

// Ensure the upload directory exists
(async () => {
  try {
    await fsPromises.mkdir(uploadDir, { recursive: true });
    logger.info("Upload directory ensured at: " + uploadDir);
  } catch (err) {
    logger.error("Error creating upload directory", { error: err.message });
    process.exit(1); // Exit the process if the upload directory can't be created
  }
})();

// Save file metadata
exports.saveFile = (file) => {
  logger.info("Saving file metadata");
  return {
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    path: file.path,
  };
};

// Get file stream
exports.getFileStream = (filename) => {
  try {
    logger.info("Getting file stream");
    const filePath = path.join(uploadDir, filename);
    // Prevent directory traversal
    if (!filePath.startsWith(uploadDir)) {
      throw new Error("Invalid file path");
    }

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return fs.createReadStream(filePath);
  } catch (err) {
    logger.error("Error getting file stream", { error: err.message });
  }
};

// Get file information
exports.getFileInfo = async (filename) => {
  logger.info("Getting file information");

  const filePath = path.join(uploadDir, filename);

  if (!filePath.startsWith(uploadDir)) {
    throw new Error("Invalid file path");
  }

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const stats = await fs.promises.stat(filePath);
    return {
      filename,
      size: stats.size,
      mimetype: path.extname(filename).slice(1), // Get file extension
      originalname: path.basename(filename),
    };
  } catch (err) {
    logger.error("Error getting file info", { error: err.message });
    return null;
  }
};
