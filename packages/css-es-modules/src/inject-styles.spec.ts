import { expect } from 'chai';
import * as jsdom from 'jsdom';
import { CSS_GLOBAL_KEY, CSS_LOCALS_KEY, injectStyles } from './inject-styles';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            window: Window;
            document: Document;
        }
    }
    // eslint-disable-next-line no-var
    var global: NodeJS.Global & typeof globalThis;
}


const key1 = 'key1';
const styles1 = '.a {color: red;}';
const styles2 = '.b {color: blue;}';

describe('inject-styles', () => {
    describe('on server side', () => {

        afterEach(() => {
            delete global[CSS_GLOBAL_KEY];
            delete global[CSS_LOCALS_KEY];
        });

        it('should inject styles to the globals on the server', () => {
            injectStyles(key1, styles1);
            expect(global[CSS_GLOBAL_KEY][key1]).eql(styles1);
            expect(global[CSS_LOCALS_KEY]).undefined;
        });
        it('should inject styles to the locals on the server', () => {
            global[CSS_LOCALS_KEY] = {};
            injectStyles(key1, styles1);
            expect(global[CSS_LOCALS_KEY][key1]).eql(styles1);
            expect(global[CSS_GLOBAL_KEY]).undefined;
        });
        it('should not inject styles to the globals on the server if already injected', () => {
            global[CSS_GLOBAL_KEY] = {
                [key1]: styles1
            };
            injectStyles(key1, styles2);
            expect(global[CSS_GLOBAL_KEY][key1]).eql(styles1);
            expect(global[CSS_LOCALS_KEY]).undefined;
        });
        it('should not inject styles on the server if node globals disabled', () => {
            injectStyles(key1, styles2, { useNodeGlobal: false });
            expect(global[CSS_GLOBAL_KEY]).undefined;
            expect(global[CSS_LOCALS_KEY]).undefined;
        });
        it('should not inject styles to the locals on the server if already injected', () => {
            global[CSS_LOCALS_KEY] = {
                [key1]: styles1
            };
            injectStyles(key1, styles2);
            expect(global[CSS_LOCALS_KEY][key1]).eql(styles1);
            expect(global[CSS_GLOBAL_KEY]).undefined;
        });
    });

    describe('on browser side', () => {

        beforeEach(() => {
            const dom = new jsdom.JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
            (global as any).window = dom.window;
            (global as any).document = dom.window.document;
        });

        afterEach(() => {
            delete (global as any).window;
        });

        describe('with style tag', () => {
            it('should inject styles', async () => {
                injectStyles(key1, styles1, undefined, false);
                expect(window[CSS_GLOBAL_KEY][key1]).eq(true);
                expect((window.document.querySelector('style').childNodes[0] as Text).nodeValue).eql(styles1);
            });

            it('should inject styles only once', async () => {
                injectStyles(key1, styles1, undefined, false);
                injectStyles(key1, styles2, undefined, false);
                expect(window[CSS_GLOBAL_KEY][key1]).eq(true);
                expect((window.document.querySelector('style').childNodes[0] as Text).nodeValue).eql(styles1);
            });

            it('should not inject styles if style tag are disabled', async () => {
                injectStyles(key1, styles1, { useStyleTag: false }, false);
                expect(window[CSS_GLOBAL_KEY][key1]).eq(true);
                expect(window.document.querySelector('style')).eql(null);
            });

            it('should not inject styles if style tag disabled and constructable stylesheet are ', async () => {
                injectStyles(key1, styles1, { useStyleTag: false, useConstructableStylesheet: false}, false);
                expect(window[CSS_GLOBAL_KEY]).undefined;
                expect(window.document.querySelector('style')).eql(null);
            });

            it('should use nounce', async () => {
                injectStyles(key1, styles1, { useNounce: '123' }, false);
                expect(window.document.querySelector('style').getAttribute('nounce')).eql('123');
            });
        });

        describe('with constructableStylesheet', () => {

            beforeEach(() => {
                window.CSSStyleSheet.prototype.replace = async function (this: CSSStyleSheet, ctn: string) {
                    const styleElement: HTMLStyleElement = document.createElement('style');
                    styleElement.innerHTML = ctn;
                    window.document.head.appendChild(styleElement);
                    Array.from(styleElement.sheet.cssRules)
                        .map(r => r.cssText)
                        .forEach(this.insertRule.bind(this));
                    styleElement.remove();
                    return this;
                }
                document.adoptedStyleSheets = [];
                global.CSSStyleSheet = window.CSSStyleSheet;
            });

            afterEach(() => {
                 delete window.CSSStyleSheet.prototype.replace;
                 delete document.adoptedStyleSheets;
                 delete global.CSSStyleSheet;
            });

            it ('should inject styles', () => {
                injectStyles(key1, styles1, undefined, false);
                expect(window[CSS_GLOBAL_KEY][key1]).eq(true);
                expect(document.adoptedStyleSheets[0].toString()).eq(styles1 + '\n');
            });

            it('should inject styles only once', async () => {
                injectStyles(key1, styles1, undefined, false);
                injectStyles(key1, styles2, undefined, false);
                expect(window[CSS_GLOBAL_KEY][key1]).eq(true);
                expect(document.adoptedStyleSheets[0].toString()).eq(styles1 + '\n');
            });

            it('should use styleTag fallback if disabled', async () => {
                injectStyles(key1, styles1, { useConstructableStylesheet: false }, false);
                expect(window[CSS_GLOBAL_KEY][key1]).eq(true);
                expect(document.adoptedStyleSheets.length).eq(0);
                expect((window.document.querySelector('style').childNodes[0] as Text).nodeValue).eql(styles1);
            });
        })

    });

})
