
import React, { useEffect } from "react";
import User from "./User";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { getMessageThunk } from "../../store/slice/message/message.thunk";
import SendMessage from "./SendMessage";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages } = useSelector((state) => state.messageReducer);

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ recieverId: selectedUser._id }));
    }
  }, [selectedUser?._id]);

  return (
    <>
      {!selectedUser ? (
        <div className="w-full flex items-center justify-center flex-col gap-5 text-white">
          <h2 className="text-2xl font-bold">Welcome to Chatgram</h2>
          <p className="text-xl opacity-80">
            Please select a person to continue your chat!!
          </p>
        </div>
      ) : (
        <div className="h-screen w-full flex flex-col bg-gradient-to-tr from-[#0d0c1d] via-[#1e1b32] to-[#11101c] text-white">
          {/* Chat Header */}
          <div className="p-3 border-b border-b-white/10">
            <User userDetails={selectedUser} />
          </div>

          {/* Message List */}
          <div className="h-full overflow-y-auto p-3 space-y-2">
            {Array.isArray(messages) &&
              messages.map((messageDetails) => (
                <Message
                  key={messageDetails?._id}
                  messageDetails={messageDetails}
                />
              ))}
          </div>

          <SendMessage />
        </div>
      )}
    </>
  );
};

export default MessageContainer;

