import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

//TODO Crie a entidade de User

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    firstName!: string;

    @Column({ type: "varchar", length: 100 })
    lastName!: string;

    @Column({ type: "varchar", length: 100 })
    email!: string;

    @OneToMany(() => Post, (post: Post) => post.user)
    posts!: Post[];
}