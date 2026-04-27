import { tv, type VariantProps } from "tailwind-variants";

const iconVariants = tv({
    variants: {
        animate: {
            true: "animate-spin",
            false: "",
        },
    },
    defaultVariants: {
        animate: false,
    },
});

interface IconProps
    extends React.ComponentProps<"svg">, VariantProps<typeof iconVariants> {
    svg: React.FC<React.ComponentProps<"svg">>;
}

export default function Icon({
    svg: SvgComponent,
    animate,
    className,
    ...props
}: IconProps) {
    return (
        <SvgComponent
            className={iconVariants({ animate, className })}
            {...props}
        />
    );
}
