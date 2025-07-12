import express from "express";
import { app, server } from "./socket/socket.js";
import { connectDB } from "./db/connection1.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
connectDB();

// ===== ✅ CORS CONFIGURATION =====
const whitelist = ["https://chatgram2.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight request handler

// ===== ✅ MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());

// ===== ✅ STATIC FILES =====
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ===== ✅ UPTIME CHECK =====
app.get("/", (req, res) => {
  res.send("✅ Chatgram backend is running");
});

// ===== ✅ ROUTES =====
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// ===== ✅ ERROR HANDLER =====
import { errorMiddleware } from "./middlewares/error.middlware.js";
app.use(errorMiddleware);

// ===== ✅ START SERVER =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
