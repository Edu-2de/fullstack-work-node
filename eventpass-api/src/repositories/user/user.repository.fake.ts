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
        const user = this.users.find((u) => u.email === email && !u.deleted_at);
        return user || null;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find((u) => u.id === id && !u.deleted_at);
        return user || null;
    }

    async findAll(page: number, limit: number, search?: string) {
        let filteredUsers = this.users.filter((u) => !u.deleted_at);

        if (search) {
            filteredUsers = filteredUsers.filter((c) =>
                c.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
            );
        }

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const paginatedUsers = filteredUsers.slice(skip, skip + safeLimit);

        return {
            data: paginatedUsers,
            total_items: filteredUsers.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredUsers.length / safeLimit),
        };
    }

    async findByEmailForLogin(email: string): Promise<User | null> {
        const user = this.users.find((u) => u.email === email && !u.deleted_at);
        return user || null;
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const user = this.users.find((u) => u.id === id && !u.deleted_at);
        if (!user) return null;

        Object.assign(user, data);
        return user;
    }

    async findAllDeleted(page: number, limit: number) {
        let filteredUsers = this.users.filter(
            (u) => u.deleted_at !== undefined && u.deleted_at !== null,
        );

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const paginatedUsers = filteredUsers.slice(skip, skip + safeLimit);

        return {
            data: paginatedUsers,
            total_items: filteredUsers.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredUsers.length / safeLimit),
        };
    }

    async delete(id: string): Promise<void> {
        const user = this.users.find((u) => u.id === id);
        if (user) {
            (user as any).deleted_at = new Date();
        }
    }
}
