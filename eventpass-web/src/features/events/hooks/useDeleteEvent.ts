import { api } from "../../../helpers/api";

export function useDeleteEvent(id: string) {
    async function deleteEvent() {
        await api.delete(`/events/${id}`);
    }
    return deleteEvent;
}
