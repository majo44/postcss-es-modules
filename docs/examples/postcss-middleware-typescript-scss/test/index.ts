import * as assert from 'assert';
import { launch } from 'puppeteer';
import { server } from '../src/index-server';

(async () => {
    try {
        await new Promise(res => server.on('listening', res));
        const browser = await launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:3001`, {waitUntil: 'networkidle2'});
        const div = await page.$('div');
        const color = await page.evaluate(el => getComputedStyle(el).color, div);
        assert.strictEqual(color, 'rgb(255, 0, 0)',
            'div should be blue');
        await browser.close();
        server.close();
    } catch (ex) {
        console.error(ex);
        process.exit(1);
    }
    process.exit(0);
})();
