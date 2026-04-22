import { User } from "../../entities/user";

export interface IUserRepository {
    create(data: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(page: number, limit: number): any;
    findByEmailForLogin(email: string): Promise<User | null>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<void>;
}
