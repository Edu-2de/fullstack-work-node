import { Outlet } from "react-router";

import Header from "../components/header";
import MainContent from "../components/main-content";

export default function LayoutMain() {
    return (
        <>
            <div className="flex flex-col min-h-screen ">
                <Header />
                <MainContent>
                    <Outlet />
                </MainContent>
            </div>
        </>
    );
}
