
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtherUsersThunk,
  logoutUserThunk,
} from "../../store/slice/user/user.thunk";
import { useNavigate } from "react-router-dom";
import UserProfileModal from "../../components/Userprofilemodel";

const UserSidebar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false); // ✅ modal state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { otherUsers = [], userProfile = {} } = useSelector(
    (state) => state.userReducer
  );

  const filteredUsers = (
    searchValue
      ? otherUsers.filter((user) =>
          (user?.username + user?.fullName)
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
      : otherUsers
  )?.filter((user) => user._id !== userProfile._id);
  

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    navigate("/login");
  };

  useEffect(() => {
    dispatch(getOtherUsersThunk());
  }, [dispatch]);

  return (
    <>
      <div className="max-w-[22em] w-full h-screen flex flex-col bg-[#0F111A] text-white border-r border-white/10 backdrop-blur-md shadow-lg">
        {/* Header */}
        <div className="w-full px-4 pt-6 pb-4 border-b border-white/10">
          <h1 className="text-3xl font-extrabold text-center text-[#7480FF] tracking-wide bg-gradient-to-r from-[#1e1e2d] via-[#0e0e18] to-[#1e1e2d] py-3 rounded-xl shadow-inner shadow-[#7480FF]/30">
            Chatgram
          </h1>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search users..."
              className="w-full bg-[#1C1F2E] text-sm rounded-xl px-4 py-2 pl-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7480FF]/50 transition-all"
            />
            <IoSearch className="absolute top-2.5 left-3 text-[#7480FF] text-lg" />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-3 scrollbar-thin scrollbar-thumb-[#7480FF]/30 scrollbar-track-transparent">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((userDetails) => (
              <User key={userDetails._id} userDetails={userDetails} />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No users found</p>
          )}
        </div>

        {/* Footer - Logged-in user info + logout */}
        <div className="px-4 py-4 border-t border-white/10 bg-[#0F111A]/70">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsProfileOpen(true)} // ✅ open modal
            >
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring ring-[#7480FF]/60 ring-offset-2 ring-offset-[#0F111A]">
                  <img src={userProfile?.avatar} alt="avatar" />
                </div>
              </div>
              <div className="text-sm font-medium">{userProfile?.username}</div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-[#7480FF] hover:bg-[#5e6fff] text-white text-sm px-4 py-1.5 rounded-xl transition-all shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal for logged-in user */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={userProfile}
      />
    </>
  );
};

export default UserSidebar;
