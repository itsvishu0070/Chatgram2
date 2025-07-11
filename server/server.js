import { app, server } from "./socket/socket.js";
import express from "express";
import { connectDB } from "./db/connection1.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
connectDB();

// ✅ Stable CORS setup with whitelist
const whitelist = ["https://chatgram2.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Static files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ✅ Root route for uptime monitoring
app.get("/", (req, res) => {
  res.send("✅ Chatgram backend is running");
});

// ✅ Routes
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// ✅ Error middleware
import { errorMiddleware } from "./middlewares/error.middlware.js";
app.use(errorMiddleware);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
