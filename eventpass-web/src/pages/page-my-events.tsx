import React from "react";
import SearchIcon from "../assets/icons/MagnifyingGlass-Regular.svg?react";
import InputText from "../components/input-text";
import Text from "../components/text";
import { useAuth } from "../features/auth/hooks/useAuth";
import EventGrid from "../features/events/components/EventGrid";
import { useCustomerEvents } from "../features/events/hooks/useCustomerEvents";
import { useOrganizerEvents } from "../features/events/hooks/useOrganizerEvents";
import { useDebounce } from "../hooks/useDebounce";

export default function PageMyEvents() {
    const { user } = useAuth();
    const isOrganizer = user?.role === "organizer";
    const [searchItem, setSearchItem] = React.useState("");
    const debouncedSearchItem = useDebounce(searchItem, 500);

    const { events, isLoading, isFetchingNextPage, hasMore, loadMore } =
        useOrganizerEvents(debouncedSearchItem, isOrganizer);

    const {
        eventsCustomer,
        isLoadingCustomer,
        isFetchingNextPageCustomer,
        hasMoreCustomer,
        loadMoreCustomer,
    } = useCustomerEvents(debouncedSearchItem, isOrganizer);

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

            {isOrganizer ? (
                <EventGrid
                    events={events}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    emptyMessage="Você ainda não criou nenhum evento."
                />
            ) : (
                <EventGrid
                    events={eventsCustomer}
                    isLoading={isLoadingCustomer}
                    isFetchingNextPage={isFetchingNextPageCustomer}
                    hasMore={hasMoreCustomer}
                    loadMore={loadMoreCustomer}
                    emptyMessage="Você ainda não criou nenhum evento."
                />
            )}
        </div>
    );
}
