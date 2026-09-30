import mongoose from "mongoose";

const categories = [
  // Expenses
  "Food",
  "Transportation",
  "Shopping",
  "Household",
  "Bills & Utilities",
  "Housing",
  "Healthcare",
  "Education",
  "Entertainment",
  "Travel",
  "Personal Care",
  "Insurance",
  "Debt & Loans",
  "Gifts & Charity",
  "Other",

  // Income
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Other",
];

const splitSchema = new mongoose.Schema(
  {
    subcategory: {
      type: String,
      required: [true, "Split subcategory is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Split amount is required"],
      min: [0.01, "Split amount must be greater than 0"],
      validate: {
        validator: (value) => Number.isFinite(value),
        message: "Split amount must be a valid number",
      },
    },
  },
  { _id: false },
);

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      validate: {
        validator: (value) => Number.isFinite(value),
        message: "Amount must be a valid number",
      },
    },

    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Transaction type must be income or expense",
      },
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: categories,
        message: "Please select a valid category",
      },
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    isSplit: {
      type: Boolean,
      default: false,
    },

    splits: {
      type: [splitSchema],
      default: [],
    },

    date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Transaction date cannot be in the future",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
