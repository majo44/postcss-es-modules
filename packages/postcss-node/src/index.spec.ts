import requireMock from 'mock-require';
import { Worker } from "worker_threads";

// mocking create-worker as Worker cant be directly init from ts code
const workerTs = (file: string, workerData: any) => {
    workerData.__filename = file;
    return new Worker(`
            const wk = require('worker_threads');
            require('ts-node').register();
            let file = wk.workerData.__filename;
            delete wk.workerData.__filename;
            require(file);
        `,
        { eval: true, workerData, execArgv: [] }
    );
}

function createWorker(filename: string, workerData: any) {
    filename = filename.replace('.js', '.ts');
    return workerTs(filename, workerData)
}

requireMock('./create-worker', {
    createWorker
});


describe('postcss-node', () => {
    let orgHandlers;

    beforeEach(async () => {
        const { defaultPostCssNodeExtensions } = await import('./index');
        orgHandlers = defaultPostCssNodeExtensions.map(x => require.extensions[x]);

    });

    afterEach(async () => {
        const { defaultPostCssNodeExtensions } = await import('./index');
        defaultPostCssNodeExtensions.forEach((x, i) => require.extensions[x] = orgHandlers[i]);
    });

    it('', async () => {
        const { register } = await import('./index');
        register();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require('./mock/test.css');
        console.log(module);
    })
})