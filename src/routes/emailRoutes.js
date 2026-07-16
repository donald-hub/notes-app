import express from "express";
const router = express.Router();
import {forgotPassword, verifyOtp, resetPassword} from "../controllers/emailController.js";

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);