import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api/authApi";
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from "../constants/authConstants";
import "../styles/authForm.css";

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

function RegisterForm() {
  const navigate = useNavigate();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase letter";
    }

    if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain lowercase letter";
    }

    if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain number";
    }

    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setGeneralError(null);
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await registerMutation({
        email: formData.email.trim(),
        password: formData.password
      }).unwrap();

      alert(AUTH_SUCCESS_MESSAGES.REGISTER_SUCCESS);
      navigate("/dashboard");
    } catch (err) {
      const errorObj = err as ApiError;
      const message =
        errorObj?.data?.message ||
        errorObj?.message ||
        AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
      setGeneralError(String(message));
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>

      {generalError && (
        <div className="auth-error">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={isLoading}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            disabled={isLoading}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
          <small className="password-hint">
            Must contain: uppercase, lowercase, number, special character, minimum 8 characters
          </small>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
            disabled={isLoading}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-button"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
