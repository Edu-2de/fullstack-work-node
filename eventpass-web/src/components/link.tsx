import type React from "react";
import { Link as RouterLink } from "react-router-dom";
import { tv, type VariantProps } from "tailwind-variants";

const linkVariants = tv({
    base: "cursor-pointer transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    variants: {
        variant: {
            primary: "text-purple-base hover:text-purple-light",
            secondary: "text-gray-700 hover:text-gray-900",
            ghost: "text-white hover:text-gray-200",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
});

interface LinkProps
    extends
        React.ComponentProps<typeof RouterLink>,
        VariantProps<typeof linkVariants> {
    className?: string;
    children: React.ReactNode;
}

export default function Link({
    className,
    children,
    variant,
    ...props
}: LinkProps) {
    return (
        <RouterLink className={linkVariants({ variant, className })} {...props}>
            {children}
        </RouterLink>
    );
}
