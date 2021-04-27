import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApplicationArgsParser } from "./tools/ApplicationArgsParser";
import { ReadCommitedLoop } from "./loops/ReadCommitedLoop";
import { SerializableLoop } from "./loops/SerializableLoop";

const run = async () => {
    await createConnection()

    const options = ApplicationArgsParser.parse()

    //const loopFactoryReadCommitedLoop = async () => {
        const loop = new ReadCommitedLoop(options)
        await loop.init()
        await loop.cycle(1)
        await loop.logTime()
    //}

  //  await Promise.all([loopFactoryReadCommitedLoop(), loopFactoryReadCommitedLoop()])

    // const loopFactorySerializableLoop = async () => {
    //     const loop = new SerializableLoop(options)
    //     await loop.init()
    //     await loop.cycle(2)
    //     await loop.logTime()
    // }

    // await Promise.all([loopFactorySerializableLoop(), loopFactorySerializableLoop()])
}

run()
