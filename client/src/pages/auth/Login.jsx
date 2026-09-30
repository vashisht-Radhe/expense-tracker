import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "../../components/auth/AuthInput";
import { useAuth } from "../../context/AuthContext";
import { validateField, validateForm } from "../../utils/validation";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(formData);

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const data = await login(formData);

      toast.success(data.message || "Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const message = error.response.data?.message;

        toast.error(message || "Login failed");
      } else if (error.request) {
        toast.error("Server is not responding");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content min-h-screen flex items-center justify-center bg-primary-light px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              error={formErrors.username}
            />

            <AuthInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={formErrors.password}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 border-t border-border pt-5 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary transition hover:text-primary-hover"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-text-muted">
          Take control of your money with FinTrack.
        </p>
      </div>
    </main>
  );
};

export default Login;
