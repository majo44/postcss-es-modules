/* istanbul ignore file */
import {Worker} from "worker_threads";

/**
 * Create worker.
 * @internal
 */
export function workerInit(filename: string, workerData: any): Worker {
    return new Worker(filename, { workerData, execArgv: [] })
}
