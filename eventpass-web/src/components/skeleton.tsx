import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const skeletonVariants = tv({
    base: "animate-pulse bg-gray-300 pointer-events-none",
    variants: {
        rounded: {
            sm: "rounded-sm",
            lg: "rounded-lg",
            full: "rounded-full",
        },
    },
    defaultVariants: {
        rounded: "lg",
    },
});

interface SkeletonProps
    extends
        VariantProps<typeof skeletonVariants>,
        React.ComponentProps<"div"> {}

export default function Skeleton({
    className,
    rounded,
    ...props
}: SkeletonProps) {
    return (
        <div className={skeletonVariants({ rounded, className })} {...props} />
    );
}
