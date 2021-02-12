import { Options, ExtendedStylesInjectOptions, ModulesOptions } from './lib/options';
import { plugin } from './lib/plugin';

/**
 * Postcss plugin which converts the css code into the es module.
 * @public
 */
export const postcssEsModules = plugin;
export type { Options, ExtendedStylesInjectOptions, ModulesOptions }
