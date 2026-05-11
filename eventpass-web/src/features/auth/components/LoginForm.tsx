import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm, type Path } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { type LoginFormData } from "../models/auth.types";
import { loginSchema } from "../schema";

import EmailIcon from "../../../assets/icons/Envelope-Regular.svg?react";
import PasswordIcon from "../../../assets/icons/Password-Regular.svg?react";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

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

    async function onSubmit(data: LoginFormData) {
        try {
            await login(data);
            navigate("/");
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                const backendErrors = error.response.data.errors;
                const genericMessage = error.response.data.message;

                if (backendErrors && Array.isArray(backendErrors)) {
                    backendErrors.forEach((err) => {
                        setError(err.field as Path<LoginFormData>, {
                            message: err.message,
                        });
                    });
                } else {
                    setError("root", {
                        message:
                            genericMessage ||
                            "Falha ao iniciar sessão. Verifique os seus dados.",
                    });
                    setValue("password", "", { shouldValidate: false });
                }
            } else {
                setError("root", {
                    message:
                        "Ocorreu um erro inesperado. Tente novamente mais tarde.",
                });
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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

            <Button
                isLoading={isSubmitting}
                size="full"
                className="mt-2 h-12"
                type="submit"
            >
                Entrar
            </Button>
        </form>
    );
}
