import React, { useRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import WarningIcon from "../assets/icons/Warning-Regular.svg?react";
import Icon from "./icon";
import Text from "./text";

const inputTextAreaVariants = tv({
    slots: {
        base: "flex flex-col gap-2 w-full",
        inputContainer: "flex px-4 py-3 rounded-md border-2 transition-colors ",
        inputElement:
            "w-full h-full min-h-30 text-white placeholder:text-gray-500 outline-none font-body text-base resize-none",
        errorContainer: "flex gap-2 items-center",
        errorText: "text-error-light",
    },
    variants: {
        isError: {
            true: {
                inputContainer:
                    "border-gray-300 focus-within:border-error-light",
            },
            false: {
                inputContainer:
                    "border-gray-300 focus-within:border-purple-light",
            },
        },
    },
    defaultVariants: {
        isError: false,
    },
});

interface InputTextAreaProps
    extends
        React.ComponentProps<"textarea">,
        VariantProps<typeof inputTextAreaVariants> {
    error?: React.ReactNode;
}

export default function InputTextArea({
    className,
    error,
    ref,
    ...props
}: InputTextAreaProps) {
    const { base, inputContainer, inputElement, errorContainer, errorText } =
        inputTextAreaVariants({
            isError: !!error,
        });

    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef =
        (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    return (
        <div className={base({ className })}>
            <div className={inputContainer()}>
                <textarea
                    ref={textareaRef}
                    className={inputElement()}
                    {...props}
                />
            </div>

            {error && (
                <div className={errorContainer()}>
                    <Icon
                        svg={WarningIcon}
                        className="w-4 h-4 shrink-0 fill-error-light"
                    />
                    <Text variant="text-sm" className={errorText()}>
                        {error}
                    </Text>
                </div>
            )}
        </div>
    );
}
