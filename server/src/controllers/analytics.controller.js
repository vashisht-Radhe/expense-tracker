import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import { asyncHandler, successResponse } from "../utils/apiUtils.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { startDate, endDate } = req.query;
  const now = new Date();
  let start;
  let end;

  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  const [
    summaryResult,
    categorySpendingResult,
    largestExpense,
    largestIncome,
    weeklyCategoryComparison,
  ] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
          transactions: {
            $sum: 1,
          },
          incomeTransactions: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, 1, 0],
            },
          },
          expenseTransactions: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, 1, 0],
            },
          },
          averageExpense: {
            $avg: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", null],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          income: 1,
          expense: 1,
          transactions: 1,
          incomeTransactions: 1,
          expenseTransactions: 1,
          averageExpense: {
            $round: ["$averageExpense", 2],
          },
          netSaving: {
            $subtract: ["$income", "$expense"],
          },
        },
      },
      {
        $project: {
          _id: 0,
          income: 1,
          expense: 1,
          transactions: 1,
          incomeTransactions: 1,
          expenseTransactions: 1,
          averageExpense: 1,
          netSaving: 1,
          savingRate: {
            $cond: [
              { $gt: ["$income", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ["$netSaving", "$income"],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
        },
      },
    ]),

    Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: "$amount",
          },
          categories: {
            $push: {
              k: "$_id",
              v: "$amount",
            },
          },
          highestCategory: {
            $first: {
              category: "$_id",
              amount: "$amount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalExpense: 1,
          categories: {
            $arrayToObject: "$categories",
          },
          highestCategory: 1,
        },
      },
    ]),

    Transaction.findOne({
      user: userId,
      type: "expense",
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({ amount: -1 })
      .select("amount category -_id"),

    Transaction.findOne({
      user: userId,
      type: "income",
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({ amount: -1 })
      .select("amount category -_id"),

    Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: {
            week: {
              $ceil: {
                $divide: [{ $dayOfMonth: "$date" }, 7],
              },
            },
            category: "$category",
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.week": 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: "$_id.week",
          lowestCategory: {
            $first: {
              category: "$_id.category",
              amount: "$amount",
            },
          },
          highestCategory: {
            $last: {
              category: "$_id.category",
              amount: "$amount",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          week: {
            $concat: ["Week ", { $toString: "$_id" }],
          },
          highestCategory: "$highestCategory.category",
          highestAmount: "$highestCategory.amount",
          lowestCategory: "$lowestCategory.category",
          lowestAmount: "$lowestCategory.amount",
        },
      },
    ]),
  ]);

  const summary = summaryResult[0] || {
    income: 0,
    expense: 0,
    transactions: 0,
    averageExpense: 0,
    netSaving: 0,
    savingRate: 0,
  };

  const categorySpending = categorySpendingResult[0] || {
    totalExpense: 0,
    categories: {},
    highestCategory: null,
  };

  const recentTransactions = await Transaction.find({
    user: userId,
    date: {
      $gte: start,
      $lte: end,
    },
  })
    .sort({ date: -1 })
    .limit(7)
    .select("amount type category date -_id");

  successResponse(res, 200, "Analytics summary retrieved successfully.", {
    startDate: start,
    endDate: end,
    ...summary,
    categorySpending,
    largestExpense: largestExpense || null,
    largestIncome: largestIncome || null,
    recentTransactions,
    weeklyCategoryComparison,
  });
});

export const trends = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { category = "Food" } = req.query;

  const now = new Date();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const monthlyTrends = await Transaction.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            {
              $arrayElemAt: [
                [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                "$_id.month",
              ],
            },
            " ",
            { $toString: "$_id.year" },
          ],
        },
        income: 1,
        expense: 1,
      },
    },
  ]);

  const categoryTrends = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        category,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalExpense: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        category: category,
        month: {
          $concat: [
            {
              $arrayElemAt: [
                [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                "$_id.month",
              ],
            },
            " ",
            { $toString: "$_id.year" },
          ],
        },
        totalExpense: 1,
      },
    },
  ]);

  const weeklyCategoryComparison = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        date: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
    },
    {
      $group: {
        _id: {
          week: {
            $ceil: {
              $divide: [{ $dayOfMonth: "$date" }, 7],
            },
          },
          category: "$category",
        },
        amount: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        "_id.week": 1,
        amount: 1,
      },
    },
    {
      $group: {
        _id: "$_id.week",
        lowestCategory: {
          $first: {
            category: "$_id.category",
            amount: "$amount",
          },
        },
        highestCategory: {
          $last: {
            category: "$_id.category",
            amount: "$amount",
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        week: {
          $concat: ["Week ", { $toString: "$_id" }],
        },
        highestCategory: "$highestCategory.category",
        highestAmount: "$highestCategory.amount",
        lowestCategory: "$lowestCategory.category",
        lowestAmount: "$lowestCategory.amount",
      },
    },
  ]);

  successResponse(res, 200, "Analytics trends retrieved successfully.", {
    monthlyTrends,
    categoryTrends,
    weeklyCategoryComparison,
  });
});
