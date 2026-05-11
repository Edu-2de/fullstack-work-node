import { useNavigate, useParams } from "react-router-dom";
import MainContent from "../components/main-content";
import Text from "../components/text";
import { useCategories } from "../features/categories/hooks/useCategories";
import EventDetailSkeleton from "../features/events/components/EventDetailSkeleton";
import EventForm from "../features/events/components/EventForm";
import { useCancelEvent } from "../features/events/hooks/useCancelEvent";
import { useEvent } from "../features/events/hooks/useEvent";
import { useUpdateEvent } from "../features/events/hooks/useUpdateEvent";
import type { CreateEventFormData } from "../features/events/schema";

export default function PageEditEvent() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { event, isLoading: eventLoading } = useEvent(id || "");
    const { categories, isLoading: categoriesLoading } = useCategories();

    const { updateEvent, isUpdating, updateError } = useUpdateEvent();
    const { cancelEvent, isCanceling, cancelError } = useCancelEvent();

    const handleUpdate = async (
        data: CreateEventFormData,
        bannerFile: File | null,
    ) => {
        try {
            await updateEvent({
                id: id || "",
                data,
                bannerFile,
            });

            alert("Evento atualizado com sucesso!");
            navigate(`/event/${id}`);
        } catch (err) {
            console.error("Erro ao atualizar", err);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Deseja realmente cancelar este evento?")) return;

        try {
            await cancelEvent(id || "");
            alert("Evento cancelado com sucesso!");
            navigate("/my-events");
        } catch (err) {
            console.error("Erro ao cancelar", err);
        }
    };

    if (eventLoading || categoriesLoading) {
        return (
            <MainContent>
                <EventDetailSkeleton />
            </MainContent>
        );
    }

    if (!event) {
        return (
            <MainContent>
                <div className="flex flex-col items-center justify-center py-20">
                    <Text className="text-error-light">
                        Erro ao carregar evento.
                    </Text>
                </div>
            </MainContent>
        );
    }

    return (
        <MainContent>
            <div className="flex flex-col gap-8">
                <EventForm
                    event={event}
                    categories={categories}
                    onSubmit={handleUpdate}
                    onCancelEvent={handleCancel}
                    isSubmitLoading={isUpdating}
                    isCancelLoading={isCanceling}
                    submitError={updateError}
                    cancelError={cancelError}
                />
            </div>
        </MainContent>
    );
}
