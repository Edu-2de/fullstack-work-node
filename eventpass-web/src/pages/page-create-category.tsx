import { useNavigate } from "react-router-dom";
import MainContent from "../components/main-content";
import CategoryForm from "../features/categories/components/CategoryForm";
import { useCreateCategory } from "../features/categories/hooks/useCreateCategory";
import type { CategoryFormData } from "../features/categories/models/category.types";


export default function PageCreateCategory() {
    const navigate = useNavigate();

    const { createCategory } = useCreateCategory();

    const handleSubmit = async (data: CategoryFormData) => {
        try {
            await createCategory({ name: data.name });
            console.log("Categoria criada com sucesso.");
            alert("Categoria criada com sucesso.");
            navigate("/");
        } catch (error) {

            console.error("Falha na criação da categoria.", error);
        }
    };

    return (
        <MainContent>
            <div className="w-full flex flex-col gap-8">

                <CategoryForm onSubmit={handleSubmit} />
            </div>
        </MainContent>
    );
}
