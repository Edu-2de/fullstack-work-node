import { Route, Routes } from "react-router-dom";
import OrganizerRoute from "./components/organizer-route";
import PrivateRoute from "./components/private-route";
import LayoutMain from "./pages/layout-main";
import PageComponents from "./pages/page-components";
import PageCreateEvent from "./pages/page-create-event";
import PageEventDetail from "./pages/page-event-detail";
import PageHome from "./pages/page-home";
import PageLogin from "./pages/page-login";
import PageMyEvents from "./pages/page-my-events";
import PageRegister from "./pages/page-register";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<PageLogin />} />
            <Route path="/register" element={<PageRegister />} />
            <Route path="/components" element={<PageComponents />} />
            <Route element={<PrivateRoute />}>
                <Route element={<LayoutMain />}>
                    <Route path="/" element={<PageHome />} />
                    <Route path="/my-events" element={<PageMyEvents />} />
                    <Route path="/event/:id" element={<PageEventDetail />} />
                    <Route element={<OrganizerRoute />}>
                        <Route
                            path="/create-event"
                            element={<PageCreateEvent />}
                        />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}
