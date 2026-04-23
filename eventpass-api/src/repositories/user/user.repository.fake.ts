import { User, UserRole } from "../../entities/user";
import { IUserRepository } from "./IUserRepository";

export class FakeUserRepository implements IUserRepository {
    private users: User[] = [];

    async create(data: Partial<User>): Promise<User> {
        const user = new User();

        Object.assign(user, {
            id: Math.random().toString(),
            name: data.name,
            email: data.email,
            password_encrypted: data.password_encrypted,
            role: data.role || UserRole.CUSTOMER,
        });

        this.users.push(user);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find((u) => u.email === email);
        return user || null;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find((u) => u.id === id);
        return user || null;
    }

    async findAll(page: number, limit: number, search?: string) {
        let filteredUsers = this.users;

        if (search) {
            filteredUsers = filteredUsers.filter((c) =>
                c.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
            );
        }

        const skip = (page - 1) * limit;

        const paginatedUsers = filteredUsers.slice(skip, skip + limit);

        return {
            data: paginatedUsers,
            total_items: filteredUsers.length,
            current_page: page,
            total_pages: Math.ceil(filteredUsers.length / limit),
        };
    }

    async findByEmailForLogin(email: string): Promise<User | null> {
        const user = this.users.find((u) => u.email === email);
        return user || null;
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            return null;
        }
        Object.assign(user, data);
        return user;
    }

    async findAllDeleted(page: number, limit: number) {
        let filteredUsers = this.users;
        filteredUsers = filteredUsers.filter((u) => u.deleted_at !== null);
        const skip = (page - 1) * limit;

        const paginatedUsers = filteredUsers.slice(skip, skip + limit);

        return {
            data: paginatedUsers,
            total_items: filteredUsers.length,
            current_page: page,
            total_pages: Math.ceil(filteredUsers.length / limit),
        };
    }

    async delete(id: string): Promise<void> {
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }
}
