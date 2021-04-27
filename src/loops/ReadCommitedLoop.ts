import { AbstractLoop, LoopOptions } from "./BaseLoop";

export class ReadCommitedLoop extends AbstractLoop {
    constructor(options: LoopOptions) { 
        super({
            ...options,
            isolation: "READ COMMITTED"
        })
    }
}