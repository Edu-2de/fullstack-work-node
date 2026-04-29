import React from "react";
import { tv } from "tailwind-variants";
import StarFillIcon from "../assets/icons/Star-Fill.svg?react";
import StarIcon from "../assets/icons/Star-Regular.svg?react";
import Icon from "./icon";

const ratingVariants = tv({
    slots: {
        base: "flex gap-1 items-center",
        // Adicionei focus-visible para acessibilidade (navegação por teclado)
        starButton:
            "cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-light rounded-sm",
        starIcon: "w-6 h-6 transition-colors",
    },
    variants: {
        isActive: {
            true: {
                starIcon: "fill-purple-light",
            },
            false: {
                starIcon: "fill-gray-500",
            },
        },
    },
});

interface RatingProps extends Omit<React.ComponentProps<"div">, "onChange"> {
    value: number;
    onChange: (rating: number) => void;
}

export default function Rating({
    className,
    value,
    onChange,
    ...props
}: RatingProps) {
    const estrelas = [1, 2, 3, 4, 5];

    const [hover, setHover] = React.useState(0);

    const { base, starButton, starIcon } = ratingVariants();

    return (
        <div className={base({ className })} {...props}>
            {estrelas.map((estrelaAtual) => {
                const isActive = estrelaAtual <= hover || estrelaAtual <= value;

                return (
                    <button
                        key={estrelaAtual}
                        type="button"
                        className={starButton()}
                        onMouseEnter={() => {
                            setHover(estrelaAtual);
                        }}
                        onMouseLeave={() => {
                            setHover(0);
                        }}
                        onClick={() => {
                            onChange(estrelaAtual);
                        }}
                    >
                        <Icon
                            svg={isActive ? StarFillIcon : StarIcon}
                            className={starIcon({ isActive })}
                        />
                    </button>
                );
            })}
        </div>
    );
}
