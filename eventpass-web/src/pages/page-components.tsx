import React from "react";
import FilmIcon from "../assets/icons/FilmSlate-Regular.svg?react";
import PlusIcon from "../assets/icons/Plus-Regular.svg?react";
import Button from "../components/button";
import EventCard from "../components/eventCard";
import IconButton from "../components/icon-button";
import InputText from "../components/input-text";
import InputTextArea from "../components/input-text-area";
import Link from "../components/link";
import MenuItem from "../components/menu-item";
import Rating from "../components/rating";
import Skeleton from "../components/skeleton";
import StarButton from "../components/starButton";
import Text from "../components/text";
import type { Event } from "../features/events/models/event.types";
import type { Category } from "../features/categories/models/category.types";

function PageComponents() {
    const [pesquisa, setPesquisa] = React.useState("");
    const [notaEvento, setNotaEvento] = React.useState(0);
    const [favorito, setFavorito] = React.useState(false);

    // Corrigindo a tipagem das categorias conforme seu modelo
    const mockCategories: Category[] = [
        { id: "1", name: "Tecnologia" },
        { id: "2", name: "Design" },
    ];

    // Corrigindo o objeto de evento com os campos obrigatórios da sua interface
    const eventTest: Event = {
        id: "test-id",
        title: "Conferência Tech 2026",
        description:
            "O maior evento de tecnologia do RS focado em tendências de IA e desenvolvimento.",
        start_date: "2026-12-01T10:00:00.000Z",
        location: "Fiergs, Porto Alegre",
        total_capacity: 500,
        available_capacity: 350,
        price: 180.0,
        banner_url: null, // Usará o NoImage definido no componente
        status: "published",
        organizer: { id: "org-1", name: "Carlos" },
        categories: mockCategories,
    };

    return (
        <div className="flex flex-col gap-12 p-8 pb-20">
            {/* --- SEÇÃO DE TIPOGRAFIA --- */}
            <section className="flex flex-col gap-4">
                <Text
                    variant="title-lg"
                    className="text-purple-light border-b border-gray-300 pb-2"
                >
                    Typography
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Text
                            variant="display-xl"
                            weight="bold"
                            className="text-white"
                        >
                            Display XL
                        </Text>
                        <Text variant="display-lg" className="text-white">
                            Display Large
                        </Text>
                        <Text variant="title-hg" className="text-white">
                            Title Huge
                        </Text>
                        <Text variant="title-xl" className="text-white">
                            Title XL
                        </Text>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Text variant="text-md" className="text-gray-500">
                            Text Medium (Body)
                        </Text>
                        <Text variant="text-sm" className="text-gray-400">
                            Text Small
                        </Text>
                        <Text variant="text-xs" className="text-gray-600">
                            Text Extra Small
                        </Text>
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO DE BOTÕES E INTERAÇÕES --- */}
            <section className="flex flex-col gap-4">
                <Text
                    variant="title-lg"
                    className="text-purple-light border-b border-gray-300 pb-2"
                >
                    Buttons & Interactivity
                </Text>
                <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex flex-col gap-3">
                        <Text
                            variant="text-xs"
                            className="text-gray-500 uppercase font-bold"
                        >
                            Variants
                        </Text>
                        <div className="flex gap-4">
                            <Button size="md">Solid Button</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Text
                            variant="text-xs"
                            className="text-gray-500 uppercase font-bold"
                        >
                            States
                        </Text>
                        <div className="flex gap-4">
                            <Button isLoading>Loading</Button>
                            <Button icon={PlusIcon}>With Icon</Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Text
                            variant="text-xs"
                            className="text-gray-500 uppercase font-bold"
                        >
                            Controls
                        </Text>
                        <div className="flex gap-4 items-center">
                            <IconButton icon={FilmIcon} />
                            <StarButton
                                isFavorite={favorito}
                                onChange={setFavorito}
                            />
                            <Rating
                                value={notaEvento}
                                onChange={setNotaEvento}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO DE FORMULÁRIOS --- */}
            <section className="flex flex-col gap-4">
                <Text
                    variant="title-lg"
                    className="text-purple-light border-b border-gray-300 pb-2"
                >
                    Forms
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    <div className="flex flex-col gap-4">
                        <InputText
                            placeholder="Nome do evento..."
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                            onClear={() => setPesquisa("")}
                        />
                        <InputText
                            placeholder="Campo com erro"
                            error="Este campo é obrigatório"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <InputTextArea placeholder="Descrição detalhada..." />
                        <InputTextArea
                            placeholder="Área com erro"
                            error="Limite de caracteres excedido"
                        />
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO DE NAVIGATION --- */}
            <section className="flex flex-col gap-4">
                <Text
                    variant="title-lg"
                    className="text-purple-light border-b border-gray-300 pb-2"
                >
                    Navigation
                </Text>
                <div className="flex gap-8 items-start">
                    <ul className="flex bg-gray-200 p-1.5 rounded-xl gap-2">
                        <MenuItem to="/components" icon={FilmIcon}>
                            Menu Ativo
                        </MenuItem>
                        <MenuItem to="/outra-rota" icon={FilmIcon}>
                            Inativo
                        </MenuItem>
                    </ul>
                    <Link to="/" icon={PlusIcon}>
                        Link Voltar
                    </Link>
                </div>
            </section>

            {/* --- SEÇÃO DE CARDS E SKELETONS --- */}
            <section className="flex flex-col gap-4">
                <Text
                    variant="title-lg"
                    className="text-purple-light border-b border-gray-300 pb-2"
                >
                    Feedback & Display
                </Text>
                <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                    <div className="flex flex-col gap-2 items-center">
                        <Text
                            variant="text-xs"
                            className="text-gray-500 uppercase"
                        >
                            Default Card
                        </Text>
                        <EventCard event={eventTest} />
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <Text
                            variant="text-xs"
                            className="text-gray-500 uppercase"
                        >
                            Card Loading
                        </Text>
                        <EventCard isLoading event={eventTest} />
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <Text
                            variant="text-xs"
                            className="text-gray-500 uppercase"
                        >
                            Custom Skeletons
                        </Text>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-48 h-6" rounded="lg" />
                            <Skeleton className="w-32 h-6" rounded="full" />
                            <div className="flex gap-2">
                                <Skeleton
                                    className="w-10 h-10"
                                    rounded="full"
                                />
                                <Skeleton className="w-40 h-10" rounded="sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PageComponents;
