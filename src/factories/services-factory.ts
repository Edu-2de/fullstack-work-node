import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { UserRepository } from "../repositories/user/user.repository";

import { CategoryService } from "../services/category-service";
import { EventService } from "../services/event-service";
import { UserService } from "../services/user-service";

import { CategoryController } from "../controllers/CategoryController";
import { EventController } from "../controllers/EventController";
import { UserController } from "../controllers/UserController";

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

export const userController = new UserController(userService);
export const eventController = new EventController(eventService);
export const categoryController = new CategoryController(categoryService);
