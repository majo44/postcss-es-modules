import { expect } from 'chai';
import { existsSync, readFileSync } from 'fs';
import fsMock from 'mock-fs';
import { join } from 'path';
import { eject } from './eject';

describe('eject', () => {
    beforeEach(() => {
        const cssEsModulesPath = join(require.resolve('css-es-modules'), '../../../');
        fsMock({
            '/some/path': {},
            '/some/pathWithFiles': {
                'inject-styles.ts': 'file1',
                'collect-styles.ts': 'file2'
            },
            [cssEsModulesPath]: fsMock.load(cssEsModulesPath, { recursive: true, lazy: true})
        });
    });
    afterEach(() => {
        fsMock.restore();
    })

    it('should eject ts code', async () => {
        await eject({ modules: {}, inject: { scriptType: 'ts', script: 'eject', scriptEjectPath: '/some/path' }});
        expect(existsSync('/some/path/inject-styles.ts')).true
        expect(existsSync('/some/path/collect-styles.ts')).true
    });

    it('should eject js code', async () => {
        await eject({ modules: {}, inject: { scriptType: 'js', script: 'eject', scriptEjectPath: '/some/path' }});
        expect(existsSync('/some/path/inject-styles.js')).true
        expect(existsSync('/some/path/collect-styles.js')).true
    });

    it('should eject js esm code', async () => {
        await eject({ modules: {}, inject: { scriptType: 'js', script: 'eject', moduleType: 'esm', scriptEjectPath: '/some/path' }});
        expect(existsSync('/some/path/inject-styles.js')).true
        expect(existsSync('/some/path/collect-styles.js')).true
    });

    it('should eject just once code', async () => {
        await Promise.all([
            eject({ modules: {}, inject: { scriptType: 'ts', script: 'eject', scriptEjectPath: '/some/path' }}),
            eject({ modules: {}, inject: { scriptType: 'ts', script: 'eject', scriptEjectPath: '/some/path' }})
        ]);
        expect(existsSync('/some/path/inject-styles.ts')).true
        expect(existsSync('/some/path/collect-styles.ts')).true
    });

    it('should not overwrite', async () => {
        await eject({ modules: {}, inject: { scriptType: 'ts', script: 'eject', scriptEjectPath: '/some/pathWithFiles' }});
        expect(readFileSync('/some/pathWithFiles/inject-styles.ts').toString('utf-8')).eq('file1');
        expect(readFileSync('/some/pathWithFiles/collect-styles.ts').toString('utf-8')).eq('file2');
    });
});

