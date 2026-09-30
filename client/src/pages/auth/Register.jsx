import { useState } from "react";

import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import { useAuth } from "../../context/AuthContext";
import { validateField, validateForm } from "../../utils/validation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();

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
    const errors = validateForm(formData);

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const data = await register(formData);

      toast.success(data.message);

      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Registration failed");
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
    <div>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        <AuthInput
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          autoComplete="name"
          error={formErrors.name}
        />

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
          error={formErrors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="mt-5 text-sm text-text-secondary">
        Already have an account{" "}
        <Link
          to="/login"
          className="font-semibold text-primary transition hover:text-primary-hover"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;