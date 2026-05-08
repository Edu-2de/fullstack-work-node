import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainContent from "../components/main-content";
import Text from "../components/text";
import { useCategories } from "../features/categories/hooks/useCategories";
import EventForm from "../features/events/components/EventForm";
import { useCreateEvent } from "../features/events/hooks/useCreateEvent";
import type { CreateEventFormData } from "../features/events/schema";

export default function PageCreateEvent() {
    const navigate = useNavigate();
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { createEvent } = useCreateEvent();

    const [isProcessing, setIsProcessing] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleSubmit = async (
        data: CreateEventFormData,
        bannerFile: File | null,
    ) => {
        try {
            setIsProcessing(true);
            setActionError(null);

            await createEvent(data, bannerFile);

            alert("Evento criado com sucesso!");
            navigate("/");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setActionError(
                err.response?.data?.message || "Erro ao criar evento",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (categoriesLoading) {
        return (
            <MainContent>
                <div className="flex flex-col items-center justify-center py-20">
                    <Text className="text-gray-400">
                        Carregando formulário...
                    </Text>
                </div>
            </MainContent>
        );
    }

    return (
        <MainContent>
            <div className="w-full flex flex-col gap-8">
                <EventForm
                    categories={categories}
                    onSubmit={handleSubmit}
                    isLoading={isProcessing}
                    error={actionError}
                />
            </div>
        </MainContent>
    );
}
