import express from "express";

import {
  register,
  reVerify,
  verify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUser,
  getUserById,
  updateUser
} from "../controllers/userController.js";

import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Register
router.post("/register", register);

// Email Verify
router.post("/verify", verify);

// Resend Verification Mail
router.post("/reverify", reVerify);

// Login
router.post("/login", login);

// Logout
router.post("/logout", isAuthenticated, logout);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp/:email", verifyOTP);

// Change Password
router.post("/change-password/:email", changePassword);
router.get('/all-user',isAuthenticated, isAdmin, allUser)
router.get('/get-user/:userId',getUserById)
router.put("/update/:id",isAuthenticated, singleUpload, updateUser)


export default router;