import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardHeader = ({ currentMonth, greeting }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center rounded-full bg-primary-light px-3 py-1">
            <span className="text-sm font-semibold text-primary">
              {currentMonth}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-heading md:text-5xl">
            {greeting}, {user.name}
          </h1>

          <p className="mt-3 max-w-xl text-base text-text-secondary">
            Here's a quick look at your financial activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            // onClick={() => setIsModalOpen(true)}
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus
              size={17}
              className="transition-transform group-hover:rotate-90"
            />
            Add Transaction
          </button> */}

          <Link
            to="/analytics"
            className="group inline-flex items-center gap-2 rounded-md bg-surface px-4 py-2.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-border-light transition-all hover:bg-primary hover:text-white hover:shadow-md"
          >
            View analytics
            <ChevronRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* {isModalOpen && (
        <TransactionModal
          formData={formData}
          onChange={handleFormChange}
          onTypeChange={handleTypeChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )} */}
    </>
  );
};

export default DashboardHeader;
