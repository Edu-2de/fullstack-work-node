import React from "react";
import SearchIcon from "../assets/icons/MagnifyingGlass-Regular.svg?react";
import InputText from "../components/input-text";
import Text from "../components/text";
import EventGrid from "../features/events/components/EventGrid";
import { useEvents } from "../features/events/hooks/useEvents";
import { useDebounce } from "../hooks/useDebounce";

export default function PageHome() {
    const [searchItem, setSearchItem] = React.useState("");
    const debouncedSearchItem = useDebounce(searchItem, 500);

    const { events, isLoading, hasMore, loadMore } =
        useEvents(debouncedSearchItem);

    const eventosAtivos = events.filter(
        (event) =>
            event.status !== "cancelled" &&
            new Date(event.start_date).getTime() >= new Date().getTime(),
    );

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <Text
                    as="h1"
                    variant="title-hg"
                    className="text-white font-bold"
                >
                    Explorar
                </Text>
                <div className="w-full sm:w-80">
                    <InputText
                        icon={SearchIcon}
                        placeholder="Pesquisar evento"
                        value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}
                        onClear={() => setSearchItem("")}
                    />
                </div>
            </div>

            <EventGrid
                events={eventosAtivos}
                isLoading={isLoading}
                hasMore={hasMore}
                loadMore={loadMore}
            />
        </div>
    );
}
