import { EntityManager, getConnection } from "typeorm";
import { Transaction, TransactionType, UserType } from "../entity/Transaction";

export class QueryFactory {
    public async getUserBalance(manager: EntityManager, userId: UserType): Promise<{ income: number, outcome: number }> {
        let [{ income }] = await manager.query(`SELECT SUM(amount) as income FROM transaction WHERE transaction.user_id=${userId} AND transaction.type = 1`)
        let [{ outcome }] = await manager.query(`SELECT SUM(amount) as outcome FROM transaction WHERE transaction.user_id=${userId} AND transaction.type = 2`)

        if (!income) {
            income = 0
        }
        if (!outcome) {
            outcome = 0
        }
        return { income, outcome }
    }

    public async getUserBalancePessimisticRead(manager: EntityManager, userId: UserType): Promise<{ income: number, outcome: number }> {
        const [{ incomeArray }] = await manager.query(`SELECT transaction.amount as incomeArray FROM transaction WHERE transaction.user_id=${userId} AND transaction.type = 1 FOR UPDATE`)
        const [{ outcomeArray }] = await manager.query(`SELECT transaction.amount as outcomeArray FROM transaction WHERE transaction.user_id=${userId} AND transaction.type = 2 FOR UPDATE`)

        const income = incomeArray.reduce((a, b) => a + b, 0)
        const outcome = outcomeArray.reduce((a, b) => a + b, 0)

        return { income, outcome }
    }

    public async insertUserTransaction(manager: EntityManager, userId: UserType, type: TransactionType, amount: number): Promise<void> {
        const transaction = new Transaction()
        transaction.amount = amount
        transaction.type = type
        transaction.userId = userId

        await manager.save(transaction)
    }

    public async truncateTransactions(manager: EntityManager): Promise<void>{
        await manager.query(`TRUNCATE TABLE transaction`)
    }
}