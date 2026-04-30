import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginFormData) {
        try {
            await login(data);
            navigate("/");
        } catch (error) {
            console.error("Erro no login:", error);
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
                    {...register("email")}
                />
                <InputText
                    icon={PasswordIcon}
                    placeholder="Senha"
                    type="password"
                    error={errors.password?.message}
                    {...register("password")}
                />
            </div>

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
