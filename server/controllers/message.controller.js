// import Message from "../models/message.model.js";
// import Conversation from "../models/conversation.model.js";
// import { asyncHandler } from "../utilities/asyncHandler.utility.js";
// import { errorHandler } from "../utilities/errorHandler.utility.js";
// import {getSocketId, io} from '../socket/socket.js'

// export const sendMessage = asyncHandler(async (req, res, next) => {
//   const senderId = req.user._id;
//   const receiverId = req.params.receiverId;
//   const message = req.body.message;

//   if (!senderId || !receiverId || !message) {
//     return next(new errorHandler("All fields are required", 400));
//   }

//   let conversation = await Conversation.findOne({
//     participants: { $all: [senderId, receiverId] },
//   });

//   if (!conversation) {
//     conversation = await Conversation.create({
//       participants: [senderId, receiverId],
//     });
//   }

//   const newMessage = await Message.create({
//     senderId,
//     receiverId,
//     message,
//   });

//   if (newMessage) {
//     conversation.messages.push(newMessage._id);
//     await conversation.save();
//   }

//   // socket.io
//   const socketId = getSocketId(receiverId)
//   io.to(socketId).emit("newMessage", newMessage);

//   res.status(200).json({
//     success: true,
//     responseData: newMessage,
//   });
// });

// export const getMessages = asyncHandler(async (req, res, next) => {
//   const myId = req.user._id;
//   const otherParticipantId = req.params.otherParticipantId;

//   if (!myId || !otherParticipantId) {
//     return next(new errorHandler("All fields are required", 400));
//   }

//   let conversation = await Conversation.findOne({
//     participants: { $all: [myId, otherParticipantId] },
//   }).populate("messages");

//   res.status(200).json({
//     success: true,
//     responseData: conversation,
//   });
// });

import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { getSocketId, io } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message || "";
  console.log("📩 Incoming request:", {
    body: req.body,
    file: req.file,
  });

  // File upload path (if exists)
  const file = req.file
    ? `${process.env.SERVER_URL}/uploads/messages/${req.file.filename}`
    : null;

  if (!senderId || !receiverId || (!message && !file)) {
    return next(new errorHandler("Message or file is required", 400));
  }

  // Get or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  // Create message with file
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
    file,
  });

  // Push to conversation
  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // socket.io real-time emit
  const socketId = getSocketId(receiverId);
  io.to(socketId).emit("newMessage", newMessage);

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

  let conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  }).populate("messages");

  res.status(200).json({
    success: true,
    responseData: conversation,
  });
});
