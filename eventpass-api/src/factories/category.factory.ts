import { CategoryController } from "../controllers/CategoryController";
import { CategoryService } from "../services/category/category-service";
import { RepositoryFactory } from "./repository.factory";

export class CategoryModuleFactory {
    private static controllerInstance: CategoryController;

    static getController(): CategoryController {
        if (!this.controllerInstance) {
            const categoryRepository =
                RepositoryFactory.getCategoryRepository();
            const eventRepository = RepositoryFactory.getEventRepository();
            const categoryService = new CategoryService(
                categoryRepository,
                eventRepository,
            );

            this.controllerInstance = new CategoryController(categoryService);
        }
        return this.controllerInstance;
    }
}
