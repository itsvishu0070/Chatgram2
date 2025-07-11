// middlewares/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// ========== Avatar Upload ========== //
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "png", "webp"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
});

// ========== Message Attachment Upload ========== //
const messageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "messages",
    allowed_formats: ["jpg", "png", "webp", "mp4", "pdf"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

export const uploadMessageAttachment = multer({
  storage: messageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
});
