import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Edit,
    Plus,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import {
    getCourses,
    deleteCourse,
    assignStudentToCourse,
    getEnrolledStudents,
} from "../services/courseService";

import { getStudents } from "../services/studentService";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState("");

    const [assigning, setAssigning] = useState(false);

    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [showEnrolled, setShowEnrolled] = useState(false);
    const [loadingEnrolled, setLoadingEnrolled] = useState(false);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCourses();
            setCourses(data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load courses."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (err) {
            console.error("Unable to load students:", err);
        }
    };

    useEffect(() => {
        loadCourses();
        loadStudents();
    }, []);

    const handleDelete = async (courseId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteCourse(courseId);

            setCourses((current) =>
                current.filter((course) => course.id !== courseId)
            );
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to delete course."
            );
        }
    };

    const openAssignModal = (course) => {
        setSelectedCourse(course);
        setSelectedStudent("");
        setError("");
    };

    const closeAssignModal = () => {
        setSelectedCourse(null);
        setSelectedStudent("");
    };

    const handleAssignStudent = async (event) => {
        event.preventDefault();

        if (!selectedStudent) {
            setError("Please select a student.");
            return;
        }

        try {
            setAssigning(true);
            setError("");

            await assignStudentToCourse(
                selectedCourse.id,
                Number(selectedStudent)
            );

            alert("Student assigned successfully.");

            closeAssignModal();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to assign student to course."
            );
        } finally {
            setAssigning(false);
        }
    };

    const handleViewEnrolled = async (course) => {
        try {
            setLoadingEnrolled(true);
            setError("");

            const data = await getEnrolledStudents(course.id);

            setEnrolledStudents(data);
            setSelectedCourse(course);
            setShowEnrolled(true);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load enrolled students."
            );
        } finally {
            setLoadingEnrolled(false);
        }
    };

    const closeEnrolledModal = () => {
        setShowEnrolled(false);
        setEnrolledStudents([]);
        setSelectedCourse(null);
    };

    return (
        <section className="page-section">

            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        COURSE MANAGEMENT
                    </span>

                    <h1>Courses</h1>

                    <p>
                        View and manage all available courses.
                    </p>
                </div>

                <Link
                    to="/courses/add"
                    className="primary-button"
                >
                    <Plus size={18} />
                    Add Course
                </Link>
            </div>

            {error && (
                <div className="auth-error" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="empty-state">
                    <p>Loading courses...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={42} />

                    <h3>No courses found</h3>

                    <p>
                        Add your first course to get started.
                    </p>
                </div>
            ) : (
                <div className="students-table-wrapper">
                    <table className="students-table">

                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Code</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>

                                    <td>
                                        <strong>
                                            {course.name}
                                        </strong>
                                    </td>

                                    <td>
                                        {course.code}
                                    </td>

                                    <td>
                                        {course.description || "-"}
                                    </td>

                                    <td>
                                        <div className="table-actions">

                                            <button
                                                type="button"
                                                className="icon-button"
                                                title="Assign student"
                                                onClick={() =>
                                                    openAssignModal(course)
                                                }
                                            >
                                                <UserPlus size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                className="icon-button"
                                                title="View enrolled students"
                                                onClick={() =>
                                                    handleViewEnrolled(course)
                                                }
                                            >
                                                <Users size={17} />
                                            </button>

                                            <Link
                                                to={`/courses/edit/${course.id}`}
                                                className="icon-button edit"
                                                title="Edit course"
                                            >
                                                <Edit size={17} />
                                            </Link>

                                            <button
                                                type="button"
                                                className="icon-button delete"
                                                title="Delete course"
                                                onClick={() =>
                                                    handleDelete(course.id)
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

            {/* Assign Student Modal */}

            {selectedCourse && !showEnrolled && (
                <div className="modal-overlay">

                    <div className="modal-card">

                        <div className="modal-header">

                            <div>
                                <span className="eyebrow">
                                    COURSE ENROLLMENT
                                </span>

                                <h2>
                                    Assign Student
                                </h2>

                                <p>
                                    {selectedCourse.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeAssignModal}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={handleAssignStudent}
                            className="data-form"
                        >

                            <div className="form-field">

                                <label htmlFor="student">
                                    Select Student
                                </label>

                                <select
                                    id="student"
                                    value={selectedStudent}
                                    onChange={(event) =>
                                        setSelectedStudent(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select a student
                                    </option>

                                    {students.map((student) => (
                                        <option
                                            key={student.id}
                                            value={student.id}
                                        >
                                            {student.name} - {student.email}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeAssignModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={assigning}
                                >
                                    <UserPlus size={18} />

                                    {assigning
                                        ? "Assigning..."
                                        : "Assign Student"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* Enrolled Students Modal */}

            {showEnrolled && selectedCourse && (
                <div className="modal-overlay">

                    <div className="modal-card">

                        <div className="modal-header">

                            <div>
                                <span className="eyebrow">
                                    ENROLLMENT DETAILS
                                </span>

                                <h2>
                                    Enrolled Students
                                </h2>

                                <p>
                                    {selectedCourse.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeEnrolledModal}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {loadingEnrolled ? (
                            <div className="empty-state">
                                <p>
                                    Loading enrolled students...
                                </p>
                            </div>
                        ) : enrolledStudents.length === 0 ? (
                            <div className="empty-state">
                                <Users size={40} />

                                <h3>
                                    No students enrolled
                                </h3>

                                <p>
                                    No students have been assigned
                                    to this course yet.
                                </p>
                            </div>
                        ) : (
                            <div className="enrolled-list">

                                {enrolledStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="enrolled-student"
                                    >
                                        <div>
                                            <strong>
                                                {student.name}
                                            </strong>

                                            <span>
                                                {student.email}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={closeEnrolledModal}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </section>
    );
};

export default Courses;