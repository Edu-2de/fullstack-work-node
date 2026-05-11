import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm, type Path } from "react-hook-form";

import { type LoginFormData } from "../models/auth.types";
import { loginSchema } from "../schema";

import EmailIcon from "../../../assets/icons/Envelope-Regular.svg?react";
import PasswordIcon from "../../../assets/icons/Password-Regular.svg?react";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isSubmitLoading?: boolean;
    submitError?: Error | null;
}

export default function LoginForm({
    onSubmit,
    isSubmitLoading,
    submitError,
}: LoginFormProps) {
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const emailValue = watch("email");
    const passwordValue = watch("password");

    async function handleFormSubmit(data: LoginFormData) {
        try {
            await onSubmit(data);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.data?.errors) {
                    const backendErrors = error.response.data.errors;
                    backendErrors.forEach(
                        (err: { field: string; message: string }) => {
                            setError(err.field as Path<LoginFormData>, {
                                type: "server",
                                message: err.message,
                            });
                        },
                    );
                } else {
                    setError("root", {
                        message:
                            error.response?.data?.message ||
                            "E-mail ou senha incorretos.",
                    });
                }
            } else {
                setError("root", {
                    message:
                        "Ocorreu um erro inesperado. Tente novamente mais tarde.",
                });
            }
            setValue("password", "", { shouldValidate: false });
        }
    }

    let globalErrorMessage = submitError?.message;
    if (isAxiosError(submitError)) {
        if (!submitError.response?.data?.errors) {
            globalErrorMessage =
                submitError.response?.data?.message ||
                "Falha ao criar conta. Verifique os dados.";
        } else {
            globalErrorMessage = undefined;
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-8"
        >
            <Text as="h1" variant="display-xl" className="text-white">
                Acesse sua conta
            </Text>

            <div className="flex flex-col gap-4">
                <InputText
                    icon={EmailIcon}
                    placeholder="E-mail"
                    type="email"
                    error={errors.email?.message}
                    value={emailValue || ""}
                    onClear={() =>
                        setValue("email", "", { shouldValidate: true })
                    }
                    {...register("email")}
                />
                <InputText
                    icon={PasswordIcon}
                    placeholder="Senha"
                    type="password"
                    error={errors.password?.message}
                    value={passwordValue || ""}
                    onClear={() =>
                        setValue("password", "", { shouldValidate: true })
                    }
                    {...register("password")}
                />
            </div>

            {errors.root && (
                <Text
                    variant="text-sm"
                    className="text-error-light text-center bg-error-base/10 p-3 rounded-lg border border-error-base/20"
                >
                    {errors.root.message}
                </Text>
            )}

            {globalErrorMessage && (
                <Text
                    variant="text-sm"
                    className="text-error-light text-center bg-error-base/10 p-3 rounded-lg border border-error-base/20"
                >
                    {globalErrorMessage}
                </Text>
            )}

            <Button
                isLoading={isSubmitting || isSubmitLoading}
                size="full"
                className="mt-2 h-12"
                type="submit"
            >
                Entrar
            </Button>
        </form>
    );
}
