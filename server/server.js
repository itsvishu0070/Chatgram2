import { app, server } from "./socket/socket.js";
import express from "express";
import { connectDB } from "./db/connection1.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
connectDB();


app.use(
  cors({
    origin: [process.env.CLIENT_URL], 
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);


import { errorMiddleware } from "./middlewares/error.middlware.js";
app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
