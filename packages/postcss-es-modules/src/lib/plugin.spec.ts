import { expect } from 'chai';
import { StylesCollector, collectStyles } from 'css-es-modules';
import * as cssEsModule from 'css-es-modules';
import { join } from 'path';
import { ModuleKind, transpileModule } from 'typescript';
import { plugin } from './plugin';
import postcss from 'postcss';
import requireFromString from 'require-from-string';
import fsMock from 'mock-fs';
import requireMock from 'mock-require';
import cssnano from 'cssnano';

const rule = '{ color: blue; }';
const css = `.a ${rule}`;
const processorOpt = { from: '/some/path/test.css' };

describe('plugin', () => {

    const checkModule = (
        { collector, module, classes = [], cssRule = rule } :
            { collector?: StylesCollector, module: any, classes?: Array<string>, cssRule?: string }) => {
        // check is rule body within the css
        expect(module.css).contains(cssRule);
        // check is key defined
        expect(module.key).not.undefined;
        // for each class name
        classes.forEach(c => {
            // check is mapped
            const className = module.styles[c];
            expect(className.length).gt(1);
            // check is within the css
            expect(module.css).contains(className.split(' ')[0]);
        })
        // check is collected
        if (collector) {
            // raw have to contain css
            expect(collector.raw).contains(module.css);
            // ids have to contains module key
            expect(collector.ids[module.key]).true;
        }
    }

    it('throw if eject mode but no eject path', async () => {
        try {
            await postcss(
                [plugin({ inject: { script: 'eject' } })]
            ).process(css, processorOpt);
        } catch (ex) {
            expect(ex).not.undefined
            return;
        }
        throw 'Wrong flow';
    });

    it('throw if eject mode but eject relative path', async () => {
        try {
            await postcss(
                [plugin({ inject: { script: 'eject', scriptEjectPath: './' } })]
            ).process(css, processorOpt);
        } catch (ex) {
            expect(ex).not.undefined
            return;
        }
        throw 'Wrong flow';
    });

    it('default options', async () => {
        const pcss = await postcss([plugin()]).process(css, processorOpt);
        const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
        const module = requireFromString(js.outputText);
        checkModule({
            collector: collectStyles(),
            module,
            classes: ['a']
        });
    });

    it('additional comments ', async () => {
        const pcss = await postcss([plugin()]).process(`/* comment */ ${css}`, processorOpt);
        const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
        const module = requireFromString(js.outputText);
        checkModule({
            collector: collectStyles(),
            module,
            classes: ['a']
        });
    });

    it('without css classes', async () => {
        const pcss = await postcss(
            [plugin()]
        ).process('html { color: blue; }', processorOpt);
        const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
        const module = requireFromString(js.outputText);
        const collector = collectStyles();
        module.styles.inject();
        checkModule({ collector, module });
    });

    describe('module', () => {
        it('cjs', async () => {
            const pcss = await postcss(
                [plugin({inject: { moduleType: 'cjs' }})]
            ).process(css, processorOpt);
            const module = requireFromString(pcss.css);
            checkModule({
                collector: collectStyles(),
                module,
                classes: ['a']
            });
        });
        it('cjs ts', async () => {
            const pcss = await postcss(
                [plugin({inject: { moduleType: 'cjs', scriptType: 'ts' }})]
            ).process(css, processorOpt);
            const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
            const module = requireFromString(js.outputText);
            checkModule({
                collector: collectStyles(),
                module,
                classes: ['a']
            });
        });
        it('esm ts', async () => {
            const pcss = await postcss(
                [plugin({inject: { moduleType: 'esm', scriptType: 'ts' }})]
            ).process(css, processorOpt);
            const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
            const module = requireFromString(js.outputText);
            checkModule({
                collector: collectStyles(),
                module,
                classes: ['a']
            });
        });
    });

    describe('injectMode', () => {
        it('none', async () => {
            const pcss = await postcss(
                [plugin({ inject: { injectMode: 'none' } })]
            ).process(css, processorOpt);
            const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
            const module = requireFromString(js.outputText);
            checkModule({ module });
            expect(() => module.styles.inject()).throw();
        });

        it('instant', async () => {
            const pcss = await postcss(
                [plugin({ inject: { injectMode: 'instant' } })]
            ).process(css, processorOpt);
            const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
            const collector = collectStyles();
            expect(collector.raw).eq('');
            const module = requireFromString(js.outputText);
            checkModule({ collector, module, classes: ['a'] });
        });

        it('ondemand', async () => {
            const pcss = await postcss(
                [plugin({ inject: { injectMode: 'ondemand' } })]
            ).process(css, processorOpt);
            const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
            const collector = collectStyles();
            const module = requireFromString(js.outputText);
            expect(collector.raw).eq('');
            module.styles.inject();
            checkModule({ collector, module, classes: ['a'] });
        });
    });

    describe('script', function () {

        it('embed', async () => {
            const pcss = await postcss(
                [plugin({ inject: { script: 'embed' } })]
            ).process(css, processorOpt);
            const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
            const module = requireFromString(js.outputText, '/some/path/test.js');
            checkModule({
                collector: collectStyles(),
                module,
                classes: ['a']
            });
        });

        it('eject', async () => {
            const cssEsModulesPath = join(require.resolve('css-es-modules'), '../../../');
            fsMock({
                '/some/path': {},
                [cssEsModulesPath]: fsMock.load(cssEsModulesPath, { recursive: true, lazy: true})
            });
            const pcss = await postcss(
                [plugin({ inject: { script: 'eject', scriptEjectPath: '/some/path' } })]
            ).process(css, processorOpt);
            const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
            requireMock('/some/path/inject-styles', cssEsModule);
            const module = requireFromString(js.outputText, '/some/path/test.js');
            checkModule({
                collector: collectStyles(),
                module,
                classes: ['a']
            });
            fsMock.restore();
            requireMock.stopAll();
        });

    });

    it('custom inject code', async () => {
        const pcss = await postcss(
            [plugin({ inject: { custom: {
                        importStatement: 'import * as x from "inject-styles"',
                        injectStatement: 'x.injectStyles(key,css)'
                    } } })]
        ).process(css, processorOpt);
        const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
        requireMock('inject-styles', cssEsModule);
        const module = requireFromString(js.outputText, '/some/path/test.js');
        checkModule({
            collector: collectStyles(),
            module,
            classes: ['a']
        });
        requireMock.stopAll();
    });

    it('runtime options', async () => {
        const pcss = await postcss([plugin({
            inject: {
                useNodeGlobal: false
            }
        })]).process(css, processorOpt);
        const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
        const module = requireFromString(js.outputText);
        const collector = collectStyles();
        checkModule({
            module,
            classes: ['a']
        });
        expect(collector.raw).eq('');
    });

    it('with other plugins', async () => {
        const pcss = await postcss([/*postCssSass(),*/ cssnano(), plugin()]).process(css, processorOpt);
        const js = transpileModule(pcss.css, {compilerOptions: {module: ModuleKind.CommonJS}});
        const module = requireFromString(js.outputText);
        checkModule({
            collector: collectStyles(),
            module,
            classes: ['a'],
            cssRule: '{color:#00f}'
        });
    }).timeout(5000);
});
