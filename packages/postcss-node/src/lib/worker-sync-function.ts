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

    let worker: Worker | undefined;
    let terminateTimeout: any;
    return (inputData: P): R => {
        if (terminateTimeout) {
            clearTimeout(terminateTimeout);
        }
        if (!worker) {
            const initBuffer = new SharedArrayBuffer(bufferSize)
            const initSemaphore = new Int32Array(initBuffer);
            worker = workerInit(filename, { sharedBuffer: initBuffer });
            const initResponse = Atomics.wait(initSemaphore, 0, 0, 5000);
            /* istanbul ignore if */
            if (initResponse === 'timed-out') {
                throw 'Worker init timeout';
            }
        }
        const messageBuffer = new SharedArrayBuffer(bufferSize)
        const messageSemaphore = new Int32Array(messageBuffer);
        worker.postMessage({
            ...inputData,
            messageBuffer
        });
        const response = Atomics.wait(messageSemaphore, 0, 0, timeout);
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
        const length = messageSemaphore[0];
        return v8.deserialize(Buffer.from(messageBuffer, INT32_BYTES, length));
    }
}
