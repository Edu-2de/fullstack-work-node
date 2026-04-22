import { Request, Response } from "express";
import { ValidMessages } from "../constants/messages";
import { CategoryService } from "../services/category-service";

//ZOD already validates the request data
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    async create(req: Request, res: Response) {
        const { name } = req.body;
        const category = await this.categoryService.create({
            name,
        });
        const { id, ...restOfCategory } = category;

        return res.status(201).json({
            id: id,
            ...restOfCategory,
        });
    }

    async findAll(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const categories = await this.categoryService.findAll(page, limit);
        return res.status(201).json(categories);
    }

    async update(req: Request, res: Response) {
        const categoryId = req.params.id as string;
        const data = req.body;

        const category = await this.categoryService.update(categoryId, data);
        return res.status(201).json(category);
    }

    async delete(req: Request, res: Response) {
        const categoryId = req.params.id as string;
        await this.categoryService.delete(categoryId);
        return res.status(201).json(ValidMessages.DELETED("Categoria"));
    }
}
