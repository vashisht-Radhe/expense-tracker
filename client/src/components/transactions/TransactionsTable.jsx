import {
  ArrowDown,
  ArrowUp,
  EllipsisVertical,
  Minus,
  Plus,
  Split,
  Trash,
  Edit2,
} from "lucide-react";
import { formatTransactionDate } from "../../constants/formatTransactionDate";
import axios from "axios";
import { Fragment, useState } from "react";

const Table = ({ transactions, startIndex, onEdit, onSplit }) => {
  const [actionId, setActionId] = useState(null);
  const [open, setOpen] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/transactions/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleSplit = (transaction) => {
    onSplit(transaction);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border-light bg-surface shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-212.5 border-collapse">
          <thead>
            <tr className="border-b border-border-light bg-background">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                #
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Date & Time
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Description
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Category
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Type
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Amount
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions?.map((transaction, index) => {
              const isIncome = transaction.type === "income";
              const isSplit = transaction.isSplit === true;

              const splitTotal =
                transaction.splits?.reduce(
                  (acc, split) => acc + Number(split.amount || 0),
                  0,
                ) || 0;

              return (
                <Fragment key={transaction._id || index}>
                  {/* Main transaction row */}
                  <tr
                    key={transaction._id || index}
                    onClick={() =>
                      isSplit &&
                      setOpen((prev) =>
                        prev === transaction._id ? null : transaction._id,
                      )
                    }
                    className={`border-b border-border-light transition-colors ${
                      isSplit ? "cursor-pointer hover:bg-surface-hover" : ""
                    }`}
                  >
                    <td className="px-5 py-4 text-sm text-text-muted">
                      {startIndex + index + 1}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-text-secondary">
                      {formatTransactionDate(transaction.date)}
                    </td>

                    <td className="max-w-55 truncate px-5 py-4 text-sm font-medium text-heading">
                      {transaction.description}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                          {transaction.category}
                        </span>

                        {transaction.isSplit && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-info-light px-2 py-1 text-xs font-medium text-info">
                            <Split size={12} />
                            Split
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div
                        className={`flex items-center gap-1.5 text-sm font-medium ${
                          isIncome ? "text-info" : "text-secondary"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )}

                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div
                        className={`flex items-center gap-1 text-sm font-semibold ${
                          isIncome ? "text-info" : "text-secondary"
                        }`}
                      >
                        {isIncome ? <Plus size={13} /> : <Minus size={13} />}

                        <span>₹{transaction.amount}</span>
                      </div>
                    </td>

                    <td
                      className="relative px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setActionId((prev) =>
                              prev === transaction._id ? null : transaction._id,
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-lg text-text-secondary transition-colors hover:bg-background hover:text-heading"
                          aria-label="Transaction actions"
                        >
                          <EllipsisVertical size={18} />
                        </button>

                        {actionId === transaction._id && (
                          <div className="absolute right-10 top-0 z-50 w-40 rounded-xl border border-border-light bg-surface p-1.5 shadow-lg">
                            <button
                              type="button"
                              onClick={() => {
                                handleSplit(transaction);
                                setActionId(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-primary-light hover:text-primary"
                            >
                              <Split size={16} />
                              <span>Split</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onEdit(transaction);
                                setActionId(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-primary-light hover:text-primary"
                            >
                              <Edit2 size={16} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handleDelete(transaction._id);
                                setActionId(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary hover:bg-secondary-light"
                            >
                              <Trash size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Split details row */}
                  {open === transaction._id && isSplit && (
                    <tr>
                      <td
                        colSpan={7}
                        className="border-b border-border-light bg-background px-6 py-4"
                      >
                        <div className="ml-8 rounded-xl border border-border-light bg-surface p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-heading">
                              Split Details
                            </h4>

                            <span className="text-sm font-semibold text-primary">
                              ₹{splitTotal.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {transaction.splits?.map((split, splitIndex) => (
                              <div
                                key={
                                  split._id ||
                                  `${split.subcategory}-${splitIndex}`
                                }
                                className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
                              >
                                <span className="text-sm text-text-secondary">
                                  {split.subcategory}
                                </span>

                                <span className="text-sm font-medium text-heading">
                                  ₹
                                  {Number(split.amount).toLocaleString("en-IN")}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-border-light pt-3">
                            <span className="text-sm font-medium text-text-secondary">
                              Total
                            </span>

                            <span className="text-sm font-semibold text-heading">
                              ₹{splitTotal.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
