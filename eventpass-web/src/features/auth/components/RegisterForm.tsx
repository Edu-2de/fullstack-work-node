import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm, type Path } from "react-hook-form";
import type { RegisterFormData } from "../models/auth.types";
import { registerSchema } from "../schema";

import EmailIcon from "../../../assets/icons/Envelope-Regular.svg?react";
import PasswordIcon from "../../../assets/icons/Password-Regular.svg?react";
import UserIcon from "../../../assets/icons/User-Regular.svg?react";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => Promise<void>;
    isSubmitLoading?: boolean;
    submitError?: Error | null;
}

export default function RegisterForm({
    onSubmit,
    isSubmitLoading,
    submitError,
}: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const nameValue = watch("name");
    const emailValue = watch("email");
    const passwordValue = watch("password_encrypted");

    async function handleFormSubmit(data: RegisterFormData) {
        try {
            await onSubmit(data);
        } catch (error) {
            if (isAxiosError(error) && error.response?.data?.errors) {
                const backendErrors = error.response.data.errors;
                backendErrors.forEach(
                    (err: { field: string; message: string }) => {
                        setError(err.field as Path<RegisterFormData>, {
                            type: "server",
                            message: err.message,
                        });
                    },
                );

                setValue("password_encrypted", "", { shouldValidate: false });
                return;
            }
            setValue("password_encrypted", "", { shouldValidate: false });
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
                Crie sua conta
            </Text>

            <div className="flex flex-col gap-4">
                <InputText
                    icon={UserIcon}
                    placeholder="Nome"
                    type="text"
                    error={errors.name?.message}
                    value={nameValue || ""}
                    onClear={() =>
                        setValue("name", "", { shouldValidate: true })
                    }
                    {...register("name")}
                />
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
                    error={errors.password_encrypted?.message}
                    value={passwordValue || ""}
                    onClear={() =>
                        setValue("password_encrypted", "", {
                            shouldValidate: true,
                        })
                    }
                    {...register("password_encrypted")}
                />
            </div>

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
                Criar
            </Button>
        </form>
    );
}
