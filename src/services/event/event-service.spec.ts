import { AppError } from "../../errors/AppError";
import { FakeEventRepository } from "../../repositories/event/event.repository.fake";
import { EventService } from "./event-service";

const fakeCategoryRepository = {
    findByNames: jest.fn().mockResolvedValue([{ id: "id-rock", name: "Rock" }]),
} as any;

const fakeTicketRepository = {
    findByEventId: jest.fn().mockResolvedValue({ total_items: 0 }),
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
        it("deve ser possível criar um evento", async () => {
            const organizerId = "id12345678";
            const requestedCategories = ["Rock"];

            const eventData = {
                title: "Show de Rock",
                description: "Um show ao ar livre",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
                total_capacity: 100,
                price: 10.5,
                banner_url: "Teste.png",
            };

            const event = await eventService.create(
                organizerId,
                requestedCategories,
                eventData,
            );

            expect(event).toHaveProperty("id");
            expect(event.title).toBe("Show de Rock");
            expect(event.available_capacity).toBe(100);
            expect(event.organizer.id).toBe(organizerId);
        });

        it("nao deve ser possível criar um evento com categorias que nao estão cadastradas", async () => {
            fakeCategoryRepository.findByNames.mockResolvedValueOnce([]);
            const organizerId = "id12345678";
            const requestedCategories = ["TESTE"];

            const eventData = {
                title: "Show de Rock",
                description: "Um show ao ar livre",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
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
        it("deve ser possível encontrar um evento pelo id", async () => {
            const event = await eventService.create("id12345678", ["Rock"], {
                title: "Show de Rock",
                description: "Um show ao ar livre",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
                total_capacity: 100,
                price: 10.5,
            });

            const foundEvent = await eventService.findById(event.id);

            expect(foundEvent).toHaveProperty("id");
            expect(foundEvent.id).toBe(event.id);
        });

        it("nao deve ser possível encontrar um evento com id inexistente", async () => {
            await expect(
                eventService.findById("id-inexistente"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });

    describe("findAll", () => {
        it("deve ser possível listar todos os eventos", async () => {
            await eventService.create("id12345678", ["Rock"], {
                title: "Show de Rock 1",
                description: "Um show ao ar livre",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
                total_capacity: 100,
                price: 10.5,
            });

            await eventService.create("id12345678", ["Rock"], {
                title: "Show de Rock 2",
                description: "Outro show ao ar livre",
                start_date: new Date("2026-06-26T20:00:00"),
                location: "Estadio",
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
        it("deve ser possível fazer o update do evento", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Show de Rock",
                description: "Um show ao ar livre",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
                total_capacity: 100,
                price: 10.5,
            });

            fakeCategoryRepository.findByNames.mockResolvedValueOnce([
                { id: "id-tech", name: "Tecnologia" },
            ]);

            const updatedEvent = await eventService.update(
                event.id,
                organizerId,
                "organizer",
                ["Tecnologia"],
                {
                    title: "Novo Titulo",
                },
            );

            expect(updatedEvent?.title).toBe("Novo Titulo");
            expect(updatedEvent?.categories[0].name).toBe("Tecnologia");
        });

        it("nao deve ser possível atualizar um evento se o usuário nao for o organizador real", async () => {
            const event = await eventService.create(
                "organizador-legitimo",
                ["Rock"],
                {
                    title: "Show de Rock",
                    description: "Um show ao ar livre",
                    start_date: new Date("2026-05-26T20:00:00"),
                    location: "Campo Belo",
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
                        title: "Titulo Hackeado",
                    },
                ),
            ).rejects.toBeInstanceOf(AppError);
        });

        it("nao deve ser possível atualizar a capacidade disponível para um valor maior que a total", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Show de Rock",
                description: "Um show ao ar livre",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
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

    describe("delete", () => {
        it("deve ser possível deletar um evento (Soft Delete)", async () => {
            const organizerId = "id12345678";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Show de Rock",
                description: "Um show",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
                total_capacity: 100,
                price: 10.5,
            });

            await eventService.delete(event.id, organizerId, "organizer");

            const deletedEvent = await fakeEventRepository.findById(event.id);
            expect(deletedEvent).toBeNull();
        });

        it("nao deve ser possível deletar um evento se o usuário nao for o organizador real", async () => {
            const organizerId = "organizador-legitimo-123";
            const hackerId = "hacker-malicioso-999";

            const event = await eventService.create(organizerId, ["Rock"], {
                title: "Show de Rock",
                description: "Um show ao ar livre",
                start_date: new Date("2026-05-26T20:00:00"),
                location: "Campo Belo",
                total_capacity: 100,
                price: 10.5,
            });

            await expect(
                eventService.delete(event.id, hackerId, "customer"),
            ).rejects.toBeInstanceOf(AppError);
        });
    });
});
