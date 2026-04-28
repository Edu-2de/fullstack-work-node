import React from "react";
import StarIcon from "./assets/icons/Star-Regular.svg?react";
import Button from "./components/button";
import IconButton from "./components/icon-button";
import InputText from "./components/input-text";
import Link from "./components/link";
import Text from "./components/text";

function App() {
    const [pesquisa, setPesquisa] = React.useState("");
    return (
        <div className="flex flex-col gap-5">
            <div className="w-full flex flex-col items-center gap-2 bg-gray-100 mt-5">
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
            <div className="w-full flex flex-col items-center gap-2 bg-gray-100 mt-5">
                <Button size="sm">Teste</Button>
                <Button isLoading size="lg">
                    Teste
                </Button>
            </div>
            <div className="w-full flex flex-col items-center gap-2 bg-gray-100 mt-5">
                <IconButton icon={StarIcon} />
            </div>
            <div className="w-full flex flex-col items-center gap-2 bg-gray-100 mt-5">
                <Link to={"/"} icon={StarIcon}>
                    Teste
                </Link>
            </div>
            <div className="w-full flex flex-col items-center gap-2 bg-gray-100 mt-5">
                <InputText
                    placeholder="Pesquisar eventos..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    onClear={() => setPesquisa("")}
                    error={pesquisa === "erro" ? "Termo inválido" : undefined}
                />
            </div>
        </div>
    );
}

export default App;
