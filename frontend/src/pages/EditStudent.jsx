import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getStudent, updateStudent } from "../services/studentService";

const EditStudent = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        course: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const data = await getStudent(studentId);

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    department: data.department || "",
                    course: data.course || "",
                });
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load student."
                );
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, [studentId]);

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
            setSaving(true);

            await updateStudent(studentId, formData);

            navigate("/students");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to update student."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="page-section">
                <div className="empty-state">
                    <p>Loading student...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="page-section form-page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">STUDENT MANAGEMENT</span>
                    <h1>Edit Student</h1>
                    <p>Update the student record.</p>
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
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter student name"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@example.com"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="department">Department</label>
                        <input
                            id="department"
                            name="department"
                            type="text"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g. Computer Applications"
                        />
                    </div>

                    <div className="form-field full-width">
                        <label htmlFor="course">Course</label>
                        <input
                            id="course"
                            name="course"
                            type="text"
                            value={formData.course}
                            onChange={handleChange}
                            placeholder="e.g. MCA"
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
                        disabled={saving}
                    >
                        <Save size={18} />
                        {saving ? "Updating..." : "Update Student"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default EditStudent;