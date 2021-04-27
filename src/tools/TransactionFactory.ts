import { EntityManager } from "typeorm"
import { TransactionType, UserType } from "../entity/Transaction"
import { QueryFactory } from "./QueryFactory"

export class TransactionFactory {
    constructor(private readonly queryFactory: QueryFactory){ }

    public async createTransaction(manager:EntityManager, userId: UserType, type: TransactionType, amount: number) {
        const { income, outcome } = await this.queryFactory.getUserBalance(manager, userId)
        
       // if (type === TransactionType.OUTCOME && (income - outcome + amount < 0)) {
       //     throw new Error('Insufficient funds')
       // }

        if (type === TransactionType.OUTCOME && (outcome > 50000)) {
            throw new Error('Limit reached')
        }

        this.queryFactory.insertUserTransaction(manager, userId, type, amount)
    }

    public async createTransactionPessimisticRead(manager:EntityManager, userId: UserType, type: TransactionType, amount: number) {
        const { income, outcome } = await this.queryFactory.getUserBalancePessimisticRead(manager,userId)

        if (type === TransactionType.OUTCOME && (income - outcome + amount < 0)) {
            throw new Error('Insufficient funds')
        }
    }

    
}