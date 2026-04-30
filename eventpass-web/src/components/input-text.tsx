import React, { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import SearchIcon from "../assets/icons/MagnifyingGlass-Regular.svg?react";
import WarningIcon from "../assets/icons/Warning-Regular.svg?react";
import CloseIcon from "../assets/icons/XCircle-Fill.svg?react";
import Icon from "./icon";
import Text from "./text";

const inputTextVariants = tv({
    slots: {
        base: "flex flex-col gap-2 w-full",
        inputContainer: `group flex items-center gap-3 px-4 py-3 rounded-md border-2
        transition-colors focus-within:border-purple-light`,
        inputElement: `flex-1 min-w-0 text-white placeholder:text-gray-500 
         outline-none font-body text-base bg-transparent`,
        iconLeft: "w-5 h-5 shrink-0",
        iconRight: `w-5 h-5 shrink-0 fill-gray-500 transition-opacity hover:opacity-70 cursor-pointer`,
        errorContainer: "flex gap-2 items-center mt-1",
        errorText: "text-error-light",
    },
    variants: {
        isError: {
            true: {
                inputContainer:
                    "border-error-light focus-within:border-error-light",
                // Aqui é o pulo do gato: forçamos o vermelho mesmo com o focus-within!
                iconLeft:
                    "fill-error-light group-focus-within:fill-error-light",
            },
            false: {
                inputContainer: "border-gray-300",
            },
        },
        // Deixamos o hasValue vazio aqui, pois as regras dele dependem do isError
        hasValue: {
            true: {},
            false: {},
        },
    },
    // Aqui nós criamos o cruzamento perfeito dos estados
    compoundVariants: [
        {
            isError: false,
            hasValue: true,
            class: {
                iconLeft:
                    "fill-purple-light group-focus-within:fill-purple-light",
            },
        },
        {
            isError: false,
            hasValue: false,
            class: {
                iconLeft: "fill-gray-500 group-focus-within:fill-purple-light",
            },
        },
    ],
    defaultVariants: {
        isError: false,
        hasValue: false,
    },
});

export interface InputTextProps
    extends
        React.ComponentProps<"input">,
        VariantProps<typeof inputTextVariants> {
    error?: React.ReactNode;
    onClear?: () => void;
    icon?: React.FC<React.ComponentProps<"svg">>;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
    ({ className, error, value, icon, onClear, ...props }, ref) => {
        const hasValue = value !== undefined && value !== "";

        const {
            base,
            inputContainer,
            inputElement,
            iconLeft,
            iconRight,
            errorContainer,
            errorText,
        } = inputTextVariants({
            isError: !!error,
            hasValue: hasValue,
        });

        return (
            <div className={base({ className })}>
                <div className={inputContainer()}>
                    {!icon ? (
                        <Icon svg={SearchIcon} className={iconLeft()} />
                    ) : (
                        <Icon svg={icon} className={iconLeft()} />
                    )}
                    <input
                        ref={ref}
                        type={props.type || "text"}
                        value={value}
                        className={inputElement()}
                        {...props}
                    />

                    {value && onClear && (
                        <button
                            type="button"
                            onClick={onClear}
                            aria-label="Limpar campo"
                            className="flex items-center justify-center outline-none"
                        >
                            <Icon svg={CloseIcon} className={iconRight()} />
                        </button>
                    )}
                </div>

                {error && (
                    <div className={errorContainer()}>
                        <Icon
                            svg={WarningIcon}
                            className="w-4 h-4 fill-error-light"
                        />
                        <Text variant="text-sm" className={errorText()}>
                            {error}
                        </Text>
                    </div>
                )}
            </div>
        );
    },
);

InputText.displayName = "InputText";

export default InputText;
