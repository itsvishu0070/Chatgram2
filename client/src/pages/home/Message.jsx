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

  const isSender =
    userProfile?._id === messageDetails?.senderId?._id ||
    userProfile?._id === messageDetails?.senderId;

  const avatar = isSender ? userProfile?.avatar : selectedUser?.avatar;

  const fileUrl = messageDetails?.file?.startsWith("http")
    ? messageDetails.file
    : `${import.meta.env.VITE_SERVER_URL}${messageDetails.file || ""}`;

const renderFilePreview = () => {
  if (!messageDetails?.file) return null;

  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);
  const isPDF = /\.pdf$/i.test(fileUrl);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(fileUrl);

  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt="Image attachment"
        className="max-w-[200px] rounded-lg mt-2 border border-white/10"
      />
    );
  }

  if (isVideo) {
    return (
      <video
        controls
        src={fileUrl}
        className="max-w-[300px] mt-2 rounded-lg border border-white/10"
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

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm underline text-blue-400 mt-2 inline-block"
    >
      📎 Download Attachment
    </a>
  );
};

  return (
    <div
      ref={messageRef}
      className={`chat ${isSender ? "chat-end" : "chat-start"}`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="user avatar" src={avatar} />
        </div>
      </div>

      <div className="chat-header">
        <time className="text-xs opacity-50">{formattedTime}</time>
      </div>

      <div className="chat-bubble">
        {messageDetails?.message}
        {renderFilePreview()}
      </div>
    </div>
  );
};

export default Message;
