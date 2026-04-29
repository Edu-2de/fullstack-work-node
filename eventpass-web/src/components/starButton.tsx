import React, { useState } from "react";
import { tv } from "tailwind-variants";
import StarFillIcon from "../assets/icons/Star-Fill.svg?react";
import StarIcon from "../assets/icons/Star-Regular.svg?react";
import Icon from "./icon";

const starButtonVariants = tv({
    slots: {
        base: `group flex items-center justify-center w-9 h-9 rounded-full 
        transition-colors cursor-pointer focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-purple-light`,
        icon: "w-5 h-5 transition-colors",
    },
    variants: {
        isFavorite: {
            true: {
                base: "bg-transparent",
                icon: "fill-purple-light",
            },
            false: {
                base: "hover:bg-gray-300",
                icon: "fill-gray-500 group-hover:fill-purple-light",
            },
        },
    },
});
interface StarButtonProps extends Omit<
    React.ComponentProps<"button">,
    "onChange"
> {
    isFavorite: boolean;
    onChange: (favorite: boolean) => void;
}

export default function StarButton({
    className,
    isFavorite,
    onChange,
    ...props
}: StarButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const { base, icon } = starButtonVariants({ isFavorite });

    const showFilledStar = isFavorite || isHovered;

    return (
        <button
            type="button"
            className={base({ className })}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onChange(!isFavorite)}
            {...props}
        >
            <Icon
                svg={showFilledStar ? StarFillIcon : StarIcon}
                className={icon()}
            />
        </button>
    );
}
