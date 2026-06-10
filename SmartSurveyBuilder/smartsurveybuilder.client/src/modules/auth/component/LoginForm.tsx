import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from "../constants/authConstants";
import "../styles/authForm.css";

function LoginForm() {

    const navigate = useNavigate();

    const { login, loading, error } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setErrorMessage(null);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrorMessage(null);

        try {

            const payload = {
                email: formData.email.trim(),
                password: formData.password
            };

            await login(payload);

            alert(AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS);

            navigate("/dashboard");

        } catch (err) {

            const message = (err as any)?.message || AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
            setErrorMessage(message);
            console.error("Login error:", err);
        }
    };

    return (

        <div className="auth-card">

            <h2>Login</h2>

            {(errorMessage || error) && (
                <div className="auth-error">
                    {errorMessage || error}
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
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="auth-button"
                >

                    {
                        loading
                            ? "Loading..."
                            : "Login"
                    }

                </button>

            </form>

            <p>

                New User?{" "}

                <Link to="/register">
                    Sign Up
                </Link>

            </p>

        </div>
    );
}

export default LoginForm;