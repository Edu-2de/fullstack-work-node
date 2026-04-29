import { Outlet } from "react-router";

import MainContent from "../components/main-content";

export default function LayoutMain() {
    return (
        <>
            <MainContent>
                <Outlet />
            </MainContent>
        </>
    );
}
