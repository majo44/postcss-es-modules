import {Worker} from "worker_threads";

export function createWorker(filename: string, workerData: any) {
    return new Worker(filename, { workerData, execArgv: [] })
}