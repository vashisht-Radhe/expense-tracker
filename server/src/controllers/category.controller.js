import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import { AppError, asyncHandler, successResponse } from "../utils/apiUtils.js";

export const getCategories = asyncHandler(async (req, res) => {
  successResponse(res, 200, "Categories fetched successfully");
});

export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { type = "expense", startDate, endDate } = req.query;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new AppError(400, "Invalid user id");
  }

  if (type && !["income", "expense"].includes(type)) {
    throw new AppError(400, "Invalid type. Type must be income or expense");
  }

  const currentDate = new Date();

  let currentPeriodStart;
  let currentPeriodEnd;

  if (startDate && endDate) {
    currentPeriodStart = new Date(startDate);
    currentPeriodEnd = new Date(endDate);

    currentPeriodEnd.setHours(23, 59, 59, 999);
  } else {
    currentPeriodStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    currentPeriodEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
  }

  if (
    Number.isNaN(currentPeriodStart.getTime()) ||
    Number.isNaN(currentPeriodEnd.getTime())
  ) {
    throw new AppError(400, "Invalid date");
  }

  if (currentPeriodStart >= currentPeriodEnd) {
    throw new AppError(400, "startDate must be before endDate");
  }

  const previousPeriodStart = new Date(
    currentPeriodStart.getFullYear(),
    currentPeriodStart.getMonth() - 1,
    1,
  );

  const previousPeriodEnd = new Date(
    currentPeriodStart.getFullYear(),
    currentPeriodStart.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  const objectUserId = new mongoose.Types.ObjectId(userId);

  const currentPeriodMatch = {
    user: objectUserId,
    date: {
      $gte: currentPeriodStart,
      $lt: currentPeriodEnd,
    },
  };

  const previousPeriodMatch = {
    user: objectUserId,
    date: {
      $gte: previousPeriodStart,
      $lt: previousPeriodEnd,
    },
  };

  if (type) {
    currentPeriodMatch.type = type;
    previousPeriodMatch.type = type;
  }

  const currentMonthCategories = await Transaction.aggregate([
    {
      $match: currentPeriodMatch,
    },
    {
      $group: {
        _id: "$category",
        transactionCount: {
          $sum: 1,
        },
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        transactionCount: 1,
        totalAmount: 1,
      },
    },
    {
      $sort: {
        totalAmount: -1,
      },
    },
  ]);

  const previousMonthCategories = await Transaction.aggregate([
    {
      $match: previousPeriodMatch,
    },
    {
      $group: {
        _id: "$category",
        transactionCount: {
          $sum: 1,
        },
        totalAmount: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        transactionCount: 1,
        totalAmount: 1,
      },
    },
    {
      $sort: {
        totalAmount: -1,
      },
    },
  ]);

  const currentMonthTotal = currentMonthCategories.reduce(
    (total, category) => total + category.totalAmount,
    0,
  );

  const previousMonthTotal = previousMonthCategories.reduce(
    (total, category) => total + category.totalAmount,
    0,
  );

  const totalDifference = currentMonthTotal - previousMonthTotal;

  const overallPercentageChange =
    previousMonthTotal === 0
      ? null
      : Number(((totalDifference / previousMonthTotal) * 100).toFixed(2));

  const allCategories = new Set([
    ...previousMonthCategories.map((item) => item.category),
    ...currentMonthCategories.map((item) => item.category),
  ]);

  const categoryComparison = [...allCategories]
    .map((category) => {
      const previousCategory = previousMonthCategories.find(
        (item) => item.category === category,
      );

      const currentCategory = currentMonthCategories.find(
        (item) => item.category === category,
      );

      const previousAmount = previousCategory?.totalAmount ?? 0;

      const currentAmount = currentCategory?.totalAmount ?? 0;

      const difference = currentAmount - previousAmount;

      const percentageChange =
        previousAmount === 0
          ? null
          : Number(((difference / previousAmount) * 100).toFixed(2));

      return {
        category,
        previousMonthAmount: previousAmount,
        currentMonthAmount: currentAmount,
        difference,
        percentageChange,
      };
    })
    .sort((a, b) => b.currentMonthAmount - a.currentMonthAmount);

  successResponse(res, 200, "Category breakdown fetched successfully", {
    currentMonthCategories,
    previousMonthCategories,

    currentMonthTotal,
    previousMonthTotal,

    totalDifference,
    overallPercentageChange,

    currentCategoryCount: currentMonthCategories.length,

    previousCategoryCount: previousMonthCategories.length,

    categoryComparison,
  });
});
