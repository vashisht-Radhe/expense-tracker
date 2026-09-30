import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  HandCoins,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getAnalytics, getAnalyticsTrends } from "../api/analytics.api";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import { PIE_COLORS } from "../constants/dashboard";
import { formatCurrency } from "../constants/formatCurrency";
import { formatTransactionDate } from "../constants/formatTransactionDate";
import {
  getCategoryData,
  getCurrentMonth,
  getGreeting,
  getTopCategories,
} from "../utils/dashboardData";
import SummaryCard from "./Summary";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [analytics, trends] = await Promise.all([
        getAnalytics(),
        getAnalyticsTrends(),
      ]);

      setAnalytics(analytics.data);
      setTrends(trends.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const income = analytics?.income || 0;
    const savingRate = analytics?.savingRate || 0;
    if (income <= 0 || savingRate <= 0) {
      setProgress(0);
      return;
    }
    setProgress(0);
    const timer = setTimeout(() => {
      setProgress(Math.min(savingRate, 200));
    }, 100);
    return () => clearTimeout(timer);
  }, [analytics]);

  const categoryData = getCategoryData(analytics);

  const topCategories = getTopCategories(categoryData);

  const monthlyChartData = useMemo(() => {
    return trends?.monthlyTrends || [];
  }, [trends]);

  const currentMonth = getCurrentMonth();

  if (loading) {
    return (
      <div className="content primary flex min-h-[60vh] items-center justify-center">
        <div className="text-secondary">Loading dashboard...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="content primary flex min-h-[60vh] items-center justify-center">
        <div className="text-secondary">Unable to load dashboard.</div>
      </div>
    );
  }

  const income = analytics.income || 0;
  const expense = analytics.expense || 0;
  const netSaving = analytics.netSaving || 0;
  const savingRate = analytics.savingRate || 0;
  const expenseTransactions = analytics.expenseTransactions || 0;
  const incomeTransactions = analytics.incomeTransactions || 0;

  const date = new Date();
  const greeting = getGreeting(date.getHours());

  const cards = [
    {
      title: "Net Saving",
      value: formatCurrency(netSaving),
      icon: PiggyBank,
      change: netSaving >= 0 ? "Saved" : "Overspent",
      changeIcon: netSaving >= 0 ? TrendingUp : TrendingDown,
      changeColor: netSaving >= 0 ? "text-green-600" : "text-orange-600",
      description: netSaving >= 0 ? "during this period" : "during this period",
    },

    {
      title: "Income",
      value: formatCurrency(income),
      icon: HandCoins,
      change: `${incomeTransactions} transactions`,
      changeIcon: TrendingUp,
      changeColor: "text-green-600",
      description: "recorded",
    },

    {
      title: "Expense",
      value: formatCurrency(expense),
      icon: Wallet,
      change: `${expenseTransactions} transactions`,
      changeIcon: TrendingDown,
      changeColor: "text-orange-600",
      description: "recorded",
    },
  ];

  return (
    <div className="px-5 primary space-y-8">
      <DashboardHeader greeting={greeting} currentMonth={currentMonth} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>
      {income > 0 && savingRate > 0 && (
        <div className="group relative overflow-hidden rounded-xl border border-border-light bg-surface p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg ">
          <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-heading">Saving progress</h3>
              <p className="mt-1 text-sm text-text-secondary">
                You saved {savingRate}% of your income.
              </p>
            </div>
            <span className="text-2xl font-semibold text-primary">
              {savingRate}%
            </span>
          </div>
          <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-primary-light">
            <div
              className=" h-full rounded-full bg-primary transition-[width] duration-1000 ease-out "
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Income & Expense */}
        <div className="overflow-hidden rounded-xl border border-border-light bg-surface shadow-sm lg:col-span-2">
          <div className="border-b border-border-light px-6 py-5">
            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold text-heading">
                <BarChart3 size={20} className="text-primary" />
                Income & Expense
              </h4>

              <p className="mt-1 text-sm text-text-secondary">
                Compare your income and spending over time.
              </p>
            </div>
          </div>

          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="dashboardIncome"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#5f8798" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#5f8798" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient
                    id="dashboardExpense"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ef806f" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#ef806f" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#dce7e6"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7d80", fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7d80", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                />

                <Tooltip formatter={(value) => formatCurrency(value)} />

                <Legend />

                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#5f8798"
                  fill="url(#dashboardIncome)"
                  strokeWidth={2.5}
                />

                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#ef806f"
                  fill="url(#dashboardExpense)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border-light bg-surface shadow-sm">
          <div className="border-b border-border-light px-6 py-5">
            <div>
              <h4 className="text-lg font-semibold text-heading">
                Expense Categories
              </h4>

              <p className="mt-1 text-sm text-text-secondary">
                Where your money is going.
              </p>
            </div>
          </div>

          {categoryData.length > 1 ? (
            <div className="h-80 py-5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip formatter={(value) => formatCurrency(value)} />

                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center p-6">
              {categoryData.length === 1 ? (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Wallet size={24} />
                  </div>

                  <p className="mt-4 text-sm text-text-secondary">
                    Most spending is in
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-heading">
                    {categoryData[0].name}
                  </h3>

                  <p className="mt-1 font-medium text-secondary">
                    {formatCurrency(categoryData[0].value)}
                  </p>
                </div>
              ) : (
                <div className="text-center text-sm text-text-secondary">
                  No expenses recorded.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-border-light bg-surface shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
            <div>
              <h4 className="text-lg font-semibold text-heading">
                Recent Transactions
              </h4>

              <p className="mt-1 text-sm text-text-secondary">
                Your latest financial activity.
              </p>
            </div>

            <Link
              to="/transactions"
              className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-border-light">
            {analytics.recentTransactions?.length > 0 ? (
              analytics.recentTransactions.map((transaction, index) => {
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={`${transaction.date}-${index}`}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-surface-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isIncome
                            ? "bg-info-light text-info"
                            : "bg-secondary-light text-secondary"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUp size={18} />
                        ) : (
                          <ArrowDown size={18} />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-heading">
                          {transaction.category}
                        </p>

                        <p className="text-xs text-text-secondary">
                          {formatTransactionDate(transaction.date)}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`font-semibold ${
                        isIncome ? "text-info" : "text-secondary"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-10 text-center text-sm text-text-secondary">
                No recent transactions.
              </div>
            )}
          </div>
        </div>

        {/* Top Spending */}
        <div className="overflow-hidden rounded-xl border border-border-light bg-surface shadow-sm">
          <div className="border-b border-border-light px-6 py-5">
            <div>
              <h4 className="text-lg font-semibold text-heading">
                Top Spending
              </h4>

              <p className="mt-1 text-sm text-text-secondary">
                Your biggest expense categories.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5">
            {topCategories.length > 0 ? (
              topCategories.map((item, index) => {
                const percentage =
                  analytics.categorySpending.totalExpense > 0
                    ? (item.value / analytics.categorySpending.totalExpense) *
                      100
                    : 0;

                const categoryColor = PIE_COLORS[index % PIE_COLORS.length];

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: categoryColor,
                          }}
                        />

                        <span className="text-sm font-medium text-heading">
                          {item.name}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-heading">
                        {formatCurrency(item.value)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-primary-light">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: categoryColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-text-secondary">
                No spending data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
