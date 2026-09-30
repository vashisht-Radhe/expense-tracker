import {
  ArrowDownUp,
  BarChart3,
  Check,
  CircleDollarSign,
  CreditCard,
  Film,
  Home,
  Receipt,
  ShoppingBag,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Banner from "./components/Banner";

const data = [
  { month: "Jan", income: 42000, salary: 35000 },
  { month: "Feb", income: 48000, salary: 35000 },
  { month: "Mar", income: 45000, salary: 35000 },
  { month: "Apr", income: 52000, salary: 38000 },
  { month: "May", income: 58000, salary: 40000 },
  { month: "Jun", income: 62000, salary: 40000 },
];

const features = [
  {
    title: "Track Income & Expenses",
    description: "Know exactly where your money comes from and where it goes.",
    icon: ArrowDownUp,
  },
  {
    title: "Split Transactions",
    description: "Divide bills and shared expenses without the headache.",
    icon: Receipt,
  },
  {
    title: "Smart Analytics",
    description:
      "Understand your spending patterns with clear visual insights.",
    icon: BarChart3,
  },
];

const transactions = [
  {
    category: "Food",
    name: "Zomato",
    amount: "-₹350",
    icon: UtensilsCrossed,
    type: "expense",
  },
  {
    category: "Salary",
    name: "Monthly income",
    amount: "+₹45,000",
    icon: Wallet,
    type: "income",
  },
  {
    category: "Entertainment",
    name: "Netflix",
    amount: "-₹649",
    icon: Film,
    type: "expense",
  },
  {
    category: "Shopping",
    name: "Amazon",
    amount: "-₹1,299",
    icon: ShoppingBag,
    type: "expense",
  },
  {
    category: "Housing",
    name: "Home expenses",
    amount: "-₹3,500",
    icon: Home,
    type: "expense",
  },
  {
    category: "Bills & Utilities",
    name: "Electricity",
    amount: "-₹1,850",
    icon: CreditCard,
    type: "expense",
  },
];

const Landing = () => {
  return (
    <div className="content min-h-screen">
      <header className="flex items-center justify-between header">
        <h1 className="text-xl font-bold text-heading">FinTrack</h1>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#home"
            className="text-sm text-text-secondary hover:text-primary transition"
          >
            Home
          </a>

          <a
            href="#features"
            className="text-sm text-text-secondary hover:text-primary transition"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-sm text-text-secondary hover:text-primary transition"
          >
            About
          </a>
        </nav>

        <Link to="/login" className="btn btn-primary">
          Get Started
        </Link>
      </header>

      <section
        id="home"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5 card p-6 lg:p-8"
      >
        <div className="lg:col-span-2 flex items-center">
          <div className="w-full max-w-2xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium">
              Take control of your money
            </span>

            <div className="mt-6 space-y-5">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-heading">
                Smarter Spending.
                <br />
                <span className="text-secondary">Brighter Future.</span>
              </h2>

              <p className="text-text-muted text-sm md:text-base max-w-xl leading-7">
                FinTrack helps you track your income, split bills, manage
                expenses, and gain insights — so you can save more, spend
                wisely, and reach your goals.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/login" className="btn btn-secondary">
                  Get Started
                </Link>

                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center">
                    <Check size={14} />
                  </span>
                  Free to start
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end items-center min-h-80">
          <div className="relative w-64 sm:w-72">
            <div className="relative mx-auto w-56 h-105 bg-surface border-4 border-heading rounded-4xl shadow-lg overflow-hidden">
              <div className="absolute top-14 -left-1.5 space-y-2">
                <div className="w-1 h-8 bg-heading rounded" />
                <div className="w-1 h-8 bg-heading rounded" />
              </div>

              <div className="absolute top-20 -right-1.5">
                <div className="w-1 h-10 bg-heading rounded" />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-text-muted">
                      September 2026
                    </p>

                    <p className="font-semibold text-sm text-heading mt-0.5">
                      Transactions
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center">
                    <CircleDollarSign size={16} />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-primary text-white">
                  <p className="text-[9px] opacity-80">Available balance</p>

                  <p className="text-lg font-bold mt-1">₹35,520</p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] opacity-80">
                      Income ₹45,000
                    </span>

                    <span className="text-[9px] opacity-80">
                      Expense ₹9,480
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold text-heading">
                      Recent transactions
                    </p>

                    <span className="text-[9px] text-primary">View all</span>
                  </div>

                  <div className="space-y-2">
                    {transactions.map((transaction) => {
                      const Icon = transaction.icon;

                      return (
                        <div
                          key={`${transaction.category}-${transaction.name}`}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-hover transition"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              transaction.type === "income"
                                ? "bg-primary-light text-primary"
                                : "bg-secondary-light text-secondary"
                            }`}
                          >
                            <Icon size={13} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-medium text-heading truncate">
                              {transaction.name}
                            </p>

                            <p className="text-[8px] text-text-muted truncate">
                              {transaction.category}
                            </p>
                          </div>

                          <span
                            className={`text-[9px] font-semibold ${
                              transaction.type === "income"
                                ? "text-primary"
                                : "text-secondary"
                            }`}
                          >
                            {transaction.amount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute -right-8 bottom-5 w-32 p-3 bg-surface rounded-xl border border-border-light shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-secondary-light text-secondary flex items-center justify-center">
                  <BarChart3 size={14} />
                </div>

                <div>
                  <p className="text-[8px] text-text-muted">Monthly spending</p>

                  <p className="text-xs font-bold text-heading">₹9,480</p>
                </div>
              </div>

              <div className="mt-2 h-1.5 bg-primary-light rounded-full overflow-hidden">
                <div className="h-full w-[38%] bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 card p-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex flex-col gap-3 p-5 rounded-2xl hover:bg-surface-hover transition"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                  <Icon size={20} />
                </div>

                <h2 className="font-semibold text-lg text-heading">
                  {feature.title}
                </h2>

                <p className="text-sm text-text-muted leading-6">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5">
        <Banner />
      </section>

      <section id="about" className="card p-6 md:p-10 mx-auto mt-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="w-full lg:w-3/5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#dce7e6" />

                <XAxis dataKey="month" stroke="#6b7d80" fontSize={12} />

                <YAxis stroke="#6b7d80" fontSize={12} />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#177f83"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

                <Line
                  type="monotone"
                  dataKey="salary"
                  name="Salary"
                  stroke="#ef806f"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:max-w-md">
            <p className="text-primary font-medium text-sm">
              Your money, simplified
            </p>

            <h2 className="text-3xl font-bold mt-2 text-heading leading-tight">
              See your finances clearly.
            </h2>

            <p className="text-text-muted mt-3 leading-7">
              Track every transaction and understand your financial habits
              through a simple and intuitive dashboard.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-4 rounded-xl bg-primary-light">
                <p className="text-xs text-text-muted">Total income</p>
                <p className="text-lg font-bold text-primary mt-1">₹62,000</p>
              </div>

              <div className="p-4 rounded-xl bg-secondary-light">
                <p className="text-xs text-text-muted">Total spending</p>
                <p className="text-lg font-bold text-secondary mt-1">₹9,480</p>
              </div>
            </div>

            <Link to="/login" className="btn btn-secondary mt-6 inline-block">
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-10 py-10 text-center border-t border-border-light">
        <h2 className="font-bold text-xl text-heading">FinTrack</h2>

        <p className="text-sm text-text-muted mt-2">
          Smarter spending. Brighter future.
        </p>

        <p className="text-xs text-muted mt-4">Track. Understand. Improve.</p>
      </footer>
    </div>
  );
};

export default Landing;
