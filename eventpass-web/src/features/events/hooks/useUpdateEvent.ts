// useUpdateEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import type { UpdateEventFormData } from "../schema";

interface UpdateEventPayload {
    id: string;
    data: UpdateEventFormData;
    bannerFile: File | null;
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ id, data, bannerFile }: UpdateEventPayload) => {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "categories" && Array.isArray(value)) {
                        value.forEach((categoryName) => {
                            formData.append("categories", categoryName);
                        });
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            const response = await api.put(`/events/${id}`, formData);
            return response.data;
        },

        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["event", id] });
        },
    });

    return {
        updateEvent: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
}
