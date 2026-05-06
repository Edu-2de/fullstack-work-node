import Button from "../../../components/button";
import Text from "../../../components/text";
import type { Event } from "../models/event.types";

interface EventDetailProps {
    event: Event;
    isCustomer: boolean;
    isOwner?: boolean;
    onBack: () => void;
    onBuy?: () => void;
    onEdit?: () => void;
}

export default function EventDetail({
    event,
    isCustomer,
    isOwner,
    onBack,
    onBuy,
    onEdit,
}: EventDetailProps) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const bannerUrl = event.banner_url
        ? `${apiUrl}/files/${event.banner_url}`
        : "";

    const eventDateObj = new Date(event.start_date);

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(eventDateObj);

    const formattedTime =
        new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(eventDateObj) + "h";

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(event.price));

    const isPastEvent = eventDateObj.getTime() < new Date().getTime();
    const isSoldOut = event.available_capacity <= 0;

    return (
        <div className="relative w-full min-h-[calc(100vh-120px)] mt-4">
            {bannerUrl && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl">
                    <img
                        src={bannerUrl}
                        alt=""
                        className="w-full h-full object-cover opacity-10 blur-3xl scale-110"
                    />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 z-10 relative">
                <div className="w-full lg:w-112.5 shrink-0">
                    {bannerUrl ? (
                        <img
                            src={bannerUrl}
                            alt={event.title}
                            className="w-full h-auto object-cover rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5"
                        />
                    ) : (
                        <div className="w-full h-162.5 bg-gray-300 rounded-3xl flex items-center justify-center border border-white/5">
                            <Text className="text-gray-500">Sem imagem</Text>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col pt-2 lg:pt-4">
                    <button
                        onClick={onBack}
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
                        className="text-white mb-4 leading-tight"
                    >
                        {event.title}
                    </Text>

                    <div className="flex flex-wrap gap-2 mb-10">
                        {event.categories?.map((category) => (
                            <span
                                key={category.id}
                                className="px-3 py-1 bg-purple-base/10 border border-purple-base/30 text-purple-light rounded-full text-sm font-bold uppercase tracking-wider"
                            >
                                {category.name}
                            </span>
                        ))}
                        {(!event.categories ||
                            event.categories.length === 0) && (
                            <span className="text-gray-500 text-sm px-3 py-1 border border-gray-500 rounded-full">
                                Sem categoria
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 mb-12">
                        <div className="flex flex-col gap-1">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 uppercase tracking-widest font-bold"
                            >
                                Data
                            </Text>
                            <Text
                                variant="text-md"
                                className="text-white capitalize"
                            >
                                {formattedDate}
                            </Text>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 uppercase tracking-widest font-bold"
                            >
                                Horário
                            </Text>
                            <Text variant="text-md" className="text-white">
                                {formattedTime}
                            </Text>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 uppercase tracking-widest font-bold"
                            >
                                Localização
                            </Text>
                            <Text variant="text-md" className="text-white">
                                {event.location}
                            </Text>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 uppercase tracking-widest font-bold"
                            >
                                Organizador
                            </Text>
                            <Text variant="text-md" className="text-white">
                                {event.organizer?.name || "Desconhecido"}
                            </Text>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Text
                                variant="text-sm"
                                className="text-gray-500 uppercase tracking-widest font-bold"
                            >
                                Disponibilidade
                            </Text>
                            <Text variant="text-md" className="text-white">
                                <span
                                    className={
                                        isSoldOut
                                            ? "text-error-light font-bold"
                                            : "text-green-400 font-bold"
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

                    <div className="mt-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <Text
                                variant="text-sm"
                                className="text-gray-500 uppercase tracking-widest font-bold block mb-1"
                            >
                                Valor do ingresso
                            </Text>
                            <span className="font-body text-4xl text-white font-bold tracking-tight">
                                {Number(event.price) === 0
                                    ? "Gratuito"
                                    : formattedPrice}
                            </span>
                        </div>

                        {isOwner && (
                            <Button
                                onClick={onEdit}
                                size="lg"
                                className="w-full sm:w-auto h-14 px-12 text-lg"
                            >
                                Editar Evento
                            </Button>
                        )}

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
                                        onClick={onBuy}
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
