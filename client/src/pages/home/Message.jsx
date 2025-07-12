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
  const fallbackAvatar = "/fallback-image.png"; // Optional default

  const filePath = messageDetails?.file;
  const fileUrl =
    typeof filePath === "string" && filePath.startsWith("http")
      ? filePath
      : null;

  const renderFilePreview = () => {
    if (!fileUrl) return null;

    const extension = fileUrl.split(".").pop().toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension);
    const isVideo = ["mp4", "webm", "ogg"].includes(extension);
    const isPDF = extension === "pdf";

    if (isImage) {
      return (
        <img
          src={fileUrl}
          alt="attachment"
          className="max-w-[200px] mt-2 rounded-lg border border-white/10"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackAvatar;
          }}
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
        📎 Download File
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
          <img
            src={avatar || fallbackAvatar}
            alt="user avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackAvatar;
            }}
          />
        </div>
      </div>

      <div className="chat-header">
        <time className="text-xs opacity-50">{formattedTime}</time>
      </div>

      <div className="chat-bubble whitespace-pre-wrap break-words">
        {messageDetails?.message}
        {renderFilePreview()}
      </div>
    </div>
  );
};

export default Message;
