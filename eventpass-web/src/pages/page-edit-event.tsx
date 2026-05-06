import { useParams } from "react-router-dom";
import EventForm from "../features/events/components/EventForm";
import { useEvent } from "../features/events/hooks/useEvent";

export default function PageEditEvent() {
    const { id } = useParams();

    const { event, isLoading } = useEvent(id || "");

    return (
        <div className="w-full flex flex-col gap-8">
            {event && !isLoading && <EventForm event={event} />}
        </div>
    );
}
