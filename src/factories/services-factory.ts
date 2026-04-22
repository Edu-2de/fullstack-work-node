import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { UserRepository } from "../repositories/user/user.repository";

import { AuthService } from "../services/auth-service";
import { CategoryService } from "../services/category-service";
import { EventService } from "../services/event-service";
import { UserService } from "../services/user-service";

import { AuthController } from "../controllers/AuthController";
import { CategoryController } from "../controllers/CategoryController";
import { EventController } from "../controllers/EventController";
import { TicketController } from "../controllers/TicketController";
import { UserController } from "../controllers/UserController";
import { TicketRepository } from "../repositories/ticket/ticket.repository";
import { TicketService } from "../services/ticket-service";

export const userRepository = new UserRepository();
export const eventRepository = new EventRepository();
export const categoryRepository = new CategoryRepository();
export const ticketRepository = new TicketRepository();

export const userService = new UserService(
    userRepository,
    eventRepository,
    ticketRepository,
);
export const eventService = new EventService(
    eventRepository,
    categoryRepository,
    ticketRepository,
);
export const categoryService = new CategoryService(
    categoryRepository,
    eventRepository,
);
export const authService = new AuthService(userRepository);
export const ticketService = new TicketService(
    ticketRepository,
    eventRepository,
);

export const userController = new UserController(userService);
export const eventController = new EventController(eventService);
export const categoryController = new CategoryController(categoryService);
export const authController = new AuthController(authService);
export const ticketController = new TicketController(ticketService);
