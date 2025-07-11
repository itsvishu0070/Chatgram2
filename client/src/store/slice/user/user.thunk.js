import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utitlities/axiosInstance";

export const loginUserThunk = createAsyncThunk(
  "user/login",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post("/api/v1/user/login", { username, password });

      // ✅ Fetch actual user from cookie
      const response = await dispatch(getUserProfileThunk()).unwrap();

      toast.success("Login successful!");
      return response;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || "Login failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);


export const registerUserThunk = createAsyncThunk(
  "user/signup",
  async (
    { fullName, username, password, gender },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await axiosInstance.post("/api/v1/user/register", {
        fullName,
        username,
        password,
        gender,
      });

      // ✅ Fetch actual user from cookie
      const response = await dispatch(getUserProfileThunk()).unwrap();

      toast.success("Account created successfully!!");
      return response;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || "Signup failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);


export const logoutUserThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/user/logout");
      toast.success("Logout successful!!");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/user/get-profile");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      return rejectWithValue(errorOutput);
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  "user/getOtherUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/user/get-other-users");
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage;
      return rejectWithValue(errorOutput);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/api/v1/user/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage;
      return rejectWithValue(errorOutput);
    }
  }
);
