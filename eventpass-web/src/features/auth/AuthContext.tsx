import { createContext, useState, type ReactNode } from "react";
import { api } from "../../helpers/api";
import {
    type AuthContextData,
    type LoginFormData,
    type User,
} from "./models/auth.types";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("@EventApp:user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    async function login(data: LoginFormData) {
        const response = await api.post("/login", data);

        const { user: userData, token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("@EventApp:user", JSON.stringify(userData));
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("@EventApp:user");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };
