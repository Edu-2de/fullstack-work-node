import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const textVariants = tv({
    variants: {
        variant: {
            "display-xl": "font-display text-2xl leading-normal",
            "display-lg": "font-display text-xl leading-normal",
            "display-md": "font-display text-base leading-normal",

            "title-hg": "font-title text-[2rem] leading-normal",
            "title-xl": "font-title text-2xl leading-normal",
            "title-lg": "font-title text-xl leading-normal",
            "title-xs": "font-title text-xs leading-normal",

            "input-text": "font-body text-base leading-6",
            "text-md": "font-body text-base leading-[160%]",
            "text-sm": "font-body text-sm leading-[160%]",
            "text-xs": "font-body text-xs leading-[160%]",
        },
        weight: {
            regular: "font-normal",
            bold: "font-bold",
        },
        color: {
            main: "text-gray-700",
            secondary: "text-gray-600",
            ghost: "text-gray-500",
            selected: "text-purple-light",
            button: "text-white",
            inherit: "text-inherit",
        },
    },
    defaultVariants: {
        variant: "text-md",
        weight: "regular",
        color: "secondary",
    },
});

interface TextProps extends VariantProps<typeof textVariants> {
    as?: React.ElementType;
    className?: string;
    children?: React.ReactNode;
}

export default function Text({
    as: Component = "span",
    className,
    variant,
    color,
    weight,
    children,
    ...props
}: TextProps) {
    return (
        <Component
            className={textVariants({ variant, weight, color, className })}
            {...props}
        >
            {children}
        </Component>
    );
}
