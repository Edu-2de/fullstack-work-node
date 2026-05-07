import { EventStatus } from "../../entities/event";
import { AppError } from "../../errors/AppError";
import { FakeEventRepository } from "../../repositories/event/event.repository.fake";
import { EventService } from "./event-service";

const fakeCategoryRepository = {
    findByNames: jest.fn().mockResolvedValue([{ id: "id-rock", name: "rock" }]),
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
                { id: "id-tech", name: "technology" },
            ]);

            const updatedEvent = await eventService.update(
                event.id,
                organizerId,
                "organizer",
                ["Technology"],
                { title: "New Title" },
            );

            expect(updatedEvent?.title).toBe("New Title");
            expect(updatedEvent?.categories[0].name).toBe("technology");
        });

        it("should not be able to update total capacity below already sold tickets", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                start_date: new Date("2026-05-26T20:00:00"),
                total_capacity: 100,
                price: 10.5,
            });

            event.available_capacity = 20;
            await fakeEventRepository.update(event.id, event.categories, event);

            fakeCategoryRepository.findByNames.mockResolvedValueOnce([
                { id: "id-rock", name: "rock" },
            ]);

            await expect(
                eventService.update(
                    event.id,
                    organizerId,
                    "organizer",
                    ["Rock"],
                    { total_capacity: 50 },
                ),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("cancel and delete", () => {
        it("should be able to cancel an event and cascade to tickets", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                start_date: new Date("2026-05-26T20:00:00"),
                total_capacity: 100,
            });

            await eventService.cancel(event.id, organizerId, "organizer");

            const canceledEvent = await fakeEventRepository.findById(event.id);

            expect(canceledEvent?.status).toBe(EventStatus.CANCELLED);
            expect(
                fakeTicketRepository.cancelAllTicketsByEventId,
            ).toHaveBeenCalledWith(event.id);
        });

        it("should be able to soft delete an event with no sold tickets", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Rock Concert",
                start_date: new Date("2026-05-26T20:00:00"),
                total_capacity: 100,
            });

            fakeTicketRepository.findByEventId.mockResolvedValueOnce({
                total_items: 0,
            });

            await eventService.delete(event.id, organizerId, "organizer");

            const deletedEvent = await fakeEventRepository.findById(event.id);
            expect(deletedEvent).toBeNull();
        });
    });
});
