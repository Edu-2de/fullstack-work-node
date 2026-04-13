import { Request, Response } from "express";
import { ValidMessages } from "../constants/messages";
import { categoryService } from "../factories/services-factory";

//ZOD already validates the request data
export class CategoryController {
    async create(req: Request, res: Response) {
        const { name } = req.body;
        const category = await categoryService.create({
            name,
        });
        return res.status(201).json(category);
    }

    async findAll(req: Request, res: Response) {
        const categories = await categoryService.findAll();
        return res.status(201).json(categories);
    }

    async delete(req: Request, res: Response) {
        const categoryId = req.params.id as string;
        await categoryService.delete(categoryId);
        return res.status(201).json(ValidMessages.DELETED("Categoria"));
    }
}
