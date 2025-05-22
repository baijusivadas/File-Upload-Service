const upload = require("../config/storage");

exports.handleUpload = (req, res, next) => {
  const uploadSingle = upload.single("file");

  uploadSingle(req, res, (err) => {

    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // File uploaded successfully
    req.filePath = req.file.path; // Store the file path in the request object
    next();
  });
};
