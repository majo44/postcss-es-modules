import postcss from 'postcss';
import { Options, ExtendedStylesInjectOptions, ModulesOptions } from './lib/options';
import { plugin } from './lib/plugin';

/**
 * Postcss plugin which converts the css code into the es module.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postcssEsModules = postcss.plugin<Options>('postcss-es-modules', plugin as any);
export type { Options, ExtendedStylesInjectOptions, ModulesOptions }
