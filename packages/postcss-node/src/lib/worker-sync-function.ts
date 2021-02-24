import v8 from 'v8';
import { Worker } from "worker_threads";
import { workerInit } from './worker-init';

const INT32_BYTES = 4
const bufferSize = 64 * 1024;

/**
 * Creates sync function proxy.
 * @internal
 */
export function workerSyncFunction<P, R>(filename: string, timeout: number): (inputData: P) => R  {
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
            const initResponse = Atomics.wait(semaphore, 0, 0, 5000);
            /* istanbul ignore if */
            if (initResponse === 'timed-out') {
                throw 'Worker init timeout';
            }
        }
        worker.postMessage(inputData);
        const response = Atomics.wait(semaphore, 0, 0, timeout);
        terminateTimeout = setTimeout(() => {
            /* istanbul ignore else */
            if (worker) {
                worker.terminate()
                worker = undefined;
                terminateTimeout = undefined;
            }
        });
        /* istanbul ignore if */
        if (response === 'timed-out') {
            throw 'Worker timeout';
        }
        const length = semaphore[0];
        return v8.deserialize(Buffer.from(sharedBuffer, INT32_BYTES, length));
    }
}
