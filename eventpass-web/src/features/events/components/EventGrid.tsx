import EventCard from "../../../components/eventCard";
import type { Event } from "../models/event.types";

interface EventGridProps {
    events: Event[];
    isLoading: boolean;
}

export default function EventGrid({ events, isLoading }: EventGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {!isLoading
                ? events.map((e) => <EventCard key={e.id} event={e} />)
                : Array.from({ length: 8 }).map((_, index) => (
                      <EventCard
                          key={`events-loading-${index}`}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          event={{} as any}
                          isLoading={true}
                      />
                  ))}
        </div>
    );
}
