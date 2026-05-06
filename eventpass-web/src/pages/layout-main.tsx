import { Outlet } from "react-router-dom";
import Header from "../components/header";
import MainContent from "../components/main-content";

export default function LayoutMain() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <MainContent className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-36 py-8 flex flex-col ">
                <Outlet />
            </MainContent>
        </div>
    );
}
