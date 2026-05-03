import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

import FilmIcon from "../assets/icons/FilmSlate-Regular.svg?react";
import PopCornIcon from "../assets/icons/Popcorn-Regular.svg?react";
import SignOutIcon from "../assets/icons/SignOut-Regular.svg?react";
import IconButton from "./icon-button";
import Logo from "../assets/images/Logo.svg?react";
import MenuItem from "./menu-item";
import Text from "./text";
import Icon from "./icon";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="w-full flex items-center justify-between px-32 py-4 bg-gray-100 border-b border-purple-base/30">
            <div className="flex items-center gap-2">
                <Icon className="w-12 h-12" svg={Logo}></Icon>
            </div>

            <nav>
                <ul className="flex items-center gap-2 bg-gray-200 p-1.5 rounded-xl">
                    <MenuItem to="/" icon={PopCornIcon}>
                        Explorar
                    </MenuItem>
                    <MenuItem to="/meus-filmes" icon={FilmIcon}>
                        Meus filmes
                    </MenuItem>
                </ul>
            </nav>

            <div className="flex items-center gap-6">
                <Text variant="text-sm" className="text-gray-500">
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
        </header>
    );
}
