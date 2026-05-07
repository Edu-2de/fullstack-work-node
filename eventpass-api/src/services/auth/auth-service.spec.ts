import bcrypt from "bcrypt";
import { UserRole } from "../../entities/user";
import { AppError } from "../../errors/AppError";
import { FakeUserRepository } from "../../repositories/user/user.repository.fake";
import { AuthService } from "./auth-service";

describe("AuthService", () => {
    let fakeUserRepository: FakeUserRepository;
    let authService: AuthService;

    beforeAll(() => {
        process.env.JWT_SECRET = "secret_para_testes";
    });

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        authService = new AuthService(fakeUserRepository as any);
    });

    describe("login", () => {
        it("deve ser possível fazer login com credenciais válidas", async () => {
            const password = "password123";
            const hashedPassword = await bcrypt.hash(password, 10);

            await fakeUserRepository.create({
                name: "Bruce Wayne",
                email: "batman@wayne.com",
                password_encrypted: hashedPassword,
                role: UserRole.CUSTOMER,
            });

            const response = await authService.login(
                "batman@wayne.com",
                "password123",
            );

            expect(response).toHaveProperty("token");
            expect(response.user).toHaveProperty("id");
            expect(response.user.email).toBe("batman@wayne.com");
            expect(response.user.role).toBe(UserRole.CUSTOMER);
        });

        it("nao deve ser possível fazer login com um email inexistente", async () => {
            await expect(
                authService.login("ghost@nowhere.com", "123456"),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("nao deve ser possível fazer login com uma senha incorreta", async () => {
            const password = "password123";
            const hashedPassword = await bcrypt.hash(password, 10);

            await fakeUserRepository.create({
                name: "Clark Kent",
                email: "clark@krypton.com",
                password_encrypted: hashedPassword,
                role: UserRole.CUSTOMER,
            });

            await expect(
                authService.login("clark@krypton.com", "wrongpassword"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });
});
