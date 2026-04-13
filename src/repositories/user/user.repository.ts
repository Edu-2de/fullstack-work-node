import { Repository } from "typeorm";
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
            relations: {
                events: {
                    categories: true,
                },
            },
        });
    }

    async findAll(): Promise<User[]> {
        return this.ormRepository.find();
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
        await this.ormRepository.delete(id);
    }
}
