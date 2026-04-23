import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event";
import { User } from "./user";

export enum TicketStatus {
    VALID = "valid",
    CANCELLED = "cancelled",
    USED = "used",
}

@Entity("tickets")
export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Event)
    events!: Event;

    @ManyToOne(() => User)
    customer!: User;

    @CreateDateColumn()
    purchase_date!: Date;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: TicketStatus.VALID,
    })
    status!: TicketStatus;

    @Column({ nullable: true })
    used_at!: Date;
}
