import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            await login(formData);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-visual">
                <div className="auth-visual-content">
                    <div className="brand-mark">SM</div>

                    <span className="eyebrow">STUDENT MANAGEMENT</span>

                    <h1>
                        Manage students.
                        <br />
                        <span>Grow smarter.</span>
                    </h1>

                    <p>
                        A simple and powerful platform to manage students,
                        courses, and academic information in one place.
                    </p>
                </div>
            </section>

            <section className="auth-panel">
                <div className="auth-card">
                    <div className="auth-mobile-brand">
                        <div className="brand-mark">SM</div>
                        <span>Student Management</span>
                    </div>

                    <div className="auth-heading">
                        <span className="eyebrow">WELCOME BACK</span>
                        <h2>Sign in to your account</h2>
                        <p>
                            Enter your credentials to continue to the
                            dashboard.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <label htmlFor="email">Email address</label>

                            <div className="input-wrapper">
                                <Mail size={19} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <div className="field-label-row">
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="input-wrapper">
                                <LockKeyhole size={19} />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/register">Create account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;
