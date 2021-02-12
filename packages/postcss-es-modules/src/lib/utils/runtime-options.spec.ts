import { expect } from 'chai';
import { defaultStylesInjectOptions } from 'css-es-modules';
import { prepareRuntimeOptions } from './runtime-options';

describe('runtime-options', () => {
    it ('should return undefined for inject undefined', () => {
        const options = prepareRuntimeOptions({ inject: undefined, modules: undefined});
        expect(options).undefined;
    });
    it ('should return undefined for inject default', () => {
        const options = prepareRuntimeOptions({ inject: defaultStylesInjectOptions, modules: undefined});
        expect(options).undefined;
    });
    it ('should return options if on of options is set', () => {
        const options = prepareRuntimeOptions({ inject: { useConstructableStylesheet: false}, modules: undefined});
        expect(options).eql({
            useConstructableStylesheet: false
        });
    });
});
