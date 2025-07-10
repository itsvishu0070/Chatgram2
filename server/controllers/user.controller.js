import User from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  const tokenData = { _id: newUser._id };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: {
        newUser,
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

  const tokenData = { _id: user._id };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .json({
      success: true,
      responseData: {
        user,
        token,
      },
    });
});

// =========================== GET PROFILE ===========================
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const profile = await User.findById(userId);

  res.status(200).json({
    success: true,
    responseData: profile,
  });
});

// =========================== LOGOUT ===========================
export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Logout successful!",
    });
});

// =========================== GET OTHER USERS ===========================
export const getOtherUsers = asyncHandler(async (req, res, next) => {

  const otherUsers = await User.find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    success: true,
    responseData: otherUsers,
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
    ...(avatarPath && {
      avatar: `${process.env.SERVER_URL}${avatarPath}`,
    }),
  };

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  res.status(200).json({
    success: true,
    responseData: updatedUser,
  });
});
