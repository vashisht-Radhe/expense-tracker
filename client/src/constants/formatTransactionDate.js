export const formatTransactionDate = (dateString) => {
  const transactionDate = new Date(dateString);
  const today = new Date();

  const isToday =
    transactionDate.getDate() === today.getDate() &&
    transactionDate.getMonth() === today.getMonth() &&
    transactionDate.getFullYear() === today.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday =
    transactionDate.getDate() === yesterday.getDate() &&
    transactionDate.getMonth() === yesterday.getMonth() &&
    transactionDate.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return transactionDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
