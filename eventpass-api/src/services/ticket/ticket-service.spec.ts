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
        it("should be able to buy a ticket", async () => {
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

        it("should not be able to buy a ticket for a past event", async () => {
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

        it("should not be able to buy a ticket if capacity is zero", async () => {
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
        it("should be able to validate a ticket", async () => {
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
            expect(usedTicket?.used_at).toBeDefined();
        });

        it("should not be able to validate a ticket from another event", async () => {
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
    });

    describe("cancelTicket", () => {
        it("should be able to cancel a valid ticket", async () => {
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
    });
});
