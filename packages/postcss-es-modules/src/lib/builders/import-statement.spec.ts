import { expect, use } from 'chai';
import { fake } from 'sinon'
import sinonChai from 'sinon-chai'
import { buildImportInjectStylesStatement } from './import-statement';
use(sinonChai);


describe('import-statement', () => {
    it('without params, should generate esm import', () => {
        const builder = fake();
        const node: any = {}
        buildImportInjectStylesStatement(node, builder);
        expect(builder).calledWith('import { injectStyles } from \'css-es-modules\';',node);
    });
    it('should generate cjs import', () => {
        const builder = fake();
        const node: any = {}
        buildImportInjectStylesStatement(node, builder, { moduleType: 'cjs' });
        expect(builder).calledWith('const { injectStyles } = require(\'css-es-modules\');',node);
    });

    it('should generate relative import if eject sibling', () => {
        const builder = fake();
        const node: any = { source: { input: { file: '/a/b/d/a.js'}}}
        buildImportInjectStylesStatement(node, builder, { scriptEjectPath: '/a/b/c', script: 'eject' });
        expect(builder).calledWith('import { injectStyles } from \'../c/inject-styles\';', node);
    });

    it('should generate relative import if eject down', () => {
        const builder = fake();
        const node: any = { source: { input: { file: '/a/b/d/a.js'}}}
        buildImportInjectStylesStatement(node, builder, { scriptEjectPath: '/a/b', script: 'eject' });
        expect(builder).calledWith('import { injectStyles } from \'../inject-styles\';', node);
    });

    it('should generate relative import if eject up', () => {
        const builder = fake();
        const node: any = { source: { input: { file: '/a/b/c/a.js'}}}
        buildImportInjectStylesStatement(node, builder, { scriptEjectPath: '/a/b/c/d', script: 'eject' });
        expect(builder).calledWith('import { injectStyles } from \'./d/inject-styles\';', node);
    });

    it('should generate relative import if eject to same dir', () => {
        const builder = fake();
        const node: any = { source: { input: { file: '/a/b/c/a.js'}}}
        buildImportInjectStylesStatement(node, builder, { scriptEjectPath: '/a/b/c', script: 'eject' });
        expect(builder).calledWith('import { injectStyles } from \'./inject-styles\';', node);
    });
})
