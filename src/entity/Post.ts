import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number | null;

    @Column({ type: "varchar", length: 100 })
    title!: string;

    @Column({ type: "varchar", length: 100 })
    description!: string;

    @ManyToOne(() => User, (user: User) => user.posts)
    user!: User;
}