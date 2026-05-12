import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { TicketRepository } from "../repositories/ticket/ticket.repository";
import { UserRepository } from "../repositories/user/user.repository";

export class RepositoryFactory {
    private static userRepositoryInstance: UserRepository;
    private static eventRepositoryInstance: EventRepository;
    private static ticketRepositoryInstance: TicketRepository;
    private static categoryRepositoryInstance: CategoryRepository;

    static getUserRepository(): UserRepository {
        if (!this.userRepositoryInstance) {
            this.userRepositoryInstance = new UserRepository();
        }
        return this.userRepositoryInstance;
    }

    static getEventRepository(): EventRepository {
        if (!this.eventRepositoryInstance) {
            this.eventRepositoryInstance = new EventRepository();
        }
        return this.eventRepositoryInstance;
    }

    static getTicketRepository(): TicketRepository {
        if (!this.ticketRepositoryInstance) {
            this.ticketRepositoryInstance = new TicketRepository();
        }
        return this.ticketRepositoryInstance;
    }

    static getCategoryRepository(): CategoryRepository {
        if (!this.categoryRepositoryInstance) {
            this.categoryRepositoryInstance = new CategoryRepository();
        }
        return this.categoryRepositoryInstance;
    }
}
