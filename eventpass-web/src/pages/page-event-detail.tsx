import { useNavigate, useParams } from "react-router-dom";
import Text from "../components/text";
import { useAuth } from "../features/auth/hooks/useAuth";
import EventDetail from "../features/events/components/EventDetail";
import EventDetailSkeleton from "../features/events/components/EventDetailSkeleton";
import { useEvent } from "../features/events/hooks/useEvent";

export default function PageEventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { event, isLoading } = useEvent(id || "");

    const isCustomer = user?.role === "customer";

    function handleBuyTicket() {
        console.log("Comprando ingresso para o evento:", id);
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
            onBack={() => navigate(-1)}
            onBuy={handleBuyTicket}
        />
    );
}
