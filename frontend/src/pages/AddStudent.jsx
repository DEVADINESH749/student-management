import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createStudent } from "../services/studentService";

const AddStudent = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        course: "",
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

        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.department ||
            !formData.course
        ) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);

            await createStudent(formData);

            navigate("/students");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to create student."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="page-section form-page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">STUDENT MANAGEMENT</span>
                    <h1>Add Student</h1>
                    <p>Create a new student record.</p>
                </div>

                <Link to="/students" className="secondary-button">
                    <ArrowLeft size={18} />
                    Back to Students
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
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter student name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="student@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="department">Department</label>
                        <input
                            id="department"
                            name="department"
                            type="text"
                            placeholder="e.g. Computer Applications"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field full-width">
                        <label htmlFor="course">Course</label>
                        <input
                            id="course"
                            name="course"
                            type="text"
                            placeholder="e.g. MCA"
                            value={formData.course}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <Link to="/students" className="secondary-button">
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Student"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AddStudent;