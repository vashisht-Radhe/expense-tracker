import express from "express";
import { getAnalytics, trends } from "../controllers/analytics.controller.js";
import protect from "../middleware/auth.middleware.js";

const analyticsRoutes = express.Router();

analyticsRoutes.use(protect);

analyticsRoutes.get("/", getAnalytics);
analyticsRoutes.get("/trends", trends);

export default analyticsRoutes;
