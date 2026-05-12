import Text from "../../../components/text";
import type { Event } from "../models/event.types";
import EventActionFooter from "./eventDetailComponents/EventActionFooter";
import EventBanner from "./eventDetailComponents/EventBanner";
import EventInfoGrid from "./eventDetailComponents/EventInfoGrid";

interface EventDetailProps {
    event: Event;
    ticketStatus: string;
    isCustomer: boolean;
    isOwner?: boolean;
    onBack: () => void;
    onBuy?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onCancelTicket?: () => void;
    hasTicket?: boolean;
    isBuyLoading?: boolean;
    isDeleteLoading?: boolean;
}

export default function EventDetail({
    event,
    ticketStatus,
    isCustomer,
    isOwner,
    onBack,
    onBuy,
    onEdit,
    onDelete,
    onCancelTicket,
    hasTicket,
    isBuyLoading,
    isDeleteLoading,
}: EventDetailProps) {
    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
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
    const isCancelled =
        event.status === "cancelled" || ticketStatus === "cancelled";
    const isSoldOut = event.available_capacity <= 0;

    return (
        <div className="relative w-full min-h-[calc(100vh-120px)] mt-4">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 z-10 relative">
                <EventBanner
                    isCancelled={isCancelled}
                    isPastEvent={isPastEvent}
                    bannerUrl={bannerUrl}
                    title={event.title}
                />

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

                    <EventInfoGrid
                        availableCapacity={event.available_capacity}
                        date={formattedDate}
                        isSoldOut={isSoldOut}
                        location={event.location}
                        organizer={event.organizer.name}
                        time={formattedTime}
                        totalCapacity={event.total_capacity}
                    />

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

                    <EventActionFooter
                        priceValue={Number(event.price)}
                        formattedPrice={formattedPrice}
                        isOwner={isOwner}
                        isCustomer={isCustomer}
                        isCancelled={isCancelled}
                        isPastEvent={isPastEvent}
                        isSoldOut={isSoldOut}
                        hasTicket={hasTicket}
                        isBuyLoading={isBuyLoading}
                        isDeleteLoading={isDeleteLoading}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onCancelTicket={onCancelTicket}
                        onBuy={onBuy}
                    />
                </div>
            </div>
        </div>
    );
}
