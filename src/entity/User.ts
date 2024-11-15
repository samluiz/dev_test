import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number | null;

    @Column({ type: "varchar", length: 100 })
    firstName!: string;

    @Column({ type: "varchar", length: 100 })
    lastName!: string;

    @Column({ type: "varchar", length: 100 })
    email!: string;

    @OneToMany(() => Post, (post: Post) => post.user)
    posts!: Post[];
}