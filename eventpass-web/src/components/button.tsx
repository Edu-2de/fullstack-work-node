import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import Spin from "../assets/icons/circle-notch.svg?react";
import Icon from "./icon";
import Text from "./text";

const buttonVariants = tv({
    base: `relative flex items-center cursor-pointer justify-center transition-all 
    rounded group gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white`,

    variants: {
        variant: {
            solid: "bg-purple-base hover:bg-purple-light ",
            outline:
                "border-2 border-purple-base text-purple-base hover:bg-purple-base/10",
            ghost: "bg-transparent hover:bg-gray-300 ",
        },
        size: {
            xs: "w-8 h-8 p-0",
            sm: "px-4 py-2 text-sm",
            md: "px-5 py-3 text-base",
            lg: "px-8 py-4 text-lg",
            full: "w-full px-5 py-3 text-base",
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
    icon?: React.FC<React.ComponentProps<"svg">>;
}

export default function Button({
    children,
    className,
    variant,
    size,
    icon,
    isLoading,
    ...props
}: ButtonProps) {
    return (
        <button
            className={buttonVariants({ variant, size, className })}
            {...props}
            disabled={isLoading}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                        svg={Spin}
                        animate
                        className="w-5 h-5 fill-gray-600"
                    />
                </div>
            )}

            <div
                className={`flex items-center justify-center gap-2 transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
                {icon && <Icon className="w-5 h-5 fill-current" svg={icon} />}
                <Text as="p" variant="input-text" color="inherit">
                    {children}
                </Text>
            </div>
        </button>
    );
}
