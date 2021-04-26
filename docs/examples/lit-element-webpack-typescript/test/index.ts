import * as assert from 'assert';
import { launch } from 'puppeteer';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config.js';

(async () => {
    try {
        const compiler = webpack(webpackConfig);
        const webpackServer = new WebpackDevServer(compiler);
        await new Promise(res => compiler.hooks.done.tap('test', res));
        const server = webpackServer.listen(3001);
        await new Promise(res => server.on('listening', res));
        const browser = await launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:3001`, {waitUntil: 'networkidle2'});
        const div = await page.$('my-element');
        const color = await page.evaluate(el => getComputedStyle(el.shadowRoot.firstElementChild).color, div);
        assert.strictEqual(color, 'rgb(255, 0, 0)',
            'element should be red');
        await browser.close();
        server.close();
    } catch (ex) {
        console.error(ex);
        process.exit(1);
    }
    process.exit(0);
})();
