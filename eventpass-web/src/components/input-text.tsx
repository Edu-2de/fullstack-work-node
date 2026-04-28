import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import SearchIcon from "../assets/icons/MagnifyingGlass-Regular.svg?react";
import WarningIcon from "../assets/icons/Warning-Regular.svg?react";
import CloseIcon from "../assets/icons/XCircle-Fill.svg?react";
import Icon from "./icon";
import Text from "./text";

const inputTextVariants = tv({
    slots: {
        base: "flex flex-col gap-2 w-66 h-12",
        inputContainer: `group flex items-center gap-3 px-4 py-3 rounded-md border-2 bg-gray-200 
        transition-colors focus-within:border-purple-light`,
        inputElement: `flex-1 min-w-0 bg-transparent text-white placeholder:text-gray-500 
        outline-none font-body text-base`,
        iconLeft: "w-5 h-5 shrink-0",
        iconRight: `w-5 h-5 shrink-0 fill-gray-500 transition-opacity hover:opacity-70 cursor-pointer`,
        errorContainer: "flex gap-2 items-center",
        errorText: "text-error-light",
    },
    variants: {
        isError: {
            true: {
                inputContainer:
                    "border-gray-300 focus-within:border-error-light",
                iconLeft: "fill-error-light",
            },
            false: {
                inputContainer: "border-gray-300",
                iconLeft: "fill-gray-500",
            },
        },
        hasValue: {
            true: {},
            false: {},
        },
    },
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
    },
});

interface InputTextProps
    extends
        React.ComponentProps<"input">,
        VariantProps<typeof inputTextVariants> {
    error?: React.ReactNode;
    onClear?: () => void;
}

export default function InputText({
    className,
    error,
    value,
    onClear,
    ref,
    ...props
}: InputTextProps) {
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

    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    const handleClearClick = () => {
        if (onClear) {
            onClear();
        }
        inputRef.current?.focus();
    };

    return (
        <div className={base({ className })}>
            <div className={inputContainer()}>
                <Icon svg={SearchIcon} className={iconLeft()} />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    className={inputElement()}
                    {...props}
                />
                {value && onClear && (
                    <button
                        type="button"
                        onClick={handleClearClick}
                        aria-label="Limpar campo"
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
}
