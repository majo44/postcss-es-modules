import { expect, use } from 'chai';
import { fake } from 'sinon'
import sinonChai from 'sinon-chai'
import {
    buildInstantStylesStatement, buildLazyStylesStatement, buildOnDemandStylesStatement
} from './styles-statement';
use(sinonChai);

const classMap = {
    'a': 'b'
};

describe('import-statement', () => {

    it('should generate lazy statement', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildLazyStylesStatement(builder, node, classMap, undefined, false, false);
        expect(result).eq('const styles = {\n' +
            '    get [\'a\']() { injectStyles(key, css);  return \'b \'; },\n' +
            '    inject() { injectStyles(key, css); }\n' +
            '};\n');
    });
    it('should generate lazy statement with options', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildLazyStylesStatement(builder, node, classMap, undefined, false, true);
        expect(result).eq('const styles = {\n' +
            '    get [\'a\']() { injectStyles(key, css, options);  return \'b \'; },\n' +
            '    inject() { injectStyles(key, css, options); }\n' +
        '};\n');
    });

    it('should generate lazy statement with attaching original class', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildLazyStylesStatement(builder, node, classMap, undefined, true, false);
        expect(result).eq('const styles = {\n' +
            '    get [\'a\']() { injectStyles(key, css);  return \'b a \'; },\n' +
            '    inject() { injectStyles(key, css); }\n' +
            '};\n');
    });
    it('should generate lazy statement with custom inject statement', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildLazyStylesStatement(builder, node, classMap, 'myInjector(css, key)', false, false);
        expect(result).eq('const styles = {\n' +
            '    get [\'a\']() { myInjector(css, key);  return \'b \'; },\n' +
            '    inject() { myInjector(css, key); }\n' +
            '};\n');
    });
    it('should generate on demand statement', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildOnDemandStylesStatement(builder, node, classMap, undefined, false, false);
        expect(result).eq('const styles = {\n' +
            '    [\'a\']: \'b \',\n' +
            '    inject() { injectStyles(key, css); }\n' +
            '};\n');
    });
    it('should generate on demand statement with custom inject statement', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildOnDemandStylesStatement(builder, node, classMap, 'myInjector(css, key)', false, false);
        expect(result).eq('const styles = {\n' +
            '    [\'a\']: \'b \',\n' +
            '    inject() { myInjector(css, key); }\n' +
            '};\n');
    });
    it('should generate instant statement', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildInstantStylesStatement(builder, node, classMap, undefined, false, false);
        expect(result).eq('const styles = {\n' +
            '    [\'a\']: \'b \',\n' +
            '    inject() { injectStyles(key, css); }\n' +
            '};\n' +
            'styles.inject();\n');
    });
    it('should generate instant statement with custom inject statement', () => {
        let result = '';
        const builder = fake((str) => result += str);
        const node: any = {}
        buildInstantStylesStatement(builder, node, classMap, 'myInjector(css, key)', false, false);
        expect(result).eq('const styles = {\n' +
            '    [\'a\']: \'b \',\n' +
            '    inject() { myInjector(css, key); }\n' +
            '};\n' +
            'styles.inject();\n');
    });
})
