import { useNavigate, useParams } from "react-router-dom";
import Text from "../components/text";
import { useAuth } from "../features/auth/hooks/useAuth";
import EventDetail from "../features/events/components/EventDetail";
import EventDetailSkeleton from "../features/events/components/EventDetailSkeleton";
import { useDeleteEvent } from "../features/events/hooks/useDeleteEvent";
import { useEvent } from "../features/events/hooks/useEvent";
import { useMyEvents } from "../features/events/hooks/useMyEvents";
import { useCancelTicket } from "../features/tickets/hooks/useCancelTicket";
import { useCreateTicket } from "../features/tickets/hooks/useCreateTicket";

export default function PageEventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { event, isLoading: isFetchingEvent } = useEvent(id || "");

    const { createTicket, isBuying: isBuyingTicket } = useCreateTicket();
    const { deleteEvent, isDeleting: isDeletingEvent } = useDeleteEvent();
    const { cancelTicket, cancelError } = useCancelTicket();

    const isCustomer = user?.role === "customer";
    const isOwnerEvent =
        user?.role === "organizer" && event?.organizer?.id === user?.id;

    const { events } = useMyEvents();
    const eventWithTicket = events.find((e) => e.id === id);
    const hasTicket = !!eventWithTicket;
    const ticketId = eventWithTicket?.ticketId;

    async function handleBuyTicket() {
        try {
            await createTicket(id || "");
            alert("Ticket comprado com sucesso!");
            navigate("/my-events");
        } catch (err: unknown) {
            console.error("Erro ao comprar", err);
        }
    }

    function handleEdit() {
        navigate(`/event/edit/${id}`);
    }

    async function handleDelete() {
        if (
            !window.confirm(
                "Deseja realmente deletar esse evento? Esta ação é irreversível.",
            )
        ) {
            return;
        }

        try {
            await deleteEvent(id || "");
            alert("Evento deletado com sucesso!");
            navigate("/my-events");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Erro ao cancelar evento");
        }
    }

    const handleCancelTicket = async () => {
        if (
            !window.confirm(
                "Deseja realmente cancelar esse ticket? Esta ação é irreversível.",
            )
        ) {
            return;
        }

        try {
            await cancelTicket(ticketId || "");
            alert("Ticket deletado com sucesso!");
            navigate("/my-events");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            alert(cancelError || "Erro ao cancelar evento");
        }
    };

    if (isFetchingEvent) {
        return <EventDetailSkeleton />;
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

    return (
        <EventDetail
            event={event}
            isCustomer={isCustomer}
            isOwner={isOwnerEvent}
            hasTicket={hasTicket}
            onBack={() => navigate(-1)}
            onBuy={handleBuyTicket}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCancelTicket={handleCancelTicket}
            isBuyLoading={isBuyingTicket}
            isDeleteLoading={isDeletingEvent}
        />
    );
}
