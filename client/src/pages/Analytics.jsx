import axios from "axios";
import {
  HandCoins,
  Percent,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../constants/formatCurrency";
import SummaryCard from "./Summary";
import useCategories from "../hooks/useCategories";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("this-month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [category, setCategory] = useState("Food");

  const categories = useCategories();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDateRange = (range) => {
    const now = new Date();
    let start;
    let end;

    switch (range) {
      case "this-month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;

      case "this-week": {
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;

        start = new Date(now);
        start.setDate(now.getDate() - diff);

        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }

      case "today":
        start = new Date(now);
        end = new Date(now);
        break;

      case "yesterday":
        start = new Date(now);
        start.setDate(now.getDate() - 1);

        end = new Date(start);
        break;

      case "prev-month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;

      case "prev-week": {
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;

        start = new Date(now);
        start.setDate(now.getDate() - diff - 7);

        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }

      case "last-3-months":
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;

      case "last-6-months":
        start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;

      case "one-year":
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        end = new Date(now);
        break;

      default:
        return null;
    }

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  };

  const fetchAnalytics = async (range = dateRange) => {
    setLoading(true);

    try {
      let dates;

      if (range === "custom") {
        if (!customStartDate || !customEndDate) {
          toast.error("Please select both dates");
          return;
        }

        if (customStartDate > customEndDate) {
          toast.error("Start date cannot be after end date");
          return;
        }

        dates = {
          startDate: customStartDate,
          endDate: customEndDate,
        };
      } else {
        dates = getDateRange(range);
      }

      const response = await axios.get("http://localhost:5500/api/analytics", {
        params: {
          startDate: dates.startDate,
          endDate: dates.endDate,
        },
        withCredentials: true,
      });

      setAnalytics(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async (range = dateRange) => {
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5500/api/analytics/trends",
        {
          params: { category },
          withCredentials: true,
        },
      );

      setTrends(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch analytics trends",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics("this-month");
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [category]);

  const handleRangeChange = (e) => {
    const value = e.target.value;

    setDateRange(value);

    if (value !== "custom") {
      fetchAnalytics(value);
    }
  };

  const handleCustomDateChange = () => {
    fetchAnalytics("custom");
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!analytics) {
    return <div className="p-6">No analytics data loaded.</div>;
  }

  const cd = analytics.categorySpending?.categories
    ? Object.entries(analytics.categorySpending.categories).map(
        ([name, value]) => ({
          name,
          value,
        }),
      )
    : [];

  const chartData = cd.splice(1, 7);

  const hasIncome = analytics.income > 0;
  const savingRate = analytics.savingRate || 0;

  const categoryTrends = trends.categoryTrends || [];

  const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#22C55E",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  const highestCategory = analytics.categorySpending?.highestCategory;

  const isNetSaving = analytics?.netSaving > 0;

  const weeklyCategoryComparison = analytics?.weeklyCategoryComparison;

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(analytics.income) || 0,
      transactions: analytics.incomeTransactions,
      icon: HandCoins,
      trendIcon: TrendingUp,
      trendColor: "text-green-600",
    },
    {
      title: "Total Expense",
      value: formatCurrency(analytics.expense) || 0,
      transactions: analytics.expenseTransactions,
      icon: Wallet,
      trendIcon: TrendingDown,
      trendColor: "text-orange-600",
    },
    {
      title: "Net Saving",
      value: formatCurrency(analytics.netSaving) || 0,
      icon: PiggyBank,
      trendIcon: analytics.netSaving < 0 ? TrendingDown : TrendingUp,
      trendColor:
        analytics.netSaving < 0 ? "text-orange-600" : "text-green-600",
      showNoIncome: !hasIncome,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500">Track your income and spending</p>
        </div>

        <select
          name="dateRange"
          id="dateRange"
          value={dateRange}
          onChange={handleRangeChange}
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option value="this-month">This month</option>
          <option value="this-week">This week</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="prev-month">Previous month</option>
          <option value="prev-week">Previous week</option>
          <option value="last-3-months">Last 3 months</option>
          <option value="last-6-months">Last 6 months</option>
          <option value="one-year">One year</option>
          <option value="custom">Custom range</option>
        </select>
      </div>
      {dateRange === "custom" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <button
            onClick={handleCustomDateChange}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg"
          >
            Apply
          </button>
        </div>
      )}
      {!hasIncome && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
          No income recorded for this period.
        </div>
      )}
      <div
        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${
          isNetSaving ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        {stats.map((stat) => (
          <SummaryCard
            key={stat.title}
            title={stat.title}
            value={stat.showNoIncome ? "No income" : stat.value}
            icon={stat.icon}
            change={
              stat.transactions !== undefined
                ? `${stat.transactions} transactions`
                : undefined
            }
            changeIcon={stat.trendIcon}
            changeColor={stat.trendColor}
            description={
              stat.transactions !== undefined ? "recorded" : undefined
            }
          />
        ))}

        {isNetSaving && <SavingRateCard savingRate={savingRate} />}
      </div>

      <div className="card p-5 w-full h-100">
        <div className="mb-10">
          <select
            name=""
            id=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={categoryTrends}>
            <CartesianGrid strokeDasharray="5 5" />

            <XAxis dataKey="month" />
            <YAxis />

            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="totalExpense" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
        <div className="col-span-2 card p-5 w-full h-100">
          {dateRange === "this-month" || dateRange === "prev-month" ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={weeklyCategoryComparison}
                margin={{ top: 50, right: 30, left: 20, bottom: 20 }}
                barGap={8}
              >
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#e5e7eb"
                  vertical={false}
                />

                <XAxis
                  dataKey="week"
                  tick={{ fill: "#374151", fontSize: 13 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#374151", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />

                <Tooltip
                  formatter={(value, name, props) => {
                    const category =
                      name === "highestAmount"
                        ? props.payload.highestCategory
                        : props.payload.lowestCategory;

                    return [`₹${Number(value).toLocaleString()}`, category];
                  }}
                  labelFormatter={(label) => label}
                />

                <Legend
                  formatter={(value) =>
                    value === "highestAmount"
                      ? "Highest Spending"
                      : "Lowest Spending"
                  }
                />

                <Bar
                  dataKey="highestAmount"
                  name="Highest Spending"
                  fill="#ef4444"
                  barSize={35}
                  radius={[6, 6, 0, 0]}
                >
                  <LabelList
                    dataKey="highestCategory"
                    position="top"
                    fill="#ef4444"
                    fontSize={12}
                  />
                </Bar>

                <Bar
                  dataKey="lowestAmount"
                  name="Lowest Spending"
                  fill="#22c55e"
                  barSize={35}
                  radius={[6, 6, 0, 0]}
                >
                  <LabelList
                    dataKey="lowestCategory"
                    position="top"
                    fill="#22c55e"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={chartData}
                margin={{ top: 50, right: 30, left: 20, bottom: 20 }}
                barGap={8}
              >
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis axisLine={{ stroke: "#d1d5db" }} tickLine={false} />
                <YAxis
                  tick={{ fill: "#374151", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />

                <Tooltip
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.name || ""
                  }
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    "Amount",
                  ]}
                />

                <Legend />
                <Bar
                  dataKey="value"
                  name="Spending"
                  fill="#ef4444"
                  barSize={35}
                  radius={[6, 6, 0, 0]}
                >
                  <LabelList
                    dataKey="name"
                    position="top"
                    fill="#ef4444"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="col-span-1 card">
          <h3 className="text-2xl font-semibold text-slate-800">Key Insight</h3>
          <div className="space-y-2">
            {highestCategory && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-gray-500">Highest Spending Category</p>

                <div className="flex items-end justify-between mt-2">
                  <h2 className="text-2xl font-semibold">
                    {highestCategory.category}
                  </h2>

                  <p className="text-2xl font-bold text-red-500">
                    {highestCategory.amount}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-gray-500">Largest Expense</p>

              {analytics.largestExpense ? (
                <>
                  <h2 className="text-2xl font-semibold mt-2">
                    {analytics.largestExpense.amount}
                  </h2>

                  <p className="text-gray-500">
                    {analytics.largestExpense.category}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 mt-2">No expenses recorded</p>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-gray-500">Largest Income</p>

              {analytics.largestIncome ? (
                <>
                  <h2 className="text-2xl font-semibold mt-2 text-green-600">
                    {analytics.largestIncome.amount}
                  </h2>

                  <p className="text-gray-500">
                    {analytics.largestIncome.category}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 mt-2">No income recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

const SavingRateCard = ({ savingRate }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border-light bg-surface p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white">
            <Percent
              size={20}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <p className="text-sm font-medium text-text-secondary">Saving Rate</p>
        </div>

        <TrendingUp size={20} className="text-green-600" />
      </div>

      {/* Value + Circle */}
      <div className="relative mt-3 flex items-center justify-between">
        <p className="text-3xl font-semibold text-heading transition-colors duration-300 group-hover:text-primary">
          {savingRate}%
        </p>

        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(
              #3b82f6 ${Math.min(savingRate, 100)}%,
              #e5e7eb 0
            )`,
          }}
        >
          <div className="absolute inset-2 rounded-full bg-white" />

          <span className="relative text-xs font-medium text-slate-700">
            {savingRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
