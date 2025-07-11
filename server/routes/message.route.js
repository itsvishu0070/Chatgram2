import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { uploadMessageAttachment } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/send/:receiverId",
  isAuthenticated,
  uploadMessageAttachment.single("file"), // ✅ Cloudinary upload
  sendMessage
);

router.get("/get-messages/:otherParticipantId", isAuthenticated, getMessages);

export default router;
