import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-heading">
        Take control of your finances
      </h2>
      <p className="text-secondary text-[14px]">
        Track. save. Build your future.
      </p>
      <Link to="/transactions" className="btn btn-secondary mt-5">
        Add Transaction
      </Link>
    </div>
  );
};

export default Banner;
