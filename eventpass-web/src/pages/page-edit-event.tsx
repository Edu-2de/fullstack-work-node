import { useState } from "react";
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

    const { updateEvent } = useUpdateEvent(id || "");
    const cancelEvent = useCancelEvent(id || "");

    // Estados locais para controlar o carregamento e erros dos botões
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleUpdate = async (
        data: CreateEventFormData,
        bannerFile: File | null,
    ) => {
        try {
            setIsProcessing(true);
            setActionError(null);
            await updateEvent(data, bannerFile);

            alert("Evento atualizado com sucesso!");
            navigate(`/event/${id}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setActionError(
                err.response?.data?.message || "Erro ao atualizar evento",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (
            !window.confirm(
                "Deseja realmente cancelar este evento? Esta ação é irreversível.",
            )
        ) {
            return;
        }

        try {
            setIsProcessing(true);
            setActionError(null);
            await cancelEvent();

            alert("Evento cancelado com sucesso!");
            navigate("/my-events");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setActionError(
                err.response?.data?.message || "Erro ao cancelar evento",
            );
        } finally {
            setIsProcessing(false);
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
                    isLoading={isProcessing}
                    error={actionError}
                />
            </div>
        </MainContent>
    );
}
