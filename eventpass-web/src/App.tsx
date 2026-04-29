import React from "react";
import FilmIcon from "./assets/icons/FilmSlate-Regular.svg?react";
import Button from "./components/button";
import IconButton from "./components/icon-button";
import InputText from "./components/input-text";
import InputTextArea from "./components/input-text-area";
import Link from "./components/link";
import MenuItem from "./components/menu-item";
import Rating from "./components/rating";
import StarButton from "./components/starButton";
import Text from "./components/text";

function App() {
    const [pesquisa, setPesquisa] = React.useState("");
    const [notaEvento, setNotaEvento] = React.useState(0);
    const [favorito, setFavorito] = React.useState(false);
    return (
        <div className="flex items-center ju-c flex-col gap-5 mb-3">
            <div className="w-full flex flex-col items-center gap-2  mt-5">
                <Text as="h2" variant="display-xl" weight="bold">
                    Display Xl
                </Text>
                <Text as="h1" variant="title-hg" weight="bold">
                    Title Hg
                </Text>
                <Text as="p" variant="input-text" weight="bold">
                    Input
                </Text>
            </div>
            <div className="w-80 flex flex-col items-center gap-2  mt-5">
                <MenuItem to="/a" icon={FilmIcon}>
                    Item
                </MenuItem>
                <MenuItem to="/" icon={FilmIcon}>
                    Item
                </MenuItem>
            </div>
            <div className="w-full flex flex-col items-center gap-2  mt-5">
                <Button icon={FilmIcon} size="md">
                    Item
                </Button>
                <Button icon={FilmIcon} isLoading size="md">
                    Item
                </Button>
            </div>
            <div className="w-full flex flex-col items-center gap-2  mt-5">
                <IconButton icon={FilmIcon} />
            </div>
            <div className="w-full flex flex-col items-center gap-2  mt-5">
                <Link to={"/"} icon={FilmIcon}>
                    Item
                </Link>
            </div>
            <div className="w-80 flex flex-col items-center gap-4  mt-5">
                <InputText
                    placeholder="Pesquisar eventos..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    onClear={() => setPesquisa("")}
                    error={pesquisa === "erro" ? "Termo inválido" : undefined}
                />
                <InputText
                    placeholder="Pesquisar eventos..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    onClear={() => setPesquisa("")}
                    error={"error"}
                />
            </div>
            <div className="w-80 flex flex-col items-center gap-4  mt-5">
                <InputTextArea placeholder="Pesquisar" />
                <InputTextArea placeholder="Pesquisar" error={"error"} />
            </div>
            <div className="w-80 flex flex-col items-center gap-4  mt-5">
                <Rating value={notaEvento} onChange={setNotaEvento} />
            </div>
            <div className="w-80 flex flex-col items-center gap-4  mt-5">
                <StarButton isFavorite={favorito} onChange={setFavorito} />
            </div>
        </div>
    );
}

export default App;
