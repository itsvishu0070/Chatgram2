
import express from "express";
import { isAuthenticated } from "../middlewares/auth.middlware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { uploadMessageFile } from "../middlewares/messageupload.middleware.js";// ✅ import added

const router = express.Router();

//  multer middleware to support file upload in message
router.post(
  "/send/:receiverId",
  isAuthenticated,
  uploadMessageFile.single("file"), //Handle file field from FormData
  sendMessage
);

router.get("/get-messages/:otherParticipantId", isAuthenticated, getMessages);

export default router;
