import { Route, Routes } from "react-router-dom"; // Arrume o import aqui
import LayoutMain from "./pages/layout-main";
import PageComponents from "./pages/page-components";
import PageHome from "./pages/page-home";

export default function App() {
    return (
        <Routes>
            <Route element={<LayoutMain />}>
                <Route index element={<PageHome />} />
                <Route path="/componentes" element={<PageComponents />} />
            </Route>
        </Routes>
    );
}
