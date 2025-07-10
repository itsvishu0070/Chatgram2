
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  getUserProfileThunk,
  getOtherUsersThunk,
  updateProfileThunk, 
} from "./user.thunk";

const initialState = {
  isAuthenticated: false,
  userProfile: null,
  otherUsers: [],
  buttonLoading: false,
  screenLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ========== Login ==========
    builder.addCase(loginUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload.responseData.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.buttonLoading = false;
      state.isAuthenticated = false;
    });

    // ========== Register ==========
    builder.addCase(registerUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload.responseData.newUser;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.buttonLoading = false;
      state.isAuthenticated = false;
    });

    // ========== Get Profile ==========
    builder.addCase(getUserProfileThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload.responseData;
      state.isAuthenticated = true;
      state.screenLoading = false;
    });
    builder.addCase(getUserProfileThunk.rejected, (state) => {
      state.screenLoading = false;
      state.isAuthenticated = false;
      state.userProfile = null;
    });

    // ========== Logout ==========
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.userProfile = null;
      state.otherUsers = [];
    });

    // ========== Get Other Users ==========
    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.otherUsers = action.payload.responseData;
    });

    // ========== Update Profile ==========
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload.responseData;
    });
  },
});

export const { setSelectedUser } = userSlice.actions;

export default userSlice.reducer;


