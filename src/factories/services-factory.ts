import { CategoryRepository } from "../repositories/category/category.repository";
import { UserRepository } from "../repositories/user/user.repository";
import { CategoryService } from "../services/category-service";
import { UserService } from "../services/user-service";

export const userRepository = new UserRepository();
export const userService = new UserService(userRepository);

export const categoryRepository = new CategoryRepository();
export const categoryService = new CategoryService(categoryRepository);
