import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { tv } from "tailwind-variants";

import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import Text from "../../../components/text";

import type { Category, CategoryFormData } from "../../categories/models/category.types";
import { createCategorySchema } from "../schema";





// Estilos reduzidos ao estritamente necessário
const CategoryVariants = tv({
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

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isSubmitLoading?: boolean;
  submitError?: Error | null;
}

export default function CategoryForm({
  category,
  onSubmit,
  isSubmitLoading,
  submitError,
}: CategoryFormProps) {
  const navigate = useNavigate();
  const { wrapper, formArea, sectionTitle, actions, cancelBtn } =
    CategoryVariants();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name || "",
    },
  });

  const handleFormSubmit: SubmitHandler<CategoryFormData> = async (data) => {
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
            {category ? "Editar Categoria" : "Nova Categoria"}
          </Text>
        </div>

        <InputText
          placeholder="Nome da categoria"
          {...register("name")}
          error={errors.name?.message}
        />

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
