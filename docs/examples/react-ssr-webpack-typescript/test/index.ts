import * as assert from 'assert';
import { launch, Page } from 'puppeteer';
import { server } from '../dist/index-server';

const getColorOfElement = async (page: Page, selector: string) => {
    const element = await page.$(selector);
    return page.evaluate(el => getComputedStyle(el).color, element);
}

const getAdoptedStyleSheetsCount = async (page: Page) =>
    page.evaluate(() => document['adoptedStyleSheets'].length);


const getStyleTag = async (page: Page) => {
    const styles = await page.$('style');
    return page.evaluate(el => [
        el.sheet.rules.length,
        el.sheet.rules[0]?.style?.color,
        el.sheet.rules[1]?.style?.color
    ], styles);
};


(async () => {
    try {
        // running server
        await new Promise(res => server.on('listening', res));

        // prepare browser
        const browser = await launch();
        const page = await browser.newPage();

        // testing of ssr of aComponent and csr of bComponent

        await page.goto(`http://localhost:3001`, {waitUntil: 'networkidle2'});

        assert.deepStrictEqual(await getStyleTag(page), [1, 'blue', null],
            'styles only for aComponent on the page');

        assert.strictEqual(await getColorOfElement(page, 'div#aComponent'), 'rgb(0, 0, 255)',
            'aComponent is blue');

        assert.strictEqual(await getAdoptedStyleSheetsCount(page), 0,
            'no adoptedStyleSheets as styles prerendered');

        // opening second component
        const button = await page.$('button');
        await button.click();

        assert.strictEqual(await getAdoptedStyleSheetsCount(page), 1,
            'added adoptedStyleSheets');

        assert.strictEqual(await getColorOfElement(page, 'div#bComponent'), 'rgb(255, 0, 0)',
            'bComponent is red');


        // testing of ssr of aComponent and bComponent

        await page.goto(`http://localhost:3001?showBComponent=true`, {waitUntil: 'networkidle2'});

        assert.deepStrictEqual(await getStyleTag(page), [2, 'blue', 'red'],
            'styles for aComponent and bComponent are on the page');

        assert.strictEqual(await getColorOfElement(page, 'div#aComponent'), 'rgb(0, 0, 255)',
            'aComponent is blue');

        assert.strictEqual(await getColorOfElement(page, 'div#bComponent'), 'rgb(255, 0, 0)',
            'bComponent is red');

        assert.strictEqual(await getAdoptedStyleSheetsCount(page), 0,
            'no adoptedStyleSheets as styles prerendered');

        await browser.close();
        server.close();
    } catch (ex) {
        console.error(ex);
        process.exit(1);
    }
    process.exit(0);
})();
