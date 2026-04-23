import { FakeUserRepository } from "../../repositories/user/user.repository.fake";
import { UserService } from "./user-service";

const fakeEventRepository = {
    findByOrganizerId: jest.fn().mockResolvedValue(false),
} as any;

const fakeTicketRepository = {
    findByUserId: jest.fn().mockResolvedValue(false),
} as any;

describe("User service", () => {
    let fakeUserRepository: FakeUserRepository;
    let userService: UserService;

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
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
    });
});
