import express from "express";
import { register, login } from "../controllers/authController.js";
import {mail} from  "../controllers/mail.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset", mail);

export default router;
