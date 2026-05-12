import type React from "react";
import Text from "../../../../components/text";

interface EventGridProps extends React.ComponentProps<"div"> {
    date: string;
    time: string;
    location: string;
    organizer: string;
    isSoldOut: boolean;
    availableCapacity: number;
    totalCapacity: number;
}

export default function EventInfoGrid({
    date,
    time,
    location,
    organizer,
    isSoldOut,
    availableCapacity,
    totalCapacity,
}: EventGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 mb-12">
            <div className="flex flex-col gap-1">
                <Text
                    variant="text-sm"
                    className="text-gray-500 uppercase tracking-widest font-bold"
                >
                    Data
                </Text>
                <Text variant="text-md" className="text-white capitalize">
                    {date}
                </Text>
            </div>

            <div className="flex flex-col gap-1">
                <Text
                    variant="text-sm"
                    className="text-gray-500 uppercase tracking-widest font-bold"
                >
                    Horário
                </Text>
                <Text variant="text-md" className="text-white">
                    {time}
                </Text>
            </div>

            <div className="flex flex-col gap-1">
                <Text
                    variant="text-sm"
                    className="text-gray-500 uppercase tracking-widest font-bold"
                >
                    Localização
                </Text>
                <Text variant="text-md" className="text-white">
                    {location}
                </Text>
            </div>

            <div className="flex flex-col gap-1">
                <Text
                    variant="text-sm"
                    className="text-gray-500 uppercase tracking-widest font-bold"
                >
                    Organizador
                </Text>
                <Text variant="text-md" className="text-white">
                    {organizer || "Desconhecido"}
                </Text>
            </div>

            <div className="flex flex-col gap-1">
                <Text
                    variant="text-sm"
                    className="text-gray-500 uppercase tracking-widest font-bold"
                >
                    Disponibilidade
                </Text>
                <Text variant="text-md" className="text-white">
                    <span
                        className={
                            isSoldOut
                                ? "text-error-light font-bold"
                                : "text-green-400 font-bold"
                        }
                    >
                        {availableCapacity}
                    </span>{" "}
                    / {totalCapacity} ingressos
                </Text>
            </div>
        </div>
    );
}
