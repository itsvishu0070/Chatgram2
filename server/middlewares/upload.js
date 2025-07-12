// ==================== upload.js ====================
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utilities/cloudinary.js";

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "png", "webp"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const messageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "messages",
    allowed_formats: ["jpg", "png", "webp", "mp4", "pdf"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
  },
});

export const uploadMessageAttachment = multer({
  storage: messageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
