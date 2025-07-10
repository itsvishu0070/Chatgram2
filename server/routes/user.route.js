import express from "express";
import {
  getOtherUsers,
  getProfile,
  login,
  logout,
  register,
  updateProfile, 
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middlware.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/get-profile", isAuthenticated, getProfile);
router.get("/get-other-users", isAuthenticated, getOtherUsers);


//  PATCH route to update profile with avatar
router.patch(
    "/update-profile",
    isAuthenticated,
    uploadAvatar.single("avatar"),
    updateProfile
  );

export default router;
