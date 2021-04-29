import { isAbsolute } from 'path';
import postcss, { Plugin, Result, Root } from 'postcss';
import { eject } from './eject';
import { defaultOptions, Options } from './options';
import { createStringify } from './stringify';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import postcssModules from 'postcss-modules';

/**
 * Postcss to es module plugin.
 * @internal
 */
export const plugin = (options: Options = {}): Plugin => {
    let ejected = false;

    // prepare options
    const opts = {
        modules: {...defaultOptions.modules, ...options.modules},
        inject: {...defaultOptions.inject, ...options.inject}
    };

    // return plugin body
    return {
        postcssPlugin: 'postcss-es-modules',
        Once: async (css, { result }) => {
            // validate options
            if (options.inject?.script === 'eject' && !ejected) {
                ejected = true;
                if (!options.inject.scriptEjectPath) {
                    throw 'The \'eject\' loader.script options requires also to set loader.scriptEjectPath.' +
                    'Please provide the path where the loader have to be ejected.';
                } else if (!isAbsolute(options.inject.scriptEjectPath)) {
                    throw 'The loader.scriptEjectPath has to be absolute path.';
                } else {
                    await eject(opts);
                }
            }

            // if no opts, create them
            /* istanbul ignore if */
            if (!result.opts) {
                result.opts = {};
            }
            // set custom stringifier
            result.opts.stringifier = createStringify(opts)
            // process css by the postcss-modules
            await postcss(postcssModules({
                ...options.modules,
                getJSON: (cssFileName: string, map: Record<string, string>) => {
                    // so we are adding the comment with modules map
                    css.append(postcss.comment({text: 'modules-map:' + JSON.stringify(map)}));
                }
            })).process(css, {from: result.opts.from});
        }
    };
};
