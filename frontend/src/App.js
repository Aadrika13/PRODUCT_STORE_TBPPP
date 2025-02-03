import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard"; // Assuming you have this page

const App = () => {
    const [user, setUser] = useState(null); // Manage user state (null if not logged in)
    const [loading, setLoading] = useState(true); // Handle loading state

    useEffect(() => {
        // Check user authentication status when the app loads
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/user", {
                    method: "GET",
                    credentials: "include", // Include cookies for authentication
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // If still loading, show a loading indicator or a placeholder
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* Default route */}
                <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/user"} /> : <Login />} />
                
                {/* Auth routes */}
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

                {/* Protected routes */}
                <Route
                    path="/admin"
                    element={user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
                />
                
                <Route
                    path="/user"
                    element={user && user.role === "user" ? <UserDashboard /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
