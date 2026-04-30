import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Path } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";
import { useRegister } from "../hooks/useRegister";
import type { RegisterFormData } from "../models/auth.types";
import { registerSchema } from "../schema";

import { isAxiosError } from "axios";
import EmailIcon from "../../../assets/icons/Envelope-Regular.svg?react";
import PasswordIcon from "../../../assets/icons/Password-Regular.svg?react";
import UserIcon from "../../../assets/icons/User-Regular.svg?react";
import Button from "../../../components/button";

export default function RegisterForm() {
    const { registerUser } = useRegister();
    const navigate = useNavigate();

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

    async function onSubmit(data: RegisterFormData) {
        try {
            await registerUser(data);
            navigate("/login");
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                const backendErrors = error.response.data.errors;
                const genericMessage = error.response.data.message;

                if (backendErrors && Array.isArray(backendErrors)) {
                    backendErrors.forEach((err) => {
                        setError(err.field as Path<RegisterFormData>, {
                            message: err.message,
                        });
                    });
                } else {
                    setError("root", { message: genericMessage });
                }
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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

            <Button
                isLoading={isSubmitting}
                size="full"
                className="mt-2 h-12"
                type="submit"
            >
                Criar
            </Button>
        </form>
    );
}
