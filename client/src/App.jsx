
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserProfileThunk } from "./store/slice/user/user.thunk";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes using Outlet */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
