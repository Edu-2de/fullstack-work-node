import React, { useEffect } from "react";
import FilmIcon from "../../../assets/icons/FilmSlate-Regular.svg?react";
import EventCard from "../../../components/eventCard";
import Icon from "../../../components/icon";
import Text from "../../../components/text";
import type { Event } from "../models/event.types";
import { Link } from "react-router-dom";

interface EventOrganizerGridProps {
    events: Event[];
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => void;
}

export default function EventOrganizerGrid({
    events,
    isLoading,
    hasMore,
    loadMore,
}: EventOrganizerGridProps) {
    const observerTarget = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 1.0 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isLoading, loadMore]);

    if (isLoading && events.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
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

    if (!isLoading && events.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center gap-6 py-12">
                <Icon className="w-11 h-11 fill-gray-400" svg={FilmIcon} />
                <Text>Nenhum evento registrado.</Text>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {events.map((e) => (
                    <Link to={`/event/${e.id}`}>
                        <EventCard key={e.id} event={e} />
                    </Link>
                ))}
                {isLoading &&
                    events.length > 0 &&
                    Array.from({ length: 4 }).map((_, index) => (
                        <EventCard
                            key={`events-loading-more-${index}`}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            event={{} as any}
                            isLoading={true}
                        />
                    ))}
            </div>

            <div ref={observerTarget} className="h-4 w-full" />
        </div>
    );
}
