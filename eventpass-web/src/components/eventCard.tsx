import React, { useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import StarFillIcon from "../assets/icons/Star-Fill.svg?react";
import NoImage from "../assets/images/no-photo.jpg";
import type { Event } from "../features/events/models/event.types";
import Icon from "./icon";
import Skeleton from "./skeleton";
import Text from "./text";

const eventCardVariants = tv({
    slots: {
        base: "relative w-70 h-100 overflow-hidden rounded-2xl cursor-pointer transition-all duration-500",
        image: "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
        overlay:
            "absolute inset-0 bg-linear-to-t from-gray-100 via-gray-100/80 to-transparent pointer-events-none transition-opacity duration-300",
        content:
            "relative z-10 h-full w-full p-5 flex flex-col justify-between",
        badge: "self-end flex items-center gap-2 bg-gray-100/60 backdrop-blur-md py-1.5 px-4 rounded-full border border-white/10",
        infoWrapper: "flex flex-col gap-1 transition-all duration-300",
    },
    variants: {
        isHover: {
            true: {
                image: "scale-110",
                overlay: "opacity-100",
            },
            false: {
                image: "scale-100",
                overlay: "opacity-70",
            },
        },
    },
});

interface EventCardProps
    extends
        React.ComponentProps<"div">,
        VariantProps<typeof eventCardVariants> {
    event: Event;
    isLoading?: boolean;
}

export default function EventCard({
    className,
    event,
    isLoading,
    ...props
}: EventCardProps) {
    const [isHover, setIsHover] = useState(false);

    const { base, image, overlay, content, badge, infoWrapper } =
        eventCardVariants({
            isHover,
        });

    const apiUrl = import.meta.env.VITE_API_URL;

    return !isLoading ? (
        <div
            className={base({ className })}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            {...props}
        >
            {event.banner_url ? (
                <img
                    src={`${apiUrl}/files/${event.banner_url}`}
                    alt={event.title}
                    className={image()}
                />
            ) : (
                <img src={NoImage} alt="NoImage" className={image()} />
            )}

            <div className={overlay()} />

            <div className={content()}>
                <div className={badge()}>
                    <Text className="text-white text-sm font-bold">
                        4<span className="text-white/60">/ 5</span>
                    </Text>
                    <Icon
                        svg={StarFillIcon}
                        className="w-4 h-4 text-yellow-400 fill-white"
                    />
                </div>

                <div className={infoWrapper()}>
                    <Text className="text-white text-xl font-bold leading-tight">
                        {event.title}
                    </Text>
                    {isHover ? (
                        <Text className="text-white/80 text-sm leading-relaxed animate-fade-in">
                            {event.description.length > 100
                                ? `${event.description.substring(0, 100)}...`
                                : event.description}
                        </Text>
                    ) : (
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Text>
                                {event.categories.length > 0 &&
                                    event.categories
                                        .slice(0, 2)
                                        .map((c) => c.name)
                                        .join(", ")}
                            </Text>

                            <span className="w-1 h-1 bg-white/40 rounded-full" />

                            <Text>
                                {new Date(event.start_date).getFullYear()}
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <Skeleton className={`w-70 h-100 rounded-2xl ${className || ""}`} />
    );
}
