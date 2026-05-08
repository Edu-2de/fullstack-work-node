import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "../components/text";
import { useAuth } from "../features/auth/hooks/useAuth";
import EventDetail from "../features/events/components/EventDetail";
import EventDetailSkeleton from "../features/events/components/EventDetailSkeleton";
import { useDeleteEvent } from "../features/events/hooks/useDeleteEvent";
import { useEvent } from "../features/events/hooks/useEvent";

export default function PageEventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isProcessing, setIsProcessing] = React.useState(false);

    const { event, isLoading } = useEvent(id || "");

    const deleteEvent = useDeleteEvent(id || "");

    const isCustomer = user?.role === "customer";
    const isOwnerEvent =
        user?.role === "organizer" && event?.organizer?.id === user?.id;

    function handleBuyTicket() {
        console.log("Comprando ingresso para o evento:", id);
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
            setIsProcessing(true);
            await deleteEvent();

            alert("Evento deletado com sucesso!");
            navigate("/my-events");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Erro ao cancelar evento");
        } finally {
            setIsProcessing(false);
        }
    }

    if (isLoading) {
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
            isLoading={isProcessing}
            onBack={() => navigate(-1)}
            onBuy={handleBuyTicket}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
