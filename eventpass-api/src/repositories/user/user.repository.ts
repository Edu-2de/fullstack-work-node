import { FindOptionsWhere, ILike, IsNull, Not, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(User);
    }

    async create(data: Partial<User>): Promise<User> {
        const user = this.ormRepository.create(data);
        await this.ormRepository.save(user);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.ormRepository.findOne({
            where: { email },
            relations: {
                events: true,
            },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.ormRepository.findOne({
            where: { id },
        });
    }

    async findAll(page: number, limit: number, search?: string) {
        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const where: FindOptionsWhere<User> = {};

        if (search) {
            where.name = ILike(`%${search}%`);
        }

        const [users, total] = await this.ormRepository.findAndCount({
            where: where,
            skip: skip,
            take: safeLimit,
            order: {
                created_at: "DESC",
            },
        });

        return {
            data: users,
            total_items: total,
            current_page: safePage,
            total_pages: Math.ceil(total / safeLimit),
        };
    }

    async findByEmailForLogin(email: string): Promise<User | null> {
        return this.ormRepository.findOne({
            where: { email },
            select: [
                "id",
                "name",
                "email",
                "password_encrypted", //Password return for login
                "role",
            ],
        });
    }

    async findAllDeleted(page: number, limit: number) {
        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const [users, total] = await this.ormRepository.findAndCount({
            where: {
                deleted_at: Not(IsNull()),
            },
            skip: skip,
            take: safeLimit,
            withDeleted: true,
            order: {
                created_at: "DESC",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                update_at: true,
                deleted_at: true,
            },
        });
        return {
            data: users,
            total_items: total,
            current_page: safePage,
            total_pages: Math.ceil(total / safeLimit),
        };
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const user = await this.ormRepository.findOne({ where: { id } });
        if (!user) {
            return null;
        }
        //MERGE: overwrites only what comes from the data
        this.ormRepository.merge(user, data);
        const updatedUser = await this.ormRepository.save(user);
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
