import { EventStatus } from "../../entities/event";
import { AppError } from "../../errors/AppError";
import { FakeEventRepository } from "../../repositories/event/event.repository.fake";
import { EventService } from "./event-service";

const fakeCategoryRepository = {
    findByNames: jest.fn().mockResolvedValue([{ id: "id-rock", name: "Rock" }]),
} as any;

const fakeTicketRepository = {
    findByEventId: jest.fn().mockResolvedValue({ total_items: 0 }),
    cancelAllTicketsByEventId: jest.fn().mockResolvedValue(undefined),
} as any;

describe("EventService", () => {
    let fakeEventRepository: FakeEventRepository;
    let eventService: EventService;

    beforeEach(() => {
        fakeEventRepository = new FakeEventRepository();
        jest.clearAllMocks();

        eventService = new EventService(
            fakeEventRepository as any,
            fakeCategoryRepository,
            fakeTicketRepository,
        );
    });

    describe("create", () => {
        it("should be able to create an event", async () => {
            const organizerId = "id12345678";
            const requestedCategories = ["Rock"];

            const eventData = {
                title: "Rock Concert",
                description: "An outdoor rock concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
                banner_url: "Test.png",
            };

            const event = await eventService.create(
                organizerId,
                requestedCategories,
                eventData,
            );

            expect(event).toHaveProperty("id");
            expect(event.title).toBe("Rock Concert");
            expect(event.available_capacity).toBe(100);
            expect(event.organizer.id).toBe(organizerId);
            expect(event.status).toBe(EventStatus.PUBLISHED);
        });

        it("should not be able to create an event with unregistered categories", async () => {
            fakeCategoryRepository.findByNames.mockResolvedValueOnce([]);
            const organizerId = "id12345678";
            const requestedCategories = ["TEST"];

            const eventData = {
                title: "Rock Concert",
                description: "An outdoor rock concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            };

            await expect(
                eventService.create(
                    organizerId,
                    requestedCategories,
                    eventData,
                ),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("findById", () => {
        it("should be able to find an event by id", async () => {
            const event = await eventService.create("id12345678", ["Rock"], {
                title: "Rock Concert",
                description: "An outdoor rock concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            });

            const foundEvent = await eventService.findById(event.id);

            expect(foundEvent).toHaveProperty("id");
            expect(foundEvent.id).toBe(event.id);
        });

        it("should not be able to find a non-existing event", async () => {
            await expect(
                eventService.findById("non-existing-id"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("findAll", () => {
        it("should be able to list all events", async () => {
            await eventService.create("id12345678", ["Rock"], {
                title: "Rock Concert 1",
                description: "An outdoor rock concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            });

            await eventService.create("id12345678", ["Rock"], {
                title: "Rock Concert 2",
                description: "Another outdoor rock concert",
                start_date: new Date("2026-06-26T20:00:00"),
                location: "Stadium",
                total_capacity: 500,
                price: 50.0,
            });

            const result = await eventService.findAll(1, 10);

            expect(result).toHaveProperty("data");
            expect(result.total_items).toBe(2);
            expect(result.data.length).toBe(2);
        });
    });

    describe("update", () => {
        it("should be able to update an event", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                description: "An outdoor rock concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            });

            fakeCategoryRepository.findByNames.mockResolvedValueOnce([
                { id: "id-tech", name: "Technology" },
            ]);

            const updatedEvent = await eventService.update(
                event.id,
                organizerId,
                "organizer",
                ["Technology"],
                {
                    title: "New Title",
                },
            );

            expect(updatedEvent?.title).toBe("New Title");
            expect(updatedEvent?.categories[0].name).toBe("Technology");
        });

        it("should not be able to update if the user is not the real organizer", async () => {
            const event = await eventService.create(
                "legit-organizer",
                ["Rock"],
                {
                    title: "Rock Concert",
                    description: "An outdoor rock concert",
                    start_date: new Date("2026-05-26T20:00:00"),
                    location: "Central Park",
                    total_capacity: 100,
                    price: 10.5,
                },
            );

            await expect(
                eventService.update(
                    event.id,
                    "hacker-999",
                    "customer",
                    ["Rock"],
                    {
                        title: "Hacked Title",
                    },
                ),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("should not be able to update available capacity to a value greater than total capacity", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                description: "An outdoor rock concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            });

            fakeCategoryRepository.findByNames.mockResolvedValueOnce([
                { id: "id-rock", name: "Rock" },
            ]);

            await expect(
                eventService.update(
                    event.id,
                    organizerId,
                    "organizer",
                    ["Rock"],
                    { available_capacity: 500 },
                ),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("cancel", () => {
        it("should be able to cancel an event and cascade to tickets", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                description: "An outdoor rock concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            });

            await eventService.cancel(event.id, organizerId, "organizer");

            const canceledEvent = await fakeEventRepository.findById(event.id);

            expect(canceledEvent?.status).toBe(EventStatus.CANCELLED);
            expect(
                fakeTicketRepository.cancelAllTicketsByEventId,
            ).toHaveBeenCalledWith(event.id);
        });

        it("should not be able to cancel an event if the user is not the real organizer", async () => {
            const event = await eventService.create(
                "legit-organizer",
                ["Rock"],
                {
                    title: "Rock Concert",
                    description: "An outdoor rock concert",
                    start_date: new Date("2026-05-26T20:00:00"),
                    location: "Central Park",
                    total_capacity: 100,
                    price: 10.5,
                },
            );

            await expect(
                eventService.cancel(event.id, "hacker-999", "customer"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("delete", () => {
        it("should be able to soft delete an event with no sold tickets", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                description: "A concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            });

            // Simulamos que não há ingressos vendidos
            fakeTicketRepository.findByEventId.mockResolvedValueOnce({
                total_items: 0,
            });

            await eventService.delete(event.id, organizerId, "organizer");

            const deletedEvent = await fakeEventRepository.findById(event.id);
            expect(deletedEvent).toBeNull();
        });

        it("should not be able to delete an event that has sold tickets", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                description: "A concert",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Central Park",
                total_capacity: 100,
                price: 10.5,
            });

            // Simulamos que existem 5 ingressos já vendidos para este evento
            fakeTicketRepository.findByEventId.mockResolvedValueOnce({
                total_items: 5,
            });

            await expect(
                eventService.delete(event.id, organizerId, "organizer"),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("should not be able to delete an event if the user is not the real organizer", async () => {
            const event = await eventService.create(
                "legit-organizer",
                ["Rock"],
                {
                    title: "Rock Concert",
                    description: "An outdoor rock concert",
                    start_date: new Date("2026-05-26T20:00:00"),
                    location: "Central Park",
                    total_capacity: 100,
                    price: 10.5,
                },
            );

            await expect(
                eventService.delete(event.id, "hacker-999", "customer"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });
});
