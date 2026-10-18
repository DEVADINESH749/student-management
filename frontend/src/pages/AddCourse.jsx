import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createCourse } from "../services/courseService";

const AddCourse = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
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

        if (!formData.name || !formData.code) {
            setError("Please enter course name and course code.");
            return;
        }

        try {
            setLoading(true);

            await createCourse(formData);

            navigate("/courses");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to create course."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="page-section form-page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">COURSE MANAGEMENT</span>
                    <h1>Add Course</h1>
                    <p>Create a new course record.</p>
                </div>

                <Link
                    to="/courses"
                    className="secondary-button"
                >
                    <ArrowLeft size={18} />
                    Back to Courses
                </Link>
            </div>

            {error && (
                <div className="auth-error" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="data-form">
                <div className="form-grid">

                    <div className="form-field">
                        <label htmlFor="name">
                            Course Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. Python Full Stack Development"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="code">
                            Course Code
                        </label>

                        <input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="e.g. PFS101"
                            value={formData.code}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field full-width">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            placeholder="Enter course description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="form-actions">
                    <Link
                        to="/courses"
                        className="secondary-button"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        <Save size={18} />

                        {loading
                            ? "Saving..."
                            : "Save Course"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AddCourse;