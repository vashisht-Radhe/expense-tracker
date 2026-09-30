import axios from "axios";
import { AlertCircle, Check, Plus, Receipt, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

const Split = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const total = Number(transaction.amount) || 0;
  const category = transaction.category || "Uncategorized";

  const [splits, setSplits] = useState([
    {
      subcategory: "",
      amount: "",
    },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addMessage, setAddMessage] = useState("");

  const splitSum = useMemo(() => {
    return splits.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [splits]);

  const remaining = total - splitSum;

  const isComplete = remaining === 0;
  const isOver = remaining < 0;

  const progress = total > 0 ? Math.min((splitSum / total) * 100, 100) : 0;

  const handleAddInput = () => {
    setError("");
    setSuccess("");

    if (remaining <= 0) {
      setAddMessage(
        isOver
          ? "You cannot add another split while the allocated amount is over the transaction total."
          : "You cannot add another split because the full transaction amount has already been allocated.",
      );

      return;
    }

    setAddMessage("");

    setSplits((prev) => [
      ...prev,
      {
        subcategory: "",
        amount: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    setError("");
    setSuccess("");
    setAddMessage("");

    setSplits((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleRemove = (index) => {
    setError("");
    setSuccess("");
    setAddMessage("");

    if (splits.length === 1) {
      setError("At least one split item is required.");
      return;
    }

    setSplits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (splits.some((item) => !item.subcategory.trim())) {
      setError("Please enter a name for every split item.");
      return;
    }

    if (splits.some((item) => !item.amount || Number(item.amount) <= 0)) {
      setError("Every split amount must be greater than ₹0.");
      return;
    }

    if (isOver) {
      setError(
        `The split total is ₹${Math.abs(
          remaining,
        )} over the transaction amount.`,
      );
      return;
    }

    if (remaining > 0) {
      setError(
        `₹${remaining} is still unallocated. Please allocate the full amount.`,
      );
      return;
    }

    const id = transaction._id;

    const result = splits.map((item) => ({
      subcategory: item.subcategory.trim(),
      amount: Number(item.amount),
    }));

    const response = await axios.post(
      `http://localhost:5500/api/transactions/${id}/split`,
      {
        splits: result,
      },
      {
        withCredentials: true,
      },
    );

    setSuccess("Transaction split successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Receipt size={19} />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Split Transaction
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Divide this transaction between multiple categories.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* Left */}
            <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
              {/* Transaction details */}
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Transaction Details
                </p>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{category}</p>

                    {transaction.description && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {transaction.description}
                      </p>
                    )}
                  </div>

                  <p className="text-xl font-semibold text-slate-900">
                    ₹{total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Split Items
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Add categories and assign an amount to each.
                    </p>
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {splits.length} {splits.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-2">
                  {splits.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[32px_minmax(0,1fr)_110px_36px] items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-slate-300"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                        {index + 1}
                      </div>

                      <input
                        type="text"
                        placeholder="Subcategory"
                        value={item.subcategory}
                        onChange={(e) =>
                          handleChange(index, "subcategory", e.target.value)
                        }
                        className="min-w-0 border-0 bg-transparent px-2 py-2 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                      />

                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={item.amount}
                          onChange={(e) =>
                            handleChange(index, "amount", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-2 text-right text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        disabled={splits.length === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Remove split"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddInput}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-sm font-medium transition ${
                    addMessage
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-slate-300 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Plus size={17} />
                  Add Split Item
                </button>

                {addMessage && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-700">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />

                    <span>{addMessage}</span>
                  </div>
                )}
              </div>
            </div>

            <aside className="bg-slate-50/70 p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Summary
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Split progress</span>

                  <span
                    className={`text-sm font-semibold ${
                      isComplete
                        ? "text-green-600"
                        : isOver
                          ? "text-red-600"
                          : "text-slate-900"
                    }`}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isComplete
                        ? "bg-green-500"
                        : isOver
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }`}
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Transaction amount</span>

                    <span className="font-medium text-slate-900">₹{total}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Allocated</span>

                    <span className="font-medium text-slate-900">
                      ₹{splitSum}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {isOver ? "Over" : "Remaining"}
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          isComplete
                            ? "text-green-600"
                            : isOver
                              ? "text-red-600"
                              : "text-amber-600"
                        }`}
                      >
                        ₹{Math.abs(remaining)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className={`mt-4 rounded-xl border p-4 ${
                  isComplete
                    ? "border-green-200 bg-green-50"
                    : isOver
                      ? "border-red-200 bg-red-50"
                      : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      isComplete
                        ? "bg-green-100 text-green-600"
                        : isOver
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {isComplete ? (
                      <Check size={15} />
                    ) : (
                      <AlertCircle size={15} />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isComplete
                          ? "text-green-800"
                          : isOver
                            ? "text-red-800"
                            : "text-amber-800"
                      }`}
                    >
                      {isComplete
                        ? "Split is complete"
                        : isOver
                          ? "Amount exceeded"
                          : "Amount still remaining"}
                    </p>

                    <p
                      className={`mt-1 text-xs leading-5 ${
                        isComplete
                          ? "text-green-700"
                          : isOver
                            ? "text-red-700"
                            : "text-amber-700"
                      }`}
                    >
                      {isComplete
                        ? "All of the transaction amount has been allocated."
                        : isOver
                          ? `Reduce the split by ₹${Math.abs(
                              remaining,
                            )} before saving.`
                          : `Allocate ₹${remaining} more before saving.`}
                    </p>
                  </div>
                </div>
              </div>

              {success && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <Check size={17} />
                  {success}
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs text-slate-500">Total split</p>

            <p
              className={`mt-0.5 text-lg font-semibold ${
                isComplete
                  ? "text-green-600"
                  : isOver
                    ? "text-red-600"
                    : "text-slate-900"
              }`}
            >
              ₹{splitSum}
              <span className="ml-1 text-sm font-normal text-slate-400">
                / ₹{total}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isComplete}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Save Split
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Split;
