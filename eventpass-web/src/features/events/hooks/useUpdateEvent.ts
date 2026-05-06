import { api } from "../../../helpers/api";
import type { UpdateEventFormData } from "../schema";

export function useUpdateEvent(id: string) {
    async function updateEvent(
        data: UpdateEventFormData,
        bannerFile: File | null,
    ) {
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

        await api.put(`/events/${id}`, formData);
    }

    return { updateEvent };
}
