import { Navigate, Outlet } from "react-router-dom";

export default function OrganizerRoute() {
    const role = localStorage.getItem("role");
    const isAuthenticated = role == "admin" || role == "organizer";

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
