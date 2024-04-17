import express from "express";
import {
  forgotPassword,
  getProfileData,
  logInUser,
  logout,
  registerUser,
  resetPassword,
  updateLoginPassword,
  updateProfileData,
} from "../controller/userController.js";
import { isAuthentication } from "../middleware/auth.js";

const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(logInUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/update-password").put(isAuthentication,updateLoginPassword);
router
  .route("/profile")
  .get(isAuthentication, getProfileData)
  .put(isAuthentication, updateProfileData);
export default router;
