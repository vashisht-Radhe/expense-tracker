export const TRANSACTION_TYPES = {
  EXPENSE: "expense",
  INCOME: "income",
};

export const INITIAL_TRANSACTION_FORM = {
  type: TRANSACTION_TYPES.EXPENSE,
  amount: "",
  description: "",
  category: "",
  date: "",
};

export const TRANSACTION_FILTER_DEFAULTS = {
  page: 1,
  search: "",
  category: "all",
  type: "all",
  amountRange: "all",
};
