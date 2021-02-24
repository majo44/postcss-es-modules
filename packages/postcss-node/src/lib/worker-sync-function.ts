import v8 from 'v8';
import { Worker } from "worker_threads";
import { workerInit } from './worker-init';

const INT32_BYTES = 4
const bufferSize = 64 * 1024;

/**
 * Creates sync function proxy.
 * @internal
 */
export function workerSyncFunction<P, R>(filename: string): (inputData: P) => R  {
    const sharedBuffer = new SharedArrayBuffer(bufferSize)
    const semaphore = new Int32Array(sharedBuffer);
    let worker: Worker | undefined;
    let terminateTimeout: any;
    return (inputData: P): R => {
        if (terminateTimeout) {
            clearTimeout(terminateTimeout);
        }
        if (!worker) {
            worker = workerInit(filename, { sharedBuffer });
        }
        worker.postMessage(inputData);
        Atomics.wait(semaphore, 0, 0)
        const length = semaphore[0];
        const data = v8.deserialize(Buffer.from(sharedBuffer, INT32_BYTES, length))
        terminateTimeout = setTimeout(() => {
            /* istanbul ignore else */
            if (worker) {
                worker.terminate()
                worker = undefined;
                terminateTimeout = undefined;
            }
        });
        return data
    }
}
