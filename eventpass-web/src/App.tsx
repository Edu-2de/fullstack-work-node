import { Route, Routes } from "react-router-dom";
import AdminRoute from "./components/admin-route";
import OrganizerRoute from "./components/organizer-route";
import PrivateRoute from "./components/private-route";
import LayoutMain from "./pages/layout-main";
import PageComponents from "./pages/page-components";
import PageCreateCategory from "./pages/page-create-category";
import PageCreateEvent from "./pages/page-create-event";
import PageCreateUser from "./pages/page-create-user";
import PageEditEvent from "./pages/page-edit-event";
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

                    <Route element={<AdminRoute />}>
                        <Route path="/create-category" element={<PageCreateCategory />}/>
                        <Route path="/create-user" element={<PageCreateUser />} />
                    </Route>

                    <Route element={<OrganizerRoute />}>
                        <Route path="/create-event" element={<PageCreateEvent />}/>
                        <Route path="/event/edit/:id" element={<PageEditEvent />}/>
                    </Route>

                </Route>
            </Route>
        </Routes>
    );
}
