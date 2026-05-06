import { useParams } from "react-router-dom";
import Spin from "../assets/icons/circle-notch.svg?react";
import Icon from "../components/icon";
import Text from "../components/text";
import EventForm from "../features/events/components/EventForm";
import { useEvent } from "../features/events/hooks/useEvent";

export default function PageEditEvent() {
    const { id } = useParams();

    const { event, isLoading } = useEvent(id || "");

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center h-64 gap-4">
                <Icon
                    svg={Spin}
                    animate
                    className="w-10 h-10 fill-purple-base"
                />
                <Text variant="text-md" className="text-gray-500">
                    Carregando dados do evento...
                </Text>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="w-full flex items-center justify-center h-64">
                <Text variant="display-md" className="text-error-base">
                    Evento não encontrado para edição.
                </Text>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8">
            <EventForm event={event} />
        </div>
    );
}
