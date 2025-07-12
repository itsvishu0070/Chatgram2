import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= attachCookie =================
const attachCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None", // ✅ Required for cross-site cookie usage
    maxAge: Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
  });
};

// ================= formatUserWithAvatar =================
const formatUserWithAvatar = (user) => {
  return {
    ...user.toObject(),
    avatar: user.avatar?.startsWith("http")
      ? user.avatar
      : `${process.env.SERVER_URL}${user.avatar || ""}`,
  };
};

// ================= REGISTER =================
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
    fullName,
    username,
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
    responseData: formatUserWithAvatar(newUser),
  });
});

// ================= LOGIN =================
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
    responseData: formatUserWithAvatar(user),
  });
});

// ================= GET PROFILE =================
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const profile = await User.findById(userId);
  if (!profile) return next(new errorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    responseData: formatUserWithAvatar(profile),
  });
});

// ================= LOGOUT =================
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logout successful!",
  });
});

// ================= GET OTHER USERS =================
export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const otherUsers = await User.find({ _id: { $ne: req.user._id } });

  const usersWithAvatars = otherUsers.map(formatUserWithAvatar);

  res.status(200).json({
    success: true,
    responseData: usersWithAvatars,
  });
});

// ================= UPDATE PROFILE =================
export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { fullName, username } = req.body;

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return next(new errorHandler("User not found", 404));
  }

  if (username && username !== currentUser.username) {
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken && usernameTaken._id.toString() !== userId.toString()) {
      return next(new errorHandler("Username already taken", 400));
    }
  }

  const avatarPath = req.file?.secure_url || req.file?.path || null;

  const updatedFields = {
    ...(fullName && { fullName }),
    ...(username && { username }),
    ...(avatarPath && { avatar: avatarPath }),
  };

  const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
    new: true,
  });

  res.status(200).json({
    success: true,
    responseData: formatUserWithAvatar(updatedUser),
  });
});
