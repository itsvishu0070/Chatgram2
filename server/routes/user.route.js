import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  getOtherUsers,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/get-profile", isAuthenticated, getProfile);
router.get("/get-other-users", isAuthenticated, getOtherUsers);
router.patch(
  "/update-profile",
  isAuthenticated,
  uploadAvatar.single("avatar"),
  updateProfile
);

export default router;
