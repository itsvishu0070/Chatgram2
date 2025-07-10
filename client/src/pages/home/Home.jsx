import React, { useEffect } from "react";
import UserSidebar from "./UserSidebar";
import MessageContainer from "./MessageContainer";

import { useDispatch, useSelector } from "react-redux";
import {
  initializeSocket,
  setOnlineUsers,
} from "../../store/slice/socket/socket.slice";
import { setNewMessage } from "../../store/slice/message/message.slice";

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector(
    (state) => state.userReducer
  );
  const { socket } = useSelector((state) => state.socketReducer);

  // ✅ 1. Initialize socket when authenticated
  useEffect(() => {
    if (!isAuthenticated || !userProfile?._id) return;
    dispatch(initializeSocket(userProfile._id));
  }, [isAuthenticated, userProfile?._id, dispatch]);

  // ✅ 2. Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    };

    const handleNewMessage = (newMessage) => {
      dispatch(setNewMessage(newMessage));
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("newMessage", handleNewMessage);

    // ✅ 3. Cleanup to avoid duplicate listeners
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("newMessage", handleNewMessage);
      socket.close(); // Optional: Close socket on unmount if needed
    };
  }, [socket, dispatch]);

  return (
    <div className="flex">
      <UserSidebar />
      <MessageContainer />
    </div>
  );
};

export default Home;
