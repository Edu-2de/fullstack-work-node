import { CategoryController } from "../controllers/CategoryController";
import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { CategoryService } from "../services/category/category-service";

export class CategoryModuleFactory {
    private static controllerInstance: CategoryController;

    static getController(): CategoryController {
        if (!this.controllerInstance) {
            const categoryRepository = new CategoryRepository();
            const eventRepository = new EventRepository();
            const categoryService = new CategoryService(
                categoryRepository,
                eventRepository,
            );

            this.controllerInstance = new CategoryController(categoryService);
        }
        return this.controllerInstance;
    }
}
