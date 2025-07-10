
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const Message = ({ messageDetails }) => {
  const messageRef = useRef(null);
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const formattedTime = moment(messageDetails?.createdAt).format("hh:mm A");

  const isSender = userProfile?._id === messageDetails?.senderId;
  const avatar = isSender ? userProfile?.avatar : selectedUser?.avatar;

  // File preview handler
  const renderFilePreview = () => {
    if (!messageDetails?.file) return null;

    const fileUrl = messageDetails.file;
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);
    const isPDF = /\.pdf$/i.test(fileUrl);

    if (isImage) {
      return (
        <img
          src={fileUrl}
          alt="attachment"
          className="max-w-[200px] rounded-lg mt-2 border border-white/10"
        />
      );
    }

    if (isPDF) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline text-blue-400 mt-2 inline-block"
        >
          📄 View PDF
        </a>
      );
    }

    // For other file types
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline text-blue-400 mt-2 inline-block"
      >
        📎 Download File
      </a>
    );
  };

  return (
    <div
      ref={messageRef}
      className={`chat ${isSender ? "chat-end" : "chat-start"}`}
    >
      {/* Avatar */}
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="user avatar" src={avatar} />
        </div>
      </div>

      {/* Time */}
      <div className="chat-header">
        <time className="text-xs opacity-50">{formattedTime}</time>
      </div>

      {/* Message bubble */}
      <div className="chat-bubble">
        {messageDetails?.message}
        {renderFilePreview()}
      </div>
    </div>
  );
};

export default Message;

