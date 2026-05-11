import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import type { EventFormData } from "../models/event.types";

interface CreateEventPayload {
    data: EventFormData;
    bannerFile: File | null;
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ data, bannerFile }: CreateEventPayload) => {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("start_date", data.start_date);
            formData.append("location", data.location);
            formData.append("total_capacity", String(data.total_capacity));
            formData.append("price", String(data.price));

            if (data.categories && data.categories.length > 0) {
                data.categories.forEach((categoryName) => {
                    formData.append("categories", categoryName);
                });
            }

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }
            const response = await api.post("/events", formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });

    return {
        createEvent: mutation.mutateAsync,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
}
