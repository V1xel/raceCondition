import * as readline from 'readline'
import { LoopOptions } from '../loops/BaseLoop'

export class StreamLogger {
    logTime(obj: string){
        process.stdout.write(obj)
    }
    logOptions(obj: LoopOptions){
        process.stdout.write(LoopOptions.toString(obj))
    }
    stream(obj, number: number) {
        readline.cursorTo(process.stdout, 0, 6* number)
        process.stdout.write(obj.toString())
    }
}