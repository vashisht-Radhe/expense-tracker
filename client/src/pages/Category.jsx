import axios from "axios";

import { ArrowDown, ArrowUp } from "lucide-react";

import { useEffect, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const Category = () => {
  const [categoryData, setCategoryData] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5500/api/transactions/by-category?type=expense",
        {
          withCredentials: true,
        },
      );

      setCategoryData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <p className="text-text-secondary">Loading categories...</p>
      </div>
    );
  }

  const categoryComparison = categoryData?.categoryComparison ?? [];

  const totalAmount = categoryData?.currentMonthTotal ?? 0;

  const visibleCategories = categoryComparison.filter(
    (item) => item.currentMonthAmount > 0,
  );

  return (
    <div className="grid grid-cols-1">
      <div className="card space-y-6">
        <div className="flex items-center justify-between border-b border-border-light pb-5">
          <div>
            <h2 className="text-lg font-semibold text-heading">
              All Categories
            </h2>

            <p className="text-sm text-text-secondary">This month's expenses</p>
          </div>

          <p className="text-lg font-semibold text-heading">
            {currencyFormatter.format(totalAmount)}
          </p>
        </div>

        {visibleCategories.length === 0 ? (
          <p className="py-6 text-center text-text-secondary">
            No expenses found.
          </p>
        ) : (
          <div className="space-y-6">
            {visibleCategories.map((item) => {
              const currentAmount = item.currentMonthAmount ?? 0;

              const percentageChange = item.percentageChange;

              const spendingPercentage =
                totalAmount > 0 ? (currentAmount / totalAmount) * 100 : 0;

              const isDecrease =
                percentageChange !== null && percentageChange < 0;

              const isIncrease =
                percentageChange !== null && percentageChange > 0;

              const displayChange =
                percentageChange === null
                  ? null
                  : percentageChange === -100
                    ? 0
                    : Math.abs(percentageChange);

              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-light text-sm font-semibold text-secondary">
                        {item.category?.charAt(0)?.toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-heading">
                          {item.category}
                        </p>

                        <p className="text-xs text-text-secondary">
                          {spendingPercentage.toFixed(2)}% of total spending
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-heading">
                        {currencyFormatter.format(currentAmount)}
                      </p>

                      {percentageChange !== null && (
                        <p
                          className={`flex items-center justify-end gap-1 text-sm font-medium ${
                            isDecrease
                              ? "text-success"
                              : isIncrease
                                ? "text-secondary"
                                : "text-text-secondary"
                          }`}
                        >
                          {isDecrease && <ArrowDown size={14} />}
                          {isIncrease && <ArrowUp size={14} />}
                          {displayChange}%
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border-light">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-500"
                      style={{
                        width: `${Math.min(spendingPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;