import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Event } from "./event";

export enum UserRole {
    ORGANIZER = "organizer",
    CUSTOMER = "customer",
    ADMIN = "admin",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password_encrypted!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role!: UserRole;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    update_at!: Date;

    @OneToMany(() => Event, (event) => event.organizer)
    events!: Event[];

    @DeleteDateColumn()
    deleted_at!: Date;
}
