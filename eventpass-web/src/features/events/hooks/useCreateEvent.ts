import { api } from "../../../helpers/api";
import type { CreateEventFormData } from "../schema";

export function useCreateEvent() {
    async function createEvent(
        data: CreateEventFormData,
        bannerFile: File | null,
    ) {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("start_date", data.start_date);
        formData.append("location", data.location);
        formData.append("total_capacity", String(data.total_capacity));
        formData.append("price", String(data.price));

        if (data.categories && data.categories.length > 0) {
            data.categories.forEach((categoryId) => {
                formData.append("categories[]", categoryId);
            });
        }

        if (bannerFile) {
            formData.append("banner", bannerFile);
        }
        await api.post("/events", formData);
    }

    return { createEvent };
}
