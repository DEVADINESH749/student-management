import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getStudents } from "../services/studentService";
import { getCourses } from "../services/courseService";

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [studentsData, coursesData] = await Promise.all([
                    getStudents(),
                    getCourses(),
                ]);

                setStudents(studentsData);
                setCourses(coursesData);
            } catch (error) {
                console.error("Dashboard loading error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="eyebrow">OVERVIEW</span>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's your student management overview.</p>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <GraduationCap size={24} />
                    </div>

                    <div>
                        <span>Total Students</span>
                        <strong>
                            {loading ? "..." : students.length}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <BookOpen size={24} />
                    </div>

                    <div>
                        <span>Total Courses</span>
                        <strong>
                            {loading ? "..." : courses.length}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <Users size={24} />
                    </div>

                    <div>
                        <span>Active Records</span>
                        <strong>
                            {loading
                                ? "..."
                                : students.length + courses.length}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/students" className="dashboard-action-card">
                    <div>
                        <h3>Manage Students</h3>
                        <p>View and manage student records.</p>
                    </div>

                    <ArrowRight size={20} />
                </Link>

                <Link to="/courses" className="dashboard-action-card">
                    <div>
                        <h3>Manage Courses</h3>
                        <p>View and manage available courses.</p>
                    </div>

                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;