import { ErrorMessages } from "../constants/messages";
import { AppDataSource } from "../data-source";
import { Event } from "../entities/event";
import { Ticket, TicketStatus } from "../entities/ticket";
import { UserRole } from "../entities/user";
import { AppError, HttpStatus } from "../errors/AppError";
import { EventRepository } from "../repositories/event/event.repository";
import { TicketRepository } from "../repositories/ticket/ticket.repository";

export class TicketService {
    constructor(
        private ticketRepository: TicketRepository,
        private eventRepository: EventRepository,
    ) {}

    private async findTicketOrThrow(ticketId: string) {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Ticket"),
                HttpStatus.NOT_FOUND,
            );
        }
        return ticket;
    }

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

            if (new Date(event.start_date) < new Date()) {
                throw new AppError(
                    "Não é possível comprar ingressos para um evento que já ocorreu.",
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (event.available_capacity <= 0) {
                throw new AppError("Ingressos esgotados!", HttpStatus.CONFLICT);
            }
            const newAvailable_capacity = (event.available_capacity -= 1);
            await queryRunner.manager.update(Event, eventId, {
                available_capacity: newAvailable_capacity,
            });

            const ticket = queryRunner.manager.create(Ticket, {
                events: { id: eventId },
                customer: { id: customerId },
                data,
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

    async findById(id: string) {
        return await this.findTicketOrThrow(id);
    }

    async findAll() {
        return await this.ticketRepository.findAll();
    }

    async useTicket(
        id: string,
        userId: string,
        userRole: string,
        eventId: string,
    ) {
        const ticket = await this.findTicketOrThrow(id);

        if (ticket.events.id !== eventId) {
            throw new AppError(
                "Esse ticket não pertence a esse evento",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (
            userRole !== UserRole.ADMIN &&
            ticket.events.organizer.id !== userId
        ) {
            throw new AppError(
                "Você não tem permissão para validar ingressos deste evento.",
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (ticket.status !== TicketStatus.VALID) {
            throw new AppError(
                "Ticket inválido ou já processado",
                HttpStatus.CONFLICT,
            );
        }

        return await this.ticketRepository.update(id, {
            status: TicketStatus.USED,
        });
    }

    async cancelTicket(id: string, userId: string, userRole: string) {
        const ticket = await this.findTicketOrThrow(id);

        if (userRole !== UserRole.ADMIN && ticket.customer.id !== userId) {
            throw new AppError(
                ErrorMessages.UNAUTHORIZED(),
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (ticket.status !== TicketStatus.VALID) {
            throw new AppError(
                "Só é possível cancelar ingressos válidos",
                HttpStatus.CONFLICT,
            );
        }

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const event = await queryRunner.manager.findOne(Event, {
                where: { id: ticket.events.id },
                lock: { mode: "pessimistic_write" },
            });

            if (!event) {
                throw new AppError(
                    ErrorMessages.NOT_FOUND("Evento"),
                    HttpStatus.NOT_FOUND,
                );
            }

            event.available_capacity += 1;
            await queryRunner.manager.save(Event, event);

            ticket.status = TicketStatus.CANCELLED;
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
