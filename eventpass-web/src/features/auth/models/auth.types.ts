import { z } from "zod";
import { loginSchema } from "../schema";

export type LoginFormData = z.infer<typeof loginSchema>;

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    login: (data: LoginFormData) => Promise<void>;
    logout: () => void;
}
