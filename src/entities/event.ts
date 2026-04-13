import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category";
import { User } from "./user";

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({ type: "timestamp" })
    start_date!: Date;

    @Column()
    location!: string;

    @Column({ type: "int" })
    total_capacity!: number;

    @Column({ type: "int" })
    available_capacity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number;

    @Column({ type: "varchar", nullable: true })
    banner_url!: string;

    @ManyToOne(() => User, (user) => user.events)
    organizer!: User;

    @ManyToMany(() => Category)
    @JoinTable()
    categories!: Category[];
}
