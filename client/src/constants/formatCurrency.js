export const formatCurrency = (value = 0) => {
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

export const formatNumber = (value = 0) => {
  return Number(value).toLocaleString("en-IN");
};
