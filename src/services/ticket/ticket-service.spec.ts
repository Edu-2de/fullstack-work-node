import { AppDataSource } from "../../data-source";
import { TicketStatus } from "../../entities/ticket";
import { AppError } from "../../errors/AppError";
import { FakeTicketRepository } from "../../repositories/ticket/ticket.repository.fake";
import { TicketService } from "./ticket-service";

jest.mock("../../data-source", () => ({
    AppDataSource: {
        createQueryRunner: jest.fn(),
    },
}));

describe("TicketService", () => {
    let fakeTicketRepository: FakeTicketRepository;
    let ticketService: TicketService;
    let mockQueryRunner: any;

    beforeEach(() => {
        fakeTicketRepository = new FakeTicketRepository();
        ticketService = new TicketService(fakeTicketRepository as any);
        jest.clearAllMocks();

        mockQueryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {
                findOne: jest.fn(),
                update: jest.fn(),
                create: jest.fn().mockImplementation((entity, data) => ({
                    id: "ticket-12345",
                    ...data,
                })),
                save: jest.fn(),
            },
        };

        (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(
            mockQueryRunner,
        );
    });

    describe("create", () => {
        it("deve ser possível comprar um ingresso", async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);

            mockQueryRunner.manager.findOne.mockResolvedValueOnce({
                id: "event-123",
                start_date: futureDate,
                available_capacity: 100,
            });

            const ticket = await ticketService.create("event-123", "user-123");

            expect(ticket).toHaveProperty("id");
            expect(ticket.events.id).toBe("event-123");
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it("nao deve ser possível comprar ingresso para um evento que nao existe", async () => {
            mockQueryRunner.manager.findOne.mockResolvedValueOnce(null);

            await expect(
                ticketService.create("event-false", "user-123"),
            ).rejects.toBeInstanceOf(AppError);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it("nao deve ser possível comprar ingresso para um evento que já ocorreu", async () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 10);

            mockQueryRunner.manager.findOne.mockResolvedValueOnce({
                id: "event-123",
                start_date: pastDate,
                available_capacity: 100,
            });

            await expect(
                ticketService.create("event-123", "user-123"),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("nao deve ser possível comprar ingresso se a capacidade estiver esgotada", async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);

            mockQueryRunner.manager.findOne.mockResolvedValueOnce({
                id: "event-123",
                start_date: futureDate,
                available_capacity: 0,
            });

            await expect(
                ticketService.create("event-123", "user-123"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("useTicket", () => {
        it("deve ser possível validar o uso de um ingresso", async () => {
            const ticket = await fakeTicketRepository.createMock({
                events: { id: "event-1", organizer: { id: "org-1" } } as any,
                customer: { id: "user-1" } as any,
            });

            const usedTicket = await ticketService.useTicket(
                ticket.id,
                "org-1",
                "organizer",
                "event-1",
            );

            expect(usedTicket?.status).toBe(TicketStatus.USED);
        });

        it("nao deve ser possível validar se o ticket pertencer a outro evento", async () => {
            const ticket = await fakeTicketRepository.createMock({
                events: { id: "event-1", organizer: { id: "org-1" } } as any,
            });

            await expect(
                ticketService.useTicket(
                    ticket.id,
                    "org-1",
                    "organizer",
                    "event-2",
                ),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("nao deve ser possível validar se o usuário nao for o organizador do evento ou admin", async () => {
            const ticket = await fakeTicketRepository.createMock({
                events: { id: "event-1", organizer: { id: "org-1" } } as any,
            });

            await expect(
                ticketService.useTicket(
                    ticket.id,
                    "hacker",
                    "customer",
                    "event-1",
                ),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("nao deve ser possível validar um ingresso que ja foi usado ou cancelado", async () => {
            const ticket = await fakeTicketRepository.createMock({
                events: { id: "event-1", organizer: { id: "org-1" } } as any,
                status: TicketStatus.CANCELLED,
            });

            await expect(
                ticketService.useTicket(
                    ticket.id,
                    "org-1",
                    "organizer",
                    "event-1",
                ),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("cancelTicket", () => {
        it("deve ser possível cancelar um ingresso válido", async () => {
            const ticket = await fakeTicketRepository.createMock({
                events: { id: "event-1", organizer: { id: "org-1" } } as any,
                customer: { id: "customer-1" } as any,
            });

            mockQueryRunner.manager.findOne.mockResolvedValueOnce({
                id: "event-1",
                available_capacity: 50,
            });

            const canceledTicket = await ticketService.cancelTicket(
                ticket.id,
                "customer-1",
                "customer",
            );

            expect(canceledTicket?.status).toBe(TicketStatus.CANCELLED);
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it("nao deve ser possível cancelar o ingresso de outra pessoa", async () => {
            const ticket = await fakeTicketRepository.createMock({
                customer: { id: "customer-1" } as any,
            });

            await expect(
                ticketService.cancelTicket(ticket.id, "hacker-1", "customer"),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("nao deve ser possível cancelar um ingresso que já foi usado", async () => {
            const ticket = await fakeTicketRepository.createMock({
                customer: { id: "customer-1" } as any,
                status: TicketStatus.USED,
            });

            await expect(
                ticketService.cancelTicket(ticket.id, "customer-1", "customer"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });
});
