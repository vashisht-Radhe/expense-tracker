import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import { AppError, asyncHandler, successResponse } from "../utils/apiUtils.js";

export const createTransaction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { amount, type, category, description, date } = req.body;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  if (amount === undefined || amount === null) {
    throw new AppError(400, "Amount is required");
  }

  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new AppError(400, "Amount must be a valid number");
  }

  if (amount <= 0) {
    throw new AppError(400, "Amount must be greater than 0");
  }

  if (typeof type !== "string" || !type.trim()) {
    throw new AppError(400, "Type is required");
  }

  if (!["income", "expense"].includes(type.trim().toLowerCase())) {
    throw new AppError(400, "Type must be either income or expense");
  }

  if (typeof category !== "string" || !category.trim()) {
    throw new AppError(400, "Category is required");
  }

  if (typeof description !== "string" || !description.trim()) {
    throw new AppError(400, "Description is required");
  }

  if (description.trim().length < 3) {
    throw new AppError(400, "Description must be at least 3 characters");
  }

  if (date === undefined || date === null || date === "") {
    throw new AppError(400, "Date is required");
  }

  if (Number.isNaN(Date.parse(date))) {
    throw new AppError(400, "Date must be a valid date");
  }

  const transaction = await Transaction.create({
    user: userId,
    amount,
    type,
    category,
    description,
    date,
  });

  successResponse(res, 201, "Transaction created successfully", transaction);
});

export const getTransactions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    search,
    category,
    type,
    amountRange,
    page = "1",
    limit = "15",
    sort = "newest",
    date,
  } = req.query;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  const filter = { user: userId };

  switch (amountRange) {
    case "under-200":
      filter.amount = { $gt: 0, $lte: 200 };
      break;

    case "200-500":
      filter.amount = { $gt: 200, $lte: 500 };
      break;

    case "500-1000":
      filter.amount = { $gt: 500, $lte: 1000 };
      break;

    case "1000-5000":
      filter.amount = { $gt: 1000, $lte: 5000 };
      break;

    case "5000-10000":
      filter.amount = { $gt: 5000, $lte: 10000 };
      break;

    case "above-10000":
      filter.amount = { $gt: 10000 };
      break;

    default:
      break;
  }

  if (search) {
    const amount = Number(search);
    filter.$or = [
      {
        category: {
          $regex: search,
          $options: "i",
        },
      },
    ];

    if (!Number.isNaN(amount)) {
      filter.$or.push({ amount: { $lte: amount } });
    }
  }

  if (category) {
    filter.category = {
      $regex: category,
      $options: "i",
    };
  }

  if (type) {
    filter.type = {
      $regex: type,
      $options: "i",
    };
  }

  let sortObj = {};

  switch (sort) {
    case "oldest":
      sortObj = { date: 1 };
      break;
    case "newest":
    default:
      sortObj = { date: -1 };
      break;
  }

  const currentPage = Math.max(1, Number(page));
  const perPage = Math.max(1, Number(limit));
  const skip = (currentPage - 1) * perPage;

  const transactions = await Transaction.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(perPage);

  const totalRecords = await Transaction.countDocuments(filter);

  const totalPages = Math.ceil(totalRecords / perPage);

  const pagination = {
    page: currentPage,
    limit: perPage,
    totalRecords,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };

  successResponse(
    res,
    200,
    "Transactions retrieved successfully",
    transactions,
    { pagination },
  );
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid transaction id");
  }

  const transaction = await Transaction.findOne({
    _id: id,
    user: userId,
  });

  if (!transaction) {
    throw new AppError(404, "Transaction not found");
  }

  successResponse(res, 200, "Transaction retrieved successfully", transaction);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Transaction.distinct("category");

  successResponse(res, 200, "Fetched all categories", categories);
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { amount, type, category, description, date } = req.body;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid transaction id");
  }

  const updateData = {
    ...(amount !== undefined && { amount }),
    ...(type !== undefined && { type }),
    ...(category !== undefined && { category }),
    ...(description !== undefined && { description }),
    ...(date !== undefined && { date }),
  };

  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, "At least one field is required to update");
  }

  const transaction = await Transaction.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!transaction) {
    throw new AppError(404, "Transaction not found");
  }

  successResponse(res, 200, "Transaction updated successfully", transaction);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid transaction id");
  }

  const transaction = await Transaction.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!transaction) {
    throw new AppError(404, "Transaction not found");
  }

  successResponse(res, 200, "Transaction deleted successfully");
});

export const splitTransaction = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id: transactionId } = req.params;
  const { splits } = req.body;

  if (!transactionId) {
    throw new AppError(400, "Transaction id is required");
  }

  if (!mongoose.isValidObjectId(transactionId)) {
    throw new AppError(400, "Invalid transaction id");
  }

  if (!Array.isArray(splits) || splits.length < 2) {
    throw new AppError(400, "At least 2 splits are required");
  }

  const transaction = await Transaction.findOne({
    user: userId,
    _id: transactionId,
    type: "expense",
  });

  if (!transaction) {
    throw new AppError(404, "Transaction not found");
  }

  const splitTotal = splits.reduce(
    (total, split) => total + Number(split.amount),
    0,
  );

  if (Math.abs(splitTotal - transaction.amount) > 0.01) {
    throw new AppError(
      400,
      "The total split amount must equal the transaction amount",
    );
  }

  transaction.splits = splits;
  transaction.isSplit = true;
  await transaction.save();

  successResponse(res, 200, "Transaction split successfully", transaction);
});