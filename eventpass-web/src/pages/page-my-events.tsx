import React from "react";
import SearchIcon from "../assets/icons/MagnifyingGlass-Regular.svg?react";
import InputText from "../components/input-text";
import Text from "../components/text";
import { useAuth } from "../features/auth/hooks/useAuth";
import EventGrid from "../features/events/components/EventGrid";
import { useMyEvents } from "../features/events/hooks/useMyEvents";
import { useDebounce } from "../hooks/useDebounce";

export default function PageMyEvents() {
    const { user } = useAuth();
    const isOrganizer = user?.role === "organizer";

    const [searchItem, setSearchItem] = React.useState("");
    const debouncedSearchItem = useDebounce(searchItem, 500);

    const { events, isLoading, isFetchingNextPage, hasMore, loadMore } =
        useMyEvents(debouncedSearchItem);

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <Text
                    as="h1"
                    variant="title-hg"
                    className="text-white font-bold"
                >
                    Meus Eventos
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
                events={events}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasMore={hasMore}
                loadMore={loadMore}
                emptyMessage={
                    isOrganizer
                        ? "Você ainda não criou nenhum evento."
                        : "Você ainda não adquiriu nenhum ingresso."
                }
            />
        </div>
    );
}
