import { TransactionType, UserType } from "../entity/Transaction";
import { LoopOptions } from "../loops/BaseLoop";

export class ApplicationArgsParser {

    public static parse(): LoopOptions {
        const args = process.argv.join()
        const options = {} as LoopOptions
        options.truncate = args.includes('trun')
        options.userId = args.includes('usera') ? UserType.UserA : options.userId
        options.userId = args.includes('userb') ? UserType.UserB : options.userId
        options.userId = args.includes('userc') ? UserType.UserC : options.userId
        options.userId = args.includes('userd') ? UserType.UserD : options.userId
        options.transactionTypes = args.includes('income') ? [...options.transactionTypes, TransactionType.INCOME] :  options.transactionTypes
        options.transactionTypes = args.includes('outcome') ? [...options.transactionTypes, TransactionType.OUTCOME] : options.transactionTypes

        return options
    }
}
