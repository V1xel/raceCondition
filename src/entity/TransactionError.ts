import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class TransactionError {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reason: string;
}
