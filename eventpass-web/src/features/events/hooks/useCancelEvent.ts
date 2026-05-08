import { api } from "../../../helpers/api";

export function useCancelEvent(id: string) {
    async function cancelEvent() {
        await api.patch(`/events/${id}/cancel`);
    }

    return cancelEvent;
}
