import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash2, GraduationCap } from "lucide-react";
import {
    getStudents,
    deleteStudent,
} from "../services/studentService";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load students."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const handleDelete = async (studentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteStudent(studentId);
            setStudents((current) =>
                current.filter((student) => student.id !== studentId)
            );
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to delete student."
            );
        }
    };

    return (
        <section className="page-section">
            <div className="page-header">
                <div>
                    <span className="eyebrow">STUDENT MANAGEMENT</span>
                    <h1>Students</h1>
                    <p>View and manage all student records.</p>
                </div>

                <Link to="/students/add" className="primary-button">
                    <Plus size={18} />
                    Add Student
                </Link>
            </div>

            {error && (
                <div className="auth-error" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="empty-state">
                    <p>Loading students...</p>
                </div>
            ) : students.length === 0 ? (
                <div className="empty-state">
                    <GraduationCap size={42} />
                    <h3>No students found</h3>
                    <p>Add your first student to get started.</p>
                </div>
            ) : (
                <div className="students-table-wrapper">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Course</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <strong>{student.name}</strong>
                                    </td>
                                    <td>{student.email}</td>
                                    <td>{student.phone}</td>
                                    <td>{student.department}</td>
                                    <td>{student.course}</td>
                                    <td>
                                        <div className="table-actions">
                                            <Link
                                                to={`/students/edit/${student.id}`}
                                                className="icon-button edit"
                                                title="Edit student"
                                            >
                                                <Edit size={17} />
                                            </Link>

                                            <button
                                                type="button"
                                                className="icon-button delete"
                                                title="Delete student"
                                                onClick={() =>
                                                    handleDelete(student.id)
                                                }
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default Students;