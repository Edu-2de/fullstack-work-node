import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { UserRepository } from "../repositories/user/user.repository";
import { CategoryService } from "../services/category-service";
import { EventService } from "../services/event-service";
import { UserService } from "../services/user-service";

export const userRepository = new UserRepository();
export const eventRepository = new EventRepository();
export const categoryRepository = new CategoryRepository();

export const userService = new UserService(userRepository);

export const eventService = new EventService(
    eventRepository,
    userRepository,
    categoryRepository,
);

export const categoryService = new CategoryService(
    categoryRepository,
    eventRepository,
);
