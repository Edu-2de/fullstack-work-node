import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function OrganizerRoute() {
    const { user } = useAuth();
    const isAuthenticated =
        user?.role === "admin" || user?.role === "organizer";
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
