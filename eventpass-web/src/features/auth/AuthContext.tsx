import { createContext, useState, type ReactNode } from "react";
import { api } from "../../helpers/api"; // Ajuste o caminho se necessário
import {
    type AuthContextData,
    type LoginFormData,
    type User,
} from "./models/auth.types";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Inicializa o estado buscando do localStorage (caso o usuário dê F5 na página)
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("@EventApp:user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    async function login(data: LoginFormData) {
        // Envia a requisição para o back-end
        const response = await api.post("/login", data);

        // Pega os dados da resposta
        const { user: userData, token } = response.data;

        // Salva os dados localmente
        localStorage.setItem("token", token);
        localStorage.setItem("@EventApp:user", JSON.stringify(userData));

        // Atualiza o estado global da aplicação
        setUser(userData);
    }

    function logout() {
        // Limpa tudo ao sair
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
