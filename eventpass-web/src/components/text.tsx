import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const textVariants = tv({
    base: "text-white",
    variants: {
        variant: {
            "display-xl": "font-display text-2xl",
            "display-lg": "font-display text-xl",
            "display-md": "font-display text-base",

            "title-hg": "font-title text-[2rem] font-bold",
            "title-xl": "font-title text-2xl font-bold",
            "title-lg": "font-title text-xl font-bold",
            "title-xs": "font-title text-xs font-normal",

            "input-text": "font-body text-[1rem] leading-6",
            "text-md": "font-body text-[1rem] leading-[160%]",
            "text-sm": "font-body text-[0.875rem] leading-[160%]",
            "text-xs": "font-body text-[0.75rem] leading-[160%]",
        },
        weight: {
            regular: "font-normal",
            bold: "font-bold",
        },
    },
    defaultVariants: {
        variant: "text-md",
        weight: "regular",
    },
});

interface TextProps extends VariantProps<typeof textVariants> {
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
}

export default function Text({
    as = "span",
    className,
    variant,
    weight,
    children,
    ...props
}: TextProps) {
    return React.createElement(
        as,
        {
            className: textVariants({ variant, weight, className }),
            ...props,
        },
        children,
    );
}
