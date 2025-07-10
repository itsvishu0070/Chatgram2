
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateProfileThunk,
  getUserProfileThunk,
} from "../store/slice/user/user.thunk";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    avatar: user?.avatar || "",
  });

  const [previewImage, setPreviewImage] = useState(
    user?.avatar || "/default-avatar.png"
  );

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
      avatar: user?.avatar || "",
    });
    setPreviewImage(user?.avatar || "/default-avatar.png");
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("reader.result (preview):", reader.result);
      setPreviewImage(reader.result); // preview
      setFormData((prev) => ({
        ...prev,
        avatar: file, // upload
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("username", formData.username);
      if (formData.avatar instanceof File) {
        form.append("avatar", formData.avatar);
      }

      await dispatch(updateProfileThunk(form)).unwrap();
      await dispatch(getUserProfileThunk());
      toast.success("Profile updated!");
      setEditMode(false);
      onClose();
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative bg-[#0F111A] p-6 rounded-2xl w-[90%] max-w-md text-white shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-500 text-2xl"
        >
          <IoMdClose />
        </button>

        <div className="flex flex-col items-center space-y-3">
          <div className="relative flex flex-col items-center">
            <img
              key={previewImage}
              src={
                previewImage
                  ? `${previewImage}?t=${Date.now()}`
                  : "/default-avatar.png"
              }
              alt="avatar"
              className="w-24 h-24 rounded-full ring-4 ring-[#7480FF]/50 object-cover"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-2 text-xs"
              />
            )}
          </div>

          <div className="text-center space-y-1">
            {editMode ? (
              <>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 text-center text-lg font-semibold focus:outline-none"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 text-center text-[#7480FF] font-medium focus:outline-none"
                  placeholder="@username"
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{formData.fullName}</h2>
                <p className="text-[#7480FF] font-medium">
                  @{formData.username}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-[#7480FF] hover:bg-[#6273f5] py-2 px-4 rounded-lg text-sm font-semibold transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    fullName: user.fullName,
                    username: user.username,
                    avatar: user.avatar,
                  });
                  setPreviewImage(user.avatar || "/default-avatar.png");
                }}
                className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#7480FF] hover:bg-[#6273f5] w-full py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
