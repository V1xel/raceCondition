import { TransactionType, UserType } from "../entity/Transaction";
import { StreamLogger } from "../tools/StreamLogger";
import { TransactionFactory } from "../tools/TransactionFactory";
import { QueryFactory } from "../tools/QueryFactory";
import { getConnection } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import * as prettyHrtime from 'pretty-hrtime'

export class TransactionLoopStatistics {
    total: Counter = new Counter()
    successful: Counter = new Counter()
    serializationErrors: Counter = new Counter()
    insufficientFunds: Counter = new Counter()

    toString() {
        return `total: ${this.total.toString()}
successful: ${this.successful.toString()}
serializationErrors: ${this.serializationErrors.toString()}
insufficientFunds: ${this.insufficientFunds.toString()}\n`
    }
}

export class Counter {
    value: number = 0
    increment() {
        this.value++
    }
    toString() {
        return this.value.toString()
    }
}


export class LoopOptions {
    public silent: boolean
    public userId: UserType
    public transactionTypes: TransactionType[] = []
    public truncate: boolean
    public isolation: IsolationLevel

    public static toString(options: LoopOptions): string {
        return `options: userId: ${options.userId}, transactions: ${options.transactionTypes}, isolation: ${options.isolation}`
    }
}

export abstract class AbstractLoop {
    protected running: boolean = true
    private initilized: boolean = false
    protected readonly transactionLoopStatistics = new TransactionLoopStatistics()
    protected readonly logger = new StreamLogger()
    private readonly connection = getConnection()
    private readonly queryFactory = new QueryFactory()
    private readonly transactionFactory = new TransactionFactory(this.queryFactory)
    private loopStart
    constructor(public options: LoopOptions) { }

    public async init(): Promise<void> {
        if (!this.initilized) {
            this.logger.logOptions(this.options)
            await this.queryFactory.truncateTransactions(this.connection.manager)
            this.loopStart = process.hrtime();
        }
    }

    public async logTime(): Promise<void> {
        const loopEnd = process.hrtime(this.loopStart)
        this.logger.logTime(prettyHrtime(loopEnd))
    }

    public async tick(n): Promise<void> {
        const { userId, transactionTypes, isolation } = this.options
        const { serializationErrors, insufficientFunds, successful, total } = this.transactionLoopStatistics

        if (this.running) {
            try {
                total.increment()
                await this.connection.transaction(isolation, async (manager) => {
                    for (const transactionType of transactionTypes) {
                        await this.transactionFactory.createTransaction(manager, userId, transactionType, 100)
                    }
                })
                successful.increment()
            } catch (error) {
                if (error.message === 'Insufficient funds') {
                    insufficientFunds.increment()
                } else if (error.message === 'Limit reached') {
                    this.running = false
                } else {
                    serializationErrors.increment()
                }
            } finally {
                if (!this.options.silent) {
                    this.logger.stream(this.transactionLoopStatistics, n)
                }
            }
        }
    }

    public async cycle(n) {
        while (this.running) {
            await this.tick(n)
        }
    }
}