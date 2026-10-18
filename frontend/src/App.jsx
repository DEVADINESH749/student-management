import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";

import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";

import Layout from "./components/Layout";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public Routes */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* Protected Application Routes */}

                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >

                        {/* Dashboard */}

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />


                        {/* Student Management */}

                        <Route
                            path="/students"
                            element={<Students />}
                        />

                        <Route
                            path="/students/add"
                            element={<AddStudent />}
                        />

                        <Route
                            path="/students/edit/:studentId"
                            element={<EditStudent />}
                        />


                        {/* Course Management */}

                        <Route
                            path="/courses"
                            element={<Courses />}
                        />

                        <Route
                            path="/courses/add"
                            element={<AddCourse />}
                        />

                        <Route
                            path="/courses/edit/:courseId"
                            element={<EditCourse />}
                        />

                    </Route>


                    {/* Default Route */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                    {/* Invalid Route */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;