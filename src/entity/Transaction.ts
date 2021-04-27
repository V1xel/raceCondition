import {Entity, PrimaryGeneratedColumn, Column, VersionColumn} from "typeorm";

export enum TransactionType {
    INCOME = 1,
    OUTCOME = 2,
}

export enum UserType {
    UserA = 0,
    UserB = 1,
    UserC = 2,
    UserD = 3,
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    amount: number;

    @Column('integer')
    type: TransactionType;

    @Column({
        type:'integer',
        name: 'user_id',
    })
    userId: UserType;

    @VersionColumn()
    version: number;
}
