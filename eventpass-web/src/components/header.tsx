import React from "react";
import { useNavigate } from "react-router-dom";
import FilmIcon from "../assets/icons/FilmSlate-Regular.svg?react";
import PulsIcon from "../assets/icons/Plus-Regular.svg?react";
import PopCornIcon from "../assets/icons/Popcorn-Regular.svg?react";
import SignOutIcon from "../assets/icons/SignOut-Regular.svg?react";
import Logo from "../assets/images/Logo.svg?react";
import { useAuth } from "../features/auth/hooks/useAuth";
import Icon from "./icon";
import IconButton from "./icon-button";
import MenuItem from "./menu-item";
import Text from "./text";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const canCreateEvent = user?.role === "admin" || user?.role === "organizer";

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="w-full bg-gray-100 border-b border-purple-base/30 fixed z-50">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon
                        className="w-10 h-10 sm:w-12 sm:h-12"
                        svg={Logo}
                    ></Icon>
                </div>

                <nav className="hidden sm:block">
                    <ul className="flex items-center gap-1 sm:gap-2 bg-gray-200 p-1.5 rounded-xl">
                        <MenuItem to="/" icon={PopCornIcon}>
                            Explorar
                        </MenuItem>
                        <MenuItem to="/my-events" icon={FilmIcon}>
                            Meus Eventos
                        </MenuItem>
                        {canCreateEvent && (
                            <MenuItem to="/create-event" icon={PulsIcon}>
                                Novo Evento
                            </MenuItem>
                        )}
                    </ul>
                </nav>

                <button
                    className="sm:hidden text-white"
                    onClick={() => setIsMenuOpen(true)}
                >
                    Menu
                </button>

                <div className="hidden sm:flex items-center gap-4 sm:gap-6">
                    <Text
                        variant="text-sm"
                        className="hidden md:block text-gray-500"
                    >
                        Olá,{" "}
                        <span className="text-white font-bold">
                            {user?.name || "Visitante"}
                        </span>
                    </Text>

                    <IconButton
                        icon={SignOutIcon}
                        onClick={handleLogout}
                        aria-label="Sair"
                    />
                </div>
            </div>

            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 sm:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-64 bg-gray-200 z-50 transform transition-transform duration-300 sm:hidden flex flex-col p-6 shadow-2xl ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-end mb-8">
                    <button
                        className="text-white text-sm"
                        onClick={() => {
                            setIsMenuOpen(false);
                        }}
                    >
                        Fechar
                    </button>
                </div>

                <nav className="flex flex-col gap-4">
                    <MenuItem
                        to="/"
                        icon={PopCornIcon}
                        onClick={() => {
                            setIsMenuOpen(false);
                        }}
                    >
                        Explorar
                    </MenuItem>
                    <MenuItem
                        to="/my-events"
                        icon={FilmIcon}
                        onClick={() => {
                            setIsMenuOpen(false);
                        }}
                    >
                        Meus Eventos
                    </MenuItem>
                    {canCreateEvent && (
                        <MenuItem to="/create-event" icon={PulsIcon}>
                            Novo Evento
                        </MenuItem>
                    )}
                </nav>

                <div className="mt-auto border-t border-white/10 pt-4 flex items-center justify-between gap-4">
                    <Text variant="text-sm" className=" text-gray-500">
                        Olá,{" "}
                        <span className="text-white font-bold">
                            {user?.name || "Visitante"}
                        </span>
                    </Text>

                    <IconButton
                        icon={SignOutIcon}
                        onClick={handleLogout}
                        aria-label="Sair"
                    />
                </div>
            </div>
        </header>
    );
}
