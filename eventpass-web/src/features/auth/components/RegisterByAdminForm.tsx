import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { tv } from "tailwind-variants";

import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";

import type { RegisterByAdminFormData, User } from "../models/auth.types";
import { registerByAdminSchema } from "../schema";





// Estilos reduzidos ao estritamente necessário
const UserVariants = tv({
  slots: {
    wrapper: "flex flex-col w-full max-w-2xl mx-auto gap-8",
    formArea:
      "flex flex-col gap-6 p-8 rounded-2xl  ",
    sectionTitle: "mb-2",
    actions:
      "flex items-center justify-end gap-4 pt-6 border-t border-white/10",
    cancelBtn:
      "text-white/50 hover:text-white font-medium transition-colors px-4",
  },
});

interface UserFormProps {
  user?: User;
  onSubmit: (data: RegisterByAdminFormData) => Promise<void>;
  isSubmitLoading?: boolean;
  submitError?: Error | null;
}

export default function UserForm({
  user,
  onSubmit,
  isSubmitLoading,
  submitError,
}: UserFormProps) {
  const navigate = useNavigate();
  const { wrapper, formArea, sectionTitle, actions, cancelBtn } =
    UserVariants();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterByAdminFormData>({
    resolver: zodResolver(registerByAdminSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
    },
  });

  const handleFormSubmit: SubmitHandler<RegisterByAdminFormData> = async (data) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Mapeamento de erros do servidor para os campos do formulário
      if (isAxiosError(err) && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;

        backendErrors.forEach(
          (backendError: { field: string; message: string }) => {
            if (backendError.field === "name") {
              setError("name", {
                type: "server",
                message: backendError.message,
              });
            }
          }
        );
        return;
      }
    }
  };

  // Tratamento de mensagens de erro globais
  let submitErrorMessage = submitError?.message;

  if (isAxiosError(submitError)) {
    if (!submitError.response?.data?.errors) {
      submitErrorMessage =
        submitError.response?.data?.message || submitError.message;
    } else {
      submitErrorMessage = undefined;
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={wrapper()}>
      <div className={formArea()}>
        <div className={sectionTitle()}>
          <Text variant="title-lg" color="button" weight="bold">
            {user ? "Editar Usuario" : "Nova Usuario"}
          </Text>
        </div>

        <InputText
          placeholder="Nome"
          {...register("name")}
          error={errors.name?.message}
        />
        <InputText
          placeholder="E-mail"
          {...register("email")}
          error={errors.email?.message}
        />
       <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-3 px-4 py-3 rounded-md border-2 border-gray-300 transition-colors focus-within:border-purple-light">
              <select
                  className="flex-1 min-w-0 text-white outline-none font-body text-base bg-transparent [&>option]:bg-gray-200"
                  {...register("role")}
              >
                  <option value="admin">Admin</option>
                  <option value="organizer">Organizer</option>
                  <option value="customer">Customer</option>
              </select>
          </div>
          {errors.role && (
              <Text variant="text-sm" className="text-error-light mt-1">
                  {errors.role.message}
              </Text>
          )}
       </div>

        {submitErrorMessage && (
          <Text
            variant="text-sm"
            className="text-error-light mt-4 text-center bg-error-base/10 p-4 rounded-xl border border-error-base/20"
          >
            {submitErrorMessage}
          </Text>
        )}

        <div className={actions()}>
          <button
            type="button"
            className={cancelBtn()}
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>
          <Button
            type="submit"
            className="w-40"
            isLoading={isSubmitting || isSubmitLoading}
          >
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
