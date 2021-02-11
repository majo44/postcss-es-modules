import { collectStyles } from './collect-styles';
import { CSS_GLOBAL_KEY, CSS_LOCALS_KEY } from './inject-styles';
import { expect } from 'chai';

const key1 = 'key1';
const key2 = 'key2';
const styles1 = 'abc';
const styles2 = 'xyz';
const htmlRegExp = new RegExp(`<style>.*?${styles2}.*?${styles1}</style><script>(.*?)</script>`, 's');

describe('collect-styles', () => {
    it('should collect global styles', () => {
        const collector = collectStyles();
        global[CSS_GLOBAL_KEY] = {
            [key1]: styles1
        };
        expect(collector.raw).contains(styles1);
        expect(collector.ids).eql({
            [key1]: true,
        });
        delete global[CSS_GLOBAL_KEY];
    });
    it('should collect local styles', () => {
        const collector = collectStyles();
        global[CSS_LOCALS_KEY][key1] = styles1;
        expect(collector.raw).contains(styles1);
        expect(collector.ids).eql({
            [key1]: true,
        });
        delete global[CSS_LOCALS_KEY];
    });
    it('should collect local & global styles', () => {
        const collector = collectStyles();
        global[CSS_LOCALS_KEY][key1] = styles1;
        global[CSS_GLOBAL_KEY] = {
            [key2]: styles2
        };
        expect(collector.raw).contains(styles1);
        expect(collector.raw).contains(styles2);
        expect(collector.ids).eql({
            [key1]: true,
            [key2]: true,
        });
        delete global[CSS_LOCALS_KEY];
        delete global[CSS_GLOBAL_KEY];
    });
    it('should deliver html', () => {
        const collector = collectStyles();
        global[CSS_LOCALS_KEY][key1] = styles1;
        global[CSS_GLOBAL_KEY] = {
            [key2]: styles2
        };
        expect(collector.html).match(htmlRegExp);
        const window = {};
        (global as any)['window'] = window;
        eval(collector.html.match(htmlRegExp)[1])
        expect(window[CSS_GLOBAL_KEY]).eql({
            [key1]: true,
            [key2]: true,
        });
        delete (global as any)['window'];
        delete global[CSS_LOCALS_KEY];
        delete global[CSS_GLOBAL_KEY];
    });
});
