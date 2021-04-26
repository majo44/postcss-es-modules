import requireMock from 'mock-require';
import { Worker } from "worker_threads";
import { expect } from 'chai';
import { defaultPostCssNodeExtensions } from '../src/lib/options';

// mocking workerInit as Worker cant be directly init from ts code
requireMock('../src/lib/worker-init', {
    workerInit: (filename: string, workerData: any) => {
        workerData.__filename = filename.replace('.js', '.ts');
        return new Worker(`
            const wk = require('worker_threads');
            require('ts-node').register();
            let file = wk.workerData.__filename;
            delete wk.workerData.__filename;
            require(file);
        `, { eval: true, workerData, execArgv: [] }
        )
    }
});


describe('postcss-node', () => {
    let orgHandlers;

    beforeEach(async () => {
        orgHandlers = defaultPostCssNodeExtensions.map(x => require.extensions[x]);
    });

    afterEach(async () => {
        defaultPostCssNodeExtensions.forEach((x, i) => require.extensions[x] = orgHandlers[i]);
    });

    it('should properly transform multiple css modules in sync flow', async () => {
        const { register } = await import('../src/lib/register');
        register();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        let { styles, css, key} = require('./test1.css');
        expect(styles.a.length).gt(0);
        expect(css).contains('blue');
        expect(key.length).gt(0);

        ({ styles, css, key}  = require('./test2.css'));
        expect(styles.a.length).gt(0);
        expect(css).contains('red');
        expect(key.length).gt(0);
    });

    it('should properly transform multiple css modules in async flow', async () => {
        const { register } = await import('../src/lib/register');
        register();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        let { styles, css, key} = require('./test1.css');
        expect(styles.a.length).gt(0);
        expect(css.length).gt(0);
        expect(key.length).gt(0);

        await new Promise(res => setTimeout(res, 1));
        ({ styles, css, key}  = require('./test2.css'));
        expect(styles.a.length).gt(0);
        expect(css.length).gt(0);
        expect(key.length).gt(0);
    })

    it('should throw error on wrong css syntax', async () => {
        const { register } = await import('../src/lib/register');
        register();
        expect(() => require('./test3.css')).throw;
    });


    it('should throw error on wrong postcss config syntax', async () => {
        process.env.TEST_ERROR_CASE = "true";
        const { register } = await import('../src/lib/register');
        register();
        expect(() => require('./test1.css')).throw;
        delete process.env.TEST_ERROR_CASE;
    });

    it('should support custom extensions', async () => {
        const { register } = await import('../src/lib/register');
        register(['.bcss'], 1000, 512);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { styles, css, key} = require('./test4.bcss');
        expect(styles.a.length).gt(0);
        expect(css.length).gt(0);
        expect(key.length).gt(0);
    });

    it('should support custom extensions by env', async () => {
        process.env.POSTCSS_NODE_EXT = '.ccss';
        const { register } = await import('../src/lib/register');
        register();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { styles, css, key} = require('./test4.ccss');
        expect(styles.a.length).gt(0);
        expect(css.length).gt(0);
        expect(key.length).gt(0);
        delete process.env.POSTCSS_NODE_EXT;
    });

    it('should support custom timeout by env', async () => {
        process.env.POSTCSS_NODE_TIMEOUT = '0';
        const { register } = await import('../src/lib/register');
        register();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        expect(() => require('./test5.css')).throw('Worker timeout');
        delete process.env.POSTCSS_NODE_TIMEOUT;
    });

    it('should support custom buffer size by env', async () => {
        process.env.POSTCSS_NODE_BUFFER_SIZE = '1';
        const { register } = await import('../src/lib/register');
        register();
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        expect(() => require('./test6.css')).throw('"length" is outside of buffer bounds');
        delete process.env.POSTCSS_NODE_BUFFER_SIZE;
    });
})
