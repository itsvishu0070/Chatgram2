
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utitlities/axiosInstance";

//  Send Message Thunk (supports text + file)
export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ recieverId, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/message/send/${recieverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || "Send failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

// Get Messages Thunk
export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ recieverId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/message/get-messages/${recieverId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      const errorOutput = error?.response?.data?.errMessage || "Fetch failed";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);
