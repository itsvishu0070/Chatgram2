import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =========================== attachCookie ===========================
const attachCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // ✅ Always true in production
    sameSite: "None", // ✅ Required for cross-origin (Render <-> Vercel)
    maxAge: Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
  });
};

// =========================== REGISTER ===========================
export const register = asyncHandler(async (req, res, next) => {
  const { fullName, username, password, gender } = req.body;

  if (!fullName || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return next(new errorHandler("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarType = gender === "male" ? "boy" : "girl";
  const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;

  const newUser = await User.create({
    username,
    fullName,
    password: hashedPassword,
    gender,
    avatar,
  });

  const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  attachCookie(res, token);

  res.status(200).json({
    success: true,
    responseData: {
      newUser: {
        ...newUser.toObject(),
        avatar: newUser.avatar?.startsWith("http")
          ? newUser.avatar
          : `${process.env.SERVER_URL}${newUser.avatar}`,
      },
      token,
    },
  });
});

// =========================== LOGIN ===========================
export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(
      new errorHandler("Please enter a valid username or password", 400)
    );
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  attachCookie(res, token);

  res.status(200).json({
    success: true,
    responseData: {
      user: {
        ...user.toObject(),
        avatar: user.avatar?.startsWith("http")
          ? user.avatar
          : `${process.env.SERVER_URL}${user.avatar}`,
      },
      token,
    },
  });
});

// =========================== GET PROFILE ===========================
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const profile = await User.findById(userId);

  if (!profile) return next(new errorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    responseData: {
      ...profile.toObject(),
      avatar: profile.avatar?.startsWith("http")
        ? profile.avatar
        : `${process.env.SERVER_URL}${profile.avatar}`,
    },
  });
});

// =========================== LOGOUT ===========================
export const logout = asyncHandler(async (req, res, next) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: true, // ✅ Always true in prod
      sameSite: "None", // ✅ Cross-origin clear
      expires: new Date(0),
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful!",
    });
});

// =========================== GET OTHER USERS ===========================
export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const otherUsers = await User.find({ _id: { $ne: req.user._id } });

  const usersWithFullAvatars = otherUsers.map((user) => ({
    ...user.toObject(),
    avatar: user.avatar?.startsWith("http")
      ? user.avatar
      : `${process.env.SERVER_URL}${user.avatar}`,
  }));

  res.status(200).json({
    success: true,
    responseData: usersWithFullAvatars,
  });
});

// =========================== UPDATE PROFILE ===========================
export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { fullName, username } = req.body;

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return next(new errorHandler("User not found", 404));
  }

  if (username && username !== currentUser.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return next(new errorHandler("Username already taken", 400));
    }
  }

  const avatarPath = req.file
    ? `/uploads/avatars/${req.file.filename}`
    : undefined;

  const updateData = {
    ...(fullName && { fullName }),
    ...(username && { username }),
    ...(avatarPath && { avatar: `${process.env.SERVER_URL}${avatarPath}` }),
  };

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  res.status(200).json({
    success: true,
    responseData: {
      ...updatedUser.toObject(),
      avatar: updatedUser.avatar?.startsWith("http")
        ? updatedUser.avatar
        : `${process.env.SERVER_URL}${updatedUser.avatar}`,
    },
  });
});

