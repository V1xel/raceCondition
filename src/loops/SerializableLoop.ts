import { AbstractLoop, LoopOptions } from "./BaseLoop";

export class SerializableLoop extends AbstractLoop {
    constructor(options: LoopOptions) { 
        super({
            ...options,
            isolation: "SERIALIZABLE"
        })
    }
}