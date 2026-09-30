import { X } from "lucide-react";

import { TRANSACTION_TYPES } from "../../constants/transaction";

import { categories } from "../../constants/categories";

const TransactionModal = ({
  formData,
  onChange,
  onTypeChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <aside
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="transaction-modal-title" className="modal-title">
            Add Transaction
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-5 flex w-full overflow-hidden rounded-xl border border-border-light">
            <button
              type="button"
              onClick={() => onTypeChange(TRANSACTION_TYPES.EXPENSE)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                formData.type === TRANSACTION_TYPES.EXPENSE
                  ? "bg-secondary text-white"
                  : "bg-background text-text-secondary hover:bg-secondary-light hover:text-secondary"
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => onTypeChange(TRANSACTION_TYPES.INCOME)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                formData.type === TRANSACTION_TYPES.INCOME
                  ? "bg-info text-white"
                  : "bg-background text-text-secondary hover:bg-info-light hover:text-info"
              }`}
            >
              Income
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>

              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={onChange}
                className="form-input"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onChange}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={onChange}
                className="form-select"
                required
              >
                <option value="">Select category</option>

                {categories[formData.type]?.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date
              </label>

              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default TransactionModal;
