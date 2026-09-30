import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", protect, getProfile);

export default authRoutes;
