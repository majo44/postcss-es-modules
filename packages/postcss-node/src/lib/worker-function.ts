/* istanbul ignore file */
import v8 from 'v8';
import { workerData } from 'worker_threads';

const INT32_BYTES = 4

/**
 * Executes function in worker.
 * @internal
 */
export async function workerFunction(workerAsyncFn: () => Promise<any> ): Promise<void> {
    const { sharedBuffer } = workerData
    const data = await workerAsyncFn();
    const buf = v8.serialize(data)
    buf.copy(Buffer.from(sharedBuffer), INT32_BYTES)
    const semaphore = new Int32Array(sharedBuffer)
    await Atomics.store(semaphore, 0, buf.length)
    Atomics.notify(semaphore, 0)
}

