import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import Spin from "../assets/icons/circle-notch.svg?react";
import Icon from "./icon";
import Text from "./text";

const buttonVariants = tv({
    base: "flex items-center cursor-pointer justify-center transition-all rounded group gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3",

    variants: {
        variant: {
            solid: "bg-purple-base hover:bg-purple-light ",
            outline:
                "border-2 border-purple-base text-purple-base hover:bg-purple-base/10",
            ghost: "bg-transparent hover:bg-gray-300 text-white",
        },
        size: {
            xs: "w-8 h-8",
            sm: "w-25 h-12 ",
            md: "w-39.75 h-12",
            lg: "w-82 h-12",
            full: "w-full h-12",
        },
    },
    defaultVariants: {
        variant: "solid",
        size: "md",
    },
});

interface ButtonProps
    extends
        React.ComponentProps<"button">,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

export default function Button({
    children,
    className,
    variant,
    size,
    isLoading,
    ...props
}: ButtonProps) {
    return (
        <button
            className={buttonVariants({ variant, size, className })}
            {...props}
            disabled={isLoading}
        >
            {isLoading ? (
                <Icon svg={Spin} animate className="w-5 h-5 fill-gray-700" />
            ) : (
                <Text as="p" variant="input-text" color="button">
                    {children}
                </Text>
            )}
        </button>
    );
}
