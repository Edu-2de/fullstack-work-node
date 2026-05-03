import SearchIcon from "../assets/icons/MagnifyingGlass-Regular.svg?react";
import InputText from "../components/input-text";
import Text from "../components/text";
import EventGrid from "../features/events/components/EventGrid";
import { useEvents } from "../features/events/hooks/useEvents";

export default function PageHome() {
    const { events, isLoading, hasMore, loadMore } = useEvents();

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center">
                <Text
                    as="h1"
                    variant="title-hg"
                    className="text-white font-bold"
                >
                    Explorar
                </Text>
                <div className="w-80">
                    <InputText
                        icon={SearchIcon}
                        placeholder="Pesquisar filme"
                    />
                </div>
            </div>

            <EventGrid
                events={events}
                isLoading={isLoading}
                hasMore={hasMore}
                loadMore={loadMore}
            />
        </div>
    );
}
