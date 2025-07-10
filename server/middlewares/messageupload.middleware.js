import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = "uploads/messages";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config for messages
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

// Optional: allow all files for now (images, pdf, docs, etc.)
const fileFilter = (req, file, cb) => {
  cb(null, true); 
};

export const uploadMessageFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
});
