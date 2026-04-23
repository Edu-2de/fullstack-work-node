import { AppError } from "../../errors/AppError";
import { FakeUserRepository } from "../../repositories/user/user.repository.fake";
import { UserService } from "./user-service";

const fakeEventRepository = {
    findByOrganizerId: jest.fn().mockResolvedValue(false),
} as any;

const fakeTicketRepository = {
    findByUserId: jest.fn().mockResolvedValue({ data: [], total_items: 0 }),
} as any;

describe("UserService", () => {
    let fakeUserRepository: FakeUserRepository;
    let userService: UserService;

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        jest.clearAllMocks();

        userService = new UserService(
            fakeUserRepository as any,
            fakeEventRepository,
            fakeTicketRepository,
        );
    });

    describe("create", () => {
        it("deve ser possível registrar um usuário comum", async () => {
            const userData = {
                name: "Alex",
                email: "alex@gmail.com",
                password_encrypted: "password@123",
            };

            const user = await userService.create(userData);

            expect(user).toHaveProperty("id");
            expect(user.name).toBe("Alex");
            expect(user.role).toBe("customer");
            expect(user).not.toHaveProperty("password_encrypted");
        });

        it("deve criptografar a senha do usuário antes de salvar no banco", async () => {
            const userData = {
                name: "Bruce",
                email: "bruce@batcaverna.com",
                password_encrypted: "senhaSecreta123",
            };

            const user = await userService.create(userData);
            const userInDatabase = await fakeUserRepository.findById(user.id);

            expect(userInDatabase?.password_encrypted).not.toBe(
                "senhaSecreta123",
            );
            expect(userInDatabase?.password_encrypted).toBeDefined();
        });

        it("nao deve ser possível criar um usuário com um email duplicado", async () => {
            const userData = {
                name: "Tim",
                email: "tim@gmail.com",
                password_encrypted: "password@123",
            };

            await userService.create(userData);

            await expect(userService.create(userData)).rejects.toBeInstanceOf(
                AppError,
            );
        });
    });

    describe("update", () => {
        it("deve ser possível atualizar os dados do usuário", async () => {
            const user = await userService.create({
                name: "Clark",
                email: "clark@krypton.com",
                password_encrypted: "123456",
            });

            const updatedUser = await userService.update(user.id, {
                name: "Superman",
            });

            expect(updatedUser?.name).toBe("Superman");
        });

        it("nao deve ser possível atualizar para um email já em uso por outro usuário", async () => {
            await userService.create({
                name: "User 1",
                email: "primeiro@email.com",
                password_encrypted: "123456",
            });

            const user2 = await userService.create({
                name: "User 2",
                email: "segundo@email.com",
                password_encrypted: "123456",
            });

            await expect(
                userService.update(user2.id, { email: "primeiro@email.com" }),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("delete", () => {
        it("deve ser possível deletar um usuário (Soft Delete)", async () => {
            const user = await userService.create({
                name: "Diana",
                email: "diana@themyscira.com",
                password_encrypted: "123456",
            });

            await userService.delete(user.id);

            const deletedUser = await fakeUserRepository.findById(user.id);
            expect(deletedUser).toBeNull();
        });
    });
});
