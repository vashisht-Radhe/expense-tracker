import express from "express";
import analyticsRoutes from "./analytics.route.js";
import authRoutes from "./auth.route.js";
import transactionsRoutes from "./transactions.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
