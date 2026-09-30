const TransactionFilters = ({
  categories,
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-light bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setType("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                type === "all"
                  ? "bg-primary text-white"
                  : "bg-background text-text-secondary hover:bg-primary-light hover:text-primary"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setType("income")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                type === "income"
                  ? "bg-info text-white"
                  : "bg-info-light text-info hover:opacity-80"
              }`}
            >
              Income
            </button>

            <button
              type="button"
              onClick={() => setType("expense")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                type === "expense"
                  ? "bg-secondary text-white"
                  : "bg-secondary-light text-secondary hover:bg-secondary-light"
              }`}
            >
              Expense
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="h-10 rounded-md border border-border-light bg-surface px-3 text-sm text-heading outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary-light"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-md border border-border-light bg-surface px-3 text-sm text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
            >
              <option value="all">All Categories</option>

              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
