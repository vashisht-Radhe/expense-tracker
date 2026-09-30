import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  createTransaction,
  getTransactionCategories,
  getTransactions,
  updateTransaction,
} from "../api/transaction.api";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionModal from "../components/transactions/TransactionModal";
import {
  INITIAL_TRANSACTION_FORM,
  TRANSACTION_FILTER_DEFAULTS,
} from "../constants/transaction";
import Split from "../components/transactions/Split";
import Table from "../components/transactions/TransactionsTable";
import useCategories from "../hooks/useCategories";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSplitOpen, setIsSplitOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [splitTransaction, setSplitTransaction] = useState(null);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState(TRANSACTION_FILTER_DEFAULTS);

  const [formData, setFormData] = useState(INITIAL_TRANSACTION_FORM);

  const availableCategories = useCategories();

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = {
        ...Object.fromEntries(
          Object.entries(filters).filter(
            ([, value]) => value && value !== "all",
          ),
        ),
        page,
        limit,
      };

      const data = await getTransactions(params);

      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, page, limit]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: "",
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_TRANSACTION_FORM);
  };

  const closeForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const closeSplit = () => {
    setIsSplitOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      let response;

      if (editingTransaction) {
        response = await updateTransaction(editingTransaction._id, payload);

        toast.success(response.message || "Transaction updated successfully");
      } else {
        response = await createTransaction(payload);

        toast.success(response.message || "Transaction added successfully");
      }

      closeForm();
      fetchTransactions();
    } catch (error) {
      console.error("Failed to save transaction:", error);

      toast.error(
        error.response?.data?.message || "Failed to save transaction",
      );
    }
  };

  useEffect(() => {
    if (!isFormOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFormOpen]);

  if (loading && transactions.length === 0) {
    return <div>Loading transactions...</div>;
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date?.split("T")[0] || "",
    });

    setIsFormOpen(true);
  };

  const handleSplit = (transaction) => {
    setSplitTransaction(transaction);

    setIsSplitOpen(true);
  };

  const currentPage = pagination?.page || 0;
  const totalPages = pagination?.totalPages || 0;
  const hasNextPage = pagination?.hasNextPage;
  const hasPreviousPage = pagination?.hasPreviousPage;

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="content">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl">Transactions</h1>

          <p>Track where your money goes, stay in control.</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-secondary"
        >
          <Plus size={14} />
          Add Transaction
        </button>
      </div>

      <div className="mt-10">
        <TransactionFilters
          transactions={transactions}
          categories={availableCategories}
          search={filters.search}
          setSearch={(value) => handleFilterChange("search", value)}
          category={filters.category}
          setCategory={(value) => handleFilterChange("category", value)}
          type={filters.type}
          setType={(value) => handleFilterChange("type", value)}
          amountRange={filters.amountRange}
          setAmountRange={(value) => handleFilterChange("amountRange", value)}
        />

        <Table
          transactions={transactions}
          startIndex={(page - 1) * limit}
          onEdit={handleEdit}
          onSplit={handleSplit}
        />

        <div className=" w-full p-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
            >
              {[10, 15, 20, 30].map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              disabled={!hasPreviousPage}
              onClick={handlePreviousPage}
              className={`btn ${
                hasPreviousPage ? "btn-primary" : "btn-secondary"
              } disabled:cursor-not-allowed`}
            >
              Prev
            </button>

            <button
              type="button"
              disabled={!hasNextPage}
              onClick={handleNextPage}
              className={`btn ${hasNextPage ? "btn-primary" : "btn-secondary"} 
                disabled:cursor-not-allowed`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Add Transaction */}

        {isFormOpen && (
          <TransactionModal
            formData={formData}
            onChange={handleFormChange}
            onTypeChange={handleTypeChange}
            onSubmit={handleSubmit}
            onClose={closeForm}
          />
        )}

        {isSplitOpen && (
          <Split transaction={splitTransaction} onClose={closeSplit} />
        )}
      </div>
    </div>
  );
};

export default Transactions;
