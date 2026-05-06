import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import Skeleton from "../components/skeleton";
import Text from "../components/text";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEvent } from "../features/events/hooks/useEvent";

export default function PageEventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { event, isLoading } = useEvent(id || "");
    const apiUrl = import.meta.env.VITE_API_URL;

    if (isLoading) {
        return (
            <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-16 mt-8 animate-pulse">
                <Skeleton className="w-full lg:w-[450px] h-[650px] rounded-3xl shrink-0" />

                <div className="flex-1 flex flex-col pt-4">
                    <Skeleton className="w-24 h-6 mb-8 rounded" />
                    <Skeleton className="w-full max-w-2xl h-14 mb-4 rounded-lg" />
                    <Skeleton className="w-48 h-6 mb-12 rounded" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                        <Skeleton className="w-full h-16 rounded-xl" />
                        <Skeleton className="w-full h-16 rounded-xl" />
                        <Skeleton className="w-full h-16 rounded-xl" />
                    </div>

                    <div className="flex flex-col gap-3 mb-12">
                        <Skeleton className="w-full h-4 rounded" />
                        <Skeleton className="w-full h-4 rounded" />
                        <Skeleton className="w-3/4 h-4 rounded" />
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/10 flex justify-between items-center">
                        <Skeleton className="w-32 h-10 rounded-lg" />
                        <Skeleton className="w-48 h-14 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center h-64">
                <Text variant="display-md" className="text-gray-500">
                    Evento não encontrado
                </Text>
            </div>
        );
    }

    const bannerUrl = event.banner_url
        ? `${apiUrl}/files/${event.banner_url}`
        : "";

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "full",
        timeStyle: "short",
    }).format(new Date(event.start_date));

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(event.price));

    const categoriesText =
        event.categories?.map((c) => c.name).join(", ") || "Sem categoria";

    // Lógicas de Negócio para a Compra
    const isCustomer = user?.role === "customer";
    const isPastEvent =
        new Date(event.start_date).getTime() < new Date().getTime();
    const isSoldOut = event.available_capacity <= 0;

    return (
        <div className="relative w-full min-h-[calc(100vh-120px)] mt-4">
            {bannerUrl && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl">
                    <img
                        src={bannerUrl}
                        alt="Background Blur"
                        className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
                    />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 z-10 relative">
                <div className="w-full lg:w-[450px] shrink-0">
                    {bannerUrl ? (
                        <img
                            src={bannerUrl}
                            alt={event.title}
                            className="w-full h-auto object-cover rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5"
                        />
                    ) : (
                        <div className="w-full h-[650px] bg-gray-300 rounded-3xl flex items-center justify-center border border-white/5">
                            <Text className="text-gray-500">Sem imagem</Text>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col pt-2 lg:pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors w-fit mb-6 cursor-pointer"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19 12H5M5 12L12 19M5 12L12 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <Text variant="text-md" color="inherit">
                            Voltar
                        </Text>
                    </button>

                    <Text
                        as="h1"
                        variant="display-xl"
                        className="text-white mb-2 leading-tight"
                    >
                        {event.title}
                    </Text>

                    <Text
                        variant="text-md"
                        className="text-purple-light font-bold mb-10 uppercase tracking-widest"
                    >
                        {categoriesText}
                    </Text>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <div className="bg-gray-200/50 p-5 rounded-2xl border border-white/5">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 block mb-1"
                            >
                                Data e Hora
                            </Text>
                            <Text
                                variant="text-md"
                                className="text-white font-bold capitalize"
                            >
                                {formattedDate}
                            </Text>
                        </div>
                        <div className="bg-gray-200/50 p-5 rounded-2xl border border-white/5">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 block mb-1"
                            >
                                Localização
                            </Text>
                            <Text
                                variant="text-md"
                                className="text-white font-bold"
                            >
                                {event.location}
                            </Text>
                        </div>
                        <div className="bg-gray-200/50 p-5 rounded-2xl border border-white/5">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 block mb-1"
                            >
                                Organizador
                            </Text>
                            <Text
                                variant="text-md"
                                className="text-white font-bold"
                            >
                                {event.organizer?.name || "Desconhecido"}
                            </Text>
                        </div>
                        <div className="bg-gray-200/50 p-5 rounded-2xl border border-white/5">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 block mb-1"
                            >
                                Disponibilidade
                            </Text>
                            <Text
                                variant="text-md"
                                className="text-white font-bold"
                            >
                                <span
                                    className={
                                        isSoldOut
                                            ? "text-error-light"
                                            : "text-green-400"
                                    }
                                >
                                    {event.available_capacity}
                                </span>{" "}
                                / {event.total_capacity} ingressos
                            </Text>
                        </div>
                    </div>

                    <div className="mb-12">
                        <Text
                            as="h2"
                            variant="title-lg"
                            className="text-white mb-4"
                        >
                            Sobre o evento
                        </Text>
                        <Text
                            as="p"
                            variant="text-md"
                            className="text-gray-400 leading-relaxed text-justify"
                        >
                            {event.description}
                        </Text>
                    </div>

                    {/* ÁREA DE CHECKOUT (Fixa na parte inferior do container) */}
                    <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <Text
                                variant="text-sm"
                                className="text-gray-500 block mb-1"
                            >
                                Valor do ingresso
                            </Text>
                            <Text
                                variant="display-md"
                                className="text-white font-bold"
                            >
                                {Number(event.price) === 0
                                    ? "Gratuito"
                                    : formattedPrice}
                            </Text>
                        </div>

                        {/* RENDERIZAÇÃO CONDICIONAL DO BOTÃO */}
                        {isCustomer && (
                            <div className="w-full sm:w-auto">
                                {isPastEvent ? (
                                    <Button
                                        disabled
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto cursor-not-allowed border-gray-500 text-gray-500"
                                    >
                                        Evento Encerrado
                                    </Button>
                                ) : isSoldOut ? (
                                    <Button
                                        disabled
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto cursor-not-allowed border-error-base text-error-light"
                                    >
                                        Ingressos Esgotados
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto h-14 px-12 text-lg"
                                    >
                                        Comprar Ingresso
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
