import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileThunk } from "./store/slice/user/user.thunk";
import { initializeSocket } from "./store/slice/socket/socket.slice"; // 👈
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, []);

  useEffect(() => {
    if (userProfile?._id) {
      dispatch(initializeSocket(userProfile._id)); 
    }
  }, [userProfile?._id]);

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
