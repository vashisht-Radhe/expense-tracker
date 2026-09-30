import express from "express";

import {
  getCategoryBreakdown
} from "../controllers/category.controller.js";
import {
  createTransaction,
  deleteTransaction,
  getCategories,
  getTransactionById,
  getTransactions,
  splitTransaction,
  updateTransaction,
} from "../controllers/transactions.controller.js";
import protect from "../middleware/auth.middleware.js";

const transactionsRoutes = express.Router();

transactionsRoutes.use(protect);

transactionsRoutes.post("/", createTransaction);
transactionsRoutes.get("/", getTransactions);

transactionsRoutes.get("/categories", getCategories);
transactionsRoutes.get("/by-category", getCategoryBreakdown);

transactionsRoutes.get("/:id", getTransactionById);
transactionsRoutes.patch("/:id", updateTransaction);
transactionsRoutes.delete("/:id", deleteTransaction);
transactionsRoutes.post("/:id/split", splitTransaction);

export default transactionsRoutes;
