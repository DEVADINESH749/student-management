import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { registerUser } from "../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

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

        if (!formData.name || !formData.email || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            await registerUser(formData);

            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to create account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <div className="auth-icon">
                        <UserPlus size={24} />
                    </div>

                    <span className="eyebrow">
                        STUDENT MANAGEMENT
                    </span>

                    <h1>Create Account</h1>

                    <p>
                        Register to access the student management dashboard.
                    </p>

                </div>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <div className="form-field">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="email">
                            Email address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />

                    </div>

                    <div className="form-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            autoComplete="new-password"
                        />

                    </div>

                    <button
                        type="submit"
                        className="primary-button auth-submit"
                        disabled={loading}
                    >
                        <UserPlus size={18} />

                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign in
                    </Link>

                </div>

            </div>

        </main>
    );
};

export default Register;
