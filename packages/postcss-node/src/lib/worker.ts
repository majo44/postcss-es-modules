/* istanbul ignore file */
import postcss, { ProcessOptions, Processor } from 'postcss';
import postcssrc from 'postcss-load-config';
import { parentPort } from 'worker_threads';
import { workerFunction } from './worker-function';

let processOptions: ProcessOptions;
let processor: Processor;

parentPort?.on('message', (data) => {
    const { code, filename } = data;
    workerFunction(
        async () => {
            if (!processor) {
                const { plugins, options } = postcssrc.sync({});
                processOptions = options;
                processor = postcss(plugins);
            }
            const result = await processor.process(code, {
                ...processOptions,
                from: filename
            });
            return  result.css;
        });
});

