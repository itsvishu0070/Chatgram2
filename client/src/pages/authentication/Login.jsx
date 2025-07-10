import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../../store/slice/user/user.thunk";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, buttonLoading } = useSelector(
    (state) => state.userReducer
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUserThunk(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 relative overflow-hidden text-white">
      {/* Glowing blurred blobs */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-0 left-0"></div>
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-0 right-0 animation-delay-2000"></div>
      <div className="absolute w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob bottom-0 left-1/2 transform -translate-x-1/2 animation-delay-4000"></div>

      {/* Login card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#91a7ff]">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1b32] text-white border border-[#91a7ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7480FF]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e1b32] text-white border border-[#91a7ff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7480FF]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#7480FF] hover:bg-[#5c69ff] transition-all text-white font-semibold py-2 rounded-lg shadow-md"
            disabled={buttonLoading}
          >
            {buttonLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-6 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#7480FF] hover:underline cursor-pointer"
          >
            Signup here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
