import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

import { JWT_SECRET } from "../config/env.js";
import { AppError, asyncHandler, successResponse } from "../utils/apiUtils.js";

const sanitizeUser = (user) => {
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  const isNameMissing = !name || typeof name !== "string";
  const isUsernameMissing = !username || typeof username !== "string";
  const isPasswordMissing = !password || typeof password !== "string";

  if (isNameMissing && isUsernameMissing && isPasswordMissing) {
    throw new AppError(400, "Name, username and password are required");
  }

  if (isNameMissing) {
    throw new AppError(400, "Name is required");
  }

  if (isUsernameMissing) {
    throw new AppError(400, "Username is required");
  }

  if (isPasswordMissing) {
    throw new AppError(400, "Password is required");
  }

  const existingUser = await User.findOne({
    username: username.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new AppError(409, "Username already exists");
  }

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    name,
    username,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  setAuthCookie(res, token);

  return successResponse(res, 201, "User registered successfully", {
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const isUsernameMissing = !username || typeof username !== "string";

  const isPasswordMissing = !password || typeof password !== "string";

  if (isUsernameMissing && isPasswordMissing) {
    throw new AppError(400, "Username and password are required");
  }

  if (isUsernameMissing) {
    throw new AppError(400, "Username is required");
  }

  if (isPasswordMissing) {
    throw new AppError(400, "Password is required");
  }

  const user = await User.findOne({
    username: username.toLowerCase().trim(),
  }).select("+password");

  if (!user) {
    throw new AppError(401, "Invalid username or password");
  }

  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid username or password");
  }

  const token = generateToken(user._id);

  setAuthCookie(res, token);

  return successResponse(res, 200, "User logged in successfully", {
    user: sanitizeUser(user),
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return successResponse(res, 200, "User logged out successfully");
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return successResponse(
    res,
    200,
    "User profile fetched successfully",
    sanitizeUser(user),
  );
});
