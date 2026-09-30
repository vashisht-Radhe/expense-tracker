import { ArrowDown, ArrowUp, CircleDollarSign, PiggyBank } from "lucide-react";

export const PIE_COLORS = [
  "#6366F1",
  "#06B6D4",
  "#F59E0B",
  "#8B5CF6",
  "#10B981",
  "#EC4899",
  "#64748B",
];

export const DASHBOARD_CARDS = [
  {
    key: "netSaving",
    title: "Net Saving",
    icon: PiggyBank,
  },
  {
    key: "income",
    title: "Income",
    icon: ArrowUp,
  },
  {
    key: "expense",
    title: "Expense",
    icon: ArrowDown,
  },
  {
    key: "transactions",
    title: "Transactions",
    icon: CircleDollarSign,
  },
];
