import { useNavigate } from "react-router-dom";
import MainContent from "../components/main-content";
import Text from "../components/text";
import { useCategories } from "../features/categories/hooks/useCategories";
import EventForm from "../features/events/components/EventForm";
import { useCreateEvent } from "../features/events/hooks/useCreateEvent";
import type { EventFormData } from "../features/events/models/event.types";

export default function PageCreateEvent() {
    const navigate = useNavigate();
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { createEvent, isCreating, createError } = useCreateEvent();

    const handleSubmit = async (
        data: EventFormData,
        bannerFile: File | null,
    ) => {
        await createEvent({ data, bannerFile });
        alert("Evento criado com sucesso!");
        navigate("/");
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
                    isSubmitLoading={isCreating}
                    submitError={createError}
                />
            </div>
        </MainContent>
    );
}
