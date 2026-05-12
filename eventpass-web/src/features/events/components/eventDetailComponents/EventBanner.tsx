import type React from "react";
import Text from "../../../../components/text";

interface EventBannerProps extends React.ComponentProps<"div"> {
    isCancelled: boolean;
    isPastEvent: boolean;
    bannerUrl: string;
    title: string;
}

export default function EventBanner({
    bannerUrl,
    isPastEvent,
    isCancelled,
    title,
}: EventBannerProps) {
    return (
        <div className="w-full lg:w-112.5 shrink-0">
            {bannerUrl ? (
                <img
                    src={bannerUrl}
                    alt={title}
                    className={`w-full h-125 lg:h-162.5 object-cover rounded-3xl border border-white/5 ${
                        isPastEvent || isCancelled
                            ? "grayscale contrast-75 opacity-80"
                            : ""
                    }`}
                />
            ) : (
                <div className="w-full h-125 lg:h-162.5 bg-gray-300 rounded-3xl flex items-center justify-center border border-white/5">
                    <Text className="text-gray-500">Sem imagem</Text>
                </div>
            )}
        </div>
    );
}
