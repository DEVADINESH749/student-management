import { createContext, useContext, useEffect, useState } from "react";
import {
    loginUser,
    getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        localStorage.setItem("access_token", data.access_token);

        const currentUser = await getCurrentUser();
        setUser(currentUser);

        return currentUser;
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                localStorage.removeItem("access_token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
