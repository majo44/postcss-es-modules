import { defaultStylesInjectOptions } from 'css-es-modules';
import { ExtendedStylesInjectOptions, Options } from '../options';

/**
 * Options for runtime type.
 */
export type RuntimeOptions = Pick<ExtendedStylesInjectOptions, typeof runtimeOptionsKeys[number]>;

/**
 * Keys of runtime options.
 */
const runtimeOptionsKeys =
    ['useNounce', 'useConstructableStylesheet', 'useStyleTag', 'useNodeGlobal'] as const;

/**
 * Preparing runtime options
 */
export const prepareRuntimeOptions = (options: Required<Options>): RuntimeOptions | undefined => {
    const loaderOptions = options.inject;
    let runtimeOptions: RuntimeOptions | undefined;
    if (loaderOptions) {
        let hasModifiedOptions = false;
        runtimeOptions = runtimeOptionsKeys.reduce((r, i) => {
            if (loaderOptions[i] !== undefined && loaderOptions[i] !== defaultStylesInjectOptions[i]) {
                hasModifiedOptions = true;
                return {
                    ...r,
                    [i]: loaderOptions[i]
                };
            }
            return r;
        }, {} as RuntimeOptions);
        if (!hasModifiedOptions) {
            runtimeOptions = undefined;
        }
    }
    return runtimeOptions;
};
