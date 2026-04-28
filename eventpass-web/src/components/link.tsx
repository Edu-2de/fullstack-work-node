import type React from "react";
import { Link as RouterLink } from "react-router-dom";
import { tv, type VariantProps } from "tailwind-variants";
import Icon from "./icon";
import Text from "./text";

const linkVariants = tv({
    base: "group flex items-center justify-center gap-2  cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
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
    icon?: React.FC<React.ComponentProps<"svg">>;
}

export default function Link({
    className,
    children,
    icon: IconComponent,
    variant,
    ...props
}: LinkProps) {
    return (
        <RouterLink className={linkVariants({ variant, className })} {...props}>
            {IconComponent && (
                <Icon
                    svg={IconComponent}
                    className="w-5 h-5 fill-gray-500 transition-colors group-hover:fill-purple-light"
                />
            )}

            <Text
                variant="text-md"
                weight="bold"
                color="inherit"
                className="text-gray-500 transition-colors group-hover:text-purple-light"
            >
                {children}
            </Text>
        </RouterLink>
    );
}
