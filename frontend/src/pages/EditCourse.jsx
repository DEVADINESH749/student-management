import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getCourse, updateCourse } from "../services/courseService";

const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const data = await getCourse(courseId);

                setFormData({
                    name: data.name || "",
                    code: data.code || "",
                    description: data.description || "",
                });
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load course."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCourse();
    }, [courseId]);

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
            setSaving(true);

            await updateCourse(courseId, formData);

            navigate("/courses");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to update course."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="page-section">
                <div className="empty-state">
                    <p>Loading course...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="page-section form-page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        COURSE MANAGEMENT
                    </span>

                    <h1>Edit Course</h1>

                    <p>Update the course record.</p>
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
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter course name"
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
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g. PFS101"
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
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter course description"
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
                        disabled={saving}
                    >
                        <Save size={18} />

                        {saving
                            ? "Updating..."
                            : "Update Course"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default EditCourse;