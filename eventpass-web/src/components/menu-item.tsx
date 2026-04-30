import type React from "react";
import { NavLink } from "react-router-dom";
import { tv, type VariantProps } from "tailwind-variants";
import Icon from "./icon";
import Text from "./text";

const menuItemVariants = tv({
    base: `bg-transparent hover:bg-gray-200 text-gray-500 rounded 
    flex gap-2 items-center justify-center`,
    variants: {
        size: {
            xs: "w-8 h-8 p-0",
            sm: "px-4 py-2 text-sm",
            md: "px-5 py-3 text-base",
            lg: "px-8 py-4 text-lg",
            full: "w-full px-5 py-3 text-base",
        },
        active: {
            true: "text-purple-light bg-gray-300",
            false: "text-gray-500",
        },
    },
    defaultVariants: {
        size: "sm",
        active: false,
    },
});

interface MenuItemProps
    extends
        React.ComponentProps<"li">,
        Omit<VariantProps<typeof menuItemVariants>, "active"> {
    icon?: React.FC<React.ComponentProps<"svg">>;
    to: string;
}

export default function MenuItem({
    className,
    icon,
    size,
    to,
    children,
    ...props
}: MenuItemProps) {
    return (
        <li {...props} className="list-none">
            <NavLink
                to={to}
                className={({ isActive }) =>
                    menuItemVariants({ size, active: isActive, className })
                }
            >
                {icon && <Icon svg={icon} className="w-5 h-5 fill-current" />}

                <Text variant="text-md" color="inherit">
                    {children}
                </Text>
            </NavLink>
        </li>
    );
}
