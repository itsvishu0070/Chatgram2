
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../../store/slice/user/user.thunk";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.userReducer);

  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Password and confirm password do not match");
    }
    const response = await dispatch(registerUserThunk(signupData));
    if (response?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 relative overflow-hidden text-white">
  
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-0 left-0"></div>
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-0 right-0 animation-delay-2000"></div>
      <div className="absolute w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob bottom-0 left-1/2 transform -translate-x-1/2 animation-delay-4000"></div>

    
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#91a7ff]">
          👤 Create Account
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full name"
              value={signupData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#1e1b32] text-white border border-[#91a7ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7480FF]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={signupData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#1e1b32] text-white border border-[#91a7ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7480FF]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#1e1b32] text-white border border-[#91a7ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7480FF]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={signupData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#1e1b32] text-white border border-[#91a7ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7480FF]"
              required
            />
          </div>

          <div className="flex items-center justify-around">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={signupData.gender === "male"}
                onChange={handleInputChange}
                className="radio radio-primary"
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={signupData.gender === "female"}
                onChange={handleInputChange}
                className="radio radio-primary"
              />
              Female
            </label>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-[#7480FF] hover:bg-[#5c69ff] transition-all text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Signup
          </button>
        </div>

        <p className="text-sm text-gray-300 mt-6 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#7480FF] hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
