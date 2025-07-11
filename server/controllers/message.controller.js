import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { getSocketId, io } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message?.trim() || "";

  console.log("📩 Incoming request:", {
    body: req.body,
    file: req.file,
  });

  const file = req.file?.path || null; // ✅ Cloudinary URL

  if (!senderId || !receiverId || (!message && !file)) {
    return next(new errorHandler("Message or file is required", 400));
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
    file,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  const socketId = getSocketId(receiverId);
  if (socketId) {
    io.to(socketId).emit("newMessage", newMessage);
  }

  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
});


export const getMessages = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const otherParticipantId = req.params.otherParticipantId;

  if (!myId || !otherParticipantId) {
    return next(new errorHandler("All fields are required", 400));
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  }).populate("messages");

  if (!conversation) {
    return res.status(200).json({
      success: true,
      responseData: { messages: [] },
    });
  }

  res.status(200).json({
    success: true,
    responseData: {
      messages: conversation.messages,
    },
  });
});
