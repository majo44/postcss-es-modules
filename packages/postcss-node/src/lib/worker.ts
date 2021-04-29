/* istanbul ignore file */
import postcss  from 'postcss';
import postcssrc from 'postcss-load-config';
import v8 from 'v8';
import { parentPort, workerData } from 'worker_threads';

const INT32_BYTES = 4;

let processOptions: ReturnType<typeof postcssrc.sync>['options'];
let processor: ReturnType<typeof postcss>;

parentPort?.on('message', async (message) => {
    let data: { css?: string, ex?: any };
    const {code, filename, messageBuffer} = message;
    try {
        if (!processor) {
            const {plugins, options} = postcssrc.sync({});
            processOptions = options;
            processor = postcss(plugins);
        }
        const result = await processor.process(code, {
            ...(processOptions as any),
            from: filename
        });
        data = { css: result.css };
    } catch (ex) {
        data = { ex };
    }
    const buf = v8.serialize(data);
    buf.copy(Buffer.from(messageBuffer), INT32_BYTES);
    const semaphore = new Int32Array(messageBuffer);
    await Atomics.store(semaphore, 0, buf.length);
    Atomics.notify(semaphore, 0)
});

const workerReady = async () => {
    const { sharedBuffer } = workerData;
    const semaphore = new Int32Array(sharedBuffer)
    await Atomics.store(semaphore, 0, 0);
    Atomics.notify(semaphore, 0)
}

workerReady();
