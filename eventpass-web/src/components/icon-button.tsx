import { tv, type VariantProps } from "tailwind-variants";
import Button from "./button";
import Icon from "./icon";

const iconButtonVariants = tv({
    base: "w-5 h-5 fill-gray-500 group-hover:fill-purple-light",
});

interface IconButtonProps
    extends
        React.ComponentProps<"button">,
        VariantProps<typeof iconButtonVariants> {
    icon: React.FC<React.ComponentProps<"svg">>;
}

export default function IconButton({
    className,
    icon,
    ...props
}: IconButtonProps) {
    return (
        <Button
            size="xs"
            className="bg-gray-300 group hover:bg-gray-300 "
            {...props}
        >
            <Icon className={iconButtonVariants({ className })} svg={icon} />
        </Button>
    );
}
