import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { BrevoClient } from '@getbrevo/brevo';

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry (10 minutes)
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();



    // Create transporter
    const brevo = new BrevoClient({
      apiKey: process.env.API_KEY, // Replace with your Brevo API key
    });

    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Password Reset OTP",
      textContent: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      sender: { name: "Notes App", email: EMAIL_USER },
      to: [{ email: email }]
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
}
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check if OTP has expired
    if (user.otpExpiry < Date.now()) {
      // Clear expired OTP
      user.otp = null;
      user.otpExpiry = null;

      await user.save();

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};