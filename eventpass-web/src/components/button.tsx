import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import Text from "./text";

const buttonVariants = tv({
    base: "flex items-center cursor-pointer justify-center transition-all rounded group gap-2 disabled:opacity-50 disabled:cursor-not-allowed",

    variants: {
        variant: {
            solid: "bg-purple-base hover:bg-purple-light ",
            outline:
                "border-2 border-purple-base text-purple-base hover:bg-purple-base/10",
            ghost: "bg-transparent hover:bg-gray-300 text-white",
        },
        size: {
            sm: "h-8 px-3",
            md: "h-10 px-4",
            lg: "h-12 px-6",
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
        VariantProps<typeof buttonVariants> {}

export default function Button({
    children,
    className,
    variant,
    size,
    ...props
}: ButtonProps) {
    return (
        <button
            className={buttonVariants({ variant, size, className })}
            {...props}
        >
            <Text as="p" variant="input-text" color="button">
                {children}
            </Text>
        </button>
    );
}
