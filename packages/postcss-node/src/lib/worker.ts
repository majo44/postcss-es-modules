/* istanbul ignore file */
import postcss, { ProcessOptions, Processor } from 'postcss';
import postcssrc from 'postcss-load-config';
import v8 from 'v8';
import { parentPort, workerData } from 'worker_threads';

const INT32_BYTES = 4;

let processOptions: ProcessOptions;
let processor: Processor;

parentPort?.on('message', async (message) => {
    const {sharedBuffer} = workerData;
    let data: { css?: string, ex?: any };
    try {
        const {code, filename} = message;
        if (!processor) {
            const {plugins, options} = postcssrc.sync({});
            processOptions = options;
            processor = postcss(plugins);
        }
        const result = await processor.process(code, {
            ...processOptions,
            from: filename
        });
        data = { css: result.css };
    } catch (ex) {
        data = { ex };
    }
    const buf = v8.serialize(data);
    buf.copy(Buffer.from(sharedBuffer), INT32_BYTES)
    const semaphore = new Int32Array(sharedBuffer)
    await Atomics.store(semaphore, 0, buf.length)
    Atomics.notify(semaphore, 0)
});

const workerReady = async () => {
    const { sharedBuffer } = workerData;
    const semaphore = new Int32Array(sharedBuffer)
    await Atomics.store(semaphore, 0, 0);
    Atomics.notify(semaphore, 0)
}

workerReady();
