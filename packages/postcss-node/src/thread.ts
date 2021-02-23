import v8 from 'v8';
import { Worker, workerData } from 'worker_threads';

const INT32_BYTES = 4

/**
 * Creates sync function proxy.
 * @internal
 */
export function createSyncFn<P, R>(filename: string, bufferSize = 64 * 1024): (inputData: P) => R  {
    const sharedBuffer = new SharedArrayBuffer(bufferSize)
    const semaphore = new Int32Array(sharedBuffer)
    return (inputData: P): R => {
        const worker = new Worker(filename, { workerData: { inputData, sharedBuffer }, execArgv: [] })
        worker.on('error', (e) => {
            throw e
        })
        Atomics.wait(semaphore, 0, 0)
        let length = semaphore[0]
        let didThrow = false
        if (length < 0) {
            didThrow = true
            length *= -1
        }
        const data = v8.deserialize(Buffer.from(sharedBuffer, INT32_BYTES, length))
        if (didThrow) {
            throw data
        }
        return data
    }
}

/**
 * Executes function in worker.
 * @internal
 */
export async function runAsWorker<P, R>(workerAsyncFn: (arg: P) => Promise<R> ): Promise<void> {
    const { inputData, sharedBuffer } = workerData
    let data,
        didThrow = false
    try {
        data = await workerAsyncFn(inputData)
    } catch (e) {
        data = e
        didThrow = true
    }
    notifyParent(sharedBuffer, data, didThrow)
}

function notifyParent(sharedBuffer: SharedArrayBuffer, data: any, didThrow: boolean) {
    const buf = v8.serialize(data)
    buf.copy(Buffer.from(sharedBuffer), INT32_BYTES)
    const semaphore = new Int32Array(sharedBuffer)
    Atomics.store(semaphore, 0, didThrow ? -buf.length : buf.length)
    Atomics.notify(semaphore, 0)
}
