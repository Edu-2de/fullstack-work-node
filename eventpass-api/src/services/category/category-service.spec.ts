import { AppError } from "../../errors/AppError";
import { FakeCategoryRepository } from "../../repositories/category/category.repository.fake";
import { CategoryService } from "./category-service";

const fakeEventRepository = {
    findByCategoryId: jest.fn().mockResolvedValue(false),
} as any;

describe("Category Service", () => {
    let fakeCategoryRepository: FakeCategoryRepository;
    let categoryService: CategoryService;

    beforeEach(() => {
        fakeCategoryRepository = new FakeCategoryRepository();
        categoryService = new CategoryService(
            fakeCategoryRepository as any,
            fakeEventRepository,
        );
    });

    describe("create", () => {
        it("deve ser possível criar uma nova categoria e ela deve ser normalizada", async () => {
            const categoryData = { name: "Tecnologia" };
            const category = await categoryService.create(categoryData);

            expect(category).toHaveProperty("id");
            expect(category.name).toBe("tecnologia");
        });

        it("nao deve ser possível criar uma categoria com nome duplicado", async () => {
            const categoryData = { name: "Games" };
            await categoryService.create(categoryData);

            await expect(
                categoryService.create(categoryData),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("findAll", () => {
        it("deve listar categorias com paginação e filtro", async () => {
            await categoryService.create({ name: "Música" });
            await categoryService.create({ name: "Tecnologia" });
            await categoryService.create({ name: "Teatro" });

            const result = await categoryService.findAll(1, 10, "te");

            expect(result.total_items).toBe(2);
            expect(result.current_page).toBe(1);
            expect(result.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: "tecnologia" }),
                    expect.objectContaining({ name: "teatro" }),
                ]),
            );
        });
    });

    describe("update", () => {
        it("deve ser possível atualizar o nome de uma categoria", async () => {
            const category = await categoryService.create({ name: "Esporte" });

            const updateCategory = await categoryService.update(category.id, {
                name: "Esportes Radicais",
            });

            expect(updateCategory?.name).toBe("esportes radicais");
        });

        it("nao deve ser possível atualizar se o ID nao existir", async () => {
            await expect(
                categoryService.update("id-falso", { name: "Teste" }),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("delete", () => {
        it("deve ser possível deletar uma categoria existente", async () => {
            const category = await categoryService.create({ name: "Moda" });

            await categoryService.delete(category.id);

            const result = await fakeCategoryRepository.findById(category.id);
            expect(result).toBeNull();
        });

        it("nao deve ser possível deletar uma categoria que esta vinculada a um evento", async () => {
            const category = await categoryService.create({ name: "Rock" });

            fakeEventRepository.findByCategoryId.mockResolvedValueOnce(true);

            await expect(
                categoryService.delete(category.id),
            ).rejects.toBeInstanceOf(AppError);
        });
    });
});
