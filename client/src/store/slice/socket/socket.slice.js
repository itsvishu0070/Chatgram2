import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
  socket: null,
  onlineUsers: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      const socket = io(import.meta.env.VITE_SERVER_URL, {
        withCredentials: true,
        transports: ["websocket"], // 👈 Force WebSocket to avoid polling issues
        query: {
          userId: action.payload,
        },
      });

      state.socket = socket;

      // Optional debug listener
      socket.on("connect", () => {
        console.log("✅ Connected to socket server:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
      });
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { initializeSocket, setOnlineUsers } = socketSlice.actions;

export default socketSlice.reducer;
