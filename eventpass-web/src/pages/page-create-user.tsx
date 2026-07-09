import { useNavigate } from "react-router-dom";
import MainContent from "../components/main-content";
import UserForm from "../features/auth/components/RegisterByAdminForm";
import { useCreateUser } from "../features/auth/hooks/useCreateUser"; // Ajuste o caminho
import type { RegisterByAdminFormData } from "../features/auth/models/auth.types";

export default function PageCreateUser() {
    const navigate = useNavigate();
    const { createUser, isCreating, createError } = useCreateUser();

    const handleSubmit = async (data: RegisterByAdminFormData) => {
        try {
            await createUser(data);
            alert("Usuário criado com sucesso!");
            navigate("/");
        } catch (error) {
            console.error("Falha na criação do usuário.", error);
        }
    };

    return (
        <MainContent>
            <div className="w-full flex flex-col gap-8">
                <UserForm
                    onSubmit={handleSubmit}
                    isSubmitLoading={isCreating}
                    submitError={createError}
                />
            </div>
        </MainContent>
    );
}
