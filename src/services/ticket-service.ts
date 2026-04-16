import { ErrorMessages } from "../constants/messages";
import { AppDataSource } from "../data-source";
import { Event } from "../entities/event";
import { Ticket } from "../entities/ticket";
import { AppError, HttpStatus } from "../errors/AppError";
import { EventRepository } from "../repositories/event/event.repository";
import { TicketRepository } from "../repositories/ticket/ticket.repository";
import { UserRepository } from "../repositories/user/user.repository";

export class TicketService {
    constructor(
        private ticketRepository: TicketRepository,
        private eventRepository: EventRepository,
        private userRepository: UserRepository,
    ) {}

    async create(eventId: string, customerId: string, data?: Partial<Ticket>) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();

        try {
            const event = await queryRunner.manager.findOne(Event, {
                where: { id: eventId },
                lock: { mode: "pessimistic_write" },
            });
            if (!event) {
                throw new AppError(
                    ErrorMessages.NOT_FOUND("Evento"),
                    HttpStatus.NOT_FOUND,
                );
            }
            if (event.available_capacity <= 0) {
                throw new AppError("Ingressos esgotados!", HttpStatus.CONFLICT);
            }
            event.available_capacity -= 1;

            const ticket = queryRunner.manager.create(Ticket, {
                events: { id: eventId },
                customer: { id: customerId },
                ...data,
            });
            await queryRunner.manager.save(Ticket, ticket);

            await queryRunner.commitTransaction();
            return ticket;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
