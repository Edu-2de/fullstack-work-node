import cx from "classnames";
import type React from "react";

interface MainContentProps extends React.ComponentProps<"main"> {
    cl?: string;
}

export default function MainContent({
    children,
    className,
    ...props
}: MainContentProps) {
    return (
        <main className={cx(className)} {...props}>
            {children}
        </main>
    );
}
