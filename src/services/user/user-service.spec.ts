import { AppError } from "../../errors/AppError";
import { FakeUserRepository } from "../../repositories/user/user.repository.fake";
import { UserService } from "./user-service";

const fakeEventRepository = {} as any;

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

    describe("findById", () => {
        it("deve ser possível encontrar um usuário pelo id", async () => {
            const user = await userService.create({
                name: "Clark",
                email: "clark@krypton.com",
                password_encrypted: "123456",
            });

            const foundUser = await userService.findById(user.id);

            expect(foundUser).toHaveProperty("id");
            expect(foundUser.id).toBe(user.id);
        });

        it("nao deve ser possível encontrar um usuário com id inexistente", async () => {
            await expect(
                userService.findById("id-inexistente"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("findAll", () => {
        it("deve ser possível listar todos os usuários", async () => {
            await userService.create({
                name: "User 1",
                email: "user1@email.com",
                password_encrypted: "123456",
            });

            await userService.create({
                name: "User 2",
                email: "user2@email.com",
                password_encrypted: "123456",
            });

            const result = await userService.findAll(1, 10);

            expect(result).toHaveProperty("data");
            expect(result.total_items).toBe(2);
            expect(result.data.length).toBe(2);
        });
    });

    describe("update", () => {
        it("deve ser possível atualizar os dados do usuário", async () => {
            const user = await userService.create({
                name: "Barry",
                email: "barry@starlabs.com",
                password_encrypted: "123456",
            });

            const updatedUser = await userService.update(user.id, {
                name: "Flash",
            });

            expect(updatedUser?.name).toBe("Flash");
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

        it("nao deve ser possível atualizar um usuário inexistente", async () => {
            await expect(
                userService.update("id-inexistente", { name: "Fantasma" }),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("updateProfile", () => {
        it("deve ser possível atualizar o perfil do usuário", async () => {
            const user = await userService.create({
                name: "Hal",
                email: "hal@lanterns.com",
                password_encrypted: "123456",
            });

            const updatedProfile = await userService.updateProfile(user.id, {
                name: "Green Lantern",
            });

            expect(updatedProfile?.name).toBe("Green Lantern");
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

        it("nao deve ser possível deletar um usuário inexistente", async () => {
            await expect(
                userService.delete("id-inexistente"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("findTickets", () => {
        it("deve ser possível buscar os ingressos de um usuário", async () => {
            const user = await userService.create({
                name: "Arthur",
                email: "arthur@atlantis.com",
                password_encrypted: "123456",
            });

            fakeTicketRepository.findByUserId.mockResolvedValueOnce({
                data: [{ id: "ticket-1" }, { id: "ticket-2" }],
                total_items: 2,
            });

            const result = await userService.findTickets(user.id, 1, 10);

            expect(result).toHaveProperty("data");
            expect(result.total_items).toBe(2);
            expect(result.data.length).toBe(2);
        });
    });
});
