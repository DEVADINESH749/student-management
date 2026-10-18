import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    GraduationCap,
    BookOpen,
    LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Students",
            path: "/students",
            icon: GraduationCap,
        },
        {
            name: "Courses",
            path: "/courses",
            icon: BookOpen,
        },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-mark">SM</div>

                <div>
                    <strong>Student</strong>
                    <span>Management</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <span className="sidebar-label">MENU</span>

                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-bottom">
                <button
                    type="button"
                    className="sidebar-logout"
                    onClick={logout}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;