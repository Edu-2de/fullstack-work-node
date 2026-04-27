import { tv, type VariantProps } from "tailwind-variants";
import Button from "./button";

const buttonVariants = tv({
    base: "flex",
});

interface IconButtonProps
    extends
        React.ComponentProps<"button">,
        VariantProps<typeof buttonVariants> {}

export default function IconButton({
    className,
    icon,
    ...props
}: IconButtonProps) {
    return <Button>icon</Button>;
}
